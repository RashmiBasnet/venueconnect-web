"use client";

import { useAuth } from "@/context/AuthContext";

export default function Page() {
    const { user, logout } = useAuth();
    return (
        <div className="w-full px-10 py-3 flex justify-between">
            <label>Home</label>
            <div>
                { user && <div>{user.fullName}</div>}
                { user && <button onClick={logout}>Logout</button> }
            </div>
        </div>
    );
}