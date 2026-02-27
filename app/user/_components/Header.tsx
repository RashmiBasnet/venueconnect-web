"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
    { href: "/user/home", label: "Home" },
    { href: "/user/venues", label: "Venues" },
    { href: "/user/packages", label: "Packages" },
    { href: "/user/activity", label: "Activity" },
    { href: "/user/profile", label: "Profile" },
];

export default function Header() {
    const { logout, user } = useAuth();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));

    return (
        <header className="relative overflow-hidden h-50 bg-white">
            <div className="absolute inset-0 " />

            {/* Wave background */}
            <div className="absolute inset-x-0 top-0 h-45 pointer-events-none">
                <svg
                    className="h-full w-full"
                    viewBox="0 0 2048 255"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <path
                        fill="#C4B6AB"
                        d="M 0 0 H 2048 V 205
         L 2047 205 L 2016 223 L 1984 236 L 1952 245 L 1920 250 L 1888 254 L 1856 254
         L 1824 254 L 1792 253 L 1760 251 L 1728 248 L 1696 244 L 1664 240 L 1632 235
         L 1600 230 L 1568 224 L 1536 218 L 1504 211 L 1472 204 L 1440 197 L 1408 190
         L 1376 184 L 1344 178 L 1312 172 L 1280 167 L 1248 162 L 1216 157 L 1184 153
         L 1152 149 L 1120 146 L 1088 143 L 1056 141 L 1024 139 L 992 138 L 960 137
         L 928 137 L 896 137 L 864 138 L 832 139 L 800 141 L 768 143 L 736 146 L 704 149
         L 672 153 L 640 157 L 608 162 L 576 167 L 544 172 L 512 178 L 480 184 L 448 190
         L 416 197 L 384 204 L 352 211 L 320 218 L 288 224 L 256 230 L 224 235 L 192 240
         L 160 244 L 128 248 L 6 265 L 70 293 L 90 292 L -10 248
         Z"
                    />
                </svg>
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