import { INVALID_CREDENTIALS, METHOD_NOT_ALLOWED } from "@/constants/errors";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/schemas/login";
import { AuthResponse } from "@/types/auth";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextApiHandler } from "next";

const validateLogin = async (citizenId: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { citizenId },
    include: { student: { include: { class: true } } },
  });
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.hash);
  if (!isValid) return null;

  return user;
};

const handler: NextApiHandler<AuthResponse> = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json(METHOD_NOT_ALLOWED);

  const body = loginSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: body.error.issues });

  const user = await validateLogin(body.data.citizenId, body.data.password);
  if (!user) return res.status(400).json(INVALID_CREDENTIALS);

  const { hash, ...userWithoutHash } = user;
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
  res.status(200).json({ user: userWithoutHash, token });
};

export default handler;
