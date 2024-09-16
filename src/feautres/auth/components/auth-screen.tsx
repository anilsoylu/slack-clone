"use client"

import { Suspense, useState } from "react"
import { SignInFlow } from "../types"
import { SignInCard } from "./sing-in-card"
import { SignUpCard } from "./sign-up-card"

export const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn")

  return (
    <div className="h-full flex items-center justify-center bg-[#5c3b58]">
      <div className="md:h-auto md:w-[420px]">
        <Suspense>
          {state === "signIn" ? (
            <SignInCard setState={setState} />
          ) : (
            <SignUpCard setState={setState} />
          )}
        </Suspense>
      </div>
    </div>
  )
}
