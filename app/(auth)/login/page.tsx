import LoginForm from "../_components/login-form";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#C4B6AB] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.45)] grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        <div className="p-10">
          <Link href="/" className="text-sm text-gray-500 hover:underline">
            <ArrowLeft className="text-[#A78E59]"/>
          </Link>

          <div className="text-center">
            <h1 className="text-4xl font-semibold mt-2 text-black">Login</h1>
            <p className="text-gray-500 mt-1 text-sm font-extralight">
                Don’t have an account?{" "}
                <Link href="/register" className=" font-semibold text-[#A78E59]">
                Sign Up 
                </Link>
            </p>
          </div>

          <div className="mt-5">
            <LoginForm />
          </div>

        </div>

        <div className="hidden md:flex items-center justify-center bg-white">
          <Image
            src="/images/Login.png"
            alt="Login Illustration"
            width={450}
            height={400}
            priority
          />
        </div>
      </div>
    </div>
  );
}
