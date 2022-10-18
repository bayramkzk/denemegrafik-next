import { Routes } from "@/constants/routes";
import { axiosInstance } from "@/lib/axios-instance";
import { FetchRecordsResponse } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useRecords = (model: string) => {
  const { data, ...query } = useQuery([model], () =>
    axiosInstance
      .get<FetchRecordsResponse>(`${Routes.recordsApi}/${model}`)
      .then((res) => {
        if (res.data.success) {
          return res.data.records;
        }
        throw new Error(res.data.error.message);
      })
  );
  return { records: data, ...query };
};
