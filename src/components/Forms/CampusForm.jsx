"use client";

import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
const cookies = require("js-cookie");
import axios from "axios";

const formSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, { message: "Must be 2 or more character long" }),
  web_address: z.string({ required_error: "Url is required" }).url({
    message: "Invalid url",
  }),
  country: z.string({ required_error: "Country is required" }),
  state: z.string({ required_error: "State is required" }),
  city: z.string({ required_error: "City is required" }),
  statement: z
    .string({ required_error: "Statement is required" })
    .min(2, { message: "Must be 2 or more character long" }),
  status: z.string({ required_error: "State is required" }),
});

function CampusForm({ onDialogOpenChange }) {
  const form = useForm({ resolver: zodResolver(formSchema) });
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState();
  const [cities, setCities] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async function () {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/iso"
      );
      const { data } = await res.json();
      setCountries(data.map((val) => val.name));
    })();
  }, []);


  const CampusformSubmit = async (values) => {
    const token = cookies.get("ACCESS_TOKEN");
    console.log(token);
    setLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/campuses/new/",
        {
          name: values.name,
          web_address: values.web_address,
          country: values.country,
          state: values.state,
          city: values.city,
          statement: values.statement,
          status: values.status,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        } 
      );
      console.log("response", res);
      if (res.status === 201) {
        onDialogOpenChange(false);
        toast.success("Campus created successfully");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }

  }
 

  const onCountrySelect = async (form, country) => {
    form.setValue("country", country);
    setSelectedCountry(country);
    setLoading(true);
    try {
      const fetchStates = fetch(
        "https://countriesnow.space/api/v0.1/countries/states",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ country }),
        }
      ).then((res) => res.json());

      const fetchCities = fetch(
        "https://countriesnow.space/api/v0.1/countries/cities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ country }),
        }
      ).then((res) => res.json());

      const [statesData, citiesData] = await Promise.all([
        fetchStates,
        fetchCities,
      ]);

      if (statesData.error) throw new Error(statesData.msg);
      if (citiesData.error) throw new Error(citiesData.msg);

      setStates(statesData.data.states.map((val) => val.name));
      setCities(citiesData.data);
    } catch (error) {
      toast(error);
    }
    setLoading(false);
  };

  return (
    <div className="mb-1.5 mt-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(CampusformSubmit)}
          className="grid grid-cols-2 gap-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campus Name</FormLabel>
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
          {cities && (
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
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
                            ? cities.find((city) => city === field.value)
                            : "Select city"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search city..." />
                        <CommandEmpty>No city found.</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {cities.map((city) => {
                              return (
                                <CommandItem
                                  value={city}
                                  key={city}
                                  onSelect={() => {
                                    form.setValue("city", city);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      city === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {city}
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

export default CampusForm;
