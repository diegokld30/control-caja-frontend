import { api } from "../axiosInstance";
import { GetDetalleCaja } from "@/types/detalleCaja/GetDetalleCaja";

export const getDetalleCaja = async (): Promise<GetDetalleCaja[]> => {
  const response = await api.get("/detallecaja/");
  return response.data;
};
