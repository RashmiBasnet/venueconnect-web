import z from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(60, "Maximum limit is 60"),
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6,"Password must be at least 6 characters"),
}).refine(
  (v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords do not match",
  }
);

export type RegisterType = z.infer<typeof registerSchema>;