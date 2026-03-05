import PackageSearchBar from "./_components/PackageSearchBar";
import PackagesGrid from "./_components/PackagesGrid";
import { handleGetAllPackages } from "@/lib/actions/packages/packages-action";

export default async function Page({
    searchParams,
}: {
    searchParams?: Promise<{
        page?: string;
        search?: string;
    }>;
}) {
    const sp = await searchParams;
    const page = sp?.page ? parseInt(sp.page, 10) : 1;
    const search = sp?.search || "";

    const res = await handleGetAllPackages({
        page,
        size: 10,
        search,
    });

    if (!res.success) {
        return (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {res.message || "Failed to fetch packages"}
                </div>
            </div>
        );
    }

    return (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="-mt-10 mb-8 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                    Packages
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                    Browse packages offered by venues.
                </p>
            </div>

            <div className="mx-auto mb-8 w-full max-w-4xl">
                <PackageSearchBar initialSearch={search} />
            </div>

            <PackagesGrid packages={res.packages || []} />

            {!!res.pagination && (
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-slate-600">
                        Page{" "}
                        <span className="font-semibold text-[#233041]">
                            {res.pagination.page}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-[#233041]">
                            {res.pagination.totalPages}
                        </span>{" "}
                        • Total{" "}
                        <span className="font-semibold text-[#233041]">
                            {res.pagination.total}
                        </span>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <a
                            href={`/user/packages?page=${Math.max(
                                1,
                                res.pagination.page - 1
                            )}&search=${encodeURIComponent(search)}`}
                            className={`rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#233041] shadow-sm hover:bg-gray-50 transition ${res.pagination.page <= 1
                                ? "pointer-events-none opacity-50"
                                : ""
                                }`}
                        >
                            Prev
                        </a>

                        <a
                            href={`/user/packages?page=${Math.min(
                                res.pagination.totalPages,
                                res.pagination.page + 1
                            )}&search=${encodeURIComponent(search)}`}
                            className={`rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#233041] shadow-sm hover:bg-gray-50 transition ${res.pagination.page >= res.pagination.totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                                }`}
                        >
                            Next
                        </a>
                    </div>
                </div>
            )}
        </section>
    );
}