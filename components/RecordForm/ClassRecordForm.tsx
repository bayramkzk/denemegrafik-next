import { RECORD_FORM_ICON_SIZE } from "@/constants/index";
import { axiosInstance } from "@/lib/axios-instance";
import { RecordDrawerEditProps } from "@/types/edit";
import { AuthErrorResponse } from "@/types/response";
import { stringifyClass } from "@/utils/user";
import {
  Button,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { Class } from "@prisma/client";
import {
  IconDeviceFloppy,
  IconIdBadge2,
  IconLetterA,
  IconSchool,
} from "@tabler/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import DateTimePicker from "../DateTimePicker";

export type ClassRecordData = Partial<Class>;

export type ClassResponse =
  | { record: Class; success: true }
  | AuthErrorResponse;

export interface ClassRecordFormProps {
  edit?: RecordDrawerEditProps;
}

export const ADMIN_NOTIFICATION_ID = "school-record-form";

const ClassRecordForm: React.FC<ClassRecordFormProps> = ({ edit }) => {
  const form = useForm({
    initialValues: {
      id: undefined,
      grade: undefined,
      branch: undefined,
      schoolId: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      ...edit?.data,
    } as {
      id?: number;
      grade?: number;
      branch?: string;
      schoolId?: number;
      createdAt?: Date;
      updatedAt?: Date;
    },
  });
  const mutation = useMutation(["class"], (values: ClassRecordData) =>
    axiosInstance.request<ClassResponse>({
      method: edit ? "PATCH" : "POST",
      url: "/api/records/class" + (edit ? `/${edit.data.id}` : ""),
      data: values,
    })
  );
  const queryClient = useQueryClient();
  const lastEdit = React.useRef(edit);

  React.useEffect(() => {
    if (edit && lastEdit.current !== edit) {
      form.setValues(edit.data);
      lastEdit.current = edit;
    }
  }, [edit, form]);

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

    const res = await mutation.mutateAsync(values);

    if (res.data.success) {
      form.reset();
      await edit?.onSubmit(res.data);

      updateNotification({
        id: ADMIN_NOTIFICATION_ID,
        title: "Kayıt " + (edit ? "Düzenlendi" : "Oluşturuldu"),
        message: `${stringifyClass(res.data.record)} sınıfı başarıyla ${
          edit ? "düzenlendi" : "oluşturuldu"
        }.`,
        color: "green",
        icon: <IconDeviceFloppy size={24} />,
      });

      queryClient.invalidateQueries(["class"]);

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
          label="Sınıf ID"
          placeholder="32"
          hideControls
          icon={<IconIdBadge2 size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("id")}
        />
        <Group grow>
          <NumberInput
            label="Sınıf"
            placeholder="12"
            hideControls
            icon={<IconSchool size={RECORD_FORM_ICON_SIZE} />}
            withAsterisk
            required={!edit}
            {...form.getInputProps("grade")}
          />
          <TextInput
            label="Şube"
            placeholder="A"
            icon={<IconLetterA size={RECORD_FORM_ICON_SIZE} />}
            withAsterisk
            required={!edit}
            {...form.getInputProps("branch")}
          />
        </Group>
        <NumberInput
          label="Okul Kodu"
          placeholder="32"
          hideControls
          icon={<IconIdBadge2 size={RECORD_FORM_ICON_SIZE} />}
          withAsterisk={!edit}
          required={!edit}
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

export default ClassRecordForm;
