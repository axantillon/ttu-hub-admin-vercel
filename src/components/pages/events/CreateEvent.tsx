"use client";
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
import { toast } from "@/components/ui/shadcn/use-toast";
import { FormTextArea } from "@/components/utils/formInputs/FormTextArea";
import { FormTextInput } from "@/components/utils/formInputs/FormTextInput";
import { createEvent } from "@/db/event";
import { uploadEventsImage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  description: z.string({ required_error: "Description is required" }),
  startTime: z.date({ required_error: "Start time is required" }),
  location: z.string({ required_error: "Location is required" }),
  organizer: z.string({ required_error: "Organizer is required" }),
  coverImg: z.any({ required_error: "Cover Image is required" }),
});

const CreateEvent: FC = ({}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: undefined,
      description: undefined,
      startTime: new Date(),
      location: undefined,
      organizer: undefined,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    let imgPath;
    try {
        imgPath = await uploadEventsImage(data.coverImg, data.name);
    } catch (error) {
        console.error(error);
        return
    }

    if (!imgPath) {
        toast({
            title: "Error",
            description: "Failed to upload image",
            variant: "destructive",
        })
        return;
    }

    createEvent({ ...data, coverImg: imgPath! }).then(() => {
        form.reset();
    });

    toast({
      title: "New Event Created!",
      description: <span className="font-bold">{data.name} 🎉</span>,
    });
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
        <CardDescription>
          Fill out the details for your new event.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        hourCycle={12}
                        placeholder="Select a date and time"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormTextInput
                control={form.control}
                name="location"
                label="Custom Location"
                placeholder="eg. Gathering Stairs"
              />
            </div>

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

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateEvent;
