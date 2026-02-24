import Link from "next/link";
import Image from "next/image";

function venueName(pkg: any) {
    if (pkg?.venueId && typeof pkg.venueId === "object") {
        return pkg.venueId.name || "Unknown venue";
    }
    return "Unknown venue";
}

function getPackageImageUrl(file?: string) {
    if (!file) return "/images/placeholder-venue.jpg";
    if (file.startsWith("http")) return file;

    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return "/images/placeholder-venue.jpg";

    const cleaned = file.replace(/^\/+/, "");
    if (cleaned.startsWith("uploads/")) return `${base}/${cleaned}`;
    return `${base}/uploads/${cleaned}`;
}

export default function PackageCard({ pkg }: { pkg: any }) {
    const vName = venueName(pkg);
    const img = getPackageImageUrl(pkg?.images?.[0]);

    return (
        <article className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
                {/* Image */}
                <div className="relative h-48 w-full md:h-full">
                    <Image
                        src={img}
                        alt={pkg?.name || "Package image"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 240px"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 via-black/10 to-transparent" />

                    <div className="absolute left-4 bottom-4">
                        <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#233041] shadow-sm">
                            NPR {pkg?.pricePerPlate ?? 0} / plate
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6 flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h3 className="truncate text-lg font-bold text-[#233041]">
                                {pkg?.name || "Untitled package"}
                            </h3>

                            <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                                Offered by{" "}
                                <span className="font-semibold text-[#233041]">
                                    {vName}
                                </span>
                            </p>
                        </div>

                        {pkg?.isActive === false ? (
                            <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 border border-red-200">
                                Inactive
                            </span>
                        ) : (
                            <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 border border-green-200">
                                Active
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-700">
                        {pkg?.description || "No description available."}
                    </p>

                    {/* Meta */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        {Array.isArray(pkg?.inclusions) && pkg.inclusions.length ? (
                            <span className="rounded-full border border-black/10 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                {pkg.inclusions.length} inclusions
                            </span>
                        ) : null}
                    </div>

                    {/* Actions */}
                    <div className="mt-auto pt-6 flex justify-end">
                        <Link
                            href={`/user/packages/${pkg._id}`}
                            className="inline-flex items-center justify-center rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#233041] hover:bg-gray-50 transition"
                        >
                            View
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}