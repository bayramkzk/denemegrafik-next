import { RECORD_FORM_ICON_SIZE } from "@/constants/index";
import { axiosInstance } from "@/lib/axios-instance";
import { AuthErrorResponse } from "@/types/response";
import { Button, NumberInput, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { School } from "@prisma/client";
import { IconDeviceFloppy, IconIdBadge2, IconLetterCase } from "@tabler/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import DateTimePicker from "../DateTimePicker";

export type SchoolRecordData = Partial<School>;

export type SchoolResponse =
  | { record: School; success: true }
  | AuthErrorResponse;

export interface SchoolRecordFormProps {
  data?: SchoolRecordData;
  onSubmit: () => void;
}

export const SCHOOL_NOTIFICATION_ID = "school-record-form";

const SchoolRecordForm: React.FC<SchoolRecordFormProps> = ({
  data,
  onSubmit,
}) => {
  const form = useForm({
    initialValues: data || {
      id: undefined,
      name: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    },
  });
  const mutation = useMutation(["school"], (values: SchoolRecordData) =>
    axiosInstance.post<SchoolResponse>("/api/records/school", values)
  );
  const queryClient = useQueryClient();

  const handleSubmit = form.onSubmit(async (values) => {
    showNotification({
      id: SCHOOL_NOTIFICATION_ID,
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
        id: SCHOOL_NOTIFICATION_ID,
        title: "Kayıt Oluşturuldu",
        message: `${res.data.record.name} okulu başarıyla oluşturuldu.`,
        color: "green",
        icon: <IconDeviceFloppy size={24} />,
      });

      queryClient.invalidateQueries(["school"]);

      return;
    }

    const message =
      res.data.error instanceof Array
        ? res.data.error
            .map((error) => `👉 ${error.message}`)
            .map((message) => <Text key={message}>{message}</Text>)
        : res.data.error.message;

    updateNotification({
      id: SCHOOL_NOTIFICATION_ID,
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
          label="Okul ID"
          placeholder="32"
          hideControls
          icon={<IconIdBadge2 size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("id")}
        />
        <TextInput
          label="Okul Adı"
          placeholder="Edirne Süleyman Demirel Fen Lisesi"
          withAsterisk
          required
          icon={<IconLetterCase size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("name")}
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

export default SchoolRecordForm;
