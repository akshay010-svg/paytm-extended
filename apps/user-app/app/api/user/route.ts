import { NextResponse } from "next/server"
import { db, dbReady } from "@repo/db";


export const POST = async () => {
    await dbReady;
    const user  =  await db.orm.public.User.create({
    name : "akshay",
    email : "akshay@gmail.com"
   });
   console.log(user.id);
   return NextResponse.json({
        message: "hi there"

   });
}