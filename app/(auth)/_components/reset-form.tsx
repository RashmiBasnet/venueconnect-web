"use client";

import NextLink from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleResetPassword } from "@/lib/actions/user/user-actions";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordSchema, ResetPasswordType } from "../schema";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";

export default function ResetPasswordForm({ token }: { token: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: ResetPasswordType) => {
    try {
      const response = await handleResetPassword(token, data.password);

      if (response.success) {
        toast.success("Password reset successfully");
        router.replace("/login");
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="relative min-h-full p-8 sm:p-12">
      {/* subtle theme background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#F4F1EE]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 bg-linear-to-b from-[#C4B6AB]/70 to-transparent" />

      {/* Back button */}
      <NextLink
        href="/"
        className="absolute left-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 backdrop-blur hover:bg-white"
      >
        <ArrowLeft className="h-5 w-5 text-[#233041]" />
      </NextLink>

      <div className="mx-auto max-w-md pt-10">
        {/* Card */}
        <div className="rounded-2xl border border-black/10 bg-white/90 p-7 shadow-sm backdrop-blur sm:p-8">
          <div className="text-center">
            <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-[#233041]">
              <span className="h-2 w-2 rounded-full bg-[#AE8E54]" />
              Password reset
            </div>

            <h1 className="text-3xl font-semibold text-[#233041]">
              Set new password
            </h1>
            <p className="mt-2 text-sm text-black/60">
              Choose a strong password for your account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
            {/* Password */}
            <div>
              <label className="text-sm font-medium text-[#233041]">
                New Password
              </label>

              <div className="mt-2 flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2.5 focus-within:border-[#AE8E54] focus-within:ring-2 focus-within:ring-[#AE8E54]/25">
                <Lock className="h-5 w-5 text-black/40" />

                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-[#233041] outline-none placeholder:text-black/35"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="rounded-md p-1 text-black/50 hover:bg-black/5"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-2 text-sm text-[#A11D2C]">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-[#233041]">
                Confirm New password
              </label>

              <div className="mt-2 flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2.5 focus-within:border-[#AE8E54] focus-within:ring-2 focus-within:ring-[#AE8E54]/25">
                <Lock className="h-5 w-5 text-black/40" />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-[#233041] outline-none placeholder:text-black/35"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className="rounded-md p-1 text-black/50 hover:bg-black/5"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-[#A11D2C]">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#AE8E54] py-3 text-sm font-extrabold text-[#233041] shadow-md shadow-black/10 hover:brightness-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Resetting..." : "Reset password"}
            </button>

            <div className="text-center text-sm text-black/60">
              Remembered your password?{" "}
              <NextLink
                href="/login"
                className="font-semibold text-[#233041] hover:underline"
              >
                Back to login
              </NextLink>
            </div>
          </form>
        </div>

        {/* tiny footer note */}
        <p className="mt-4 text-center text-xs text-black/45">
          Tip: use a mix of letters, numbers, and symbols.
        </p>
      </div>
    </div>
  );
}
