import {GetCajaDiaria} from '@/types/cajaDiaria/GetCajaDiaria'
import { api } from '../axiosInstance'

export const getCajaDiaria = async (): Promise<GetCajaDiaria[]> => {
    const response = await api.get('/cajadiaria/')
    return response.data
}