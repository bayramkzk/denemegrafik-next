import Layout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import { Button, Container, Group, Loader, Text } from "@mantine/core";
import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  if (status !== "authenticated") {
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
    <Layout navbar={<Navbar />}>
      <Container>
        <Group grow>
          <Text>Merhaba {session.user.student.name}</Text>
          <Button onClick={() => signOut()}>Çıkış yap</Button>
        </Group>
      </Container>
    </Layout>
  );
};

export default Home;
