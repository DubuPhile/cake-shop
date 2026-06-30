"use client";

import { useEffect, useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

type Props = {
  setStartDate: (value: Date) => void;
  setEndDate: (value: Date) => void;
};

export default function RangeCalendar({ setStartDate, setEndDate }: Props) {
  const [range, setRange] = useState<DateRange>();

  return (
    <div className="rounded-xl border border-gray-300 bg-white p-4 shadow w-fit">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={(value) => {
          setRange(value);
          if (!value?.from || !value?.to) return;
          setStartDate(value.from);
          setEndDate(value.to);
        }}
        numberOfMonths={1}
        pagedNavigation
        classNames={{
          selected: "text-black",
          today: "text-red-500 font-bold",
          range_start: "bg-blue-400 text-white rounded-l-full",
          range_end: "bg-blue-400 text-white rounded-r-full",
          range_middle: "bg-blue-100 text-blue-900",
          day: "w-8 h-8",
          day_button: "w-8 h-8 text-sm",
          chevron: "fill-gray-500 w-5 h-5",
        }}
      />

      <div className="text-sm border-t pt-1">
        <p>
          <strong>Start:</strong>{" "}
          {range?.from ? format(range.from, "MMM dd, yyyy") : "--"}
        </p>

        <p>
          <strong>End:</strong>{" "}
          {range?.to ? format(range.to, "MMM dd, yyyy") : "--"}
        </p>
      </div>
    </div>
  );
}
