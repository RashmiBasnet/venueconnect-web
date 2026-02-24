"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { handleCreateVenue } from "@/lib/actions/venues/venues-actions";
import { createVenueSchema, type CreateVenueType } from "../../schema/venue-schema";

export default function AddVenueForm() {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateVenueType>({
        resolver: zodResolver(createVenueSchema) as any,
        defaultValues: {
            name: "",
            description: "",
            address: {
                area: "",
                city: "Kathmandu",
                country: "Nepal",
                zipCode: "",
            },
            pricePerPlate: 0,
            capacity: {
                minGuests: 1,
                maxGuests: 1,
            },
            amenities: [],
            isActive: true,
        },
        mode: "onSubmit",
    });

    const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImages(files);
        setPreviews(files.map((f) => URL.createObjectURL(f)));
    };

    const onSubmit = async (data: CreateVenueType) => {
        const formData = new FormData();

        // top-level
        formData.append("name", data.name);
        if (data.description) formData.append("description", data.description);

        // address
        formData.append("address[area]", data.address.area || "");
        formData.append("address[city]", data.address.city);
        formData.append("address[country]", data.address.country);
        if (data.address.zipCode) formData.append("address[zipCode]", data.address.zipCode);

        // new field
        formData.append("pricePerPlate", String(data.pricePerPlate));

        // capacity
        formData.append("capacity[minGuests]", String(data.capacity.minGuests));
        formData.append("capacity[maxGuests]", String(data.capacity.maxGuests));

        if (data.amenities?.length) formData.append("amenities", data.amenities.join(", "));

        // isActive
        formData.append("isActive", String(data.isActive));

        // files
        images.forEach((file) => formData.append("images", file));

        startTransition(async () => {
            try {
                const res = await handleCreateVenue(formData);
                if (!res.success) throw new Error(res.message || "Failed to create venue");

                toast.success("Venue created successfully");
                router.push("/admin/venues");
                router.refresh();
            } catch (err: any) {
                toast.error(err.message || "Failed to create venue");
            }
        });
    };

    return (
        <section className="rounded-2xl border border-black/10 bg-white shadow-sm">
            <div className="border-b border-black/10 px-6 py-4">
                <h1 className="text-lg font-bold text-[#233041]">Add Venue</h1>
                <p className="text-sm text-slate-600">Create a new venue.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                {/* Name */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700">Venue Name</label>
                    <input
                        {...register("name")}
                        className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm text-black outline-none focus:ring-2 focus:ring-yellow-100"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                {/* Description */}
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

                {/* Images */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700">Venue Images</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImages}
                        className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#233041] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:opacity-90"
                    />

                    {previews.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {previews.map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt="preview"
                                    className="h-24 w-full rounded-xl border border-black/10 object-cover"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Address */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700">Area</label>
                        <input
                            {...register("address.area")}
                            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700">City</label>
                        <input
                            {...register("address.city")}
                            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm text-black"
                        />
                        {errors.address?.city && (
                            <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700">Country</label>
                        <input
                            {...register("address.country")}
                            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm text-black"
                        />
                        {errors.address?.country && (
                            <p className="mt-1 text-sm text-red-600">{errors.address.country.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700">Zip Code</label>
                        <input
                            {...register("address.zipCode")}
                            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm text-black"
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
                            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm text-black"
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
                            className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm text-black"
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
                        className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm text-black"
                    />
                    {errors.pricePerPlate && (
                        <p className="mt-1 text-sm text-red-600">{errors.pricePerPlate.message}</p>
                    )}
                </div>

                {/* Amenities */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700">Amenities</label>
                    <input
                        {...register("amenities")}
                        placeholder="Parking, AC, WiFi"
                        className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm text-black"
                    />
                    {errors.amenities && (
                        <p className="mt-1 text-sm text-red-600">{errors.amenities.message as any}</p>
                    )}
                </div>

                {/* Active */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        {...register("isActive")}
                        className="h-4 w-4 accent-yellow-600"
                    />
                    <span className="text-sm text-slate-700">Venue is active</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-gray-500 hover:underline"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting || pending}
                        className="rounded-lg bg-[#233041] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
                    >
                        {isSubmitting || pending ? "Creating..." : "Create Venue"}
                    </button>
                </div>
            </form>
        </section>
    );
}