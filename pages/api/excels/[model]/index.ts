import {
  DUPLICATE_CITIZEN_ID,
  DUPLICATE_TEST_RESULT,
  INTERNAL_SERVER_ERROR,
  INVALID_MODEL_NAME,
  METHOD_NOT_ALLOWED,
  NO_CLASS_FOUND,
  NO_STUDENT_FOUND,
  UNAUTHORIZED,
} from "@/constants/errors";
import { postStudentSchema, postTestResultSchema } from "@/schemas/record";
import { FetchRecordsResponse, ModelRequestContext } from "@/types/response";
import { validateModelQuery } from "@/utils/model";
import { Prisma } from "@prisma/client";
import { NextApiHandler } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

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
  try {
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
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json({
        success: false,
        error: {
          code: "prisma_error",
          message: e.message,
        },
      });
    }
    return res.status(500).json(INTERNAL_SERVER_ERROR);
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

  if (req.method === "POST") {
    return await postRecord(context);
  }
  return res.status(404).json(METHOD_NOT_ALLOWED);
};

export default handler;
