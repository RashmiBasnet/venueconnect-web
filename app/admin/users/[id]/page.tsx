import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { handleGetUserById } from "@/lib/actions/admin/user-actions";
import DeleteUserButton from "../_components/DeleteUserButton";
import { handleGetAllBookings } from "@/lib/actions/booking/booking-actions";

function getImageUrl(file?: string) {
    if (!file) return "";
    if (file.startsWith("http")) return file;

    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return "";

    const cleaned = file.replace(/^\/+/, "");
    if (cleaned.startsWith("uploads/")) return `${base}/${cleaned}`;
    return `${base}/uploads/${cleaned}`;
}

function initials(name?: string) {
    const n = (name || "").trim();
    if (!n) return "U";
    const parts = n.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join("");
}

function formatDate(d?: string | Date) {
    if (!d) return "-";
    const date = typeof d === "string" ? new Date(d) : d;
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

function money(n?: any) {
    const num = Number(n);
    if (!Number.isFinite(num)) return "-";
    return `Rs. ${num.toLocaleString("en-NP")}`;
}

export default async function UserDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const res = await handleGetUserById(id);
    if (!res?.success) return notFound();

    const user = res.data;
    const img = getImageUrl(user?.profilePicture);

    const bookingsRes = await handleGetAllBookings({
        page: 1,
        size: 5,
        search: user?.email || "",
    });

    // Support multiple possible shapes safely:
    const bookings: any[] =
        (bookingsRes as any)?.data ||
        (bookingsRes as any)?.bookings ||
        (bookingsRes as any)?.data?.bookings ||
        [];

    // optional stats
    const totalSpent = bookings.reduce((sum, b) => sum + (Number(b?.totalPrice) || 0), 0);

    return (
        <div className="space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-black">User Details</h1>
                    <p className="text-sm text-gray-500">
                        View profile information and activity.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href="/admin/users"
                        className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-50 transition"
                    >
                        ← Back
                    </Link>

                    <DeleteUserButton userId={String(user?._id)} />
                </div>
            </div>

            {/* Profile Card */}
            <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-black/10 bg-gray-50">
                            {img ? (
                                <Image
                                    src={img}
                                    alt={user?.fullName ?? "User"}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="grid h-full w-full place-items-center text-lg font-bold text-gray-700">
                                    {initials(user?.fullName)}
                                </div>
                            )}
                        </div>

                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-lg font-semibold text-black">
                                    {user?.fullName ?? "Unnamed User"}
                                </h2>
                                <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user?.role === "admin"
                                        ? "bg-yellow-100 text-yellow-900"
                                        : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {String(user?.role ?? "user").toUpperCase()}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600">{user?.email ?? "-"}</p>
                            <p className="text-xs text-gray-500 font-mono">
                                ID: {String(user?._id)}
                            </p>
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-2 gap-3 sm:w-90">
                        <div className="rounded-xl border border-black/10 bg-white p-3">
                            <p className="text-xs text-gray-500">Created</p>
                            <p className="mt-1 text-sm font-semibold text-black">
                                {formatDate(user?.createdAt)}
                            </p>
                        </div>

                        <div className="rounded-xl border border-black/10 bg-white p-3">
                            <p className="text-xs text-gray-500">Updated</p>
                            <p className="mt-1 text-sm font-semibold text-black">
                                {formatDate(user?.updatedAt)}
                            </p>
                        </div>

                        {/* Optional: Booking stats */}
                        <div className="rounded-xl border border-black/10 bg-white p-3">
                            <p className="text-xs text-gray-500">Bookings (shown)</p>
                            <p className="mt-1 text-sm font-semibold text-black">
                                {bookings.length}
                            </p>
                        </div>

                        <div className="rounded-xl border border-black/10 bg-white p-3">
                            <p className="text-xs text-gray-500">Total (shown)</p>
                            <p className="mt-1 text-sm font-semibold text-black">
                                {money(totalSpent)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-black">Account Info</h3>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <InfoItem label="Full Name" value={user?.fullName ?? "-"} />
                            <InfoItem label="Email" value={user?.email ?? "-"} />
                            <InfoItem label="Role" value={String(user?.role ?? "-")} />
                            <InfoItem
                                label="Has Profile Picture"
                                value={user?.profilePicture ? "Yes" : "No"}
                            />
                        </div>
                    </div>

                    {/* Booking history */}
                    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                        <div className="flex items-end justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-black">
                                    Booking History
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Latest bookings matched using email search.
                                </p>
                            </div>

                            <Link
                                href={`/admin/booking?search=${encodeURIComponent(user?.email ?? "")}`}
                                className="text-sm font-semibold text-yellow-700 hover:text-yellow-900"
                            >
                                View all →
                            </Link>
                        </div>

                        {bookings.length === 0 ? (
                            <div className="mt-4 rounded-xl border border-black/10 bg-gray-50 p-4 text-sm text-gray-600">
                                No bookings found for this user yet.
                            </div>
                        ) : (
                            <div className="mt-4 space-y-3">
                                {bookings.map((b) => (
                                    <div
                                        key={b._id}
                                        className="rounded-xl border border-black/10 bg-white p-4 hover:bg-gray-50 transition"
                                    >
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-black">
                                                    {b?.venueId?.name ?? "Venue"}{" "}
                                                    {b?.packageId?.name ? `• ${b.packageId.name}` : ""}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Event: {formatDate(b?.eventDate)} •{" "}
                                                    {b?.startTime ? `${b.startTime} - ${b.endTime}` : ""} • Guests:{" "}
                                                    {b?.guests ?? "-"}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-600">
                                                    Price: {money(b?.pricePerPlate)} / plate • Total:{" "}
                                                    <span className="font-semibold">{money(b?.totalPrice)}</span>
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                                    {String(b?.status ?? "pending").toUpperCase()}
                                                </span>
                                                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-900">
                                                    {String(b?.paymentStatus ?? "unpaid").toUpperCase()}
                                                </span>
                                                <Link
                                                    href={`/admin/booking/${b._id}`}
                                                    className="inline-flex h-8 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-xs font-semibold text-black hover:bg-gray-50 transition"
                                                >
                                                    Open
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right */}
                <div className="space-y-6">
                    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-black">Admin Actions</h3>

                        <div className="mt-4 space-y-2">
                            <Link
                                href={`/admin/booking?search=${encodeURIComponent(user?.email ?? "")}`}
                                className="block rounded-xl bg-yellow-600 px-4 py-3 text-sm font-semibold text-white hover:bg-yellow-900 transition"
                            >
                                See Bookings
                                <p className="mt-1 text-xs font-normal text-yellow-100">
                                    Filter bookings by this user.
                                </p>
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-black">Note</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Best long-term filter is <span className="font-semibold">bookedBy</span> (userId),
                            not email search. If your booking list already supports bookedBy filter,
                            tell me the param name and I’ll switch this instantly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-black/10 bg-white p-3">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="mt-1 text-sm font-semibold text-black wrap-break-word">
                {value}
            </p>
        </div>
    );
}