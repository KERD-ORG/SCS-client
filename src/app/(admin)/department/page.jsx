"use client";

import DataTable from "@/components/DataTable/DataTable";
import DepartmentForm from "@/components/Forms/DepartmentForm";
import { Button } from "@/components/ui/button";
import { open_sans } from "@/lib/fonts";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const data = [
  {
    id: 1,
    name: "Environmental Science test",
    campus: "Idaho falls1",
    college: "College of natural resources",
    operator: "Ahnaf Hasan",
    status: "Active",
    // logo: "https://github.com/shadcn.png",
  },
  {
    id: 2,
    name: "Environmental Science test",
    campus: "Idaho falls2",
    college: "College of natural resources",
    operator: "Ahnaf Hasan",
    status: "active",
    // logo: "",
  },
  {
    id: 3,
    name: "Environmental Science test",
    campus: "Idaho falls3",
    college: "College of natural resources",
    operator: "Ahnaf Hasan",
    status: "not active",
    // logo: "https://github.com/shadcn.png",
  },
  {
    id: 4,
    name: "Environmental Science test",
    campus: "Idaho falls4",
    college: "College of natural resources",
    operator: "Ahnaf Hasan",
    status: "active",
    // logo: "",
  },
];

function Department() {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <div className="bg-[whitesmoke] w-full h-full p-8">
      <div className="flex items-center justify-between">
        <h1
          className={`text-4xl ${open_sans.className} font-bold text-gray-700`}
        >
          Department
        </h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="primary">
              <PlusCircleIcon />
              <span className="ml-2">Add new department</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[700px] max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center mb-4 font-semibold">
                Add New Department
              </DialogTitle>
              <DepartmentForm onDialogOpenChange={setDialogOpen} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <DataTable data={data} />
      </div>
    </div>
  );
}

export default Department;
