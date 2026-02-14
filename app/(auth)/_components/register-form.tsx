"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterType } from "@/app/(auth)/schema";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { handleRegister } from "@/lib/actions/auth-actions";
import { toast } from "sonner";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [pending, setTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: RegisterType) => {
    setError("");
    try {
      const res = await handleRegister(data);
      if (!res.success) {
        throw new Error(res.message || "Failed to Register");
      }
      toast.success("Successfully Registered! Redirecting to Login...");
      setTransition(() => router.push("/login"));
    } catch (err: any) {
      toast.error(err.message || "Failed to Register");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400">Name</label>
        <input
          {...register("fullName")}
          type="text"
          placeholder="Enter your name"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
            placeholder:text-gray-400 placeholder:text-sm text-black"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400">Email</label>
        <input
          {...register("email")}
          type="email"
          placeholder="Enter your email address"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
          placeholder:text-gray-400 placeholder:text-sm text-black"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400">
          Password
        </label>

        {/* Password with eye toggle */}
        <div className="mt-1 flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500">
          <Lock className="h-4 w-4 text-gray-400" />

          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full bg-transparent text-black placeholder:text-gray-400 placeholder:text-sm outline-none"
          />

          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="rounded-md p-1 text-gray-500 hover:bg-black/5"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400">
          Confirm Password
        </label>

        {/* Confirm Password with eye toggle */}
        <div className="mt-1 flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500">
          <Lock className="h-4 w-4 text-gray-400" />

          <input
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Enter your password again"
            className="w-full bg-transparent text-black placeholder:text-gray-400 placeholder:text-sm outline-none"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword((p) => !p)}
            className="rounded-md p-1 text-gray-500 hover:bg-black/5"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="w-full mt-10 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-[#233041] hover:bg-[#1f2c39] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#233041] disabled:opacity-50"
      >
        {isSubmitting || pending ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}
