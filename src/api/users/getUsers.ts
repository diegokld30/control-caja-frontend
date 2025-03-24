// src/api/users/getUsers.ts
import { api } from "../axiosInstance";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  // otros campos si aplica
}

export async function getUsers(): Promise<User[]> {
  const response = await api.get("users/");
  return response.data;
}