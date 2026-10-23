"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/textinput";
import { p2pTransfer } from "../lib/actions/p2pTransfer";
import { useRouter } from "next/navigation";

export function SendCard() {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const router = useRouter();

  return (
    <div className="h-full w-full">
      <Card title="Send">
        <div className="min-w-72 pt-4 pb-4">
          <TextInput
            placeholder="Number"
            label="Number"
            onChange={setNumber}
          />

          <TextInput
            placeholder="Amount"
            label="Amount"
            onChange={setAmount}
          />

          <div className="pt-8 flex justify-center">
            <Button
              onClick={async () => {
                const result = await p2pTransfer(
                  number,
                  Number(amount) * 100
                );
                console.log(result.message);
                if (result.message === "Transfer successful") {
                  router.refresh();
                }
              }}
            >
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
