"use client";

import NextLink from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
  requestPasswordResetSchema,
  RequestPasswordResetType,
} from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPasswordReset } from "@/lib/api/user/user";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestPasswordResetType>({
    resolver: zodResolver(requestPasswordResetSchema),
  });

  const onSubmit = async (data: RequestPasswordResetType) => {
    try {
      const response = await requestPasswordReset(data.email);

      if (response.success) {
        toast.success("Password reset link sent to your email.");
      } else {
        toast.error(response.message || "Failed to request password reset.");
      }
    } catch (error) {
      toast.error((error as Error).message || "Failed to request password reset.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Theme background */}
      <div className="absolute inset-0 bg-[#F4F1EE]" />
      <div className="absolute inset-x-0 top-0 h-72 bg-linear-to-b from-[#C4B6AB]/80 to-transparent" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-[#233041]/5 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white/90 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-black/10">
          <div className="grid lg:grid-cols-2">
            {/* LEFT: Visual panel */}
            <div className="relative hidden lg:block min-h-120 bg-[#F4F1EE]">

              {/* Illustration */}
              <div className="relative h-full flex items-center justify-center overflow-visible p-10">
                <Image
                  src="/images/forgot.png"
                  alt="Forgot password illustration"
                  width={760}
                  height={760}
                  priority
                  className="scale-125 max-h-full max-w-full w-auto object-contain"
                />
              </div>
            </div>

            {/* RIGHT: Form */}
            <div className="relative p-8 sm:p-12">
              {/* Back button */}
              <NextLink
                href="/"
                className="absolute left-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 backdrop-blur hover:bg-white"
              >
                <ArrowLeft className="h-5 w-5 text-[#233041]" />
              </NextLink>

              <div className="mx-auto max-w-md pt-8">
                <div className="text-center">

                  <h1 className="text-3xl font-semibold text-[#233041]">
                    Reset password
                  </h1>
                  <p className="mt-2 text-sm text-black/60">
                    Enter the email linked to your account.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                  {/* Email */}
                  <div>
                    <label className="text-sm font-medium text-[#233041]">
                      Email address
                    </label>

                    <div className="mt-2 w-full flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2.5 focus-within:border-[#AE8E54] focus-within:ring-2 focus-within:ring-[#AE8E54]/25">
                      <Mail className="h-5 w-5 text-black/40" />
                      <input
                        type="email"
                        {...register("email")}
                        placeholder="abc@email.com"
                        className="w-full bg-transparent text-sm text-[#233041] outline-none placeholder:text-black/35"
                      />
                    </div>

                    {errors.email && (
                      <p className="mt-2 text-sm text-[#A11D2C]">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-[#AE8E54] py-3 text-sm font-extrabold text-white shadow-md shadow-black/10 hover:brightness-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "Sending..." : "Send reset link"}
                  </button>

                  <div className="text-center text-sm text-black/60">
                    Remembered your password?{" "}
                    <NextLink
                      href="/login"
                      className="font-semibold text-[#AE8E54] hover:underline"
                    >
                      Back to login
                    </NextLink>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
