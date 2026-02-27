import type { BookingUI, VenueUI } from "./types"

export function asVenue(venue: BookingUI["venueId"]): VenueUI | null {
    if (!venue) return null;
    if (typeof venue === "string") return null;
    return venue;
}

export function asPackage(pkg: BookingUI["packageId"]) {
    if (!pkg) return null;
    if (typeof pkg === "string") return null;
    return pkg;
}

export function getImageUrl(file?: string) {
    if (!file) return "/images/placeholder-venue.jpg";
    if (file.startsWith("http")) return file;

    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return "/images/placeholder-venue.jpg";

    const cleaned = file.replace(/^\/+/, "");
    if (cleaned.startsWith("uploads/")) return `${base}/${cleaned}`;
    return `${base}/uploads/${cleaned}`;
}

export function formatMoney(n?: number) {
    if (typeof n !== "number" || Number.isNaN(n)) return "—";
    return new Intl.NumberFormat("en-NP", {
        style: "currency",
        currency: "NPR",
        maximumFractionDigits: 0,
    }).format(n);
}

export function formatEventDate(dateStr?: string) {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(d);
}

function safeTime(t?: string) {
    if (!t) return null;
    const [hh, mm] = t.split(":").map((x) => Number(x));
    if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
    return { hh, mm };
}

export function toDateTime(dateStr?: string, timeStr?: string) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return null;

    const t = safeTime(timeStr);
    if (!t) return d; // date only
    d.setHours(t.hh, t.mm, 0, 0);
    return d;
}

export function classifyBooking(b: BookingUI, now = new Date()) {
    const status = String(b.status || "").toLowerCase();

    if (status === "pending") return "pending";

    const start = toDateTime(b.eventDate, b.startTime);
    const end = toDateTime(b.eventDate, b.endTime);

    if (status === "finished" || status === "cancelled") return "past";

    if (end && end.getTime() < now.getTime()) return "past";

    if (start && start.getTime() >= now.getTime()) return "ongoing";

    return "ongoing";
}

export function statusBadgeClass(status?: string) {
    const s = String(status || "").toLowerCase();
    if (s === "pending") return "bg-yellow-50 text-yellow-700 ring-yellow-200";
    if (s === "accepted" || s === "confirmed")
        return "bg-blue-50 text-blue-700 ring-blue-200";
    if (s === "finished") return "bg-green-50 text-green-700 ring-green-200";
    if (s === "cancelled") return "bg-red-50 text-red-700 ring-red-200";
    return "bg-gray-50 text-gray-700 ring-gray-200";
}

export function paymentBadgeClass(status?: string) {
    const s = String(status || "").toLowerCase();
    if (s === "paid") return "bg-green-50 text-green-700 ring-green-200";
    if (s === "pending") return "bg-yellow-50 text-yellow-700 ring-yellow-200";
    if (s === "refunded") return "bg-purple-50 text-purple-700 ring-purple-200";
    return "bg-gray-50 text-gray-700 ring-gray-200";
}