// src/hooks/detalleCaja/getDetalleCaja.ts
import { useQuery } from "@tanstack/react-query";
import { getDetalleCaja } from "@/api/detalleCaja/getDetalleCaja";
import { GetDetalleCaja } from "@/types/detalleCaja/GetDetalleCaja";

export function useDetalleCaja() {
  return useQuery<GetDetalleCaja[]>({
    queryKey: ["detalleCaja"],
    queryFn: getDetalleCaja,
    // refetchOnWindowFocus: true, // opcional, para forzar refresco
  });
}
