import {
  DUPLICATE_CITIZEN_ID,
  INTERNAL_SERVER_ERROR,
  METHOD_NOT_ALLOWED,
  NO_STUDENT_FOUND,
} from "@/constants/errors";
import { PASSWORD_SALT_OR_ROUNDS } from "@/constants/index";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/schemas/register";
import { AuthResponse } from "@/types/auth";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextApiHandler } from "next";

const registerUser = async (citizenId: string, password: string) => {
  const hash = await bcrypt.hash(password, PASSWORD_SALT_OR_ROUNDS);
  try {
    const user = await prisma.user.create({
      data: { citizenId, hash },
      include: { student: { include: { class: true } } },
    });
    return { user };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") return { error: DUPLICATE_CITIZEN_ID };
      if (e.code === "P2003") return { error: NO_STUDENT_FOUND };
    }
    console.error(e);
    return { error: INTERNAL_SERVER_ERROR };
  }
};

const handler: NextApiHandler<AuthResponse> = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json(METHOD_NOT_ALLOWED);

  const body = registerSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: body.error.issues });

  const result = await registerUser(body.data.citizenId, body.data.password);
  if (result.error) return res.status(400).json(result.error);

  const { hash, ...userWithoutHash } = result.user;
  const token = jwt.sign({ id: result.user.id }, process.env.JWT_SECRET!);
  res.status(200).json({ user: userWithoutHash, token });
};

export default handler;
