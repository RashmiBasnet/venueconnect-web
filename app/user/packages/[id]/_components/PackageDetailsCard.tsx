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
    if (Array.isArray(val)) return val.map(String).filter(Boolean);
    if (typeof val === "string")
        return val.split(",").map(s => s.trim()).filter(Boolean);
    return [];
}

function venueObj(pkg: any) {
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
            {/* Header */}
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
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200">
                            Inactive
                        </span>
                    ) : (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">
                            Active
                        </span>
                    )}

                    <Link
                        href={backHref}
                        className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#233041] shadow-sm hover:bg-gray-50 transition"
                    >
                        ← Back
                    </Link>
                </div>
            </div>

            {/* CONTENT */}
            <div className="space-y-6 p-6">
                {/* Cover */}
                <div className="overflow-hidden rounded-2xl border border-black/10 bg-gray-50">
                    <div className="relative h-64 w-full sm:h-72">
                        <Image
                            src={cover}
                            alt={pkg?.name || "Package image"}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                        <div className="absolute left-4 bottom-4">
                            <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#233041] shadow-sm">
                                NPR {pkg?.pricePerPlate ?? 0} / plate
                            </span>
                        </div>
                    </div>

                    {images.length > 1 && (
                        <div className="border-t border-black/10 bg-white p-3">
                            <div className="flex gap-3 overflow-x-auto">
                                {images.slice(0, 10).map((img, i) => (
                                    <div
                                        key={i}
                                        className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-black/10 bg-gray-50"
                                    >
                                        <Image
                                            src={getImageUrl(img)}
                                            alt={`Image ${i + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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
                    <h2 className="text-sm font-bold text-[#233041]">Inclusions</h2>

                    {inclusions.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {inclusions.map((item, i) => (
                                <span
                                    key={i}
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

                {/* Venue */}
                <div className="rounded-2xl border border-black/10 bg-white p-5">
                    <h2 className="text-sm font-bold text-[#233041]">Venue</h2>

                    <div className="mt-3 space-y-2 text-sm text-black">
                        <p><span className="font-semibold">Name:</span> {v?.name || "Unknown venue"}</p>
                        <p><span className="font-semibold">Address:</span> {v ? addressLine(v) : "N/A"}</p>

                        {v?.capacity && (
                            <p>
                                <span className="font-semibold">Capacity:</span>{" "}
                                {v.capacity.minGuests ?? 1}–{v.capacity.maxGuests ?? "?"} guests
                            </p>
                        )}

                        <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold border ${v?.isActive === false
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-green-50 text-green-700 border-green-200"
                                }`}
                        >
                            {v?.isActive === false ? "Venue inactive" : "Venue active"}
                        </span>
                    </div>
                </div>

                {/* Quick Summary */}
                <div className="rounded-2xl border border-black/10 bg-[#FBF8F5] p-5">
                    <h3 className="text-sm font-bold text-[#233041]">Quick Summary</h3>

                    <div className="mt-3 space-y-2 text-sm">
                        <div className="flex justify-between text-black">
                            <span>Price per plate</span>
                            <span className="font-semibold text-black">NPR {pkg?.pricePerPlate ?? 0}</span>
                        </div>
                        <div className="flex justify-between text-black">
                            <span>Inclusions</span>
                            <span className="font-semibold text-black">{inclusions.length}</span>
                        </div>
                        {pkg?.capacity?.maxGuests && (
                            <div className="flex justify-between">
                                <span>Max guests</span>
                                <span className="font-semibold text-black">{pkg.capacity.maxGuests}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}