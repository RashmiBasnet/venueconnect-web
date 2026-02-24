import { API } from "../endpoints";
import axios from "../axios";

export const getPackagesByVenue = async (venueId: string) => {
    try {
        const response = await axios.get(API.PACKAGES.GET_BY_VENUE(venueId));
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Fetch packages by venue failed"
        );
    }
};

export const getPackageById = async (id: string) => {
    try {
        const response = await axios.get(API.PACKAGES.GET_BY_ID(id));
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message || err.message || "Fetch package failed"
        );
    }
};

export const getAllPackages = async ({
    page = 1,
    size = 10,
    search = "",
}: {
    page?: number;
    size?: number;
    search?: string;
}) => {
    try {
        const response = await axios.get(
            API.PACKAGES.GET_ALL, {
            params: { page, size, search },
        });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message || err.message || "Fetch packages failed"
        );
    }
};

export const createPackage = async (formData: any) => {
    try {
        const response = await axios.post(API.ADMIN.PACKAGES.CREATE, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message || err.message || "Create package failed"
        );
    }
};

export const updatePackage = async (id: string, updateData: any) => {
    try {
        const response = await axios.put(API.ADMIN.PACKAGES.UPDATE(id), updateData);
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message || err.message || "Update package failed"
        );
    }
};

export const deletePackage = async (id: string) => {
    try {
        const response = await axios.delete(API.ADMIN.PACKAGES.DELETE(id));
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message || err.message || "Delete package failed"
        );
    }
};

export const replacePackageImages = async (id: string, formData: any) => {
    try {
        const response = await axios.put(
            API.ADMIN.PACKAGES.REPLACE_IMAGES(id),
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Replace package images failed"
        );
    }
};
