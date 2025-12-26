"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterType } from "@/app/(auth)/schema";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: RegisterType) => {
    console.log("register data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
            <label className="block text-sm font-medium text-gray-400">
            Name
            </label>
            <input
            {...register("name")}
            type="text"
            placeholder="Enter your name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
            placeholder:text-gray-400 placeholder:text-sm"
            />
            {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
      </div>

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

      <div>
        <label className="block text-sm font-medium text-gray-400">
          Confirm Password
        </label>
        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="Enter your password again"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
          placeholder:text-gray-400 placeholder:text-sm"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-10 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-[#233041] hover:bg-[#1f2c39] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#233041] disabled:opacity-50"
      >
        {isSubmitting ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}
