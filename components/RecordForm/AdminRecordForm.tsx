import { RECORD_FORM_ICON_SIZE } from "@/constants/index";
import { axiosInstance } from "@/lib/axios-instance";
import { RecordDrawerEditProps } from "@/types/edit";
import { AuthErrorResponse } from "@/types/response";
import { roleDisplayNameMap } from "@/utils/role";
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
import { Admin, Role } from "@prisma/client";
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
  edit?: RecordDrawerEditProps;
}

export const ADMIN_NOTIFICATION_ID = "admin-record-form";

const AdminRecordForm: React.FC<AdminRecordFormProps> = ({ edit }) => {
  const form = useForm({
    initialValues: {
      id: undefined,
      name: undefined,
      username: undefined,
      role: undefined,
      schoolId: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      ...edit?.data,
      hash: undefined,
    } as {
      id?: number;
      name?: string;
      username?: string;
      hash?: string;
      role?: Role;
      schoolId?: number;
      createdAt?: Date;
      updatedAt?: Date;
    },
  });
  const mutation = useMutation(["admin"], (values: AdminRecordData) =>
    axiosInstance.request<AdminResponse>({
      method: edit ? "PATCH" : "POST",
      url: "/api/records/admin" + (edit ? `/${edit.data.id}` : ""),
      data: values,
    })
  );
  const queryClient = useQueryClient();
  const lastEdit = React.useRef(edit);

  React.useEffect(() => {
    if (edit && lastEdit.current !== edit) {
      form.setValues({ ...edit.data, hash: undefined });
      lastEdit.current = edit;
    }
  }, [edit, form]);

  const queryHash = async (hash: string | undefined) => {
    if (!hash) return;

    const hashResponse = await axiosInstance.post<{ hash: string }>(
      "/api/hash",
      { password: hash }
    );

    if (hashResponse.status !== 200) {
      updateNotification({
        id: ADMIN_NOTIFICATION_ID,
        title: "Kayıt " + (edit ? "Düzenlenemedi" : "Oluşturulamadı"),
        message: "Şifre oluşturulurken bir hata oluştu.",
        color: "red",
        autoClose: 5000,
        disallowClose: false,
        icon: <IconLock size={20} />,
      });
      throw new Error("Hash error");
    }

    return hashResponse.data.hash;
  };

  const handleSubmit = form.onSubmit(async (values) => {
    showNotification({
      id: ADMIN_NOTIFICATION_ID,
      title: "Kaydediliyor...",
      message: "Lütfen bekleyin...",
      color: "blue",
      autoClose: false,
      disallowClose: true,
      icon: <IconDeviceFloppy size={20} />,
    });

    const hash = await queryHash(values.hash);
    const res = await mutation.mutateAsync({ ...values, hash });

    if (res.data.success) {
      form.reset();
      await edit?.onSubmit(res.data);

      updateNotification({
        id: ADMIN_NOTIFICATION_ID,
        title: "Kayıt " + (edit ? "Düzenlendi" : "Oluşturuldu"),
        message: `${res.data.record.name} adlı yönetici başarıyla ${
          edit ? "düzenlendi" : "oluşturuldu"
        }.`,
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
        : res.data?.error?.message || "Bilinmeyen bir hata oluştu";

    updateNotification({
      id: ADMIN_NOTIFICATION_ID,
      title: "Kayıt " + (edit ? "Düzenlenemedi" : "Oluşturulamadı"),
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
          withAsterisk={!edit}
          required={!edit}
          icon={<IconLetterCase size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Yönetici Kullanıcı Adı"
          placeholder="ahmetyilmaz"
          withAsterisk={!edit}
          required={!edit}
          icon={<IconLetterCaseLower size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("username")}
        />
        <PasswordInput
          label="Yönetici Şifresi"
          placeholder="guvenli_sifre-123"
          withAsterisk={!edit}
          required={!edit}
          icon={<IconLock size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("hash")}
        />
        <Select
          label="Yönetici Tipi"
          placeholder="Yönetici"
          data={Object.entries(roleDisplayNameMap)
            .filter(([key]) => key !== "STUDENT")
            .map(([value, label]) => ({
              value,
              label,
            }))}
          required={!edit}
          withAsterisk={!edit}
          icon={<IconUserCircle size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("role")}
        />
        <NumberInput
          label="Okul Kodu"
          placeholder="32"
          hideControls
          withAsterisk={!edit}
          required={!edit}
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
