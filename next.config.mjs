/** @type {import('next').NextConfig} */
import withPlaiceholder from "@plaiceholder/next";
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.hidingelephant.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dev-images.hidingelephant.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "80d3ad3546c01dd07745fdcec204d7f1.r2.cloudflarestorage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default withPlaiceholder(nextConfig);
