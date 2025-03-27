// src/api/cajaDiaria/deleteCajaDiaria

import { api } from "../axiosInstance";

export type CajaDiariaDeleteData = {
  fecha_cierre: string | null;
  saldo_inicial: string | null;
  saldo_final: string | null;
  abierta_por: number;
  cerrada_por: number | null;
  observaciones: string;
};

export async function deleteCajaDiaria(
  id: number,
  data: CajaDiariaDeleteData
): Promise<any> {
  const response = await api.delete(`cajadiaria/${id}/`, { data });
  return response.data;
}
