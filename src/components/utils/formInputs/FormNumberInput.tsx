"use client";

import React from "react";
import { Control } from "react-hook-form";
import { Input } from "../../ui/shadcn/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";

interface FormNumberInputProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
}

export const FormNumberInput: React.FC<FormNumberInputProps> = ({
  control,
  name,
  label,
  placeholder,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              className="w-full sm:w-[275px]"
              type="number"
              placeholder={placeholder}
              {...field}
              onChange={(e) =>
                field.onChange(
                  e.target.value ? parseInt(e.target.value, 10) : null
                )
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};