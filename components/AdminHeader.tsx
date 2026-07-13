"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";

interface AdminHeaderProps {
  title: string;
  badgeText?: string | number;
}

export default function AdminHeader({ title, badgeText }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-border px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="font-bold text-text-dark text-lg">{title}</h1>
        {badgeText !== undefined && (
          <span className="bg-blue-light text-blue-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
            {badgeText}
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-blue-light text-blue-primary flex items-center justify-center font-bold text-sm">
          A
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-text-mid hover:text-red-500 hover:bg-red-50 flex items-center gap-1.5 h-8 px-2 rounded-lg"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-xs font-semibold">Sign Out</span>
        </Button>
      </div>
    </header>
  );
}
