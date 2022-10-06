import {
  AppShell,
  Aside,
  Burger,
  createStyles,
  Footer,
  Group,
  Header,
  MediaQuery,
  Navbar,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { HEADER_HEIGHT } from "../constants";

const useStyles = createStyles((theme) => ({
  root: {
    main: {
      background:
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
    },
  },

  burger: {
    color: theme.colors.gray[6],
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
      header={
        <Header height={HEADER_HEIGHT} p="md">
          <Group>
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                className={classes.burger}
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                mr="xl"
              />
            </MediaQuery>

            <Text size="xl" weight={500}>
              Header
            </Text>
          </Group>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
};

export default Layout;
