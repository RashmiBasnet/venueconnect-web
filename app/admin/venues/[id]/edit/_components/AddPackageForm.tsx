"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { handleCreatePackage } from "@/lib/actions/packages/packages-action";

export default function AddPackageForm({
    venueId,
    onCreated,
}: {
    venueId: string;
    onCreated: (pkg: any) => void;
}) {
    const [pending, startTransition] = useTransition();

    const [form, setForm] = useState({
        name: "",
        description: "",
        pricePerPlate: "",
        inclusions: "",
        isActive: true,
    });

    const [images, setImages] = useState<File[]>([]);

    const onChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setForm((p) => ({
            ...p,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImages(Array.from(e.target.files || []));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append("venueId", venueId);
        fd.append("name", form.name);

        if (form.description) fd.append("description", form.description);

        fd.append("pricePerPlate", form.pricePerPlate);

        if (form.inclusions) fd.append("inclusions", form.inclusions);

        fd.append("isActive", String(form.isActive));

        images.forEach((f) => fd.append("images", f));

        startTransition(async () => {
            try {
                const res = await handleCreatePackage(fd);
                if (!res.success)
                    throw new Error(res.message || "Failed to create package");

                toast.success("Package created");
                onCreated(res.data);

                // reset form
                setForm({
                    name: "",
                    description: "",
                    pricePerPlate: "",
                    inclusions: "",
                    isActive: true,
                });
                setImages([]);
            } catch (err: any) {
                toast.error(err.message || "Failed to create package");
            }
        });
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {/* Name */}
            <div>
                <label className="block text-sm font-semibold text-slate-700">
                    Package Name
                </label>
                <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    required
                    className="mt-1 w-full rounded-lg text-black border border-black/10 px-4 py-2.5 text-sm"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-semibold text-slate-700">
                    Description
                </label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    rows={3}
                    className="mt-1 w-full rounded-lg text-black border border-black/10 px-4 py-2.5 text-sm"
                />
            </div>

            {/* Price Per Plate */}
            <div>
                <label className="block text-sm font-semibold text-slate-700">
                    Price Per Plate (NPR)
                </label>
                <input
                    type="number"
                    name="pricePerPlate"
                    value={form.pricePerPlate}
                    onChange={onChange}
                    required
                    className="mt-1 w-full rounded-lg text-black border border-black/10 px-4 py-2.5 text-sm"
                />
            </div>

            {/* Inclusions */}
            <div>
                <label className="block text-sm font-semibold text-slate-700">
                    Inclusions
                </label>
                <input
                    name="inclusions"
                    value={form.inclusions}
                    onChange={onChange}
                    placeholder="Stage, Sound System, Decoration"
                    className="mt-1 w-full rounded-lg text-black border border-black/10 px-4 py-2.5 text-sm"
                />
            </div>

            {/* Images */}
            <div>
                <label className="block text-sm font-semibold text-slate-700">
                    Package Images
                </label>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={onFiles}
                    className="mt-2 block w-full text-sm text-gray-400"
                />
            </div>

            {/* Active */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={onChange}
                    className="h-4 w-4 accent-yellow-600"
                />
                <span className="text-sm text-slate-700">
                    Package is active
                </span>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={pending}
                className="w-full rounded-lg bg-yellow-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-yellow-700 disabled:opacity-60"
            >
                {pending ? "Creating..." : "Create Package"}
            </button>
        </form>
    );
}