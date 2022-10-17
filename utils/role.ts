import { Role } from "@prisma/client";

export type EnforcedRole = Role | undefined;

export const checkEnforcedRole = (role: Role, enforcedRole: Role | undefined) =>
  enforcedRole === undefined ||
  (enforcedRole === Role.ADMIN && role === Role.SUPERADMIN) ||
  enforcedRole === role;

export const roleDisplayNameMap: Record<Role, string> = {
  [Role.SUPERADMIN]: "Süper Yönetici",
  [Role.ADMIN]: "Yönetici",
  [Role.STUDENT]: "Öğrenci",
};
