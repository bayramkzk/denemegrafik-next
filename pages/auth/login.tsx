import {
  Button,
  createStyles,
  NumberInput,
  PasswordInput,
  Stack,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { NextPage } from "next";

const INPUT_SIZE = "lg";
const CITIZEN_ID_LENGTH = 11;

const useStyles = createStyles({
  root: {
    paddingTop: 128,
    maxWidth: 420,
    paddingInline: 16,
    margin: "auto",
  },
});

const Login: NextPage = () => {
  const { classes } = useStyles();
  const form = useForm({
    initialValues: {
      citizenId: "",
      password: "",
    },
    validate: {
      citizenId: (value) =>
        String(value).length !== CITIZEN_ID_LENGTH &&
        "TC Kimlik Numarası 11 haneli olmalıdır",
      password: (value) =>
        String(value).length < 6 && "Şifre en az 6 karakter olmalıdır",
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    console.log(values);
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack className={classes.root}>
        <Title>Giriş</Title>
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
        <Button size={INPUT_SIZE} type="submit">
          Giriş yap
        </Button>
      </Stack>
    </form>
  );
};

export default Login;
