import { API } from "../endpoints";
import axios from "../axios";

export const createBooking = async (data: any) => {
    try {
        const response = await axios.post(API.BOOKINGS.CREATE, data);
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message || err.message || "Create booking failed"
        );
    }
};

export const getMyBookings = async () => {
    try {
        const response = await axios.get(API.BOOKINGS.GET_MY);
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message || err.message || "Fetch my bookings failed"
        );
    }
};

export const getMyBookingById = async (id: string) => {
    try {
        const response = await axios.get(API.BOOKINGS.GET_MY_BY_ID(id));
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message || err.message || "Fetch booking failed"
        );
    }
};

export const getAllBookings = async ({
    page = 1,
    size = 10,
    search = "",
}: {
    page?: number;
    size?: number;
    search?: string;
}) => {
    try {
        const response = await axios.get(API.ADMIN.BOOKINGS.GET_ALL, {
            params: { page, size, search },
        });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message || err.message || "Fetch bookings failed"
        );
    }
};

export const getBookingByIdAdmin = async (id: string) => {
    try {
        const response = await axios.get(API.ADMIN.BOOKINGS.GET_BY_ID(id));
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message || err.message || "Fetch booking failed"
        );
    }
};

export const updateBookingStatus = async (id: string, data: any) => {
    try {
        const response = await axios.patch(API.ADMIN.BOOKINGS.UPDATE_STATUS(id), data);
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message || err.message || "Update booking status failed"
        );
    }
};

export const updatePaymentStatus = async (id: string, data: any) => {
    try {
        const response = await axios.patch(
            API.ADMIN.BOOKINGS.UPDATE_PAYMENT_STATUS(id),
            data
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message ||
            err.message ||
            "Update payment status failed"
        );
    }
};