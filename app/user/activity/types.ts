export type BookingStatus =
    | "pending"
    | "accepted"
    | "confirmed"
    | "finished"
    | "cancelled"
    | string;

export type PaymentStatus = "pending" | "paid" | "refunded" | string;

export type VenueUI = {
    _id: string;
    name: string;
    address?: {
        area?: string;
        city?: string;
        country?: string;
    };
    images?: string[];
};

export type PackageUI = {
    _id: string;
    name: string;
    pricePerPlate?: number;
};

export type BookingUI = {
    _id: string;

    venueId?: string | VenueUI;
    packageId?: string | PackageUI;

    eventDate?: string;
    startTime?: string;
    endTime?: string;

    guests?: number;

    status?: BookingStatus;
    paymentStatus?: PaymentStatus;

    totalPrice?: number;
    pricePerPlate?: number;

    createdAt?: string;
    updatedAt?: string;
};