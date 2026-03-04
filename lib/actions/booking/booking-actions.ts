"use server";

import {
    createBooking,
    getMyBookings,
    getMyBookingById,
    getAllBookings,
    getBookingByIdAdmin,
    updateBookingStatus,
    updatePaymentStatus,
} from "@/lib/api/booking/booking";
import { revalidatePath } from "next/cache";

export const handleCreateBooking = async (data: any) => {
    try {
        const result = await createBooking(data);

        if (result.success) {
            // user booking pages
            revalidatePath("/user/activity");
            revalidatePath("/user");

            return {
                success: true,
                message: "Booking created successfully",
                data: result.data,
            };
        }

        return {
            success: false,
            message: result.message || "Create booking failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Create booking failed",
        };
    }
};

export const handleGetMyBookings = async () => {
    try {
        const result = await getMyBookings();

        if (result.success) {
            return {
                success: true,
                data: result.data,
            };
        }

        return {
            success: false,
            message: result.message || "Fetch my bookings failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Fetch my bookings failed",
        };
    }
};

export const handleGetMyBookingById = async (bookingId: string) => {
    try {
        const result = await getMyBookingById(bookingId);

        if (result.success) {
            return {
                success: true,
                data: result.data,
            };
        }

        return {
            success: false,
            message: result.message || "Fetch booking failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Fetch booking failed",
        };
    }
};

export const handleGetAllBookings = async ({
    page = 1,
    size = 10,
    search = "",
}: {
    page?: number;
    size?: number;
    search?: string;
}) => {
    try {
        const result = await getAllBookings({ page, size, search });

        if (result.success) {
            const p = result.pagination || {};

            return {
                success: true,
                bookings: result.data,
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
            message: result.message || "Fetch bookings failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Fetch bookings failed",
        };
    }
};

export const handleGetBookingByIdAdmin = async (bookingId: string) => {
    try {
        const result = await getBookingByIdAdmin(bookingId);

        if (result.success) {
            return {
                success: true,
                data: result.data,
            };
        }

        return {
            success: false,
            message: result.message || "Fetch booking failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Fetch booking failed",
        };
    }
};

export const handleUpdateBookingStatus = async (
    bookingId: string,
    data: { status: "pending" | "confirmed" | "cancelled" | "completed" }
) => {
    try {
        const result = await updateBookingStatus(bookingId, data);

        if (result.success) {
            revalidatePath("/admin/bookings");
            revalidatePath(`/admin/bookings/${bookingId}`);

            return {
                success: true,
                message: "Booking status updated successfully",
                data: result.data,
            };
        }

        return {
            success: false,
            message: result.message || "Update booking status failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Update booking status failed",
        };
    }
};

export const handleUpdatePaymentStatus = async (
    bookingId: string,
    data: { paymentStatus: "unpaid" | "paid" | "refunded" }
) => {
    try {
        const result = await updatePaymentStatus(bookingId, data);

        if (result.success) {
            revalidatePath("/admin/bookings");
            revalidatePath(`/admin/bookings/${bookingId}`);

            return {
                success: true,
                message: "Payment status updated successfully",
                data: result.data,
            };
        }

        return {
            success: false,
            message: result.message || "Update payment status failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Update payment status failed",
        };
    }
};
