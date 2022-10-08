import { Container, createStyles, Text } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: 120,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      marginTop: theme.spacing.md,
    },
  },
}));

export function AppFooter() {
  const { classes } = useStyles();

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Text color="dimmed" size="xs">
          Süleyman Demirel Fen Lisesi öğrencileri tarafından yapılmıştır. Tüm
          hakları saklıdır.
        </Text>

        <Link
          href="https://github.com/highberg/denemegrafik-next"
          passHref
          target="_blank"
        >
          <a>
            <IconBrandGithub size={18} stroke={1.5} />
          </a>
        </Link>
      </Container>
    </div>
  );
}
