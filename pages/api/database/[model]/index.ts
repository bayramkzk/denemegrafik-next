import {
  INVALID_MODEL_NAME,
  METHOD_NOT_ALLOWED,
  UNAUTHORIZED,
} from "@/constants/errors";
import { DatabaseModelFetchResponse } from "@/types/db";
import { findManyByModel } from "@/utils/db";
import { validateModelQuery } from "@/utils/model";
import { NextApiHandler } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const handler: NextApiHandler<DatabaseModelFetchResponse> = async (
  req,
  res
) => {
  if (req.method !== "GET") {
    return res.status(405).json(METHOD_NOT_ALLOWED);
  }

  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "SUPERADMIN") {
    return res.status(401).json(UNAUTHORIZED);
  }

  const model = validateModelQuery(req.query.model);
  if (!model) {
    return res.status(400).json(INVALID_MODEL_NAME);
  }

  const records = await findManyByModel(model);
  return res.status(200).json({ records, success: true });
};

export default handler;