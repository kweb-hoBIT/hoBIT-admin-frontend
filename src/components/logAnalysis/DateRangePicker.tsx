import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateRangePickerProps {
  label: string;
  selectedDate: string;
  onDateChange: (date: string) => void;
  disableDates: (date: Date, type: "start" | "end") => boolean;
  dateType: "start" | "end";
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  label,
  selectedDate,
  onDateChange,
  disableDates,
  dateType,
}) => {
  return (
    <div className="mb-4">
      <label className="block mb-2">{label}:</label>
      <DatePicker
        selected={selectedDate ? new Date(selectedDate) : null}
        onChange={(date: Date | null) => {
          if (date) onDateChange(date.toISOString().split("T")[0]);
        }}
        filterDate={(date) => disableDates(date, dateType)}
        dateFormat="yyyy-MM-dd"
        className="p-2 border rounded"
      />
    </div>
  );
};

export default DateRangePicker;
