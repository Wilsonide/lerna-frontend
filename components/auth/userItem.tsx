"use client";
import useAuth from "@/app/hooks/useAuth";
import { LogoutButton } from "@/components/auth/logoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronsLeftRight, LogOut, User } from "lucide-react";

const UserItem = () => {
  // render user item with avatar, name, and email
  const { Auth: user } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role="button"
          className="flex items-center text-sm p-5 w-full hover:bg-primary/5"
        >
          <div className="gap-x-2 flex items-center max-w-37.5">
            <Avatar className="mr-2">
              <AvatarImage src={user?.profile || ""} />
              <AvatarFallback className="bg-sky-500">
                <User className="text-white" />
              </AvatarFallback>
            </Avatar>
            <span className="text-start font-medium line-clamp-1">
              {user?.name}&apos;s Account
            </span>
          </div>
          <ChevronsLeftRight className="rotate-90 ml-2 text-muted-foreground h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80"
        align="start"
        alignOffset={11}
        forceMount
      >
        <div className="flex flex-col space-y-4 p-2">
          <p className="text-xs font-medium leading-none text-muted-foreground">
            {user?.email}
          </p>
          <div className="flex items-center gap-x-2">
            <div className="rounded-md bg-secondary p-1">
              <Avatar className=" h-8 w-8">
                <AvatarImage src={user?.profile || ""} />
                <AvatarFallback className="bg-sky-500">
                  <User className="text-white" />
                </AvatarFallback>
              </Avatar>
            </div>
            <p className="text-sm line-clamp-1">{user?.name}&apos;s Account</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <LogoutButton variant="ghost">
          <DropdownMenuItem className="flex items-center justify-start w-full">
            <LogOut className="h-4 w-4 mr-5" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserItem;
