"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { open_sans } from "@/lib/fonts";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillFund } from "react-icons/ai";
import { BsBookshelf } from "react-icons/bs";
import { FaUniversity } from "react-icons/fa";
import { PiBuildingsFill } from "react-icons/pi";

function Sidebar() {
  const activeMenu = "university";
  const pathname = usePathname();

  return (
    <nav className="bg-gray-100/30 flex flex-col shadow-xl h-screen w-20 hover:w-80 group p-4 transition-[width] ease-in overflow-hidden">
      <div className="p-2 group-hover:py-4 overflow-hidden rounded group-hover:shadow flex items-center group-hover:bg-white">
        <Popover>
          <PopoverTrigger>
            <div className="flex items-center">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback
                  className={`!px-2 bg-blue-500 text-white font-bold ${open_sans.className}`}
                >
                  CN
                </AvatarFallback>
              </Avatar>
              <div
                className={`min-w-[200px] ml-4 text-left ${open_sans.className} `}
              >
                <h3 className={`font-medium`}>Ahnaf Hasan Shifat</h3>
                <h5 className="text-xs text-gray-700">test@test.com</h5>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="max-w-40 relative !left-4">
            <div className="flex flex-col gap-1">
              <Button variant="outline">
                <User size={20} />
                <span className="ml-2">Profile</span>
              </Button>
              <Button variant="destructive">
                <LogOut size={20} />
                <span className="ml-2">Logout</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <ul
        className={`grid list-none space-y-2 pb-2 mt-8 ${open_sans.className}`}
      >
        <li className="flex w-full">
          <Link
            className={`flex w-full p-3 px-4 items-center text-lg ${
              pathname === "/university"
                ? "text-white font-semibold rounded bg-violet-500"
                : "text-gray-500 "
            }`}
            href={"/university"}
          >
            <FaUniversity size={25} />
            <span className="ml-6">University</span>
          </Link>
        </li>
        <li className="w-full flex">
          <Link
            className={`flex w-full p-3 px-4 items-center text-lg ${
              pathname === "/department"
                ? "text-white font-semibold rounded bg-violet-500"
                : "text-gray-500 "
            }`}
            href={"/department"}
          >
            <BsBookshelf size={25} />
            <span className="ml-6">Department</span>
          </Link>
        </li>
        <li className="w-full flex">
          <Link
            className={`flex w-full p-3 px-4 items-center text-lg ${
              pathname === "/funding"
                ? "text-white font-semibold rounded bg-violet-500"
                : "text-gray-500 "
            }`}
            href={"/funding"}
          >
            <AiFillFund size={25} />
            <span className="ml-6">Funding</span>
          </Link>
        </li>
        <li className="w-full flex">
          <Link
            className={`flex w-full p-3 px-4 items-center text-lg ${
              pathname === "/college"
                ? "text-white font-semibold rounded bg-violet-500"
                : "text-gray-500 "
            }`}
            href={"/college"}
          >
            <PiBuildingsFill size={25} />
            <span className="ml-6">College</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
