import { FindManyByModelResult } from "@/utils/db";
import { CustomErrorResponse } from "./response";

export type DatabaseModelFetchSuccessResponse = {
  records: FindManyByModelResult;
  success: true;
};

export type DatabaseModelFetchResponse =
  | DatabaseModelFetchSuccessResponse
  | CustomErrorResponse;
