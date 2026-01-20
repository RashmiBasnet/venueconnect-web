"use server";

import { registerUser, loginUser } from "../api/auth";

export const handleRegister = async (formData: any) => {
    try{
        const result = await registerUser(formData);
        if(result.success) {
            return {
                success: true,
                message: "Registration Successful",
                data: result.data,
            };
        }
        return {
            success: false,
            message: result.message || "Registration Failed"
        }
    } catch(err: Error | any) {
        return {
            success: false,
            message: err.message || "Registration Failed"
        }
    }
}

export const handleLogin = async (formData: any) => {
    try{
        const result = await loginUser(formData);
        if(result.success) {
            return {
                success: true,
                data: result.data,
                message: "Login Successful",
            };
        }
        return {
            success: false,
            message: result.message || "Login Failed"
        }
    } catch(err: Error | any) {
        return {
            success: false,
            message: err.message || "Login Failed"
        }
    }
}