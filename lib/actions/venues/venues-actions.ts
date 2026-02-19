"use server";

import {
    getAllVenues,
    getVenueById,
    createVenue,
    updateVenue,
    deleteVenue,
    replaceVenueImages,
} from "@/lib/api/venues/venues";
import { revalidatePath } from "next/cache";

// PUBLIC ACTIONS

export const handleGetAllVenues = async () => {
    try {
        const result = await getAllVenues();
        if (result.success) {
            return { success: true, data: result.data };
        }
        return {
            success: false,
            message: result.message || "Fetch venues failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Fetch venues failed",
        };
    }
};

export const handleGetVenueById = async (venueId: string) => {
    try {
        const result = await getVenueById(venueId);
        if (result.success) {
            return { success: true, data: result.data };
        }
        return {
            success: false,
            message: result.message || "Fetch venue failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Fetch venue failed",
        };
    }
};

// ADMIN ACTIONS

export const handleCreateVenue = async (formData: FormData) => {
    try {
        const result = await createVenue(formData);
        if (result.success) {
            // revalidate admin venue pages
            revalidatePath("/admin/venues");
            return {
                success: true,
                message: "Venue created successfully",
                data: result.data,
            };
        }
        return {
            success: false,
            message: result.message || "Create venue failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Create venue failed",
        };
    }
};

export const handleUpdateVenue = async (
    venueId: string,
    updateData: any
) => {
    try {
        const result = await updateVenue(venueId, updateData);
        if (result.success) {
            revalidatePath("/admin/venues");
            revalidatePath(`/admin/venues/${venueId}`);
            return {
                success: true,
                message: "Venue updated successfully",
                data: result.data,
            };
        }
        return {
            success: false,
            message: result.message || "Update venue failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Update venue failed",
        };
    }
};

export const handleDeleteVenue = async (venueId: string) => {
    try {
        const result = await deleteVenue(venueId);
        if (result.success) {
            revalidatePath("/admin/venues");
            return {
                success: true,
                message: "Venue deleted successfully",
            };
        }
        return {
            success: false,
            message: result.message || "Delete venue failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Delete venue failed",
        };
    }
};

// ADMIN IMAGE ACTIONS

export const handleReplaceVenueImages = async (
    venueId: string,
    formData: FormData
) => {
    try {
        const result = await replaceVenueImages(venueId, formData);
        if (result.success) {
            revalidatePath(`/admin/venues/${venueId}`);
            return {
                success: true,
                message: "Venue images updated successfully",
                data: result.data,
            };
        }
        return {
            success: false,
            message: result.message || "Update venue images failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Update venue images failed",
        };
    }
};
