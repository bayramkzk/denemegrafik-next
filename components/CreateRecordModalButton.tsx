import { RecordModelName } from "@/constants/models";
import { Button } from "@mantine/core";
import React from "react";

export interface CreateRecordModalButtonProps {
  model: RecordModelName;
}

const CreateRecordModalButton: React.FC<CreateRecordModalButtonProps> = () => {
  return (
    <Button fullWidth color="green">
      Oluştur
    </Button>
  );
};

export default CreateRecordModalButton;
