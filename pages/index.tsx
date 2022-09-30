import { prisma } from "@/lib/prisma";
import { NumberInput } from "@mantine/core";
import { Prisma } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";

type HomeProps = {
  userCount: Prisma.GetUserAggregateType<{ _count: true }>;
};

const Home: NextPage<HomeProps> = ({ userCount }) => {
  return <NumberInput value={userCount._count} />;
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
