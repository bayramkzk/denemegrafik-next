import { Alert, Text, Title } from "@mantine/core";
import { IconMoodSad } from "@tabler/icons";
import { NextPage } from "next";

const NotFound: NextPage = () => {
  return (
    <Alert color="red" icon={<IconMoodSad />}>
      <Title order={2} size={20} weight="bold">
        404 Hata: Sayfa Bulunamadı
      </Title>

      <Text color="dimmed">
        Aradığınız sayfa bulunamadı. Lütfen adresi kontrol edin.
      </Text>
    </Alert>
  );
};

export default NotFound;
