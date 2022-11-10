import { Container, createStyles, Group, Text } from "@mantine/core";
import { IconBrandGithub, IconBrandLinkedin, IconMail } from "@tabler/icons";
import Link from "next/link";
import { CONTAINER_SIZE } from "../constants";

const useStyles = createStyles((theme) => ({
  footer: {
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
      textAlign: "center",
    },
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      marginTop: theme.spacing.md,
    },
  },

  school: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.primary[0]
        : theme.colors.primary[7],
  },

  author: {
    fontFamily: '"Abril Fatface", sans-serif',
    background: "linear-gradient(to right, crimson,pink,springgreen)",
    backgroundSize: "200% 200%",
    animation: "rainbow 2s ease-in-out infinite",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    transition: "color .2s ease-in-out",
    marginBottom: "0.25rem",

    "&:hover": {
      color: "rgba(0,0,0,0)",
      cursor: "default",
    },

    "@keyframes rainbow": {
      "0%": { backgroundPosition: "left" },
      "50%": { backgroundPosition: "right" },
      "100%": { backgroundPosition: "left" },
    },
  },
}));

export function AppFooter() {
  const { classes } = useStyles();

  return (
    <div className={classes.footer}>
      <Container className={classes.inner} size={CONTAINER_SIZE}>
        <Text color="dimmed" size="xs">
          <Link href="https://esdfl.meb.k12.tr">
            <a className={classes.school} target="_blank">
              Edirne Süleyman Demirel Fen Lisesi
            </a>
          </Link>{" "}
          öğrencileri tarafından yapılmıştır. Tüm hakları saklıdır.
        </Text>

        <Group spacing="sm" align="center">
          <Text color="dimmed" size="xs" className={classes.author}>
            Bayram Kazık
          </Text>

          <Link href="https://www.linkedin.com/in/bayram-kazik" passHref>
            <a target="_blank" rel="noopener noreferrer">
              <IconBrandLinkedin size={20} color="#0072b1" />
            </a>
          </Link>

          <Link href="mailto:bayramkazik@pm.me" passHref>
            <a target="_blank" rel="noopener noreferrer">
              <IconMail size={20} color="#c71610" />
            </a>
          </Link>

          <Link href="https://github.com/highberg/denemegrafik-next" passHref>
            <a target="_blank">
              <IconBrandGithub size={20} color="#6e5494" />
            </a>
          </Link>
        </Group>
      </Container>
    </div>
  );
}
