"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { handleCreateBooking } from "@/lib/actions/booking/booking-actions";

type VenueUI = {
    _id: string;
    name: string;
    pricePerPlate: number;
    capacity?: { minGuests?: number; maxGuests?: number };
    address?: any;
    images?: string[];
};

type PackageUI = {
    _id: string;
    name: string;
    pricePerPlate: number;
    isActive?: boolean;
    capacity?: { minGuests?: number; maxGuests?: number };
};

const bookingFormSchema = z
    .object({
        packageId: z.string().optional(),
        eventDate: z.string().min(1, "Event date is required"),
        startTime: z.string().min(1, "Start time is required"),
        endTime: z.string().min(1, "End time is required"),

        guests: z.number().int().min(1, "Guests must be at least 1"),

        contactName: z.string().min(1, "Contact name is required"),
        contactPhone: z.string().min(6, "Contact phone is required"),
        contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
        note: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        const [sh, sm] = data.startTime.split(":").map(Number);
        const [eh, em] = data.endTime.split(":").map(Number);
        if (eh * 60 + em <= sh * 60 + sm) {
            ctx.addIssue({
                code: "custom",
                message: "End time must be after start time",
                path: ["endTime"],
            });
        }
    });

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function BookingForm({
    venue,
    packages,
}: {
    venue: VenueUI;
    packages: PackageUI[];
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [selectedPackageId, setSelectedPackageId] = useState<string>("");

    const activePackages = useMemo(
        () => (packages || []).filter((p) => p.isActive !== false),
        [packages]
    );

    const selectedPackage = useMemo(() => {
        if (!selectedPackageId) return null;
        return activePackages.find((p) => p._id === selectedPackageId) || null;
    }, [activePackages, selectedPackageId]);

    const minGuests = useMemo(() => {
        // if package has minGuests, use it; else venue minGuests; else 1
        return (
            selectedPackage?.capacity?.minGuests ??
            venue.capacity?.minGuests ??
            1
        );
    }, [selectedPackage, venue]);

    const maxGuests = useMemo(() => {
        return (
            selectedPackage?.capacity?.maxGuests ??
            venue.capacity?.maxGuests ??
            999999
        );
    }, [selectedPackage, venue]);

    const pricePerPlatePreview = useMemo(() => {
        return selectedPackage?.pricePerPlate ?? venue.pricePerPlate ?? 0;
    }, [selectedPackage, venue]);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<BookingFormValues>({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            packageId: "",
            guests: Math.max(1, minGuests),
            contactEmail: "",
            note: "",
        },
    });

    const guests = watch("guests") || 0;
    const totalPricePreview = useMemo(() => {
        const g = Number.isFinite(guests) ? guests : 0;
        return pricePerPlatePreview * Math.max(0, g);
    }, [pricePerPlatePreview, guests]);

    const onSubmit = (values: BookingFormValues) => {
        // extra capacity guard client-side (server still enforces)
        if (values.guests < minGuests) {
            toast.error(`Guests must be at least ${minGuests}`);
            return;
        }
        if (values.guests > maxGuests) {
            toast.error(`Guests must be at most ${maxGuests}`);
            return;
        }

        const payload = {
            venueId: venue._id,
            packageId: values.packageId?.trim() ? values.packageId.trim() : undefined,
            eventDate: values.eventDate,
            startTime: values.startTime,
            endTime: values.endTime,
            guests: values.guests,
            contactName: values.contactName,
            contactPhone: values.contactPhone,
            contactEmail: values.contactEmail?.trim() ? values.contactEmail.trim() : undefined,
            note: values.note?.trim() ? values.note.trim() : undefined,
        };

        startTransition(async () => {
            const res = await handleCreateBooking(payload);

            if (!res.success) {
                toast.error(res.message || "Create booking failed");
                return;
            }

            toast.success(res.message || "Booking created");
            router.push("/user/activity");
        });
    };

    return (
        <div className="mx-auto max-w-3xl text-black">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5">
                    <h1 className="text-xl font-semibold text-gray-900">Book {venue.name}</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Fill in the details below to place your booking request.
                    </p>
                </div>

                {/* Package */}
                <div className="mb-5">
                    <label className="text-sm font-medium text-gray-800">Package (optional)</label>
                    <select
                        className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
                        value={selectedPackageId}
                        onChange={(e) => {
                            const id = e.target.value;
                            setSelectedPackageId(id);
                            setValue("packageId", id);
                            // keep guests within new min/max
                            const currentGuests = Number(watch("guests") || 0);
                            const nextMin =
                                activePackages.find((p) => p._id === id)?.capacity?.minGuests ??
                                venue.capacity?.minGuests ??
                                1;
                            const nextMax =
                                activePackages.find((p) => p._id === id)?.capacity?.maxGuests ??
                                venue.capacity?.maxGuests ??
                                999999;

                            if (currentGuests < nextMin) setValue("guests", nextMin);
                            if (currentGuests > nextMax) setValue("guests", nextMax);
                        }}
                    >
                        <option value="">No package (use venue price)</option>
                        {activePackages.map((p) => (
                            <option key={p._id} value={p._id}>
                                {p.name} — Rs. {p.pricePerPlate}/plate
                            </option>
                        ))}
                    </select>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Date + Time */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="md:col-span-1">
                            <label className="text-sm font-medium text-gray-800">Event Date</label>
                            <input
                                type="date"
                                className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
                                {...register("eventDate")}
                            />
                            {errors.eventDate && (
                                <p className="mt-1 text-xs text-red-600">{errors.eventDate.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-800">Start Time</label>
                            <input
                                type="time"
                                className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
                                {...register("startTime")}
                            />
                            {errors.startTime && (
                                <p className="mt-1 text-xs text-red-600">{errors.startTime.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-800">End Time</label>
                            <input
                                type="time"
                                className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
                                {...register("endTime")}
                            />
                            {errors.endTime && (
                                <p className="mt-1 text-xs text-red-600">{errors.endTime.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Guests */}
                    <div>
                        <label className="text-sm font-medium text-gray-800">Guests</label>
                        <input
                            type="number"
                            min={minGuests}
                            max={maxGuests}
                            className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
                            {...register("guests", { valueAsNumber: true })}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Allowed: {minGuests} — {maxGuests === 999999 ? "∞" : maxGuests}
                        </p>
                        {errors.guests && (
                            <p className="mt-1 text-xs text-red-600">{errors.guests.message}</p>
                        )}
                    </div>

                    {/* Contact */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-gray-800">Contact Name</label>
                            <input
                                className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
                                placeholder="Full name"
                                {...register("contactName")}
                            />
                            {errors.contactName && (
                                <p className="mt-1 text-xs text-red-600">{errors.contactName.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-800">Contact Phone</label>
                            <input
                                className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
                                placeholder="98xxxxxxxx"
                                {...register("contactPhone")}
                            />
                            {errors.contactPhone && (
                                <p className="mt-1 text-xs text-red-600">{errors.contactPhone.message}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-800">Contact Email (optional)</label>
                            <input
                                className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
                                placeholder="you@example.com"
                                {...register("contactEmail")}
                            />
                            {errors.contactEmail && (
                                <p className="mt-1 text-xs text-red-600">{errors.contactEmail.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="text-sm font-medium text-gray-800">Note (optional)</label>
                        <textarea
                            rows={4}
                            className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
                            placeholder="Any extra info for the venue..."
                            {...register("note")}
                        />
                    </div>

                    {/* Price Preview */}
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Price per plate</span>
                            <span className="font-semibold text-gray-900">Rs. {pricePerPlatePreview}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm">
                            <span className="text-gray-600">Estimated total</span>
                            <span className="font-semibold text-gray-900">Rs. {totalPricePreview}</span>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                            Final price is confirmed by server rules (package price if selected, otherwise venue price).
                        </p>
                    </div>

                    {/* Submit */}
                    <button
                        disabled={pending}
                        className="w-full rounded-xl bg-[#233041] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                        type="submit"
                    >
                        {pending ? "Creating booking..." : "Confirm Booking"}
                    </button>
                </form>
            </div>
        </div>
    );
}