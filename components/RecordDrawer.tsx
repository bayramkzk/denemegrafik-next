import {
  RecordModelName,
  RecordModelPluralDisplayNames,
} from "@/constants/models";
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
  React.FC<{ onSubmit: () => void }>
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
}

const RecordDrawer: React.FC<RecordDrawerProps> = ({
  model,
  opened,
  onClose,
}) => {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Title order={2}>
          {RecordModelPluralDisplayNames[model]} için Kayıt Oluştur
        </Title>
      }
      padding="xl"
      size="xl"
    >
      {RecordFormMap[model]({ onSubmit: onClose })}
    </Drawer>
  );
};

export default RecordDrawer;
