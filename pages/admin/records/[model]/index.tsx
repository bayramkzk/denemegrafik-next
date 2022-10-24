import CreateRecordModalButton from "@/components/CreateRecordModalButton";
import DeleteRecordModalButton from "@/components/DeleteRecordsModalButton";
import Layout from "@/components/Layout";
import SessionGuard from "@/components/SessionGuard";
import UploadExcelModalButton from "@/components/UploadExcelModalButton";
import { modelToColumnMap } from "@/constants/columns";
import {
  RecordModelName,
  RecordModelPluralDisplayNames,
} from "@/constants/models";
import { useRecords } from "@/hooks/use-records";
import { validateModelQuery } from "@/utils/model";
import { ModelRecord, ModelRecords } from "@/utils/record";
import { Grid, Group, Stack, Text, TextInput, Title } from "@mantine/core";
import { useDebouncedValue, useViewportSize } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconDatabaseOff, IconSearch } from "@tabler/icons";
import sortBy from "lodash/sortBy";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";

export type RecordsPageProps = {
  model: RecordModelName;
};

const RecordsPage: NextPage<RecordsPageProps> = ({ model }) => {
  const title = RecordModelPluralDisplayNames[model];
  const { height } = useViewportSize();
  const { records, isLoading, error } = useRecords(model);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "id",
    direction: "asc",
  });
  const [sortedRecords, setRecords] = useState(() =>
    sortBy(records, sortStatus.columnAccessor)
  );
  const [selectedRecords, setSelectedRecords] = useState<ModelRecord[]>([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);

  useEffect(() => setSelectedRecords([]), [model]);

  useEffect(() => {
    if (records) {
      const filtered = records
        .map((record) => record as ModelRecord)
        .filter((record) =>
          Object.values(record).some((value) =>
            String(value)
              .toLowerCase()
              .trim()
              .includes(debouncedQuery.toLowerCase().trim())
          )
        ) as ModelRecords;
      const sorted = sortBy(filtered, sortStatus.columnAccessor);
      setRecords(sortStatus.direction === "desc" ? sorted.reverse() : sorted);
    }
  }, [sortStatus, records, debouncedQuery]);

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
          <Stack spacing="xl">
            <Title mb="lg">{title}</Title>

            <Grid grow gutter={8}>
              <Grid.Col span={12} sm={6} md={8}>
                <TextInput
                  placeholder={`${title} arasında ara...`}
                  value={query}
                  icon={<IconSearch size={16} />}
                  onChange={(event) => setQuery(event.target.value)}
                  sx={{ flexGrow: 1, flexShrink: 1 }}
                />
              </Grid.Col>

              <Grid.Col span={12} sm={6} md={4}>
                <Group noWrap spacing={4}>
                  <DeleteRecordModalButton
                    model={model}
                    records={selectedRecords}
                  />
                  <UploadExcelModalButton model={model} />
                  <CreateRecordModalButton model={model} />
                </Group>
              </Grid.Col>
            </Grid>

            <Stack spacing="xs">
              {records && !isLoading ? (
                <Text align="right" size="sm">
                  {selectedRecords.length || records.length} kayıt
                </Text>
              ) : (
                <Text align="right" size="sm" color="dimmed">
                  {isLoading ? "Yükleniyor..." : "Veri yok"}
                </Text>
              )}

              <DataTable
                columns={modelToColumnMap[model]}
                records={sortedRecords}
                fetching={isLoading}
                minHeight={height / 2}
                emptyState={
                  <Stack align="center">
                    <IconDatabaseOff size={40} />
                    <Text>{title} için veri bulunamadı</Text>
                  </Stack>
                }
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                selectedRecords={selectedRecords}
                onSelectedRecordsChange={(records) =>
                  setSelectedRecords(records as ModelRecord[])
                }
              />
            </Stack>
          </Stack>
        </Layout>
      )}
    </SessionGuard>
  );
};

export default RecordsPage;

export const getServerSideProps: GetServerSideProps<RecordsPageProps> = async (
  context
) => {
  const model = validateModelQuery(context.query.model);
  if (!model) {
    return { notFound: true };
  }
  return { props: { model } };
};
