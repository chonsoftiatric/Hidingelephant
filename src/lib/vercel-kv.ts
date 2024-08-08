"use server";
import {
  IKVStoreData,
  IVercelKVKey,
  SetCommandOptions,
} from "@/types/vercel-kv";
import { createClient } from "@vercel/kv";

const KV_REST_API_URL = process.env.KV_REST_API_URL as string;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN as string;

const kvStore =
  KV_REST_API_URL && KV_REST_API_TOKEN
    ? createClient({
        url: KV_REST_API_URL,
        token: KV_REST_API_TOKEN,
        cache: "no-cache",
      })
    : null;

export const updateKVStore = async ({
  key,
  value,
  options,
}: IKVStoreData & { options?: SetCommandOptions }) => {
  if (!kvStore) return null;
  try {
    await kvStore.set(key, value, options as any);
  } catch (error) {
    console.error("Error updating KV Store:", error);
  }
};

export const fetchKvStore = async (
  key: IVercelKVKey
): Promise<IKVStoreData | null> => {
  if (!kvStore) return null;
  try {
    const value = await kvStore.get<IKVStoreData["value"]>(key);
    const data = value ? { key, value } : null;
    return data as IKVStoreData | null;
  } catch (error) {
    console.error("Error fetching data from KV Store:", error);
    return null;
  }
};
