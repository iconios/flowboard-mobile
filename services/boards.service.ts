// Get all boards
/*
#Plan:
1. Get and validate token
2. Fetch the boards from the server
3. Return the boards to the client
*/

import { API_BASE_URL } from "@/lib/constants";
import { GetUserDataService } from "./auth.service";
import {
  CreateBoardInputSchema,
  CreateBoardInputType,
  CreateBoardOutputType,
  CreateBoardServerResponseType,
  DeleteBoardOutputType,
  DeleteBoardServerResponseType,
  GetBoardsServerResponseType,
  UpdateBoardInputSchema,
  UpdateBoardInputType,
  UpdateBoardOutputType,
  UpdateBoardServerResponseType,
} from "@/types/boards.types";
import { ZodError } from "zod";

const GetBoardsService = async () => {
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }
  try {
    // 1. Get and validate token
    const userData = await GetUserDataService();
    if (!userData) throw new Error("User data is required");
    const token = userData.token;
    if (!token) throw new Error("Token not found");
    // 2. Fetch the boards from the server
    const response = await fetch(`${API_BASE_URL}/board/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 3. Return the boards to the client
    const result: GetBoardsServerResponseType = await response.json();
    console.log("Boards from server action", result);

    // 2. Return the result to the user
    if (!result.success) {
      throw new Error(`${result.message}`);
    }

    if (!result.boards) {
      throw new Error("No boards found");
    }

    console.log("Boards details for client", result.boards);
    return {
      message: `${result.message}`,
      data: result.boards,
    };
  } catch (error) {
    console.error("Error fetching board data", error);

    if (error instanceof Error) throw error;

    throw new Error("Error fetching board data");
  }
};

// Create board Service
/*
#Plan:
1. Get and validate the  board data
2. Pass the data to the API
3. Get the server response and send to the client
*/
const CreateBoardService = async (
  createBoardData: CreateBoardInputType,
): Promise<CreateBoardOutputType> => {
  // 1. Get and validate the  board data
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }
  try {
    const userData = await GetUserDataService();
    if (!userData) throw new Error("User data is required");
    const token = userData.token;
    if (!token) throw new Error("Token not found");

    // 2. Pass the data to the API
    const validatedData = CreateBoardInputSchema.parse(createBoardData);
    const response = await fetch(`${API_BASE_URL}/board/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    // 3. Get the server response and send to the client
    const result: CreateBoardServerResponseType = await response.json();
    console.log("Boards from server action", result);

    if (!result.success) {
      throw new Error(`${result.message}`);
    }

    console.log("Boards details for client", result.board);
    return {
      message: `${result.message}`,
      data: result.board,
    };
  } catch (error) {
    console.error("Error creating board", error);

    if (error instanceof ZodError) {
      throw new Error("Error validating board data");
    }

    if (error instanceof Error) throw error;

    throw new Error("Error creating board");
  }
};

// Update board Service
/*
#Plan:
1. Get and validate the  board data
2. Pass the data to the API
3. Get the server response and send to the client
*/
const UpdateBoardService = async (
  boardUpdateData: UpdateBoardInputType,
): Promise<UpdateBoardOutputType> => {
  // 1. Get and validate the  board data
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }
  try {
    const userData = await GetUserDataService();
    if (!userData) throw new Error("User data is required");
    const token = userData.token;
    if (!token) throw new Error("Token not found");

    // 2. Pass the data to the API
    console.log("Update board values", boardUpdateData);
    const { id, ...boardData } = UpdateBoardInputSchema.parse(boardUpdateData);
    const response = await fetch(`${API_BASE_URL}/board/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(boardData),
    });

    // 3. Get the server response and send to the client
    const result: UpdateBoardServerResponseType = await response.json();
    console.log("Boards from server action", result);

    if (!result.success) {
      throw new Error(`${result.message}`);
    }

    console.log("Boards details for client", result.board);
    return {
      message: `${result.message}`,
      data: result.board,
    };
  } catch (error) {
    console.error("Error updating board", error);

    if (error instanceof ZodError) {
      throw new Error("Error validating board data");
    }

    if (error instanceof Error) throw error;

    throw new Error("Error updating board");
  }
};

// Delete board Service
/*
#Plan:
1. Get and validate the  board data
2. Pass the data to the API
3. Get the server response and send to the client
*/
const DeleteBoardService = async (
  id: string,
): Promise<DeleteBoardOutputType> => {
  // 1. Get and validate the  board data
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }
  try {
    const userData = await GetUserDataService();
    if (!userData) throw new Error("User data is required");
    const token = userData.token;
    if (!token) throw new Error("Token not found");

    // 2. Pass the data to the API
    const response = await fetch(`${API_BASE_URL}/board/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // 3. Get the server response and send to the client
    const result: DeleteBoardServerResponseType = await response.json();

    if (!result.success) {
      throw new Error(`${result.message}`);
    }

    return {
      message: `${result.message}`,
    };
  } catch (error) {
    console.error("Error deleting board", error);

    if (error instanceof Error) throw error;

    throw new Error("Error deleting board");
  }
};

export {
  GetBoardsService,
  CreateBoardService,
  UpdateBoardService,
  DeleteBoardService,
};
