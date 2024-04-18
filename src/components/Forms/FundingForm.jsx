"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const INPUTS = [
  { name: "name", label: "Name", placeholder: "Name" },
  { name: "start_date", label: "Start Date", placeholder: "Pick a date" },
  { name: "end_date", label: "End Date", placeholder: "Pick a date" },
  { name: "funding_type", label: "Funding Type" },
  { name: "position", label: "Number Of Position" },
  { name: "status", label: "Status" },
  { name: "campus", label: "Campus" },
  { name: "college", label: "College" },
  { name: "department", label: "Department" },
  { name: "statement", label: "Statement", placeholder: "Enter statement..." },
];

const formSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, { message: "Must be 2 or more character long" }),
  campus: z.string({ required_error: "Campus is required" }),
  college: z.string({ required_error: "College is required" }),
  department: z.string({ required_error: "Department is required" }),
  statement: z
    .string({ required_error: "Statement is required" })
    .min(2, { message: "Must be 2 or more character long" }),
  status: z.string({ required_error: "Status is required" }),
  funding_type: z.string({ required_error: "Funding Type is required" }),
  position: z
    .number({ required_error: "Number of position is required" })
    .min(0),
  start_date: z.date({ required_error: "Start Date is required" }),
  end_date: z.date({ required_error: "End Date is required" }),
});

function FundingForm({ onSheetOpenChange }) {
  const form = useForm({ resolver: zodResolver(formSchema) });

  function onSubmit(values) {
    console.log(values);
  }

  return (
    <div className="mb-1.5 mt-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-8">
          {INPUTS.map((input, ind) => (
            <FormField
              control={form.control}
              name={input.name}
              key={ind}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>{input.label ?? "Label"}</FormLabel>
                  {renderFormControl(field, input.name, input.placeholder)}
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <div className="w-full col-span-2 flex items-center justify-end gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => onSheetOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="secondary" size="lg">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function renderFormControl(field, name, placeholder = "") {
  switch (name) {
    case "name":
      return (
        <FormControl>
          <Input placeholder={placeholder} {...field} />
        </FormControl>
      );

      case "position":
      return (
        <FormControl>
          <Input placeholder={placeholder} {...field} type="number" />
        </FormControl>
      );

    case "start_date":
      return (
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !field.value && "text-muted-foreground"
                )}
              >
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="!w-full p-0" align="start">
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
              className={'w-full'}
            />
          </PopoverContent>
        </Popover>
      );

    case "end_date":
      return (
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !field.value && "text-muted-foreground"
                )}
              >
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );



    case "college":
      return (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a college" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="active">College 1</SelectItem>
            <SelectItem value="not-active">College 2</SelectItem>
          </SelectContent>
        </Select>
      );

    case "campus":
      return (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a campus" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="active">Campus 1</SelectItem>
            <SelectItem value="not-active">Campus 2</SelectItem>
          </SelectContent>
        </Select>
      );

    case "department":
      return (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a department" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="active">Department 1</SelectItem>
            <SelectItem value="not-active">Department 2</SelectItem>
          </SelectContent>
        </Select>
      );

    case "statement":
      return (
        <FormControl>
          <Textarea placeholder={placeholder} {...field} />
        </FormControl>
      );

    case "status":
      return (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="not-active">Not Active</SelectItem>
          </SelectContent>
        </Select>
      );

    case "funding_type":
      return (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select Funding Type" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="active">TA</SelectItem>
            <SelectItem value="not-active">RA</SelectItem>
            <SelectItem value="not-active">Fellowship</SelectItem>
          </SelectContent>
        </Select>
      );
  }
}

export default FundingForm;
