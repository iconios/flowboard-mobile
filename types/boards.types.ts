import { z } from "zod";

const BoardsSchema = z.object({
  _id: z.string(),
  bg_color: z.string(),
  title: z.string(),
  user: z.object({
    _id: z.string(),
    firstname: z.string(),
    email: z.string(),
  }),
  created_at: z.string(),
  updated_at: z.string(),
});

export type BoardsType = z.infer<typeof BoardsSchema>;

export const GetBoardsServerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  boards: z
    .array(
      z.object({
        _id: z.string(),
        title: z.string(),
        bg_color: z.string(),
        user: z.object({
          _id: z.string(),
          email: z.string(),
          firstname: z.string(),
        }),
        created_at: z.string(),
        updated_at: z.string(),
      }),
    )
    .optional(),
});

export type GetBoardsServerResponseType = z.infer<
  typeof GetBoardsServerResponseSchema
>;

export const GetBoardsOutputSchema = z.object({
  message: z.string(),
  data: z.array(BoardsSchema),
});

export type GetBoardsOutputType = z.infer<typeof GetBoardsOutputSchema>;

export const CreateBoardInputSchema = z.preprocess(
  (val) => val ?? "",
  z
    .object({
      title: z
        .string()
        .min(1, "Title required")
        .max(100, "100 characters maximum allowed"),
      bg_color: z.string(),
    })
    .strict(),
);

export type CreateBoardInputType = z.infer<typeof CreateBoardInputSchema>;

export const CreateBoardServerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  board: z.object({
    id: z.string(),
    title: z.string(),
    bg_color: z.string(),
    lists: z.array(z.string()),
  }),
});

export type CreateBoardServerResponseType = z.infer<
  typeof CreateBoardServerResponseSchema
>;

export const UpdateBoardInputSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    bg_color: z.string(),
  })
  .strict();

export type UpdateBoardInputType = z.infer<typeof UpdateBoardInputSchema>;

export const UpdateBoardServerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  board: z.object({
    id: z.string(),
    title: z.string(),
    bg_color: z.string(),
  }),
});

export type UpdateBoardServerResponseType = z.infer<
  typeof UpdateBoardServerResponseSchema
>;

export const DeleteBoardServerResponseSchema =
  UpdateBoardServerResponseSchema.pick({
    success: true,
    message: true,
  });

export type DeleteBoardServerResponseType = z.infer<
  typeof DeleteBoardServerResponseSchema
>;

export const DeleteBoardOutputSchema = z.object({
  message: z.string(),
});
export type DeleteBoardOutputType = z.infer<typeof DeleteBoardOutputSchema>;

export const UpdateBoardOutputSchema = z.object({
  message: z.string(),
  data: z.object({
    id: z.string(),
    title: z.string(),
    bg_color: z.string(),
  }),
});

export type UpdateBoardOutputType = z.infer<typeof UpdateBoardOutputSchema>;
export type CreateBoardOutputType = z.infer<typeof UpdateBoardOutputSchema>;

export const CreatedBoardSchema = z.object({
  id: z.string(),
  title: z.string(),
  bg_color: z.string().regex(/^#([0-9A-Fa-f]{6})$/),
});

export const CreateBoardModalInputSchema = z.object({
  modalOpen: z.boolean(),
  onClose: z.function(),
});

export type CreateBoardModalInputType = z.infer<
  typeof CreateBoardModalInputSchema
>;

export type HexColorType = z.infer<typeof CreatedBoardSchema>["bg_color"];
