import crypto from "node:crypto";
import { getPlaiceholder } from "plaiceholder";

export function generateUniqueString(email: string) {
  const hash = crypto.createHash("sha256");
  hash.update(email);
  const hashedString = hash.digest("hex");

  // Take the first 10 characters for a short unique string
  return hashedString.substring(0, 10);
}

export const getBlurHashBase64 = async (imgUrl: string) => {
  try {
    const buffer = await fetch(imgUrl).then(async (res) =>
      Buffer.from(await res.arrayBuffer())
    );
    const { base64 } = await getPlaiceholder(buffer);
    return base64;
  } catch (error) {
    return undefined;
  }
};
