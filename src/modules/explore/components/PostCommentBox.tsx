import { useForm } from "react-hook-form";
import { usePostComment } from "../hooks/comment.hooks";
import * as z from "zod";
import { commentPostSchema } from "../schemas/commentSchema";
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
import toast from "react-hot-toast";

export const PostCommentBox = ({ feedImageId }: { feedImageId: number }) => {
  const { mutateAsync } = usePostComment({ id: feedImageId.toString() });
  const onSubmit = async (values: z.infer<typeof commentPostSchema>) => {
    const postCommentPromise = mutateAsync({
      id: feedImageId.toString(),
      payload: values,
    });
    toast
      .promise(postCommentPromise, {
        loading: "Posting your comment",
        success: "Comment posted!",
        error: (err) => err.message,
      })
      .then(() => {
        form.reset({
          comment: "",
        });
      });
  };
  const form = useForm<z.infer<typeof commentPostSchema>>({
    resolver: zodResolver(commentPostSchema),
  });
  return (
    <div>
      <Form {...form}>
        <form className="flex" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Add a comment"
                    className="border-r-0 rounded-r-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="bg-primary-default hover:bg-primary-hover rounded-l-none"
            type="submit"
          >
            Publish
          </Button>
        </form>
      </Form>
    </div>
  );
};
