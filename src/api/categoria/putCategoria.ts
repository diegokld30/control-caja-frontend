// src/api/categoria/putCategoria

import { api } from "../axiosInstance";

export interface CategoriaPutData {
  nombre: string;
}

export async function updateCategoria(
  id: number,
  data: CategoriaPutData
): Promise<any> {
  const response = await api.put(`categoria/${id}/`, data);
  return response.data;
}
