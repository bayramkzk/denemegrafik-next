import {
  DUPLICATE_CITIZEN_ID,
  INTERNAL_SERVER_ERROR,
  NO_STUDENT_FOUND,
} from "@/constants/errors";
import { PASSWORD_SALT_OR_ROUNDS } from "@/constants/index";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/schemas/register";
import { RegisterResponse } from "@/types/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import bcrypt from "bcrypt";
import { NextApiHandler } from "next";

const handler: NextApiHandler<RegisterResponse> = async (req, res) => {
  const body = registerSchema.safeParse(req.body);
  if (!body.success)
    return res.status(400).json({ error: body.error.issues, success: false });

  const student = await prisma.student.findUnique({
    where: { citizenId: body.data.citizenId },
  });
  if (!student) return res.status(400).json(NO_STUDENT_FOUND);

  const hash = await bcrypt.hash(body.data.password, PASSWORD_SALT_OR_ROUNDS);
  try {
    const user = await prisma.user.create({
      data: { citizenId: body.data.citizenId, hash },
      include: {
        student: { include: { class: { include: { school: true } } } },
        admin: { include: { school: true } },
      },
    });
    const { hash: _, ...userWithoutHash } = user;
    return res.status(200).json({ user: userWithoutHash, success: true });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(400).json(DUPLICATE_CITIZEN_ID);
    }

    console.error(error);
    return res.status(500).json(INTERNAL_SERVER_ERROR);
  }
};

export default handler;
