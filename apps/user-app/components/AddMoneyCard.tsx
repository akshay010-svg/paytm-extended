"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { TextInput } from "@repo/ui/textinput";
import { createOnRampTransaction } from "../lib/actions/createOnrampTransaction";

const SUPPORTED_BANKS = [
  {
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com",
  },
  {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/",
  },
];

export const AddMoney = () => {
  const [redirectUrl, setRedirectUrl] = useState(
    SUPPORTED_BANKS[0]!.redirectUrl
  );
  const [provider, setProvider] = useState(
    SUPPORTED_BANKS[0]!.name
  );
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  return (
    <Card title="Add Money">
      <div className="w-full">
        <TextInput
          label="Amount"
          placeholder="Amount"
          onChange={(value) => setAmount(Number(value))}
        />

        <div className="py-4 text-left">Bank</div>

        <Select
          onSelect={(value) => {
            const bank = SUPPORTED_BANKS.find(
              (item) => item.name === value
            );

            if (bank) {
              setProvider(bank.name);
              setRedirectUrl(bank.redirectUrl);
            }
          }}
          options={SUPPORTED_BANKS.map((bank) => ({
            key: bank.name,
            value: bank.name,
          }))}
        />

        <div className="flex justify-center pt-4">
          <Button
            onClick={async () => {
              setLoading(true);

              try {
                const result = await createOnRampTransaction(
                  provider,
                  amount
                );

                if (result.message !== "Done") {
                  alert(result.message);
                  return;
                }

                window.location.href = redirectUrl;
              } catch (error) {
                console.error(error);
                alert("Failed to create transaction");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Processing..." : "Add Money"}
          </Button>
        </div>
      </div>
    </Card>
  );
};
