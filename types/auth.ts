import { Class, Student, User } from "@prisma/client";

export type SessionUser = Omit<User, "hash"> & {
  student: Student & {
    class: Class;
  };
};
