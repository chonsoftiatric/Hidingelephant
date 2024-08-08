"use client";

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { queryClient } from "@/providers/TanstackProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  feedImageFormSchema,
  feedImagePostReqSchema,
} from "../schemas/feedImageSchemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TagSelector } from "./TagSelector";
import toast from "react-hot-toast";
import { usePostFeed } from "../hooks/feed.hooks";
import { API_ROUTES } from "@/utils/API_ROUTES";
import { ISubProjectByIdResponseModel } from "@/modules/project/types/api.response.types";

interface IShareImageToExplore {
  imageId: number;
  imageDescription?: string;
  subProjectId: string;
  closeModal: () => void;
  open: () => void;
  updateCanvasNode?: (imageId: number, feedImageId: number) => void;
}

export const ShareImageToExplore = ({
  imageId,
  imageDescription,
  subProjectId,
  updateCanvasNode,
  closeModal,
  open,
}: IShareImageToExplore) => {
  const { mutateAsync: shareImageToFeed, isPending } = usePostFeed({
    subProjectId,
    imageId,
    cb: () => {
      if (updateCanvasNode) {
        setTimeout(open, 2000);
      } else {
        setTimeout(open, 1000);
      }
    },
  });
  const form = useForm<z.infer<typeof feedImageFormSchema>>({
    resolver: zodResolver(feedImageFormSchema),
    defaultValues: {
      description: imageDescription,
    },
  });
  const onSubmit = async (values: z.infer<typeof feedImageFormSchema>) => {
    let tags: number[] = [];
    if (values.tags) {
      tags = await Promise.all(
        values.tags.map((tag) => {
          return +tag.value;
        })
      );
    }
    const payload: z.infer<typeof feedImagePostReqSchema> = {
      imageId: imageId,
      title: values.title,
      description: values.description,
      tags: tags,
    };
    const shareImageToFeedPromise = shareImageToFeed(payload).then((data) => {
      closeModal();
      if (data.imageId) {
        if (updateCanvasNode) {
          updateCanvasNode(data.imageId, data.id);
        }
        const key = [
          API_ROUTES.SUB_PROJECTS.GET_SUB_PROJECT_PROMPTS_BY_ID(subProjectId),
        ];
        const cache = queryClient.getQueryData(
          key
        ) as ISubProjectByIdResponseModel | null;
        if (cache) {
          const newCache = { ...cache };
          const prompt = newCache.prompts.find(
            (prompt) => prompt.id === data.promptId
          );
          if (prompt) {
            const imgToUpdate = prompt.images.find(
              (image) => image.id === data.imageId
            );
            if (imgToUpdate) {
              imgToUpdate.feedImage = data;

              queryClient.setQueryData(key, newCache);
            }
          }
        }
      }
    });
    toast.promise(shareImageToFeedPromise, {
      loading: "Sharing your image to our awesome community!",
      success: "Image shared!",
      error: (err) => err.message,
    });
  };

  return (
    <>
      <DialogHeader className="mt-4">
        <DialogTitle className="text-center">
          Share to Hiding Elephant Community 🐘💙
        </DialogTitle>
        <DialogDescription className="py-4 px-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="What would you like to call your masterpiece?"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="What is it about?"
                        className="mb-4 resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <TagSelector {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="bg-primary-default hover:bg-primary-hover"
                type="submit"
                disabled={isPending}
              >
                Publish
              </Button>
            </form>
          </Form>
        </DialogDescription>
      </DialogHeader>
    </>
  );
};
