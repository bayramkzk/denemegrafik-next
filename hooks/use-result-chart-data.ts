import { TestResultWithAverage } from "@/types/test";
import { renderShortDate } from "@/utils/renderLocalDate";

export const TEST_NAME_FIELD = "Deneme İsmi";
export const TEST_DATE_FIELD = "Deneme Tarihi";
export const STUDENT_SCORE_FIELD = "Öğrenci Puanı";
export const AVERAGE_SCORE_FIELD = "Ortalama Puan";

const DOMAIN_PADDING = 10;

export const useResultChartData = (results: TestResultWithAverage[]) => {
  const roundBy = (value: number, by: number) => Math.round(value / by) * by;

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
  const [domainLower, domainUpper] = [
    roundBy(yMinMax.min, DOMAIN_PADDING) - DOMAIN_PADDING,
    roundBy(yMinMax.max, DOMAIN_PADDING) + DOMAIN_PADDING,
  ];
  return { data, domainLower, domainUpper };
};
