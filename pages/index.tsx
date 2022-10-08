import Layout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import ProfileTable from "@/components/ProfileTable";
import SessionGuard from "@/components/SessionGuard";
import { prisma } from "@/lib/prisma";
import { TestResultWithTest } from "@/types/tests";
import { Alert, Container, Stack, Text, Title } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons";
import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { authOptions } from "./api/auth/[...nextauth]";

const ResultChart = dynamic(() => import("@/components/ResultChart"), {
  ssr: false,
});

export type HomeProps = {
  results: TestResultWithTest[];
};

const Home: NextPage<HomeProps> = ({ results }) => {
  const { ref, width } = useElementSize();

  return (
    <SessionGuard>
      {(session) => (
        <Layout navbar={!session.user.student && <Navbar />}>
          <Container ref={ref}>
            <Stack py="lg" spacing={32}>
              <Title>Deneme Grafik</Title>

              <Alert variant="filled" icon={<IconInfoCircle />}>
                Merhaba {session.user.student.name}, bu websitesindeki veriler
                sadece senin için saklanmaktadır.
              </Alert>

              <ProfileTable />

              <Text>
                Aşağıdaki grafiği inceleyerek deneme sonuçlarının zaman içinde
                nasıl değiştiğini görebilirsin ve kendi sonuçlarını ortalama ile
                karşılaştırabilirsin.
              </Text>

              <ResultChart results={results} width={width} />
            </Stack>
          </Container>
        </Layout>
      )}
    </SessionGuard>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  const results = await prisma.testResult.findMany({
    where: { student: { id: session.user.student.id } },
    include: { test: true },
  });

  return { props: { results: JSON.parse(JSON.stringify(results)) } };
};
