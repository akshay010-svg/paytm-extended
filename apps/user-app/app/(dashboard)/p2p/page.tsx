import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../lib/auth";
import { db, dbReady } from "@repo/db";

import { SendCard } from "../../../components/SendCard";
import { P2PTransactions } from "../../../components/P2PTransactions";
import { BalanceCard } from "../../../components/BalanceCard";

export default async function P2PPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  await dbReady;

  const balance = await db.orm.public.Balance
    .where({ userId: Number(session.user.id) })
    .first();

  return (
    <div className="w-full">
      <div className="mb-8 pt-8 text-4xl font-bold text-[#6a51a6]">
        P2P Transfer
      </div>

      <div className="grid grid-cols-1 items-stretch gap-5 p-4 md:grid-cols-2">
        <div className="min-w-0">
          <SendCard />
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <BalanceCard
            amount={balance?.amount ?? 0}
            locked={balance?.locked ?? 0}
          />
          <P2PTransactions />
        </div>
      </div>
    </div>
  );
}