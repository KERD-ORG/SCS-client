"use client";
import DataTable from "@/components/DataTable/DataTable";
import UniversityForm from "@/components/Forms/UniversityForm";
import { Button } from "@/components/ui/button";
import { open_sans } from "@/lib/fonts";
import { PlusCircleIcon } from "lucide-react";
import { Suspense, useState } from "react";
import Loading from "@/components/Loading";
// import { fetchData } from '@/utils/fetchData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { redirect } from "next/navigation";

export default function University() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="w-full ">
      <div className="flex items-center justify-between">
        <h1
          className={`text-4xl ${open_sans.className} font-bold text-gray-700`}
        >
          University
        </h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="primary" onClick={setDialogOpen}>
              <PlusCircleIcon />
              <span className="ml-2">Add new university</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[700px] max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center font-semibold mb-4">
                Add New University
              </DialogTitle>
              <UniversityForm onDialogOpenChange={setDialogOpen} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
