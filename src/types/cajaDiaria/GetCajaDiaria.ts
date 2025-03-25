//src/tupes/cajaDiaria/GetCajaDiaria.ts
export type GetCajaDiaria = {
    fecha_apertura: string | null;
    fecha_cierre: string | null;
    saldo_inicial: string | null;
    saldo_final: string | null;
    abierta_por: number | { first_name: string; last_name: string } | null ;
    cerrada_por: { first_name: string; last_name: string } | null;
    observaciones: string ;
    acciones: string | null
}