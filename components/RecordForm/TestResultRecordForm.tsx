import { RECORD_FORM_ICON_SIZE } from "@/constants/index";
import { axiosInstance } from "@/lib/axios-instance";
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
  data?: TestResultRecordData;
  onSubmit: () => void;
}

export const SCHOOL_NOTIFICATION_ID = "testResult-record-form";

const TestResultRecordForm: React.FC<TestResultRecordFormProps> = ({
  data,
  onSubmit,
}) => {
  const form = useForm({
    initialValues: data || {
      testId: undefined,
      studentId: undefined,
      score: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    },
  });
  const mutation = useMutation(["testResult"], (values: TestResultRecordData) =>
    axiosInstance.post<TestResultResponse>("/api/records/testResult", values)
  );
  const queryClient = useQueryClient();

  // TODO: clean form state between multiple forms

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
        message: `${res.data.record.score} puanlı deneme sonucu başarıyla eklendi.`,
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
          label="Deneme ID"
          placeholder="32"
          hideControls
          required
          withAsterisk
          icon={<IconIdBadge2 size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("testId")}
        />
        <NumberInput
          label="Öğrenci ID"
          placeholder="32"
          hideControls
          required
          withAsterisk
          icon={<IconIdBadge2 size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("studentId")}
        />
        <NumberInput
          label="Puan"
          placeholder="356.93"
          hideControls
          required
          withAsterisk
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
