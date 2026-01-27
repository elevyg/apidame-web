// @ts-check
import { z } from "zod";

export const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
});

export const clientSchema = z.object({
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string(),
});

export const clientEnv = {
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
};
