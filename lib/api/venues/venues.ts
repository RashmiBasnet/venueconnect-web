import { API } from "../endpoints";
import axios from "../axios";

export const getAllVenues = async () => {
    try {
        const response = await axios.get(
            API.VENUES.GET_ALL
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Failed to fetch venues"
        );
    }
};

export const getVenueById = async (venueId: string) => {
    try {
        const response = await axios.get(
            API.VENUES.GET_BY_ID(venueId)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Failed to fetch venue"
        );
    }
};

export const createVenue = async (formData: FormData) => {
    try {
        const response = await axios.post(
            API.ADMIN.VENUES.CREATE,
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
            "Create venue failed"
        );
    }
};

export const updateVenue = async (venueId: string, updateData: any) => {
    try {
        const response = await axios.put(
            API.ADMIN.VENUES.UPDATE(venueId),
            updateData
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Update venue failed"
        );
    }
};

export const deleteVenue = async (venueId: string) => {
    try {
        const response = await axios.delete(
            API.ADMIN.VENUES.DELETE(venueId)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Delete venue failed"
        );
    }
};

export const replaceVenueImages = async (
    venueId: string,
    formData: FormData
) => {
    try {
        const response = await axios.put(
            API.ADMIN.VENUES.REPLACE_IMAGES(venueId),
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
            "Update venue images failed"
        );
    }
};
