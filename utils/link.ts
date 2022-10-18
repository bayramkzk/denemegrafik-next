import { RecordModelPluralDisplayNames } from "@/constants/models";
import { Routes } from "@/constants/routes";
import { HeaderLinkData } from "@/types/header";
import { Role } from "@prisma/client";

export const getLinkDataBasedOnRole = (role: Role): HeaderLinkData[] => {
  let links: HeaderLinkData[] = [];
  const isAtLeastAdmin = ["ADMIN", "SUPERADMIN"].includes(role);

  if (isAtLeastAdmin) {
    Object.entries(RecordModelPluralDisplayNames)
      // user needs to be superadmin in order to see organization list
      .filter(([key]) => role === "SUPERADMIN" || key !== "organization")
      .map(([modelName, modelDisplayName]) => ({
        hasMenu: false,
        label: modelDisplayName,
        href: `${Routes.records}/${modelName}`,
      }))
      .map((link) => link as HeaderLinkData)
      .forEach((link) => links.push(link));
  }

  return links;
};
