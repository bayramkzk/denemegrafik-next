import { Class, Student, User } from "@prisma/client";
import { ZodIssue } from "zod";

export type UserResponse = Omit<User, "hash"> & {
  student: Student & {
    class: Class;
  };
};

export type AuthBodyErrorResponse = {
  error: ZodIssue[];
};

export type AuthCustomErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

export type AuthSuccessResponse = {
  user: UserResponse;
  token: string;
};

export type AuthResponse =
  | AuthBodyErrorResponse
  | AuthCustomErrorResponse
  | AuthSuccessResponse;
