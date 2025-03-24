// src/api/users/getUsers.ts
import axios from "axios";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  // otros campos si aplica
}

export async function getUsers(): Promise<User[]> {
  const response = await axios.get("http://127.0.0.1:8000/api/users/");
  return response.data;
}