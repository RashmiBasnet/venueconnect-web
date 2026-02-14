"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, User, UserCog } from "lucide-react";
import DetailRow from "../../_components/DetailRow";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function ProfileForm({
    user,
    onLogout,
}: {
    user: any;
    onLogout?: () => void;
}) {
    /**
     * user.profile          -> backend field (new)
     * user.profilePicture   -> legacy / frontend field
     * values can be:
     *  - full URL
     *  - "/uploads/xyz.png"
     *  - "xyz.png"
     */
    const rawProfile = user?.profile || user?.profilePicture || "";

    const profileSrc = rawProfile
        ? rawProfile.startsWith("http")
            ? rawProfile
            : `${apiBase}${rawProfile.startsWith("/") ? "" : "/uploads/"}${rawProfile}`
        : null;

    const fullName = user?.fullName || "Unnamed User";
    const email = user?.email?.trim?.() || "";

    return (
        <section className="relative py-10">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[#F4F1EE]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 bg-linear-to-b from-[#C4B6AB]/60 to-transparent" />

            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="mt-3 text-2xl sm:text-3xl font-semibold text-[#233041]">
                        Profile
                    </h1>
                    <p className="mt-1 text-sm text-black/55">
                        Your personal information and contact details.
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-black/10 bg-white/90 shadow-sm backdrop-blur overflow-hidden">
                    <div className="grid md:grid-cols-[280px_1fr]">
                        {/* Left: Avatar */}
                        <div className="border-b md:border-b-0 md:border-r border-black/10 p-6 sm:p-8">
                            <div className="flex flex-col items-center md:items-start">
                                <div className="h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full bg-[#F4F1EE] ring-1 ring-black/10">
                                    {profileSrc ? (
                                        <Image
                                            src={profileSrc}
                                            alt="Profile picture"
                                            width={128}
                                            height={128}
                                            className="h-full w-full object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-xs text-black/45">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <h2 className="mt-4 text-xl font-semibold text-[#233041]">
                                    {fullName}
                                </h2>

                                <p className="mt-1 text-xs text-black/45">
                                    Manage your profile details anytime.
                                </p>

                                {/* Update button */}
                                <Link
                                    href="/user/profile/update-profile"
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#233041] hover:bg-black/2"
                                >
                                    <UserCog className="h-4 w-4 text-[#233041]/70" />
                                    Update Profile
                                </Link>
                            </div>
                        </div>

                        {/* Right: Details */}
                        <div className="p-6 sm:p-8">
                            <p className="text-sm font-semibold text-[#233041]">
                                Profile details
                            </p>
                            <p className="mt-1 text-xs text-black/45">
                                These details are visible to you.
                            </p>

                            <div className="mt-6 space-y-3">
                                <DetailRow
                                    label="Full name"
                                    value={fullName}
                                    icon={<User className="h-4 w-4 text-black/40" />}
                                />

                                <DetailRow
                                    label="Email"
                                    value={email || "—"}
                                    icon={<Mail className="h-4 w-4 text-black/40" />}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-4 text-center text-xs text-black/45">
                    Keep your details updated for a smoother experience.
                </p>
            </div>
        </section>
    );
}
