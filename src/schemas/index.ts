import * as z from "zod"

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Geçerli bir email adresi giriniz",
  }),
  password: z.string().min(1, {
    message: "Şifre gereklidir",
  }),
})

export const RegisterSchema = z
  .object({
    email: z.string().email({
      message: "Geçerli bir email adresi giriniz",
    }),
    password: z.optional(z.string().min(6)),
    confirmPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword
    },
    {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    }
  )
