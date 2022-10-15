import { getName } from "@/utils/user";
import { createStyles, Stack } from "@mantine/core";
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
    <SessionGuard enforcedRole="ADMIN">
      {(session) => (
        <Stack justify="space-between" className={classes.root}>
          <div>Hello {getName(session.user)}</div>
        </Stack>
      )}
    </SessionGuard>
  );
};

export default Navbar;
