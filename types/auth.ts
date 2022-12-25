import { Admin, Class, School, Student } from "@prisma/client";

export type AdminUser = Omit<Admin, "hash"> & {
  school: School;
  canMutate: boolean;
};

export type StudentUser = Student & {
  class: Class & {
    school: School;
  };
  role: "STUDENT";
  canMutate: false;
};

export type SessionUser = AdminUser | StudentUser;

export type UserRole = SessionUser["role"];
