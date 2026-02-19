import VenuesGrid from "./_components/VenueGrid";
import { handleGetAllVenues } from "@/lib/actions/venues/venues-actions";
import Link from "next/link";

export default async function Page() {
    const result = await handleGetAllVenues();

    if (!result.success) {
        return (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {result.message || "Failed to fetch venues"}
                </div>
            </div>
        );
    }

    return (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                    Venues
                </h1>

                {/* Add Venue Button */}
                <Link
                    href="/admin/venues/add-venue"
                    className="inline-flex items-center justify-center rounded-lg bg-yellow-600 px-5 py-2.5
                               text-sm font-semibold text-white hover:bg-yellow-700 transition"
                >
                    + Add Venue
                </Link>
            </div>

            <VenuesGrid venues={result.data || []} />
        </section>
    );
}
