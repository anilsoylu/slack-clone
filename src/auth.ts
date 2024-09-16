import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import authConfig from "./auth.config"
import { getUserById } from "./data/user"
import { getAccountByUserId } from "./data/account"

export const { auth, handlers, signIn, signOut } = NextAuth({
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          updatedAt: new Date(),
        },
      })
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true

      const existingUser = await getUserById(user.id as string)

      if (!existingUser?.isActive) return false

      return true
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (session.user) {
        session.user.name = token.name
        session.user.username = token.username as string
        session.user.isOAuth = token.isOauth as boolean
        session.user.isActive = token.isActive as boolean
        session.user.isAdmin = token.isAdmin as boolean
        session.user.isOwner = token.isOwner as boolean
        session.user.image = token.picture
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      const existingAccount = await getAccountByUserId(existingUser.id)

      token.isOauth = !!existingAccount
      token.picture = existingUser.image
      token.name = existingUser.name
      token.username = existingUser.username
      token.isActive = existingUser.isActive
      token.isAdmin = existingUser.isAdmin
      token.isOwner = existingUser.isOwner

      return token
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})
