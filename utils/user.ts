import { SessionUser } from "@/types/auth";
import { Class } from "@prisma/client";

export const stringifyClass = (cls: Class) => `${cls.grade} / ${cls.branch}`;

export const parseFirstName = (name: string) =>
  name.split(" ").slice(0, -1).join(" ");

export const parseLastName = (name: string) =>
  name.split(" ").slice(-1).join(" ");

export const parseIntoNames = (name: string) => ({
  firstName: parseFirstName(name),
  lastName: parseLastName(name),
});

export const getName = (user: SessionUser) =>
  user.role === "STUDENT" ? user.student.name : user.admin.name;

export const getSchool = (user: SessionUser) =>
  user.role === "STUDENT" ? user.student.class.school : user.admin.school;
