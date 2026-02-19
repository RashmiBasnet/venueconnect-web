"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { handleDeleteVenue } from "@/lib/actions/venues/venues-actions";

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
    capacity?: {
        minGuests?: number;
        maxGuests?: number;
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
    if (file.startsWith("http")) return file;

    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return "/images/placeholder-venue.jpg";

    const cleaned = file.replace(/^\/+/, "");
    if (cleaned.startsWith("uploads/")) return `${base}/${cleaned}`;
    return `${base}/uploads/${cleaned}`;
}

function priceLabel(v: Venue) {
    const p = v.pricing;
    if (!p?.basePrice) return "Price not set";
    const cur = p.currency || "NPR";

    const type =
        p.baseType === "PER_PLATE"
            ? "Per plate"
            : p.baseType === "PER_HOUR"
                ? "Per hour"
                : "Flat";

    return `${type}: ${cur} ${p.basePrice}`;
}

function VenueCard({ venue }: { venue: Venue }) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [deleting, setDeleting] = useState(false);

    const addressLine = useMemo(() => makeAddressLine(venue), [venue]);
    const img = getVenueImageUrl(venue.images?.[0]);

    const onDelete = async () => {
        const ok = confirm(`Delete "${venue.name}"?\nThis cannot be undone.`);
        if (!ok) return;

        try {
            setDeleting(true);
            const res = await handleDeleteVenue(venue._id);
            if (!res.success) throw new Error(res.message || "Failed to delete venue");

            toast.success("Venue deleted");
            startTransition(() => router.refresh());
        } catch (err: any) {
            toast.error(err.message || "Failed to delete venue");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <article className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
                {/* Image side */}
                <div className="relative h-[220px] md:h-full">
                    <Image
                        src={img}
                        alt={venue.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 280px"
                    />

                    {/* soft overlay for better contrast */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />

                    {/* Price pill on image */}
                    <div className="absolute left-4 bottom-4">
                        <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#233041] shadow-sm">
                            {priceLabel(venue)}
                        </span>
                    </div>
                </div>

                {/* Content side */}
                <div className="p-5 md:p-6">
                    {/* Top row */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <h3 className="truncate text-lg font-bold text-[#233041] sm:text-xl">
                                {venue.name}
                            </h3>

                            <p className="mt-1 text-sm text-slate-600">{addressLine}</p>

                            {/* meta */}
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center rounded-full border border-black/10 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                    {venue.capacity?.minGuests ?? 1}–{venue.capacity?.maxGuests ?? "?"} guests
                                </span>

                                <span className="inline-flex items-center rounded-full border border-black/10 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                    {venue.pricing?.baseType === "PER_PLATE"
                                        ? "Per plate"
                                        : venue.pricing?.baseType === "PER_HOUR"
                                            ? "Per hour"
                                            : "Flat"}
                                </span>

                                {venue?.images?.length ? (
                                    <span className="inline-flex items-center rounded-full border border-black/10 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                        {venue.images.length} photos
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-700">
                        {venue.description || "No description available."}
                    </p>

                    {/* Admin actions */}
                    <div className="mt-6 flex items-center gap-3">
                        <Link
                            href={`/admin/venues/${venue._id}/edit`}
                            className="inline-flex items-center justify-center rounded-lg border border-black/10 bg-white px-4 py-2
               text-sm font-semibold text-[#233041] hover:bg-gray-50 transition"
                        >
                            Edit
                        </Link>

                        <button
                            type="button"
                            onClick={onDelete}
                            disabled={deleting || pending}
                            className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2
               text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition"
                        >
                            {deleting || pending ? "Deleting..." : "Delete"}
                        </button>
                    </div>
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
            {venues.map((v) => (
                <VenueCard key={v._id} venue={v} />
            ))}
        </div>
    );
}
