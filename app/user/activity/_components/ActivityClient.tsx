"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { handleGetMyBookings } from "@/lib/actions/booking/booking-actions";
import type { BookingUI } from "../types";
import BookingCard from "./BookingCard";
import { classifyBooking } from "../booking-utils";

type TabKey = "ongoing" | "pending" | "past";

const TABS: { key: TabKey; label: string }[] = [
    { key: "ongoing", label: "Ongoing" },
    { key: "pending", label: "Pending" },
    { key: "past", label: "Past" },
];

export default function ActivityClient() {
    const [tab, setTab] = useState<TabKey>("ongoing");
    const [pending, startTransition] = useTransition();

    const [bookings, setBookings] = useState<BookingUI[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        startTransition(async () => {
            setLoading(true);
            const res = await handleGetMyBookings();

            if (!res?.success) {
                toast.error(res?.message || "Failed to load bookings");
                setBookings([]);
                setLoading(false);
                return;
            }

            const list = Array.isArray(res.data) ? (res.data as BookingUI[]) : [];
            setBookings(list);
            setLoading(false);
        });
    }, []);

    const grouped = useMemo(() => {
        const now = new Date();
        const ongoing: BookingUI[] = [];
        const pendingList: BookingUI[] = [];
        const past: BookingUI[] = [];

        for (const b of bookings) {
            const group = classifyBooking(b, now);
            if (group === "pending") pendingList.push(b);
            else if (group === "past") past.push(b);
            else ongoing.push(b);
        }

        ongoing.sort((a, b) => {
            const da = new Date(a.eventDate || 0).getTime();
            const db = new Date(b.eventDate || 0).getTime();
            return da - db;
        });

        pendingList.sort((a, b) => {
            const da = new Date(a.createdAt || 0).getTime();
            const db = new Date(b.createdAt || 0).getTime();
            return db - da;
        });

        past.sort((a, b) => {
            const da = new Date(a.eventDate || a.createdAt || 0).getTime();
            const db = new Date(b.eventDate || b.createdAt || 0).getTime();
            return db - da;
        });

        return { ongoing, pending: pendingList, past };
    }, [bookings]);

    const list = grouped[tab];

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {TABS.map((t) => {
                    const active = t.key === tab;
                    return (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={[
                                "rounded-xl px-4 py-2 text-sm font-medium border",
                                active
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50",
                            ].join(" ")}
                            type="button"
                        >
                            {t.label}{" "}
                            <span className={active ? "opacity-90" : "text-gray-600"}>
                                ({grouped[t.key].length})
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="space-y-3">
                {loading || pending ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
                        Loading your bookings…
                    </div>
                ) : list.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <p className="text-sm font-medium text-gray-900">No bookings here</p>
                        <p className="mt-1 text-sm text-gray-600">
                            {tab === "pending" &&
                                "You don’t have any pending bookings right now."}
                            {tab === "ongoing" &&
                                "You don’t have any upcoming/ongoing bookings right now."}
                            {tab === "past" && "You don’t have any past bookings yet."}
                        </p>
                    </div>
                ) : (
                    list.map((b) => <BookingCard key={b._id} booking={b} />)
                )}
            </div>
        </div>
    );
}