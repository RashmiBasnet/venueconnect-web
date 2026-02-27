import Link from "next/link";
import { Search, ArrowUpRight, Package } from "lucide-react";

import { handleGetAllPackages } from "@/lib/actions/packages/packages-action";

const BRAND = "#AE8E54";

type SearchParams = { page?: string; size?: string; search?: string };

export default async function AdminPackagesPage({
    searchParams,
}: {
    searchParams?: Promise<SearchParams>;
}) {
    const sp = (await searchParams) ?? {};

    const page = Number(sp.page ?? 1);
    const size = Number(sp.size ?? 10);
    const search = String(sp.search ?? "");

    const res = await handleGetAllPackages({ page, size, search });

    const packages = res?.success ? (res.packages ?? []) : [];
    const p = res?.success ? res.pagination : null;

    const total = Number(p?.total ?? 0);
    const totalPages = Number(p?.totalPages ?? 1);

    const baseParams = (
        next: Partial<{ page: number; size: number; search: string }>
    ) => {
        const usp = new URLSearchParams();
        usp.set("page", String(next.page ?? page));
        usp.set("size", String(next.size ?? size));
        usp.set("search", String(next.search ?? search));
        return `?${usp.toString()}`;
    };

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="mt-2 text-4xl font-semibold text-black sm:text-4xl">
                        Packages
                    </h1>
                    <p className="mt-1 text-sm text-black/60">
                        Showing {packages.length} of {total} packages
                    </p>
                </div>

                <Link
                    href="/admin"
                    className="inline-flex w-fit items-center justify-center rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-medium text-black/80 shadow-sm hover:bg-black/5"
                >
                    Back to Dashboard
                </Link>
            </div>

            {/* Search */}
            <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                <form
                    action="/admin/packages"
                    className="flex flex-col gap-3 sm:flex-row sm:items-center"
                >
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
                        <input
                            name="search"
                            defaultValue={search}
                            placeholder="Search packages (name, etc.)"
                            className="w-full rounded-xl border border-black/10 bg-white px-9 py-2.5 text-sm text-black outline-none focus:ring-2 focus:ring-black/10"
                        />
                    </div>

                    <input type="hidden" name="page" value="1" />
                    <input type="hidden" name="size" value={String(size)} />

                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-95"
                        style={{ backgroundColor: BRAND }}
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Table */}
            <div className="mt-4 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                    <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" style={{ color: BRAND }} />
                        <h2 className="text-sm font-semibold text-black">Packages</h2>
                    </div>
                    <div className="text-xs text-black/60">
                        Page {page} of {totalPages}
                    </div>
                </div>

                <table className="w-full text-left text-sm">
                    <thead className="bg-black/2 text-xs text-black/60">
                        <tr>
                            <th className="px-5 py-3">Name</th>
                            <th className="px-5 py-3">Venue</th>
                            <th className="px-5 py-3">Per Plate</th>
                            <th className="px-5 py-3">Active</th>
                            <th className="px-5 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10">
                        {packages.length ? (
                            packages.map((pkg: any) => (
                                <tr key={String(pkg?._id)} className="hover:bg-black/2">
                                    <td className="px-5 py-3">
                                        <div className="font-medium text-black">{pkg?.name ?? "—"}</div>
                                        <div className="text-xs text-black/60">{String(pkg?._id ?? "")}</div>
                                    </td>
                                    <td className="px-5 py-3 text-black/80">
                                        {pkg?.venueId?.name ?? pkg?.venue?.name ?? "—"}
                                    </td>
                                    <td className="px-5 py-3 text-black/80">
                                        {pkg?.pricePerPlate != null ? `Rs. ${pkg.pricePerPlate}` : "—"}
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs text-black/70">
                                            {String(pkg?.isActive ?? true)}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <button
                                            className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                                            style={{ color: BRAND }}
                                        >
                                            View <ArrowUpRight className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="px-5 py-10 text-sm text-black/60" colSpan={5}>
                                    No packages found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-black/10 px-5 py-4">
                    <div className="text-xs text-black/60">
                        Total: {total} • Size: {size}
                    </div>
                    <div className="flex gap-2">
                        <Link
                            aria-disabled={page <= 1}
                            className={`rounded-xl border px-4 py-2 text-sm ${page <= 1
                                ? "pointer-events-none border-black/10 text-black/30"
                                : "border-black/15 text-black/80 hover:bg-black/5"
                                }`}
                            href={baseParams({ page: Math.max(1, page - 1) })}
                        >
                            Prev
                        </Link>
                        <Link
                            aria-disabled={page >= totalPages}
                            className={`rounded-xl border px-4 py-2 text-sm ${page >= totalPages
                                ? "pointer-events-none border-black/10 text-black/30"
                                : "border-black/15 text-black/80 hover:bg-black/5"
                                }`}
                            href={baseParams({ page: Math.min(totalPages, page + 1) })}
                        >
                            Next
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}