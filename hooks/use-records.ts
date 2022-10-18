import { Routes } from "@/constants/routes";
import { axiosInstance } from "@/lib/axios-instance";
import { DatabaseModelFetchResponse } from "@/types/db";
import { useQuery } from "@tanstack/react-query";

export const useRecords = (model: string) => {
  const { data, ...query } = useQuery([model], () =>
    axiosInstance
      .get<DatabaseModelFetchResponse>(`${Routes.databaseApi}/${model}`)
      .then((res) => {
        if (res.data.success) {
          return res.data.records;
        }
        throw new Error(res.data.error.message);
      })
  );
  return { records: data, ...query };
};
