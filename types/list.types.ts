import { z } from "zod";

export const GetListServerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  lists: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      position: z.number(),
      status: z.string(),
      boardId: z.string(),
    }),
  ),
});

export type GetListServerResponseType = z.infer<
  typeof GetListServerResponseSchema
>;

export const CreateListFormInputSchema = z.preprocess(
  (val: any) => {
    return {
      title: val?.title ?? "",
      position: val?.position ?? "0",
      status: val?.status ?? "active",
    };
  },
  z.object({
    title: z
      .string()
      .min(1, "Required")
      .min(2, "Minimum two characters required")
      .max(100, "Maximum 100 characters allowed"),
    position: z.string().min(1, "Required"),
    status: z.string(),
  }),
);

export type CreateListFormInputType = z.infer<typeof CreateListFormInputSchema>;

export const CreateListInputSchema = z
  .object({
    boardId: z.string(),
    title: z.string(),
    position: z.number(),
    status: z.string(),
  })
  .strict();

export type CreateListInputType = z.infer<typeof CreateListInputSchema>;

export const CreateListServerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  list: z.object({
    id: z.string(),
    title: z.string(),
    position: z.number(),
    status: z.string(),
    boardId: z.string(),
  }),
});

export type CreateListServerResponseType = z.infer<
  typeof CreateListServerResponseSchema
>;
export type UpdateListServerResponseType = z.infer<
  typeof CreateListServerResponseSchema
>;

export const UpdateListInputSchema = z.object({
  title: z.string().optional(),
  position: z.number().optional(),
  status: z.string().optional(),
  listId: z.string(),
});

export type UpdateListInputType = z.infer<typeof UpdateListInputSchema>;

export const DeleteListServerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  list: z.object({
    id: z.string(),
  }),
});

export type DeleteListServerResponseType = z.infer<
  typeof DeleteListServerResponseSchema
>;

export const UpdateListFormInputSchema = z
  .object({
    title: z.string(),
    status: z.string(),
    position: z.string(),
  })
  .strict();

export type UpdateListFormInputType = z.infer<typeof UpdateListFormInputSchema>;
