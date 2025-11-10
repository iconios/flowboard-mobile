import { z } from "zod";

export const GetTaskServerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  tasks: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      priority: z.string(),
      position: z.number(),
      dueDate: z.string(),
      listId: z.string(),
    }),
  ),
});

export type GetTaskServerResponseType = z.infer<
  typeof GetTaskServerResponseSchema
>;

export const GetTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  dueDate: z.string(),
  priority: z.string(),
  position: z.number(),
  listId: z.string(),
});

export type GetTaskType = z.infer<typeof GetTaskSchema>;

export const DeleteTaskServerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type DeleteTaskServerResponseType = z.infer<
  typeof DeleteTaskServerResponseSchema
>;

export const CreateTaskInputSchema = GetTaskSchema.omit({
  id: true,
});

export type CreateTaskInputType = z.infer<typeof CreateTaskInputSchema>;

export const CreateTaskServerResponseSchema =
  DeleteTaskServerResponseSchema.extend({
    task: GetTaskSchema,
  });

export type CreateTaskServerResponseType = z.infer<
  typeof CreateTaskServerResponseSchema
>;

export const UpdateTaskInputSchema = z.object({
  taskId: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.string().optional(),
  position: z.number().optional(),
});

export type UpdateTaskInputType = z.infer<typeof UpdateTaskInputSchema>;

export const UpdateTaskServerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  task: GetTaskSchema,
});

export type UpdateTaskServerResponseType = z.infer<
  typeof UpdateTaskServerResponseSchema
>;

export const CreateTaskFormInputSchema = CreateTaskInputSchema.omit({
  position: true,
})
  .extend({
    position: z.string(),
  })
  .strict();

export type CreateTaskFormInputType = z.infer<typeof CreateTaskFormInputSchema>;
