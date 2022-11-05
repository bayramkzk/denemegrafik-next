import { TestResultWithAverage } from "@/types/test";
import { renderShortDate } from "@/utils/renderLocalDate";
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

const STROKE_WIDTH = 3;
const DOMAIN_PADDING = 10;

export interface ResultChartProps {
  results: TestResultWithAverage[];
  slim?: boolean;
}

const roundBy = (value: number, by: number) => {
  return Math.round(value / by) * by;
};

const ResultChart: React.FC<ResultChartProps> = ({ results, slim = false }) => {
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
      [TEST_DATE_FIELD]: renderShortDate(result.test.date),
      [STUDENT_SCORE_FIELD]: result.score.toFixed(2),
      [AVERAGE_SCORE_FIELD]: result.average.toFixed(2),
    }));
  const yMinMax = data.reduce(
    (acc, curr) => {
      const score = parseFloat(curr[STUDENT_SCORE_FIELD]);
      const average = parseFloat(curr[AVERAGE_SCORE_FIELD]);
      return {
        min: Math.min(acc.min, score, average),
        max: Math.max(acc.max, score, average),
      };
    },
    { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY }
  );

  return (
    <Card ref={ref} radius="md" py="lg">
      <LineChart width={width} height={slim ? 400 : 600} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={TEST_NAME_FIELD}
          tick={axisTick}
          capHeight={15}
          xAxisId={0}
        />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey={TEST_DATE_FIELD}
          tick={axisTick}
          capHeight={8}
          xAxisId={1}
        />
        <YAxis
          domain={[
            roundBy(yMinMax.min, DOMAIN_PADDING) - DOMAIN_PADDING,
            roundBy(yMinMax.max, DOMAIN_PADDING) + DOMAIN_PADDING,
          ]}
          tick={axisTick}
        />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={STUDENT_SCORE_FIELD}
          stroke="#4f3"
          strokeWidth={STROKE_WIDTH}
          unit=" NET"
        />
        <Line
          type="monotone"
          dataKey={AVERAGE_SCORE_FIELD}
          stroke="#f34"
          strokeWidth={STROKE_WIDTH}
          unit=" NET"
        />
      </LineChart>
    </Card>
  );
};

export default ResultChart;
