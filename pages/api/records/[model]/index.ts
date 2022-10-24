import {
  DUPLICATE_CITIZEN_ID,
  DUPLICATE_TEST_RESULT,
  INTERNAL_SERVER_ERROR,
  INVALID_BODY,
  INVALID_MODEL_NAME,
  METHOD_NOT_ALLOWED,
  NO_CLASS_FOUND,
  NO_STUDENT_FOUND,
  UNAUTHORIZED,
} from "@/constants/errors";
import { RecordModelName } from "@/constants/models";
import { prisma } from "@/lib/prisma";
import {
  deleteRecordsSchema,
  postStudentSchema,
  postTestResultSchema,
} from "@/schemas/record";
import { FetchRecordsResponse } from "@/types/response";
import { validateModelQuery } from "@/utils/model";
import { findRecordsByModel } from "@/utils/record";
import { Prisma } from "@prisma/client";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

type ModelRequestContext = {
  req: NextApiRequest;
  res: NextApiResponse;
  model: RecordModelName;
  session: Session;
};

const getRecords = async ({ res, model, session }: ModelRequestContext) => {
  const records = await findRecordsByModel(model, session.user);
  if (records === null) {
    return res.status(401).json(UNAUTHORIZED);
  }
  return res.status(200).json({ records, success: true });
};

const postTestResult = async ({ req, res, session }: ModelRequestContext) => {
  if (session.user.role === "STUDENT") {
    return res.status(401).json(UNAUTHORIZED);
  }

  const body = postTestResultSchema.safeParse(req.body);
  if (!body.success)
    return res
      .status(400)
      .json({ success: false, error: { ...body.error, code: "zod_error" } });

  const student = await prisma.student.findFirst({
    where: {
      class: { schoolId: session.user.schoolId },
      code: body.data.studentCode,
    },
  });
  if (!student) return res.status(404).json(NO_STUDENT_FOUND);

  try {
    const testResult = await prisma.testResult.create({
      data: {
        testId: body.data.testId,
        studentId: student.id,
        score: body.data.score,
      },
    });

    return res.status(200).json({ success: true, record: testResult });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return res.status(409).json(DUPLICATE_TEST_RESULT);
      }
    }
    res.status(500).json(INTERNAL_SERVER_ERROR);
  }
};

const postStudent = async (context: ModelRequestContext) => {
  if (context.session.user.role === "STUDENT") {
    return context.res.status(401).json(UNAUTHORIZED);
  }

  const body = postStudentSchema.safeParse(context.req.body);
  if (!body.success)
    return context.res
      .status(400)
      .json({ success: false, error: { ...body.error, code: "zod_error" } });

  const cls = await prisma.class.findFirst({
    where: {
      schoolId: context.session.user.schoolId,
      grade: body.data.classGrade,
      branch: body.data.classBranch,
    },
  });
  if (!cls) return context.res.status(404).json(NO_CLASS_FOUND);

  try {
    const student = await prisma.student.create({
      data: {
        name: body.data.name,
        citizenId: body.data.citizenId,
        code: body.data.code,
        classId: cls.id,
      },
    });
    return context.res.status(200).json({ success: true, record: student });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return context.res.status(409).json(DUPLICATE_CITIZEN_ID);
      }
    }
    context.res.status(500).json(INTERNAL_SERVER_ERROR);
  }
};

const postRecord = async (context: ModelRequestContext) => {
  switch (context.model) {
    case "testResult": {
      return await postTestResult(context);
    }
    case "student": {
      return await postStudent(context);
    }
    default: {
      return context.res.status(404).json(INVALID_MODEL_NAME);
    }
  }
};

const deleteRecord = async (context: ModelRequestContext) => {
  if (context.session.user.role === "STUDENT") {
    return context.res.status(401).json(UNAUTHORIZED);
  }

  const body = deleteRecordsSchema.safeParse(context.req.body);
  if (!body.success) {
    return context.res
      .status(400)
      .json({ success: false, error: { ...body.error, code: "zod_error" } });
  }

  if (
    body.data.ids.some((id) => typeof id !== "number") &&
    context.model !== "testResult"
  ) {
    return context.res.status(400).json(INVALID_BODY);
  }

  if (
    body.data.ids.some((id) => typeof id !== "string") &&
    context.model === "testResult"
  ) {
    return context.res.status(400).json(INVALID_BODY);
  }

  const numberIds = body.data.ids as number[];
  const stringIds = body.data.ids as string[];

  switch (context.model) {
    case "school": {
      if (context.session.user.role !== "SUPERADMIN") {
        return context.res.status(401).json(UNAUTHORIZED);
      }
      const schools = await prisma.school.deleteMany({
        where: { id: { in: numberIds } },
      });
      return context.res.status(200).json({ success: true, records: schools });
    }
    case "class": {
      const classes = await prisma.class.deleteMany({
        where: {
          id: { in: numberIds },
          schoolId:
            // admin can only delete classes in their school
            context.session.user.role === "ADMIN"
              ? context.session.user.schoolId
              : undefined,
        },
      });
      return context.res.status(200).json({ success: true, records: classes });
    }
    case "student": {
      const students = await prisma.student.deleteMany({
        where: {
          id: { in: numberIds },
          class: {
            schoolId:
              // admin can only delete students in their school
              context.session.user.role === "ADMIN"
                ? context.session.user.schoolId
                : undefined,
          },
        },
      });
      return context.res.status(200).json({ success: true, records: students });
    }
    case "test": {
      if (context.session.user.role !== "SUPERADMIN") {
        return context.res.status(401).json(UNAUTHORIZED);
      }
      const tests = await prisma.test.deleteMany({
        where: { id: { in: numberIds } },
      });
      return context.res.status(200).json({ success: true, records: tests });
    }
    case "testResult": {
      const ids = stringIds.map((id) => {
        const [testId, studentId] = id.split("-").map((id) => parseInt(id));
        return { testId, studentId };
      });
      // FIXME: admins can delete any test result
      const testResults = await prisma.$transaction(
        ids.map((id) =>
          prisma.testResult.delete({
            where: {
              testId_studentId: {
                testId: id.testId,
                studentId: id.testId,
              },
            },
          })
        )
      );
      return context.res
        .status(200)
        .json({ success: true, records: testResults });
    }
    case "admin": {
      if (context.session.user.role !== "SUPERADMIN") {
        return context.res.status(401).json(UNAUTHORIZED);
      }
      const admins = await prisma.admin.deleteMany({
        where: { id: { in: numberIds }, role: "ADMIN" },
      });
      return context.res.status(200).json({ success: true, records: admins });
    }
  }
};

const handler: NextApiHandler<FetchRecordsResponse> = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session || session.user.role === "STUDENT") {
    return res.status(401).json(UNAUTHORIZED);
  }
  const model = validateModelQuery(req.query.model);
  if (!model) {
    return res.status(400).json(INVALID_MODEL_NAME);
  }
  const context = { req, res, model, session };

  switch (req.method) {
    case "GET": {
      return await getRecords(context);
    }
    case "POST": {
      return await postRecord(context);
    }
    case "DELETE": {
      return await deleteRecord(context);
    }
  }

  return res.status(405).json(METHOD_NOT_ALLOWED);
};

export default handler;
