import { z } from "zod";
function isURL(url: string | undefined) {
  if (!url) return true;
  // Regular expression for a simple URL check
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlRegex.test(url);
}

export const designerProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  userAvatar: z.string().url().optional(),
  userCover: z.string().url().optional(),
  userHeader: z.string().url().optional(),
  linkedinUrl: z
    .string()
    .optional()
    .refine((url) => url === "" || isURL(url), {
      message: "Invalid URL format or must be empty",
    }),
  facebookUrl: z
    .string()
    .optional()
    .refine((url) => url === "" || isURL(url), {
      message: "Invalid URL format or must be empty",
    }),
  twitterUrl: z
    .string()
    .optional()
    .refine((url) => url === "" || isURL(url), {
      message: "Invalid URL format or must be empty",
    }),
});

export type IUpdateDesignerProfile = z.infer<typeof designerProfileSchema>;
