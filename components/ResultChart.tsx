import { TestResultWithAverage } from "@/types/tests";
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

const NAME_FIELD = "Deneme İsmi";
const STUDENT_SCORE_FIELD = "Öğrenci Puanı";
const AVERAGE_SCORE_FIELD = "Ortalama Puan";

const CARD_PADDING = 16;
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
      [NAME_FIELD]: result.test.name,
      [STUDENT_SCORE_FIELD]: result.score,
      [AVERAGE_SCORE_FIELD]: result.average,
    }));

  return (
    <Card ref={ref} radius="md" p={CARD_PADDING}>
      <LineChart
        width={width - CARD_PADDING * 2}
        height={400}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={NAME_FIELD} tick={axisTick} />
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
