"use client";

import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { motion } from "framer-motion";
import { Palette, Moon, Sun, Sparkles, RotateCcw, Bell, Shield, Monitor, Database, Info } from "lucide-react";

const themes = [
  {
    id: "cosmic",
    name: "Cosmic Neon",
    description: "Deep space dark theme with violet and cyan glowing accents.",
    colors: ["#0B0F19", "#8B5CF6", "#3B82F6", "#06B6D4"],
    active: true,
  },
  {
    id: "emerald",
    name: "Emerald Night",
    description: "Dark forest aesthetic with emerald green and teal highlights.",
    colors: ["#0A1A14", "#10B981", "#059669", "#14B8A6"],
    active: false,
  },
  {
    id: "amber",
    name: "Amber Horizon",
    description: "Warm dusk theme with amber gold and orange sunset tones.",
    colors: ["#1A1008", "#F59E0B", "#D97706", "#EF4444"],
    active: false,
  },
];

export default function SettingsView() {
  const { students, teachers, classes, exams, fees, notifications } = useData();
  const [selectedTheme, setSelectedTheme] = useState("cosmic");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  const handleThemeSwitch = (themeId: string) => {
    setSelectedTheme(themeId);
    if (themeId !== "cosmic") {
      // In a full implementation, this would swap CSS variables
      alert(`Theme "${themes.find(t => t.id === themeId)?.name}" selected. In production, this swaps the entire design system color tokens.`);
    }
  };

  const handleResetDemo = () => {
    if (confirm("This will reload the application and reset all demo data. Continue?")) {
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">System Settings</h1>
        <p className="text-slate-400 text-xs md:text-sm mt-0.5">
          Customize interface preferences, manage themes, and configure system behavior.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column — Main Settings */}
        <div className="lg:col-span-8 space-y-6">
          {/* Theme Selector */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/80">
            <h3 className="text-sm font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2 mb-5">
              <Palette className="w-4 h-4 text-brand-purple" />
              Interface Theme
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themes.map((theme) => {
                const isSelected = selectedTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeSwitch(theme.id)}
                    className={`relative p-4 rounded-xl border text-left transition-all duration-300 ${
                      isSelected
                        ? "border-brand-purple bg-brand-purple/10 shadow-lg shadow-brand-purple/10"
                        : "border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/80"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="themeIndicator"
                        className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-brand-cyan shadow-lg shadow-brand-cyan/50"
                      />
                    )}
                    {/* Color swatches */}
                    <div className="flex gap-1.5 mb-3">
                      {theme.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-md border border-white/5"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <p className="text-sm font-bold text-white">{theme.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{theme.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preference Toggles */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-5">
            <h3 className="text-sm font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
              <Monitor className="w-4 h-4 text-brand-blue" />
              Display Preferences
            </h3>

            {/* Toggle Item */}
            {[
              {
                label: "Push Notifications",
                description: "Receive real-time alerts when records change.",
                icon: Bell,
                value: notificationsEnabled,
                setter: setNotificationsEnabled,
              },
              {
                label: "Auto-Save Changes",
                description: "Automatically persist modifications to session storage.",
                icon: Database,
                value: autoSave,
                setter: setAutoSave,
              },
              {
                label: "Compact Table Mode",
                description: "Reduce row padding in data tables for denser views.",
                icon: Monitor,
                value: compactMode,
                setter: setCompactMode,
              },
            ].map((pref) => {
              const Icon = pref.icon;
              return (
                <div
                  key={pref.label}
                  className="flex items-center justify-between py-3 border-b border-slate-900/50 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-850 text-slate-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{pref.label}</p>
                      <p className="text-[10px] text-slate-500">{pref.description}</p>
                    </div>
                  </div>
                  {/* Toggle Switch */}
                  <button
                    onClick={() => pref.setter(!pref.value)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                      pref.value ? "bg-brand-blue" : "bg-slate-800"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                        pref.value ? "translate-x-5.5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Danger Zone */}
          <div className="glass-panel rounded-2xl p-6 border border-red-500/10">
            <h3 className="text-sm font-bold tracking-wider text-red-400 uppercase flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4" />
              System Controls
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Reset all demo data back to defaults. This will clear any students, teachers, 
              attendance records, or exams you have added during this session.
            </p>
            <button
              onClick={handleResetDemo}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/15 text-red-400 font-semibold text-sm transition"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Demo Data
            </button>
          </div>
        </div>

        {/* Right Column — System Info */}
        <div className="lg:col-span-4 space-y-5">
          {/* System stats panel */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
              <Info className="w-4 h-4 text-brand-cyan" />
              System Overview
            </h3>
            <div className="space-y-3">
              {[
                { label: "Total Students", value: students.length },
                { label: "Faculty Members", value: teachers.length },
                { label: "Active Classes", value: classes.length },
                { label: "Scheduled Exams", value: exams.length },
                { label: "Issued Invoices", value: fees.length },
                { label: "System Notifications", value: notifications.length },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between py-2 border-b border-slate-900/40 last:border-b-0">
                  <span className="text-xs text-slate-400">{stat.label}</span>
                  <span className="font-mono text-sm font-bold text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* About card */}
          <div className="glass-panel-glow rounded-2xl p-5 border border-violet-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Neuravixor</p>
                <p className="text-[10px] text-slate-400">v1.0.0 — Interactive Demo</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Educational Institution Management System. Built with Next.js, Tailwind CSS, 
              Framer Motion, and Recharts. All data is client-side and session-scoped — 
              no backend required for this demonstration.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-900/60">
              <p className="text-[10px] text-slate-500">
                © 2026 Neuravixor Systems. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
