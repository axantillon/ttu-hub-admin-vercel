import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { FormComponentProps } from "@/lib/types";
import React, { FC } from "react";

export const FormTextArea: FC<FormComponentProps> = ({
  control,
  name,
  label,
  placeholder,
  extraProps,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea {...extraProps} placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
