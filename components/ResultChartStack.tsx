import { TestResultWithAverage } from "@/types/test";
import { Alert, Button, Group, Stack, Text, Title } from "@mantine/core";
import { IconPrinter } from "@tabler/icons";
import _ from "lodash";
import dynamic from "next/dynamic";
import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { RECORD_FORM_ICON_SIZE } from "../constants";
import AppLogo from "./AppLogo";

const ResultChart = dynamic(() => import("@/components/ResultChart"), {
  ssr: false,
});

export interface ResultGraphStackProps {
  results: TestResultWithAverage[];
  studentName: string;
}

const ResultChartStack: React.FC<ResultGraphStackProps> = ({
  results,
  studentName,
}) => {
  const printRef = useRef(null);
  const groupedResults = Object.entries(_.groupBy(results, "test.type.name"));
  const totalAverage = _.meanBy(results, "score");

  return (
    <Stack>
      <Stack
        spacing="xl"
        ref={printRef}
        // FIXME: this is a hack to make the chart fit the page
        sx={{ "@media print": { zoom: "60%" } }}
      >
        <Group
          sx={{
            display: "none",
            "@media print": {
              display: "flex",
              justifyContent: "space-between",
              textAlign: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
              padding: "1rem",
            },
          }}
        >
          <AppLogo
            size={20}
            sx={{
              display: "none",
              "@media print": { display: "fixed", top: 0, left: 0 },
            }}
          />
          <Title order={2}>{studentName} Öğrencisinin Deneme Sonuçları</Title>
        </Group>

        {groupedResults.map(([testType, testResults]) => (
          <Stack key={testType}>
            <Title order={3} p="md">
              {testType} Deneme Sınavları Sonuçları
            </Title>

            <ResultChart
              key={testType}
              results={testResults as TestResultWithAverage[]}
              slim={groupedResults.length > 1}
            />

            <Group position="right">
              <Text>
                Öğrenci {testResults[0].test.type.name} Ortalaması:{" "}
                {totalAverage.toFixed(2)}
              </Text>
            </Group>
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
            pageStyle="@page { size: A4 landscape; margin: 0; }"
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
