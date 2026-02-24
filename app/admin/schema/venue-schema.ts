import { z } from "zod";

export const createVenueSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    address: z.object({
        area: z.string().optional(),
        city: z.string().default("Kathmandu"),
        country: z.string().default("Nepal"),
        zipCode: z.string().optional(),
    }),
    pricePerPlate: z.number().min(0, "Price must be greater than 0"),
    capacity: z.object({
        minGuests: z.number().min(1, "Minimum guests must be at least 1"),
        maxGuests: z.number().min(1, "Maximum guests must be at least 1"),
    }),
    amenities: z.union([
        z.array(z.string()),
        z.string().transform((val) => val.split(',').map(s => s.trim()).filter(Boolean))
    ]).default([]),
    isActive: z.boolean().default(true),
});

export type CreateVenueType = z.infer<typeof createVenueSchema>;


export const venueSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    address: z
        .object({
            area: z.string().optional(),
            city: z.string().optional(),
            country: z.string().optional(),
            zipCode: z.string().optional(),
        })
        .optional(),
    images: z.array(z.string()).optional(),
    pricePerPlate: z.number().optional(),
    capacity: z
        .object({
            minGuests: z.number().optional(),
            maxGuests: z.number().optional(),
        })
        .optional(),
    amenities: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
});

export type VenueType = z.infer<typeof venueSchema>;
export const venueListSchema = z.array(venueSchema);

export const updateVenueSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    address: z.object({
        area: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
        zipCode: z.string().optional(),
    }),
    pricePerPlate: z.number().min(0),
    capacity: z.object({
        minGuests: z.number().min(1),
        maxGuests: z.number().min(1),
    }),
    amenities: z.union([
        z.array(z.string()),
        z.string().transform((val) => val.split(',').map(s => s.trim()).filter(Boolean))
    ]).default([]),
    isActive: z.boolean(),
});

export type UpdateVenueType = z.infer<typeof updateVenueSchema>;