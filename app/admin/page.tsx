import Link from "next/link";
import { Users, Building2, Package, CalendarDays, ArrowUpRight } from "lucide-react";

import { handleGetAllUsers } from "@/lib/actions/admin/user-actions";
import { handleGetAllVenues } from "@/lib/actions/venues/venues-actions";
import { handleGetAllPackages } from "@/lib/actions/packages/packages-action";
import { handleGetAllBookings } from "@/lib/actions/booking/booking-actions";

const BRAND = "#AE8E54";

function safeTotalFromPagination(p: any) {
    if (!p) return 0;
    return Number(p.totalItems ?? p.total ?? p.count ?? 0);
}

function StatCard({
    title,
    value,
    icon,
    href,
}: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    href: string;
}) {
    return (
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs text-black/60">{title}</p>
                    <p className="mt-2 text-2xl font-semibold text-black">{value}</p>
                </div>

                <div
                    className="grid h-11 w-11 place-items-center rounded-2xl border border-black/10 bg-black/2"
                    style={{ color: BRAND }}
                >
                    {icon}
                </div>
            </div>

            <div className="mt-4">
                <Link
                    href={href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-black/70 hover:text-black"
                >
                    View details <ArrowUpRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}

function Pill({ text }: { text: string }) {
    return (
        <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/70">
            {text}
        </span>
    );
}

export default async function AdminDashboardPage() {
    const [usersRes, venuesRes, packagesRes, bookingsRes] = await Promise.all([
        handleGetAllUsers({ page: 1, size: 1, search: "" }),
        handleGetAllVenues(),
        handleGetAllPackages({ page: 1, size: 1, search: "" }),
        handleGetAllBookings({ page: 1, size: 8, search: "" }),
    ]);

    const totalUsers = usersRes?.success ? safeTotalFromPagination(usersRes.pagination) : 0;

    const venues = venuesRes?.success ? (venuesRes.data ?? []) : [];
    const totalVenues = Array.isArray(venues) ? venues.length : 0;

    const totalPackages =
        packagesRes?.success ? safeTotalFromPagination(packagesRes.pagination) : 0;

    const totalBookings =
        bookingsRes?.success ? safeTotalFromPagination(bookingsRes.pagination) : 0;

    const recentBookings = bookingsRes?.success ? (bookingsRes.bookings ?? []) : [];

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="mt-2 text-2xl font-semibold text-black sm:text-4xl">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-black/60">
                        Quick overview of VenueConnect activity.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Pill text="Users" />
                    <Pill text="Venues" />
                    <Pill text="Packages" />
                    <Pill text="Bookings" />
                </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Users"
                    value={totalUsers}
                    icon={<Users className="h-5 w-5" />}
                    href="/admin/users"
                />
                <StatCard
                    title="Total Venues"
                    value={totalVenues}
                    icon={<Building2 className="h-5 w-5" />}
                    href="/admin/venues"
                />
                <StatCard
                    title="Total Packages"
                    value={totalPackages}
                    icon={<Package className="h-5 w-5" />}
                    href="/admin/packages"
                />
                <StatCard
                    title="Total Bookings"
                    value={totalBookings}
                    icon={<CalendarDays className="h-5 w-5" />}
                    href="/admin/bookings"
                />
            </div>

            {/* Recent bookings + Venues preview */}
            <div className="mt-6 grid gap-4 lg:grid-cols-12">
                {/* Recent bookings */}
                <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm lg:col-span-7">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-black">Recent bookings</h2>
                        <Link
                            href="/admin/bookings"
                            className="text-sm font-medium hover:underline"
                            style={{ color: BRAND }}
                        >
                            View all
                        </Link>
                    </div>

                    <div className="mt-4 overflow-hidden rounded-xl border border-black/10">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-black/2 text-xs text-black/60">
                                <tr>
                                    <th className="px-4 py-3">Event</th>
                                    <th className="px-4 py-3">Guests</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Payment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/10">
                                {recentBookings?.length ? (
                                    recentBookings.map((b: any) => (
                                        <tr key={String(b?._id ?? Math.random())} className="hover:bg-black/2">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-black">
                                                    {b?.venueId?.name ?? b?.venue?.name ?? "Venue"}
                                                </div>
                                                <div className="text-xs text-black/60">
                                                    {b?.eventDate ? String(b.eventDate).slice(0, 10) : "—"} •{" "}
                                                    {b?.startTime ?? "—"} - {b?.endTime ?? "—"}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-black/80">{b?.guests ?? "—"}</td>
                                            <td className="px-4 py-3">
                                                <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs text-black/70">
                                                    {b?.status ?? "—"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs text-black/70">
                                                    {b?.paymentStatus ?? "—"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="px-4 py-6 text-sm text-black/60" colSpan={4}>
                                            No bookings found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Venue preview */}
                <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm lg:col-span-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-black">Venues</h2>
                        <Link
                            href="/admin/venues"
                            className="text-sm font-medium hover:underline"
                            style={{ color: BRAND }}
                        >
                            Manage venues
                        </Link>
                    </div>

                    <p className="mt-2 text-sm text-black/60">
                        Quick snapshot of available venues.
                    </p>

                    <div className="mt-4 space-y-3">
                        {(venues ?? []).slice(0, 6).map((v: any) => (
                            <div
                                key={String(v?._id ?? Math.random())}
                                className="flex items-center justify-between rounded-xl border border-black/10 bg-black/2 p-3"
                            >
                                <div>
                                    <div className="text-sm font-medium text-black">
                                        {v?.name ?? "Venue"}
                                    </div>
                                    <div className="text-xs text-black/60">
                                        {v?.address?.city ?? "—"} {v?.address?.area ? `• ${v.address.area}` : ""}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-xs text-black/60">Per plate</div>
                                    <div className="text-sm font-semibold text-black">
                                        {v?.pricePerPlate ? `Rs. ${v.pricePerPlate}` : "—"}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {!venues?.length ? (
                            <div className="rounded-xl border border-black/10 bg-black/2 p-4 text-sm text-black/60">
                                No venues found.
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}