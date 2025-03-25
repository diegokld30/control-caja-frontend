// src/api/users/getUsersMe.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../axiosInstance";

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  rol: string;
  email: string;
}

export async function getUserMe(): Promise<User> {
  const response = await api.get("user/me");
  return response.data;
}

// Hook que obtiene la data del usuario logueado
export function useUserMe() {
  return useQuery<User>({
    queryKey: ["userMe"],
    queryFn: getUserMe,
  });
}