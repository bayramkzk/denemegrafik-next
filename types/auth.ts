import { Admin, Class, School, Student, User } from "@prisma/client";

export type SessionUser = Omit<User, "hash"> & {
  student: (Student & { class: Class & { school: School } }) | null;
  admin: (Admin & { school: School }) | null;
};
