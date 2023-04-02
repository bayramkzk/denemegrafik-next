import { useChartSize, useChartTheme } from "@/hooks/use-chart-theme";
import {
  AVERAGE_SCORE_FIELD,
  STUDENT_SCORE_FIELD,
  TEST_DATE_FIELD,
  TEST_NAME_FIELD,
  useResultChartData,
} from "@/hooks/use-result-chart-data";
import { TestResultWithAverage } from "@/types/test";
import { Card } from "@mantine/core";
import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ResultChartProps {
  results: TestResultWithAverage[];
  slim?: boolean;
}

const ResultChart: React.FC<ResultChartProps> = ({ results, slim = false }) => {
  const theme = useChartTheme();
  const { containerRef, ...chartSize } = useChartSize(results.length, slim);
  const { data, domainLower, domainUpper } = useResultChartData(results);

  return (
    <Card ref={containerRef} radius="md" px={0} sx={{ overflowX: "auto" }}>
      <LineChart {...chartSize} data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey={STUDENT_SCORE_FIELD}
          capHeight={20}
          xAxisId={0}
          fontWeight={700}
          unit=" NET"
          {...theme.axis}
        />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey={TEST_NAME_FIELD}
          capHeight={15}
          xAxisId={1}
          {...theme.axis}
        />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey={TEST_DATE_FIELD}
          capHeight={10}
          xAxisId={2}
          {...theme.axis}
        />
        <YAxis
          domain={[domainLower, domainUpper]}
          tickCount={(domainUpper - domainLower) / 5 + 1}
          {...theme.axis}
        />
        <Tooltip {...theme.tooltip} />
        <Legend />
        <Line
          dataKey={STUDENT_SCORE_FIELD}
          stroke="#4f3"
          unit=" NET"
          {...theme.line}
        />
        <Line
          dataKey={AVERAGE_SCORE_FIELD}
          stroke="#f34"
          strokeDasharray="4"
          unit=" NET"
          {...theme.line}
        />
      </LineChart>
    </Card>
  );
};

export default ResultChart;
