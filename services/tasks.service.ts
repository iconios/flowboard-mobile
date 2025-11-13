// Get Tasks for a List

import { API_BASE_URL } from "@/lib/constants";
import { GetUserDataService } from "./auth.service";
import {
  CreateTaskInputSchema,
  CreateTaskInputType,
  CreateTaskServerResponseType,
  DeleteTaskServerResponseType,
  GetTaskServerResponseType,
  GetTaskType,
  UpdateTaskInputSchema,
  UpdateTaskInputType,
  UpdateTaskServerResponseType,
} from "@/types/tasks.types";
import { ZodError } from "zod";

const getAuthToken = async (): Promise<string> => {
  const userData = await GetUserDataService();
  if (!userData?.token) throw new Error("Authentication required");
  return userData.token;
};

/*
#Plan:
1. Get the list id and pass it to the API
2. Send response to client
*/
const GetTasksService = async (
  listId: string,
  opts?: { signal?: AbortSignal },
): Promise<GetTaskType[]> => {
  console.log("GetTasksService called with listId:", listId);
  // 1. Get the board id and pass it to the API
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }

  if (!listId) {
    console.error("No listId provided to GetTasksService");
    throw new Error("List ID is required");
  }
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/task/${listId}`, {
      method: "GET",
      signal: opts?.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // 2. Send response to client
    const result: GetTaskServerResponseType = await response.json();
    console.log(`GetTasks result for ${listId}`, result);
    if (!result.success) {
      throw new Error(`${result.message}`);
    }

    return result.tasks;
  } catch (error) {
    console.error("Error getting tasks", error);

    if (error instanceof Error) throw error;

    throw new Error("Error getting tasks");
  }
};

// Delet Task Service
/*
#Plan:
1. Get the board id and pass it to the API
2. Send response to client
*/
const DeleteTaskService = async (
  taskId: string,
): Promise<{ message: string }> => {
  // 1. Get the board id and pass it to the API
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // 2. Send response to client
    const result: DeleteTaskServerResponseType = await response.json();

    if (!result.success) {
      throw new Error(`${result.message}`);
    }

    return {
      message: `${result.message}`,
    };
  } catch (error) {
    console.error("Error deleting task", error);

    if (error instanceof Error) throw error;

    throw new Error("Error deleting task");
  }
};

// Create Task Service
/*
#Plan:
1. Get the board id and pass it to the API
2. Send response to client
*/
const CreateTaskService = async (createTaskData: CreateTaskInputType) => {
  // 1. Get the board id and pass it to the API
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }
  try {
    const token = await getAuthToken();

    const { listId, ...newTaskData } =
      CreateTaskInputSchema.parse(createTaskData);
    const response = await fetch(`${API_BASE_URL}/task/${listId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTaskData),
    });

    // 2. Send response to client
    const result: CreateTaskServerResponseType = await response.json();
    if (!result.success) {
      throw new Error(`${result.message}`);
    }

    return result.task;
  } catch (error) {
    console.error("Error creating task", error);

    if (error instanceof ZodError)
      throw new Error("Error validating task data");

    if (error instanceof Error) throw error;

    throw new Error("Error creating task");
  }
};

// Update Task Service
/*
#Plan:
1. Get the board id and pass it to the API
2. Send response to client
*/
const UpdateTaskService = async (updateTaskData: UpdateTaskInputType) => {
  // 1. Get the board id and pass it to the API
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }
  try {
    const token = await getAuthToken();
    console.log("Update data", updateTaskData);
    const { taskId, ...updateData } =
      UpdateTaskInputSchema.parse(updateTaskData);
    const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    // 2. Send response to client
    const result: UpdateTaskServerResponseType = await response.json();
    if (!result.success) {
      throw new Error(`${result.message}`);
    }

    return result.task;
  } catch (error) {
    console.error("Error updating task", error);

    if (error instanceof ZodError)
      throw new Error("Error validating task data");

    if (error instanceof Error) throw error;

    throw new Error("Error updating task");
  }
};

export {
  GetTasksService,
  DeleteTaskService,
  CreateTaskService,
  UpdateTaskService,
};
