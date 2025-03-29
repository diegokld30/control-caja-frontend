// src/types/transaccion/GetTransaccion.ts
export type GetTransaccion = {
    id: number;
    tipo: "venta" | "compra" | "devolucion" | "ajuste";
    producto_id: number;            // FK a Producto
    cantidad: number;
    precio_unitario: string;        // DRF devuelve decimal como string
    fecha: string;                  // auto_now_add => YYYY-MM-DD
    usuario_id: number;            // FK a User
    // Si tu serializer retorna producto y usuario anidados, podrías incluir:
    producto?: {
      id: number;
      nombre: string;
      // etc. lo que devuelva el ProductoSerializer
    };
    usuario?: {
      id: number;
      first_name: string;
      last_name: string;
      // etc. lo que devuelva el UserSerializer
    };
  };
  