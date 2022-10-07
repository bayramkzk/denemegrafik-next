import {
  Avatar,
  createStyles,
  Group,
  Menu,
  Text,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconLogout } from "@tabler/icons";
import { signOut } from "next-auth/react";
import React, { useState } from "react";
import SessionGuard from "./SessionGuard";

const MENU_ICON_SIZE = 14;

const useStyles = createStyles((theme) => ({
  user: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    },

    [theme.fn.smallerThan("xs")]: {
      padding: 4,
    },
  },

  userActive: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },

  avatar: {
    [theme.fn.smallerThan("xs")]: {
      // make bigger
      width: 32,
      height: 32,
    },
  },

  name: {
    lineHeight: 1,
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  down: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },
}));

export interface HeaderUserMenuProps {}

const UserMenu: React.FC<HeaderUserMenuProps> = () => {
  const { classes, theme, cx } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <SessionGuard>
      {(session) => (
        <Menu
          width={260}
          position="bottom-end"
          transition="pop-top-right"
          onClose={() => setUserMenuOpened(false)}
          onOpen={() => setUserMenuOpened(true)}
        >
          <Menu.Target>
            <UnstyledButton
              className={cx(classes.user, {
                [classes.userActive]: userMenuOpened,
              })}
            >
              <Group spacing={7}>
                <Avatar
                  alt={session.user.student.name}
                  radius="xl"
                  size={24}
                  className={classes.avatar}
                />
                <Text weight={500} size="sm" className={classes.name} mr={3}>
                  {session.user.student.name}
                </Text>
                <IconChevronDown
                  size={12}
                  stroke={1.5}
                  className={classes.down}
                />
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Ayarlar</Menu.Label>
            <Menu.Item
              icon={<IconLogout size={MENU_ICON_SIZE} />}
              rightSection={
                <Text size="xs" color="dimmed">
                  ⌘+J
                </Text>
              }
              onClick={() => toggleColorScheme()}
            >
              {colorScheme === "light"
                ? "Karanlık tarafa geç"
                : "Aydınlık tarafa geç"}
            </Menu.Item>

            <Menu.Label>Hesap</Menu.Label>
            <Menu.Item
              icon={<IconLogout size={MENU_ICON_SIZE} />}
              onClick={() => signOut()}
              color="red"
            >
              Çıkış yap
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </SessionGuard>
  );
};

export default UserMenu;
