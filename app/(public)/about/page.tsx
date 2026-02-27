import Link from "next/link";

const BRAND = "#AE8E54";

export default function AboutPage() {
    return (
        <main className="relative min-h-[calc(100vh-80px)] bg-white">
            <section className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
                {/* main card */}
                <div className="-mt-15 rounded-4xl border border-black/10 bg-white/80 p-8 sm:p-12 shadow-[0_14px_45px_-20px_rgba(0,0,0,0.28)] backdrop-blur">
                    <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl">
                        Making venue discovery and booking{" "}
                        <span style={{ color: BRAND }}>simple</span>.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-black/70">
                        VenueConnect helps you find venues, compare packages, and book your
                        event with clarity—without endless calls or confusing pricing.
                    </p>

                    {/* focus box */}
                    <div className="mt-10 rounded-3xl border border-black/10 bg-black/2 p-6 sm:p-7">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-sm font-semibold text-black">
                                What we focus on
                            </h2>
                            <span
                                className="rounded-full px-3 py-1 text-[11px] font-medium text-white"
                                style={{ backgroundColor: BRAND }}
                            >
                                Clear • Honest • Smooth
                            </span>
                        </div>

                        <ul className="mt-5 space-y-4 text-sm text-black/70">
                            <li className="flex gap-3">
                                <span
                                    className="mt-1.5 h-2 w-2 rounded-full"
                                    style={{ backgroundColor: BRAND }}
                                />
                                <span>Clear venue and package details</span>
                            </li>
                            <li className="flex gap-3">
                                <span
                                    className="mt-1.5 h-2 w-2 rounded-full"
                                    style={{ backgroundColor: BRAND }}
                                />
                                <span>Transparent per-plate pricing</span>
                            </li>
                            <li className="flex gap-3">
                                <span
                                    className="mt-1.5 h-2 w-2 rounded-full"
                                    style={{ backgroundColor: BRAND }}
                                />
                                <span>A smoother booking experience</span>
                            </li>
                        </ul>
                    </div>

                    {/* actions */}
                    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center rounded-xl border border-black/15 bg-white px-5 py-3 text-sm font-medium text-black/80 shadow-sm transition hover:bg-black/5"
                        >
                            Back to Home
                        </Link>

                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
                            style={{ backgroundColor: BRAND }}
                        >
                            Create an account
                        </Link>
                    </div>
                </div>

                {/* tiny footer */}
                <div className="mt-12 flex items-center justify-between text-xs text-black/50">
                    <span>© {new Date().getFullYear()} VenueConnect</span>
                    <span className="hidden sm:inline">
                        Built for a calmer planning flow
                    </span>
                </div>
            </section>
        </main>
    );
}