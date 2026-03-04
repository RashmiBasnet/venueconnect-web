import axiosInstance from "./axios";
import { API } from "./endpoints";

export interface KhaltiInitiateData {
    bookingId: string;
    amount: number;
    returnUrl: string;
}

export interface KhaltiVerifyData {
    pidx: string;
    bookingId: string;
}

export type PaymentStatus = "pending" | "completed" | "failed";
export type PaymentMethod = "khalti";

export interface Payment {
    _id: string;
    userId: string;
    bookingId: string;
    amount: number;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    transactionId?: string;
    pidx?: string;
    paymentUrl?: string;
    metadata?: any;
    createdAt: string;
    updatedAt: string;
}

export interface InitiateKhaltiResponse {
    success: boolean;
    message?: string;
    data?: {
        payment: Payment;
        paymentUrl: string;
        pidx: string;
    };
}

export interface VerifyKhaltiResponse {
    success: boolean;
    message?: string;
    data?: {
        success: boolean;
        message: string;
        payment: Payment;
    };
}

export interface PaymentResponse {
    success: boolean;
    message?: string;
    data?: Payment | Payment[];
    payment?: Payment;
    payments?: Payment[];
    page?: number;
    size?: number;
    count?: number;
}

export const initiateKhaltiPayment = async (
    data: KhaltiInitiateData
): Promise<InitiateKhaltiResponse> => {
    try {
        const response = await axiosInstance.post(API.PAYMENTS.KHALTI.INITIATE, data);
        return response.data;
    } catch (error: any) {
        console.error("Error initiating Khalti payment:", error?.response?.data || error);
        throw error;
    }
};

export const verifyKhaltiPayment = async (
    data: KhaltiVerifyData
): Promise<VerifyKhaltiResponse> => {
    try {
        const response = await axiosInstance.post(API.PAYMENTS.KHALTI.VERIFY, data);
        return response.data;
    } catch (error: any) {
        console.error("Error verifying Khalti payment:", error?.response?.data || error);
        throw error;
    }
};

export const khaltiWebhook = async (
    data: any
): Promise<{ success: boolean; message?: string; data?: any }> => {
    try {
        const response = await axiosInstance.post(API.PAYMENTS.KHALTI.WEBHOOK, data);
        return response.data;
    } catch (error: any) {
        console.error("Error processing webhook:", error?.response?.data || error);
        throw error;
    }
};

export const getPaymentByBookingId = async (
    bookingId: string
): Promise<PaymentResponse> => {
    try {
        const response = await axiosInstance.get(
            API.PAYMENTS.USER.GET_BY_BOOKING_ID(bookingId)
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching payment by booking:", error?.response?.data || error);
        throw error;
    }
};

export const getUserPayments = async (
    page: number = 1,
    size: number = 10,
    status?: PaymentStatus
): Promise<PaymentResponse> => {
    try {
        let url = `${API.PAYMENTS.USER.GET_MY}?page=${page}&size=${size}`;
        if (status) url += `&status=${status}`;

        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching user payments:", error?.response?.data || error);
        throw error;
    }
};

export const getAllPayments = async (
    page: number = 1,
    size: number = 10,
    status?: PaymentStatus
): Promise<PaymentResponse> => {
    try {
        let url = `${API.ADMIN.PAYMENTS.GET_ALL}?page=${page}&size=${size}`;
        if (status) url += `&status=${status}`;

        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching all payments:", error?.response?.data || error);
        throw error;
    }
};