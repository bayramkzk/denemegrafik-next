import {
  AppShell,
  Aside,
  createStyles,
  Footer,
  MediaQuery,
  Navbar,
} from "@mantine/core";
import { useState } from "react";
import Header from "./Header";

const useStyles = createStyles((theme) => ({
  root: {
    main: {
      background:
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
    },
  },
}));

export type LayoutProps = {
  children: React.ReactNode;
  navbar?: React.ReactNode;
  aside?: React.ReactNode;
  footer?: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children, aside, footer, navbar }) => {
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      className={classes.root}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        navbar ? (
          <Navbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={!opened}
            width={{ sm: 350 }}
          >
            {navbar}
          </Navbar>
        ) : undefined
      }
      aside={
        aside ? (
          <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
            <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
              {aside}
            </Aside>
          </MediaQuery>
        ) : undefined
      }
      footer={
        footer ? (
          <Footer height={60} p="md">
            {footer}
          </Footer>
        ) : undefined
      }
      header={<Header opened={opened} setOpened={setOpened} />}
    >
      {children}
    </AppShell>
  );
};

export default Layout;
