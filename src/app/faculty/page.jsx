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
import FacultyMemberForm from "@/components/Forms/FacultyMemberForm";

function Faculty() {
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <div className="bg-[whitesmoke] w-full h-full p-8">
      <div className="flex items-center justify-between">
        <h1
          className={`text-4xl ${open_sans.className} font-bold text-gray-700`}
        >
          Faculty Member
        </h1>
        <Sheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          onOpenChange={setSheetOpen}
        >
          <SheetTrigger asChild>
            <Button variant="primary">
              <PlusCircleIcon />
              <span className="ml-2">Add new faculty member</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="overflow-y-auto h-screen">
            <SheetHeader>
              <SheetTitle className="text-2xl border-b pb-3">
                Add new funding
              </SheetTitle>
            </SheetHeader>
            <div className="w-full">
              <FacultyMemberForm onSheetOpenChange={setSheetOpen} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div>
        <DataTable />
      </div>
    </div>
  );
}

export default Faculty;
