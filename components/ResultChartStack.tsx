import { TestResultWithAverage } from "@/types/test";
import { Alert, Stack, Title } from "@mantine/core";
import _ from "lodash";
import dynamic from "next/dynamic";
import React from "react";

const ResultChart = dynamic(() => import("@/components/ResultChart"), {
  ssr: false,
});

export interface ResultGraphStackProps {
  results: TestResultWithAverage[];
}

const ResultChartStack: React.FC<ResultGraphStackProps> = ({ results }) => {
  const groupedResults = Object.entries(_.groupBy(results, "test.type.name"));

  return (
    <Stack spacing="xl">
      {groupedResults.map(([testType, testResults]) => (
        <>
          <Title order={3}>{testType} Deneme Sınavları Sonuçları</Title>

          <ResultChart
            key={testType}
            results={testResults as TestResultWithAverage[]}
          />
        </>
      ))}

      {groupedResults.length === 0 && (
        <Alert color="orange">Bu öğrenciye ait deneme sonucu bulunamadı.</Alert>
      )}
    </Stack>
  );
};

export default ResultChartStack;
