import { RECORD_FORM_ICON_SIZE } from "@/constants/index";
import { axiosInstance } from "@/lib/axios-instance";
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
  data?: ClassRecordData;
  onSubmit: () => void;
}

export const ADMIN_NOTIFICATION_ID = "school-record-form";

const ClassRecordForm: React.FC<ClassRecordFormProps> = ({
  data,
  onSubmit,
}) => {
  const form = useForm({
    initialValues: data || {
      id: undefined,
      grade: undefined,
      branch: undefined,
      schoolId: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    },
  });
  const mutation = useMutation(["class"], (values: ClassRecordData) =>
    axiosInstance.post<ClassResponse>("/api/records/class", values)
  );
  const queryClient = useQueryClient();

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
      onSubmit();

      updateNotification({
        id: ADMIN_NOTIFICATION_ID,
        title: "Kayıt Oluşturuldu",
        message: `${stringifyClass(
          res.data.record
        )} sınıfı başarıyla oluşturuldu.`,
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
            required
            {...form.getInputProps("grade")}
          />
          <TextInput
            label="Şube"
            placeholder="A"
            icon={<IconLetterA size={RECORD_FORM_ICON_SIZE} />}
            withAsterisk
            required
            {...form.getInputProps("branch")}
          />
        </Group>
        <NumberInput
          label="Okul ID"
          placeholder="32"
          hideControls
          icon={<IconIdBadge2 size={RECORD_FORM_ICON_SIZE} />}
          withAsterisk
          required
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
