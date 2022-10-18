import { Group, Organization, Profile, User } from "@prisma/client";

export type SessionUser = Omit<User, "hash"> & {
  profile: Profile & {
    group: Group & {
      organization: Organization;
    };
  };
};
