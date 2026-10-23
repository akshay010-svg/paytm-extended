import { Temporal } from "@js-temporal/polyfill";
Object.assign(globalThis, { Temporal });

import bcrypt from "bcrypt";
import { db, dbReady } from "./db";

async function main() {
  await dbReady;

  const alicePassword = await bcrypt.hash("alice", 10);
  const bobPassword = await bcrypt.hash("bob", 10);

  await db.transaction(async (tx) => {
    const alice = await tx.orm.public.User
      .where({ number: "1111111111" })
      .upsert({
        update: {},
        create: {
          number: "1111111111",
          password: alicePassword,
          name: "alice",
        },
      });

    await tx.orm.public.Balance.create({
      amount: 20000,
      locked: 0,
      userId: alice.id,
    });

    await tx.orm.public.OnRampTransaction.create({
      startTime: Temporal.Now.instant(),
      status: "Success",
      amount: 20000,
      token: "token__1",
      provider: "HDFC Bank",
      userId: alice.id,
    });

    // Bob
    const bob = await tx.orm.public.User
      .where({ number: "2222222222" })
      .upsert({
        update: {},
        create: {
          number: "2222222222",
          password: bobPassword,
          name: "bob",
        },
      });

    await tx.orm.public.Balance.create({
      amount: 2000,
      locked: 0,
      userId: bob.id,
    });

    await tx.orm.public.OnRampTransaction.create({
      startTime: Temporal.Now.instant(),
      status: "Failure",
      amount: 2000,
      token: "token__2",
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