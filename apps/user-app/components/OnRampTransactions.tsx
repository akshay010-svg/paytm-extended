import { Card } from "@repo/ui/card";

export const OnRampTransactions = ({
  transactions,
}: {
  transactions: {
    time: Date;
    amount: number;
    status: string;
    provider: string;
  }[];
}) => {
  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="pb-8 pt-8 text-center">
          No Recent transactions
        </div>
      </Card>
    );
  }

  return (
    <Card title="Recent Transactions">
      <div className="pt-2">
        {transactions.map((transaction) => (
          <div
            key={`${transaction.time.toISOString()}-${transaction.provider}-${transaction.amount}`}
            className="flex justify-between"
          >
            <div>
              <div className="text-sm">Received INR</div>
              <div className="text-xs text-slate-600">
                {transaction.time.toDateString()}
              </div>
            </div>

            <div className="flex flex-col justify-center">
              + Rs {transaction.amount / 100}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
