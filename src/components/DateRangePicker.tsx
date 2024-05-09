import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateRangePickerProps {
  value: { startDate: Date, endDate: Date };
  onChange: (value: { startDate: Date, endDate: Date }) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
}) => {
  const [startDate, setStartDate] = useState < Date > value.startDate;
  const [endDate, setEndDate] = useState < Date > value.endDate;

  const handleDateRangeChange = () => {
    onChange({ startDate, endDate });
  };

  return (
    <div className="flex items-center space-x-4">
      <DatePicker
        selected={startDate}
        onChange={(date: Date) => {
          setStartDate(date);
          handleDateRangeChange();
        }}
        startDate={startDate}
        endDate={endDate}
        selectsStart
        dateFormat="MMM d, yyyy"
        className="px-4 py-2 rounded-md bg-secondary-5 border border-accent-5 text-primary-6"
      />
      <span>-</span>
      <DatePicker
        selected={endDate}
        onChange={(date: Date) => {
          setEndDate(date);
          handleDateRangeChange();
        }}
        startDate={startDate}
        endDate={endDate}
        selectsEnd
        minDate={startDate}
        dateFormat="MMM d, yyyy"
        className="px-4 py-2 rounded-md bg-secondary-5 border border-accent-5 text-primary-6"
      />
    </div>
  );
};

export default DateRangePicker;
