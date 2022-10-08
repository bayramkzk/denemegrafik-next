import { Test, TestResult } from "@prisma/client";

export type TestResultWithTest = TestResult & {
  test: Test;
};

export type TestResultWithAverage = TestResultWithTest & { average: number };
