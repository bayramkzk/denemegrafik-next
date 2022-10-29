export const renderDateTime = (date: Date) => {
  return new Date(date).toLocaleString("tr", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

export const renderDate = (date: Date) => {
  return new Date(date).toLocaleString("tr", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
