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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import axios from "axios";
import { useEffect, useState } from "react";
import cookies from "js-cookie";
import { toast } from "sonner";

const formSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, { message: "Must be 2 or more character long" }),
  campus: z.string({ required_error: "Campus is required" }),
  college: z.string({ required_error: "College is required" }),
  department: z.string({ required_error: "Department is required" }),
  originator: z.string({ required_error: "Originator of Funding is required" }),
  benefits: z.string({ required_error: "Benefits under Funding is required" }),
  statement: z
    .string({ required_error: "Statement is required" })
    .min(2, { message: "Must be 2 or more character long" }),
  status: z.string({ required_error: "Status is required" }),
  funding_type: z.string({ required_error: "Funding Type is required" }),
  position: z
    .number({ required_error: "Number of position is required" })
    .min(0),
  amount: z.number({ required_error: "Amount is required" }).min(0),
  start_date: z.date({ required_error: "Start Date is required" }),
  end_date: z.date({ required_error: "End Date is required" }),
});

function FundingForm({ onDialogOpenChange }) {
  const form = useForm({ resolver: zodResolver(formSchema) });
  const token = cookies.get("ACCESS_TOKEN");
  const [colleges, setColleges] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    (async function () {
      try {
        const [collegesResponse, campusesResponse, departmentsResponse] =
          await Promise.all([
            axios.get("http://localhost:8000/colleges/", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:8000/campuses/", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:8000/departments/", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        setColleges(collegesResponse.data.map((val) => val.name));
        setCampuses(campusesResponse.data.map((val) => val.name));
        setDepartments(departmentsResponse.data.map((val) => val.name));
      } catch (error) {
        console.error("Error fetching data:", error);
        toast(error.message);
      }
    })();
  }, []);

  const fundingformSubmit = async (data) => {
    const formattedStartDate = format(data.start_date, "yyyy-MM-dd");
    const formattedEndDate = format(data.end_date, "yyyy-MM-dd");
    try {
      const res = await axios.post(
        "http://localhost:8000/fundings/new/",
        {
          name: data.name,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          funding_type: data.funding_type,
          number_of_positions: data.position,
          department: data.department,
          campus: data.campus,
          college: data.college,
          // originator: data.originator,
          // benefits: data.benefits,
          statement: data.statement,
          status: data.status,
          // amount: data.amount,
        }, {
          headers: {Authorization: `Bearer ${token}`}
        }
      );
      console.log(res);
      if (res.status === 201) {
        onDialogOpenChange(false);
        toast.success("Funding created successfully");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mb-1.5 mt-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(fundingformSubmit)}
          className="grid grid-cols-2 gap-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Start Date</FormLabel>
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
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                      className={"w-full"}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>End Date</FormLabel>
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
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                      className={"w-full"}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="funding_type"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Funding Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select funding type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TA">TA</SelectItem>
                      <SelectItem value="RA">RA</SelectItem>
                      <SelectItem value="Fellowship">Fellowship</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="originator"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Originator of Funding</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select originator of funding" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="organization">Organization</SelectItem>
                      <SelectItem value="professors">Professors</SelectItem>
                      <SelectItem value="other">Anonymous or others</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="benefits"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Benefits under Funding</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select benefits under funding" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stipend">Stipend</SelectItem>
                      <SelectItem value="medical/health">
                        Medical/Health Insurance
                      </SelectItem>
                      <SelectItem value="dental">Dental Insurance</SelectItem>
                      <SelectItem value="dorm">Dorm</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Number Of Position</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Number Of Position"
                    type="number"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Amount (Yearly)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Amount (Yearly)"
                    {...field}
                    type="number"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Not Active</SelectItem>
                    </SelectContent>
                  </Select>
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
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
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
                          ? departments.find((department) => department === field.value)
                          : "Select department"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search department..." />
                      <CommandEmpty>No department found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {departments.map((department) => {
                            return (
                              <CommandItem
                                value={department}
                                key={department}
                                onSelect={() =>
                                  form.setValue("department", department)
                                }
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    department === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {department}
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
            name="statement"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Statement</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter statement..." {...field} />
                </FormControl>
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

export default FundingForm;
