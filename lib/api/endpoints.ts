export const API = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login"
    },
    ADMIN: {
        USER: {
            GET_ALL: "/api/admin/users",
            GET_BY_ID: (id: string) => `/api/admin/users/${id}`,
            UPDATE: (id: string) => `/api/admin/users/${id}`,
            DELETE: (id: string) => `/api/admin/users/${id}`,
        },
        VENUES: {
            CREATE: "/api/admin/venues",
            UPDATE: (id: string) => `/api/admin/venues/${id}`,
            DELETE: (id: string) => `/api/admin/venues/${id}`,
            REPLACE_IMAGES: (id: string) => `/api/admin/venues/${id}/images`,
        },
        PACKAGES: {
            CREATE: "/api/admin/packages",
            GET_BY_ID: (id: string) => `/api/admin/packages/${id}`,
            UPDATE: (id: string) => `/api/admin/packages/${id}`,
            DELETE: (id: string) => `/api/admin/packages/${id}`,
            REPLACE_IMAGES: (id: string) => `/api/admin/packages/${id}/images`,
        },
        BOOKINGS: {
            GET_ALL: "/api/admin/booking",
            GET_BY_ID: (id: string) => `/api/admin/booking/${id}`,
            UPDATE_STATUS: (id: string) => `/api/admin/booking/${id}/status`,
            UPDATE_PAYMENT_STATUS: (id: string) =>
                `/api/admin/booking/${id}/payment-status`,
        },
    },
    USER: {
        GET_PROFILE: "/api/user/profile",
        UPDATE_PROFILE: "/api/user/update-profile",
        REQUEST_PASSWORD_RESET: '/api/user/request-password-reset',
        RESET_PASSWORD: (token: string) => `/api/user/reset-password/${token}`,
    },
    VENUES: {
        GET_ALL: "/api/venues",
        GET_BY_ID: (id: string) => `/api/venues/${id}`,
    },
    PACKAGES: {
        GET_ALL: "/api/packages",
        GET_BY_VENUE: (venueId: string) => `/api/packages/venue/${venueId}`,
        GET_BY_ID: (id: string) => `/api/packages/${id}`,
    },
    BOOKINGS: {
        CREATE: "/api/booking",
        GET_MY: "/api/booking/me",
        GET_MY_BY_ID: (id: string) => `/api/booking/${id}`,
    },
}