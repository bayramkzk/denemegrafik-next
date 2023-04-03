import { TestResultWithAverage } from "@/types/test";
import {
  Alert,
  Button,
  Group,
  Stack,
  Text,
  Title,
  createStyles,
} from "@mantine/core";
import { IconInfoCircle, IconPrinter } from "@tabler/icons";
import _ from "lodash";
import dynamic from "next/dynamic";
import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { RECORD_FORM_ICON_SIZE } from "../constants";
import AppLogo from "./AppLogo";

const ResultChart = dynamic(() => import("@/components/ResultChart"), {
  ssr: false,
});

const useStyles = createStyles({
  graphs: {
    padding: "1rem",
    "@media print": {
      zoom: "80%",
      MozTransform: "scale(0.75)",
      WebkitPrintColorAdjust: "exact",
      colorAdjust: "exact",
      padding: 0,
    },
  },
  header: {
    display: "none",
    "@media print": {
      display: "flex",
      justifyContent: "space-between",
      textAlign: "center",
      fontSize: "1.5rem",
      fontWeight: "bold",
      padding: "1rem",
    },
  },
  logo: {
    display: "none",
    "@media print": { display: "fixed", top: 0, left: 0 },
  },
  average: {
    justifyContent: "end",
    "@media print": { justifyContent: "center" },
  },
  info: { display: "none", "@media print": { display: "block" } },
});

export interface ResultGraphStackProps {
  results: TestResultWithAverage[];
  studentName: string;
}

const ResultChartStack: React.FC<ResultGraphStackProps> = ({
  results,
  studentName,
}) => {
  const { classes } = useStyles();
  const printRef = useRef(null);
  const groupedResults = _.groupBy(results, "test.type.name") as {
    [key: string]: TestResultWithAverage[];
  };
  const studentAverageByTestType = _.mapValues(groupedResults, (testResults) =>
    _.meanBy(testResults, "score")
  );

  return (
    <Stack>
      <Stack ref={printRef} className={classes.graphs}>
        <Group className={classes.header}>
          <AppLogo size={20} className={classes.logo} />
          <Title order={2}>{studentName} Öğrencisinin Deneme Sonuçları</Title>
        </Group>

        {Object.entries(groupedResults).map(([testType, testResults]) => (
          <Stack key={testType}>
            <Title order={3} p="md">
              {testType} Deneme Sınavları Sonuçları
            </Title>

            <ResultChart
              key={testType}
              results={testResults}
              slim={Object.keys(groupedResults).length > 1}
            />

            <Group pr="xl" className={classes.average}>
              <Text>
                Öğrenci {testResults[0].test.type.name} Ortalaması:{" "}
                {studentAverageByTestType[testType].toFixed(2)}
              </Text>
            </Group>
          </Stack>
        ))}

        <Group px="xl" mt="lg" className={classes.info}>
          <Alert
            icon={<IconInfoCircle size={RECORD_FORM_ICON_SIZE} />}
            color="teal"
          >
            Sınav ortalamaları noktalı çizgiler halinde, öğrencinin aldığı
            puanlar ise düz çizgiler halinde gösterilmektedir.
          </Alert>
        </Group>
      </Stack>

      {Object.keys(groupedResults).length > 0 && (
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

      {Object.keys(groupedResults).length === 0 && (
        <Alert color="orange">Bu öğrenciye ait deneme sonucu bulunamadı.</Alert>
      )}
    </Stack>
  );
};

export default ResultChartStack;
