import {
  RecordModelName,
  RecordModelPluralDisplayNames,
} from "@/constants/models";
import { Routes } from "@/constants/routes";
import { UserRole } from "@/types/auth";
import { HeaderLinkData } from "@/types/header";

export const getLinkDataBasedOnRole = (role: UserRole): HeaderLinkData[] => {
  const links: HeaderLinkData[] = [];
  const isAtLeastAdmin = ["ADMIN", "SUPERADMIN"].includes(role);
  const superadminLinks: RecordModelName[] = ["school", "admin"];

  if (isAtLeastAdmin) {
    Object.entries(RecordModelPluralDisplayNames)
      // user needs to be superadmin in order to see organization list
      .filter(
        ([key]) =>
          role === "SUPERADMIN" ||
          !superadminLinks.includes(key as RecordModelName)
      )
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
