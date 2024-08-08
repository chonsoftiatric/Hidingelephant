import { Generate } from "@/app/schema/generate";
import axios from "axios";

export const generate = (payload: Generate) => {
  return axios.post("/api/generate", payload);
};
