import {
  INVALID_BODY,
  METHOD_NOT_ALLOWED,
  UNAUTHORIZED,
} from "@/constants/errors";
import { RecordModelName } from "@/constants/models";
import { prisma } from "@/lib/prisma";
import { SessionUser } from "@/types/auth";
import { validateModelQuery } from "@/utils/model";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import _ from "lodash";
import { NextApiHandler } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

interface PatchRecordRequest {
  model: RecordModelName;
  id: string;
  body: Record<string, unknown>;
  user: SessionUser;
}

async function patchRecord({ model, id, body, user }: PatchRecordRequest) {
  console.log({ model, id, body, user });

  switch (model) {
    case "school": {
      if (user.role !== "SUPERADMIN") {
        return { status: 401, data: UNAUTHORIZED };
      }
      const updatedSchool = await prisma.school.update({
        where: { id: Number(id) },
        data: _.pickBy(body, (_, key) =>
          ["id", "name", "createdAt", "updatedAt"].includes(key)
        ),
      });
      return { status: 200, data: { record: updatedSchool, success: true } };
    }
    case "class": {
      // superadmins can update any class, admins can only update classes in their school
      if (user.role === "ADMIN") {
        const school = await prisma.school.findUnique({
          where: { id: user.schoolId },
          select: { classes: { where: { id: Number(id) } } },
        });
        if (school?.classes.length === 0) {
          return { status: 401, data: UNAUTHORIZED };
        }
      } else if (user.role !== "SUPERADMIN") {
        return { status: 401, data: UNAUTHORIZED };
      }
      const updatedClass = await prisma.class.update({
        where: { id: Number(id) },
        data: _.pickBy(body, (_, key) =>
          [
            "id",
            "grade",
            "branch",
            "schoolId",
            "createdAt",
            "updatedAt",
          ].includes(key)
        ),
      });
      return { status: 200, data: { record: updatedClass, success: true } };
    }
    case "student": {
      // superadmins can update any student, admins can only update students in their school
      if (user.role === "ADMIN") {
        const student = await prisma.student.findUnique({
          where: { id: Number(id) },
          select: { class: { select: { schoolId: true } } },
        });
        if (student?.class.schoolId !== user.schoolId) {
          return { status: 401, data: UNAUTHORIZED };
        }
      } else if (user.role !== "SUPERADMIN") {
        return { status: 401, data: UNAUTHORIZED };
      }
      const updatedStudent = await prisma.student.update({
        where: { id: Number(id) },
        data: _.pickBy(body, (_, key) =>
          [
            "id",
            "name",
            "citizenId",
            "classId",
            "code",
            "createdAt",
            "updatedAt",
          ].includes(key)
        ),
      });
      return { status: 200, data: { record: updatedStudent, success: true } };
    }
    case "admin": {
      if (user.role !== "SUPERADMIN") {
        return { status: 401, data: UNAUTHORIZED };
      }
      const updatedAdmin = await prisma.admin.update({
        where: { id: Number(id) },
        data: _.pickBy(body, (_, key) =>
          [
            "name",
            "username",
            "hash",
            "role",
            "schoolId",
            "createdAt",
            "updatedAt",
          ].includes(key)
        ),
      });
      return { status: 200, data: { record: updatedAdmin, success: true } };
    }
    case "test": {
      if (user.role !== "SUPERADMIN") {
        return { status: 401, data: UNAUTHORIZED };
      }
      const updatedTest = await prisma.test.update({
        where: { id: Number(id) },
        data: _.pickBy(body, (_, key) =>
          ["id", "name", "type", "date", "createdAt", "updatedAt"].includes(key)
        ),
      });
      return { status: 200, data: { record: updatedTest, success: true } };
    }
    case "testResult": {
      if (user.role !== "SUPERADMIN") {
        return { status: 401, data: UNAUTHORIZED };
      }
      const [testId, studentId] = id.split("-");
      const updatedTestResult = await prisma.testResult.update({
        where: {
          testId_studentId: {
            testId: Number(testId),
            studentId: Number(studentId),
          },
        },
        data: _.pickBy(body, (_, key) =>
          ["testId", "studentId", "score", "createdAt", "updatedAt"].includes(
            key
          )
        ),
      });
      return {
        status: 200,
        data: { record: updatedTestResult, success: true },
      };
    }
    default:
      return { status: 400, data: INVALID_BODY };
  }
}

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "PATCH") {
    return res.status(405).json(METHOD_NOT_ALLOWED);
  }

  const model = validateModelQuery(req.query.model);
  const id = req.query.id;
  if (!model || !id || typeof id !== "string" || !req.body) {
    return res.status(400).json(INVALID_BODY);
  }

  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session || session.user.role === "STUDENT") {
    return res.status(401).json(UNAUTHORIZED);
  }

  try {
    const result = await patchRecord({
      model,
      id,
      body: req.body,
      user: session.user,
    });
    return res.status(result.status).json(result.data);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return res
        .status(400)
        .json({ error: { code: "prisma_error", message: e.message } });
    }
    console.error(e);
    res.status(500).json(e);
  }
};

export default handler;
