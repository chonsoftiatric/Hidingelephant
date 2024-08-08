"use client";

import { useForm } from "react-hook-form";
import {
  IUpdateDesignerProfile,
  designerProfileSchema,
} from "../schemas/designer.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera, Loader } from "lucide-react";
import { uploadImage } from "@/services/onBoarding.service";
import { API_ROUTES } from "@/utils/API_ROUTES";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useUpdateDesigner } from "../hooks/designer.hooks";
import { useUserDetails } from "@/services/user.service";
import toast from "react-hot-toast";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { queryClient } from "@/providers/TanstackProvider";

export const EditProfileForm = ({ onClose }: { onClose: () => void }) => {
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [isUserAvatarUploading, setIsUserAvatarUploading] = useState(false);
  const { data: user, refetch } = useUserDetails();

  const form = useForm<IUpdateDesignerProfile>({
    resolver: zodResolver(designerProfileSchema),
    defaultValues: {
      userAvatar: user?.profileImage || "",
      userCover: user?.coverImage || undefined,
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      linkedinUrl: user?.linkedinUrl || "",
      facebookUrl: user?.facebookUrl || "",
      twitterUrl: user?.twitterUrl || "",
    },
  });

  const { mutateAsync: uploadFile } = useMutation({
    mutationFn: uploadImage,
  });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    const isCover = event.target.name === "cover";
    if (file) {
      if (isCover) {
        setIsCoverUploading(true);
      } else {
        setIsUserAvatarUploading(true);
      }
      await uploadFile(file).then((response) => {
        if (isCover) {
          form.setValue("userCover", response);
        } else {
          form.setValue("userAvatar", response);
        }
      });
      setIsUserAvatarUploading(false);
      setIsCoverUploading(false);
    }
  };

  const { mutateAsync: updateDesigner, isPending } = useUpdateDesigner();
  const onSubmit = async (values: IUpdateDesignerProfile) => {
    const updateDesignerPromise = updateDesigner(values);
    toast
      .promise(updateDesignerPromise, {
        loading: "Updating profile...",
        success: "Profile updated!",
        error: "Failed to update profile",
      })
      .then(() => {
        refetch();
        queryClient.invalidateQueries({
          queryKey: ["get-designer", user?.username],
        });
        onClose();
      });
  };
  const coverImage = form.watch("userCover");
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative bg-gradient-to-br from-[rgba(244,184,255,0.2)] to-[rgba(46,157,254,0.2)] w-full h-44 flex justify-center items-center">
          {coverImage ? (
            <Image objectFit="cover" layout="fill" src={coverImage} alt="" />
          ) : null}
          <label htmlFor="cover-upload" className="cursor-pointer">
            <div className="p-2 rounded-full bg-opacity-30 bg-black backdrop-blur-sm">
              {isCoverUploading ? (
                <Loader className="stroke-white animate-spin" size={24} />
              ) : (
                <Camera className="stroke-white" size={24} />
              )}
            </div>
          </label>
          <input
            id="cover-upload"
            type="file"
            accept="image/*"
            name="cover"
            hidden
            disabled={isCoverUploading}
            onChange={handleImageUpload}
          />
        </div>
        <div
          className="relative bottom-16 left-8 h-32 w-32 rounded-full bg-gray-40 flex items-center justify-center"
          style={{
            background: `url(${
              form.getValues().userAvatar
            }) no-repeat center center / cover`,
          }}
        >
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <div className="p-2 rounded-full bg-opacity-30 bg-black backdrop-blur-sm">
              {isUserAvatarUploading ? (
                <Loader className="stroke-white animate-spin" size={24} />
              ) : (
                <Camera className="stroke-white" size={24} />
              )}
            </div>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            name="avatar"
            hidden
            disabled={isUserAvatarUploading}
            onChange={handleImageUpload}
          />
        </div>
        <div className="px-8 relative bottom-8 flex flex-col md:flex-row gap-8">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-left">First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-left">Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator />
        <div className="px-8 mt-4 mb-8 space-y-2">
          <FormField
            control={form.control}
            name={"facebookUrl"}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-left">Facebook Url</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    {...field}
                    onInput={(e) => {
                      const val = e.currentTarget.value;
                      const splitVal =
                        val.split("https://facebook.com/")[1] || "";
                      e.currentTarget.value = `https://facebook.com/${splitVal}`;
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="twitterUrl"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-left">Twitter Url</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    {...field}
                    onInput={(e) => {
                      const val = e.currentTarget.value;
                      const splitVal =
                        val.split("https://twitter.com/")[1] || "";
                      e.currentTarget.value = `https://twitter.com/${splitVal}`;
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="linkedinUrl"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-left">Linkedin Url</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    {...field}
                    onInput={(e) => {
                      const val = e.currentTarget.value;
                      const splitVal =
                        val.split("https://linkedin.com/")[1] || "";
                      e.currentTarget.value = `https://linkedin.com/${splitVal}`;
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className="bg-primary-default hover:bg-primary-hover w-full rounded-t-none"
          size={"sm"}
          type="submit"
          disabled={isUserAvatarUploading || isPending}
        >
          Save Changes
        </Button>
      </form>
    </Form>
  );
};
