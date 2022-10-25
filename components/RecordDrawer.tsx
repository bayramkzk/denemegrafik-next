import {
  RecordModelName,
  RecordModelPluralDisplayNames,
} from "@/constants/models";
import { Drawer, Title } from "@mantine/core";
import React from "react";
import SchoolRecordForm from "./RecordForm/SchoolRecordForm";

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
      <SchoolRecordForm onSubmit={onClose} />
    </Drawer>
  );
};

export default RecordDrawer;
