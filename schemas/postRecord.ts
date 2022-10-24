import { z } from "zod";
import { CITIZEN_ID_LENGTH } from "../constants";

export const testResultSchema = z.object({
  testId: z.number(),
  studentCode: z.number(),
  score: z.number(),
});

export const studentSchema = z.object({
  name: z.string(),
  citizenId: z.string().length(CITIZEN_ID_LENGTH),
  code: z.number(),
  classGrade: z.number(),
  classBranch: z.string(),
});
