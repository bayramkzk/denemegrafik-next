import { combineTimeAndDate, splitTimeAndDate } from "@/utils/date";
import { Group, Input } from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { IconCalendar, IconClock } from "@tabler/icons";
import React from "react";
import { RECORD_FORM_ICON_SIZE } from "../constants";

export interface DateTimePickerProps {
  label?: string;
  placeholder?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  placeholder,
  value,
  onChange,
}) => {
  const { time, date } = splitTimeAndDate(value);

  const updateDate = (updatedDate: Date) => {
    const combined = combineTimeAndDate(time, updatedDate);
    onChange?.(combined);
  };

  const updateTime = (updatedTime: Date) => {
    const combined = combineTimeAndDate(updatedTime, date);
    onChange?.(combined);
  };

  return (
    <Input.Wrapper label={label}>
      <Group>
        <DatePicker
          placeholder={placeholder}
          sx={{ flexGrow: 1 }}
          icon={<IconCalendar size={RECORD_FORM_ICON_SIZE} />}
          value={date}
          onChange={updateDate}
        />

        <TimeInput
          value={time}
          icon={<IconClock size={RECORD_FORM_ICON_SIZE} />}
          onChange={updateTime}
        />
      </Group>
    </Input.Wrapper>
  );
};

export default DateTimePicker;
