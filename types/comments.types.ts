import { z } from "zod";

export const GetCommentSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type GetCommentType = z.infer<typeof GetCommentSchema>;

export const GetCommentsServerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  comments: z.array(
    z.object({
      id: z.string(),
      content: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  ),
  count: z.number(),
});

export type GetCommentsServerResponseType = z.infer<
  typeof GetCommentsServerResponseSchema
>;

export const CreateCommentInputSchema = z.object({
  taskId: z.string(),
  content: z.string(),
});

export type CreateCommentInputType = z.infer<typeof CreateCommentInputSchema>;

export const CreateCommentServerResponseSchema = z.object({
  success: z.string(),
  message: z.string(),
  comment: z.object({
    id: z.string(),
    content: z.string(),
    taskId: z.string(),
    createdAt: z.string(),
  }),
});

export type CreateCommentServerResponseType = z.infer<
  typeof CreateCommentServerResponseSchema
>;

export const CommentFormInputSchema = z.preprocess(
  (val: any) => {
    return {
      content: val?.content ?? "",
    };
  },
  z.object({
    content: z
      .string()
      .min(2, "Minimum two characters required")
      .max(100, "Maximum 100 characters allowed"),
  }),
);

export type CommentFormInputType = z.infer<typeof CommentFormInputSchema>;

export const DeleteCommentServerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type DeleteCommentServerResponseType = z.infer<
  typeof DeleteCommentServerResponseSchema
>;

export const UpdateCommentFormSchema = z.preprocess(
  (val: any) => {
    return {
      content: val?.content ?? "",
    };
  },
  z.object({
    content: z
      .string()
      .min(2, "Min two characters required")
      .max(100, "Maximum 100 characters allowed"),
  }),
);

export type UpdateCommentFormType = z.infer<typeof UpdateCommentFormSchema>;

export const UpdateCommentInputSchema = z.object({
  commentId: z.string(),
  content: z.string(),
});

export type UpdateCommentInputType = z.infer<typeof UpdateCommentInputSchema>;

export const UpdateCommentServerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  comment: z.object({
    id: z.string(),
    content: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

export type UpdateCommentServerResponseType = z.infer<
  typeof UpdateCommentServerResponseSchema
>;
