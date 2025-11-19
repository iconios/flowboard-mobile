import { API_BASE_URL } from "@/lib/constants";
import getAuthToken from "@/lib/getAuthToken";
import {
  CreateMemberInputType,
  CreateMemberInputSchema,
  GetBoardMembersServerResponseType,
  UpdateBoardMemberInputType,
  UpdateBoardMemberInputSchema,
  UpdateMemberServerResponseType,
  DeleteMemberServerResponseType,
} from "@/types/members.types";
import { ZodError } from "zod";

// Create Board Member Service
/*
#Plan:
1. Get and validate the board and related data
2. Pass the data to the API
3. Get the server response and send to the client
*/
const CreateBoardMemberService = async (
  createMemberData: CreateMemberInputType,
) => {
  // 1. Get and validate the  board data
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }
  try {
    const token = await getAuthToken();

    // 2. Pass the data to the API
    const validatedData = CreateMemberInputSchema.parse(createMemberData);
    const response = await fetch(`${API_BASE_URL}/member/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    // 3. Get the server response and send to the client
    const result: { success: boolean; message: string } = await response.json();
    console.log("Board membership details from server action", result);

    if (!result.success) {
      throw new Error(`${result.message}`);
    }

    return { message: result.message };
  } catch (error) {
    console.error("Error creating board member", error);

    if (error instanceof ZodError) {
      throw new Error("Error validating board member data");
    }

    if (error instanceof Error) throw error;

    throw new Error("Error creating board member");
  }
};

// Get Board Members Service
/*
#Plan:
1. Get and validate the board and related data
2. Pass the data to the API
3. Get the server response and send to the client
*/
const GetBoardMembersService = async (
  boardId: string,
  opts?: { signal?: AbortSignal },
) => {
  console.log("GetBoardMembersService called with board ID:", boardId);
  // 1. Get the board id and pass it to the API
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }

  if (!boardId) {
    console.error("No boardId provided to GetBoardMembersService");
    throw new Error("Board ID is required");
  }
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/member/${boardId}`, {
      method: "GET",
      signal: opts?.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // 2. Send response to client
    const result: GetBoardMembersServerResponseType = await response.json();
    console.log(`GetTasks result for ${boardId}`, result);
    if (!result.success) {
      throw new Error(`${result.message}`);
    }

    return result.members;
  } catch (error) {
    console.error("Error getting members", error);

    if (error instanceof Error) throw error;

    throw new Error("Error getting members");
  }
};

// Update Board Member Role Service
/*
#Plan:
1. Get the member id and pass it to the API
2. Send response to client
*/
const UpdateBoardMemberRoleService = async (
  updateMemberData: UpdateBoardMemberInputType,
) => {
  // 1. Get the member id and pass it to the API
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }
  try {
    const token = await getAuthToken();
    console.log("Update member data", updateMemberData);
    const { memberId, ...updateData } =
      UpdateBoardMemberInputSchema.parse(updateMemberData);
    const response = await fetch(`${API_BASE_URL}/member/${memberId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    // 2. Send response to client
    const result: UpdateMemberServerResponseType = await response.json();
    if (!result.success) {
      throw new Error(`${result.message}`);
    }

    return result.member;
  } catch (error) {
    console.error("Error updating board member", error);

    if (error instanceof ZodError)
      throw new Error("Error validating board member data");

    if (error instanceof Error) throw error;

    throw new Error("Error updating board member");
  }
};

// Remove Board Member Service
/*
#Plan:
1. Get the member id and pass it to the API
2. Send response to client
*/
const RemoveBoardMemberService = async (id: string) => {
  // 1. Get the member id and pass it to the API
  if (!API_BASE_URL) {
    throw new Error("Server Url is required");
  }

  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/member/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // 2. Send response to client
    const result: DeleteMemberServerResponseType = await response.json();

    if (!result.success) {
      throw new Error(`${result.message}`);
    }

    return {
      message: `${result.message}`,
    };
  } catch (error) {
    console.error("Error removing board member", error);

    if (error instanceof Error) throw error;

    throw new Error("Error removing member");
  }
};

export {
  CreateBoardMemberService,
  GetBoardMembersService,
  UpdateBoardMemberRoleService,
  RemoveBoardMemberService,
};
