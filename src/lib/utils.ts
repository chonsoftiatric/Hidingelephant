import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { saveAs } from "file-saver";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();

    reader.onload = function () {
      resolve(reader.result);
    };

    reader.onerror = function (error) {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

export const downloadBase64AsFile = (
  base64String: string,
  fileName: string
) => {
  try {
    const bstr = atob(base64String);
    const n = bstr.length;
    const uint8Array = new Uint8Array(n);

    for (let i = 0; i < n; i++) {
      uint8Array[i] = bstr.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: "xlsx" });
    saveAs(blob, fileName);
  } catch (error) {
    console.error("Error converting and downloading base64:", error);
  }
};
