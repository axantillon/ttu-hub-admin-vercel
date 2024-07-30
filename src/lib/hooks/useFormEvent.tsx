import { createEvent } from "@/db/event";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  startTime: z.date(),
  location: z.string(),
  organizer: z.string(),
  coverImg: z.string(),
});

export const useFormEvent = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      startTime: new Date(),
      location: "",
      organizer: "",
      coverImg: "",
    },
  }) as UseFormReturn<z.infer<typeof formSchema>>;

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      createEvent(values);
    } catch (error) {
      console.error(error);
    }
  }

  return { eventForm: form, onSubmit };
};
