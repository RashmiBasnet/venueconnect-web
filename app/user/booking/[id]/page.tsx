import Link from "next/link";
import { handleGetMyBookingById } from "@/lib/actions/booking/booking-actions";
import BookingDetailsClient from "./_components/BookingDetailsClient";

export default async function BookingDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const bookingId = id;

    const res = await handleGetMyBookingById(bookingId);

    if (!res?.success || !res?.data) {
        return (
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <h1 className="text-xl font-semibold text-gray-900">Booking not found</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        We couldn’t load this booking. It may not exist or you may not have access.
                    </p>

                    <div className="mt-6">
                        <Link
                            href="/user/activity"
                            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50"
                        >
                            Back to Activity
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return <BookingDetailsClient booking={res.data} />;
}