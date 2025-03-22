import axios from 'axios'
import {GetCajaDiaria} from '@/types/cajaDiaria/GetCajaDiaria'

export const getCajaDiaria = async (): Promise<GetCajaDiaria[]> => {
    const response = await axios.get('http://127.0.0.1:8000/api/cajadiaria/')
    return response.data
}