import { TestResultWithAverage } from "@/types/test";
import { renderDate } from "@/utils/renderLocalDate";
import { Card, useMantineTheme } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
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

const TEST_NAME_FIELD = "Deneme İsmi";
const TEST_DATE_FIELD = "Deneme Tarihi";
const STUDENT_SCORE_FIELD = "Öğrenci Puanı";
const AVERAGE_SCORE_FIELD = "Ortalama Puan";

const STROKE_WIDTH = 2;

export interface ResultChartProps {
  results: TestResultWithAverage[];
}

const ResultChart: React.FC<ResultChartProps> = ({ results }) => {
  const theme = useMantineTheme();
  const { ref, width } = useElementSize();
  const axisTick = {
    fill:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
  };
  const data = results
    .sort((a, b) => (a.test.date > b.test.date ? 1 : -1))
    .map((result) => ({
      [TEST_NAME_FIELD]: result.test.name,
      [TEST_DATE_FIELD]: renderDate(result.test.date),
      [STUDENT_SCORE_FIELD]: result.score,
      [AVERAGE_SCORE_FIELD]: result.average,
    }));

  return (
    <Card ref={ref} radius="md" py="lg">
      <LineChart width={width} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={TEST_NAME_FIELD} tick={axisTick} xAxisId={0} />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey={TEST_DATE_FIELD}
          tick={axisTick}
          capHeight={8}
          xAxisId={1}
        />
        <YAxis tick={axisTick} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={STUDENT_SCORE_FIELD}
          stroke="#8884d8"
          strokeWidth={STROKE_WIDTH}
        />
        <Line
          type="monotone"
          dataKey={AVERAGE_SCORE_FIELD}
          stroke="#82ca9d"
          strokeWidth={STROKE_WIDTH}
        />
      </LineChart>
    </Card>
  );
};

export default ResultChart;
