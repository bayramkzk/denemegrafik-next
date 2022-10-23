import { z } from "zod";

export const loginSchema = z.object({
  usernameOrCitizenId: z.string(),
  passwordOrCode: z.string(),
  isAdmin: z.enum(["true", "false"]).transform((value) => value === "true"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
