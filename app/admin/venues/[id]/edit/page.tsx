import EditVenueForm from "./_components/EditVenueForm";
import { handleGetVenueById } from "@/lib/actions/venues/venues-actions";
import { handleGetPackagesByVenue } from "@/lib/actions/packages/packages-action";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: venueId } = await params;

    if (!venueId || venueId === "undefined") {
        return (
            <div className="mx-auto max-w-4xl px-4 py-10">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    Invalid venue id in URL
                </div>
            </div>
        );
    }

    const venueRes = await handleGetVenueById(venueId);
    const pkgRes = await handleGetPackagesByVenue(venueId);

    if (!venueRes.success) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-10">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {venueRes.message || "Failed to fetch venue"}
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 bg-white">
            <EditVenueForm
                venue={venueRes.data}
                initialPackages={pkgRes.success ? pkgRes.data || [] : []}
            />
        </div>
    );
}
