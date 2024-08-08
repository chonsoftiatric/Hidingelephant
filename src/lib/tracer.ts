import axios from "axios";
import { ImageTracer } from "@image-tracer-ts/core";
import { PNG } from "pngjs";

export function downloadSVG(svgCode: string, filename: string) {
  const blob = new Blob([svgCode], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "generated.svg";

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function imageUrlToBuffer(imageUrl: string) {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const png = new PNG();
    const parsedImage = await new Promise((resolve, reject) => {
      png.parse(response.data, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    return parsedImage as ImageData;
  } catch (error) {
    console.error("Error fetching the image:", error);
    throw error;
  }
}

export const generateVector = async (imageUrl: string) => {
  const imageData = await imageUrlToBuffer(imageUrl);
  const options = {
    scale: 1,
    ltres: 1,
    qtres: 1,
    pathomit: 12,
    numberofcolors: 4,
    colorquantcycles: 2,
  };
  const tracer = new ImageTracer(options);
  const svgString = tracer.traceImageToSvg(imageData);
  return svgString;
};