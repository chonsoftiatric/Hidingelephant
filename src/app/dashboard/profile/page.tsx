"use client";
import Button from "@/components/common/button/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadImage } from "@/services/onBoarding.service";
import { updateUserDetails, useUserDetails } from "@/services/user.service";
import { API_ROUTES } from "@/utils/API_ROUTES";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const profileUpdateSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email({ message: "not a valid email address" }),
  username: z.string(),
  profileImage: z.string(),
});

type IProfileValues = z.infer<typeof profileUpdateSchema>;
const UserProfile = () => {
  const { data: user } = useUserDetails();
  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: async (response) => {
      form.setValue("profileImage", response);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUserDetails,
  });

  const form = useForm<IProfileValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
    },
  });
  const [image, setImage] = React.useState<{
    url: string;
    file: File | null;
  } | null>(null);
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setImage({ file: file, url: URL.createObjectURL(file as File) });
  };

  const uploadImageToCloud = async () => {
    try {
      if (image?.file) {
        const response = uploadImageMutation.mutateAsync(image.file);
        toast.promise(response, {
          error: (err) => err?.response?.statusText || err?.message || "!Error",
          loading: "Uploading Image....",
          success: "Image upload done",
        });
        return response;
      }
    } catch (err) {
      toast.error("!Error");
      return -1;
    }
  };

  const onSubmit = async (values: IProfileValues) => {
    if (image?.file && image.url) {
      await uploadImageToCloud();
    }
    const progress = updateUserMutation.mutateAsync({
      firstName: values.firstName,
      lastName: values.lastName,
      profileImage: form.getValues().profileImage,
    });
    toast.promise(progress, {
      error: (err) => err?.response?.statusText || "!Error",
      loading: "Updating...",
      success: "updated Successfully",
    });
  };

  useEffect(() => {
    if (user) {
      form.setValue("email", user?.email as string);
      form.setValue("firstName", user.firstName);
      form.setValue("lastName", user.lastName);
      form.setValue("username", user?.username as string);
      form.setValue("profileImage", user.profileImage as string);
    }
  }, [user]);

  return (
    <div className="pb-10 overflow-auto container">
      <div className="flex mt-6 items-center justify-between">
        <div className="p-3 font-semibold text-xl">Profile</div>
        <Link href={`/designer/${user?.username}`}>
          <Button>View Public Profile</Button>
        </Link>
      </div>
      <div className="max-md:px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-6 mt-4">
              <div className="h-20 w-20 rounded-full relative">
                {user?.profileImage ? (
                  <Image
                    src={user?.profileImage}
                    alt={user?.firstName || "profile pic"}
                    layout="fill"
                    className="rounded-full object-cover"
                  />
                ) : null}
              </div>

              <div>
                <div className="font-semibold">Profile picture</div>
                <div className="text-sm text-medium-gray">
                  PNG, JPG up to 5MB
                </div>
                <Label
                  htmlFor="profile_picture"
                  className="text-primary-default font-bold"
                >
                  Update
                </Label>
                <Input
                  id="profile_picture"
                  type="file"
                  placeholder="profile picture"
                  className="hidden"
                  onChange={handleImage}
                />
              </div>
            </div>
            <h5 className="font-semibold text-xl mt-10">Details</h5>
            <div className="flex flex-col gap-6 mt-6 max-w-[300px]">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email address" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="first name" {...field} />
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
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button className="mt-6 flex rounded-xl">Save Changes</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UserProfile;
