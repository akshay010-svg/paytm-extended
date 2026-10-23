"use server";

import { db, dbReady } from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { Temporal } from "@js-temporal/polyfill";
Object.assign(globalThis, { Temporal });

export async function getP2PTransactions() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return [];
    }

    await dbReady;

    const userId = Number(session.user.id);

    const sent = await db.orm.public.p2pTransfer
        .where({ fromUserId: userId })
        .orderBy((t) => t.timestamp.desc())
        .all();

    const received = await db.orm.public.p2pTransfer
        .where({ toUserId: userId })
        .orderBy((t) => t.timestamp.desc())
        .all();

    return [
        ...sent.map((txn) => ({
            ...txn,
            type: "sent" as const,
        })),
        ...received.map((txn) => ({
            ...txn,
            type: "received" as const,
        })),
    ].sort(
        (a, b) =>
            Temporal.Instant.compare(b.timestamp, a.timestamp)
    ).slice(0, 5);
}