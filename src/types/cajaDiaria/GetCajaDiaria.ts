export type GetCajaDiaria = {
    fecha_apertura: string;
    fecha_cierre: string;
    saldo_inicial: string;
    saldo_final: string;
    abierta_por: { first_name: string; last_name: string };
    cerrada_por: { first_name: string; last_name: string };
    observaciones: string;
}