// Get Comments for a Task
/*
#Plan:
1. Get the task id and pass it to the API
2. Send response to client
*/

import { API_BASE_URL } from "@/lib/constants";
import getAuthToken from "@/lib/getAuthToken";
import {
  CreateCommentInputSchema,
  CreateCommentInputType,
  CreateCommentServerResponseType,
  DeleteCommentServerResponseType,
  GetCommentsServerResponseType,
  GetCommentType,
  UpdateCommentInputSchema,
  UpdateCommentInputType,
  UpdateCommentServerResponseType,
} from "@/types/comments.types";
import { ZodError } from "zod";

const GetCommentsService = async (
  taskId: string,
  opts?: { signal?: AbortSignal },
): Promise<GetCommentType[]> => {
  console.log("GetCommentsService called with taskId:", taskId);
  // 1. Get the board id and pass it to the API
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }

  if (!taskId) {
    console.error("No taskId provided to GetCommentsService");
    throw new Error("Task ID is required");
  }
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/comment/${taskId}`, {
      method: "GET",
      signal: opts?.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // 2. Send response to client
    const result: GetCommentsServerResponseType = await response.json();
    console.log(`GetTasks result for ${taskId}`, result);
    if (!result.success) {
      throw new Error(`${result.message}`);
    }

    return result.comments;
  } catch (error) {
    console.error("Error getting comments", error);

    if (error instanceof Error) throw error;

    throw new Error("Error getting comments");
  }
};

// Create Cooment Service
/*
#Plan:
1. Get the task id and pass it to the API
2. Send response to client
*/
const CreateCommentService = async (
  createCommentData: CreateCommentInputType,
) => {
  // 1. Get the board id and pass it to the API
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }
  try {
    const token = await getAuthToken();

    const { taskId, ...newCommentData } =
      CreateCommentInputSchema.parse(createCommentData);
    const response = await fetch(`${API_BASE_URL}/comment/${taskId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCommentData),
    });

    // 2. Send response to client
    const result: CreateCommentServerResponseType = await response.json();
    if (!result.success) {
      throw new Error(`${result.message}`);
    }

    return result.comment;
  } catch (error) {
    console.error("Error creating comment", error);

    if (error instanceof ZodError)
      throw new Error("Error validating comment data");

    if (error instanceof Error) throw error;

    throw new Error("Error creating comment");
  }
};

// Delet Comment Service
/*
#Plan:
1. Get the task id and pass it to the API
2. Send response to client
*/
const DeleteCommentService = async (
  commentId: string,
): Promise<{ message: string }> => {
  // 1. Get the board id and pass it to the API
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/comment/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // 2. Send response to client
    const result: DeleteCommentServerResponseType = await response.json();

    if (!result.success) {
      throw new Error(`${result.message}`);
    }

    return {
      message: `${result.message}`,
    };
  } catch (error) {
    console.error("Error deleting comment", error);

    if (error instanceof Error) throw error;

    throw new Error("Error deleting comment");
  }
};

// Update Comment Service
/*
#Plan:
1. Get the task id and pass it to the API
2. Send response to client
*/
const UpdateCommentService = async (
  updateCommentData: UpdateCommentInputType,
) => {
  // 1. Get the task id and pass it to the API
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }
  try {
    const token = await getAuthToken();
    console.log("Update data", updateCommentData);
    const { commentId, ...updateData } =
      UpdateCommentInputSchema.parse(updateCommentData);
    const response = await fetch(`${API_BASE_URL}/comment/${commentId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    // 2. Send response to client
    const result: UpdateCommentServerResponseType = await response.json();
    if (!result.success) {
      throw new Error(`${result.message}`);
    }

    return result.comment;
  } catch (error) {
    console.error("Error updating comment", error);

    if (error instanceof ZodError)
      throw new Error("Error validating comment data");

    if (error instanceof Error) throw error;

    throw new Error("Error updating comment");
  }
};

export {
  GetCommentsService,
  CreateCommentService,
  DeleteCommentService,
  UpdateCommentService,
};
