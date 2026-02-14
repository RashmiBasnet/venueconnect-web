import { handleGetProfile } from "@/lib/actions/user/user-actions";
import ProfileForm from "./_components/ProfileForm";

export default async function Page() {
    const res = await handleGetProfile();
    if (!res.success) throw new Error("Failed to fetch profile");

    return (
        <main>
            <ProfileForm user={res.data} />
        </main>
    );
}