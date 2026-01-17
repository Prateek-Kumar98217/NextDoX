"use client";

import type React from "react";

import { useAuth } from "@/contexts/auth-context";
import { AppSidebar } from "./side-bar";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      redirect("/");
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-18 min-h-screen">{children}</main>
    </div>
  );
}
