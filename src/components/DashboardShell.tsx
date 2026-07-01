"use client";

import React from "react";
import { useData } from "@/context/DataContext";
import Sidebar from "@/components/Sidebar";
import CommandPalette from "@/components/CommandPalette";
import NotificationsPanel from "@/components/NotificationsPanel";
import DashboardOverview from "@/components/DashboardOverview";
import StudentsView from "@/components/StudentsView";
import TeachersView from "@/components/TeachersView";
import ClassesView from "@/components/ClassesView";
import AttendanceView from "@/components/AttendanceView";
import ExamsView from "@/components/ExamsView";
import FeesView from "@/components/FeesView";
import ReportsView from "@/components/ReportsView";
import SettingsView from "@/components/SettingsView";
import { Building2, LogOut } from "lucide-react";

export default function DashboardShell() {
  const { activeTab } = useData();

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "students":
        return <StudentsView />;
      case "teachers":
        return <TeachersView />;
      case "classes":
        return <ClassesView />;
      case "attendance":
        return <AttendanceView />;
      case "exams":
        return <ExamsView />;
      case "fees":
        return <FeesView />;
      case "reports":
        return <ReportsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-background mesh-gradient overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-slate-800/60 bg-slate-950/30 backdrop-blur-sm z-20">
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-purple p-[1px]">
                <div className="w-full h-full rounded-lg bg-slate-950 flex items-center justify-center">
                  <Building2 className="w-3.5 h-3.5 text-brand-cyan" />
                </div>
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Neuravixor
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-purple/10 border border-brand-purple/20 text-brand-purple font-bold uppercase tracking-wider">
                Pro
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Command Palette Trigger */}
            <CommandPalette />

            {/* Notifications */}
            <NotificationsPanel />

            {/* User Avatar */}
            <div className="flex items-center gap-2.5 ml-2 pl-3 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white text-xs font-bold">
                AD
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-white leading-tight">Admin User</p>
                <p className="text-[10px] text-slate-500">System Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
