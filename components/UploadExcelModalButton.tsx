import {
  RecordModelName,
  RecordModelPluralDisplayNames,
} from "@/constants/models";
import { postResultExcel, postStudentExcel } from "@/utils/excel";
import {
  Button,
  FileInput,
  Modal,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { MS_EXCEL_MIME_TYPE } from "@mantine/dropzone";
import { useDisclosure } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
  IconFileAnalytics,
  IconFileDownload,
  IconFileUpload,
  IconUpload,
} from "@tabler/icons";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { APP_DISPLAY_NAME } from "../constants";

const ExcelModels: RecordModelName[] = ["student", "testResult"];

const UPLOAD_NOTIFICATION_ID = "upload-excel-notification";
const AUTO_CLOSE_NOTIFICATION_DURATION = 10_000;

export interface UploadExcelModalButtonProps {
  model: RecordModelName;
}

const UploadExcelModalButton: React.FC<UploadExcelModalButtonProps> = ({
  model,
}) => {
  const theme = useMantineTheme();
  const [opened, { close, open }] = useDisclosure(false);
  const [file, setFile] = useState<File | null>(null);
  const mutation = useMutation(
    [model],
    model === "student" ? postStudentExcel : postResultExcel
  );
  const [hasUploaded, setHasUploaded] = useState(false);

  const excelFileHref = `/example-${model}s.xlsx`;
  const modelDisplayName = RecordModelPluralDisplayNames[model];
  const excelFileDownloadName = `${APP_DISPLAY_NAME} ${modelDisplayName} Örnek Excel.xlsx`;

  useEffect(() => {
    // prevent multiple notifications
    if (hasUploaded && mutation.isSuccess) return;

    if (mutation.isLoading) {
      setHasUploaded(false);

      showNotification({
        id: UPLOAD_NOTIFICATION_ID,
        title: "Excel Yükleniyor",
        message: `${modelDisplayName} için Excel dosyası yükleniyor...`,
        color: "blue",
        loading: true,
        disallowClose: true,
        autoClose: false,
        icon: <IconUpload />,
      });
    } else if (mutation.isSuccess) {
      setHasUploaded(true);

      if (mutation.data.errors.length > 0) {
        const uniqueErrors = Array.from(
          new Set(
            mutation.data.errors.map(
              (e) => e?.error?.message ?? JSON.stringify(e)
            )
          )
        );
        showNotification({
          title: "Excel yüklenirken hatalar oluştu!",
          message: uniqueErrors.map((s) => `👉 ${s}`).join("\n"),
          color: "red",
          icon: <IconFileUpload />,
        });
      }

      const message =
        mutation.data.totalCount === 0
          ? `${modelDisplayName} için Excel dosyası yüklenemedi. Lütfen dosyayı kontrol edin.`
          : mutation.data.fulfilledCount === 0
          ? `Excel dosyasındaki ${mutation.data.totalCount} kayıt arasından hiçbiri oluşturulamadı. Lütfen dosyayı kontrol edin.`
          : mutation.data.fulfilledCount === mutation.data.totalCount
          ? `${modelDisplayName} için Excel dosyası başarıyla yüklendi.`
          : `${modelDisplayName} için Excel dosyası yüklendi. ${mutation.data.fulfilledCount} kayıt oluşturuldu. ${mutation.data.rejectedCount} kayıt oluşturulamadı. Lütfen dosyayı kontrol edin.`;

      updateNotification({
        id: UPLOAD_NOTIFICATION_ID,
        title: "Excel Yükleme Sonlandı!",
        message,
        color: "green",
        loading: false,
        disallowClose: false,
        icon: <IconFileUpload />,
        autoClose: AUTO_CLOSE_NOTIFICATION_DURATION,
      });
    } else if (mutation.isError) {
      setHasUploaded(true);
      updateNotification({
        id: UPLOAD_NOTIFICATION_ID,
        title: "Excel Yüklenemedi!",
        message: [
          `${modelDisplayName} için Excel dosyası yüklenirken bir hata oluştu!`,
          String(mutation.error),
        ],
        color: "red",
        loading: false,
        disallowClose: false,
        icon: <IconFileUpload />,
        autoClose: AUTO_CLOSE_NOTIFICATION_DURATION,
      });
    }
  }, [
    mutation.data,
    mutation.isLoading,
    mutation.isError,
    mutation.isSuccess,
    mutation.error,
    modelDisplayName,
    hasUploaded,
  ]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!file) return;
    await mutation.mutateAsync(file);
    setFile(null);
    if (mutation.isSuccess && mutation.data.fulfilledCount !== 0) close();
  };

  if (!ExcelModels.includes(model)) return null;

  return (
    <>
      <Button rightIcon={<IconFileUpload size={20} />} onClick={open}>
        Excel Yükle
      </Button>
      <Modal
        opened={opened}
        onClose={() => {
          close();
          setFile(null);
        }}
        title={
          <Title order={2}>
            {RecordModelPluralDisplayNames[model]} için Excel Yükle
          </Title>
        }
      >
        <Stack spacing="xl">
          <Stack>
            <Text>
              Yüklenecek Excel tablosunun yapısı aşağıda verilen örnek Excel
              dosyası ile aynı olmalı 👇
            </Text>

            <Button
              component="a"
              href={excelFileHref}
              download={excelFileDownloadName}
              rightIcon={<IconFileDownload size={20} />}
            >
              Örnek Excel Dosyasını İndir
            </Button>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Stack>
              <FileInput
                accept={MS_EXCEL_MIME_TYPE.join(",")}
                icon={<IconFileAnalytics size={20} />}
                label="Excel Dosyası"
                placeholder={`${modelDisplayName} için Excel dosyası seçin`}
                withAsterisk
                value={file}
                onChange={(file) => setFile(file)}
                required
              />

              <Button
                type="submit"
                color={theme.colors.blue[6]}
                variant="outline"
                fullWidth
                rightIcon={!mutation.isLoading && <IconUpload size={20} />}
                loading={mutation.isLoading}
                disabled={mutation.isLoading || !file}
              >
                {!mutation.isLoading && "Yükle"}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Modal>
    </>
  );
};

export default UploadExcelModalButton;
