import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const updateUserSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters.")
        .max(80, "Full name must be 80 characters or less."),

    email: z
        .string()
        .trim()
        .min(1, "Email is required.")
        .email("Please enter a valid email address."),

    // optional because user may not upload a new image every time
    profilePicture: z
        .any()
        .optional()
        .refine(
            (file) => !file || file instanceof File,
            "Invalid file."
        )
        .refine(
            (file) => !file || file.size <= MAX_FILE_SIZE,
            "Image must be 2MB or less."
        )
        .refine(
            (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Only JPG, PNG, or WEBP images are allowed."
        ),
});

export type UpdateUserType = z.infer<typeof updateUserSchema>;
