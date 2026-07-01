"use client";

import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Users, 
  GraduationCap, 
  BookOpen, 
  CalendarDays, 
  ClipboardList, 
  DollarSign, 
  BarChart3, 
  Settings, 
  Building2,
  Menu,
  ChevronLeft,
  ChevronRight,
  Bell
} from "lucide-react";

export default function Sidebar() {
  const { activeTab, setActiveTab, notifications } = useData();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "students", label: "Student Management", icon: Users },
    { id: "teachers", label: "Teacher Profiles", icon: GraduationCap },
    { id: "classes", label: "Classes & Rooms", icon: BookOpen },
    { id: "attendance", label: "Attendance Tracker", icon: CalendarDays },
    { id: "exams", label: "Exams & Scheduling", icon: ClipboardList },
    { id: "fees", label: "Fee Management", icon: DollarSign },
    { id: "reports", label: "Academic Reports", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Count unread notifications (in this demo, we assume success/warning alerts can be read)
  const unreadCount = notifications.length;

  return (
    <motion.div
      animate={{ width: isExpanded ? 240 : 76 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative z-30 flex flex-col h-full glass-panel border-r border-slate-800/80 bg-slate-950/70 py-6"
    >
      {/* Brand Header */}
      <div className="flex items-center px-4 mb-8">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple p-[1.5px] shadow-lg shadow-brand-purple/20">
          <div className="flex items-center justify-center w-full h-full rounded-xl bg-slate-950">
            <Building2 className="w-5.5 h-5.5 text-brand-cyan animate-pulse-glow" />
          </div>
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="ml-3 font-semibold text-lg bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent truncate"
            >
              Neuravixor
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`relative flex items-center w-full p-3.5 rounded-xl transition-all duration-200 outline-none text-left ${
                isActive 
                  ? "text-white" 
                  : "text-slate-300 hover:text-slate-100 hover:bg-white/5"
              }`}
            >
              {/* Active Indicator Background */}
              {isActive && (
                <motion.div
                  layoutId="activeSidebarIndicator"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-blue/80 to-brand-purple/80 shadow-lg shadow-brand-blue/30"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon Container */}
              <div className="relative z-10 flex items-center justify-center">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "scale-110" : ""}`} />
              </div>

              {/* Label */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="relative z-10 ml-4 text-sm font-medium tracking-wide truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Muted Tooltip if Collapsed */}
              {!isExpanded && hoveredItem === item.id && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 20 }}
                  className="absolute left-10 py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-white whitespace-nowrap shadow-xl shadow-black/50 pointer-events-none"
                >
                  {item.label}
                </motion.div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Controls */}
      <div className="px-3 pt-4 border-t border-slate-900 flex flex-col items-center gap-4">
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center w-full p-3 rounded-xl text-slate-300 hover:text-slate-100 hover:bg-white/5 transition-all outline-none"
        >
          {isExpanded ? (
            <div className="flex items-center w-full gap-4">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Collapse Menu</span>
            </div>
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
