"use client";

import { DataProvider } from "@/context/DataContext";
import DashboardShell from "@/components/DashboardShell";

export default function DashboardPage() {
  return (
    <DataProvider>
      <DashboardShell />
    </DataProvider>
  );
}
