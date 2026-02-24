import PackageCard from "./PackageCard";

export default function PackagesGrid({ packages }: { packages: any[] }) {
    if (!packages?.length) {
        return (
            <div className="rounded-xl border border-black/10 bg-white p-6 text-sm text-gray-600">
                No packages found.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {packages.map((p) => (
                <PackageCard key={p._id} pkg={p} />
            ))}
        </div>
    );
}