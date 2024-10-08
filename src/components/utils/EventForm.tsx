"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FormNumberInput } from "@/components/utils/formInputs/FormNumberInput";
import DateTimeRangePicker from "@/components/utils/formInputs/DateTimeRangePicker";
import { Button } from "@/components/ui/shadcn/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";

import { FormTextArea } from "@/components/utils/formInputs/FormTextArea";
import { FormTextInput } from "@/components/utils/formInputs/FormTextInput";
import { EVENT_CATEGORIES } from "@/lib/utils/consts";

export const FormSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(1),
  description: z.string({ required_error: "Description is required" }),
  startTime: z.date({ required_error: "Start time is required" }),
  endTime: z.date().nullable(),
  location: z.string({ required_error: "Location is required" }),
  organizer: z.string({ required_error: "Organizer is required" }).min(1),
  coverImg: z.any(),
  category: z.string(),
  userLimit: z.number().nullable().optional(),
  reward: z.number().min(0, "Reward must be a non-negative number").default(0),
});

interface EventFormProps {
  defaultValues?: Partial<z.infer<typeof FormSchema>>;
  onSubmit: (data: z.infer<typeof FormSchema>) => void;
  loading: boolean;
  submitButtonText: string;
  onSuccessfulSubmit?: () => void;
}

const EventForm: FC<EventFormProps> = ({
  defaultValues,
  onSubmit,
  loading,
  submitButtonText,
  onSuccessfulSubmit,
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      startTime: new Date(),
      endTime: null,
      location: "",
      organizer: "",
      coverImg: undefined,
      category: "",
      userLimit: null,
      reward: 0,
    },
  });

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {

    onSubmit(data);
    if (onSuccessfulSubmit) {
      onSuccessfulSubmit();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        <FormTextInput
          control={form.control}
          name="name"
          label="Name"
          placeholder="eg. Bingo Night!"
        />
        <FormTextArea
          control={form.control}
          name="description"
          label="Event Description"
          placeholder="description..."
        />

        <DateTimeRangePicker
          control={form.control}
          startTimeName="startTime"
          endTimeName="endTime"
        />

        <FormTextInput
          control={form.control}
          name="location"
          label="Location"
          placeholder="eg. Gathering Stairs"
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="unassigned">No Category</SelectItem>
                  {EVENT_CATEGORIES.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      <span
                        className="rounded-full h-3 w-3 inline-block mr-2"
                        style={{ backgroundColor: category.color }}
                      ></span>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormTextInput
          control={form.control}
          name="organizer"
          label="Organizer"
          placeholder="eg. Student Life"
        />

        <FormField
          control={form.control}
          name="coverImg"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  className="w-full sm:w-[250px]"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    onChange(event.target.files && event.target.files[0])
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormNumberInput
          control={form.control}
          name="userLimit"
          label="User Limit (Optional)"
          placeholder="Enter max number of attendees"
        />

        <FormNumberInput
          control={form.control}
          name="reward"
          label="Reward Points (Optional)"
          placeholder="Enter reward for attendance"
        />

        <Button disabled={loading} type="submit" className="w-full sm:w-auto">
          {submitButtonText}
        </Button>
      </form>
    </Form>
  );
};

export default EventForm;