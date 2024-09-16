import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { verifyAuthorization } from "@/lib/auth/verify-api"
import { NextRequest, NextResponse } from "next/server"
import { getUserByEmail } from "@/data/user"

export async function GET(req: NextRequest) {
  const authResponse = await verifyAuthorization(req)
  if (authResponse) return authResponse

  try {
    const users = await db.user.findMany({
      where: {
        isActive: true,
        isOwner: false,
      },
    })

    return new NextResponse(JSON.stringify(users), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "Server error" }), {
      status: 500,
    })
  }
}

export async function POST(req: NextRequest) {
  const authResponse = await verifyAuthorization(req)
  if (authResponse) return authResponse

  const body = await req.json()

  console.log("body", body)

  try {
    const hashedPassword = await bcrypt.hash(body.password, 10)

    const isUserExist = await getUserByEmail(body.email)

    if (isUserExist) {
      return new NextResponse(
        JSON.stringify({ message: "Bu email adresi zaten kullanılıyor" }),
        {
          status: 400,
        }
      )
    }

    if (body.password !== body.confirmPassword) {
      return new NextResponse(
        JSON.stringify({ message: "Girdiğiniz şifreler eşleşmiyor" }),
        {
          status: 400,
        }
      )
    }

    const user = await db.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
      },
    })

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not created" }), {
        status: 404,
      })
    }

    return new NextResponse(JSON.stringify({ data: user }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Server error" }), {
      status: 500,
    })
  }
}
