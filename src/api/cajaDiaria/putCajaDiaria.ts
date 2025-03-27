// src/api/cajaDiaria/putCajaDiaria

import { api } from "../axiosInstance";

export interface CajaDiariaUpdateData {
  fecha_cierre: string | null;
  saldo_inicial: string | null;
  saldo_final: string | null;
  abierta_por: number;
  cerrada_por: number | null;
  observaciones: string;
}

export async function updateCajaDiaria(
  id: number,
  data: CajaDiariaUpdateData
): Promise<any> {
  const response = await api.put(`cajadiaria/${id}/`, data);
  return response.data;
}
