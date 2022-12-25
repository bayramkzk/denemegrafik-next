import { createStyles, Stack } from "@mantine/core";
import React from "react";
import SessionGuard from "./SessionGuard";

const useStyles = createStyles({
  root: {
    height: "100%",
  },
});

const Navbar: React.FC = () => {
  const { classes } = useStyles();

  return (
    <SessionGuard allowedRoles={["ADMIN", "SUPERADMIN", "VIEWER"]}>
      {(session) => (
        <Stack justify="space-between" className={classes.root}>
          <div>Hello {session.user.name}</div>
        </Stack>
      )}
    </SessionGuard>
  );
};

export default Navbar;
