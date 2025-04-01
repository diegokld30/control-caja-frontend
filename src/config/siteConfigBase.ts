// config/siteConfigBase.ts
export type UserRole = "administrador" | "caja" | "invitado";

export interface NavItem {
  label: string;
  href: string;
  roles: UserRole[];
}

export interface SiteConfig {
  name: string;
  description: string;
  navItems: NavItem[];
}

export const siteConfigBase: SiteConfig = {
  name: "Control de caja",
  description: "Sistema de control de caja diaria",
  navItems: [
    {
      label: "Transacciones",
      href: "/transacciones",
      roles: ["administrador", "caja"],
    },
    {
      label: "Detalles de la caja",
      href: "/detalleCaja",
      roles: ["administrador"],
    },
    {
      label: "Caja Diaria",
      href: "/cajaDiaria",
      roles: ["administrador"],
    },
    {
      label: "Categoria",
      href: "/categoria",
      roles: ["administrador"],
    },
    {
      label: "Productos",
      href: "/producto",
      roles: ["administrador"],
    },
    {
      label: "Usuarios",
      href: "/users",
      roles: ["administrador"],
    },
  ],
};
