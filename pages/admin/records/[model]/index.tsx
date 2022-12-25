import CreateRecordDrawerButton from "@/components/CreateRecordDrawerButton";
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
import { ModelRecord } from "@/utils/record";
import { Grid, Group, Stack, Text, TextInput, Title } from "@mantine/core";
import { useDebouncedValue, useViewportSize } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconDatabaseOff, IconSearch } from "@tabler/icons";
import sortBy from "lodash/sortBy";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { GetServerSideProps, NextPage } from "next";
import { useEffect, useMemo, useState } from "react";

export type RecordsPageProps = {
  model: RecordModelName;
};

const PAGE_SIZE = 20;

const RecordsPage: NextPage<RecordsPageProps> = ({ model }) => {
  const title = RecordModelPluralDisplayNames[model];
  const { height } = useViewportSize();

  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 1000);

  const [page, setPage] = useState(1);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "id",
    direction: "asc",
  });
  const [selectedRecords, setSelectedRecords] = useState<ModelRecord[]>([]);

  const { records, isLoading, error } = useRecords(model);
  const filteredRecords = useMemo(() => {
    if (!records) return null;
    return records
      .map((record) => record as ModelRecord)
      .filter((record) =>
        debouncedQuery
          .split(", ")
          .filter(Boolean)
          .every((q) =>
            JSON.stringify(record).toLowerCase().includes(q.toLowerCase())
          )
      );
  }, [records, debouncedQuery]);
  const pageRecords = useMemo(() => {
    if (!filteredRecords) return null;
    return filteredRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [filteredRecords, page]);
  const sortedRecords = useMemo(() => {
    if (!pageRecords) return null;
    const updatedRecords = sortBy(pageRecords, sortStatus.columnAccessor);
    if (sortStatus.direction === "desc") updatedRecords.reverse();
    return updatedRecords;
  }, [pageRecords, sortStatus]);

  useEffect(() => {
    setSelectedRecords([]);
    setQuery("");
    setPage(1);
  }, [model, records]);

  useEffect(() => setPage(1), [debouncedQuery]);

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
    <SessionGuard allowedRoles={["ADMIN", "SUPERADMIN", "VIEWER"]}>
      {({ user }) => {
        const actionsEnabled =
          user.role === "SUPERADMIN" ||
          (model !== "test" && user.role !== "VIEWER");

        return (
          <Layout>
            <Stack spacing="xl">
              <Title mb="lg">{title}</Title>

              {actionsEnabled ? (
                <Grid grow gutter={8}>
                  <Grid.Col span={12} sm={6} md={8}>
                    <TextInput
                      placeholder={`${title} arasında anahtar kelimeleri virgülle ayırarak arama yapın... (Örn: "ahmet, 9 / E")`}
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
                      <CreateRecordDrawerButton model={model} />
                    </Group>
                  </Grid.Col>
                </Grid>
              ) : (
                <TextInput
                  placeholder={`${title} arasında anahtar kelimeleri virgülle ayırarak arama yapın... (Örn: "ahmet, 9 / E")`}
                  value={query}
                  icon={<IconSearch size={16} />}
                  onChange={(event) => setQuery(event.target.value)}
                  sx={{ flexGrow: 1, flexShrink: 1 }}
                />
              )}

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
                  key={model}
                  columns={(() => {
                    const columns = modelToColumnMap[model];
                    if (!actionsEnabled) {
                      return columns.filter(
                        (column) => column.accessor !== "actions"
                      );
                    }
                    return columns;
                  })()}
                  records={sortedRecords || []}
                  fetching={isLoading}
                  loaderBackgroundBlur={5}
                  height={height - 300}
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
                  totalRecords={filteredRecords?.length}
                  recordsPerPage={PAGE_SIZE}
                  page={page}
                  onPageChange={(p) => setPage(p)}
                />
              </Stack>
            </Stack>
          </Layout>
        );
      }}
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
