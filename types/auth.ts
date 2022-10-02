import { Class, Student, User } from "@prisma/client";
import { ZodIssue } from "zod";

export type UserResponse = Omit<User, "hash"> & {
  student: Student & {
    class: Class;
  };
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

export type AuthSuccessResponse = {
  user: UserResponse;
  token: string;
  success: true;
};

export type AuthResponse =
  | AuthValidationErrorResponse
  | AuthCustomErrorResponse
  | AuthSuccessResponse;
