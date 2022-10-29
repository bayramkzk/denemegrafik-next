import { RECORD_FORM_ICON_SIZE } from "@/constants/index";
import { axiosInstance } from "@/lib/axios-instance";
import { AuthErrorResponse } from "@/types/response";
import {
  Button,
  NumberInput,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { Admin } from "@prisma/client";
import {
  IconDeviceFloppy,
  IconIdBadge2,
  IconLetterCase,
  IconLetterCaseLower,
  IconLock,
  IconSchool,
  IconUserCircle,
} from "@tabler/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import DateTimePicker from "../DateTimePicker";

export type AdminRecordData = Partial<Admin>;

export type AdminResponse =
  | { record: Admin; success: true }
  | AuthErrorResponse;

export interface AdminRecordFormProps {
  data?: AdminRecordData;
  onSubmit: () => void;
}

export const ADMIN_NOTIFICATION_ID = "admin-record-form";

const AdminRecordForm: React.FC<AdminRecordFormProps> = ({
  data,
  onSubmit,
}) => {
  const form = useForm({
    initialValues: data || {
      id: undefined,
      name: undefined,
      username: undefined,
      hash: undefined,
      role: undefined,
      schoolId: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    },
  });
  const mutation = useMutation(["admin"], (values: AdminRecordData) =>
    axiosInstance.post<AdminResponse>("/api/records/admin", values)
  );
  const queryClient = useQueryClient();

  const handleSubmit = form.onSubmit(async (values) => {
    if (!values.hash) return;

    showNotification({
      id: ADMIN_NOTIFICATION_ID,
      title: "Kaydediliyor...",
      message: "Lütfen bekleyin...",
      color: "blue",
      autoClose: false,
      disallowClose: true,
      icon: <IconDeviceFloppy size={20} />,
    });

    const hashResponse = await axiosInstance.post<{ hash: string }>(
      "/api/hash",
      {
        password: values.hash,
      }
    );

    if (hashResponse.status !== 200) {
      updateNotification({
        id: ADMIN_NOTIFICATION_ID,
        title: "Kayıt Oluşturulamadı",
        message: "Şifre oluşturulurken bir hata oluştu.",
        color: "red",
        autoClose: 5000,
        disallowClose: false,
        icon: <IconLock size={20} />,
      });
      return;
    }

    console.log(hashResponse.data.hash, values);

    const res = await mutation.mutateAsync({
      ...values,
      hash: hashResponse.data.hash,
    });

    if (res.data.success) {
      form.reset();
      onSubmit();

      updateNotification({
        id: ADMIN_NOTIFICATION_ID,
        title: "Kayıt Oluşturuldu",
        message: `${res.data.record.name} adlı yönetici başarıyla oluşturuldu.`,
        color: "green",
        icon: <IconDeviceFloppy size={24} />,
      });

      queryClient.invalidateQueries(["admin"]);

      return;
    }

    const message =
      res.data.error instanceof Array
        ? res.data.error
            .map((error) => `👉 ${error.message}`)
            .map((message) => <Text key={message}>{message}</Text>)
        : res.data.error.message;

    updateNotification({
      id: ADMIN_NOTIFICATION_ID,
      title: "Kayıt Oluşturulamadı",
      message,
      color: "red",
      icon: <IconDeviceFloppy size={24} />,
    });
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <NumberInput
          label="Yönetici ID"
          placeholder="32"
          hideControls
          icon={<IconIdBadge2 size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("id")}
        />
        <TextInput
          label="Yönetici Görünen Adı Soyadı"
          placeholder="Ahmet Yılmaz"
          withAsterisk
          required
          icon={<IconLetterCase size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Yönetici Kullanıcı Adı"
          placeholder="ahmetyilmaz"
          withAsterisk
          required
          icon={<IconLetterCaseLower size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("username")}
        />
        <PasswordInput
          label="Yönetici Şifresi"
          placeholder="guvenli_sifre-123"
          withAsterisk
          required
          icon={<IconLock size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("hash")}
        />
        <Select
          label="Yönetici Tipi"
          placeholder="Yönetici"
          data={[
            { value: "ADMIN", label: "Yönetici" },
            { value: "SUPERADMIN", label: "Süper Yönetici" },
          ]}
          required
          withAsterisk
          icon={<IconUserCircle size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("role")}
        />
        <NumberInput
          label="Okul Kodu"
          placeholder="32"
          hideControls
          withAsterisk
          required
          icon={<IconSchool size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("schoolId")}
        />
        <DateTimePicker
          label="Oluşturulma Tarihi"
          placeholder="Ekim 26, 2022"
          value={form.values.createdAt}
          onChange={(value) => form.setFieldValue("createdAt", value)}
        />
        <DateTimePicker
          label="Güncellenme Tarihi"
          placeholder="Ekim 26, 2022"
          value={form.values.updatedAt}
          onChange={(value) => form.setFieldValue("updatedAt", value)}
        />
        <Button
          fullWidth
          color="green"
          type="submit"
          loading={mutation.isLoading}
          rightIcon={
            !mutation.isLoading && (
              <IconDeviceFloppy size={RECORD_FORM_ICON_SIZE} />
            )
          }
        >
          {!mutation.isLoading && "Kaydet"}
        </Button>
      </Stack>
    </form>
  );
};

export default AdminRecordForm;
