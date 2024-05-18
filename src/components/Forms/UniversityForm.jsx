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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import cookies from "js-cookie";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, { message: "Must be 2 or more character long" }),
  web_address: z.string({ required_error: "Url is required" }).url({
    message: "Invalid url",
  }),
  country: z.string({ required_error: "Country is required" }),
  state: z.string({ required_error: "State is required" }),
  statement: z
    .string({ required_error: "Statement is required" })
    .min(2, { message: "Must be 2 or more character long" }),
  status: z.string({ required_error: "State is required" }),
});

function UniversityForm({ onDialogOpenChange, data }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: data || {
      name: "",
      web_address: "",
      country: "",
      state: "",
      statement: "",
      status: "",
    },
  });
  const { handleSubmit, setValue, reset } = form;
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async function () {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/iso"
      );
      const { data } = await res.json();
      setCountries(data.map((val) => val.name));
    })();
  }, []);

  useEffect(() => {
    // If data is provided, set the form values (edit mode)
    if (data) {
      (async function () {
        Object.keys(data).forEach((key) => {
          setValue(key, data[key]);
        });
        setLoading(true)
        try {
          const res = await fetch(
            "https://countriesnow.space/api/v0.1/countries/states",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ country: data.country }),
            }
          );
          const dd = await res.json();
          if (dd.error) throw new Error(dd.msg);
          setStates(dd.data.states.map((val) => val.name));
        } catch (error) {
          toast(error.message);
        }
        setLoading(false)
      })();
    }
  }, [data, setValue]);

  // University api call
  const UniversityformSubmit = async (values) => {
    console.log("first");
    const token = cookies.get("ACCESS_TOKEN");
    setLoading(true);
    try {
      const url = data
        ? `http://127.0.0.1:8000/universities/${data.id}/modify/`
        : "http://127.0.0.1:8000/universities/new/";
      const method = data ? "put" : "post";

      const requestBody = {
        name: values.name,
        web_address: values.web_address,
        country: values.country,
        state: values.state,
        statement: values.statement,
        status: values.status,
        ...(data && { id: data.id }), // Include the id in the request body if in edit mode
      };

      const res = await axios[method](url, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201 || res.status === 200) {
        toast.success(
          data
            ? "University updated successfully"
            : "University created successfully"
        );
        onDialogOpenChange(false);
        router.refresh();
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onCountrySelect = async (form, country) => {
    form.setValue("country", country);
    setSelectedCountry(country);
    setLoading(true);
    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/states",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ country }),
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.msg);
      setStates(data.data.states.map((val) => val.name));
    } catch (error) {
      toast(error);
    }
    setLoading(false);
  };

  return (
    <div className="mb-1.5 mt-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(UniversityformSubmit)}
          className="grid grid-cols-2 gap-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>University Name</FormLabel>
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
          <FormItem>
            <FormLabel>Logo</FormLabel>
            <Input type="file" />
          </FormItem>

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
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
                          ? countries.find((country) => country === field.value)
                          : "Select country"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search country..." />
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {countries.map((country) => {
                            return (
                              <CommandItem
                                value={country}
                                key={country}
                                onSelect={() => onCountrySelect(form, country)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    country === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {country}
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
          {states && (
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
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
                            ? states.find((state) => state === field.value)
                            : "Select state"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search state..." />
                        <CommandEmpty>No state found.</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {states.map((state) => {
                              return (
                                <CommandItem
                                  value={state}
                                  key={state}
                                  onSelect={() => {
                                    form.setValue("state", state);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      state === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {state}
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
          )}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
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
              <FormItem>
                <FormLabel>Statement</FormLabel>
                <FormControl>
                  <Textarea placeholder="statement" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full col-span-2 flex items-center justify-end gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={(e) => {
                e.preventDefault();
                onDialogOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              disabled={loading}
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default UniversityForm;
