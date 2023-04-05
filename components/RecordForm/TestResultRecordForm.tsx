import { RECORD_FORM_ICON_SIZE } from "@/constants/index";
import { axiosInstance } from "@/lib/axios-instance";
import { RecordDrawerEditProps } from "@/types/edit";
import { AuthErrorResponse } from "@/types/response";
import { Button, NumberInput, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { TestResult } from "@prisma/client";
import { IconDeviceFloppy, IconIdBadge2, IconStar } from "@tabler/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import DateTimePicker from "../DateTimePicker";

export type TestResultRecordData = Partial<TestResult>;

export type TestResultResponse =
  | { record: TestResult; success: true }
  | AuthErrorResponse;

export interface TestResultRecordFormProps {
  edit?: RecordDrawerEditProps;
}

export const TEST_RESULT_NOTIFICATION_ID = "testResult-record-form";

const TestResultRecordForm: React.FC<TestResultRecordFormProps> = ({
  edit,
}) => {
  const form = useForm({
    initialValues: {
      testId: undefined,
      studentId: undefined,
      score: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      ...edit?.data,
    } as {
      testId?: number;
      studentId?: number;
      score?: number;
      createdAt?: Date;
      updatedAt?: Date;
    },
  });
  const mutation = useMutation(["testResult"], (values: TestResultRecordData) =>
    axiosInstance.request<TestResultResponse>({
      method: edit ? "PATCH" : "POST",
      url: "/api/records/testResult" + (edit ? `/${edit.data.id}` : ""),
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
      id: TEST_RESULT_NOTIFICATION_ID,
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

      console.log(res.data.record);

      updateNotification({
        id: TEST_RESULT_NOTIFICATION_ID,
        title: "Kayıt " + (edit ? "Düzenlendi" : "Oluşturuldu"),
        message: `${res.data.record.score} puanlı deneme sonucu başarıyla ${
          edit ? "düzenlendi" : "oluşturuldu"
        }.`,
        color: "green",
        icon: <IconDeviceFloppy size={24} />,
      });

      queryClient.invalidateQueries(["testResult"]);

      return;
    }

    const message =
      res.data.error instanceof Array
        ? res.data.error
            .map((error) => `👉 ${error.message}`)
            .map((message) => <Text key={message}>{message}</Text>)
        : res.data?.error?.message || "Bilinmeyen bir hata oluştu";

    updateNotification({
      id: TEST_RESULT_NOTIFICATION_ID,
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
          label="Deneme ID"
          placeholder="32"
          hideControls
          required={!edit}
          withAsterisk={!edit}
          icon={<IconIdBadge2 size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("testId")}
        />
        <NumberInput
          label="Öğrenci ID"
          placeholder="32"
          hideControls
          required={!edit}
          withAsterisk={!edit}
          icon={<IconIdBadge2 size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("studentId")}
        />
        <NumberInput
          label="Puan"
          placeholder="356.93"
          hideControls
          required={!edit}
          withAsterisk={!edit}
          icon={<IconStar size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("score")}
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

export default TestResultRecordForm;
