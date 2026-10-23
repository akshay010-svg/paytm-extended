import express from "express";
import { db, dbReady } from "@repo/db";
import "dotenv/config";
import { Temporal } from "@js-temporal/polyfill";
Object.assign(globalThis, { Temporal });

const app = express();

app.use(express.json());

app.post("/hdfcWebhook", async (req, res) => {
  const { token, user_identifier, amount } = req.body ?? {};
  console.log(req.body);
  if (
    typeof token !== "string" ||
    typeof user_identifier !== "string" ||
    !/^\d+$/.test(user_identifier) ||
    !Number.isSafeInteger(Number(amount)) ||
    Number(amount) <= 0
  ) {
    return res.status(400).json({
      message: "Invalid payment information",
    });
  }

  try {
    await dbReady;
    await db.transaction(async (tx : any) => {
      const transaction = await tx.orm.public.OnRampTransaction
        .where({ token }) 
        .first();

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      if (transaction.status !== "Processing") {
        throw new Error("Transaction already processed");
      }

      if (
        transaction.userId !== Number(user_identifier) ||
        transaction.amount !== Number(amount)
      ) {
        throw new Error("Payment information mismatch");
      }

      const balance = await tx.orm.public.Balance
        .where({ userId: transaction.userId })
        .first();

      if (!balance) {
        await tx.orm.public.Balance.create({
          userId: transaction.userId,
          amount: transaction.amount,
          locked: 0,
        });
      } else {
        await tx.orm.public.Balance
          .where({ userId: transaction.userId })
          .update({
            amount: balance.amount + transaction.amount,
          });
      }

      await tx.orm.public.OnRampTransaction
        .where({ token })
        .update({
          status: "Success",
        });
    });

    return res.json({ message: "Captured" });
  } catch (error) {
    console.error("Webhook processing failed:", error);

    return res.status(400).json({
      message: "Error while processing webhook",
    });
  }
});

app.listen(3003, () => {
  console.log("Bank webhook handler listening on port 3003");
});