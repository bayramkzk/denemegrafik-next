import stringifyClass from "@/utils/stringifyClass";
import { Group, Menu, Text, useMantineColorScheme } from "@mantine/core";
import { IconLogout } from "@tabler/icons";
import { signOut } from "next-auth/react";
import React from "react";
import SessionGuard from "./SessionGuard";
import UserButton from "./UserButton";

const MENU_ICON_SIZE = 14;

export interface SessionButtonProps {}

const SessionButton: React.FC<SessionButtonProps> = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <SessionGuard>
      {(session) => (
        <Group position="center">
          <Menu withArrow width={250}>
            <Menu.Target>
              <UserButton
                name={session.user.student.name}
                className={stringifyClass(session.user.student.class)}
                schoolName={session.user.student.class.school.name}
              />
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
        </Group>
      )}
    </SessionGuard>
  );
};

export default SessionButton;
