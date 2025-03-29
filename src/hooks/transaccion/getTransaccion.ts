// src/hooks/transaccion/useTransacciones.ts
import { useQuery } from "@tanstack/react-query";
import { getTransacciones } from "@/api/transaccion/getTransaccion";
import { GetTransaccion } from "@/types/transaccion/GetTransaccion";

export function useTransacciones() {
  return useQuery<GetTransaccion[]>({
    queryKey: ["transacciones"],
    queryFn: getTransacciones,
  });
}
