"use client"

import DataTable from "@/components/DataTable/DataTable";
import UniversityForm from "@/components/Forms/UniversityForm";
import { Button } from "@/components/ui/button";
import { open_sans } from "@/lib/fonts";
import { PlusCircleIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import { useState } from "react";

function University() {
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <div className="bg-[whitesmoke] w-full h-full p-8">
      <div className="flex items-center justify-between">
        <h1
          className={`text-4xl ${open_sans.className} font-bold text-gray-700`}
        >
          University
        </h1>
        <Sheet open={sheetOpen}  onClose={() => setSheetOpen(false)} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="primary">
              <PlusCircleIcon />
              <span className="ml-2">Add new university</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='top' className="!h-screen !overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-2xl border-b pb-3">
                Add new university
              </SheetTitle>
            </SheetHeader>
            <div className="w-full ">
              <UniversityForm onSheetOpenChange={setSheetOpen} />
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

export default University;
