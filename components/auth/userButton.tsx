"use client";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { User, LogOut, LogIn } from "lucide-react";

import { LogoutButton } from "./logoutButton";
import { LoginButton } from "./login-button";
import useAuth from "@/app/hooks/useAuth";

export const UserButton = () => {
  const { auth: user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      {/* ================= TRIGGER ================= */}
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center rounded-full transition hover:scale-105 focus:outline-none">
          <Avatar className="h-9 w-9 border border-slate-200 bg-white">
            <AvatarFallback className="bg-gradient-to-br from-slate-900 to-slate-700 text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      {/* ================= DROPDOWN ================= */}
      <DropdownMenuContent
        className="w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
        align="end"
      >
        {/* ================= LOGGED IN ================= */}
        {user && (
          <>
            <DropdownMenuItem className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:bg-slate-100">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-slate-900 text-white">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">
                  Account
                </span>
                <span className="text-xs text-slate-500 truncate max-w-[180px]">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-2 bg-slate-100" />

            <LogoutButton variant="ghost">
              <DropdownMenuItem className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 focus:bg-red-50">
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </LogoutButton>
          </>
        )}

        {/* ================= LOGGED OUT ================= */}
        {!user && (
          <LoginButton>
            <DropdownMenuItem className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 focus:bg-slate-100">
              <LogIn className="h-4 w-4" />
              Login
            </DropdownMenuItem>
          </LoginButton>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
