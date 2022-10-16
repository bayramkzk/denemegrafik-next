import { DatabaseModelPluralDisplayNames } from "@/constants/models";
import { Routes } from "@/constants/routes";
import { HeaderLinkData } from "@/types/header";
import { Role } from "@prisma/client";

export const getLinkDataBasedOnRole = (role: Role): HeaderLinkData[] => {
  let links: HeaderLinkData[] = [];
  const isAtLeastAdmin = ["ADMIN", "SUPERADMIN"].includes(role);

  if (isAtLeastAdmin) {
    links.push({
      hasMenu: true,
      label: "Veriler",
      href: Routes.database,
      links: Object.entries(DatabaseModelPluralDisplayNames)
        // user needs to be superadmin in order to see organization list
        .filter(([key]) => role === "SUPERADMIN" || key !== "organization")
        .map(([modelName, modelDisplayName]) => ({
          hasMenu: false,
          label: modelDisplayName,
          href: `${Routes.database}?model=${modelName}`,
        })),
    });
  }

  return links;
};
