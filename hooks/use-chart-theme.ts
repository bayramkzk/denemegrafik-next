import { useMantineTheme } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { LineProps } from "recharts";
import { BaseAxisProps } from "recharts/types/util/types";

const WIDTH_PER_RESULT = 200;
const STROKE_WIDTH = 3;

export const useChartTheme = () => {
  const theme = useMantineTheme();
  const isDark = theme.colorScheme === "dark";

  return {
    axis: {
      tick: {
        fill: isDark ? theme.colors.dark[0] : theme.colors.gray[7],
      },
      stroke: isDark ? theme.colors.dark[0] : theme.colors.gray[7],
    } as BaseAxisProps,
    tooltip: {
      wrapperStyle: { outline: "none" },
      contentStyle: {
        background: isDark ? theme.colors.dark[8] : theme.colors.gray[0],
        borderWidth: 2,
        borderColor: isDark ? theme.colors.dark[3] : theme.colors.gray[5],
        borderRadius: theme.radius.md,
        color: isDark ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,
        outline: "none",
      },
    },
    line: {
      type: "monotone",
      strokeWidth: STROKE_WIDTH,
    } as Omit<LineProps, "ref">,
  };
};

export const useChartSize = (dataSize: number, slim: boolean) => {
  const { ref: containerRef, width: cardWidth } = useElementSize();
  const width = Math.max(cardWidth, dataSize * WIDTH_PER_RESULT);
  const height = slim ? 400 : 600;
  return { containerRef, width, height, style: { paddingRight: "10rem" } };
};
