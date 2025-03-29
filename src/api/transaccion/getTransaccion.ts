// src/api/transaccion/getTransaccion.ts
import { api } from "../axiosInstance";
import { GetTransaccion } from "@/types/transaccion/GetTransaccion";

export const getTransacciones = async (): Promise<GetTransaccion[]> => {
  const response = await api.get("/transacciones/");
  return response.data;
};
