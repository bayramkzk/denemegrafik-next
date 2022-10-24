import {
  RecordModelName,
  RecordModelPluralDisplayNames,
} from "@/constants/models";
import {
  Button,
  FileInput,
  Modal,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconFileAnalytics,
  IconFileDownload,
  IconFileUpload,
} from "@tabler/icons";
import React from "react";
import { APP_DISPLAY_NAME } from "../constants";

const ExcelModels: RecordModelName[] = ["student", "testResult"];

export interface UploadExcelModalButtonProps {
  model: RecordModelName;
}

const UploadExcelModalButton: React.FC<UploadExcelModalButtonProps> = ({
  model,
}) => {
  const theme = useMantineTheme();
  const [opened, { close, open }] = useDisclosure(false);
  const excelFileHref = `/example-${model}s.xlsx`;
  const modelDisplayName = RecordModelPluralDisplayNames[model];
  const excelFileDownloadName = `${APP_DISPLAY_NAME} ${modelDisplayName} Örnek Excel.xlsx`;

  if (!ExcelModels.includes(model)) return null;

  return (
    <>
      <Button rightIcon={<IconFileUpload size={20} />} onClick={open}>
        Excel Yükle
      </Button>
      <Modal
        opened={opened}
        onClose={close}
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

          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Stack>
              <FileInput
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                icon={<IconFileAnalytics size={20} />}
                label="Excel Dosyası"
                placeholder={`${modelDisplayName} için Excel dosyası seçin`}
              />

              <Button
                type="submit"
                color={theme.colors.blue[6]}
                variant="outline"
                fullWidth
                rightIcon={<IconFileUpload size={20} />}
              >
                Yükle
              </Button>
            </Stack>
          </form>
        </Stack>
      </Modal>
    </>
  );
};

export default UploadExcelModalButton;
