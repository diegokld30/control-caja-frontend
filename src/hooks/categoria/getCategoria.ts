import { useQuery } from '@tanstack/react-query'
import { getCategoria } from '@/api/categoria/getCategoria'

export function useCategoria() {
    return useQuery({
        queryKey: ['categoria'],
        queryFn: getCategoria
    })
}