"use client";
import { updateProjectVisibility } from "@/actions/project/project";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { queryClient } from "@/providers/TanstackProvider";
import { API_ROUTES } from "@/utils/API_ROUTES";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
type Visibility = "PUBLIC" | "PRIVATE";
type Props = {
  children: React.ReactNode;
  initialVisibility: Visibility;
  projectId: number;
};
const UpdateSubProjectVisibility = ({
  children,
  initialVisibility,
  projectId,
}: Props) => {
  const [visibility, setVisibility] = React.useState(initialVisibility);
  const [loading, setLoading] = React.useState(false);

  const handleVisibilityChange = (val: boolean) => {
    const updatedVisbility = val ? "PRIVATE" : "PUBLIC";

    setLoading(true);
    const promise = updateProjectVisibility(projectId, updatedVisbility);
    toast
      .promise(promise, {
        loading: "Updating visibility...",
        success: "Visibility updated successfully",
        error: (err) => err.message,
      })
      .then(async (visibility) => {
        await queryClient.invalidateQueries({
          queryKey: [API_ROUTES.PROJECTS.CURRENT_USER_PROJECTS],
        });
        setVisibility(visibility);
      })
      .catch((err) => {
        console.log(err?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogTitle>Update visibility</DialogTitle>
          <DialogDescription>
            Toggle the visibility of project images. If set to public, all
            images generated in this project will appear on our{" "}
            <Link
              className="text-primary-default underline"
              href="/explore/live"
              target="_blank"
            >
              Live Feed page
            </Link>
            . If set to private, they will not.
          </DialogDescription>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <p
                  className={cn("font-semibold text-gray-500", {
                    "font-semibold text-black": visibility === "PUBLIC",
                  })}
                >
                  Public
                </p>
                <Switch
                  checked={visibility === "PRIVATE"}
                  onCheckedChange={handleVisibilityChange}
                  disabled={loading}
                />
                <p
                  className={cn("font-semibold text-gray-500", {
                    "font-semibold text-black": visibility === "PRIVATE",
                  })}
                >
                  Private
                </p>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateSubProjectVisibility;
