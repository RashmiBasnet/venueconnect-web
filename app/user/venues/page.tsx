import VenuesGrid from "./_components/VenueGrid";
import { handleGetAllVenues } from "@/lib/actions/venues/venues-actions";

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
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                    Venues
                </h1>
            </div>

            <VenuesGrid venues={result.data || []} />
        </section>
    );
}
