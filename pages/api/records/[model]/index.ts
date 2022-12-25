import {
  DUPLICATE_CLASS,
  INTERNAL_SERVER_ERROR,
  INVALID_BODY,
  INVALID_MODEL_NAME,
  METHOD_NOT_ALLOWED,
  REF_DELETE_ERROR,
  UNAUTHORIZED,
} from "@/constants/errors";
import { prisma } from "@/lib/prisma";
import { deleteRecordsSchema } from "@/schemas/record";
import { AdminUser } from "@/types/auth";
import { FetchRecordsResponse, ModelRequestContext } from "@/types/response";
import { validateModelQuery } from "@/utils/model";
import { findRecordsByModel } from "@/utils/record";
import { Prisma } from "@prisma/client";
import { NextApiHandler } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const getRecords = async ({ res, model, session }: ModelRequestContext) => {
  const records = await findRecordsByModel(model, session.user);
  if (records === null) {
    return res.status(401).json(UNAUTHORIZED);
  }
  return res.status(200).json({ records, success: true });
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

      const testResultsToCheck = await prisma.testResult.aggregate({
        where: {
          AND: [
            { testId: { in: ids.map((id) => id.testId) } },
            { studentId: { in: ids.map((id) => id.studentId) } },
            {
              student: { class: { schoolId: context.session.user.schoolId } },
            },
          ],
        },
        _count: true,
      });

      // check if the user is trying to delete test results from other schools
      if (testResultsToCheck._count !== ids.length) {
        return context.res.status(401).json(UNAUTHORIZED);
      }

      const testResults = await prisma.$transaction(
        ids.map((id) =>
          prisma.testResult.delete({
            where: {
              testId_studentId: {
                testId: id.testId,
                studentId: id.studentId,
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

const postRecord = async (context: ModelRequestContext) => {
  if (context.session.user.role === "STUDENT") {
    return context.res.status(401).json(UNAUTHORIZED);
  }
  const { model, req, res, session } = context;

  switch (model) {
    case "school": {
      if (session.user.role !== "SUPERADMIN") {
        return res.status(401).json(UNAUTHORIZED);
      }
      const school = await prisma.school.create({
        data: req.body,
      });
      return res.status(200).json({ success: true, record: school });
    }
    case "class": {
      const schoolId =
        session.user.role === "ADMIN"
          ? session.user.schoolId
          : req.body.schoolId || (session.user as AdminUser).schoolId;

      const existingClass = await prisma.class.findFirst({
        where: { grade: req.body.grade, branch: req.body.branch, schoolId },
      });

      if (existingClass) {
        return res.status(400).json(DUPLICATE_CLASS);
      }

      const cls = await prisma.class.create({
        data: { ...req.body, schoolId },
      });
      return res.status(200).json({ success: true, record: cls });
    }
    case "student": {
      // FIXME: admins can create students in any school
      const student = await prisma.student.create({
        data: req.body,
      });
      return res.status(200).json({ success: true, record: student });
    }
    case "test": {
      if (session.user.role !== "SUPERADMIN") {
        return res.status(401).json(UNAUTHORIZED);
      }
      const test = await prisma.test.create({
        data: req.body,
      });
      return res.status(200).json({ success: true, record: test });
    }
    case "testResult": {
      const testResult = await prisma.testResult.create({
        data: req.body,
      });
      return res.status(200).json({ success: true, record: testResult });
    }
    case "admin": {
      if (session.user.role !== "SUPERADMIN") {
        return res.status(401).json(UNAUTHORIZED);
      }
      const admin = await prisma.admin.create({
        data: req.body,
      });
      return res.status(200).json({ success: true, record: admin });
    }
  }
};

const handler: NextApiHandler<FetchRecordsResponse> = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (
    !session ||
    session.user.role === "STUDENT" ||
    (session.user.role === "VIEWER" && req.method != "GET")
  ) {
    return res.status(401).json(UNAUTHORIZED);
  }
  const model = validateModelQuery(req.query.model);
  if (!model) {
    return res.status(400).json(INVALID_MODEL_NAME);
  }
  const context = { req, res, model, session };

  try {
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
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2003") {
        if (req.method === "DELETE") {
          res.status(404).json(REF_DELETE_ERROR);
        }
      }

      return res.status(500).json({
        success: false,
        error: {
          code: "prisma_error",
          message: e.message,
        },
      });
    }
    console.error(e);
    return res.status(500).json(INTERNAL_SERVER_ERROR);
  }

  return res.status(405).json(METHOD_NOT_ALLOWED);
};

export default handler;
