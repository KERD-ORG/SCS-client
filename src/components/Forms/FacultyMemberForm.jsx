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
import { useState, useEffect } from "react";
import axios from "axios";
import cookies from "js-cookie";
import { toast } from "sonner";

const formSchema = z
  .object({
    name: z
      .string({ required_error: "Name is required" })
      .min(2, { message: "Must be 2 or more characters long" }),
    campus: z.string({ required_error: "Campus is required" }),
    college: z.string({ required_error: "College is required" }),
    department: z.string({ required_error: "Department is required" }),
    faculty_type: z.string({ required_error: "Faculty Type is required" }),
    statement: z
      .string({ required_error: "Statement is required" })
      .min(2, { message: "Must be 2 or more characters long" }),
    address: z
      .string({ required_error: "Address is required" })
      .min(2, { message: "Must be 2 or more characters long" }),
    status: z.string({ required_error: "Status is required" }),
    web_address: z
      .string({ required_error: "Url is required" })
      .url({
        message: "Invalid url",
      })
      .optional(),
    email: z.string({ required_error: "Url is required" }).email({
      message: "Invalid email",
    }),
  })

function FacultyMemberForm({ onDialogOpenChange }) {
  const form = useForm({ resolver: zodResolver(formSchema) });
  const [departments, setDepartments] = useState("");
  const [campuses, setCampuses] = useState("");
  const [colleges, setColleges] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const campusResp = await axios.get("http://127.0.0.1:8000/campuses/");
      setCampuses(campusResp.data);
      const collegeResp = await axios.get("http://127.0.0.1:8000/colleges/");
      setColleges(collegeResp.data);
      const deptResp = await axios.get("http://127.0.0.1:8000/departments/");
      setDepartments(deptResp.data);
    };
    fetchData();
  }, []);

  const FacultyMemberFormSubmit = async (data) => {
    console.log("data taken");
    console.log("data", data);
    try {
      const token = cookies.get("ACCESS_TOKEN");
      const res = await axios.post(
        "http://localhost:8000/facultys/new/",
        {
          name: data.name,
          email: data.email,
          department: data.department,
          campus: data.campus,
          college: data.college,
          web_address: data.web_address,
          address: data.address,
          statement: data.statement,
          faculty_type: data.faculty_type,
          status: data.status,
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
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(" dadta taken here")
      if(error.response.data){
        toast.error(error.response.data.email[0]);
      } else {
        toast.error(error.message);
      }
      }
  };

  return (
    <div className="mb-1.5 mt-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(FacultyMemberFormSubmit)}
          className="grid grid-cols-2 gap-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="faculty_type"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Faculty Type</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Faculty Type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="web_address"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Web Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Web Address" type="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="campus"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Campus</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select campus" />
                    </SelectTrigger>
                    <SelectContent>
                      {campuses &&
                        campuses.map((campus) => (
                          <SelectItem key={campus.id} value={campus.id}>
                            {campus.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="college"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>College</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select college" />
                    </SelectTrigger>
                    <SelectContent>
                      {colleges &&
                        colleges.map((college) => (
                          <SelectItem key={college.id} value={college.id}>
                            {college.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments &&
                        departments.map((department) => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
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
                  <Textarea placeholder="Enter Statement" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter Address" {...field} />
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

export default FacultyMemberForm;

