//src/types/producto/GetProducto.tsx
export type GetProductos = {
    id?: number;
    nombre: string;           // no nulo si en tu DB es not null
    categoria_id: number;     // foránea
    precio_compra: string;    // decimales en string
    precio_venta: string;     // decimales en string
    stock: number;            // entero
    acciones?: string | null; 
  };
  