import { RecordModelName } from "@/constants/models";
import { axiosInstance } from "@/lib/axios-instance";
import { ModelRecord } from "./record";

type DeleteRecordsContext = {
  model: RecordModelName;
  records: ModelRecord[];
};

export const deleteRecords = async ({
  records,
  model,
}: DeleteRecordsContext) => {
  const ids = records.map((record) => record.id);
  const res = await axiosInstance.delete(`/api/records/${model}`, {
    data: { ids },
  });
  return res;
};
