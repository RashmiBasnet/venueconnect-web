"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginType } from "@/app/(auth)/schema";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: LoginType) => {
    console.log("login data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="Enter your email address"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
          placeholder:text-gray-400 placeholder:text-sm"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400">
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          placeholder="Enter your password"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
          placeholder:text-gray-400 placeholder:text-sm"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex w-auto items-center text-center gap-1">
          <input
          type="checkbox"
          className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className=" block text-xs text-gray-500">
            Remember me
          </label>
        </div>
        <label className="text-xs font-semibold text-[#A78E59]">Forgot password?</label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-10 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-[#233041] hover:bg-[#1f2c39] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#233041] disabled:opacity-50"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
