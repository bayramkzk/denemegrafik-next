import { INVALID_BODY, UNAUTHORIZED } from "@/constants/errors";
import { prisma } from "@/lib/prisma";
import { TestResultWithAverage, TestResultWithTypedTest } from "@/types/test";
import type { NextApiHandler } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const handler: NextApiHandler = async (req, res) => {
  const user = await unstable_getServerSession(req, res, authOptions);
  if (
    !user ||
    (user.user.role === "STUDENT" && String(user.user.id) !== req.query.id)
  ) {
    return res.status(401).json(UNAUTHORIZED);
  }

  const id = Number(req.query.id);
  if (!Number.isInteger(id)) return res.status(400).json(INVALID_BODY);

  const results: TestResultWithTypedTest[] = await prisma.testResult.findMany({
    where: { studentId: id },
    include: { test: { include: { type: true } } },
  });

  const averages = await prisma.$transaction(
    results.map((result) =>
      prisma.testResult.aggregate({
        where: { test: { id: result.test.id } },
        _avg: { score: true },
      })
    )
  );

  const resultsWithAverages: TestResultWithAverage[] = results.map(
    (result, index) => ({
      ...result,
      average: averages[index]._avg.score ?? 0,
    })
  );

  res.status(200).json({
    success: true,
    results: resultsWithAverages,
  });
};

export default handler;
