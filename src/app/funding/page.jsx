"use client";

import DataTable from "@/components/DataTable/DataTable";
import FundingForm from "@/components/Forms/FundingForm";
import { Button } from "@/components/ui/button";
import { open_sans } from "@/lib/fonts";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";

const data = [
  {
    id: 1,
    name: "Environmental Science test",
    campus: "Idaho falls1",
    college: "College of natural resources",
    operator: "Ahnaf Hasan",
    status: "Active",
    logo: "https://github.com/shadcn.png",
  },
  {
    id: 2,
    name: "Environmental Science test",
    campus: "Idaho falls2",
    college: "College of natural resources",
    operator: "Ahnaf Hasan",
    status: "active",
    logo: "",
  },
  {
    id: 3,
    name: "Environmental Science test",
    campus: "Idaho falls3",
    college: "College of natural resources",
    operator: "Ahnaf Hasan",
    status: "not active",
    logo: "https://github.com/shadcn.png",
  },
  {
    id: 4,
    name: "Environmental Science test",
    campus: "Idaho falls4",
    college: "College of natural resources",
    operator: "Ahnaf Hasan",
    status: "active",
    logo: "",
  },
];

function Funding() {
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <div className="bg-[whitesmoke] w-full h-full p-8">
      <div className="flex items-center justify-between">
        <h1
          className={`text-4xl ${open_sans.className} font-bold text-gray-700`}
        >
          Funding
        </h1>
        <Sheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          onOpenChange={setSheetOpen}
        >
          <SheetTrigger asChild>
            <Button variant="primary">
              <PlusCircleIcon />
              <span className="ml-2">Add new funding</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="overflow-y-auto h-screen">
            <SheetHeader>
              <SheetTitle className="text-2xl border-b pb-3">
                Add new funding
              </SheetTitle>
            </SheetHeader>
            <div className="w-full">
              <FundingForm onSheetOpenChange={setSheetOpen} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div>
        <DataTable data={data} />
      </div>
    </div>
  );
}

export default Funding;
