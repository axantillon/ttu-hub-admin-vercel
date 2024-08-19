"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Import UI components
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { DateTimePicker } from "@/components/ui/shadcn/DateTimePicker";
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
import { toast } from "@/components/ui/shadcn/use-toast";
import { Checkbox } from "@/components/ui/shadcn/checkbox";

// Import custom components
import { FormTextArea } from "@/components/utils/formInputs/FormTextArea";
import { FormTextInput } from "@/components/utils/formInputs/FormTextInput";

// Import utility functions and constants
import { createEvent } from "@/db/event";
import { uploadEventsImage } from "@/lib/utils";
import { EVENT_CATEGORIES } from "@/lib/utils/consts";
import { usePrivy } from "@privy-io/react-auth";
import { sendNewEventEmail } from "@/components/utils/Email";

// Define the form schema
const FormSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(1),
  description: z.string({ required_error: "Description is required" }),
  startTime: z.date({ required_error: "Start time is required" }),
  location: z.string({ required_error: "Location is required" }),
  organizer: z.string({ required_error: "Organizer is required" }).min(1),
  coverImg: z.any(),
  category: z.string({ required_error: "Category is required" }),
  sendAsEmail: z.boolean(),
});

const CreateEvent: FC = () => {
  const [loading, setLoading] = useState(false);
  const { user } = usePrivy();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      startTime: new Date(),
      location: "",
      organizer: "",
      category: "",
      sendAsEmail: true,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    let imgPath;
    try {
      imgPath = await uploadEventsImage(
        data.coverImg,
        data.name,
        data.category
      );
      createEvent({ ...data, coverImg: imgPath! }, user?.email?.address!)
        .then(() => {
          form.reset();
          toast({
            title: "New Event Created!",
            description: <span className="font-bold">{data.name} 🎉</span>,
          });
        })
        .catch((error) => {
          console.error(error);
          toast({
            title: "Error",
            description: "Failed to create event",
            variant: "destructive",
          });
        });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
        <CardDescription>
          Fill out the details for your new event.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-2xl"
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-end">
                      <FormLabel className="mb-1">Start Time </FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        hourCycle={12}
                        placeholder="Select a date and time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormTextInput
                control={form.control}
                name="location"
                label="Location"
                placeholder="eg. Gathering Stairs"
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
                      className="w-[250px]"
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        onChange(event.target.files && event.target.files[0])
                      }
                    />
                  </FormControl>
                  {value && (
                    <div
                      className="relative flex items-end justify-between w-80 h-44 p-3 rounded-2xl shadow-md shadow-gray-400 bg-sky-500"
                      style={{
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundImage: `url(${
                          value ? URL.createObjectURL(value) : ""
                        })`,
                      }}
                    />
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sendAsEmail"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 px-0.5">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Send as Email</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button disabled={loading} type="submit">
              {loading ? "Creating Event..." : "Create Event"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateEvent;