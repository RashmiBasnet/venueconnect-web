import { API } from "../endpoints";
import axios from "../axios";

export const getProfile = async () => {
    try {
        const response = await axios.get(
            API.USER.GET_PROFILE,
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Profile Fetch Failed"
        );
    }
}

export const updateUserProfile = async (updateData: any) => {
    try {
        const response = await axios.put(
            API.USER.UPDATE_PROFILE,
            updateData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error
            (
                err.response?.data?.message
                || err.message
                || "Update profile failed"
            );
    }
}

export const requestPasswordReset = async (email: string) => {
    try {
        const response = await axios.post(
            API.USER.REQUEST_PASSWORD_RESET,
            { email }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Request password reset failed');
    }
}

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await axios.post(
            API.USER.RESET_PASSWORD(token),
            {
                newPassword: newPassword
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Reset password failed');
    }
}