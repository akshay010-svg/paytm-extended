import { db , dbReady } from "@repo/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        name : {
          label: "name",
          type: "text",
          placeholder: "your-name-here",
        },
        phone: {
          label: "Phone number",
          type: "text",
          placeholder: "xxxxxxxxxx",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        await dbReady;
        const name = credentials?.name;
        const phone = credentials?.phone;
        const password = credentials?.password;

        if (!phone || !password || !name ) return null;

        const existingUser = await db.orm.public.User
          .where({ number: phone })
          .first();

        if (existingUser) {
          const valid = await bcrypt.compare(
            password,
            existingUser.password
          );

          if (!valid) return null;

          return {
            id: String(existingUser.id),
            name: existingUser.name,
            email: existingUser.email,
          };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await db.orm.public.User.create({
          name : name,
          number: phone,
          password: hashedPassword,
        });

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async session({ session, token } : any) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
};