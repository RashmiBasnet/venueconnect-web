"use server";

import {
    initiateKhaltiPayment,
    verifyKhaltiPayment,
    khaltiWebhook,
    getPaymentByBookingId,
    getUserPayments,
    getAllPayments,
    type KhaltiInitiateData,
    type KhaltiVerifyData,
    type PaymentStatus,
} from "@/lib/api/payment";

export interface PaymentActionResult {
    success: boolean;
    message?: string;
    data?: any;

    payment?: any;
    payments?: any[];

    page?: number;
    size?: number;
    count?: number;
}

export const handleInitiateKhaltiPayment = async (
    data: KhaltiInitiateData
): Promise<PaymentActionResult> => {
    try {
        const result = await initiateKhaltiPayment(data);

        if (result.success) {
            return {
                success: true,
                message: result.message || "Payment initiated successfully",
                data: result.data,
            };
        }

        return {
            success: false,
            message: result.message || "Failed to initiate payment",
        };
    } catch (err: any) {
        console.error("Error in handleInitiateKhaltiPayment:", err?.response?.data || err);
        return {
            success: false,
            message:
                err?.response?.data?.message ||
                err?.response?.data?.detail ||
                err.message ||
                "Failed to initiate payment",
        };
    }
};

export const handleVerifyKhaltiPayment = async (
    data: KhaltiVerifyData
): Promise<PaymentActionResult> => {
    try {
        const result = await verifyKhaltiPayment(data);

        if (result.success) {
            return {
                success: true,
                message: result.message || "Payment verified successfully",
                data: result.data,
            };
        }

        return {
            success: false,
            message: result.message || "Failed to verify payment",
        };
    } catch (err: any) {
        console.error("Error in handleVerifyKhaltiPayment:", err?.response?.data || err);
        return {
            success: false,
            message:
                err?.response?.data?.message ||
                err?.response?.data?.detail ||
                err.message ||
                "Failed to verify payment",
        };
    }
};

export const handleKhaltiWebhook = async (data: any): Promise<PaymentActionResult> => {
    try {
        const result = await khaltiWebhook(data);

        if (result.success) {
            return {
                success: true,
                message: result.message || "Webhook processed successfully",
                data: result.data,
            };
        }

        return {
            success: false,
            message: result.message || "Failed to process webhook",
        };
    } catch (err: any) {
        console.error("Error in handleKhaltiWebhook:", err?.response?.data || err);
        return {
            success: false,
            message:
                err?.response?.data?.message ||
                err?.response?.data?.detail ||
                err.message ||
                "Failed to process webhook",
        };
    }
};

export const handleGetPaymentByBookingId = async (
    bookingId: string
): Promise<PaymentActionResult> => {
    try {
        const result = await getPaymentByBookingId(bookingId);

        if (result.success) {
            const paymentData = (result as any).payment || result.data;
            return {
                success: true,
                message: result.message || "Payment fetched successfully",
                payment: paymentData,
            };
        }

        return {
            success: false,
            message: result.message || "Failed to fetch payment",
        };
    } catch (err: any) {
        console.error("Error in handleGetPaymentByBookingId:", err?.response?.data || err);
        return {
            success: false,
            message:
                err?.response?.data?.message ||
                err?.response?.data?.detail ||
                err.message ||
                "Failed to fetch payment",
        };
    }
};

export const handleGetUserPayments = async (
    page: number = 1,
    size: number = 10,
    status?: PaymentStatus
): Promise<PaymentActionResult> => {
    try {
        const result = await getUserPayments(page, size, status);

        if (result.success) {
            let paymentsArray: any[] = [];

            if ((result as any).payments && Array.isArray((result as any).payments)) {
                paymentsArray = (result as any).payments;
            } else if (result.data && Array.isArray(result.data)) {
                paymentsArray = result.data;
            } else if (result.data && !Array.isArray(result.data)) {
                paymentsArray = [result.data];
            }

            return {
                success: true,
                message: result.message || "Payments fetched successfully",
                payments: paymentsArray,
                page: (result as any).page ?? page,
                size: (result as any).size ?? size,
                count: (result as any).count ?? paymentsArray.length,
            };
        }

        return {
            success: false,
            message: result.message || "Failed to fetch payments",
            payments: [],
            page,
            size,
            count: 0,
        };
    } catch (err: any) {
        console.error("Error in handleGetUserPayments:", err?.response?.data || err);
        return {
            success: false,
            message:
                err?.response?.data?.message ||
                err?.response?.data?.detail ||
                err.message ||
                "Failed to fetch payments",
            payments: [],
            page,
            size,
            count: 0,
        };
    }
};

export const handleGetAllPayments = async (
    page: number = 1,
    size: number = 10,
    status?: PaymentStatus
): Promise<PaymentActionResult> => {
    try {
        const result = await getAllPayments(page, size, status);

        if (result.success) {
            let paymentsArray: any[] = [];

            if ((result as any).payments && Array.isArray((result as any).payments)) {
                paymentsArray = (result as any).payments;
            } else if (result.data && Array.isArray(result.data)) {
                paymentsArray = result.data;
            } else if (result.data && !Array.isArray(result.data)) {
                paymentsArray = [result.data];
            }

            return {
                success: true,
                message: result.message || "Payments fetched successfully",
                payments: paymentsArray,
                page: (result as any).page ?? page,
                size: (result as any).size ?? size,
                count: (result as any).count ?? paymentsArray.length,
            };
        }

        return {
            success: false,
            message: result.message || "Failed to fetch payments",
            payments: [],
            page,
            size,
            count: 0,
        };
    } catch (err: any) {
        console.error("Error in handleGetAllPayments:", err?.response?.data || err);
        return {
            success: false,
            message:
                err?.response?.data?.message ||
                err?.response?.data?.detail ||
                err.message ||
                "Failed to fetch payments",
            payments: [],
            page,
            size,
            count: 0,
        };
    }
};