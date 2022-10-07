import Layout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import SessionGuard from "@/components/SessionGuard";
import { prisma } from "@/lib/prisma";
import { Container, Title } from "@mantine/core";
import { Test, TestResult } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export type HomeProps = {
  results: (TestResult & { test: Test })[];
};

const Home: NextPage<HomeProps> = ({ results }) => {
  return (
    <Layout navbar={<Navbar />}>
      <Container>
        <SessionGuard>
          {(session) => (
            <div>
              <Title mt="xl">Home</Title>
              <p>Hi {session.user.student.name}!</p>
              <p>Here are your results:</p>
              <ul>
                {results.map((result) => (
                  <li key={result.id}>
                    {result.test.name}: {result.score}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </SessionGuard>
      </Container>
    </Layout>
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
