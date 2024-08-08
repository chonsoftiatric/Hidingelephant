"use client";

import { useMemo } from "react";
import { useGetComments } from "../hooks/comment.hooks";
import { Comment } from "./Comment";

export const FeedImageComments = ({ id }: { id: string }) => {
  const { data: commentsRes, isLoading } = useGetComments({ id });

  const comments = useMemo(
    () => commentsRes?.pages.flatMap((page) => page.comments) || [],
    [commentsRes]
  );

  return (
    <div>
      {comments?.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.commentId} className="mb-6 lg:mb-8">
            <Comment
              commentId={comment.commentId}
              comment={comment.comment}
              postedAt={comment.postedAt}
              username={comment.username}
              avatar={comment.avatar || undefined}
            />
          </div>
        ))
      ) : (
        <p className="text-center text-sm text-gray-600">No comments yet</p>
      )}
    </div>
  );
};
