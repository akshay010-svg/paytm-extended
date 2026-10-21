
import { Temporal } from "@js-temporal/polyfill";
Object.assign(globalThis, { Temporal });

import { db, dbReady } from "./db";

async function main() {
  await dbReady;

  await db.transaction(async (tx) => {
    const alice = await tx.orm.public.User
      .where({ number: "9999999999" })
      .upsert({
        update: {},
        create: {
          number: "9999999999",
          password: "alice",
          name: "alice",
        },
      });

    await tx.orm.public.OnRampTransaction.create({
      startTime: Temporal.Now.instant(),
      status: "Success",
      amount: 20000,
      token: "122",
      provider: "HDFC Bank",
      userId: alice.id,
    });

    const bob = await tx.orm.public.User
      .where({ number: "9999999998" })
      .upsert({
        update: {},
        create: {
          number: "9999999998",
          password: "bob",
          name: "bob",
        },
      });

    await tx.orm.public.OnRampTransaction.create({
      startTime: Temporal.Now.instant(),
      status: "Failure",
      amount: 2000,
      token: "123",
      provider: "HDFC Bank",
      userId: bob.id,
    });

    console.log({ alice, bob });
  });

  console.log("Seed completed successfully.");
}

main().catch((error) => {
  console.error("Seed failed; transaction rolled back:", error);
  process.exitCode = 1;
});
