import { authOptions } from "@/lib/auth";
import { db, dbReady } from "@repo/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { TransactionHistory } from "@/components/TransactionHistory";

export default async function TransactionsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  await dbReady;

  const userId = Number(session.user.id);

  const [bankTransactions, sent, received] = await Promise.all([
    db.orm.public.OnRampTransaction
      .where({ userId })
      .all(),

    db.orm.public.p2pTransfer
      .where({ fromUserId: userId })
      .all(),

    db.orm.public.p2pTransfer
      .where({ toUserId: userId })
      .all(),
  ]);

  const transactions = [
    ...bankTransactions.map((txn) => ({
      id: `bank-${txn.id}`,
      type: "bank" as const,
      description: "Received INR",
      amount: txn.amount,
      timestamp: new Date(
        txn.startTime.epochMilliseconds
      ).toISOString(),
      status: txn.status,
    })),

    ...sent.map((txn) => ({
      id: `p2p-sent-${txn.id}`,
      type: "p2p" as const,
      description: "Sent INR",
      amount: -txn.amount,
      timestamp: new Date(
        txn.timestamp.epochMilliseconds
      ).toISOString(),
      status: "Success",
    })),

    ...received.map((txn) => ({
      id: `p2p-received-${txn.id}`,
      type: "p2p" as const,
      description: "Received INR",
      amount: txn.amount,
      timestamp: new Date(
        txn.timestamp.epochMilliseconds
      ).toISOString(),
      status: "Success",
    })),
  ].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() -
      new Date(a.timestamp).getTime()
  );

  return (
    <div className="w-full">
      <div className="mb-8 pt-8 text-4xl font-bold text-[#6a51a6]">
        Transactions
      </div>

      <TransactionHistory transactions={transactions} />
    </div>
  );
}
