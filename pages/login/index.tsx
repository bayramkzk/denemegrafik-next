import { AppFooter } from "@/components/AppFooter";
import LandingHeader from "@/components/LandingHeader";
import {
  CITIZEN_ID_LENGTH,
  MINIMUM_CODE_LENGTH,
  MINIMUM_PASSWORD_LENGTH,
  MINIMUM_USERNAME_LENGTH,
} from "@/constants/index";
import {
  Button,
  Card,
  createStyles,
  Group,
  NumberInput,
  PasswordInput,
  Stack,
  TextInput,
  Title,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import {
  IconIdBadge2,
  IconListNumbers,
  IconLock,
  IconUser,
} from "@tabler/icons";
import { NextPage } from "next";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const INPUT_SIZE = "lg";
const LOGO_SIZE = 340;
const LOGO_BREAKPOINT = "md";
const LOGO_SRC = "/esdfl-logo.png";
const DARK_LOGO_SRC = "/esdfl-logo-dark.webp";

const useStyles = createStyles((theme) => ({
  wrapper: {
    width: "100%",
    height: "100%",
    padding: theme.spacing.xl,

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "4rem",

    [theme.fn.smallerThan(LOGO_BREAKPOINT)]: {
      padding: theme.spacing.md,
    },
  },
  root: {
    maxWidth: 420,
  },
  logo: {
    display: "none",
    [theme.fn.largerThan(LOGO_BREAKPOINT)]: {
      display: "block",
    },
    borderRadius: "50%",
  },
  link: {
    marginTop: 16,
    textAlign: "center",
    "&:hover": {
      color: theme.colors.primary[6],
    },
  },
}));

const LoginPage: NextPage = () => {
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();

  const isAdmin = router.query.admin !== undefined;
  const otherLoginHref = isAdmin ? "/login" : "/login?admin";

  const [loading, setLoading] = useState(false);
  const { classes } = useStyles();

  const form = useForm({
    initialValues: {
      usernameOrCitizenId: "",
      passwordOrCode: "",
    },
    validate: isAdmin
      ? {
          usernameOrCitizenId: (value) =>
            value.length < MINIMUM_USERNAME_LENGTH
              ? `Kullanıcı adı en az ${MINIMUM_USERNAME_LENGTH} karakter olmalıdır`
              : value.includes(" ")
              ? "Kullanıcı adı boşluk içermemelidir"
              : undefined,
          passwordOrCode: (value) =>
            value.length < MINIMUM_PASSWORD_LENGTH
              ? `Şifre en az ${MINIMUM_PASSWORD_LENGTH} karakter olmalıdır`
              : undefined,
        }
      : {
          usernameOrCitizenId: (value) =>
            String(value).length !== CITIZEN_ID_LENGTH &&
            `TC Kimlik Numarası ${CITIZEN_ID_LENGTH} haneli olmalıdır`,
          passwordOrCode: (value) =>
            String(value ?? "").length < MINIMUM_CODE_LENGTH &&
            `Okul numarası en az ${MINIMUM_CODE_LENGTH} haneli olmalıdır`,
        },
  });

  const onLinkClick = () => {
    form.reset();
    setLoading(false);
  };

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      isAdmin,
      usernameOrCitizenId: String(values.usernameOrCitizenId),
      passwordOrCode: String(values.passwordOrCode),
    });
    if (!res) return;
    setLoading(false);

    if (res.error) {
      showNotification({
        title: "Giriş başarısız",
        message:
          res.error === "CredentialsSignin"
            ? "Giriş bilgileri hatalı, lütfen kontrol edip tekrar deneyin!"
            : JSON.stringify(res.error).replaceAll("\\n", "\n"),
        color: "red",
      });
    }

    if (res.ok) {
      showNotification({
        title: "Giriş başarılı",
        message: "Ana sayfaya yönlendiriliyorsunuz...",
        color: "teal",
      });
      const callbackUrl = router.query.callbackUrl as string;
      router.push(callbackUrl || "/");
    }
  });

  return (
    <>
      <LandingHeader />

      <Group className={classes.wrapper}>
        <form onSubmit={handleSubmit}>
          <Stack spacing="lg" className={classes.root}>
            <Title mb="md" order={1} size={36}>
              {isAdmin ? "Yönetici" : "Öğrenci"} Girişi
            </Title>

            {isAdmin ? (
              <TextInput
                label="Kullanıcı Adı"
                placeholder="kullanici_adi"
                size={INPUT_SIZE}
                icon={<IconUser />}
                {...form.getInputProps("usernameOrCitizenId")}
              />
            ) : (
              <NumberInput
                hideControls
                label="TC Kimlik Numarası"
                placeholder="12345678901"
                maxLength={CITIZEN_ID_LENGTH}
                formatter={(value) => value?.replace(/\D/g, "") || ""}
                size={INPUT_SIZE}
                icon={<IconIdBadge2 />}
                {...form.getInputProps("usernameOrCitizenId")}
              />
            )}

            {isAdmin ? (
              <PasswordInput
                label="Parola"
                placeholder="parola123"
                size={INPUT_SIZE}
                icon={<IconLock />}
                {...form.getInputProps("passwordOrCode")}
              />
            ) : (
              <NumberInput
                hideControls
                label="Okul Numarası"
                placeholder="123"
                size={INPUT_SIZE}
                icon={<IconListNumbers />}
                {...form.getInputProps("passwordOrCode")}
              />
            )}

            <Button
              size={INPUT_SIZE}
              type="submit"
              loading={loading}
              color={isAdmin ? "blue" : "teal"}
              rightIcon={
                loading ? undefined : isAdmin ? <IconLock /> : <IconUser />
              }
            >
              {!loading && "Giriş yap"}
            </Button>

            <Link href={otherLoginHref} passHref replace>
              <a className={classes.link} onClick={onLinkClick}>
                {isAdmin ? "Öğrenci" : "Yönetici"} olarak giriş yapmak için
                tıklayın!
              </a>
            </Link>
          </Stack>
        </form>

        <Tooltip label="Edirne Suleyman Demirel Fen Lisesi Deneme Sınavları Grafikleri Projesi">
          <Card className={classes.logo}>
            <Image
              src={colorScheme == "dark" ? DARK_LOGO_SRC : LOGO_SRC}
              alt="Edirne Suleyman Demirel Fen Lisesi Logosu"
              width={LOGO_SIZE}
              height={LOGO_SIZE}
            />
          </Card>
        </Tooltip>
      </Group>

      <AppFooter />
    </>
  );
};

export default LoginPage;
