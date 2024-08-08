import { GoogleAuth, JWTInput } from "google-auth-library";
import { fetchKvStore, updateKVStore } from "@/lib/vercel-kv";

const generateGcloudToken = async (): Promise<string | undefined> => {
  const data = await fetchKvStore("keyfile");

  const keyfile = data?.value as JWTInput | undefined;
  if (!keyfile) return;

  if (keyfile?.private_key && keyfile?.private_key_id) {
    keyfile.private_key_id = process.env.GCLOUD_PRIVATE_KEY_ID;
  }

  const auth = new GoogleAuth({
    credentials: keyfile,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  return accessToken.token ?? undefined;
};

export const gcloudToken = async (): Promise<string | undefined> => {
  const data = await fetchKvStore("gcloud-token");
  const kvGcloudToken = data?.value as string | undefined;
  if (kvGcloudToken) return kvGcloudToken;

  // generate new token
  const token = await generateGcloudToken();
  if (token) {
    await updateKVStore({
      key: "gcloud-token",
      value: token,
      options: {
        ex: 60 * 55, // expire after 55 minutes
      },
    });
  }
  return token;
};
