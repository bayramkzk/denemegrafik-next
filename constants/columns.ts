import { RecordModelName } from "@/constants/models";
import { DataTableColumn } from "mantine-datatable";

export const columnDefaults: Partial<DataTableColumn<RecordModelName>> = {
  sortable: true,
  ellipsis: true,
  titleSx: { userSelect: "none" },
};

const renderDateTime = (date: Date) => {
  return new Date(date).toLocaleString("tr", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

const renderDate = (date: Date) => {
  return new Date(date).toLocaleString("tr", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const modelToColumnMapWithoutDefaults: Record<
  RecordModelName,
  DataTableColumn<any>[]
> = {
  school: [
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
      render: (date) => renderDateTime(date.createdAt),
    },
    {
      accessor: "updatedAt",
      title: "Güncellenme Tarihi",
      render: (date) => renderDateTime(date.updatedAt),
    },
  ],
  class: [
    {
      accessor: "id",
      title: "ID",
    },
    {
      accessor: "school.name",
      title: "Okul Adı",
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
      render: (date) => renderDateTime(date.createdAt),
    },
    {
      accessor: "updatedAt",
      title: "Güncellenme Tarihi",
      render: (date) => renderDateTime(date.updatedAt),
    },
  ],
  student: [
    {
      accessor: "id",
      title: "ID",
    },
    {
      accessor: "citizenId",
      title: "TC Kimlik No",
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
      render: (date) => renderDateTime(date.createdAt),
    },
    {
      accessor: "updatedAt",
      title: "Güncellenme Tarihi",
      render: (date) => renderDateTime(date.updatedAt),
    },
  ],
  admin: [
    {
      accessor: "id",
      title: "ID",
    },
    {
      accessor: "username",
      title: "Kullanıcı Adı",
    },
    {
      accessor: "name",
      title: "Gerçek Ad",
    },
    {
      accessor: "role",
      title: "Kullanıcı Tipi",
    },
    {
      accessor: "createdAt",
      title: "Oluşturulma Tarihi",
      render: (date) => renderDateTime(date.createdAt),
    },
    {
      accessor: "updatedAt",
      title: "Güncellenme Tarihi",
      render: (date) => renderDateTime(date.updatedAt),
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
      accessor: "date",
      title: "Uygulama Tarihi",
      render: (date) => renderDate(date.date),
    },
    {
      accessor: "createdAt",
      title: "Oluşturulma Tarihi",
      render: (date) => renderDateTime(date.createdAt),
    },
    {
      accessor: "updatedAt",
      title: "Güncellenme Tarihi",
      render: (date) => renderDateTime(date.updatedAt),
    },
  ],
  testResult: [
    {
      accessor: "testName",
      title: "Deneme Sınavı Adı",
    },
    {
      accessor: "studentName",
      title: "Öğrenci Adı",
    },
    {
      accessor: "score",
      title: "Puan",
    },
    {
      accessor: "createdAt",
      title: "Oluşturulma Tarihi",
      render: (date) => renderDateTime(date.createdAt),
    },
    {
      accessor: "updatedAt",
      title: "Güncellenme Tarihi",
      render: (date) => renderDateTime(date.updatedAt),
    },
  ],
};

export const modelToColumnMap = Object.fromEntries(
  Object.entries(modelToColumnMapWithoutDefaults).map(([model, columns]) => [
    model,
    columns.map((column) => ({ ...columnDefaults, ...column })),
  ])
) as Record<RecordModelName, DataTableColumn<any>[]>;
