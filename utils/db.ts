import { DatabaseModel, DatabaseModels } from "@/constants/models";
import { prisma } from "@/lib/prisma";
import { parseFirstName, parseLastName, stringifyGroup } from "./user";

export const sumArray = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

export const findManyByModel = async (model: DatabaseModel) => {
  switch (model) {
    case DatabaseModels.organization:
      const organizations = await prisma.organization.findMany({
        include: {
          groups: {
            include: {
              _count: true,
            },
          },
        },
      });
      return organizations.map((organization) => ({
        ...organization,
        classCount: organization.groups.length,
        studentCount: sumArray(
          organization.groups.map((group) => group._count.profiles)
        ),
      }));
    case DatabaseModels.group:
      const group = await prisma.group.findMany({
        include: {
          _count: true,
        },
      });
      return group.map((group) => ({
        ...group,
        studentCount: group._count.profiles,
      }));
    case DatabaseModels.profile:
      const profiles = await prisma.profile.findMany({
        include: {
          group: true,
        },
      });
      return profiles.map((profile) => ({
        ...profile,
        className: stringifyGroup(profile.group),
        name: parseFirstName(profile.name),
        surname: parseLastName(profile.name),
      }));
    case DatabaseModels.user:
      const users = await prisma.user.findMany();
      return users;
    case DatabaseModels.test:
      const tests = await prisma.test.findMany({
        include: {
          _count: true,
        },
      });
      return tests.map((test) => ({
        ...test,
        studentCount: test._count.results,
        schoolCount: test._count.organizations,
      }));
    case DatabaseModels.testResult:
      const testResults = await prisma.testResult.findMany({
        include: {
          test: true,
          profile: true,
        },
      });
      return testResults.map((testResult) => ({
        ...testResult,
        profileName: testResult.profile.name,
        testName: testResult.test.name,
      }));
  }
  throw new Error("Invalid model");
};

export type FindManyByModelResult = Awaited<ReturnType<typeof findManyByModel>>;
