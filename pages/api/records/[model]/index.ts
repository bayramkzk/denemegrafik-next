import {
  INVALID_MODEL_NAME,
  METHOD_NOT_ALLOWED,
  NO_CLASS_FOUND,
  NO_STUDENT_FOUND,
  UNAUTHORIZED,
} from "@/constants/errors";
import { RecordModelName } from "@/constants/models";
import { prisma } from "@/lib/prisma";
import { studentSchema, testResultSchema } from "@/schemas/postRecord";
import { FetchRecordsResponse } from "@/types/response";
import { validateModelQuery } from "@/utils/model";
import { findRecordsByModel } from "@/utils/record";
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

  const body = testResultSchema.safeParse(req.body);
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

  const testResult = await prisma.testResult.create({
    data: {
      testId: body.data.testId,
      studentId: student.id,
      score: body.data.score,
    },
  });

  return res.status(200).json({ success: true, record: testResult });
};

const postStudent = async (context: ModelRequestContext) => {
  if (context.session.user.role === "STUDENT") {
    return context.res.status(401).json(UNAUTHORIZED);
  }

  const body = studentSchema.safeParse(context.req.body);
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

  const student = await prisma.student.create({
    data: {
      name: body.data.name,
      citizenId: body.data.citizenId,
      code: body.data.code,
      classId: cls.id,
    },
  });

  return context.res.status(200).json({ success: true, record: student });
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
  }

  return res.status(405).json(METHOD_NOT_ALLOWED);
};

export default handler;
