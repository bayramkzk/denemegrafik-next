import { HeaderLinkData } from "@/types/header";
import { createStyles } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

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
  const isActive = useMemo(() => {
    const path = router.asPath;
    const index = path.indexOf("?");
    const slicedPath = path.slice(0, index !== -1 ? index : undefined);
    return slicedPath === link.href;
  }, [router.asPath, link.href]);

  return (
    <Link href={link.href} key={link.href}>
      <a
        onClick={() => closeMenu()}
        className={cx(classes.link, isActive && classes.linkActive)}
      >
        {link.label}
      </a>
    </Link>
  );
};

export default HeaderLink;
