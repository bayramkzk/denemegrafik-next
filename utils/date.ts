import dayjs from "dayjs";

export const combineTimeAndDate = (
  time: Date | undefined,
  date: Date | undefined
) => {
  const hour = dayjs(time).hour();
  const minute = dayjs(time).minute();
  const dateAndTime = dayjs(date).hour(hour).minute(minute);
  return dateAndTime.isValid() ? dateAndTime.toDate() : undefined;
};

export const splitTimeAndDate = (date: Date | undefined) => {
  if (!date) return { date: undefined, time: undefined };

  const time = dayjs(date).toDate();
  const dateOnly = dayjs(date).startOf("day").toDate();

  return { time, date: dateOnly };
};
