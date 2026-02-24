"use server";

import {
    getAllPackages,
    getPackageById,
    getPackagesByVenue,
    createPackage,
    updatePackage,
    deletePackage,
    replacePackageImages,
} from "@/lib/api/packages/packages";
import { revalidatePath } from "next/cache";


export const handleGetPackagesByVenue = async (venueId: string) => {
    try {
        const result = await getPackagesByVenue(venueId);
        if (result.success) {
            return { success: true, data: result.data };
        }
        return {
            success: false,
            message: result.message || "Fetch packages failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Fetch packages failed",
        };
    }
};

export const handleGetPackageById = async (packageId: string) => {
    try {
        const result = await getPackageById(packageId);
        if (result.success) {
            return { success: true, data: result.data };
        }
        return {
            success: false,
            message: result.message || "Fetch package failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Fetch package failed",
        };
    }
};

export const handleGetAllPackages = async ({
    page = 1,
    size = 10,
    search = "",
}: {
    page?: number;
    size?: number;
    search?: string;
}) => {
    try {
        const result = await getAllPackages({ page, size, search });
        if (result.success) {
            const p = result.pagination || {};
            return {
                success: true,
                packages: result.data,
                pagination: {
                    page: Number(p.page ?? page),
                    size: Number(p.size ?? size),
                    total: Number(p.totalItems ?? 0),
                    totalPages: Number(p.totalPages ?? 1),
                },
            };
        }
        return {
            success: false,
            message: result.message || "Fetch packages failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Fetch packages failed",
        };
    }
};

export const handleCreatePackage = async (formData: FormData) => {
    try {
        const result = await createPackage(formData);
        if (result.success) {
            revalidatePath("/admin/packages");
            return {
                success: true,
                message: "Package created successfully",
                data: result.data,
            };
        }
        return {
            success: false,
            message: result.message || "Create package failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Create package failed",
        };
    }
};

export const handleUpdatePackage = async (
    packageId: string,
    updateData: any
) => {
    try {
        const result = await updatePackage(packageId, updateData);
        if (result.success) {
            revalidatePath("/admin/packages");
            revalidatePath(`/admin/packages/${packageId}`);
            return {
                success: true,
                message: "Package updated successfully",
                data: result.data,
            };
        }
        return {
            success: false,
            message: result.message || "Update package failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Update package failed",
        };
    }
};

export const handleDeletePackage = async (packageId: string) => {
    try {
        const result = await deletePackage(packageId);
        if (result.success) {
            revalidatePath("/admin/packages");
            return {
                success: true,
                message: "Package deleted successfully",
            };
        }
        return {
            success: false,
            message: result.message || "Delete package failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Delete package failed",
        };
    }
};

export const handleReplacePackageImages = async (
    packageId: string,
    formData: FormData
) => {
    try {
        const result = await replacePackageImages(packageId, formData);
        if (result.success) {
            revalidatePath(`/admin/packages/${packageId}`);
            return {
                success: true,
                message: "Package images updated successfully",
                data: result.data,
            };
        }
        return {
            success: false,
            message: result.message || "Update package images failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Update package images failed",
        };
    }
};
