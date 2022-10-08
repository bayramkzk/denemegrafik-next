import { CITIZEN_ID_LENGTH, MINIMUM_PASSWORD_LENGTH } from "@/constants/index";
import {
  Button,
  createStyles,
  NumberInput,
  PasswordInput,
  Stack,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { NextPage } from "next";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const INPUT_SIZE = "lg";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 128,
    maxWidth: 420,
    paddingInline: 16,
    margin: "auto",
  },
  register: {
    marginTop: 16,
    textAlign: "center",
    "&:hover": {
      color: theme.colors.primary[6],
    },
  },
}));

const Login: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { classes } = useStyles();
  const form = useForm({
    initialValues: {
      citizenId: "",
      password: "",
    },
    validate: {
      citizenId: (value) =>
        String(value).length !== CITIZEN_ID_LENGTH &&
        `TC Kimlik Numarası ${CITIZEN_ID_LENGTH} haneli olmalıdır`,
      password: (value) =>
        String(value).length < MINIMUM_PASSWORD_LENGTH &&
        `Şifre en az ${MINIMUM_PASSWORD_LENGTH} karakter olmalıdır`,
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      ...values,
    });
    if (!res) return;
    setLoading(false);

    if (res.error) {
      showNotification({
        title: "Giriş başarısız",
        message:
          res.error === "CredentialsSignin"
            ? "TC Kimlik Numarası veya şifre hatalı"
            : "Bilinmeyen bir hata oluştu, lütfen bilgilerinizi kontrol edin",
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
      <Stack className={classes.root}>
        <Title mb="md" order={1} size={36}>
          Giriş
        </Title>

        <NumberInput
          hideControls
          label="TC Kimlik Numarası"
          placeholder="12345678901"
          maxLength={CITIZEN_ID_LENGTH}
          formatter={(value) => value?.replace(/\D/g, "")}
          size={INPUT_SIZE}
          {...form.getInputProps("citizenId")}
        />
        <PasswordInput
          label="Parola"
          placeholder="sifre123"
          size={INPUT_SIZE}
          {...form.getInputProps("password")}
        />

        <Button size={INPUT_SIZE} type="submit" loading={loading} color="teal">
          {!loading && "Giriş yap"}
        </Button>

        <Link href="/auth/register" passHref replace>
          <a className={classes.register}>Hesabın yok mu? Kayıt ol!</a>
        </Link>
      </Stack>
    </form>
  );
};

export default Login;
