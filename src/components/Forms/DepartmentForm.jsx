"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import cookies from "js-cookie";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, { message: "Must be 2 or more character long" }),
  web_address: z.string({ required_error: "Url is required" }).url({
    message: "Invalid url",
  }),
  campus: z.string({ required_error: "Campus is required" }),
  college: z.string({ required_error: "College is required" }),
  address: z
    .string({ required_error: "Address is required" })
    .min(2, { message: "Must be 2 or more character long" }),
  statement: z
    .string({ required_error: "Statement is required" })
    .min(2, { message: "Must be 2 or more character long" }),
  status: z.string({ required_error: "State is required" }),
});

function DepartmentForm({ onDialogOpenChange }) {
  const form = useForm({ resolver: zodResolver(formSchema) });
  const [colleges, setColleges] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const token = cookies.get("ACCESS_TOKEN");

  useEffect(() => {
    const fetchCollegesAndCampuses = async () => {
      try {
        const [collegesResponse, campusesResponse] = await Promise.all([
          axios.get("http://localhost:8000/colleges/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/campuses/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setColleges(collegesResponse.data.map((val) => val.name));
        setCampuses(campusesResponse.data.map((val) => val.name));
      } catch (error) {
        console.error("Error fetching data:", error);
        toast(error.message);
      }
    };

    fetchCollegesAndCampuses();
  }, []);

  const DeptfromSubmit = async (values) => {
    try {
      const token = cookies.get("ACCESS_TOKEN");

      const res = await axios.post(
        "http://localhost:8000/departments/new/",
        {
          name: values.name,
          college: values.college,
          campus: values.campus,
          web_address: values.web_address,
          address: values.address,
          statement: values.statement,
          status: values.status,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response", res);
      if (res.status === 201) {
        toast.success("Department created successfully");
        onDialogOpenChange(false);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mb-1.5 mt-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(DeptfromSubmit)}
          className="grid grid-cols-2 gap-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="campus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campus</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? campuses.find((campus) => campus === field.value)
                          : "Select campus"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search campus..." />
                      <CommandEmpty>No campus found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {campuses.map((campus) => {
                            return (
                              <CommandItem
                                value={campus}
                                key={campus}
                                onSelect={() => form.setValue("campus", campus)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    campus === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {campus}
                              </CommandItem>
                            );
                          })}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="college"
            render={({ field }) => (
              <FormItem>
                <FormLabel>College</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? colleges.find((college) => college === field.value)
                          : "Select college"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search college..." />
                      <CommandEmpty>No college found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {colleges.map((college) => {
                            return (
                              <CommandItem
                                value={college}
                                key={college}
                                onSelect={() =>
                                  form.setValue("college", college)
                                }
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    college === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {college}
                              </CommandItem>
                            );
                          })}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="web_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Web Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="http://example.com"
                    type="url"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter address..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="statement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statement</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter statement..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Not-Active">Not Active</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full col-span-2 flex items-center justify-end gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => onDialogOpenChange(false)}
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

export default DepartmentForm;
