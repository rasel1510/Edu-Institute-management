"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  ClipboardList,
  DollarSign,
  BarChart3,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Shield,
  Zap,
  Globe,
} from "lucide-react";

const stats = [
  { label: "Students Managed", value: "2,450+", icon: Users },
  { label: "Faculty Members", value: "180+", icon: GraduationCap },
  { label: "Active Classes", value: "120+", icon: BookOpen },
  { label: "Fees Collected", value: "$245K+", icon: DollarSign },
];

const features = [
  {
    title: "Student Management",
    description: "Enroll, track, and manage student profiles with real-time attendance monitoring and academic history.",
    icon: Users,
    color: "#3b82f6",
  },
  {
    title: "Teacher Profiles",
    description: "Comprehensive faculty directory with schedules, biographies, and department management.",
    icon: GraduationCap,
    color: "#8b5cf6",
  },
  {
    title: "Attendance Tracking",
    description: "Interactive daily roster with instant present/absent/leave toggles and live analytics.",
    icon: CalendarDays,
    color: "#06b6d4",
  },
  {
    title: "Exam Scheduling",
    description: "Create exam rosters, assign marks, and maintain a complete gradebook per student.",
    icon: ClipboardList,
    color: "#ec4899",
  },
  {
    title: "Fee Management",
    description: "Issue invoices, record payments, and track overdue accounts with financial dashboards.",
    icon: DollarSign,
    color: "#10b981",
  },
  {
    title: "Academic Reports",
    description: "Subject competency charts, GPA standings, and performance correlation analytics.",
    icon: BarChart3,
    color: "#f59e0b",
  },
];

const capabilities = [
  "Real-time interactive dashboard with live data updates",
  "Global command palette (Ctrl+K) for instant search",
  "Glassmorphism dark UI with neon accents",
  "CRUD operations for students, teachers, and classes",
  "Attendance tracking with donut chart analytics",
  "Grade sheets and exam scheduling system",
  "Invoice management with payment recording",
  "Notification feed with action alerts",
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand-purple/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-blue/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-cyan/3 rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-slate-800/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple p-[1.5px]">
            <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center">
              <Building2 className="w-4.5 h-4.5 text-brand-cyan" />
            </div>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Neuravixor
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-white font-semibold text-sm hover:brightness-110 transition shadow-lg shadow-brand-purple/20"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 md:px-12 pt-20 md:pt-32 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <div
            className={`space-y-8 transition-all duration-1000 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Next-Generation Institution Management
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              <span className="text-white">Educational</span>
              <br />
              <span className="text-white">Institution</span>
              <br />
              <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-cyan bg-clip-text text-transparent">
                Management System
              </span>
            </h1>

            <p className="text-slate-400 text-base md:text-lg max-w-lg leading-relaxed">
              Manage students, teachers, attendance, exams, and fees — all from a single, 
              beautifully designed command center with real-time analytics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold text-sm hover:brightness-110 transition shadow-xl shadow-brand-purple/25 active:scale-[0.98]"
              >
                Enter Live Dashboard
                <ArrowRight className="w-4.5 h-4.5" />
              </Link>
              <div className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-slate-800 text-slate-400 text-sm font-medium">
                <Shield className="w-4 h-4 text-brand-cyan" />
                No login required — Full interactive demo
              </div>
            </div>
          </div>

          {/* Right — Floating Dashboard Preview */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <div className="relative">
              {/* Glow behind */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/20 to-brand-purple/20 rounded-3xl blur-2xl" />

              {/* Card */}
              <div className="relative glass-panel-glow rounded-2xl border border-violet-500/15 p-6 animate-float">
                {/* Mini Dashboard Header */}
                <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-800/60">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-purple p-[1px]">
                    <div className="w-full h-full rounded-lg bg-slate-950 flex items-center justify-center">
                      <Building2 className="w-3 h-3 text-brand-cyan" />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white tracking-wide">Dashboard</span>
                  <div className="ml-auto flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/60" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/60" />
                    <div className="w-2 h-2 rounded-full bg-green-500/60" />
                  </div>
                </div>

                {/* Mini Stat Cards */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: "Total Students", value: "2,450", color: "text-brand-blue" },
                    { label: "Total Teachers", value: "180", color: "text-brand-purple" },
                    { label: "Total Classes", value: "120", color: "text-brand-cyan" },
                    { label: "Attendance", value: "92%", color: "text-green-400" },
                  ].map((s) => (
                    <div key={s.label} className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-3">
                      <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">{s.label}</p>
                      <p className={`text-lg font-bold font-mono mt-1 ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Mini Bar Chart Placeholder */}
                <div className="bg-slate-900/40 border border-slate-800/40 rounded-xl p-3">
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-2">Fee Collections</p>
                  <div className="flex items-end gap-1.5 h-12">
                    {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-gradient-to-t from-brand-blue/30 to-brand-blue/80"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="relative z-10 border-y border-slate-800/40 bg-slate-950/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="inline-flex p-2.5 rounded-xl bg-brand-purple/10 border border-brand-purple/10 mb-3">
                  <Icon className="w-5 h-5 text-brand-purple" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white font-mono">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/15 text-brand-blue text-xs font-semibold mb-4">
              <Zap className="w-3.5 h-3.5" />
              Complete Management Suite
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Everything You Need, In One Place
            </h2>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
              Six powerful modules designed to streamline every aspect of educational administration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass-panel hover:glass-panel-glow rounded-2xl p-6 border border-slate-800/80 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 border"
                    style={{
                      backgroundColor: `${feature.color}10`,
                      borderColor: `${feature.color}30`,
                      color: feature.color,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capabilities Checklist */}
      <section className="relative z-10 px-6 md:px-12 pb-20 md:pb-28">
        <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-8 md:p-12 border border-slate-800/80">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                Built for Modern Institutions
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                A complete frontend solution featuring interactive data management, 
                beautiful analytics, and premium UI design — ready for client presentations.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-white font-semibold text-sm hover:brightness-110 transition shadow-lg shadow-brand-purple/20"
              >
                Try It Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {capabilities.map((cap) => (
                <div key={cap} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 leading-relaxed">{cap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/40 bg-slate-950/30 py-8">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-purple p-[1px]">
              <div className="w-full h-full rounded-lg bg-slate-950 flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5 text-brand-cyan" />
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-400">
              Neuravixor
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span>© 2026 Neuravixor Systems</span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              Educational Institution Management
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
