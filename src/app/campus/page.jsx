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

function Campus() {
  return (
    <div className="bg-[whitesmoke] w-full h-full p-8">
      <div className="flex items-center justify-between">
        <h1
          className={`text-4xl ${open_sans.className} font-bold text-gray-700`}
        >
          Campus
        </h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="primary">
              <PlusCircleIcon />
              <span className="ml-2">Add new campus</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto w-[450px]">
            <SheetHeader>
              <SheetTitle className="text-xl border-b pb-3">
                Add new campus
              </SheetTitle>
            </SheetHeader>
            <div className="w-full">
              <CampusForm />
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
