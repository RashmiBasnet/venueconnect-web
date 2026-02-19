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
            GET_ALL: "/api/admin/packages",
            CREATE: "/api/admin/packages",
            GET_BY_ID: (id: string) => `/api/admin/packages/${id}`,
            UPDATE: (id: string) => `/api/admin/packages/${id}`,
            DELETE: (id: string) => `/api/admin/packages/${id}`,
            REPLACE_IMAGES: (id: string) => `/api/admin/packages/${id}/images`,
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
        GET_BY_VENUE: (venueId: string) => `/api/packages/venue/${venueId}`,
        GET_BY_ID: (id: string) => `/api/packages/${id}`,
    },
}