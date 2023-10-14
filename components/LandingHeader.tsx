import { CONTAINER_SIZE, HEADER_HEIGHT } from "@/constants/index";
import { Header, createStyles } from "@mantine/core";
import Link from "next/link";
import React from "react";
import AppLogo from "./AppLogo";
import HeaderLink from "./HeaderLink";

const useStyles = createStyles({
  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: CONTAINER_SIZE,
  },
});

const LandingHeader: React.FC = () => {
  const { classes } = useStyles();

  return (
    <Header height={HEADER_HEIGHT} p="sm" className={classes.header}>
      <div className={classes.container}>
        <Link href="/" passHref>
          <a>
            <AppLogo size={20} />
          </a>
        </Link>

        <HeaderLink
          closeMenu={() => null}
          link={{
            hasMenu: false,
            href: "/login",
            label: "Giriş Yap",
          }}
        />
      </div>
    </Header>
  );
};

export default LandingHeader;
