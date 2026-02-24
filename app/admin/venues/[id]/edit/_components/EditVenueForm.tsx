"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AddPackageForm from "./AddPackageForm";
import { handleUpdateVenue } from "@/lib/actions/venues/venues-actions";
import { handleDeletePackage } from "@/lib/actions/packages/packages-action";

import {
    venueSchema,
    type VenueType,
    updateVenueSchema,
    type UpdateVenueType,
} from "../../../../schema/venue-schema";

type Package = {
    _id: string;
    venueId: string;
    name: string;
    description?: string;
    pricePerPlate?: number;
    inclusions?: string[];
    images?: string[];
    isActive?: boolean;
    createdAt?: string;
};

function normalizeAmenities(val: unknown): string[] {
    if (Array.isArray(val)) {
        return val.map((s) => String(s).trim()).filter(Boolean);
    }
    if (typeof val === "string") {
        return val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }
    return [];
}

export default function EditVenueForm({
    venue,
    initialPackages,
}: {
    venue: unknown;
    initialPackages: Package[];
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const parsedVenue: VenueType = useMemo(() => {
        const res = venueSchema.safeParse(venue);
        if (res.success) return res.data;

        return {
            _id: (venue as any)?._id || "",
            name: (venue as any)?.name || "",
            description: (venue as any)?.description,
            address: (venue as any)?.address,
            capacity: (venue as any)?.capacity,
            amenities: (venue as any)?.amenities,
            isActive: (venue as any)?.isActive,
            images: (venue as any)?.images,
            pricePerPlate: (venue as any)?.pricePerPlate,
        };
    }, [venue]);

    const venueId = parsedVenue._id;

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<UpdateVenueType>({
        resolver: zodResolver(updateVenueSchema) as any,
        defaultValues: {
            name: parsedVenue.name || "",
            description: parsedVenue.description || "",
            address: {
                area: parsedVenue.address?.area ?? "",
                city: parsedVenue.address?.city ?? "Kathmandu",
                country: parsedVenue.address?.country ?? "Nepal",
                zipCode: parsedVenue.address?.zipCode ?? "",
            },
            pricePerPlate: parsedVenue.pricePerPlate ?? 0,
            capacity: {
                minGuests: parsedVenue.capacity?.minGuests ?? 1,
                maxGuests: parsedVenue.capacity?.maxGuests ?? 1,
            },

            amenities: parsedVenue.amenities ?? [],

            isActive: parsedVenue.isActive ?? true,
        },
        mode: "onSubmit",
    });

    const [packages, setPackages] = useState<Package[]>(initialPackages || []);
    const [showAddPkg, setShowAddPkg] = useState(false);

    const onSubmitVenue = async (data: UpdateVenueType) => {
        const payload = {
            name: data.name,
            description: data.description,
            address: {
                area: data.address.area || undefined,
                city: data.address.city,
                country: data.address.country,
                zipCode: data.address.zipCode || undefined,
            },
            pricePerPlate: data.pricePerPlate,
            capacity: {
                minGuests: data.capacity.minGuests,
                maxGuests: data.capacity.maxGuests,
            },

            amenities: normalizeAmenities((data as any).amenities),

            isActive: data.isActive,
        };

        const parsed = updateVenueSchema.safeParse(payload);
        if (!parsed.success) {
            toast.error(parsed.error.issues?.[0]?.message || "Invalid form data");
            return;
        }

        try {
            const res = await handleUpdateVenue(venueId, parsed.data);
            if (!res.success) throw new Error(res.message || "Failed to update venue");
            toast.success("Venue updated");
            startTransition(() => router.refresh());
        } catch (err: any) {
            toast.error(err?.message || "Failed to update venue");
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
            toast.error(err?.message || "Failed to delete package");
        }
    };

    const isActive = watch("isActive");

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {/* LEFT: Venue Edit */}
            <section className="rounded-2xl border border-black/10 bg-white shadow-sm">
                <div className="border-b border-black/10 px-6 py-4">
                    <h1 className="text-lg font-bold text-[#233041]">Edit Venue</h1>
                    <p className="text-sm text-slate-600">Update venue details.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmitVenue)} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700">Venue Name</label>
                        <input
                            {...register("name")}
                            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm text-black outline-none focus:ring-2 focus:ring-yellow-100"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700">Description</label>
                        <textarea
                            {...register("description")}
                            rows={4}
                            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm text-black outline-none focus:ring-2 focus:ring-yellow-100"
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700">Area</label>
                            <input
                                {...register("address.area")}
                                className="mt-1 w-full rounded-lg text-black border border-black/10 px-4 py-2.5 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700">City</label>
                            <input
                                {...register("address.city")}
                                className="mt-1 w-full rounded-lg text-black border border-black/10 px-4 py-2.5 text-sm"
                            />
                            {errors.address?.city && (
                                <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700">Country</label>
                            <input
                                {...register("address.country")}
                                className="mt-1 w-full rounded-lg text-black border border-black/10 px-4 py-2.5 text-sm"
                            />
                            {errors.address?.country && (
                                <p className="mt-1 text-sm text-red-600">{errors.address.country.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700">Zip Code</label>
                            <input
                                {...register("address.zipCode")}
                                className="mt-1 w-full rounded-lg text-black border border-black/10 px-4 py-2.5 text-sm"
                            />
                        </div>
                    </div>

                    {/* Capacity */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700">Min Guests</label>
                            <input
                                type="number"
                                {...register("capacity.minGuests", { valueAsNumber: true })}
                                className="mt-1 w-full rounded-lg text-black border border-black/10 px-4 py-2.5 text-sm"
                            />
                            {errors.capacity?.minGuests && (
                                <p className="mt-1 text-sm text-red-600">{errors.capacity.minGuests.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700">Max Guests</label>
                            <input
                                type="number"
                                {...register("capacity.maxGuests", { valueAsNumber: true })}
                                className="mt-1 w-full rounded-lg text-black border border-black/10 px-4 py-2.5 text-sm"
                            />
                            {errors.capacity?.maxGuests && (
                                <p className="mt-1 text-sm text-red-600">{errors.capacity.maxGuests.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Price Per Plate */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700">Price Per Plate</label>
                        <input
                            type="number"
                            {...register("pricePerPlate", { valueAsNumber: true })}
                            className="mt-1 w-full rounded-lg text-black border border-black/10 px-4 py-2.5 text-sm"
                        />
                        {errors.pricePerPlate && (
                            <p className="mt-1 text-sm text-red-600">{errors.pricePerPlate.message}</p>
                        )}
                    </div>

                    {/* Amenities */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700">Amenities</label>
                        <input
                            {...register("amenities" as any)}
                            placeholder="Parking, AC, WiFi"
                            className="mt-1 w-full rounded-lg text-black border border-black/10 px-4 py-2.5 text-sm"
                        />

                        {errors.amenities && (
                            <p className="mt-1 text-sm text-red-600">{errors.amenities.message as any}</p>
                        )}
                    </div>

                    {/* Active */}
                    <div className="flex items-center gap-2">
                        <input type="checkbox" {...register("isActive")} className="h-4 w-4 accent-yellow-600" />
                        <span className="text-sm text-slate-700">Venue is {isActive ? "active" : "inactive"}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm text-gray-500 font-semibold hover:underline"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting || pending}
                            className="rounded-lg bg-yellow-600 px-5 py-2 text-sm font-semibold text-white hover:bg-yellow-700 disabled:opacity-60"
                        >
                            {isSubmitting || pending ? "Saving..." : "Save Changes"}
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
                            venueId={venueId}
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
                            <div key={p._id} className="rounded-xl border border-black/10 bg-white p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-bold text-[#233041]">{p.name}</p>
                                        <p className="mt-1 text-xs text-slate-600 line-clamp-2">{p.description || "No description"}</p>

                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <span className="rounded-full bg-[#FBF8F5] px-2.5 py-1 text-xs font-semibold text-[#B7795B] border border-[#E9E2DC]">
                                                Per plate: NPR {p.pricePerPlate ?? 0}
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