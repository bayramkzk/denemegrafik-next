import {
  Burger,
  createStyles,
  Header as MantineHeader,
  MediaQuery,
} from "@mantine/core";
import Link from "next/link";
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
  burgerState: [boolean, Dispatch<SetStateAction<boolean>>];
  burgerEnabled: boolean;
};

const Header: React.FC<HeaderProps> = ({ burgerState }) => {
  const [burgerOpened, setBurgerOpened] = burgerState;
  const { classes } = useStyles();

  return (
    <MantineHeader height={HEADER_HEIGHT} p="sm" className={classes.header}>
      {burgerOpened && (
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            className={classes.burger}
            opened={burgerOpened}
            onClick={() => setBurgerOpened((o) => !o)}
            size="sm"
            mr="xl"
          />
        </MediaQuery>
      )}

      <Link href="/" passHref>
        <a>
          <AppLogo size={20} />
        </a>
      </Link>

      <UserMenu />
    </MantineHeader>
  );
};

export default Header;
