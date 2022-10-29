import { RecordModelName } from "@/constants/models";
import { prisma } from "@/lib/prisma";
import { SessionUser } from "@/types/auth";
import { parseFirstName, parseLastName, stringifyClass } from "./user";

export const sumArray = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

export const findRecordsByModel = async (
  model: RecordModelName,
  user: SessionUser
) => {
  if (user.role === "STUDENT") return null;
  const constrain = <T>(obj: T) =>
    user.role === "SUPERADMIN" ? undefined : obj;

  switch (model) {
    case "school": {
      if (user.role !== "SUPERADMIN") return null;
      const schools = await prisma.school.findMany({
        include: { classes: { include: { _count: true } } },
      });
      const schoolsWithCounts = schools.map((school) => ({
        ...school,
        classCount: school.classes.length,
        studentCount: sumArray(
          school.classes.map((cls) => cls._count.students)
        ),
      }));
      return schoolsWithCounts;
    }

    case "class": {
      const classes = await prisma.class.findMany({
        where: constrain({ schoolId: user.schoolId }),
        include: { _count: true, school: true },
      });
      const classesWithCounts = classes.map((cls) => ({
        ...cls,
        studentCount: cls._count.students,
      }));
      return classesWithCounts;
    }

    case "student": {
      const students = await prisma.student.findMany({
        where: constrain({ class: { schoolId: user.schoolId } }),
        include: { class: true },
      });
      const studentsWithParsedNames = students.map((student) => ({
        ...student,
        className: stringifyClass(student.class),
        name: parseFirstName(student.name),
        surname: parseLastName(student.name),
      }));
      return studentsWithParsedNames;
    }

    case "admin": {
      if (user.role !== "SUPERADMIN") return null;
      const users = await prisma.admin.findMany();
      return users;
    }

    case "test": {
      const tests = await prisma.test.findMany({
        where: constrain({ schools: { some: { schoolId: user.schoolId } } }),
      });
      const testsWithSchoolCounts = await prisma.$transaction(
        tests.map((test) =>
          prisma.testResult.findMany({
            where: { testId: test.id },
            select: {
              student: {
                select: {
                  class: {
                    select: { schoolId: true },
                  },
                },
              },
            },
          })
        )
      );
      const testsWithCounts = tests.map((test, i) => ({
        ...test,
        studentCount: testsWithSchoolCounts[i].length,
        schoolCount: new Set(
          testsWithSchoolCounts[i].map(
            (result) => result.student.class.schoolId
          )
        ).size,
      }));
      return testsWithCounts;
    }

    case "testResult": {
      const testResults = await prisma.testResult.findMany({
        where: constrain({ student: { class: { schoolId: user.schoolId } } }),
        include: { test: true, student: true },
      });
      const testResultsWithNames = testResults.map((testResult) => ({
        ...testResult,
        studentName: testResult.student.name,
        testName: testResult.test.name,
        id: `${testResult.testId}-${testResult.studentId}`,
      }));
      return testResultsWithNames;
    }
  }
};

export type ModelRecords = Awaited<ReturnType<typeof findRecordsByModel>>;

export type ModelRecord = NonNullable<ModelRecords>[number];
