
import { Card } from "@repo/ui/card";

export const OnRampTransactions = ({
  transactions,
}: {
  transactions: {
    id: number;
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
      <div className="space-y-4 pt-2">
        {transactions.map((transaction) => {
          const isProcessing = transaction.status === "Processing";
          const isSuccess = transaction.status === "Success";
          const isFailure = transaction.status === "Failure";

          return (
            <div
              key={transaction.id}
              className="flex justify-between gap-4"
            >
              <div>
                <div className="text-sm">
                  {isProcessing
                    ? "Money Transfer Processing"
                    : isFailure
                      ? "Money Transfer Failed"
                      : "Received INR"}
                </div>

                <div className="text-xs text-slate-600">
                  {transaction.time.toDateString()}
                </div>

                <div
                  className={`mt-1 text-xs font-medium ${
                    isProcessing
                      ? "text-amber-600"
                      : isFailure
                        ? "text-red-600"
                        : "text-green-600"
                  }`}
                >
                  {transaction.status}
                </div>
              </div>

              <div className="flex flex-col justify-center whitespace-nowrap">
                {isFailure ? "" : "+"} Rs{" "}
                {(transaction.amount / 100).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
