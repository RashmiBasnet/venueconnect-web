"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { VenueType } from "../../schema/venue-schema";

function makeAddressLine(v: VenueType) {
    const a = v.address || {};
    const parts = [a.area, a.city, a.zipCode].filter(Boolean);
    return parts.length ? parts.join(", ") : "Address not provided";
}

function getVenueImageUrl(file?: string) {
    if (!file) return "/images/placeholder-venue.jpg";
    if (file.startsWith("http")) return file;

    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return "/images/placeholder-venue.jpg";

    const cleaned = file.replace(/^\/+/, "");
    if (cleaned.startsWith("uploads/")) return `${base}/${cleaned}`;
    return `${base}/uploads/${cleaned}`;
}

function formatNpr(n: number) {
    if (!Number.isFinite(n)) return "0";
    return new Intl.NumberFormat("en-NP").format(n);
}

function VenueCard({ venue }: { venue: VenueType }) {
    const addressLine = useMemo(() => makeAddressLine(venue), [venue]);
    const perPlate = venue.pricePerPlate ?? 0;
    const img = getVenueImageUrl(venue.images?.[0]);

    return (
        <article className="group overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm transition hover:shadow-md">
            {/* Image */}
            <div className="relative h-56 w-full">
                <Image
                    src={img}
                    alt={venue.name}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 560px"
                />

                {/* Overlay */}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />

                {/* Price pill */}
                <div className="absolute left-4 bottom-4">
                    <span className="inline-flex items-center rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-[#233041] shadow-sm">
                        Per plate: NPR {formatNpr(perPlate)}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 md:p-6 flex min-h-65 flex-col">
                {/* Top */}
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="truncate text-lg font-extrabold tracking-tight text-[#233041]">
                            {venue.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                            {addressLine}
                        </p>
                    </div>

                    {venue.isActive === false ? (
                        <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 border border-red-200">
                            Inactive
                        </span>
                    ) : (
                        <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 border border-green-200">
                            Open
                        </span>
                    )}
                </div>

                {/* Description */}
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-700 min-h-18">
                    {venue.description || "No description available."}
                </p>

                <div className="mt-auto">
                    {/* Indicators */}
                    <div className="mt-5 flex flex-wrap gap-2">
                        <span className="rounded-full border border-black/10 bg-gray-50 px-3 py-1 text-xs font-semibold text-slate-700">
                            {venue.capacity?.minGuests ?? 1}–{venue.capacity?.maxGuests ?? "?"} guests
                        </span>

                        {venue.images?.length ? (
                            <span className="rounded-full border border-black/10 bg-gray-50 px-3 py-1 text-xs font-semibold text-slate-700">
                                {venue.images.length} photos
                            </span>
                        ) : null}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <Link
                            href={`/user/venues/${venue._id}/reserve`}
                            className="inline-flex w-full items-center justify-center rounded-xl bg-[#233041] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95 transition"
                        >
                            Reserve Now
                        </Link>

                        <Link
                            href={`/user/venues/${venue._id}`}
                            className="inline-flex w-full items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-[#233041] hover:bg-gray-50 transition"
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function VenuesGrid({ venues }: { venues: VenueType[] }) {
    if (!venues?.length) {
        return (
            <div className="rounded-xl border border-black/10 bg-white p-6 text-sm text-gray-600">
                No venues found.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {venues.map((v) => (
                <VenueCard key={v._id} venue={v} />
            ))}
        </div>
    );
}