"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { handleCreateVenue } from "@/lib/actions/venues/venues-actions";
import { toast } from "sonner";

type AddVenueFormType = {
    name: string;
    description?: string;
    area?: string;
    city: string;
    country: string;
    zipCode?: string;
    baseType: "PER_PLATE" | "FLAT" | "PER_HOUR";
    basePrice: string;
    minGuests: string;
    maxGuests: string;
    amenities?: string;
    isActive: boolean;
};

export default function AddVenueForm() {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AddVenueFormType>({
        defaultValues: {
            name: "",
            description: "",
            area: "",
            city: "Kathmandu",
            country: "Nepal",
            zipCode: "",
            baseType: "PER_PLATE",
            basePrice: "",
            minGuests: "1",
            maxGuests: "",
            amenities: "",
            isActive: true,
        },
        mode: "onSubmit",
    });

    const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImages(files);
        setPreviews(files.map((f) => URL.createObjectURL(f)));
    };

    const onSubmit = async (data: AddVenueFormType) => {
        const formData = new FormData();

        formData.append("name", data.name);
        if (data.description) formData.append("description", data.description);

        formData.append("address[area]", data.area || "");
        formData.append("address[city]", data.city);
        formData.append("address[country]", data.country);
        if (data.zipCode) formData.append("address[zipCode]", data.zipCode);

        formData.append("pricing[baseType]", data.baseType);
        formData.append("pricing[basePrice]", data.basePrice);
        formData.append("pricing[currency]", "NPR");

        formData.append("capacity[minGuests]", data.minGuests);
        formData.append("capacity[maxGuests]", data.maxGuests);

        if (data.amenities) formData.append("amenities", data.amenities);
        formData.append("isActive", String(data.isActive));

        images.forEach((file) => {
            formData.append("images", file);
        });

        startTransition(async () => {
            const res = await handleCreateVenue(formData);

            if (!res.success) {
                toast.error(res.message || "Failed to create venue");
                return;
            }

            toast.success("Venue created successfully");
            router.push("/admin/venues");
            router.refresh();
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Venue Name */}
            <div>
                <label className="block text-sm font-medium text-gray-400">
                    Venue Name
                </label>
                <input
                    {...register("name", { required: "Venue name is required" })}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-black"
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-400">
                    Description
                </label>
                <textarea
                    {...register("description")}
                    rows={3}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-black"
                />
            </div>

            {/* Images */}
            <div>
                <label className="block text-sm font-medium text-gray-400">
                    Venue Images
                </label>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImages}
                    className="mt-2 text-sm"
                />

                {previews.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-3">
                        {previews.map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt="preview"
                                className="h-24 w-full rounded-md object-cover border"
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400">Area</label>
                    <input
                        {...register("area")}
                        className="mt-1 w-full rounded-md border px-3 py-2 text-black"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400">City</label>
                    <input
                        {...register("city")}
                        className="mt-1 w-full rounded-md border px-3 py-2 text-black"
                    />
                </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400">
                        Pricing Type
                    </label>
                    <select
                        {...register("baseType")}
                        className="mt-1 w-full rounded-md border px-3 py-2 text-black"
                    >
                        <option value="PER_PLATE">Per Plate</option>
                        <option value="FLAT">Flat</option>
                        <option value="PER_HOUR">Per Hour</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400">
                        Base Price
                    </label>
                    <input
                        type="number"
                        {...register("basePrice", { required: "Base price is required" })}
                        className="mt-1 w-full rounded-md border px-3 py-2 text-black"
                    />
                    {errors.basePrice && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.basePrice.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Capacity */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400">
                        Min Guests
                    </label>
                    <input
                        type="number"
                        {...register("minGuests")}
                        className="mt-1 w-full rounded-md border px-3 py-2 text-black"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400">
                        Max Guests
                    </label>
                    <input
                        type="number"
                        {...register("maxGuests", { required: "Max guests is required" })}
                        className="mt-1 w-full rounded-md border px-3 py-2 text-black"
                    />
                </div>
            </div>

            {/* Amenities */}
            <div>
                <label className="block text-sm font-medium text-gray-400">
                    Amenities
                </label>
                <input
                    {...register("amenities")}
                    placeholder="Parking, AC, WiFi"
                    className="mt-1 w-full rounded-md border px-3 py-2 text-black"
                />
            </div>

            {/* Active */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    {...register("isActive")}
                    className="h-4 w-4"
                />
                <span className="text-sm text-gray-600">Venue is active</span>
            </div>

            <button
                type="submit"
                disabled={isSubmitting || pending}
                className="w-full mt-6 rounded-md bg-[#233041] py-2 text-lg font-semibold text-white hover:bg-[#1f2c39] disabled:opacity-50"
            >
                {isSubmitting || pending ? "Creating..." : "Create Venue"}
            </button>
        </form>
    );
}
