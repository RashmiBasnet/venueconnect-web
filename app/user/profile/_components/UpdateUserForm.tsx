"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User, Pencil, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateUserSchema, UpdateUserType } from "../schema";
import { handleUpdateUserProfile } from "@/lib/actions/user/user-actions";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const UPLOADS_PATH = "/uploads/";

function getProfilePictureSrc(profile?: string) {
    if (!profile) return null;

    if (profile.startsWith("http://") || profile.startsWith("https://")) {
        return profile;
    }

    if (profile.startsWith("/")) {
        return apiBase ? `${apiBase}${profile}` : profile;
    }

    if (!apiBase) return null;
    return `${apiBase}${UPLOADS_PATH}${profile}`;
}

/** VenueConnect theme classes */
const labelCls = "text-sm font-semibold text-[#233041]";
const errorCls = "mt-2 text-sm text-red-600";
const fieldWrap =
    "mt-2 flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-3 " +
    "focus-within:border-[#AE8E54]/60 focus-within:ring-2 focus-within:ring-[#AE8E54]/25";
const inputCls =
    "w-full bg-transparent text-sm text-[#233041] outline-none placeholder:text-black/35";

export default function UpdateUserForm({ user }: { user: any }) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imgVersion, setImgVersion] = useState<number>(0);
    const [imgError, setImgError] = useState(false);

    useEffect(() => setImgVersion(Date.now()), []);

    // ✅ Use the backend field name for existing stored image too (you said it is "profile")
    // If your user object stores it as user.profilePicture instead, just change this one line.
    const baseProfileSrc = useMemo(
        () => getProfilePictureSrc(user?.profile || user?.profilePicture),
        [user?.profile, user?.profilePicture]
    );

    const profileSrc = baseProfileSrc
        ? imgVersion
            ? `${baseProfileSrc}?v=${imgVersion}`
            : baseProfileSrc
        : null;

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<UpdateUserType>({
        resolver: zodResolver(updateUserSchema),
        mode: "onSubmit",
        defaultValues: {
            fullName: user?.fullName || "",
            email: user?.email || "",
            profilePicture: undefined,
        },
    });

    useEffect(() => {
        reset({
            fullName: user?.fullName || "",
            email: user?.email || "",
            profilePicture: undefined,
        });

        setPreviewImage(null);
        setImgError(false);
        setImgVersion(Date.now());

        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [user, reset]);

    const handleImageChange = (
        file: File | undefined,
        onChange: (f?: File) => void
    ) => {
        if (!file) {
            setPreviewImage(null);
            onChange(undefined);
            return;
        }

        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result as string);
        reader.readAsDataURL(file);

        onChange(file);
    };

    const dismissImage = (onChange?: (f?: File) => void) => {
        setPreviewImage(null);
        onChange?.(undefined);
        setValue("profilePicture", undefined);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const appendIf = (fd: FormData, key: string, value: any) => {
        if (value === undefined || value === null) return;
        if (typeof value === "string" && value.trim() === "") return;
        fd.append(key, value);
    };

    const onSubmit = async (data: UpdateUserType) => {
        try {
            const formData = new FormData();

            appendIf(formData, "fullName", data.fullName);
            appendIf(formData, "email", data.email);

            // ✅ IMPORTANT: backend expects field name "profile"
            if (data.profilePicture) {
                formData.append("profile", data.profilePicture);
            }

            const res = await handleUpdateUserProfile(formData);
            if (!res.success) throw new Error(res.message || "Update failed");

            toast.success("Profile updated successfully!");

            dismissImage();
            setImgError(false);
            setImgVersion(Date.now());
            router.refresh();
        } catch (err: any) {
            toast.error(err?.message || "Profile update failed.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-start">
            <div className="rounded-2xl border border-black/10 bg-white/90 shadow-sm backdrop-blur p-6 sm:p-8">
                {/* Avatar */}
                <div className="flex flex-col items-center text-center">
                    <Controller
                        name="profilePicture"
                        control={control}
                        render={({ field: { onChange } }) => (
                            <>
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => fileInputRef.current?.click()}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            fileInputRef.current?.click();
                                        }
                                    }}
                                    className="group relative h-28 w-28 sm:h-32 sm:w-32 cursor-pointer outline-none
                  focus-visible:ring-2 focus-visible:ring-[#AE8E54]/35"
                                    aria-label="Change profile picture"
                                >
                                    <div className="relative h-full w-full rounded-full bg-transparent ring-1 ring-black/10">
                                        <div className="relative h-full w-full overflow-hidden rounded-full bg-[#F4F1EE]">
                                            {previewImage ? (
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : profileSrc ? (
                                                imgError ? (
                                                    <img
                                                        src={profileSrc}
                                                        alt="Profile"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <Image
                                                        src={profileSrc}
                                                        alt="Profile"
                                                        fill
                                                        sizes="128px"
                                                        className="object-cover"
                                                        onError={() => setImgError(true)}
                                                        unoptimized
                                                    />
                                                )
                                            ) : (
                                                <div className="h-full w-full grid place-items-center text-xs text-black/45">
                                                    No Image
                                                </div>
                                            )}

                                            <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                                        </div>

                                        <div className="absolute -bottom-2 -right-2 grid h-10 w-10 place-items-center rounded-full bg-[#233041] text-white shadow-lg ring-4 ring-white transition group-hover:opacity-95">
                                            <Pencil size={16} />
                                        </div>

                                        {previewImage ? (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    dismissImage(onChange);
                                                }}
                                                className="absolute -top-3 -right-3 grid h-9 w-9 place-items-center rounded-full bg-[#233041] text-white shadow-lg ring-4 ring-white hover:opacity-95"
                                                aria-label="Remove selected image"
                                            >
                                                <X size={16} />
                                            </button>
                                        ) : null}
                                    </div>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp"
                                    onChange={(e) =>
                                        handleImageChange(e.target.files?.[0], onChange)
                                    }
                                    className="hidden"
                                />

                                <p className="mt-3 text-xs text-black/45">
                                    Tap the photo to change it
                                </p>

                                {errors.profilePicture ? (
                                    <p className={`${errorCls} text-center`}>
                                        {errors.profilePicture.message as any}
                                    </p>
                                ) : null}
                            </>
                        )}
                    />
                </div>

                {/* Full Name */}
                <div className="mt-8">
                    <label className={labelCls}>Full Name</label>
                    <div className={fieldWrap}>
                        <User className="h-5 w-5 text-black/35" />
                        <input
                            {...register("fullName")}
                            placeholder="Enter your full name"
                            className={inputCls}
                        />
                    </div>
                    {errors.fullName ? (
                        <p className={errorCls}>{errors.fullName.message}</p>
                    ) : null}
                </div>

                {/* Email */}
                <div className="mt-5">
                    <label className={labelCls}>Email</label>
                    <div className={fieldWrap}>
                        <Mail className="h-5 w-5 text-black/35" />
                        <input
                            type="email"
                            {...register("email")}
                            placeholder="name@example.com"
                            className={inputCls}
                        />
                    </div>
                    {errors.email ? (
                        <p className={errorCls}>{errors.email.message}</p>
                    ) : null}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-7 w-full rounded-xl bg-[#233041] py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isSubmitting ? "Updating..." : "Update Profile"}
                </button>
            </div>

            <p className="text-center text-xs text-black/45">
                Changes will reflect across your VenueConnect account.
            </p>
        </form>
    );
}
