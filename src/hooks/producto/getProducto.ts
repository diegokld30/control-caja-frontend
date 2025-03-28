//src/hooks/producto/getProducto.ts
import { useQuery } from '@tanstack/react-query'
import { getProducto } from '@/api/producto/getProducto'

export function useProducto() {
    return useQuery({
        queryKey: ['productos'],
        queryFn: getProducto
    })
}