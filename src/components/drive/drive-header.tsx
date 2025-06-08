"use client";

// import { useState } from "react"
import Link from "next/link";
// import { usePathname } from "next/navigation"
import { Menu, Settings, HelpCircle, Bell } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DriveSidebar } from "./drive-sidebar";
import LogoutButton from "./logout-button";
// import { useAuth } from "@/lib/use-auth";

export function DriveHeader() {
  // const [searchQuery, setSearchQuery] = useState("")
  // const pathname = usePathname()

  // Get page title based on current path
  // const getPageTitle = () => {
  //     if (pathname === "/drive") return "My Drive"
  //     if (pathname === "/drive/shared") return "Shared with me"
  //     if (pathname === "/drive/starred") return "Starred"
  //     if (pathname === "/drive/trash") return "Trash"

  //     // For folder paths, extract the folder name
  //     if (pathname.startsWith("/drive/folder/")) {
  //         const segments = pathname.split("/")
  //         return segments[segments.length - 1]
  //     }

  //     return "My Drive"
  // }

  // Lấy avatar từ sessionStorage để đồng bộ với profile
  const [profilePicture, setProfilePicture] = useState<string | undefined>(
    typeof window !== "undefined"
      ? sessionStorage.getItem("profilePicture") || undefined
      : undefined
  );
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    function syncAvatar() {
      setProfilePicture(sessionStorage.getItem("profilePicture") || undefined);
    }
    window.addEventListener("profilePictureUpdated", syncAvatar);
    syncAvatar();
    return () => {
      window.removeEventListener("profilePictureUpdated", syncAvatar);
    };
  }, []);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <DriveSidebar />
          </SheetContent>
        </Sheet>

        <Link href="/drive" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M4 22h16a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M2 17v-3a4 4 0 0 1 8 0v3" />
              <circle cx="9" cy="17" r="1" />
              <circle cx="3" cy="17" r="1" />
            </svg>
          </div>
          <span className="text-xl font-semibold">CloudDrive</span>
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4 md:justify-between">
        <div className="hidden max-w-md flex-1 md:block"></div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-700">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Help</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-700">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-700">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  {profilePicture && (
                    <AvatarImage
                      className="object-cover"
                      src={profilePicture}
                      alt="User"
                      onLoad={() => setImgLoaded(true)}
                      style={{ display: imgLoaded ? "block" : "none" }}
                    />
                  )}
                  {!imgLoaded && (
                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={"profile"}>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogoutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
