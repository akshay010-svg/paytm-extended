"use server";

import { db, dbReady } from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { Temporal } from "@js-temporal/polyfill";

Object.assign(globalThis, { Temporal });

export async function createOnRampTransaction(
  provider: string,
  amount: number
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { message: "Unauthenticated request" };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { message: "Invalid amount" };
  }

  await dbReady;

  const token = (Math.random() * 1000).toString();

  await db.orm.public.OnRampTransaction.create({
    provider,
    status: "Processing",
    startTime: Temporal.Now.instant(),
    token,
    userId: Number(session.user.id),
    amount: Math.round(amount * 100),
  });

  return { message: "Done" };
}
