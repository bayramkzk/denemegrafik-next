import { RecordModelName } from "@/constants/models";
import { Routes } from "@/constants/routes";
import { axiosInstance } from "@/lib/axios-instance";
import { RecordsByName } from "@/types/record";
import { FetchRecordsResponse } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useRecords = <T extends RecordModelName>(model: T) => {
  const { data, ...query } = useQuery([model], () =>
    axiosInstance
      .get<FetchRecordsResponse>(`${Routes.recordsApi}/${model}`)
      .then((res) => {
        if (res.data.success) {
          return res.data.records as unknown as RecordsByName<T> | null;
        }
        throw new Error(
          res.data?.error?.message || "Bilinmeyen bir hata oluştu"
        );
      })
  );
  return { records: data, ...query };
};
