"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { VenueType } from "../../../schema/venue-schema";

function getVenueImageUrl(file?: string) {
    if (!file) return "/images/placeholder-venue.jpg";
    if (file.startsWith("http")) return file;

    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return "/images/placeholder-venue.jpg";

    const cleaned = file.replace(/^\/+/, "");
    if (cleaned.startsWith("uploads/")) return `${base}/${cleaned}`;
    return `${base}/uploads/${cleaned}`;
}

function makeAddressLine(v: VenueType) {
    const a = v.address || {};
    const parts = [a.area, a.city, a.zipCode].filter(Boolean);
    return parts.length ? parts.join(", ") : "Address not provided";
}

function formatNpr(n?: number) {
    const val = typeof n === "number" && Number.isFinite(n) ? n : 0;
    return new Intl.NumberFormat("en-NP").format(val);
}

function safeAmenities(val: any): string[] {
    if (!val) return [];
    if (Array.isArray(val)) return val.map((x) => String(x).trim()).filter(Boolean);
    if (typeof val === "string")
        return val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    return [];
}

export default function VenueDetailsCard({
    venue,
    backHref = "/user/venues",
    reserveHref,
}: {
    venue: VenueType;
    backHref?: string;
    reserveHref?: string;
}) {
    const images = useMemo(() => (Array.isArray(venue.images) ? venue.images : []), [venue.images]);
    const urls = useMemo(() => images.map((x) => getVenueImageUrl(x)), [images]);

    const cover = urls[0] || "/images/placeholder-venue.jpg";
    const address = makeAddressLine(venue);
    const amenities = safeAmenities((venue as any).amenities);

    const capMin = venue.capacity?.minGuests ?? 1;
    const capMax = venue.capacity?.maxGuests ?? undefined;

    // Lightbox state 
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);

    const openAt = (idx: number) => {
        if (!urls.length) return;
        const safeIdx = Math.min(Math.max(idx, 0), urls.length - 1);
        setActive(safeIdx);
        setOpen(true);
    };

    const close = () => setOpen(false);

    const prev = () => setActive((i) => (urls.length ? (i - 1 + urls.length) % urls.length : 0));
    const next = () => setActive((i) => (urls.length ? (i + 1) % urls.length : 0));

    useEffect(() => {
        if (!open) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, urls.length]);

    useEffect(() => {
        if (!open) return;
        // prevent body scroll while modal open
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, [open]);

    return (
        <>
            <section className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between gap-3 border-b border-black/10 px-6 py-4">
                    <div className="min-w-0">
                        <h1 className="truncate text-lg font-bold text-[#233041]">{venue.name}</h1>
                        <p className="mt-0.5 text-sm text-slate-600 line-clamp-2">{address}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {venue.isActive === false ? (
                            <span className="shrink-0 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200">
                                Inactive
                            </span>
                        ) : (
                            <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">
                                Open
                            </span>
                        )}

                        <Link
                            href={backHref}
                            className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#233041] shadow-sm hover:bg-gray-50 hover:shadow transition"
                        >
                            <span className="text-base leading-none">←</span>
                            Back
                        </Link>
                    </div>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
                    {/* LEFT */}
                    <div className="space-y-6">
                        {/* Cover */}
                        <div className="overflow-hidden rounded-3xl border border-black/10 bg-gray-50">
                            <button
                                type="button"
                                onClick={() => openAt(0)}
                                className="group relative block h-72 w-full text-left"
                                aria-label="Open image gallery"
                            >
                                <Image
                                    src={cover}
                                    alt={venue.name}
                                    fill
                                    className="object-cover transition duration-300 group-hover:scale-[1.01]"
                                    sizes="(max-width: 1024px) 100vw, 760px"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />

                                <div className="absolute left-4 bottom-4 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-[#233041] shadow-sm">
                                        Per plate: NPR {formatNpr(venue.pricePerPlate)}
                                    </span>

                                    <span className="inline-flex items-center rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-[#233041] shadow-sm">
                                        {capMin}–{capMax ?? "?"} guests
                                    </span>

                                    {urls.length ? (
                                        <span className="inline-flex items-center rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-[#233041] shadow-sm">
                                            {urls.length} photos
                                        </span>
                                    ) : null}

                                    {urls.length > 1 ? (
                                        <span className="inline-flex items-center rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-[#233041] shadow-sm">
                                            Click to view gallery
                                        </span>
                                    ) : null}
                                </div>
                            </button>

                            {/* Thumbnails */}
                            {urls.length > 1 ? (
                                <div className="border-t border-black/10 bg-white p-3">
                                    <div className="flex gap-3 overflow-x-auto">
                                        {urls.slice(0, 12).map((src, i) => (
                                            <button
                                                key={`${src}-${i}`}
                                                type="button"
                                                onClick={() => openAt(i)}
                                                className="relative h-16 w-24 shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-gray-50 hover:opacity-95"
                                                aria-label={`Open image ${i + 1}`}
                                            >
                                                <Image
                                                    src={src}
                                                    alt={`Venue image ${i + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="96px"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {/* Description */}
                        <div className="rounded-3xl border border-black/10 bg-white p-5">
                            <h2 className="text-sm font-bold text-[#233041]">About this venue</h2>
                            <p className="mt-2 text-sm leading-7 text-slate-700">
                                {venue.description || "No description available."}
                            </p>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <aside className="space-y-6">
                        {/* Venue info */}
                        <div className="rounded-3xl border border-black/10 bg-[#FBF8F5] p-5">
                            <h2 className="text-sm font-bold text-[#233041]">Venue details</h2>

                            <div className="mt-4 space-y-3 text-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <span className="text-slate-600">Address</span>
                                    <span className="text-right font-semibold text-[#233041] max-w-[65%]">
                                        {address}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-slate-600">Per plate</span>
                                    <span className="font-semibold text-[#233041]">
                                        NPR {formatNpr(venue.pricePerPlate)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-slate-600">Capacity</span>
                                    <span className="font-semibold text-[#233041]">
                                        {capMin}–{capMax ?? "?"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-slate-600">Status</span>
                                    {venue.isActive === false ? (
                                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200">
                                            Inactive
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">
                                            Open
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="rounded-3xl border border-black/10 bg-white p-5">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-bold text-[#233041]">Amenities</h2>
                                <span className="text-xs font-semibold text-slate-600">
                                    {amenities.length ? `${amenities.length} items` : "None"}
                                </span>
                            </div>

                            {amenities.length ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {amenities.map((a, i) => (
                                        <span
                                            key={`${a}-${i}`}
                                            className="rounded-full border border-black/10 bg-gray-50 px-3 py-1 text-xs font-semibold text-slate-700"
                                        >
                                            {a}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-2 text-sm text-slate-600">No amenities listed.</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="rounded-3xl border border-black/10 bg-white p-5">
                            <h2 className="text-sm font-bold text-[#233041]">Actions</h2>

                            <div className="mt-4 grid grid-cols-1 gap-2">
                                <Link
                                    href={reserveHref || `/user/venues/${venue._id}/booking`}
                                    className="inline-flex w-full items-center justify-center rounded-xl bg-[#233041] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95 transition"
                                >
                                    Book Now
                                </Link>

                                <Link
                                    href={`/user/packages?search=${encodeURIComponent(venue.name)}`}
                                    className="inline-flex w-full items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-[#233041] hover:bg-gray-50 transition"
                                >
                                    View Packages
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            {/* Lightbox */}
            {open && urls.length > 0 ? (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) close();
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Venue image gallery"
                >
                    <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b0f17] shadow-2xl">
                        {/* Top bar */}
                        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-white">
                                    {venue.name}
                                </p>
                                <p className="text-xs text-white/70">
                                    {active + 1} / {urls.length}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={close}
                                className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
                            >
                                Close ✕
                            </button>
                        </div>

                        {/* Image area */}
                        <div className="relative h-[70vh] w-full">
                            <Image
                                src={urls[active]}
                                alt={`Venue image ${active + 1}`}
                                fill
                                className="object-contain"
                                sizes="(max-width: 1024px) 100vw, 1024px"
                                priority
                            />
                        </div>

                        {/* Controls */}
                        {urls.length > 1 ? (
                            <>
                                <button
                                    type="button"
                                    onClick={prev}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15"
                                    aria-label="Previous image"
                                >
                                    ←
                                </button>

                                <button
                                    type="button"
                                    onClick={next}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15"
                                    aria-label="Next image"
                                >
                                    →
                                </button>
                            </>
                        ) : null}

                        {/* Bottom thumbnails */}
                        {urls.length > 1 ? (
                            <div className="border-t border-white/10 bg-white/5 p-3">
                                <div className="flex gap-2 overflow-x-auto">
                                    {urls.map((src, i) => (
                                        <button
                                            key={`${src}-${i}`}
                                            type="button"
                                            onClick={() => setActive(i)}
                                            className={[
                                                "relative h-14 w-20 shrink-0 overflow-hidden rounded-2xl border",
                                                i === active
                                                    ? "border-white/60"
                                                    : "border-white/10 hover:border-white/30",
                                            ].join(" ")}
                                            aria-label={`Go to image ${i + 1}`}
                                        >
                                            <Image
                                                src={src}
                                                alt={`Thumb ${i + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : null}
        </>
    );
}