import { useUserMe } from "@/hooks/users/getUserMe";
import { siteConfigBase } from "@/config/siteConfigBase";
import { useMemo } from "react";

export const useFilteredNavItems = () => {
  const { data: userMe, isLoading } = useUserMe(); 
  const role = userMe?.rol || "invitado";

  const filteredNavItems = useMemo(() => {
    return siteConfigBase.navItems.filter((item) =>
      item.roles.includes(role)
    );
  }, [role]);

  return {
    ...siteConfigBase,
    navItems: isLoading ? [] : filteredNavItems,
    navMenuItems: isLoading ? [] : filteredNavItems, // ← evitar que sea undefined
    loading: isLoading,
  };
};
