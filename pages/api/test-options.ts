import { prisma } from "@/lib/prisma";
import { School, TestType } from "@prisma/client";
import type { NextApiHandler } from "next";

export type TestOptions = {
  types: TestType[];
  schools: School[];
};

const handler: NextApiHandler<TestOptions> = async (_, res) => {
  const testTypes = await prisma.testType.findMany();
  const schools = await prisma.school.findMany();
  res.status(200).json({
    types: testTypes,
    schools,
  });
};

export default handler;
