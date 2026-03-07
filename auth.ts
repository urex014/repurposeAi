// auth.ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "./lib/mongodb"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [Google],
  pages: {
    signIn: '/login',
  },
  events: {
    async createUser({ user }) {
      const client = await clientPromise
      const db = client.db()

      await db.collection("users").updateOne(
        { email: user.email },
        { $set: { credits: 10 } }
      )
    }
  }
})