"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UsersTable(
    { users, pagination, search } :
    { users: any[]; pagination: any; search: string }
) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(search);
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/admin/users?search=${searchTerm}`);
        router.refresh();
    }

    return (
        <div className="space-y-5">
      {/* Header row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-black">Users</h1>
          <p className="text-sm text-gray-500">
            Search users and manage their information.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex w-full max-w-xl gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm text-black outline-none
                       focus:border-yellow-600 focus:ring-2 focus:ring-yellow-100"
          />
          <button
            type="submit"
            className="rounded-lg bg-yellow-600 px-4 py-2.5 text-sm font-semibold text-white
                       hover:bg-yellow-900 transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-black/5">
              {users?.length ? (
                users.map((user, idx) => (
                  <tr
                    key={user._id}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                    } hover:bg-yellow-50/40 transition`}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-600">
                        {String(user._id).slice(0, 10)}...
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-black">{user.fullName}</div>
                    </td>

                    <td className="px-4 py-3 text-gray-700">{user.email}</td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/users/${user._id}`}
                          className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-black
                                     hover:bg-gray-50 transition"
                        >
                          View
                        </Link>

                        <Link
                          href={`/admin/users/${user._id}/edit`}
                          className="rounded-md bg-yellow-600 px-3 py-1.5 text-xs font-semibold text-white
                                     hover:bg-yellow-900 transition"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="flex flex-col gap-3 border-t border-black/10 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-600">
              Page <span className="font-semibold">{pagination.page}</span> of{" "}
              <span className="font-semibold">{pagination.totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              {pagination.page > 1 ? (
                <Link
                  className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-gray-50 transition"
                  href={`/admin/users?page=${pagination.page - 1}&size=${pagination.size}&search=${encodeURIComponent(
                    search || ""
                  )}`}
                >
                  Previous
                </Link>
              ) : (
                <button
                  disabled
                  className="cursor-not-allowed rounded-lg border border-black/10 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-400"
                >
                  Previous
                </button>
              )}

              {pagination.page < pagination.totalPages ? (
                <Link
                  className="rounded-lg bg-yellow-600 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-900 transition"
                  href={`/admin/users?page=${pagination.page + 1}&size=${pagination.size}&search=${encodeURIComponent(
                    search || ""
                  )}`}
                >
                  Next
                </Link>
              ) : (
                <button
                  disabled
                  className="cursor-not-allowed rounded-lg bg-yellow-100 px-3 py-2 text-sm font-semibold text-yellow-300"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    )
}