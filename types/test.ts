import { Test, TestResult, TestType } from "@prisma/client";

export type TestResultWithTypedTest = TestResult & {
  test: Test & {
    type: TestType;
  };
};

export type TestResultWithAverage = TestResultWithTypedTest & {
  average: number;
};
