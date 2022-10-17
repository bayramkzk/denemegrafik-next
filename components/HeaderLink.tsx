import { HeaderLinkData } from "@/types/header";
import { createStyles } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const useStyles = createStyles((theme) => ({
  link: {
    display: "block",
    lineHeight: 1,
    padding: "12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkLabel: {
    marginRight: 5,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

export interface HeaderLinkProps {
  link: HeaderLinkData;
  closeMenu: () => void;
}

const HeaderLink: React.FC<HeaderLinkProps> = ({ link, closeMenu }) => {
  const router = useRouter();
  const { classes, cx } = useStyles();

  return (
    <Link href={link.href} key={link.href}>
      <a
        onClick={() => closeMenu()}
        className={cx(
          classes.link,
          router.asPath === link.href && classes.linkActive
        )}
      >
        {link.label}
      </a>
    </Link>
  );
};

export default HeaderLink;
