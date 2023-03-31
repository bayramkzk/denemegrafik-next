import { RECORD_FORM_ICON_SIZE } from "@/constants/index";
import { axiosInstance } from "@/lib/axios-instance";
import { RecordDrawerEditProps } from "@/types/edit";
import { AuthErrorResponse } from "@/types/response";
import {
  Button,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { Test, TestType } from "@prisma/client";
import {
  IconCalendarTime,
  IconDeviceFloppy,
  IconIdBadge2,
  IconLetterCase,
  IconPencil,
} from "@tabler/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import DateTimePicker from "../DateTimePicker";

export type TestRecordData = Partial<Test>;

export type TestResponse = { record: Test; success: true } | AuthErrorResponse;

export interface TestRecordFormProps {
  edit?: RecordDrawerEditProps;
}

export const TEST_NOTIFICATION_ID = "test-record-form";

const TestRecordForm: React.FC<TestRecordFormProps> = ({ edit }) => {
  const form = useForm({
    initialValues: {
      id: edit?.data?.id,
      name: edit?.data?.name,
      typeName: edit?.data?.typeName,
      date: new Date((edit?.data?.date as string) || new Date()),
      createdAt: new Date((edit?.data?.createdAt as string) || Date.now()),
      updatedAt: new Date((edit?.data?.updatedAt as string) || Date.now()),
    } as {
      id?: number;
      name?: string;
      typeName?: string;
      date?: Date;
      createdAt?: Date;
      updatedAt?: Date;
    },
    validate: (values) => ({
      date: !values.date && "Lütfen bir tarih seçin",
    }),
  });
  const { data: testTypes } = useQuery(["testType"], () =>
    axiosInstance.get<TestType[]>("/api/test-types").then((res) => res.data)
  );
  const testTypeData = testTypes
    ? testTypes.map((testType) => ({
        label: testType.description || undefined,
        value: testType.name,
      }))
    : [];
  const mutation = useMutation(["test"], (values: TestRecordData) =>
    axiosInstance.request<TestResponse>({
      method: edit ? "PATCH" : "POST",
      url: "/api/records/test" + (edit ? `/${edit.data.id}` : ""),
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
      id: TEST_NOTIFICATION_ID,
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
        id: TEST_NOTIFICATION_ID,
        title: "Kayıt " + (edit ? "Düzenlendi" : "Oluşturuldu"),
        message: `${res.data.record.name} denemesi başarıyla ${
          edit ? "düzenlendi" : "oluşturuldu"
        }.`,
        color: "green",
        icon: <IconDeviceFloppy size={24} />,
      });

      queryClient.invalidateQueries(["test"]);

      return;
    }

    const message =
      res.data.error instanceof Array
        ? res.data.error
            .map((error) => `👉 ${error.message}`)
            .map((message) => <Text key={message}>{message}</Text>)
        : res.data?.error?.message || "Bilinmeyen bir hata oluştu";

    updateNotification({
      id: TEST_NOTIFICATION_ID,
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
          icon={<IconIdBadge2 size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("id")}
        />
        <TextInput
          label="Deneme Adı"
          placeholder="ÇAP TYT 1"
          withAsterisk={!edit}
          required={!edit}
          icon={<IconLetterCase size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("name")}
        />
        <Select
          label="Deneme Türü"
          placeholder="TYT Denemesi"
          data={testTypeData}
          icon={<IconPencil size={RECORD_FORM_ICON_SIZE} />}
          {...form.getInputProps("typeName")}
        />
        <DatePicker
          label="Deneme Tarihi"
          placeholder="Ekim 5, 2022"
          withAsterisk={!edit}
          required={!edit}
          icon={<IconCalendarTime size={RECORD_FORM_ICON_SIZE} />}
          value={form.values.date}
          onChange={(value) => form.setFieldValue("date", value || undefined)}
        />
        <DateTimePicker
          label="Oluşturulma Tarihi"
          placeholder="Ekim 26, 2022"
          value={form.values.createdAt}
          onChange={(value) =>
            form.setFieldValue("createdAt", value || undefined)
          }
        />
        <DateTimePicker
          label="Güncellenme Tarihi"
          placeholder="Ekim 26, 2022"
          value={form.values.updatedAt}
          onChange={(value) =>
            form.setFieldValue("updatedAt", value || undefined)
          }
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

export default TestRecordForm;
