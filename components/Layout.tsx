import { AppShell, Container, createStyles } from "@mantine/core";
import { CONTAINER_SIZE } from "../constants";
import { AppFooter } from "./AppFooter";
import SessionHeader from "./SessionHeader";

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
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { classes } = useStyles();

  return (
    <AppShell
      className={classes.root}
      footer={<AppFooter />}
      header={<SessionHeader />}
    >
      <Container size={CONTAINER_SIZE} py="xl">
        {children}
      </Container>
    </AppShell>
  );
};

export default Layout;
