"use server";

import { getAllUsers, getUserById } from "@/lib/api/admin/users";

export async function handleGetAllUsers(params: {
    page?: number;
    size?: number;
    search?: string;
}) {
    try {
        const currentPage = params.page || 1;
        const pageSize = params.size || 10;
        const searchQuery = params.search || '';
        const response = await getAllUsers({
            page: currentPage,
            size: pageSize,
            search: searchQuery,
        });
        if(response.success) {
            return {
                success: true,
                users: response.data,
                pagination: response.pagination
            }
        }
        return { success: false, users: [], pagination: null };
    } catch (err: Error | any) {
        throw new Error(
            err.message || "Failed to fetch users"
        );
    }
}

export async function handleGetUserById(id: string) {
    try {
        const response = await getUserById(id);
        if(response.success) {
            return {
                success: true,
                data: response.data,
                message: "User Fetched successfully"
            }
        }
        return { success: false, message: "Failed to fetch user" };
    } catch (err: Error | any) {
        throw new Error(
            err.message || "Failed to fetch user"
        );
    }
}