// src/hooks/users/getUsers.ts
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getUsers, User } from "@/api/users/getUsers";

export function useUsers(): UseQueryResult<User[], Error> {
  return useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: getUsers,
  });
}