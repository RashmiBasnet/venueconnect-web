"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const activeHref = useMemo(() => {
    const matches = NAV_LINKS.filter((l) => isActive(l.href));
    matches.sort((a, b) => b.href.length - a.href.length);
    return matches[0]?.href ?? "";
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-[#CBBFB6]/90 backdrop-blur border-b border-black/10">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
          {/* LEFT: Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-9 w-9 rounded-md bg-white/60 ring-1 ring-black/10 overflow-hidden">
              <Image
                src="/images/logo_blue.png"
                alt="VenueConnect"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <span className="text-sm font-semibold text-[#1F2A37]">
              Venue<span className="text-[#AE8E54]">Connect</span>
            </span>
          </Link>

          {/* CENTER: Desktop Nav */}
          <div className="hidden md:flex gap-7 justify-center">
            {NAV_LINKS.map((link) => {
              const active = link.href === activeHref;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    "text-sm font-semibold transition-colors " +
                    (active
                      ? "text-[#233041]"
                      : "text-white hover:text-[#AE8E54]")
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* RIGHT: Auth + Icons */}
          <div className="flex items-center gap-2 justify-end">
            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className={
                  "px-3 py-2 rounded-md text-sm font-semibold transition " +
                  (pathname === "/login"
                    ? "bg-white/60 text-[#1F2A37]"
                    : "bg-white/40 text-[#1F2A37] hover:bg-white/55")
                }
              >
                Login
              </Link>

              <Link
                href="/register"
                className={
                  "px-3 py-2 rounded-md text-sm font-semibold transition " +
                  (pathname === "/register"
                    ? "bg-white/60 text-[#1F2A37]"
                    : "bg-[#AE8E54] text-white hover:opacity-90")
                }
              >
                Register
              </Link>
            </div>

            {/* Account icon */}
            <button className="h-9 w-9 rounded-full bg-white/60 ring-1 ring-black/10 grid place-items-center text-[#2B3440] hover:bg-white/75">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 21a8 8 0 1 0-16 0"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden h-9 w-9 rounded-full bg-white/60 ring-1 ring-black/10 grid place-items-center text-[#2B3440]"
            >
              {open ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={
            "md:hidden overflow-hidden transition-[max-height] duration-300 " +
            (open ? "max-h-96" : "max-h-0")
          }
        >
          <div className="border-t border-black/10 pt-3 pb-4 space-y-1">
            {NAV_LINKS.map((link) => {
              const active = link.href === activeHref;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={
                    "block px-3 py-2 rounded-md text-sm font-medium " +
                    (active
                      ? "bg-white/50 text-[#1F2A37]"
                      : "text-[#1F2A37]/75 hover:bg-white/40")
                  }
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="h-px bg-black/10 my-2" />

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-semibold bg-white/40 text-[#1F2A37] hover:bg-white/55"
            >
              Login
            </Link>

            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-semibold bg-[#AE8E54] text-white hover:opacity-90"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
