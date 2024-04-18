"use client"

import DataTable from "@/components/DataTable/DataTable";
import CampusForm from "@/components/Forms/CampusForm";
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

function Campus() {

  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <div className="bg-[whitesmoke] w-full h-full p-8">
      <div className="flex items-center justify-between">
        <h1
          className={`text-4xl ${open_sans.className} font-bold text-gray-700`}
        >
          Campus
        </h1>
        <Sheet open={sheetOpen}  onClose={() => setSheetOpen(false)} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="primary">
              <PlusCircleIcon />
              <span className="ml-2">Add new campus</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto h-screen" side="top">
            <SheetHeader>
              <SheetTitle className="text-2xl border-b pb-3">
                Add new campus
              </SheetTitle>
            </SheetHeader>
            <div className="w-full">
              <CampusForm onSheetOpenChange={setSheetOpen} />
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

export default Campus;
