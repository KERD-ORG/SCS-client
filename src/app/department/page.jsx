"use client";

import DataTable from "@/components/DataTable/DataTable";
import DepartmentForm from "@/components/Forms/DepartmentForm";
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

function Department() {
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <div className="bg-[whitesmoke] w-full h-full p-8">
      <div className="flex items-center justify-between">
        <h1
          className={`text-4xl ${open_sans.className} font-bold text-gray-700`}
        >
          Department
        </h1>
        <Sheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          onOpenChange={setSheetOpen}
        >
          <SheetTrigger asChild>
            <Button variant="primary">
              <PlusCircleIcon />
              <span className="ml-2">Add new department</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="overflow-y-auto h-screen">
            <SheetHeader>
              <SheetTitle className="text-2xl border-b pb-3">
                Add new department
              </SheetTitle>
            </SheetHeader>
            <div className="w-full">
              <DepartmentForm onSheetOpenChange={setSheetOpen} />
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

export default Department;
