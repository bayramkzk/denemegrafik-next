import { RecordModelName } from "@/constants/models";
import {
  Admin,
  Class,
  School,
  Student,
  Test,
  TestResult,
} from "@prisma/client";

export type SchoolRecord = School & {
  classCount: number;
  studentCount: number;
};

export type ClassRecord = Class & {
  studentCount: number;
  school: School;
};

export type StudentRecord = Student & {
  firstName: string;
  lastName: string;
  className: string;
};

export type AdminRecord = Admin & {
  school: School;
};

export type TestRecord = Test & {
  studentCount: number;
  schoolCount: number;
};

export type TestResultRecord = TestResult & {
  studentName: string;
  testName: string;
  id: string;
};

export type RecordByName<T extends RecordModelName> = T extends "school"
  ? SchoolRecord
  : T extends "class"
  ? ClassRecord
  : T extends "student"
  ? StudentRecord
  : T extends "admin"
  ? AdminRecord
  : T extends "test"
  ? TestRecord
  : T extends "testResult"
  ? TestResultRecord
  : never;

export type RecordsByName<T extends RecordModelName> = RecordByName<T>[];
