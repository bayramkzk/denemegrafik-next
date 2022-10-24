import { RecordModelName } from "@/constants/models";
import { ModelRecord } from "@/utils/record";
import { Button } from "@mantine/core";
import { IconTrash } from "@tabler/icons";
import React from "react";

export interface DeleteModalButtonProps {
  model: RecordModelName;
  records: ModelRecord[];
}

const DeleteRecordModalButton: React.FC<DeleteModalButtonProps> = ({
  records,
}) => {
  return (
    <Button
      rightIcon={<IconTrash size={16} />}
      color="red"
      disabled={records.length === 0}
      sx={{ transition: "all 0.2s ease" }}
      fullWidth
    >
      Kaldır
    </Button>
  );
};

export default DeleteRecordModalButton;
