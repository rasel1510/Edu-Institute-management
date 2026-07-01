"use client";

import React, { useState, useRef, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { Bell, X, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationsPanel() {
  const { notifications, removeNotification } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: "info" | "warning" | "success") => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case "info":
      default:
        return <Info className="w-4 h-4 text-brand-blue shrink-0" />;
    }
  };

  const getBorderColor = (type: "info" | "warning" | "success") => {
    switch (type) {
      case "success":
        return "border-l-green-500";
      case "warning":
        return "border-l-amber-500";
      case "info":
      default:
        return "border-l-brand-blue";
    }
  };

  return (
    <div ref={panelRef} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-900/60 text-slate-400 hover:text-slate-200 transition"
      >
        <Bell className="w-4 h-4" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-purple text-[9px] text-white font-bold flex items-center justify-center shadow-lg shadow-brand-purple/50">
            {notifications.length > 9 ? "9+" : notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-12 right-0 w-80 md:w-96 glass-panel-glow bg-slate-950/95 rounded-2xl border border-violet-500/15 shadow-2xl shadow-black/50 z-40 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-900">
              <h4 className="text-xs font-bold text-white tracking-wider uppercase">
                Notifications ({notifications.length})
              </h4>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-white/5 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-900/50">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No notifications to display.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] transition border-l-2 ${getBorderColor(n.type)}`}
                  >
                    <div className="mt-0.5">{getIcon(n.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white">{n.title}</p>
                      <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">{n.message}</p>
                      <p className="text-[9px] text-slate-600 mt-1">{n.timestamp}</p>
                    </div>
                    <button
                      onClick={() => removeNotification(n.id)}
                      className="p-1 rounded-md hover:bg-white/5 text-slate-600 hover:text-slate-400 shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
