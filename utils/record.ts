import { RecordModelName } from "@/constants/models";
import { prisma } from "@/lib/prisma";
import { parseFirstName, parseLastName, stringifyClass } from "./user";

export const sumArray = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

export const findRecordsByModel = async (model: RecordModelName) => {
  switch (model) {
    case "school": {
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
        include: {
          _count: true,
        },
      });
      const classesWithCounts = classes.map((cls) => ({
        ...cls,
        studentCount: cls._count.students,
      }));
      return classesWithCounts;
    }

    case "student": {
      const students = await prisma.student.findMany({
        include: {
          class: true,
        },
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
      const users = await prisma.admin.findMany();
      return users;
    }

    case "test": {
      const tests = await prisma.test.findMany({
        include: {
          _count: true,
        },
      });
      const testsWithCounts = tests.map((test) => ({
        ...test,
        studentCount: test._count.results,
        schoolCount: test._count.schools,
      }));
      return testsWithCounts;
    }

    case "testResult": {
      const testResults = await prisma.testResult.findMany({
        include: {
          test: true,
          student: true,
        },
      });
      const testResultsWithNames = testResults.map((testResult) => ({
        ...testResult,
        studentName: testResult.student.name,
        testName: testResult.test.name,
      }));
      return testResultsWithNames;
    }
  }
};

export type ModelRecords = Awaited<ReturnType<typeof findRecordsByModel>>;

export type ModelRecord = ModelRecords[number];
