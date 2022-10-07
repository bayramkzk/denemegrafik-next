import {
  Burger,
  createStyles,
  Header as MantineHeader,
  MediaQuery,
} from "@mantine/core";
import { Dispatch, SetStateAction } from "react";
import { HEADER_HEIGHT } from "../constants";
import AppLogo from "./AppLogo";
import UserMenu from "./UserMenu";

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
}));

export type HeaderProps = {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
};

const Header: React.FC<HeaderProps> = ({ opened, setOpened }) => {
  const { classes } = useStyles();

  return (
    <MantineHeader height={HEADER_HEIGHT} p="sm" className={classes.header}>
      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <Burger
          className={classes.burger}
          opened={opened}
          onClick={() => setOpened((o) => !o)}
          size="sm"
          mr="xl"
        />
      </MediaQuery>

      <AppLogo size={20} />

      <UserMenu />
    </MantineHeader>
  );
};

export default Header;
