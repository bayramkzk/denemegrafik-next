import Layout from "@/components/Layout";
import SessionGuard from "@/components/SessionGuard";
import { modelToColumnMap } from "@/constants/columns";
import {
  DatabaseModel,
  DatabaseModelPluralDisplayNames,
} from "@/constants/models";
import { Routes } from "@/constants/routes";
import { validateModelQuery } from "@/utils/model";
import { Stack, Text, Title } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconDatabaseOff } from "@tabler/icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DataTable } from "mantine-datatable";
import { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";

export type DatabaseModelPageServerSideProps = {
  model: DatabaseModel;
};

export type DatabaseModelPageProps = DatabaseModelPageServerSideProps & {};

const DatabaseModelPage: NextPage<DatabaseModelPageProps> = ({ model }) => {
  const title = DatabaseModelPluralDisplayNames[model];
  const { height } = useViewportSize();
  const minHeight = height / 2;
  const {
    data: res,
    isLoading,
    error,
  } = useQuery([model], () => axios.get(`${Routes.databaseApi}/${model}`));

  useEffect(() => {
    if (res && !res?.data.success) {
      console.error(error, res);
      showNotification({
        title: "Veri çekme başarısız",
        message: error
          ? String(error)
          : res?.data
          ? JSON.stringify(res?.data)
          : "Bilinmeyen bir hata oluştu",
        color: "red",
      });
    }
  }, [res, error]);

  return (
    <SessionGuard>
      {() => (
        <Layout>
          <Stack>
            <Title>{title}</Title>

            <DataTable
              my={50}
              columns={modelToColumnMap[model]}
              records={res?.data.records}
              fetching={isLoading}
              loaderBackgroundBlur={1}
              minHeight={minHeight}
              emptyState={
                <Stack align="center">
                  <IconDatabaseOff size={40} />
                  <Text>{title} için veri bulunamadı</Text>
                </Stack>
              }
            />
          </Stack>
        </Layout>
      )}
    </SessionGuard>
  );
};

export default DatabaseModelPage;

export const getServerSideProps: GetServerSideProps<
  DatabaseModelPageServerSideProps
> = async (context) => {
  const model = validateModelQuery(context.query.model);
  if (!model) {
    return { notFound: true };
  }
  return { props: { model } };
};
