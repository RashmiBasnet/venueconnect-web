import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-[#C4B6AB]" >
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid gap-10 md:grid-cols-5">
                    <div className="md:col-span-1">
                        <h4 className="text-sm font-semibold">About Us</h4>
                        <ul className="mt-4 space-y-2 text-xs text-[#233041]/70">
                            <li>
                                <Link href="/how-it-works" className="hover:text-[#233041]">
                                    How It Works?
                                </Link>
                            </li>
                            <li>
                                <Link href="/why-us" className="hover:text-[#233041]">
                                    Why Choose Us?
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-1">
                        <h4 className="text-sm font-semibold">Quick Links</h4>
                        <ul className="mt-4 space-y-2 text-xs text-[#233041]/70">
                            <li>
                                <Link href="/" className="hover:text-[#233041]">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/venues" className="hover:text-[#233041]">
                                    Venues
                                </Link>
                            </li>
                            <li>
                                <Link href="/packages" className="hover:text-[#233041]">
                                    Packages
                                </Link>
                            </li>
                            <li>
                                <Link href="/how-it-works" className="hover:text-[#233041]">
                                    How it works
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-1">
                        <h4 className="text-sm font-semibold">Contact Us</h4>
                        <div className="mt-4 space-y-2 text-xs text-[#233041]/70">
                            <p>Kathmandu, Nepal</p>
                            <p>info@venueconnect.com</p>
                            <p>+977 9876543212</p>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <h4 className="text-sm font-semibold">Stay Connected</h4>
                        <div className="mt-4 flex items-center gap-3 text-[#233041]/70">
                            {["F", "X", "Y", "I"].map((t) => (
                                <Link
                                    key={t}
                                    href="#"
                                    className="grid h-9 w-9 place-items-center rounded-full bg-white/60 text-sm font-semibold shadow-sm hover:bg-white"
                                >
                                    {t}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-1 md:flex md:justify-end">
                        <div className="flex items-center gap-3 md:flex-col md:items-end">
                            <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-white/90 shadow-sm">
                                <Image
                                    src="/images/logo_blue.png"
                                    alt="VenueConnect"
                                    fill
                                    className="object-contain p-2"
                                />
                            </div>
                            <div className="text-right">
                                <div className="text-base font-semibold">
                                    Venue<span className="text-[#AE8E54]">Connect</span>
                                </div>
                                <div className="text-xs text-[#233041]/65">
                                    Find • Choose • Book
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t border-[#233041]/15 pt-6 text-center text-xs text-[#233041]/60">
                    © {new Date().getFullYear()} VenueConnect. All rights reserved.
                </div>
            </div>
        </footer >
    );
}