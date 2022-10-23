import { UserRole } from "@/types/auth";
import { Role } from "@prisma/client";

export type EnforcedRole = Role | undefined;

export const checkEnforcedRole = (role: Role, enforcedRole: Role | undefined) =>
  enforcedRole === undefined ||
  (enforcedRole === Role.ADMIN && role === Role.SUPERADMIN) ||
  enforcedRole === role;

export const roleDisplayNameMap: Record<UserRole, string> = {
  [Role.SUPERADMIN]: "Süper Yönetici",
  [Role.ADMIN]: "Yönetici",
  STUDENT: "Öğrenci",
};
