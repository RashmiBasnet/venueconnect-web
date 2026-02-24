import PackageDetailsCard from "./_components/PackageDetailsCard";
import { handleGetPackageById } from "@/lib/actions/packages/packages-action";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const res = await handleGetPackageById(id);

    if (!res.success) {
        return (
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 bg-white">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {res.message || "Failed to fetch package"}
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 bg-white">
            <PackageDetailsCard pkg={res.data} backHref="/user/packages" />
        </div>
    );
}