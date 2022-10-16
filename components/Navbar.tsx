import { createStyles, Stack } from "@mantine/core";
import { Role } from "@prisma/client";
import React from "react";
import SessionGuard from "./SessionGuard";

const useStyles = createStyles((theme) => ({
  root: {
    height: "100%",
  },
}));

export interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const { classes } = useStyles();

  return (
    <SessionGuard allowedRoles={[Role.ADMIN, Role.SUPERADMIN]}>
      {(session) => (
        <Stack justify="space-between" className={classes.root}>
          <div>Hello {session.user.profile.name}</div>
        </Stack>
      )}
    </SessionGuard>
  );
};

export default Navbar;
