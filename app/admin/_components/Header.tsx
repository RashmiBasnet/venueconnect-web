"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
    const { logout, user } = useAuth();

    return (
        <header className="sticky top-0 z-50 bg-white backdrop-blur border-b border-black dark:border-black/20">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
                <div className="flex h-16 items-center justify-between w-full">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-2">
                        <Link href="/admin" className="flex items-center gap-2 group">
                            <Image
                            src = "/images/logo_blue.png"
                            alt = "Website Logo"
                            width = {40}
                            height = {40}
                            className=""
                            />
                            <span className="text-base text-black font-semibold tracking-tight group-hover:opacity-80 transition-opacity">
                                Admin Panel
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="h-6 flex items-center justify-center text-xs text-black font-semibold">
                            {user?.email || 'Admin'}
                        </div>
                        <span className="text-sm font-medium sm:inline">
                            <button
                                onClick={() => {
                                    logout();
                                }}
                                className="w-full border flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-yellow-600 rounded-md hover:bg-yellow-600/50 transition-colors text-left"
                            >
                                Logout
                            </button>
                        </span>
                    </div>
                </div>
            </nav>
        </header>
    );
}