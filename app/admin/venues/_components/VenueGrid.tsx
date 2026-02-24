"use client";

import type { VenueType } from "../../schema/venue-schema";
import { VenueCard } from "./VenueCard";

export default function VenuesGrid({ venues }: { venues: VenueType[] }) {
    if (!venues?.length) {
        return (
            <div className="rounded-xl border border-black/10 bg-white p-6 text-sm text-gray-600">
                No venues found.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {venues.map((v) => (
                <VenueCard key={v._id} venue={v} />
            ))}
        </div>
    );
}