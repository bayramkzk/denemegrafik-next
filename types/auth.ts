import { Admin, Class, School, Student, User } from "@prisma/client";
import { ZodIssue } from "zod";

export type SessionUser = Omit<User, "hash"> & {
  student: (Student & { class: Class & { school: School } }) | null;
  admin: (Admin & { school: School }) | null;
};

export type AdminUser = Omit<User, "hash"> & {
  admin: Admin & { school: School };
};

export type StudentUser = Omit<User, "hash"> & {
  student: Student & { class: Class & { school: School } };
};

export type AuthValidationErrorResponse = {
  error: ZodIssue[];
  success: false;
};

export type AuthCustomErrorResponse = {
  error: {
    code: string;
    message: string;
  };
  success: false;
};

export type AuthErrorResponse =
  | AuthValidationErrorResponse
  | AuthCustomErrorResponse;

export type LoginSuccessResponse = {
  user: SessionUser;
  token: string;
  success: true;
};

export type LoginResponse = AuthErrorResponse | LoginSuccessResponse;

export type RegisterSuccessResponse = {
  user: SessionUser;
  success: true;
};

export type RegisterResponse = AuthErrorResponse | RegisterSuccessResponse;
