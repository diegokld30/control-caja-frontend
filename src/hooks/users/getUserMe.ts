// src/hooks/users/getUsersMe.ts
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getUserMe, User} from "@/api/users/getUserMe";

export function useUserMe(): UseQueryResult<User, Error> {
  return useQuery<User, Error>({
    queryKey: ["userMe"],
    queryFn: getUserMe,
  });
}