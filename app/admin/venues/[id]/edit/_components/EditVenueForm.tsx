"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AddPackageForm from "./AddPackageForm";
import {
    handleUpdateVenue,
} from "@/lib/actions/venues/venues-actions";
import {
    handleDeletePackage,
} from "@/lib/actions/packages/packages-action";

type Venue = {
    _id: string;
    name: string;
    description?: string;
    address?: { area?: string; city?: string; country?: string; zipCode?: string };
    pricing?: { baseType?: "PER_PLATE" | "FLAT" | "PER_HOUR"; basePrice?: number; currency?: "NPR" | "USD" | "INR" };
    capacity?: { minGuests?: number; maxGuests?: number };
    amenities?: string[];
    isActive?: boolean;
};

type Package = {
    _id: string;
    venueId: string;
    name: string;
    description?: string;
    pricing?: { priceType?: "PER_PLATE" | "FLAT"; price?: number; currency?: "NPR" | "USD" | "INR" };
    inclusions?: string[];
    images?: string[];
    isActive?: boolean;
    createdAt?: string;
};

function joinAmenities(arr?: string[]) {
    return (arr || []).join(", ");
}

export default function EditVenueForm({
    venue,
    initialPackages,
}: {
    venue: Venue;
    initialPackages: Package[];
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const [form, setForm] = useState({
        name: venue.name || "",
        description: venue.description || "",
        area: venue.address?.area || "",
        city: venue.address?.city || "Kathmandu",
        country: venue.address?.country || "Nepal",
        zipCode: venue.address?.zipCode || "",
        baseType: venue.pricing?.baseType || "PER_PLATE",
        basePrice: String(venue.pricing?.basePrice ?? ""),
        currency: venue.pricing?.currency || "NPR",
        minGuests: String(venue.capacity?.minGuests ?? 1),
        maxGuests: String(venue.capacity?.maxGuests ?? ""),
        amenities: joinAmenities(venue.amenities),
        isActive: venue.isActive ?? true,
    });

    const [packages, setPackages] = useState<Package[]>(initialPackages || []);
    const [showAddPkg, setShowAddPkg] = useState(false);

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    };

    const onSubmitVenue = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name: form.name,
            description: form.description,
            address: {
                area: form.area || undefined,
                city: form.city,
                country: form.country,
                zipCode: form.zipCode || undefined,
            },
            pricing: {
                baseType: form.baseType,
                basePrice: Number(form.basePrice || 0),
                currency: form.currency,
            },
            capacity: {
                minGuests: Number(form.minGuests || 1),
                maxGuests: Number(form.maxGuests || 0),
            },
            amenities: form.amenities,
            isActive: form.isActive,
        };

        try {
            const res = await handleUpdateVenue(venue._id, payload);
            if (!res.success) throw new Error(res.message || "Failed to update venue");
            toast.success("Venue updated");
            startTransition(() => router.refresh());
        } catch (err: any) {
            toast.error(err.message || "Failed to update venue");
        }
    };

    const onDeletePackage = async (pkgId: string) => {
        const ok = confirm("Delete this package? This cannot be undone.");
        if (!ok) return;

        try {
            const res = await handleDeletePackage(pkgId);
            if (!res.success) throw new Error(res.message || "Failed to delete package");
            toast.success("Package deleted");
            setPackages((p) => p.filter((x) => x._id !== pkgId));
            startTransition(() => router.refresh());
        } catch (err: any) {
            toast.error(err.message || "Failed to delete package");
        }
    };

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {/* LEFT: Venue Edit */}
            <section className="rounded-2xl border border-black/10 bg-white shadow-sm">
                <div className="border-b border-black/10 px-6 py-4">
                    <h1 className="text-lg font-bold text-[#233041]">Edit Venue</h1>
                    <p className="text-sm text-slate-600">Update venue details.</p>
                </div>

                <form onSubmit={onSubmitVenue} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700">Venue Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            required
                            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-yellow-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={onChange}
                            rows={4}
                            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-yellow-100"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700">Area</label>
                            <input
                                name="area"
                                value={form.area}
                                onChange={onChange}
                                className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700">City</label>
                            <input
                                name="city"
                                value={form.city}
                                onChange={onChange}
                                className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700">Country</label>
                            <input
                                name="country"
                                value={form.country}
                                onChange={onChange}
                                className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700">Zip Code</label>
                            <input
                                name="zipCode"
                                value={form.zipCode}
                                onChange={onChange}
                                className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700">Pricing Type</label>
                            <select
                                name="baseType"
                                value={form.baseType}
                                onChange={onChange}
                                className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm"
                            >
                                <option value="PER_PLATE">Per Plate</option>
                                <option value="FLAT">Flat</option>
                                <option value="PER_HOUR">Per Hour</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700">Base Price</label>
                            <input
                                type="number"
                                name="basePrice"
                                value={form.basePrice}
                                onChange={onChange}
                                className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700">Currency</label>
                            <select
                                name="currency"
                                value={form.currency}
                                onChange={onChange}
                                className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm"
                            >
                                <option value="NPR">NPR</option>
                                <option value="USD">USD</option>
                                <option value="INR">INR</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700">Min Guests</label>
                            <input
                                type="number"
                                name="minGuests"
                                value={form.minGuests}
                                onChange={onChange}
                                className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700">Max Guests</label>
                            <input
                                type="number"
                                name="maxGuests"
                                value={form.maxGuests}
                                onChange={onChange}
                                className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700">Amenities</label>
                        <input
                            name="amenities"
                            value={form.amenities}
                            onChange={onChange}
                            placeholder="Parking, AC, WiFi"
                            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm"
                        />
                        <p className="mt-1 text-xs text-slate-500">Comma separated (same as your backend transform).</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={form.isActive}
                            onChange={onChange}
                            className="h-4 w-4 accent-yellow-600"
                        />
                        <span className="text-sm text-slate-700">Venue is active</span>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={pending}
                            className="rounded-lg bg-yellow-600 px-5 py-2 text-sm font-semibold text-white hover:bg-yellow-700 disabled:opacity-60"
                        >
                            {pending ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </section>

            {/* RIGHT: Packages */}
            <aside className="rounded-2xl border border-black/10 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
                    <div>
                        <h2 className="text-base font-bold text-[#233041]">Packages</h2>
                        <p className="text-sm text-slate-600">Manage packages for this venue.</p>
                    </div>

                    <button
                        onClick={() => setShowAddPkg((p) => !p)}
                        className="rounded-lg bg-[#233041] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                    >
                        {showAddPkg ? "Close" : "+ Add"}
                    </button>
                </div>

                {showAddPkg && (
                    <div className="p-6 border-b border-black/10">
                        <AddPackageForm
                            venueId={venue._id}
                            onCreated={(pkg) => {
                                setPackages((p) => [pkg, ...p]);
                                setShowAddPkg(false);
                            }}
                        />
                    </div>
                )}

                <div className="p-6 space-y-3">
                    {!packages.length ? (
                        <div className="rounded-xl border border-black/10 bg-gray-50 p-4 text-sm text-slate-600">
                            No packages yet.
                        </div>
                    ) : (
                        packages.map((p) => (
                            <div
                                key={p._id}
                                className="rounded-xl border border-black/10 bg-white p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-bold text-[#233041]">{p.name}</p>
                                        <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                                            {p.description || "No description"}
                                        </p>

                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <span className="rounded-full bg-[#FBF8F5] px-2.5 py-1 text-xs font-semibold text-[#B7795B] border border-[#E9E2DC]">
                                                {p.pricing?.priceType || "FLAT"} • {p.pricing?.currency || "NPR"} {p.pricing?.price ?? 0}
                                            </span>

                                            {p.isActive === false ? (
                                                <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 border border-red-200">
                                                    Inactive
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 border border-green-200">
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => onDeletePackage(p._id)}
                                        className="shrink-0 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </aside>
        </div>
    );
}
