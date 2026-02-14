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
        <header className="relative overflow-hidden h-50 bg-white">
            {/* Background base color (so header still looks good while image loads) */}
            <div className="absolute inset-0 " />

            {/* Wave background */}
            <div className="absolute inset-x-0 top-0 h-45 pointer-events-none">
                <Image
                    src="/images/wave_decoration.png"
                    alt=""
                    fill
                    priority
                    className="object-contain object-top"
                />
            </div>

            {/* Content on top */}
            <div className="relative z-10 mx-auto max-w-7xl px-6 py-5">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-md bg-white/90 shadow-sm">
                            <Image
                                src="/images/logo_blue.png"
                                alt="VenueConnect"
                                fill
                                className="object-contain p-1"
                            />
                        </div>
                        <span className="font-semibold tracking-tight text-[#233041]">
                            Venue<span className="text-[#AE8E54]">Connect</span>
                        </span>
                    </Link>

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
            </div>
        </header>

    );
}