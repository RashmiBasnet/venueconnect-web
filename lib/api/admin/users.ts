import { API } from "../endpoints";
import axios from "../axios";

export const getAllUsers = async ({ page, size, search } : {
    page : number;
    size : number;
    search : string;
}) => {
    try {
        const response = await axios.get(
            API.ADMIN.USER.GET_ALL,
            {
                params: {
                    page,
                    size,
                    search
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(err.response?.data?.message || "Failed to fetch users");
    }
}

export const getUserById = async (id: string) => {
    try {
        const response = await axios.get(
            API.ADMIN.USER.GET_BY_ID(id)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(err.response?.data?.message || "Failed to fetch user");
    }
}