import { z } from "zod";

export const CreateMemberInputSchema = z.object({
  board_id: z.string(),
  userEmail: z.email(),
  role: z.string(),
});

export type CreateMemberInputType = z.infer<typeof CreateMemberInputSchema>;

export const CreateMemberFormSchema = z.preprocess(
  (val: any) => {
    return {
      userEmail: val?.userEmail ?? "",
      role: val?.role ?? "member",
    };
  },
  z.object({
    userEmail: z.email(),
    role: z.string(),
  }),
);

export type CreateMemberFormType = z.infer<typeof CreateMemberFormSchema>;

export const BoardMemberSchema = z.object({
  memberId: z.string(),
  boardId: z.string(),
  user: z.object({
    userId: z.string(),
    firstname: z.string(),
    email: z.string(),
  }),
  role: z.string(),
  boardOwnerUserId: z.string(),
});

export type BoardMemberType = z.infer<typeof BoardMemberSchema>;

export const GetBoardMembersServerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  members: z.array(BoardMemberSchema),
});

export type GetBoardMembersServerResponseType = z.infer<
  typeof GetBoardMembersServerResponseSchema
>;

export const UpdateBoardMemberSchema = z
  .object({
    role: z.string(),
  })
  .strict();

export type UpdateBoardMemberType = z.infer<typeof UpdateBoardMemberSchema>;

export const UpdateBoardMemberInputSchema = z.object({
  role: z.enum(["admin", "member"]),
  memberId: z.string(),
  board_id: z.string(),
});

export type UpdateBoardMemberInputType = z.infer<
  typeof UpdateBoardMemberInputSchema
>;

export const UpdateMemberServerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  member: z.object({
    memberId: z.string(),
    boardId: z.string(),
    role: z.string(),
    user: z.object({
      userId: z.string(),
      firstname: z.string(),
      email: z.string(),
    }),
    boardOwnerUserId: z.string(),
  }),
});
export type UpdateMemberServerResponseType = z.infer<
  typeof UpdateMemberServerResponseSchema
>;

export const DeleteMemberServerResponseSchema =
  UpdateMemberServerResponseSchema.pick({
    success: true,
    message: true,
  });

export type DeleteMemberServerResponseType = z.infer<
  typeof DeleteMemberServerResponseSchema
>;
