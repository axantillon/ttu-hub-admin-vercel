import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import { FormComponentProps } from "@/lib/types";
import { FC } from "react";

export const FormTextInput: FC<FormComponentProps> = ({
  control,
  name,
  label,
  placeholder,
  extraProps,
  type="text",
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
              {...extraProps}
              placeholder={placeholder}
              {...field}
              type={type}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
