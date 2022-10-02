import { useAuth } from "@/hooks/use-auth";
import { Button, Container, Group, Loader, Text } from "@mantine/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { user, logout } = useAuth();

  if (!user) {
    if (typeof window !== "undefined") {
      const router = useRouter();
      router.push("/auth/login");
    }
    // center loader
    return (
      <Loader
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    );
  }

  return (
    <Container>
      <Group grow>
        <Text>Merhaba {user.student.name}</Text>
        <Button onClick={logout}>Çıkış yap</Button>
      </Group>
    </Container>
  );
};

export default Home;
