import { api } from "../axiosInstance";

export async function deleteDetalleCaja(id: number): Promise<any> {
  const response = await api.delete(`/detallecaja/${id}/`);
  return response.data;
}
