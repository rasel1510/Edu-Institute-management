"use client";

import React, { useState, useEffect, useRef } from "react";
import { useData } from "@/context/DataContext";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, GraduationCap, LayoutGrid, FileSpreadsheet, Sparkles, X } from "lucide-react";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { students, teachers, classes, setActiveTab } = useData();

  // Listen for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Reset indices on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // Build list of searchable items
  const getSearchItems = () => {
    const items: {
      id: string;
      title: string;
      subtitle: string;
      category: "Students" | "Teachers" | "Classes" | "Navigation";
      icon: any;
      action: () => void;
    }[] = [];

    // Add Navigation
    const pages = [
      { id: "dashboard", name: "Dashboard Overview" },
      { id: "students", name: "Student Directory" },
      { id: "teachers", name: "Teacher Profiles" },
      { id: "classes", name: "Classes Scheduling" },
      { id: "attendance", name: "Attendance Tracker" },
      { id: "exams", name: "Exams Schedule & Grades" },
      { id: "fees", name: "Fee Management & Invoices" },
      { id: "reports", name: "Academic Analytics" },
      { id: "settings", name: "System Settings" },
    ];
    pages.forEach((p) => {
      items.push({
        id: `nav-${p.id}`,
        title: `Go to ${p.name}`,
        subtitle: "Application Page",
        category: "Navigation",
        icon: LayoutGrid,
        action: () => setActiveTab(p.id),
      });
    });

    // Add Students
    students.forEach((s) => {
      items.push({
        id: `stu-${s.id}`,
        title: s.name,
        subtitle: `${s.grade} • ${s.id}`,
        category: "Students",
        icon: User,
        action: () => {
          setActiveTab("students");
          // Here we could set a selected student search state if desired
        },
      });
    });

    // Add Teachers
    teachers.forEach((t) => {
      items.push({
        id: `tch-${t.id}`,
        title: t.name,
        subtitle: `${t.subject} Department • ${t.id}`,
        category: "Teachers",
        icon: GraduationCap,
        action: () => {
          setActiveTab("teachers");
        },
      });
    });

    // Add Classes
    classes.forEach((c) => {
      items.push({
        id: `cls-${c.id}`,
        title: c.name,
        subtitle: `${c.room} • ${c.schedule}`,
        category: "Classes",
        icon: FileSpreadsheet,
        action: () => {
          setActiveTab("classes");
        },
      });
    });

    // Filter by query
    if (!query) return items.slice(0, 8); // default show top 8
    
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filteredItems = getSearchItems();

  // Keyboard navigation inside list
  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        setIsOpen(false);
      }
    }
  };

  return (
    <>
      {/* Visual Command Tip in top-bar */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-900/60 text-slate-400 hover:text-slate-200 transition text-xs select-none"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Search...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-slate-700 bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-300">
          <span>Ctrl</span>K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg glass-panel-glow bg-slate-950/95 rounded-2xl shadow-2xl shadow-brand-purple/20 overflow-hidden border border-violet-500/20"
            >
              {/* Search input header */}
              <div className="flex items-center px-4 py-3.5 border-b border-slate-900 gap-3">
                <Search className="w-5 h-5 text-brand-cyan" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleListKeyDown}
                  type="text"
                  placeholder="Type a command, student, teacher, or class..."
                  className="flex-1 bg-transparent border-0 outline-none text-slate-100 placeholder-slate-500 text-sm py-1 font-sans"
                />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md hover:bg-white/5 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="max-h-[350px] overflow-y-auto p-2 space-y-1">
                {filteredItems.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-sm">
                    <Sparkles className="w-6 h-6 mx-auto mb-2 text-slate-600 animate-pulse" />
                    No results found for &ldquo;<span className="text-slate-300">{query}</span>&rdquo;
                  </div>
                ) : (
                  filteredItems.map((item, index) => {
                    const Icon = item.icon;
                    const isSelected = index === selectedIndex;

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          item.action();
                          setIsOpen(false);
                        }}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? "bg-gradient-to-r from-brand-blue/30 to-brand-purple/30 text-white border border-brand-purple/30"
                            : "hover:bg-white/5 text-slate-300 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-md ${
                            isSelected ? "bg-brand-purple/40 text-brand-cyan" : "bg-slate-900 text-slate-400"
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                              {item.category}
                            </p>
                            <p className="text-sm font-medium">{item.title}</p>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500">{item.subtitle}</span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer status bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-t border-slate-900 text-[10px] text-slate-500">
                <div className="flex items-center gap-2">
                  <span>Use arrows <span className="font-mono bg-slate-900 px-1 py-0.5 rounded">↑↓</span> to navigate</span>
                  <span>•</span>
                  <span><span className="font-mono bg-slate-900 px-1 py-0.5 rounded">Enter</span> to select</span>
                </div>
                <span>ESC to close</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
