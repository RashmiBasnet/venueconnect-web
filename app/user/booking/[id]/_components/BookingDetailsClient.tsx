"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useTransition } from "react";
import { toast } from "sonner";

import type { BookingUI } from "../../../activity/types";
import {
    asVenue,
    asPackage,
    formatEventDate,
    formatMoney,
    getImageUrl,
    paymentBadgeClass,
    statusBadgeClass,
} from "../../../activity/booking-utils";

import { handleInitiateKhaltiPayment } from "@/lib/actions/payment/payment-action";

const BRAND = "#AE8E54";
const DARK = "#233041";

export default function BookingDetailsClient({ booking }: { booking: BookingUI }) {
    const [pending, startTransition] = useTransition();

    const venue = asVenue(booking.venueId);
    const pkg = asPackage(booking.packageId);

    const venueName = venue?.name || "Venue";
    const img = venue?.images?.[0];
    const area = venue?.address?.area;
    const city = venue?.address?.city || "Kathmandu";

    const isUnpaid = String(booking?.paymentStatus || "").toLowerCase() === "unpaid";
    const isPaid = String(booking?.paymentStatus || "").toLowerCase() === "paid";

    const payAmount = useMemo(() => {
        const n = Number(booking?.totalPrice ?? 0);
        return Number.isFinite(n) ? n : 0;
    }, [booking?.totalPrice]);

    const handlePayNow = () => {
        if (!isUnpaid) return;

        startTransition(async () => {
            try {
                const origin =
                    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

                const returnUrl = `${origin}/payment/success`;

                const res = await handleInitiateKhaltiPayment({
                    bookingId: booking._id,
                    amount: payAmount,
                    returnUrl,
                } as any);

                if (!res?.success) {
                    toast.error(res?.message || "Failed to initiate payment");
                    return;
                }

                const paymentUrl = res?.data?.paymentUrl;
                if (!paymentUrl) {
                    toast.error("Payment URL not received from server");
                    return;
                }

                toast.success("Redirecting to Khalti…");
                window.location.href = paymentUrl;
            } catch (err: any) {
                toast.error(err?.message || "Payment initiation failed");
            }
        });
    };

    return (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Top bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Booking Details</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Booking ID: <span className="font-medium text-gray-900">{String(booking._id)}</span>
                    </p>
                </div>

                <div className="flex gap-2">
                    <Link
                        href="/user/activity"
                        className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50"
                    >
                        Back to Activity
                    </Link>
                </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-12">
                {/* LEFT: Main card */}
                <div className="lg:col-span-8">
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        {/* Image */}
                        <div className="relative h-56 w-full bg-gray-100">
                            <Image
                                src={getImageUrl(img)}
                                alt={venueName}
                                fill
                                className="object-cover"
                                sizes="100vw"
                            />
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">{venueName}</h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        {area ? `${area}, ` : ""}
                                        {city}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <span
                                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${statusBadgeClass(
                                            booking.status
                                        )}`}
                                    >
                                        {String(booking.status || "—")}
                                    </span>
                                    <span
                                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${paymentBadgeClass(
                                            booking.paymentStatus
                                        )}`}
                                    >
                                        {String(booking.paymentStatus || "—")}
                                    </span>
                                </div>
                            </div>

                            {/* Details grid */}
                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                <InfoRow label="Event Date" value={formatEventDate(booking.eventDate)} />
                                <InfoRow
                                    label="Time"
                                    value={`${booking.startTime || "—"}${booking.endTime ? ` – ${booking.endTime}` : ""}`}
                                />
                                <InfoRow
                                    label="Guests"
                                    value={typeof booking.guests === "number" ? String(booking.guests) : "—"}
                                />
                                <InfoRow label="Package" value={pkg?.name || "No package"} />
                                <InfoRow label="Price / plate" value={formatMoney(booking.pricePerPlate)} />
                                <InfoRow label="Total" value={formatMoney(booking.totalPrice)} />
                            </div>

                            {/* Pay area */}
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="text-sm text-gray-600">
                                    {isPaid ? (
                                        <span className="font-medium text-gray-900">
                                            Payment completed ✅
                                        </span>
                                    ) : isUnpaid ? (
                                        <span>
                                            Payment pending. You can pay now to confirm faster.
                                        </span>
                                    ) : (
                                        <span>Payment status: {String(booking.paymentStatus || "—")}</span>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={handlePayNow}
                                    disabled={!isUnpaid || pending || payAmount <= 0}
                                    className={[
                                        "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm",
                                        "disabled:opacity-60 disabled:cursor-not-allowed",
                                    ].join(" ")}
                                    style={{ backgroundColor: BRAND }}
                                >
                                    {pending ? "Redirecting..." : "Pay with Khalti"}
                                </button>
                            </div>

                            {/* tiny hint */}
                            {isUnpaid ? (
                                <p className="mt-3 text-xs text-gray-500">
                                    Payment link expires quickly (Khalti test). If it expires, press “Pay with Khalti” again to generate a new one.
                                </p>
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Summary card */}
                <div className="lg:col-span-4">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-900">Summary</h3>

                        <div className="mt-4 space-y-3 text-sm">
                            <SummaryLine label="Venue" value={venueName} />
                            <SummaryLine label="Package" value={pkg?.name || "No package"} />
                            <SummaryLine label="Guests" value={String(booking.guests ?? "—")} />
                            <SummaryLine label="Total" value={formatMoney(booking.totalPrice)} />
                        </div>

                        <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                            <p className="text-xs font-medium text-gray-700">What happens next?</p>
                            <ul className="mt-2 list-disc pl-5 text-xs text-gray-600 space-y-1">
                                <li>After payment, your booking will show as “paid”.</li>
                                <li>Admin can then confirm the booking (status: confirmed).</li>
                                <li>You can track everything in Activity.</li>
                            </ul>
                        </div>

                        <div className="mt-5">
                            <Link
                                href="/user/activity"
                                className="inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
                                style={{ backgroundColor: DARK }}
                            >
                                Go to Activity
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
            <span className="text-sm text-gray-600">{label}</span>
            <span className="text-sm font-semibold text-gray-900">{value}</span>
        </div>
    );
}

function SmallRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white px-3 py-2">
            <p className="text-[11px] font-medium text-gray-600">{label}</p>
            <p className="mt-0.5 text-sm font-semibold text-gray-900">{value}</p>
        </div>
    );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-gray-600">{label}</span>
            <span className="font-semibold text-gray-900">{value}</span>
        </div>
    );
}
