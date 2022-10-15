import { Role } from "@prisma/client";

export type EnforcedRole = Role | undefined;

export const checkEnforcedRole = (role: Role, enforcedRole: Role | undefined) =>
  enforcedRole === undefined ||
  (enforcedRole === Role.ADMIN && role === Role.SUPERADMIN) ||
  enforcedRole === role;
