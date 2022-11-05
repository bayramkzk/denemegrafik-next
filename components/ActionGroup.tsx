import { RecordModelName } from "@/constants/models";
import { axiosInstance } from "@/lib/axios-instance";
import { TestResultWithAverage } from "@/types/test";
import { ModelRecord } from "@/utils/record";
import {
  ActionIcon,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { IconChartBar, IconEdit } from "@tabler/icons";
import React from "react";
import { RECORD_FORM_ICON_SIZE } from "../constants";
import RecordDrawer from "./RecordDrawer";
import ResultChartStack from "./ResultChartStack";

export interface ActionGroupProps {
  model: RecordModelName;
  name?: string;
  data: ModelRecord;
  id: string;
}

const ActionGroup: React.FC<ActionGroupProps> = ({ model, data, name, id }) => {
  const [graphModal, setGraphModal] = useSetState({
    open: false,
    results: null as TestResultWithAverage[] | null,
  });
  const [editDrawer, setEditDrawer] = useSetState({ open: false });

  const openGraphModal = async () => {
    setGraphModal({ open: true });
    const res = await axiosInstance.get(`/api/test-results/${id}`);
    setGraphModal({ results: res.data.results });
  };

  const openEditDrawer = async () => {
    setEditDrawer({ open: true });
  };

  const handleEditSubmit = async () => {
    setEditDrawer({ open: false });
  };

  return (
    <>
      <Group position="right" spacing={0} noWrap>
        {model === "student" && (
          <Tooltip label="Öğrenci Deneme Grafiğini Görüntüle">
            <ActionIcon color="green" onClick={openGraphModal}>
              <IconChartBar size={RECORD_FORM_ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
        )}

        <Tooltip label="Kaydı Düzenle">
          <ActionIcon color="blue" onClick={openEditDrawer}>
            <IconEdit size={RECORD_FORM_ICON_SIZE} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Modal
        opened={graphModal.open}
        onClose={() => setGraphModal({ open: false })}
        title={<Title order={2}>Öğrenci Deneme Grafiği</Title>}
        size={1500}
      >
        <Stack>
          <Text>
            {name} adlı öğrenci için deneme sonuçlarının grafikleri aşağıdaki
            gibidir:
          </Text>

          {graphModal?.results ? (
            <ResultChartStack results={graphModal.results} />
          ) : (
            <Loader width="100%" my="xl" />
          )}
        </Stack>
      </Modal>

      <RecordDrawer
        model={model}
        opened={editDrawer.open}
        onClose={() => setEditDrawer({ open: false })}
        edit={{ id, data, onSubmit: handleEditSubmit }}
      />
    </>
  );
};

export default ActionGroup;
