export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/p",
    "/p/playground",
    "/p/:path",
    "/user",
    "/user/:path*",
    "/pricing",
    "/canvas/:path*",
  ],
};
