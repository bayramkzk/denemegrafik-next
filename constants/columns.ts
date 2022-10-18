import { RecordModel } from "@/constants/models";
import { DataTableColumn } from "mantine-datatable";

export const columnDefaults: Partial<DataTableColumn<RecordModel>> = {
  sortable: true,
  ellipsis: true,
  titleSx: { userSelect: "none" },
};

export const modelToColumnMapWithoutDefaults: Record<
  RecordModel,
  DataTableColumn<any>[]
> = {
  organization: [
    {
      accessor: "id",
      title: "ID",
    },
    {
      accessor: "name",
      title: "Okul Adı",
    },
    {
      accessor: "classCount",
      title: "Şube Sayısı",
    },
    {
      accessor: "studentCount",
      title: "Öğrenci Sayısı",
    },
    {
      accessor: "createdAt",
      title: "Oluşturulma Tarihi",
    },
    {
      accessor: "updatedAt",
      title: "Güncellenme Tarihi",
    },
  ],
  group: [
    {
      accessor: "id",
      title: "ID",
    },
    {
      accessor: "grade",
      title: "Sınıf",
    },
    {
      accessor: "branch",
      title: "Şube",
    },
    {
      accessor: "studentCount",
      title: "Öğrenci Sayısı",
    },
    {
      accessor: "createdAt",
      title: "Oluşturulma Tarihi",
    },
    {
      accessor: "updatedAt",
      title: "Güncellenme Tarihi",
    },
  ],
  profile: [
    {
      accessor: "id",
      title: "ID",
    },
    {
      accessor: "name",
      title: "Ad",
    },
    {
      accessor: "surname",
      title: "Soyad",
    },
    {
      accessor: "className",
      title: "Sınıf",
    },
    {
      accessor: "code",
      title: "Okul Numarası",
    },
    {
      accessor: "createdAt",
      title: "Oluşturulma Tarihi",
    },
    {
      accessor: "updatedAt",
      title: "Güncellenme Tarihi",
    },
  ],
  user: [
    {
      accessor: "id",
      title: "ID",
    },
    {
      accessor: "citizenId",
      title: "TC Kimlik No",
    },
    {
      accessor: "hash",
      title: "Parola Hash",
    },
    {
      accessor: "role",
      title: "Kullanıcı Tipi",
    },
    {
      accessor: "createdAt",
      title: "Oluşturulma Tarihi",
    },
    {
      accessor: "updatedAt",
      title: "Güncellenme Tarihi",
    },
  ],
  test: [
    {
      accessor: "id",
      title: "ID",
    },
    {
      accessor: "name",
      title: "Deneme Sınavı Adı",
    },
    {
      accessor: "studentCount",
      title: "Öğrenci Sayısı",
    },
    {
      accessor: "schoolCount",
      title: "Okul Sayısı",
    },
    {
      accessor: "createdAt",
      title: "Oluşturulma Tarihi",
    },
    {
      accessor: "updatedAt",
      title: "Güncellenme Tarihi",
    },
  ],
  testResult: [
    {
      accessor: "id",
      title: "ID",
    },
    {
      accessor: "testName",
      title: "Deneme Sınavı Adı",
    },
    {
      accessor: "profileName",
      title: "Öğrenci Adı",
    },
    {
      accessor: "score",
      title: "Puan",
    },
    {
      accessor: "createdAt",
      title: "Oluşturulma Tarihi",
    },
    {
      accessor: "updatedAt",
      title: "Güncellenme Tarihi",
    },
  ],
};

export const modelToColumnMap = Object.fromEntries(
  Object.entries(modelToColumnMapWithoutDefaults).map(([model, columns]) => [
    model,
    columns.map((column) => ({ ...columnDefaults, ...column })),
  ])
) as Record<RecordModel, DataTableColumn<any>[]>;
