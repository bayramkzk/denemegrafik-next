import { RecordModelName } from "@/constants/models";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCirclePlus } from "@tabler/icons";
import React from "react";
import RecordDrawer from "./RecordDrawer";

export interface CreateRecordModalButtonProps {
  model: RecordModelName;
}

const CreateRecordDrawerButton: React.FC<CreateRecordModalButtonProps> = ({
  model,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button
        fullWidth
        color="green"
        onClick={open}
        rightIcon={<IconCirclePlus size={20} />}
      >
        Oluştur
      </Button>

      <RecordDrawer model={model} opened={opened} onClose={close} />
    </>
  );
};

export default CreateRecordDrawerButton;
