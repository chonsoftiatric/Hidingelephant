// app/providers.tsx
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
if (typeof window !== "undefined" && key && host) {
  posthog.init(key, {
    api_host: host,
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
  });
}

export default function PosthogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
