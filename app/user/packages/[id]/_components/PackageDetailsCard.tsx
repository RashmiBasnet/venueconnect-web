// app/user/packages/[id]/_components/PackageDetailsCard.tsx
import Image from "next/image";
import Link from "next/link";

function getImageUrl(file?: string) {
    if (!file) return "/images/placeholder-venue.jpg";
    if (file.startsWith("http")) return file;

    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return "/images/placeholder-venue.jpg";

    const cleaned = file.replace(/^\/+/, "");
    if (cleaned.startsWith("uploads/")) return `${base}/${cleaned}`;
    return `${base}/uploads/${cleaned}`;
}

function safeArray(val: any): string[] {
    if (!val) return [];
    if (Array.isArray(val)) return val.map((x) => String(x)).filter(Boolean);
    if (typeof val === "string")
        return val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    return [];
}

function venueObj(pkg: any) {
    // if populated venueId (object) else null
    if (pkg?.venueId && typeof pkg.venueId === "object") return pkg.venueId;
    return null;
}

function addressLine(v: any) {
    const a = v?.address || {};
    const parts = [a.area, a.city, a.zipCode].filter(Boolean);
    return parts.length ? parts.join(", ") : "Address not provided";
}

export default function PackageDetailsCard({
    pkg,
    backHref = "/user/packages",
}: {
    pkg: any;
    backHref?: string;
}) {
    const v = venueObj(pkg);
    const images: string[] = Array.isArray(pkg?.images) ? pkg.images : [];
    const cover = getImageUrl(images[0]);
    const inclusions = safeArray(pkg?.inclusions);

    return (
        <section className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between gap-3 border-b border-black/10 px-6 py-4">
                <div className="min-w-0">
                    <h1 className="truncate text-lg font-bold text-[#233041]">
                        {pkg?.name || "Package Details"}
                    </h1>
                    <p className="mt-0.5 text-sm text-slate-600 truncate">
                        Offered by{" "}
                        <span className="font-semibold text-[#233041]">
                            {v?.name || "Unknown venue"}
                        </span>
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {pkg?.isActive === false ? (
                        <span className="shrink-0 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200">
                            Inactive
                        </span>
                    ) : (
                        <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">
                            Active
                        </span>
                    )}

                    <Link
                        href={backHref}
                        className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#233041] shadow-sm hover:bg-gray-50 hover:shadow transition"
                    >
                        <span className="text-base leading-none">←</span>
                        Back
                    </Link>
                </div>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-6 p-6">
                {/* LEFT: Package */}
                <div className="space-y-6">
                    {/* Cover */}
                    <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-gray-50">
                        <div className="relative h-64 w-full sm:h-72">
                            <Image
                                src={cover}
                                alt={pkg?.name || "Package image"}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 720px"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 via-black/10 to-transparent" />
                            <div className="absolute left-4 bottom-4 flex flex-wrap gap-2">
                                <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#233041] shadow-sm">
                                    NPR {pkg?.pricePerPlate ?? 0} / plate
                                </span>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 ? (
                            <div className="border-t border-black/10 bg-white p-3">
                                <div className="flex gap-3 overflow-x-auto">
                                    {images.slice(0, 10).map((img: string, i: number) => (
                                        <div
                                            key={`${img}-${i}`}
                                            className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-black/10 bg-gray-50"
                                            title="Package photo"
                                        >
                                            <Image
                                                src={getImageUrl(img)}
                                                alt={`Package image ${i + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="96px"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Description */}
                    <div className="rounded-2xl border border-black/10 bg-white p-5">
                        <h2 className="text-sm font-bold text-[#233041]">Description</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                            {pkg?.description || "No description available."}
                        </p>
                    </div>

                    {/* Inclusions */}
                    <div className="rounded-2xl border border-black/10 bg-white p-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-[#233041]">Inclusions</h2>
                            <span className="text-xs font-semibold text-slate-600">
                                {inclusions.length ? `${inclusions.length} items` : "No inclusions"}
                            </span>
                        </div>

                        {inclusions.length ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {inclusions.map((item, idx) => (
                                    <span
                                        key={`${item}-${idx}`}
                                        className="rounded-full border border-black/10 bg-gray-50 px-3 py-1 text-xs font-semibold text-slate-700"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-2 text-sm text-slate-600">No inclusions listed.</p>
                        )}
                    </div>
                </div>

                {/* RIGHT: Venue */}
                <aside className="space-y-6">
                    <div className="rounded-2xl border border-black/10 bg-white p-5">
                        <h2 className="text-sm font-bold text-[#233041]">Venue</h2>

                        <div className="mt-3 space-y-2">
                            <div>
                                <p className="text-xs font-semibold text-slate-600">Name</p>
                                <p className="text-sm font-bold text-[#233041]">
                                    {v?.name || "Unknown venue"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-slate-600">Address</p>
                                <p className="text-sm text-slate-700">
                                    {v ? addressLine(v) : "Address not available"}
                                </p>
                            </div>

                            {v?.capacity?.minGuests || v?.capacity?.maxGuests ? (
                                <div>
                                    <p className="text-xs font-semibold text-slate-600">Venue Capacity</p>
                                    <p className="text-sm text-slate-700">
                                        {v?.capacity?.minGuests ?? 1}–{v?.capacity?.maxGuests ?? "?"} guests
                                    </p>
                                </div>
                            ) : null}

                            <div className="pt-2">
                                {v?.isActive === false ? (
                                    <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200">
                                        Venue inactive
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">
                                        Venue active
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick summary */}
                    <div className="rounded-2xl border border-black/10 bg-[#FBF8F5] p-5">
                        <h3 className="text-sm font-bold text-[#233041]">Quick Summary</h3>

                        <div className="mt-3 space-y-2 text-sm text-slate-700">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">Price per plate</span>
                                <span className="font-semibold text-[#233041]">
                                    NPR {pkg?.pricePerPlate ?? 0}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">Inclusions</span>
                                <span className="font-semibold text-[#233041]">
                                    {inclusions.length || 0}
                                </span>
                            </div>

                            {pkg?.capacity?.maxGuests ? (
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600">Max guests</span>
                                    <span className="font-semibold text-[#233041]">
                                        {pkg.capacity.maxGuests}
                                    </span>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
}