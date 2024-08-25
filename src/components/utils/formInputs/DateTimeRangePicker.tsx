"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/shadcn/form";
import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Control } from "react-hook-form";

interface DateTimeRangePickerProps {
  control: Control<any>;
  startTimeName: string;
  endTimeName: string;
}

const DateTimeRangePicker: React.FC<DateTimeRangePickerProps> = ({
  control,
  startTimeName,
  endTimeName,
}) => {
  const datePickerClassName = "w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name={startTimeName}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="block mb-2">Start Date and Time</FormLabel>
            <div className="flex space-x-4">
              <FormControl className="flex-1">
                <ReactDatePicker
                  selected={field.value}
                  onChange={(date: Date | null) => {
                    if (date) {
                      const newDate = new Date(field.value);
                      newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                      field.onChange(newDate);
                    }
                  }}
                  dateFormat="MMMM d, yyyy"
                  className={datePickerClassName}
                />
              </FormControl>
              <FormControl className="flex-1">
                <ReactDatePicker
                  selected={field.value}
                  onChange={(date: Date | null) => {
                    if (date) {
                      const newDate = new Date(field.value);
                      newDate.setHours(date.getHours(), date.getMinutes());
                      field.onChange(newDate);
                    }
                  }}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className={datePickerClassName}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={endTimeName}
        render={({ field }) => {
          const startTime = control._getWatch(startTimeName);
          return (
            <FormItem>
              <FormLabel className="block mb-2">End Time (Optional)</FormLabel>
              <FormControl>
                <ReactDatePicker
                  selected={field.value}
                  onChange={(date: Date | null) => {
                    if (date) {
                      const endTime = new Date(startTime);
                      endTime.setHours(date.getHours(), date.getMinutes(), 0, 0);
                      field.onChange(endTime);
                    } else {
                      field.onChange(null);
                    }
                  }}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className={datePickerClassName}
                  minTime={new Date(startTime.getTime())}
                  maxTime={new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), 23, 59, 59, 999)}
                  filterTime={(time) => {
                    const selectedTime = new Date(startTime);
                    selectedTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
                    return selectedTime.getTime() > startTime.getTime();
                  }}
                  isClearable
                  placeholderText="Select end time"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};

export default DateTimeRangePicker;