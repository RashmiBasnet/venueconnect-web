import BookingForm from "./_components/BookingForm";
import { handleGetVenueById } from "@/lib/actions/venues/venues-actions";
import { handleGetPackagesByVenue } from "@/lib/actions/packages/packages-action";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const venueRes = await handleGetVenueById(id);
    const pkgRes = await handleGetPackagesByVenue(id);

    if (!venueRes.success) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-10">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {venueRes.message || "Failed to load venue"}
                </div>
            </div>
        );
    }

    const venue = venueRes.data;
    const packages = pkgRes.success ? pkgRes.data : [];

    return (
        <section className="mx-auto max-w-7xl px-4 py-10">
            <BookingForm venue={venue} packages={packages} />
        </section>
    );
}