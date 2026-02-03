"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
    { href: "/user/home", label: "Home" },
    { href: "/user/profile", label: "Profile" },
];

export default function Header() {
    const { logout, user } = useAuth();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));

    return (
        <header className="sticky top-0 z-50 bg-white backdrop-blur border-b border-black/10 dark:border-white/10">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
                <div className="flex h-16 items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] w-full">

                {/* Left: Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 group">
                    <Image
                        src="/images/logo_blue.png"
                        alt="Website Logo"
                        width={70}
                        height={70}
                    />
                    </Link>
                </div>

                {/* Center: Desktop Nav */}
                <div className="hidden md:flex items-center gap-6 justify-self-center">
                    {NAV_LINKS.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={
                        "text-sm font-semibold transition-colors " +
                        (isActive(link.href)
                            ? "text-yellow-800"
                            : "text-black hover:text-yellow-800/70")
                        }
                    >
                        {link.label}
                    </Link>
                    ))}
                </div>

                {/* Right: Auth */}
                <div className="flex items-center gap-3 justify-self-end">
                    <Link href={"/user/profile"}>
                        <span className="text-xs text-black font-semibold">
                            {user?.email || "Admin"}
                        </span>
                    </Link>

                    <button
                        onClick={logout}
                        className="border px-3 py-2 text-sm font-semibold text-white bg-yellow-800 rounded-md hover:bg-yellow-700 transition-colors"
                    >
                    Logout
                    </button>
                </div>

                </div>
            </nav>
        </header>

    );
}