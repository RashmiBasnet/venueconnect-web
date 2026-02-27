import Link from "next/link";
import Image from "next/image";

import { handleGetAllPackages } from "@/lib/actions/packages/packages-action";
import { handleGetAllVenues } from "@/lib/actions/venues/venues-actions";

function getImageUrl(files?: any): string {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";

    const pickFirst = (val: any): string | undefined => {
        if (!val) return undefined;
        if (typeof val === "string") return val;
        if (Array.isArray(val)) return val[0];
        if (typeof val === "object") {
            if (Array.isArray(val.images)) return val.images[0];
            if (Array.isArray(val.files)) return val.files[0];
        }
        return undefined;
    };

    const file = pickFirst(files);
    if (!file) return "/images/placeholder-venue.jpg";
    if (typeof file === "string" && file.startsWith("http")) return file;

    const cleaned = String(file).replace(/^\/+/, "");
    if (!apiBase) return `/${cleaned}`;
    if (cleaned.startsWith("uploads/")) return `${apiBase}/${cleaned}`;
    return `${apiBase}/uploads/${cleaned}`;
}

function formatAddress(v: any) {
    const a = v?.address;
    if (!a) return v?.location || v?.address || "";

    const lines = [
        a.area,
        a.city,
        a.country,
        a.zipCode ? `ZIP: ${a.zipCode}` : "",
    ].filter(Boolean);

    return lines.join("\n");
}

export default async function Home() {
    const packagesRes = await handleGetAllPackages({ page: 1, size: 4, search: "" });
    const packages = packagesRes.success ? packagesRes.packages ?? [] : [];

    const venuesRes = await handleGetAllVenues();
    const venuesAll = venuesRes.success ? venuesRes.data ?? [] : [];
    const venues = venuesAll.slice(0, 4);

    return (
        <main className="min-h-screen bg-white text-[#233041]">
            {/* Hero */}
            <section className="bg-white -mt-10">
                <div className="mx-auto max-w-7xl px-6 pt-10 pb-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            The Perfect Venue, Just For You.
                        </h1>
                        <p className="mt-2 text-lg font-semibold text-[#233041]/80">
                            “From small gatherings to big celebrations.”
                        </p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="mx-auto max-w-7xl px-6 py-10">
                {/* Venues */}
                <div className="flex items-end justify-between">
                    <h2 className="text-2xl font-semibold">Venues</h2>
                    <Link
                        href="/user/venues"
                        className="text-sm font-medium text-[#233041]/55 hover:text-[#233041]"
                    >
                        See All <span className="ml-1">›</span>
                    </Link>
                </div>

                {venues.length === 0 ? (
                    <div className="mt-5 rounded-2xl border border-[#233041]/10 bg-white p-6 text-sm text-[#233041]/60">
                        No venues found.
                    </div>
                ) : (
                    <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {venues.map((v: any) => (
                            <Link
                                key={v?._id ?? v?.name}
                                href={`/user/venues/${v?._id ?? ""}`}
                                className="group rounded-2xl border border-[#233041]/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="relative h-40 w-full overflow-hidden rounded-t-2xl bg-[#EDE7E1]">
                                    <Image
                                        src={getImageUrl(v?.images)}
                                        alt={v?.name ?? "Venue"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="p-4">
                                    <h3 className="text-sm font-semibold">{v?.name ?? "Untitled Venue"}</h3>
                                    <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-[#233041]/55">
                                        {formatAddress(v) || "View venue details"}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Packages */}
                <div className="mt-12 flex items-end justify-between">
                    <h2 className="text-2xl font-semibold">Packages</h2>
                    <Link
                        href="/user/packages"
                        className="text-sm font-medium text-[#233041]/55 hover:text-[#233041]"
                    >
                        See All <span className="ml-1">›</span>
                    </Link>
                </div>

                {packages.length === 0 ? (
                    <div className="mt-5 rounded-2xl border border-[#233041]/10 bg-white p-6 text-sm text-[#233041]/60">
                        No packages found.
                    </div>
                ) : (
                    <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {packages.map((p: any) => (
                            <Link
                                key={p?._id ?? p?.name}
                                href={`/user/packages/${p?._id ?? ""}`}
                                className="group rounded-2xl border border-[#233041]/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-[#F2EFEA]">
                                    <Image
                                        src={getImageUrl(p?.images)}
                                        alt={p?.name ?? "Package"}
                                        fill
                                        className="object-contain p-4"
                                    />
                                </div>

                                <h3 className="mt-4 text-sm font-semibold">{p?.name ?? "Untitled Package"}</h3>

                                <p className="mt-1 text-xs leading-relaxed text-[#233041]/55">
                                    {p?.description
                                        ? String(p.description)
                                        : p?.pricePerPlate
                                            ? `Starting at Rs. ${p.pricePerPlate} per plate`
                                            : "View package details"}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}



            </section>
        </main>
    );
}