"use client"

import { signIn } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { useCustomToast } from "@/hooks/use-custom-toast"

import { LoginSchema } from "@/schemas"
import { LoginAction } from "@/actions/LoginAction"

import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SignInFlow } from "../types"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { DEFAULT_LOGIN_REDIRECT } from "routes"

interface Props {
  setState: (state: SignInFlow) => void
}

export const SignInCard = ({ setState }: Props) => {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const showToast = useCustomToast()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    })
  }

  function onSubmit(values: z.infer<typeof LoginSchema>) {
    setError("")
    setSuccess("")

    startTransition(() => {
      LoginAction(values, callbackUrl)
        .then((response) => {
          if (response?.error) {
            setError(response.error)
            showToast({
              title: "Giriş başarısız!",
              description: `Bir hata oluştu: ${response.error}`,
              variant: "destructive",
            })
            setSuccess("")
          } else {
            form.reset()
            setSuccess("Giriş başarılı!")
            showToast({
              title: "Giriş başarılı!",
              description: "Başarıyla giriş yaptınız, yönlendiriliyorsunuz...",
              variant: "success",
            })
            setError("")
          }
        })
        .catch(() => {
          setError("Beklenmedik bir hata oluştu!")
          showToast({
            title: "Giriş başarısız!",
            description:
              "Beklenmedik bir hata oluştu! Lütfen tekrar deneyiniz.",
            variant: "destructive",
          })
          setSuccess("")
        })
    })
  }

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        {error && <p className="text-destructive">{error}</p>}
        {success && <p className="text-emerald-500">{success}</p>}
        <Form {...form}>
          <form className="space-y-2.5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Email"
                      type="email"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Password"
                      type="password"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" size="lg" disabled={false}>
              Continue
            </Button>
          </form>
        </Form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={isPending}
            onClick={() => onClick("google")}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5" />
            Continue with Google
          </Button>
          <Button
            disabled={isPending}
            onClick={() => onClick("github")}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FaGithub className="size-5 absolute top-3 left-2.5" />
            Continue with GitHub
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => setState("signUp")}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </CardContent>
    </Card>
  )
}
