import { useQuery } from '@tanstack/react-query'
import { getCajaDiaria } from '@/api/cajaDiaria/getCajaDiaria'

export function useCajaDiaria() {
    return useQuery({
        queryKey: ['cajaDiaria'],
        queryFn: getCajaDiaria
    })
}