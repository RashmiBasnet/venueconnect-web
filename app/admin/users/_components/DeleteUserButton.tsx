"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { handleDeleteUser } from "@/lib/actions/admin/user-actions";

export default function DeleteUserButton({ userId }: { userId: string }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [pending, startTransition] = useTransition();

    const onDelete = () => {
        startTransition(async () => {
            const res = await handleDeleteUser(userId);
            if (res?.success) {
                setOpen(false);
                router.push("/admin/users");
                router.refresh();
            } else {
                alert(res?.message || "Failed to delete user");
            }
        });
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 transition"
            >
                Delete
            </button>

            {open && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
                        <div className="p-5">
                            <h3 className="text-lg font-semibold text-black">Delete user?</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                This action cannot be undone. The user account will be removed permanently.
                            </p>

                            <div className="mt-5 flex items-center justify-end gap-2">
                                <button
                                    onClick={() => setOpen(false)}
                                    className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-50 transition"
                                    disabled={pending}
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={onDelete}
                                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 transition disabled:opacity-60"
                                    disabled={pending}
                                >
                                    {pending ? "Deleting..." : "Yes, Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}