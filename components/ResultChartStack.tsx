import { TestResultWithAverage } from "@/types/test";
import { Alert, Button, Group, Stack, Title } from "@mantine/core";
import { IconPrinter } from "@tabler/icons";
import _ from "lodash";
import dynamic from "next/dynamic";
import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { RECORD_FORM_ICON_SIZE } from "../constants";

const ResultChart = dynamic(() => import("@/components/ResultChart"), {
  ssr: false,
});

export interface ResultGraphStackProps {
  results: TestResultWithAverage[];
}

const ResultChartStack: React.FC<ResultGraphStackProps> = ({ results }) => {
  const printRef = useRef(null);
  const groupedResults = Object.entries(_.groupBy(results, "test.type.name"));

  return (
    <Stack>
      <Stack
        spacing="xl"
        ref={printRef}
        // FIXME: this is a hack to make the chart fit the page
        sx={{ "@media print": { zoom: "70%" } }}
      >
        {groupedResults.map(([testType, testResults]) => (
          <Stack key={testType}>
            <Title order={3} p="md">
              {testType} Deneme Sınavları Sonuçları
            </Title>

            <ResultChart
              key={testType}
              results={testResults as TestResultWithAverage[]}
            />
          </Stack>
        ))}
      </Stack>

      {groupedResults.length > 0 && (
        <Group position="right">
          <ReactToPrint
            trigger={() => (
              <Button rightIcon={<IconPrinter size={RECORD_FORM_ICON_SIZE} />}>
                Grafikleri Yazdır
              </Button>
            )}
            content={() => printRef.current}
            documentTitle="DENEMEGRAFİK Deneme Sınavları Grafikleri"
            pageStyle="@page { size: A4 landscape; }"
          />
        </Group>
      )}

      {groupedResults.length === 0 && (
        <Alert color="orange">Bu öğrenciye ait deneme sonucu bulunamadı.</Alert>
      )}
    </Stack>
  );
};

export default ResultChartStack;
