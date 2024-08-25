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
  startDateName: string;
  startTimeName: string;
  endTimeName: string;
}

const DateTimeRangePicker: React.FC<DateTimeRangePickerProps> = ({
  control,
  startDateName,
  startTimeName,
  endTimeName,
}) => {
  const datePickerClassName = "w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <FormField
          control={control}
          name={startDateName}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="block mb-2">Date</FormLabel>
              <FormControl>
                <ReactDatePicker
                  selected={field.value}
                  onChange={(date: Date | null) => field.onChange(date)}
                  dateFormat="MMMM d, yyyy"
                  className={datePickerClassName}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex space-x-4">
        <div className="flex flex-col flex-1">
          <FormField
            control={control}
            name={startTimeName}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block mb-2">Start Time</FormLabel>
                <FormControl>
                  <ReactDatePicker
                    selected={field.value}
                    onChange={(date: Date | null) => date && field.onChange(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    className={datePickerClassName}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col flex-1">
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
                      onChange={(date: Date | null) => field.onChange(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      className={datePickerClassName}
                      minTime={new Date(0, 0, 0, startTime.getHours(), startTime.getMinutes())}
                      maxTime={new Date(0, 0, 0, 23, 59)}
                      filterTime={(time) => {
                        const selectedTime = new Date(time);
                        const startTimeDate = new Date(startTime);
                        return (
                          selectedTime.getTime() > startTimeDate.getTime() ||
                          (selectedTime.getHours() === startTimeDate.getHours() &&
                            selectedTime.getMinutes() > startTimeDate.getMinutes())
                        );
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
      </div>
    </div>
  );
};

export default DateTimeRangePicker;