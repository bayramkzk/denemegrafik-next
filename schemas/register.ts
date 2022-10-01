import { z } from "zod";
import { CITIZEN_ID_LENGTH } from "../constants";

export const registerSchema = z.object({
  citizenId: z.string().length(CITIZEN_ID_LENGTH),
  password: z.string().min(6),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
