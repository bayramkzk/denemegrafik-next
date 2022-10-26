import { PASSWORD_SALT_OR_ROUNDS } from "@/constants/index";
import bcrypt from "bcrypt";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const { password } = req.body;
  const hash = await bcrypt.hash(password, PASSWORD_SALT_OR_ROUNDS);
  res.status(200).json({ hash });
};

export default handler;
