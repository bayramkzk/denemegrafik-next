import { CITIZEN_ID_LENGTH, RECORD_FORM_ICON_SIZE } from "@/constants/index";
import { axiosInstance } from "@/lib/axios-instance";
import { RecordDrawerEditProps } from "@/types/edit";
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
  edit?: RecordDrawerEditProps;
}

export const STUDENT_NOTIFICATION_ID = "student-record-form";

const StudentRecordForm: React.FC<StudentRecordFormProps> = ({ edit }) => {
  const form = useForm({
    initialValues: {
      id: undefined,
      name: undefined,
      citizenId: undefined,
      classId: undefined,
      code: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      ...edit?.data,
    } as {
      id?: number;
      name?: string;
      citizenId?: string;
      classId?: number;
      code?: number;
      createdAt?: Date;
      updatedAt?: Date;
    },
    validate: (values) => ({
      citizenId:
        String(values.citizenId).length !== CITIZEN_ID_LENGTH
          ? `TC Kimlik Numarası ${CITIZEN_ID_LENGTH} haneli olmalıdır!`
          : /\D/.test(String(values.citizenId))
          ? "TC Kimlik Numarası sadece rakamlardan oluşmalıdır!"
          : undefined,
    }),
  });
  const mutation = useMutation(["student"], (values: StudentRecordData) =>
    axiosInstance.request<StudentResponse>({
      method: edit ? "PATCH" : "POST",
      url: "/api/records/student" + (edit ? `/${edit.data.id}` : ""),
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
      id: STUDENT_NOTIFICATION_ID,
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
      await edit?.onSubmit(res.data);

      updateNotification({
        id: STUDENT_NOTIFICATION_ID,
        title: "Kayıt " + (edit ? "Düzenlendi" : "Oluşturuldu"),
        message: `${res.data.record.name} adlı öğrenci başarıyla ${
          edit ? "düzenlendi" : "oluşturuldu"
        }.`,
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
      id: STUDENT_NOTIFICATION_ID,
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
        <TextInput
          label="Öğrenci TC Kimlik Numarası"
          placeholder="12345678901"
          withAsterisk
          required
          icon={<IconIdBadge size={RECORD_FORM_ICON_SIZE} />}
          maxLength={CITIZEN_ID_LENGTH}
          minLength={CITIZEN_ID_LENGTH}
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
