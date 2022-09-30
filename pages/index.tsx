import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";

type HomeProps = {
  userCount: Prisma.GetUserAggregateType<{ _count: true }>;
};

const Home: NextPage<HomeProps> = ({ userCount }) => {
  return <pre>{JSON.stringify(userCount, null, 2)}</pre>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const userCount = await prisma.user.aggregate({
    _count: true,
  });

  return {
    props: { userCount },
  };
};

export default Home;
