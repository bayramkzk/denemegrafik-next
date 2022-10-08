import { TestResultWithTest } from "@/types/tests";
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

export interface ResultChartProps {
  results: TestResultWithTest[];
  width?: number;
  height?: number;
}

const ResultChart: React.FC<ResultChartProps> = ({
  results,
  width = 960,
  height = 400,
}) => {
  const data = results
    .sort((a, b) => (a.test.date > b.test.date ? 1 : -1))
    .map((result) => ({
      [NAME_FIELD]: result.test.name,
      [STUDENT_SCORE_FIELD]: result.score,
      // TODO: Calculate average score
      [AVERAGE_SCORE_FIELD]: Math.pow(result.score, 1.1),
    }));

  return (
    <LineChart
      width={width}
      height={height}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={NAME_FIELD} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey={STUDENT_SCORE_FIELD} stroke="#8884d8" />
      <Line type="monotone" dataKey={AVERAGE_SCORE_FIELD} stroke="#82ca9d" />
    </LineChart>
  );
};

export default ResultChart;
