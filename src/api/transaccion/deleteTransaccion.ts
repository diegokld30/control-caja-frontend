// src/api/transaccion/deleteTransaccion.ts
import { api } from "../axiosInstance";

export async function deleteTransaccion(id: number) {
  // DRF con ModelViewSet => DELETE /transacciones/:id/
  const response = await api.delete(`/transacciones/${id}/`);
  return response.data;
}
