import UpdateUserForm from "../_components/UpdateUserForm";
import { handleGetProfile } from "@/lib/actions/user/user-actions";

export default async function Page() {
    const res = await handleGetProfile();

    if (!res.success) {
        throw new Error(res.message || "Failed to load profile.");
    }

    return (
        <div className="min-h-screen -mt-10 bg-white px-4 py-10">
            <div className="mx-auto max-w-2xl">
                {/* Page Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#233041]">
                        Update Profile
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-black/55">
                        Update your personal details and profile picture.
                    </p>
                </div>

                <UpdateUserForm user={res.data} />
            </div>
        </div>
    );
}
