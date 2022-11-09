import { getLinkDataBasedOnRole } from "@/utils/link";
import {
  Burger,
  createStyles,
  Group,
  Header as MantineHeader,
  MediaQuery,
  Paper,
  Transition,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { HEADER_HEIGHT } from "../constants";
import AppLogo from "./AppLogo";
import HeaderLink from "./HeaderLink";
import SessionGuard from "./SessionGuard";
import UserMenu from "./UserMenu";

const HAMBURGER_BREAKPOINT = "md";

const useStyles = createStyles((theme) => ({
  burger: {
    color: theme.colors.gray[6],
    borderRadius: theme.radius.sm,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan(HAMBURGER_BREAKPOINT)]: {
      display: "none",
    },
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan(HAMBURGER_BREAKPOINT)]: {
      display: "none",
    },
  },
}));

const SessionHeader: React.FC = () => {
  const { classes } = useStyles();
  const [burgerOpened, burgerHandler] = useDisclosure(false);

  return (
    <SessionGuard>
      {({ user }) => {
        const links = getLinkDataBasedOnRole(user.role);
        const items = links.map((link) => (
          <HeaderLink
            key={link.href}
            link={link}
            closeMenu={burgerHandler.close}
          />
        ));

        return (
          <SessionGuard>
            {({ user }) => (
              <MantineHeader
                height={HEADER_HEIGHT}
                p="sm"
                className={classes.header}
              >
                {user.role !== "STUDENT" && (
                  <MediaQuery
                    largerThan={HAMBURGER_BREAKPOINT}
                    styles={{ display: "none" }}
                  >
                    <Burger
                      className={classes.burger}
                      opened={burgerOpened}
                      onClick={burgerHandler.toggle}
                      size="sm"
                      mr="xl"
                    />
                  </MediaQuery>
                )}

                <Group noWrap>
                  <Link href="/" passHref>
                    <a>
                      <AppLogo size={20} />
                    </a>
                  </Link>

                  <Group spacing="xs" className={classes.links} noWrap>
                    {items}
                  </Group>
                </Group>

                <UserMenu />

                <Transition
                  transition="pop-top-right"
                  duration={200}
                  mounted={burgerOpened}
                >
                  {(styles) => (
                    <Paper
                      className={classes.dropdown}
                      withBorder
                      style={styles}
                    >
                      {items}
                    </Paper>
                  )}
                </Transition>
              </MantineHeader>
            )}
          </SessionGuard>
        );
      }}
    </SessionGuard>
  );
};

export default SessionHeader;
