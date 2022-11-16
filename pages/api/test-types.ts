import { prisma } from "@/lib/prisma";
import type { NextApiHandler } from "next";

const handler: NextApiHandler = async (_, res) => {
  const testTypes = await prisma.testType.findMany();
  res.status(200).json(testTypes);
};

export default handler;
