// src/api/users/getUsersMe.ts
import { api } from "../axiosInstance";

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export async function getUserMe(): Promise<User> {
  const response = await api.get("user/me");
  return response.data;
}