import SearchFilter from "@/components/SearchFilter";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ListFilter, SearchIcon } from "lucide-react";
function Search() {
  return (
    <div className="min-h-screen">
      <div className="mt-8 max-w-xl mx-auto">
        <div className="flex items-center space-x-2">
          <Input className="rounded-lg" placeholder="Search..." type="search" />
          <Button variant="primary" className="rounded-lg">
            <SearchIcon />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost">
                <ListFilter className="text-gray-700" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl overflow-y-auto" style={{maxHeight: 'calc(100vh  - 100px)'}}>
              <DialogHeader className={""}>
                <DialogTitle className="text-center text-3xl py-4 border-b-2 sticky top-3 -translate-y-1/2 bg-white">
                  Advanced Search
                </DialogTitle>
                <SearchFilter />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default Search;
