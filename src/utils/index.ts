import { StringChunk } from "drizzle-orm";
import { ZodSchema, z } from "zod";

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.CUSTOM_DOMAIN)
    return `https://${process.env.CUSTOM_DOMAIN}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

// Frontend
export async function urlToBase64(url: string) {
  try {
    // Fetch image data
    const response = await fetch(url);
    const blob = await response.blob();

    // Read data as Base64 string
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
      reader.onerror = reject;
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
}

export const formattedPrompt = (prompt: string) => {
  return prompt.split(" <")[0];
};

export const formattedSubProjectName = (subProjectName: string) => {
  return subProjectName.split("sub-project-")[1];
};
