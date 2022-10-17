import { DatabaseModel } from "@/constants/models";
import { DataGridProps } from "mantine-data-grid";

export const modelToColumnMap: Record<
  DatabaseModel,
  DataGridProps<unknown>["columns"]
> = {
  organization: [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Okul Adı",
    },
    {
      accessorKey: "classCount",
      header: "Şube Sayısı",
    },
    {
      accessorKey: "studentCount",
      header: "Öğrenci Sayısı",
    },
    {
      accessorKey: "createdAt",
      header: "Oluşturulma Tarihi",
    },
    {
      accessorKey: "updatedAt",
      header: "Güncellenme Tarihi",
    },
  ],
  group: [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "grade",
      header: "Sınıf",
    },
    {
      accessorKey: "branch",
      header: "Şube",
    },
    {
      accessorKey: "studentCount",
      header: "Öğrenci Sayısı",
    },
    {
      accessorKey: "createdAt",
      header: "Oluşturulma Tarihi",
    },
    {
      accessorKey: "updatedAt",
      header: "Güncellenme Tarihi",
    },
  ],
  profile: [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Ad",
    },
    {
      accessorKey: "surname",
      header: "Soyad",
    },
    {
      accessorKey: "className",
      header: "Sınıf",
    },
    {
      accessorKey: "code",
      header: "Okul Numarası",
    },
    {
      accessorKey: "createdAt",
      header: "Oluşturulma Tarihi",
    },
    {
      accessorKey: "updatedAt",
      header: "Güncellenme Tarihi",
    },
  ],
  user: [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "citizenId",
      header: "TC Kimlik No",
    },
    {
      accessorKey: "hash",
      header: "Parola Hash",
    },
    {
      accessorKey: "role",
      header: "Kullanıcı Tipi",
    },
    {
      accessorKey: "createdAt",
      header: "Oluşturulma Tarihi",
    },
    {
      accessorKey: "updatedAt",
      header: "Güncellenme Tarihi",
    },
  ],
  test: [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Deneme Sınavı Adı",
    },
    {
      accessorKey: "studentCount",
      header: "Öğrenci Sayısı",
    },
    {
      accessorKey: "schoolCount",
      header: "Okul Sayısı",
    },
    {
      accessorKey: "createdAt",
      header: "Oluşturulma Tarihi",
    },
    {
      accessorKey: "updatedAt",
      header: "Güncellenme Tarihi",
    },
  ],
  testResult: [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "testName",
      header: "Deneme Sınavı Adı",
    },
    {
      accessorKey: "profileName",
      header: "Öğrenci Adı",
    },
    {
      accessorKey: "score",
      header: "Puan",
    },
    {
      accessorKey: "createdAt",
      header: "Oluşturulma Tarihi",
    },
    {
      accessorKey: "updatedAt",
      header: "Güncellenme Tarihi",
    },
  ],
};
