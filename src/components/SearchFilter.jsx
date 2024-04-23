"use client";
import { inter } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Slider } from "@mui/material";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";

function SearchFilter() {
  const [date, setDate] = useState();
  const [value, setValue] = useState([0, 500]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className="!mt-4 space-y-8">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="text-xl flex items-center justify-between w-full">
          <span className="font-medium">Customized Filter</span>
          <PlusCircle />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <div
            className={`space-y-6 p-4 border rounded shadow ${inter.className}`}
          >
            <div className="grid grid-cols-3 items-center gap-3">
              <label htmlFor="country" className="">
                Country
              </label>
              <Input id="country" className="h-8 col-span-2 bg-gray-100" />
            </div>
            <div className="grid grid-cols-3 items-center gap-3">
              <label htmlFor="los" className="">
                Level of Study
              </label>
              <Input id="los" className="h-8 col-span-2 bg-gray-100" />
            </div>
            <div className="grid grid-cols-3 items-center gap-3">
              <label htmlFor="department" className="">
                Department
              </label>
              <Input id="department" className="h-8 col-span-2 bg-gray-100" />
            </div>
            <div className="grid grid-cols-3 items-center gap-3">
              <label htmlFor="aos" className="">
                Area of Study
              </label>
              <Input id="aos" className="h-8 col-span-2 bg-gray-100" />
            </div>
            <div className="grid grid-cols-3 items-center gap-3">
              <label htmlFor="deadline" className="">
                Application Deadline
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-2 pl-3 text-left bg-gray-100 font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="!w-full p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(e) => setDate(e)}
                    disabled={(dt) =>
                      dt > new Date() || dt < new Date("1900-01-01")
                    }
                    initialFocus
                    className={"w-full"}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-3 items-center gap-3">
              <label className="">Ranking Range</label>
              <Slider
                className="col-span-2"
                getAriaLabel={() => "Temperature range"}
                value={value}
                max={1000}
                min={0}
                onChange={handleChange}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
              />
            </div>
            <div className="grid grid-cols-2 gap-8 items-center w-full">
              <div className="space-y-2">
                <label className="">Scholarship Availability</label>
                <Slider
                  className=""
                  getAriaLabel={() => "Temperature range"}
                  value={0}
                  max={100}
                  min={0}
                  onChange={handleChange}
                  valueLabelDisplay="auto"
                  getAriaValueText={valuetext}
                />
              </div>
              <div className="space-y-2">
                <label className="">Acceptance Rate</label>
                <Slider
                  className=""
                  getAriaLabel={() => "Temperature range"}
                  value={0}
                  max={100}
                  min={0}
                  onChange={handleChange}
                  valueLabelDisplay="auto"
                  getAriaValueText={valuetext}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 items-center gap-3">
              <label htmlFor="tution_fee_range">Tution Fee Range</label>
              <Select defaultValue={"between10_20"} className=" w-full">
                <SelectTrigger className="!col-span-2 bg-gray-100 w-full">
                  <SelectValue placeholder="Select Tution Fee Range" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="below10">Below 10k</SelectItem>
                  <SelectItem value="between10_20">
                    Between 10k and 20k
                  </SelectItem>
                  <SelectItem value="between20_30">
                    Between 20k and 30k
                  </SelectItem>
                  <SelectItem value="over30">Over 30k</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible>
        <CollapsibleTrigger className="text-xl flex items-center justify-between w-full">
          <span className="font-medium">Proficiency</span>
          <PlusCircle />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <div
            className={`space-y-6 p-4 border rounded shadow ${inter.className}`}
          >
            <div className="grid grid-cols-5 items-center gap-3">
              <label htmlFor="cgpa" className="col-span-3">
                Minimum CGPA
              </label>
              <Input id="cgpa" type='number' className="h-8 col-span-2 bg-gray-100" />
            </div>
            <div className="grid grid-cols-5 items-center gap-3">
              <label htmlFor="ielts" className="col-span-3">
                Minimum IELTS Score
              </label>
              <Input id="ielts" type='number' className="h-8 col-span-2 bg-gray-100" />
            </div>
            <div className="grid grid-cols-5 items-center gap-3">
              <label htmlFor="gre" className="col-span-3">
                Minimum GRE Score
              </label>
              <Input id="gre" type='number' className="h-8 col-span-2 bg-gray-100" />
            </div>
            <div className="grid grid-cols-5 items-center gap-3">
              <label htmlFor="duolingo" className="col-span-3">
                Minimum Duolingo Score
              </label>
              <Input id="duolingo" type='number' className="h-8 col-span-2 bg-gray-100" />
            </div>
            <div className="grid grid-cols-5 items-center gap-3">
              <label htmlFor="toefl" className="col-span-3">
                Minimum TOEFL Score
              </label>
              <Input id="toefl" type='number' className="h-8 col-span-2 bg-gray-100" />
            </div>
            <div className="grid grid-cols-5 gap-3 items-center">
              <label htmlFor="cert" className="col-span-3">Medium of Instruction Certificate</label>
              <Checkbox id='cert' className='col-span-2' />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      <div className="w-full">
        <Button variant='primary' size='lg' className='float-right text-lg'>Search</Button>
      </div>
    </div>
  );
}

function valuetext(value) {
  return `${value}`;
}

export default SearchFilter;
