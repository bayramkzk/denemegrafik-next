import {
  CITIZEN_ID_LENGTH,
  MINIMUM_CODE_LENGTH,
  MINIMUM_PASSWORD_LENGTH,
  MINIMUM_USERNAME_LENGTH,
} from "@/constants/index";
import {
  Button,
  createStyles,
  NumberInput,
  PasswordInput,
  Stack,
  TextInput,
  Title,
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
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const INPUT_SIZE = "lg";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: "12vh",
    maxWidth: 420,
    paddingInline: 16,
    margin: "auto",
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
            ? "TC Kimlik Numarası veya şifre hatalı"
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
            formatter={(value) => value?.replace(/\D/g, "")}
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
  );
};

export default LoginPage;
