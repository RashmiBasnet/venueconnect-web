import React from "react";

export default function HowItWorks() {
    const steps = [
        {
            num: "1",
            title: "Search for a Venue",
            desc: "Users can quickly find venues by selecting their location, event type, date, and guest count, making it easy to see options that match their needs.",
        },
        {
            num: "2",
            title: "Choose a Package",
            desc: "Each venue displays the ready-made packages it offers, allowing users to view what's included, the capacity, duration, and price before selecting one.",
        },
        {
            num: "3",
            title: "Book Online",
            desc: "After choosing a venue and package, users can confirm their details and complete the booking securely through the platform.",
        },
    ];

    return (
        <section className="bg-white py-16">
            <div className="mx-auto max-w-7xl px-6">
                <div className="relative overflow-visible rounded-4xl bg-white">
                    {/* Background soft circles */}
                    <div className="pointer-events-none absolute -left-30 -bottom-25 h-100 w-100 rounded-full bg-[#EEF4FF] opacity-60" />
                    <div className="pointer-events-none absolute -right-32 -top-10 h-100 w-100 rounded-full bg-[#EEF4FF] opacity-60" />

                    {/* Top text */}
                    <div className="relative grid gap-10 lg:grid-cols-2">
                        <div className="pt-6 lg:pt-2">
                            <h2 className="text-4xl font-extrabold tracking-tight text-[#233041]">
                                How It Works?
                            </h2>
                            <p className="mt-4 max-w-md text-base leading-7 text-[#233041]/70">
                                Planning an event can be stressful and time-consuming.
                                <br />
                                VenueConnect makes it simple by connecting you with
                                <br />
                                venues and the packages they already offer, all in one
                                <br />
                                place.
                            </p>
                        </div>
                        <div className="hidden lg:block" />
                    </div>

                    {/* Desktop (1280 tuned) */}
                    <div className="relative hidden min-h-130 lg:block">
                        {/* Golden curve */}
                        <svg
                            className="pointer-events-none absolute left-0 top-0 h-full w-full"
                            viewBox="0 0 1280 520"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M120,280 
                   C260,400 350,220 480,270 
                   C620,320 660,180 820,230 
                   C980,285 1020,110 1180,120"
                                fill="none"
                                stroke="#A98A53"
                                strokeWidth="6"
                                strokeLinecap="round"
                            />
                        </svg>

                        {/* Soft shadow under curve */}
                        <svg
                            className="pointer-events-none absolute left-0 top-0 h-full w-full opacity-25 blur-[2px]"
                            viewBox="0 0 1280 520"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M120,282 
                   C260,402 350,222 480,272 
                   C620,322 660,182 820,232 
                   C980,287 1020,112 1180,122"
                                fill="none"
                                stroke="#A98A53"
                                strokeWidth="10"
                                strokeLinecap="round"
                            />
                        </svg>

                        {/* Nodes */}
                        <div className="absolute left-35 top-75">
                            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-lg">
                                <div className="h-6 w-6 rounded-full bg-[#BDBDBD]" />
                            </div>
                        </div>

                        <div className="absolute left-160 top-51.25">
                            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-lg">
                                <div className="h-6 w-6 rounded-full bg-[#BDBDBD]" />
                            </div>
                        </div>

                        <div className="absolute left-245 top-21.25">
                            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-lg">
                                <div className="h-6 w-6 rounded-full bg-[#BDBDBD]" />
                            </div>
                        </div>

                        {/* Big faded numbers */}
                        <div className="pointer-events-none absolute left-45 top-90 text-[140px] font-extrabold text-[#233041]/10">
                            1
                        </div>
                        <div className="pointer-events-none absolute left-150 top-65 text-[140px] font-extrabold text-[#233041]/10">
                            2
                        </div>
                        <div className="pointer-events-none absolute left-240 top-40 text-[140px] font-extrabold text-[#233041]/10">
                            3
                        </div>

                        {/* Step text blocks */}
                        <div className="absolute left-27.5 top-95 max-w-75">
                            <h3 className="text-lg font-extrabold text-[#233041]">
                                Search for a Venue
                            </h3>
                            <p className="mt-2 text-base leading-7 text-[#233041]/70">
                                Users can quickly find venues by selecting their location, event
                                type, date, and guest count, making it easy to see options that
                                match their needs.
                            </p>
                        </div>

                        <div className="absolute left-130 top-80 max-w-90">
                            <h3 className="text-lg font-extrabold text-[#233041]">
                                Choose a Package
                            </h3>
                            <p className="mt-2 text-base leading-7 text-[#233041]/70">
                                Each venue displays the ready-made packages it offers, allowing
                                users to view what&apos;s included, the capacity, duration, and
                                price before selecting one.
                            </p>
                        </div>

                        <div className="absolute left-235 top-50 max-w-90">
                            <h3 className="text-lg font-extrabold text-[#233041]">
                                Book Online
                            </h3>
                            <p className="mt-2 text-base leading-7 text-[#233041]/70">
                                After choosing a venue and package, users can confirm their
                                details and complete the booking securely through the platform.
                            </p>
                        </div>
                    </div>

                    {/* Mobile fallback */}
                    <div className="mt-10 grid gap-6 lg:hidden">
                        {steps.map((s) => (
                            <div
                                key={s.num}
                                className="relative overflow-hidden rounded-3xl bg-[#F6F8FF] p-6"
                            >
                                <div className="absolute right-6 top-4 text-7xl font-extrabold text-[#233041]/10">
                                    {s.num}
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-md">
                                        <div className="h-4 w-4 rounded-full bg-[#BDBDBD]" />
                                    </div>
                                    <h3 className="text-lg font-extrabold text-[#233041]">
                                        {s.title}
                                    </h3>
                                </div>

                                <p className="mt-3 text-base leading-7 text-[#233041]/70">
                                    {s.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
