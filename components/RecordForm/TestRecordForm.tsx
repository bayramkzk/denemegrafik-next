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
import { Test } from "@prisma/client";
import {
  IconCalendarTime,
  IconDeviceFloppy,
  IconIdBadge2,
  IconLetterCase,
  IconPencil,
  IconSchool,
} from "@tabler/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import DateTimePicker from "../DateTimePicker";
import type { TestOptions } from "@/pages/api/test-options";
import { useSession } from "next-auth/react";
import { AdminUser } from "@/types/auth";

export type TestRecordData = Partial<Test>;

export type TestResponse = { record: Test; success: true } | AuthErrorResponse;

export interface TestRecordFormProps {
  edit?: RecordDrawerEditProps;
}

export const TEST_NOTIFICATION_ID = "test-record-form";

const TestRecordForm: React.FC<TestRecordFormProps> = ({ edit }) => {
  const { data: session } = useSession();
  const userSchoolId = (session?.user as AdminUser)?.schoolId.toString();
  const form = useForm({
    initialValues: {
      id: edit?.data?.id,
      name: edit?.data?.name,
      typeName: edit?.data?.typeName,
      schoolId: edit?.data?.schoolId || userSchoolId,
      date: new Date((edit?.data?.date as string) || new Date()),
      createdAt: new Date((edit?.data?.createdAt as string) || Date.now()),
      updatedAt: new Date((edit?.data?.updatedAt as string) || Date.now()),
    } as {
      id?: number;
      name?: string;
      typeName?: string;
      schoolId?: number;
      date?: Date;
      createdAt?: Date;
      updatedAt?: Date;
    },
    validate: (values) => ({
      date: !values.date && "Lütfen bir tarih seçin",
    }),
  });
  console.log(edit?.data, userSchoolId, form.values.schoolId);

  const { data: testOptions } = useQuery(["testOptions"], () =>
    axiosInstance.get<TestOptions>("/api/test-options").then((res) => res.data)
  );
  const testSchoolData =
    testOptions?.schools.map((school) => ({
      label: school.name || undefined,
      value: school.id.toString(),
    })) || [];
  const testTypeData =
    testOptions?.types.map((testType) => ({
      label: testType.description || undefined,
      value: testType.name,
    })) || [];
  const mutation = useMutation(["test"], (values: TestRecordData) => {
    const intSchoolId = Number.parseInt(values.schoolId as unknown as string);
    return axiosInstance.request<TestResponse>({
      method: edit ? "PATCH" : "POST",
      url: "/api/records/test" + (edit ? `/${edit.data.id}` : ""),
      data: { ...values, schoolId: intSchoolId },
    });
  });
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
        <Select
          label="Uygulanan Okul"
          placeholder="Edirne Süleyman Demirel Fen Lisesi"
          data={testSchoolData}
          icon={<IconSchool size={RECORD_FORM_ICON_SIZE} />}
          readOnly={session?.user.role !== "SUPERADMIN"}
          {...form.getInputProps("schoolId")}
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
