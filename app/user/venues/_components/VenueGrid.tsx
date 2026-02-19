"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

type Venue = {
    _id: string;
    name: string;
    description?: string;
    address?: {
        area?: string;
        city?: string;
        country?: string;
        zipCode?: string;
    };
    pricing?: {
        baseType?: "PER_PLATE" | "FLAT" | "PER_HOUR";
        basePrice?: number;
        currency?: "NPR" | "USD" | "INR";
    };
    images?: string[];
};

function makeAddressLine(v: Venue) {
    const a = v.address || {};
    const parts = [a.area, a.city, a.zipCode].filter(Boolean);
    return parts.length ? parts.join(", ") : "Address not provided";
}

function getVenueImageUrl(file?: string) {
    if (!file) return "/images/placeholder-venue.jpg";

    // already absolute
    if (file.startsWith("http")) return file;

    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) {
        console.error("NEXT_PUBLIC_API_BASE_URL is missing");
        return "/images/placeholder-venue.jpg";
    }

    // DB might store:
    // "images-xxx.png" OR "/uploads/images-xxx.png"
    const cleaned = file.replace(/^\/+/, "");

    if (cleaned.startsWith("uploads/")) {
        return `${base}/${cleaned}`;
    }

    return `${base}/uploads/${cleaned}`;
}


function VenueCard({ venue, reverse }: { venue: Venue; reverse?: boolean }) {
    const addressLine = useMemo(() => makeAddressLine(venue), [venue]);
    const perPlate = venue.pricing?.basePrice ?? 0;
    const img = getVenueImageUrl(venue.images?.[0]);

    return (
        <article
            className={[
                "rounded-2xl bg-white/90",
                "shadow-[0_10px_30px_rgba(0,0,0,0.06)]",
                "border border-black/5",
                "p-5 md:p-6",
                "flex flex-col gap-5",
                "md:flex-row md:items-start md:gap-7",
                reverse ? "md:flex-row-reverse" : "",
            ].join(" ")}
        >
            {/* Image */}
            <div className="w-full md:w-[330px] shrink-0">
                <div className="relative h-[220px] w-full overflow-hidden rounded-2xl border border-black/10 bg-gray-50">
                    <Image
                        src={img}
                        alt={venue.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 330px"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900">{venue.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{addressLine}</p>

                <p className="mt-2 text-sm font-semibold text-[#B7795B]">
                    Per plate:- Rs. {perPlate}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-700">
                    {venue.description || "No description available."}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                        href={`/venues/${venue._id}/reserve`}
                        className="inline-flex items-center justify-center rounded-full bg-[#C9BDB3] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
                    >
                        Reserve Now
                    </Link>

                    <Link
                        href={`/venues/${venue._id}`}
                        className="inline-flex items-center justify-center rounded-full border border-[#C9BDB3] bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default function VenuesGrid({ venues }: { venues: Venue[] }) {
    if (!venues?.length) {
        return (
            <div className="rounded-xl border border-black/10 bg-white p-6 text-sm text-gray-600">
                No venues found.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {venues.map((v, idx) => (
                <VenueCard key={v._id} venue={v} reverse={idx % 2 === 1} />
            ))}
        </div>
    );
}
