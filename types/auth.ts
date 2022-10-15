import { Admin, Class, Role, School, Student, User } from "@prisma/client";
import { ZodIssue } from "zod";

export type AdminUser = Omit<User, "hash"> & {
  role: typeof Role.ADMIN | typeof Role.SUPERADMIN;
  admin: Admin & { school: School };
};

export type StudentUser = Omit<User, "hash"> & {
  role: typeof Role.STUDENT;
  student: Student & { class: Class & { school: School } };
};

export type SessionUser = AdminUser | StudentUser;

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
