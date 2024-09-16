import { decrypt } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { cookies } from "next/headers"

export const getUser = async () => {
  const sessionCookie = cookies().get("session")
  if (!sessionCookie || !sessionCookie.value) {
    return null
  }

  const sessionData = await decrypt(sessionCookie.value)
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== "number"
  ) {
    return null
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null
  }

  const user = await db.user.findMany({
    where: {
      id: sessionData.user.id,
      deletedAt: null,
    },
    take: 1,
  })

  if (user.length === 0) {
    return null
  }

  return user[0]
}

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    })

    return user
  } catch (error) {
    console.error(error)
    return
  }
}

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findFirst({
      where: { id },
    })

    return user
  } catch (err) {
    return null
  }
}
