import { Card } from "@repo/ui/card";
import { getP2PTransactions } from "../lib/actions/p2pTransactions";

export const P2PTransactions = async () => {
  const transactions = await getP2PTransactions();

  if (!transactions.length) {
    return (
      <Card title="Recent P2P Transactions">
        <div className="pb-8 pt-8 text-center">
          No Recent transactions
        </div>
      </Card>
    );
  }

  return (
    <Card title="Recent P2P Transactions">
      <div className="pt-2">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex justify-between pb-3"
          >
            <div>
              <div className="text-sm">
                {transaction.type === "received"
                  ? "Received INR"
                  : "Sent INR"}
              </div>

              <div className="text-xs text-slate-600">
                {transaction.timestamp.toLocaleString("en-IN", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "Asia/Kolkata",
                })}
              </div>
            </div>

            <div className="flex flex-col justify-center">
              {transaction.type === "received" ? "+" : "-"} Rs{" "}
              {transaction.amount / 100}
            </div>
          </div>
        )).slice(0,5)}
      </div>
    </Card>
  );
};