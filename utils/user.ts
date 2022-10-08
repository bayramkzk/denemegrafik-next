import { Class } from "@prisma/client";

export const stringifyClass = (cls: Class) => `${cls.grade} / ${cls.branch}`;

export const getFirstName = (name: string) =>
  name.split(" ").slice(0, -1).join(" ");

export const getLastName = (name: string) =>
  name.split(" ").slice(-1).join(" ");
