import { CITIZEN_ID_LENGTH, RECORD_FORM_ICON_SIZE } from "@/constants/index";
import { axiosInstance } from "@/lib/axios-instance";
import { AuthErrorResponse } from "@/types/response";
import { Button, NumberInput, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { Student } from "@prisma/client";
import {
  IconChalkboard,
  IconDeviceFloppy,
  IconIdBadge,
  IconIdBadge2,
  IconLetterCase,
  IconNumber,
} from "@tabler/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import DateTimePicker from "../DateTimePicker";

export type StudentRecordData = Partial<Student>;

export type StudentResponse =
  | { record: Student; success: true }
  | AuthErrorResponse;

export interface StudentRecordFormProps {
  data?: StudentRecordData;
  onSubmit: () => void;
}

export const SCHOOL_NOTIFICATION_ID = "student-record-form";

const StudentRecordForm: React.FC<StudentRecordFormProps> = ({
  data,
  onSubmit,
}) => {
  const form = useForm({
    initialValues: data || {
      id: undefined,
      name: undefined,
      citizenId: undefined,
      classId: undefined,
      code: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    },
    validate: (values) => ({
      citizenId:
        String(values.citizenId).length !== CITIZEN_ID_LENGTH &&
        `TC Kimlik Numarası ${CITIZEN_ID_LENGTH} haneli olmalıdır!`,
    }),
  });
  const mutation = useMutation(["student"], (values: StudentRecordData) =>
    axiosInstance.post<StudentResponse>("/api/records/student", values)
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

    const res = await mutation.mutateAsync({
      ...values,
      citizenId: String(values.citizenId),
    });

    if (res.data.success) {
      form.reset();
      onSubmit();

      updateNotification({
        id: SCHOOL_NOTIFICATION_ID,
        title: "Kayıt Oluşturuldu",
        message: `${res.data.record.name} adlı öğrenci başarıyla oluşturuldu.`,
        color: "green",
        icon: <IconDeviceFloppy size={24} />,
      });

      queryClient.invalidateQueries(["student"]);

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
          label="Öğrenci ID"
          placeholder="32"
          hideControls
          icon={<IconIdBadge2 size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("id")}
        />
        <TextInput
          label="Öğrenci Adı Soyadı"
          placeholder="Ahmet Yılmaz"
          withAsterisk
          required
          icon={<IconLetterCase size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("name")}
        />
        <NumberInput
          label="Öğrenci TC Kimlik Numarası"
          placeholder="12345678901"
          withAsterisk
          required
          hideControls
          icon={<IconIdBadge size={RECORD_FORM_ICON_SIZE} />}
          maxLength={CITIZEN_ID_LENGTH}
          minLength={CITIZEN_ID_LENGTH}
          formatter={(value) => value?.replace(/\D/g, "")}
          {...form.getInputProps("citizenId")}
        />
        <NumberInput
          label="Öğrenci Numarası"
          placeholder="37"
          hideControls
          withAsterisk
          required
          icon={<IconNumber size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("code")}
        />
        <NumberInput
          label="Sınıf ID"
          placeholder="32"
          hideControls
          withAsterisk
          required
          icon={<IconChalkboard size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("classId")}
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

export default StudentRecordForm;
