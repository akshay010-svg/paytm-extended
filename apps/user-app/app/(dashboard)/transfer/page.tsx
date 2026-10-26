import { db, dbReady } from "@repo/db";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

async function getBalance(userId: number) {
  const balance = await db.orm.public.Balance
    .where({ userId })
    .first();

  return {
    amount: balance?.amount || 0,
    locked: balance?.locked || 0,
  };
}

async function getOnRampTransactions(userId: number) {
  const transactions = await db.orm.public.OnRampTransaction
    .where({ userId })
    .orderBy((t) => t.startTime.desc())
    .all();

  return transactions.slice(0, 5).map((transaction) => ({
    id: transaction.id,
    time: new Date(transaction.startTime.epochMilliseconds),
    amount: transaction.amount,
    status: transaction.status,
    provider: transaction.provider,
  }));
}

export default async function TransferPage() {
  await dbReady;

  const session = await getServerSession(authOptions);

  const userId = Number(session?.user?.id);

  const [balance, transactions] = userId
    ? await Promise.all([
        getBalance(userId),
        getOnRampTransactions(userId),
      ])
    : [
        { amount: 0, locked: 0 },
        [],
      ];

  return (
    <div className="w-full">
      <div className="mb-8 pt-8 text-4xl font-bold text-[#6a51a6]">
        Bank Transfer
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        <div>
          <AddMoney />
        </div>

        <div className="space-y-4">
          <BalanceCard
            amount={balance.amount}
            locked={balance.locked}
          />

          <OnRampTransactions transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
