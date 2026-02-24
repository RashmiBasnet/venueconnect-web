"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PackageSearchBar({ initialSearch = "" }: { initialSearch?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(initialSearch);

    useEffect(() => {
        setSearch(initialSearch);
    }, [initialSearch]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const sp = new URLSearchParams(searchParams?.toString());
        if (search.trim()) sp.set("search", search.trim());
        else sp.delete("search");
        sp.set("page", "1");
        router.push(`/user/packages?${sp.toString()}`);
    };

    const onClear = () => {
        const sp = new URLSearchParams(searchParams?.toString());
        sp.delete("search");
        sp.set("page", "1");
        router.push(`/user/packages?${sp.toString()}`);
    };

    return (
        <form onSubmit={onSubmit} className="flex items-center gap-2">
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search packages (name, description...)"
                className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm text-black outline-none focus:ring-2 focus:ring-[#C4B6AB]"
            />

            {search.trim() ? (
                <button
                    type="button"
                    onClick={onClear}
                    className="rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-gray-50"
                >
                    Clear
                </button>
            ) : null}

            <button
                type="submit"
                className="rounded-lg bg-[#233041] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
                Search
            </button>
        </form>
    );
}