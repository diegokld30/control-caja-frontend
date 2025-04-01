// components/Navbar.tsx
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import { NavLink } from "react-router-dom";

import { useFilteredNavItems } from "@/hooks/useFilteredNavItems";
import { ThemeSwitch } from "@/components/theme-switch";
import { SENAIcon } from "@/components/icons";

export const Navbar = () => {
  const { navItems, navMenuItems } = useFilteredNavItems(); // ← usamos el hook aquí

  return (
    <div className="bg-gradient-to-r from-[#f0f0f0] to-[#dcdcdc] bg-opacity-100 text-gray-800 border border-[#c0c0c0] shadow-2xl rounded-xl p-1 transition transform hover:scale-105 hover:shadow-2xl">
      <HeroUINavbar maxWidth="xl" position="sticky" className="rounded-lg bg-opacity-70">
        {/* Marca / Logo */}
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand className="gap-3 max-w-fit">
            <NavLink
              to="/"
              className="flex justify-start items-center gap-1 text-foreground"
            >
              <SENAIcon />
              <p className="font-bold text-inherit">Superete</p>
            </NavLink>
          </NavbarBrand>

          {/* Menú principal en pantallas grandes */}
          <div className="hidden lg:flex gap-4 justify-start ml-2">
            {navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    clsx(
                      linkStyles({ color: "foreground" }),
                      "transition-colors",
                      isActive &&
                        "text-primary font-medium border rounded-xl bg-blue-100 shadow-xl m-1 p-1"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </NavbarItem>
            ))}
          </div>
        </NavbarContent>

        {/* Contenido derecho en pantallas grandes */}
        <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
          <NavbarItem className="hidden sm:flex gap-2">
            <ThemeSwitch />
          </NavbarItem>
        </NavbarContent>

        {/* Botón hamburguesa en pantallas pequeñas */}
        <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
          <ThemeSwitch />
          <NavbarMenuToggle />
        </NavbarContent>

        {/* Menú hamburguesa */}
        <NavbarMenu>
          <div className="mx-4 mt-2 flex flex-col gap-2">
            {navMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item.href}-${index}`}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    clsx(
                      "text-lg transition-colors",
                      index === 2
                        ? "text-primary"
                        : index === navMenuItems.length - 1
                        ? "text-danger"
                        : "text-foreground",
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
    </div>
  );
};
