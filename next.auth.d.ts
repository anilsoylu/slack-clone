import { type DefaultSession } from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
  username: string
  isActive: boolean
  isAdmin: boolean
  isOwner: boolean
  isOAuth: boolean
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}
