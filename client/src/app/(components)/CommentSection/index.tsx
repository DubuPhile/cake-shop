"use client";

import { useEffect, useState } from "react";
import { ThumbsUp, MessageCircle, Send } from "lucide-react";
import { ProductReview } from "@/redux/features/product";
import defaultImg from "../../../../public/default-avatar.png";
import Image from "next/image";
import { TimeInterval } from "@/lib/TimeInterval";
import StarRating from "../StarRating";
import { useToggleLikesMutation } from "@/redux/features/reviewSlice";
import { useAppSelector } from "@/redux/store";

type Props = {
  reviews?: ProductReview[];
};

export default function CommentSection({ reviews }: Props) {
  const [comments, setComments] = useState<ProductReview[] | undefined>();

  useEffect(() => {
    setComments(reviews);
  }, [reviews]);

  const [toggle] = useToggleLikesMutation();

  const toggleLike = async (commentId: string | undefined) => {
    if (!commentId) return;
    try {
      await toggle(commentId).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-2xl w-full bg-white dark:bg-zinc-900 rounded-xl p-4 shadow space-y-4">
      {/* Comments */}
      <div className="space-y-4">
        {comments?.map((comment) => (
          <CommentItem key={comment.id} comment={comment} onLike={toggleLike} />
        ))}
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  onLike,
}: {
  comment: ProductReview;
  onLike: (id: string | undefined) => void;
}) {
  const [showReply, setShowReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const { userId } = useAppSelector((state) => state.auth);

  if (!userId) return;

  return (
    <div className="flex gap-3">
      <Image
        src={comment.user.avatar ?? defaultImg}
        alt="User avatar"
        className="w-9 h-9 rounded-full"
      />

      <div className="flex-1">
        {/* Bubble */}
        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-sm">{comment.user.name}</p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                {comment.comment}
              </p>
            </div>
          </div>

          {/* Rating */}
          {comment.rating && (
            <StarRating initialRating={comment.rating} interactive={false} />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-1 text-xs text-zinc-500 ml-2">
          <button
            onClick={() => onLike(comment.id)}
            className={`flex items-center gap-1 hover:text-blue-500 transition-all duration-300 cursor-pointer ${comment.likes?.some((like) => like.userId === userId) ? "text-blue-500" : ""}`}
          >
            <ThumbsUp
              size={14}
              className={`transition-all duration-300 ${comment.likes?.some((like) => like.userId === userId) ? "fill-blue-500 scale-110 drop-shadow-sm" : ""}`}
            />
            {comment.likesCount}
          </button>

          <button
            onClick={() => setShowReply(!showReply)}
            className="flex items-center gap-1 hover:text-blue-500 cursor-pointer"
          >
            <MessageCircle size={14} />
            Reply
          </button>
          <span>{TimeInterval(comment.createdAt || "")}</span>
        </div>

        {/* Replies */}
        {comment.replies?.length ? (
          <div className="ml-6 mt-3 space-y-3 border-l pl-4 border-zinc-200 dark:border-zinc-700">
            {!showReplies ? (
              <button
                onClick={() => setShowReplies(true)}
                className="text-sm text-gray-500 mb-2 font-medium cursor-pointer"
              >
                View all {comment.replies.length}{" "}
                {comment.replies.length === 1 ? "reply" : "replies"}
              </button>
            ) : (
              ""
            )}

            {showReplies
              ? comment.replies.map((reply) => (
                  <div key={reply.id}>
                    <div className="flex gap-2">
                      <Image
                        src={reply.user.avatar ?? defaultImg}
                        alt="User avatar"
                        className="w-7 h-7 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">{reply.user.name}</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-300">
                          {reply.comment}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-zinc-500 ml-2">
                      <button
                        onClick={() => onLike(reply.id)}
                        className={`flex items-center gap-1 hover:text-blue-500 transition-all duration-300 ${reply.likes?.some((like) => like.userId === userId) ? "text-blue-500" : ""} cursor-pointer`}
                      >
                        <ThumbsUp
                          size={14}
                          className={`transition-all duration-300 ${reply.likes?.some((like) => like.userId === userId) ? "fill-blue-500 scale-110 drop-shadow-sm" : ""}`}
                        />
                        {reply.likesCount}
                      </button>

                      <button
                        onClick={() => setShowReply(!showReply)}
                        className="flex items-center gap-1 hover:text-blue-500 cursor-pointer"
                      >
                        <MessageCircle size={14} />
                        Reply
                      </button>
                      <span>{TimeInterval(reply.createdAt || "")}</span>
                    </div>
                  </div>
                ))
              : ""}
          </div>
        ) : null}

        {/* Reply input */}
        {showReply && (
          <div className="flex gap-2 mt-2">
            <input
              id="Reply-input"
              placeholder="Write a reply..."
              className="flex-1 px-2 py-1 text-sm rounded-md bg-zinc-100 dark:bg-zinc-800"
            />
            <button className="text-blue-500 text-sm">
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
