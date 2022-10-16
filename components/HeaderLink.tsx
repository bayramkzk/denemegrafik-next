import { HeaderLinkData } from "@/types/header";
import { Center, createStyles, Menu } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const useStyles = createStyles((theme) => ({
  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
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

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
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
  closeMenu?: () => void;
  flattenMenu?: boolean;
}

const HeaderLink: React.FC<HeaderLinkProps> = ({
  link,
  flattenMenu,
  closeMenu,
}) => {
  const router = useRouter();
  const { classes, cx } = useStyles();

  if (link.hasMenu) {
    if (flattenMenu) {
      return (
        <>
          {link.links.map((subLink) => (
            <Link href={subLink.href} key={subLink.href}>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  router.push(subLink.href);
                  if (closeMenu) closeMenu();
                }}
                className={cx(
                  classes.link,
                  router.asPath === subLink.href && classes.linkActive
                )}
              >
                {subLink.label}
              </a>
            </Link>
          ))}
        </>
      );
    }

    const menuItems = link.links.map((item) => (
      <Menu.Item key={item.href} onClick={() => router.push(item.href)}>
        {item.label}
      </Menu.Item>
    ));

    return (
      <Menu key={link.label} trigger="hover" exitTransitionDuration={0}>
        <Menu.Target>
          <a
            href={link.href}
            onClick={(e) => {
              e.preventDefault();
              router.push(link.href);
            }}
            className={cx(classes.link, {
              [classes.linkActive]: router.pathname === link.href,
            })}
          >
            <Center>
              <span className={classes.linkLabel}>{link.label}</span>
              <IconChevronDown size={12} stroke={1.5} />
            </Center>
          </a>
        </Menu.Target>
        <Menu.Dropdown>{menuItems}</Menu.Dropdown>
      </Menu>
    );
  }

  return (
    <Link href={link.href}>
      <a
        key={link.label}
        className={classes.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </a>
    </Link>
  );
};

export default HeaderLink;
