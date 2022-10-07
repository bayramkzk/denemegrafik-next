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
    <SessionGuard>
      {(session) => (
        <Stack justify="space-between" className={classes.root}>
          <div>{session.user.student.name}</div>
        </Stack>
      )}
    </SessionGuard>
  );
};

export default Navbar;
