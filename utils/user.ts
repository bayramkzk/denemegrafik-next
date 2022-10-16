import { Group } from "@prisma/client";

export const stringifyGroup = (group: Group) =>
  `${group.grade} / ${group.branch}`;

export const parseFirstName = (name: string) =>
  name.split(" ").slice(0, -1).join(" ");

export const parseLastName = (name: string) =>
  name.split(" ").slice(-1).join(" ");

export const parseIntoNames = (name: string) => ({
  firstName: parseFirstName(name),
  lastName: parseLastName(name),
});
