export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Control de caja",
  description: "Sistema de control de caja diaria",
  navItems: [
    {
      label: "Transacciones",
      href: "/transacciones",
    },
    {
      label: "Detalles de la caja",
      href: "/detalleCaja",
    },
   
    {
      label: "Caja Diaria",
      href: "/cajaDiaria",
    },
    {
      label: "Categoria",
      href: "/categoria",
    },
    
    {
      label: "Productos",
      href: "/producto",
    },
    
    {
      label: "Usuarios",
      href: "/users",
    },
  ],
  navMenuItems: [
    
    {
      label: "Transacciones",
      href: "/transacciones",
    },
    {
      label: "Detalles de la caja",
      href: "/detalleCaja",
    },
   
    {
      label: "Caja Diaria",
      href: "/cajaDiaria",
    },
    {
      label: "Categoria",
      href: "/categoria",
    },
    
    {
      label: "Productos",
      href: "/producto",
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
