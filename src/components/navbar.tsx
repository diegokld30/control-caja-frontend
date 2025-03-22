// import { Button } from "@heroui/button";
// import { Kbd } from "@heroui/kbd";
// import { Input } from "@heroui/input";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
// Para estilos de "Link" de HeroUI (opcional)
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";

// Importamos NavLink de React Router
import { NavLink } from "react-router-dom";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
// import { SearchIcon } from "@/components/icons";
import { Logo } from "@/components/icons";

export const Navbar = () => {
  // Input de búsqueda (ejemplo) — sin cambios
  // const searchInput = (
  //   <Input
  //     aria-label="Search"
  //     classNames={{
  //       inputWrapper: "bg-default-100",
  //       input: "text-sm",
  //     }}
  //     endContent={
  //       <Kbd className="hidden lg:inline-block" keys={["command"]}>
  //         K
  //       </Kbd>
  //     }
  //     labelPlacement="outside"
  //     placeholder="Search..."
  //     startContent={
  //       <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
  //     }
  //     type="search"
  //   />
  // );

  return (
    <div className="bg-gradient-to-r from-blue-400 to-gray-900 bg-opacity-70 text-white border  border-indigo-600 shadow-2xl rounded-xl p-1 transition transform hover:scale-105 hover:shadow-2xl">
    <HeroUINavbar maxWidth="xl" position="sticky" className="rounded-lg bg-opacity-70">
      {/* Marca / Logo */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          {/* Usamos NavLink para ir a "/", en lugar de HeroUI <Link href="/"> */}
          <NavLink
            to="/"
            className="flex justify-start items-center gap-1 text-foreground"
          >
            <Logo />
            <p className="font-bold text-inherit">Superete</p>
          </NavLink>
        </NavbarBrand>

        {/* Menú principal en pantallas grandes (lg) */}
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NavLink
                to={item.href}
                // className puede ser un callback que recibe { isActive, ... }
                className={({ isActive }) =>
                  clsx(
                    // Usa estilos base de HeroUI link si quieres
                    linkStyles({ color: "foreground" }),
                    "transition-colors",
                    // Agrega estilos adicionales si está activo
                    isActive && "text-primary font-medium border rounded-xl bg-blue-100 shadow-xl m-1 p-1"
                  )
                }
              >
                {item.label}
              </NavLink>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      {/* Contenido a la derecha en pantallas grandes */}
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>

        <NavbarItem className="hidden md:flex">
          {/* Podrías poner aquí tu searchInput si lo deseas */}
        </NavbarItem>
      </NavbarContent>

      {/* Botón hamburguesa en pantallas pequeñas */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Menú hamburguesa desplegable (pantallas pequeñas) */}
      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.href}-${index}`}>
              <NavLink
                to={item.href}
                // Ejemplo: aplicamos color diferente según el index
                className={({ isActive }) =>
                  clsx(
                    "text-lg transition-colors",
                    index === 2
                      ? "text-primary"
                      : index === siteConfig.navMenuItems.length - 1
                      ? "text-danger"
                      : "text-foreground",
                    // Si está activo, lo resaltamos adicionalmente
                    isActive && "font-medium"
                  )
                }
              >
                {item.label}
              </NavLink>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
      
    </HeroUINavbar>

    {/* <hr /> */}
    </div>
  );
};
