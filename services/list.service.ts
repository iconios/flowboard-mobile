import { API_BASE_URL } from "@/lib/constants";
import {
  CreateListInputSchema,
  CreateListInputType,
  CreateListServerResponseType,
  DeleteListServerResponseType,
  GetListServerResponseType,
  UpdateListInputSchema,
  UpdateListInputType,
  UpdateListServerResponseType,
} from "@/types/list.types";
import { ZodError } from "zod";
import getAuthToken from "@/lib/getAuthToken";

// Get Lists for a Board
/*
#Plan:
1. Get the board id and pass it to the API
2. Send response to client
*/
const GetListsService = async (boardId: string) => {
  // 1. Get the board id and pass it to the API
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/list/${boardId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // 2. Send response to client
    const result: GetListServerResponseType = await response.json();
    if (!result.success) {
      throw new Error(`${result.message}`);
    }

    return result.lists;
  } catch (error) {
    console.error("Error getting lists", error);

    if (error instanceof Error) throw error;

    throw new Error("Error getting lists");
  }
};

// Create List Service
/*
#Plan:
1. Get the board id and pass it to the API
2. Send response to client
*/
const CreateListService = async (createListData: CreateListInputType) => {
  // 1. Get the board id and pass it to the API
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }
  try {
    const token = await getAuthToken();

    const { boardId, ...newListData } =
      CreateListInputSchema.parse(createListData);
    const response = await fetch(`${API_BASE_URL}/list/${boardId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newListData),
    });

    // 2. Send response to client
    const result: CreateListServerResponseType = await response.json();
    if (!result.success) {
      throw new Error(`${result.message}`);
    }

    return result.list;
  } catch (error) {
    console.error("Error creating list", error);

    if (error instanceof ZodError)
      throw new Error("Error validating list data");

    if (error instanceof Error) throw error;

    throw new Error("Error creating list");
  }
};

// Update List Service
/*
#Plan:
1. Get the board id and pass it to the API
2. Send response to client
*/

const UpdateListService = async (updateListData: UpdateListInputType) => {
  // 1. Get the board id and pass it to the API
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }
  try {
    const token = await getAuthToken();

    const { listId, ...updateData } =
      UpdateListInputSchema.parse(updateListData);
    const response = await fetch(`${API_BASE_URL}/list/${listId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    // 2. Send response to client
    const result: UpdateListServerResponseType = await response.json();
    if (!result.success) {
      throw new Error(`${result.message}`);
    }

    return result.list;
  } catch (error) {
    console.error("Error updating list", error);

    if (error instanceof ZodError)
      throw new Error("Error validating list data");

    if (error instanceof Error) throw error;

    throw new Error("Error updating list");
  }
};

// Delet List Service
/*
#Plan:
1. Get the board id and pass it to the API
2. Send response to client
*/
const DeleteListService = async (listId: string) => {
  // 1. Get the board id and pass it to the API
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/list/${listId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // 2. Send response to client
    const result: DeleteListServerResponseType = await response.json();

    if (!result.success) {
      throw new Error(`${result.message}`);
    }

    return {
      message: `${result.message}`,
    };
  } catch (error) {
    console.error("Error deleting list", error);

    if (error instanceof Error) throw error;

    throw new Error("Error deleting list");
  }
};
export {
  GetListsService,
  CreateListService,
  UpdateListService,
  DeleteListService,
};
