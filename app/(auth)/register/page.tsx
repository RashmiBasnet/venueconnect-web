import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RegisterForm from "../_components/register-form";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#C4B6AB] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.45)] grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        <div className="p-10">
          <Link href="/login" className="text-sm text-gray-500 hover:underline">
            <ArrowLeft className="text-[#A78E59]"/>
          </Link>

          <div className="text-center">
            <h1 className="text-3xl font-semibold mt-2 text-black">Create Account</h1>
            <p className="text-gray-500 mt-1 text-xs font-extralight">
                Already have an account?{" "}
                <Link href="/login" className=" font-semibold text-[#A78E59]">
                Login
                </Link>
            </p>
          </div>

          <div className="mt-5">
            <RegisterForm />
          </div>

        </div>

        <div className="hidden md:flex items-center justify-center bg-white">
          <Image
            src="/images/SignUp.png"
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
