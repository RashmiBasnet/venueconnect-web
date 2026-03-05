"use client";

import Image from "next/image";
import Link from "next/link";
import type { BookingUI } from "../types";
import {
    asVenue,
    asPackage,
    formatEventDate,
    formatMoney,
    getImageUrl,
    paymentBadgeClass,
    statusBadgeClass,
} from "../booking-utils";

export default function BookingCard({ booking }: { booking: BookingUI }) {
    const venue = asVenue(booking.venueId);
    const pkg = asPackage(booking.packageId);

    const venueName = venue?.name || "Venue";
    const img = venue?.images?.[0];
    const area = venue?.address?.area;
    const city = venue?.address?.city || "Kathmandu";

    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="relative h-48 w-full bg-gray-100">
                <Image
                    src={getImageUrl(img)}
                    alt={venueName}
                    fill
                    className="object-cover"
                    sizes="100vw"
                />
            </div>

            <div className="p-4 space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {venueName}
                    </h3>
                    <p className="text-sm text-gray-600">
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

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between rounded-xl bg-gray-50 px-3 py-2">
                        <span className="text-gray-500">Event Date</span>
                        <span className="font-medium text-gray-900">
                            {formatEventDate(booking.eventDate)}
                        </span>
                    </div>

                    <div className="flex justify-between rounded-xl bg-gray-50 px-3 py-2">
                        <span className="text-gray-500">Time</span>
                        <span className="font-medium text-gray-900">
                            {booking.startTime || "—"}
                            {booking.endTime ? ` – ${booking.endTime}` : ""}
                        </span>
                    </div>

                    <div className="flex justify-between rounded-xl bg-gray-50 px-3 py-2">
                        <span className="text-gray-500">Guests</span>
                        <span className="font-medium text-gray-900">
                            {typeof booking.guests === "number"
                                ? booking.guests
                                : "—"}
                        </span>
                    </div>

                    <div className="flex justify-between rounded-xl bg-gray-50 px-3 py-2">
                        <span className="text-gray-500">Total</span>
                        <span className="font-medium text-gray-900">
                            {formatMoney(booking.totalPrice)}
                        </span>
                    </div>

                    <div className="flex justify-between rounded-xl bg-gray-50 px-3 py-2">
                        <span className="text-gray-500">Package</span>
                        <span className="font-medium text-gray-900">
                            {pkg?.name || "No package"}
                        </span>
                    </div>
                </div>

                <div className="pt-2">
                    <Link
                        href={`/user/booking/${booking._id}`}
                        className="block w-full text-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                    >
                        View booking details
                    </Link>
                </div>
            </div>
        </div>
    );
}