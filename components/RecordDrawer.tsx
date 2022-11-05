import {
  RecordModelName,
  RecordModelPluralDisplayNames,
} from "@/constants/models";
import { RecordDrawerEditProps } from "@/types/edit";
import { Drawer, Title } from "@mantine/core";
import React from "react";
import AdminRecordForm from "./RecordForm/AdminRecordForm";
import ClassRecordForm from "./RecordForm/ClassRecordForm";
import SchoolRecordForm from "./RecordForm/SchoolRecordForm";
import StudentRecordForm from "./RecordForm/StudentRecordForm";
import TestRecordForm from "./RecordForm/TestRecordForm";
import TestResultRecordForm from "./RecordForm/TestResultRecordForm";

const RecordFormMap: Record<
  RecordModelName,
  React.FC<{ edit?: RecordDrawerEditProps }>
> = {
  school: SchoolRecordForm,
  class: ClassRecordForm,
  student: StudentRecordForm,
  admin: AdminRecordForm,
  test: TestRecordForm,
  testResult: TestResultRecordForm,
};

export interface RecordDrawerProps {
  model: RecordModelName;
  opened: boolean;
  onClose: () => void;
  edit?: RecordDrawerEditProps;
}

const RecordDrawer: React.FC<RecordDrawerProps> = ({
  model,
  opened,
  onClose,
  edit,
}) => {
  const RecordForm = RecordFormMap[model];

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Title order={2}>
          {RecordModelPluralDisplayNames[model]}{" "}
          {edit === null ? "için Kayıt Oluştur" : "içinden Kayıt Düzenle"}
        </Title>
      }
      padding="xl"
      size="xl"
    >
      <RecordForm edit={edit} />
    </Drawer>
  );
};

export default RecordDrawer;
