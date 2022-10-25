import {
  RecordModelName,
  RecordModelPluralDisplayNames,
} from "@/constants/models";
import { deleteRecords } from "@/utils/delete";
import { ModelRecord } from "@/utils/record";
import { Button, Group, Modal, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

const DELETE_RECORD_NOTIFICATION_ID = "delete-record-notification";

export interface DeleteModalButtonProps {
  model: RecordModelName;
  records: ModelRecord[];
}

const DeleteRecordModalButton: React.FC<DeleteModalButtonProps> = ({
  model,
  records,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();
  const mutation = useMutation([model], deleteRecords);

  const handleDelete = async () => {
    showNotification({
      id: DELETE_RECORD_NOTIFICATION_ID,
      title: "Kayıtlar Siliniyor",
      message: "Lütfen bekleyin...",
      color: "orange",
      icon: <IconTrash />,
      loading: true,
      disallowClose: true,
      autoClose: false,
    });

    const res = await mutation.mutateAsync({ records, model });

    if (res.status !== 200) {
      updateNotification({
        id: DELETE_RECORD_NOTIFICATION_ID,
        title: "Kayıtlar Silinirken Hata Oluştu",
        message:
          res.data?.error?.message ||
          (res.data ? JSON.stringify(res.data) : "Bilinmeyen bir hata oluştu"),
        color: "red",
        icon: <IconTrash />,
        loading: false,
        disallowClose: false,
        autoClose: true,
      });
    }

    if (res.status === 200) {
      updateNotification({
        id: DELETE_RECORD_NOTIFICATION_ID,
        title: "Kayıtlar Silindi",
        message: "Kayıtlar başarıyla silindi.",
        color: "green",
        icon: <IconTrash />,
        loading: false,
        disallowClose: false,
        autoClose: true,
      });
    }

    queryClient.invalidateQueries([model]);

    close();
  };

  return (
    <>
      <Button
        rightIcon={<IconTrash size={16} />}
        color="red"
        disabled={records.length === 0}
        sx={{ transition: "all 0.2s ease" }}
        fullWidth
        onClick={open}
      >
        Kaldır
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        title={
          <Title order={3}>
            {RecordModelPluralDisplayNames[model]} içinden {records.length} adet
            kayıt kaldırılacak
          </Title>
        }
      >
        <Stack>
          <Text>
            Bu işlem geri alınamaz. Bu kayıtları kaldırmak istediğinize emin
            misiniz?
          </Text>

          <Group grow>
            <Button color="red" fullWidth onClick={handleDelete}>
              Kaldır
            </Button>

            <Button color="gray" fullWidth onClick={close}>
              İptal
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default DeleteRecordModalButton;
