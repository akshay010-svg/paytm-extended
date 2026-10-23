"use server";

import { db, dbReady } from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { Temporal } from "@js-temporal/polyfill";
Object.assign(globalThis, { Temporal });

export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;

    if (!from) {
        return { message: "Error while sending" };
    }

    if (!Number.isSafeInteger(amount) || amount <= 0) {
        return { message: "Invalid amount" };
    }

    await dbReady;

    const senderId = Number(from);

    const toUser = await db.orm.public.User
        .where({ number: to })
        .first();

    if (!toUser) {
        return { message: "User not found" };
    }

    if (toUser.id === senderId) {
        return { message: "Cannot transfer to yourself" };
    }

    try {
        await db.transaction(async (tx) => {
            // Lock the sender's balance before checking the amount.
            const fromBalance = await tx.orm.public.Balance
                .where({ userId: senderId })
                .forUpdate()
                .first();

            if (!fromBalance || fromBalance.amount < amount) {
                throw new Error("Insufficient funds");
            }

            const toBalance = await tx.orm.public.Balance
                .where({ userId: toUser.id })
                .forUpdate()
                .first();

            if (!toBalance) {
                throw new Error("Recipient balance not found");
            }

            await tx.orm.public.Balance
                .where({ userId: senderId })
                .update({ amount: fromBalance.amount - amount });

            await tx.orm.public.Balance
                .where({ userId: toUser.id })
                .update({ amount: toBalance.amount + amount });

            await tx.orm.public.p2pTransfer.create({
                amount,
                timestamp: Temporal.Now.instant(),
                fromUserId: senderId,
                toUserId: toUser.id,
            });
        });

        return { message: "Transfer successful" };
    } catch (error) {
        console.error("P2P transfer failed:", error);

        return {
            message:
                error instanceof Error
                    ? error.message
                    : "Error while sending",
        };
    }
}
