import { CITIZEN_ID_LENGTH, MINIMUM_PASSWORD_LENGTH } from "@/constants/index";
import { axiosInstance } from "@/lib/axios-instance";
import { RegisterResponse } from "@/types/response";
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

const RegisterPage: NextPage = () => {
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
    const res = await axiosInstance.post<RegisterResponse>(
      "/api/auth/register",
      { ...values, citizenId: String(values.citizenId) }
    );
    if (!res) return;
    setLoading(false);

    if (!res.data.success) {
      showNotification({
        title: "Kayıt başarısız",
        message:
          res.data.error instanceof Array
            ? res.data.error.map((e) => e.message).join("\n")
            : res.data.error.message || "Bilinmeyen bir hata oluştu",
        color: "red",
      });
      return;
    }

    showNotification({
      title: "Kayıt başarılı",
      message: "Giriş sayfasına yönlendiriliyorsunuz...",
      color: "teal",
    });
    router.push("/auth/login");
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack className={classes.root}>
        <Title mb="md" order={1} size={36}>
          Kayıt
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

        <Button size={INPUT_SIZE} type="submit" loading={loading} color="blue">
          {!loading && "Kayıt ol"}
        </Button>

        <Link href="/auth/login" passHref replace>
          <a className={classes.register}>Hesabın var mı? Giriş yap!</a>
        </Link>
      </Stack>
    </form>
  );
};

export default RegisterPage;
