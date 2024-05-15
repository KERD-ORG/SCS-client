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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios" ;
import cookies from "js-cookie";
import { toast } from "sonner";
import { useEffect, useState } from "react";




const formSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, { message: "Must be 2 or more character long" }),
  web_address: z.string({ required_error: "Url is required" }).url({
    message: "Invalid url",
  }),
  university: z.string({ required_error: "university is required" }),
  address: z
    .string({ required_error: "Address is required" })
    .min(2, { message: "Must be 2 or more character long" }),
  statement: z
    .string({ required_error: "Statement is required" })
    .min(2, { message: "Must be 2 or more character long" }),
  status: z.string({ required_error: "State is required" }),
});

function CollegeForm({ onDialogOpenChange }) {
  const form = useForm({ resolver: zodResolver(formSchema) });
  const [university, setUniversity] = useState("");

 
  useEffect(() => {
    const getUniversity = async () => {
      const res = await axios.get("http://127.0.0.1:8000/universities/");
      console.log("universities", res.data);
      setUniversity(res.data);
    };
    getUniversity();
  },[])

//  college api call
  const CollegeformSubmit = async (data) => {
    console.log(data);
    const token = cookies.get("ACCESS_TOKEN");
    try {
      const res = await axios.post("http://127.0.0.1:8000/colleges/new/", {
        name: data.name,
        university: data.university,
        web_address: data.web_address,
        address: data.address,
        statement: data.statement,  
        status: data.status,
      } , {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response", res);
      if (res.status === 201) {
        onDialogOpenChange(false);
        toast.success("College created successfully");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="mb-1.5 mt-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(CollegeformSubmit)}
          className="grid grid-cols-2 gap-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>College Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
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
            name="university"
            render={({ field }) => (
              <FormItem>
                <FormLabel>University</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a University" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {university && university.map((university) => (
                      <SelectItem key={university.id} value={university.id}>{university.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

export default CollegeForm;
