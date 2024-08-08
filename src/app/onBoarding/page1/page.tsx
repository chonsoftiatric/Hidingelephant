"use client";
import Image from "next/image";
import BlurEffect from "@/components/common/elements/BlurEffect";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useUserDetails } from "@/services/user.service";
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import {
  uploadImage,
  useOnBoardingDetails,
  userOnBoarding,
} from "@/services/onBoarding.service";
import { API_ROUTES } from "@/utils/API_ROUTES";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient } from "@/providers/TanstackProvider";
import TextLogo from "@/components/common/elements/TextLogo";

const formSchema = z.object({
  username: z
    .string({ required_error: "username is required" })
    .min(2, { message: "invalid username" })
    .regex(/^[a-zA-Z0-9-_]+$/, { message: "invalid username" }),
  profileImage: z.string({
    required_error: "user profile picture is required ",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const OnBoardingScreen1 = () => {
  const { data: user } = useUserDetails();
  const { replace } = useRouter();

  const { data: isOnBoarded } = useOnBoardingDetails();

  if (isOnBoarded?.data) {
    // @temp - changed the path from /pricing to /p
    replace("/p/playground");
  }

  const onBoardingMutation = useMutation({
    mutationFn: userOnBoarding,
    onSuccess: () => {
      if (user?.id) {
        const key = API_ROUTES.USER.GET_BY_ID(user.id);
        queryClient.invalidateQueries({ queryKey: [key] });
      }
      replace("/onBoarding/page2");
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: async (response) => {
      form.setValue("profileImage", response);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { profileImage: user?.profileImage as string, username: "" },
    mode: "onSubmit",
  });

  const onFormSubmit = async () => {
    if (image?.file && image?.url) {
      await onUploadImage();
    }
    const response = onBoardingMutation.mutateAsync(form.getValues());
    toast.promise(response, {
      error: (err) => err?.message,
      loading: "loading",
      success: "success",
    });
  };

  const [image, setImage] = React.useState<{
    file: File;
    url: string;
  } | null>();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImage({ file: file, url: URL.createObjectURL(file) });
    } else {
      setImage(null);
    }
  };

  const onUploadImage = async () => {
    try {
      if (image?.file) {
        const response = uploadImageMutation.mutateAsync(image?.file);
        toast.promise(response, {
          error: "Image upload failed",
          loading: "Uploading Image",
          success: "Image Uploaded",
        });
        return response;
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user?.profileImage) {
      form.setValue("profileImage", user?.profileImage);
    }
  }, [user]);

  return (
    <div className="h-[100vh] w-[100vw] overflow-auto flex flex-col relative">
      <BlurEffect type="right" className="w-full" />

      <div className="grid max-md:grid-cols-1 grid-cols-2 h-full">
        {/* first half section of screen */}
        <div className="flex flex-col items-stretch justify-center flex-1 container md:w-[450px] w-[350px]">
          {/* header section */}
          <div className="p-4 flex gap-5 items-center fixed top-0 left-0">
            <TextLogo href="/" />
          </div>
          <h1 className="text-3xl font-bold max-md:mt-10">Hello Desinger,</h1>
          <h1 className="text-3xl font-bold mb-9">
            Welcome to Hiding Elephant
          </h1>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onFormSubmit)}
              className="grid grid-rows-auto gap-5"
            >
              <div className="flex items-center gap-5 justify-start">
                {!user?.profileImage ? (
                  <Skeleton className="w-[80px] h-[80px] rounded-md shadow-md" />
                ) : (
                  <div className="rounded-md overflow-hidden">
                    <Image
                      src={image?.url || user?.profileImage || ""}
                      alt={""}
                      height={80}
                      width={80}
                      className="rounded-full"
                    ></Image>
                  </div>
                )}

                <Button variant={"outline"} type="button" size={"sm"}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  <Label htmlFor="profile_picture">Upload Image</Label>
                  <Input
                    id="profile_picture"
                    type="file"
                    placeholder="profile picture"
                    className="hidden"
                    onChange={handleImage}
                  />
                </Button>
              </div>

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">
                      Choose a Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your username"
                        {...field}
                        onInput={(e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(
                            /[^a-zA-Z0-9-_]/g,
                            ""
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit">
                Continue
              </Button>
            </form>
          </Form>
        </div>

        {/* //second half section of screen  */}
        <div className="grid place-items-center bg-light-cream p-5">
          <Image
            src={"/images/ai-pixel-to-vector-converter.png"}
            alt={"demo image"}
            height={600}
            width={600}
          />
        </div>
      </div>
    </div>
  );
};

export default OnBoardingScreen1;
