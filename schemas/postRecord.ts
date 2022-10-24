import { z } from "zod";
import { CITIZEN_ID_LENGTH } from "../constants";

export const postTestResultSchema = z.object({
  testId: z.number(),
  studentCode: z.number(),
  score: z.number(),
});

export type PostTestResult = z.infer<typeof postTestResultSchema>;

export const postStudentSchema = z.object({
  name: z.string(),
  citizenId: z.string().length(CITIZEN_ID_LENGTH),
  code: z.number(),
  classGrade: z.number(),
  classBranch: z.string(),
});

export type PostStudent = z.infer<typeof postStudentSchema>;
