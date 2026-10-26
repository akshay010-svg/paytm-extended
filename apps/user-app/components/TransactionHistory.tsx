"use client";

import { useMemo, useState } from "react";
import { Card } from "@repo/ui/card";

type Transaction = {
  id: string;
  type: "bank" | "p2p";
  description: string;
  amount: number;
  timestamp: string;
  status: string;
};

export function TransactionHistory({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [type, setType] = useState("all");
  const [range, setRange] = useState("30");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredTransactions = useMemo(() => {
    const now = new Date();

    return transactions.filter((txn) => {
      if (type !== "all" && txn.type !== type) {
        return false;
      }

      const date = new Date(txn.timestamp);

      if (range === "7") {
        const cutoff = new Date(now);
        cutoff.setDate(cutoff.getDate() - 7);

        if (date < cutoff || date > now) return false;
      }

      if (range === "30") {
        const cutoff = new Date(now);
        cutoff.setDate(cutoff.getDate() - 30);

        if (date < cutoff || date > now) return false;
      }

      if (range === "custom") {
        if (startDate) {
          const start = new Date(`${startDate}T00:00:00`);
          if (date < start) return false;
        }

        if (endDate) {
          const end = new Date(`${endDate}T23:59:59.999`);
          if (date > end) return false;
        }
      }

      return true;
    });
  }, [transactions, type, range, startDate, endDate]);

  return (
    <div className="space-y-6">
      <Card title="Filters">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Transaction type
            </label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white p-3"
            >
              <option value="all">All transactions</option>
              <option value="p2p">P2P transfers</option>
              <option value="bank">Bank transfers</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Date range
            </label>

            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white p-3"
            >
              <option value="all">All time</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="custom">Custom range</option>
            </select>
          </div>
        </div>

        {range === "custom" && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                From
              </label>
              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                To
              </label>
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-3"
              />
            </div>
          </div>
        )}
      </Card>

      <Card title="Transaction History">
        <div className="mb-4 text-sm text-slate-500">
          {filteredTransactions.length} transaction(s)
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="pb-8 pt-8 text-center text-slate-500">
            No transactions found for these filters.
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {filteredTransactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-0"
              >
                <div>
                  <div className="text-sm font-medium">
                    {txn.description}
                  </div>

                  <div className="text-xs text-slate-600">
                    {txn.type === "p2p" ? "P2P" : "Bank"}
                    {" · "}
                    {new Date(txn.timestamp).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    Status: {txn.status}
                  </div>
                </div>

                <div
                  className={
                    txn.amount >= 0
                      ? "whitespace-nowrap font-medium text-green-600"
                      : "whitespace-nowrap font-medium text-red-600"
                  }
                >
                  {txn.amount >= 0 ? "+" : "-"} Rs{" "}
                  {(Math.abs(txn.amount) / 100).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
