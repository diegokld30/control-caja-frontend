// src/hooks/caja/useCajaDiaria.ts
import { useQuery } from "@tanstack/react-query";
import { getCajaDiaria } from "@/api/cajaDiaria/getCajaDiaria";
import { GetCajaDiaria } from "@/types/cajaDiaria/GetCajaDiaria";

export function useCajaDiaria() {
  return useQuery<GetCajaDiaria[], Error>({
    queryKey: ["cajaDiaria"],
    queryFn: getCajaDiaria,
    // Opcional: agregar refetchInterval si se desea actualizar automáticamente
    // refetchInterval: 5000,
  });
}
