import { z } from "zod";

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