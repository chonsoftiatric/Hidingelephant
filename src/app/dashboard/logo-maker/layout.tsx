"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserDetails } from "@/services/user.service";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: user } = useUserDetails();
  const router = useRouter();
  return (
    <main className="py-10 container min-h-[80vh]">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex flex-col gap-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          {!user ? (
            <Skeleton className="h-6 w-36" />
          ) : (
            <p className="text-gray-600">{user.firstName + user.lastName}</p>
          )}
        </div>
        {user ? (
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => router.push("/dashboard/logo-maker")}
              size="sm"
            >
              Create Prompt
            </Button>
            <Button onClick={() => signOut()}>Logout</Button>
          </div>
        ) : (
          <Skeleton className="h-12 w-12 rounded-full" />
        )}
      </div>
      <div className="flex items-start gap-x-6 my-6">{children}</div>
    </main>
  );
};

export default Layout;
