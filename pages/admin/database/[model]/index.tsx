import Layout from "@/components/Layout";
import SessionGuard from "@/components/SessionGuard";
import { modelToColumnMap } from "@/constants/columns";
import {
  DatabaseModel,
  DatabaseModelPluralDisplayNames,
} from "@/constants/models";
import { useRecords } from "@/hooks/use-records";
import { validateModelQuery } from "@/utils/model";
import { Stack, Text, Title } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconDatabaseOff } from "@tabler/icons";
import sortBy from "lodash/sortBy";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";

export type DatabaseModelPageServerSideProps = {
  model: DatabaseModel;
};

export type DatabaseModelPageProps = DatabaseModelPageServerSideProps & {};

const DatabaseModelPage: NextPage<DatabaseModelPageProps> = ({ model }) => {
  const title = DatabaseModelPluralDisplayNames[model];
  const { height } = useViewportSize();
  const { records, isLoading, error } = useRecords(model);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "id",
    direction: "asc",
  });
  const [sortedRecords, setRecords] = useState(() =>
    sortBy(records, sortStatus.columnAccessor)
  );

  useEffect(() => {
    if (records) {
      const sorted = sortBy(records, sortStatus.columnAccessor);
      setRecords(sortStatus.direction === "desc" ? sorted.reverse() : sorted);
    }
  }, [sortStatus, records]);

  useEffect(() => {
    if (error) {
      console.error(error);
      showNotification({
        title: "Veri çekme başarısız",
        message: error ? JSON.stringify(error) : "Bilinmeyen bir hata oluştu",
        color: "red",
      });
    }
  }, [error]);

  return (
    <SessionGuard allowedRoles={["ADMIN", "SUPERADMIN"]}>
      {() => (
        <Layout>
          <Stack>
            <Title>{title}</Title>

            <DataTable
              my={50}
              columns={modelToColumnMap[model]}
              records={sortedRecords}
              fetching={isLoading}
              loaderBackgroundBlur={1}
              minHeight={height / 2}
              emptyState={
                <Stack align="center">
                  <IconDatabaseOff size={40} />
                  <Text>{title} için veri bulunamadı</Text>
                </Stack>
              }
              sortStatus={sortStatus}
              onSortStatusChange={setSortStatus}
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
