import * as z from "zod"

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Geçerli bir email adresi giriniz",
  }),
  password: z.string().min(1, {
    message: "Şifre gereklidir",
  }),
})

export const NewUserSchema = z.object({
  name: z.string().min(1, {
    message: "İsim gereklidir",
  }),
  email: z.string().email({
    message: "Geçerli bir email adresi giriniz",
  }),
  password: z.string().min(1, {
    message: "Şifre gereklidir",
  }),
})
