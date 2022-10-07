import { createStyles, Group, Title } from "@mantine/core";
import { IconChartLine } from "@tabler/icons";
import React from "react";
import { APP_NAME } from "../constants";

const useStyles = createStyles((theme) => ({
  root: {
    background: theme.fn.linearGradient(
      45,
      theme.colors.primary[5],
      theme.colors.primary[6]
    ),
    padding: "8px 12px",
    borderRadius: "4px",
    userSelect: "none",
  },
  logo: {
    color: "#eee",
  },
  title: {
    color: "#eee",
    fontFamily: "Fira Sans, sans-serif",
    fontWeight: 700,
  },
}));

interface BrandLogoProps {
  size: number;
  withCaption?: boolean;
}

const AppLogo: React.FC<BrandLogoProps> = ({ size, withCaption = true }) => {
  const { classes } = useStyles();
  const logoSize = size * 1.25;

  return (
    <Group className={classes.root}>
      <IconChartLine className={classes.logo} size={logoSize} />

      {withCaption && (
        <Title order={1} sx={{ fontSize: size }} className={classes.title}>
          {APP_NAME}
        </Title>
      )}
    </Group>
  );
};

export default AppLogo;
