import { z } from "zod";


export const userFormValidation = z.object({
    name: z.string()
        .min(2, "Username must be at least 2 characters long")
        .max(20, "Username must be at most 20 characters long"),
    email: z.string().email("Please enter a valid email"),
    phoneInput: z.string().refine((phone) => /^\d{10, 15}$/.test(phone), "Invalid phone number")
  })
