export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Control de caja",
  description: "Sistema de control de caja diaria",
  navItems: [
   
    {
      label: "Caja Diaria",
      href: "/cajaDiaria",
    },
    {
      label: "Categoria",
      href: "/categoria",
    },
    {
      label: "Detalles de la caja",
      href: "/detalleCaja",
    },
    {
      label: "Productos",
      href: "/producto",
    },
    {
      label: "Transacciones",
      href: "/transacciones",
    },
    {
      label: "Usuarios",
      href: "/users",
    },
    
  ],
  navMenuItems: [
    
    {
      label: "Caja Diaria",
      href: "/cajaDiaria",
    },
    {
      label: "Categoria",
      href: "/categoria",
    },
    {
      label: "Detalles de la caja",
      href: "/detalleCaja",
    },
    {
      label: "Productos",
      href: "/producto",
    },
    {
      label: "Transacciones",
      href: "/transacciones",
    },
    {
      label: "Usuarios",
      href: "/users",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/diegokld30",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
