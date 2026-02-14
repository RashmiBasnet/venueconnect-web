"use server";

import { getProfile, requestPasswordReset, resetPassword, updateUserProfile } from "@/lib/api/user/user";
import { setUserData } from "@/lib/cookie";
import { revalidatePath } from "next/cache";

export const handleGetProfile = async () => {
    try {
        const result = await getProfile();
        if (result.success) {
            return { success: true, data: result.data }
        }
        return {
            success: false,
            message: result.message || "Fetch WhoAmI Failed"
        }
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Fetch WhoAmI Failed"
        };
    }
}

export const handleUpdateUserProfile = async (formData: any) => {
    try {
        const result = await updateUserProfile(formData);
        if (result.success) {
            // update user data in cookie
            await setUserData(result.data);
            // revalidate user profile page
            revalidatePath("/user/update-profile");
            return {
                success: true,
                message: "Profile updated successfully",
                data: result.data
            }
        }
        return {
            success: false,
            message: result.message || "Update profile failed"
        }
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Update profile failed"
        }
    }
}

export const handleRequestPasswordReset = async (email: string) => {
    try {
        const response = await requestPasswordReset(email);
        if (response.success) {
            return {
                success: true,
                message: "Password reset email sent successfully"
            }
        }
        return { success: false, message: response.message || "Request password reset failed" }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Request password reset action failed' }
    }
}

export const handleResetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await resetPassword(token, newPassword);
        if (response.success) {
            return {
                success: true,
                message: 'Password has been reset successfully'
            }
        }
        return { success: false, message: response.message || 'Reset password failed' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Reset password action failed' }
    }
};