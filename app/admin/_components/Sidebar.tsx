"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const ADMIN_LINKS = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
];

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => href === "/admin" ? pathname === href : pathname?.startsWith(href);

    return (
        <>
            {/* Sidebar */}
            <aside className={`
                fixed md:static 
                top-0 left-0 
                h-screen w-64 
                bg-blue-950
                border-r border-white dark:border-black/20
                z-40 overflow-y-auto`}
            >
                <div className="p-4 border-b border-white/20">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-md bg-white">
                        <Image
                            src="/images/logo_blue.png"
                            alt="Website Logo"
                            fill
                            sizes="40px"
                            className="object-contain p-1"
                            priority
                        />
                        </div>

                        <span className="font-semibold text-white tracking-tight">Admin Panel</span>
                    </Link>
                </div>


                <nav className="p-2 space-y-1">
                    {
                        ADMIN_LINKS.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive(link.href)
                                    ? 'bg-black dark:bg-white text-white dark:text-gray-900'
                                    : 'text-white dark:text-white hover:bg-gray-100 dark:hover:bg-white/20'
                                    }`}
                            >
                                <span>{link.label}</span>
                            </Link >
                        ))
                    }
                </nav >
            </aside >
        </>
    );
}