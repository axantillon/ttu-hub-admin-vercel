"use client";

import { Button } from "@/components/ui/shadcn/button";
import { DateTimePicker } from "@/components/ui/shadcn/DateTimePicker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/shadcn/dialog";
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
import { FormTextArea } from "@/components/utils/formInputs/FormTextArea";
import { FormTextInput } from "@/components/utils/formInputs/FormTextInput";
import { updateEvent } from "@/db/event";
import { uploadEventsImage } from "@/lib/utils";
import { EVENT_CATEGORIES } from "@/lib/utils/consts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Event } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface EditEventModalProps {
  event: Event;
}

const FormSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(1),
  description: z.string({ required_error: "Description is required" }),
  startTime: z.date({ required_error: "Start time is required" }),
  location: z.string({ required_error: "Location is required" }),
  organizer: z.string({ required_error: "Organizer is required" }).min(1),
  coverImg: z.any(),
  category: z.string({ required_error: "Category is required" }),
});

export function EditEventModal({ event }: EditEventModalProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: event.name,
      description: event.description,
      startTime: event.startTime,
      location: event.location,
      organizer: event.organizer,
      category: event.category || "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    let imgPath = event.coverImg;
    if (data.coverImg) {
      try {
        imgPath = await uploadEventsImage(
          data.coverImg,
          data.name,
          data.category
        );
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
      }
    }

    updateEvent(event.id, { ...data, coverImg: imgPath! })
      .then(() => {
        form.reset();
        toast({
          title: "Event Updated!",
          description: <span className="font-bold">{data.name} 🎉</span>,
        });
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to update event",
          variant: "destructive",
        });
      });
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-fit">Edit Event</Button>
      </DialogTrigger>
      <DialogContent className="bg-white sm:max-w-[600px] h-[calc(100vh-6rem)] pb-4">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Edit the event details and save changes.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8 h-[80%] mb-4 pb-6 px-2 pr-4 overflow-y-auto">
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
                      <FormLabel htmlFor="startTime">Start Time </FormLabel>
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
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button disabled={loading} type="submit">
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
