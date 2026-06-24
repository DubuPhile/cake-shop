import { api } from "@/redux/state/api";

export type ReplyData = {
  id: string;
  comment: string;
};

export const reviewSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    toggleLikes: builder.mutation<void, string>({
      query: (id) => ({
        url: `/review/toggle/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Products"],
    }),
    replyComment: builder.mutation<void, ReplyData>({
      query: (data) => ({
        url: `/review/rateReplies/${data.id}`,
        method: "POST",
        body: { ...data },
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const { useToggleLikesMutation, useReplyCommentMutation } = reviewSlice;
