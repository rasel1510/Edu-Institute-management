"use client";

import React, { useMemo } from "react";
import { useData } from "@/context/DataContext";
import { motion } from "framer-motion";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  ArrowUpRight,
  TrendingDown,
  DollarSign,
  ClipboardList,
  BarChart3,
  CalendarCheck
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar,
  Tooltip
} from "recharts";

export default function DashboardOverview() {
  const { students, teachers, classes, attendance, fees, exams, notifications, setActiveTab } = useData();

  // --- Reactive Statistics (Offset to match the uploaded design's scale, yet remain interactive) ---
  const totalStudents = useMemo(() => 2442 + students.length, [students]);
  const totalTeachers = useMemo(() => 176 + teachers.length, [teachers]);
  const totalClasses = useMemo(() => 116 + classes.length, [classes]);

  // Compute attendance percentages based on active logs
  const attendanceStats = useMemo(() => {
    // Find latest date in logs
    if (attendance.length === 0) {
      return { present: 92, absent: 5, leave: 3 };
    }
    const dates = [...new Set(attendance.map(a => a.date))].sort();
    const latestDate = dates[dates.length - 1] || "2026-07-01";
    const todayRecords = attendance.filter(a => a.date === latestDate);
    
    if (todayRecords.length === 0) {
      return { present: 92, absent: 5, leave: 3 };
    }
    
    const total = todayRecords.length;
    const presentCount = todayRecords.filter(r => r.status === "Present").length;
    const absentCount = todayRecords.filter(r => r.status === "Absent").length;
    const leaveCount = todayRecords.filter(r => r.status === "Leave").length;
    
    return {
      present: Math.round((presentCount / total) * 100) || 92,
      absent: Math.round((absentCount / total) * 100) || 5,
      leave: Math.round((leaveCount / total) * 100) || 3
    };
  }, [attendance]);

  const pieData = [
    { name: "Present", value: attendanceStats.present, color: "#3b82f6" },
    { name: "Absent", value: attendanceStats.absent, color: "#8b5cf6" },
    { name: "Leave", value: attendanceStats.leave, color: "#06b6d4" },
  ];

  // Attendance Line Sparkline Data
  const attendanceTrendData = [
    { day: "Mon", rate: 90 },
    { day: "Tue", rate: 94 },
    { day: "Wed", rate: 91 },
    { day: "Thu", rate: 93 },
    { day: "Fri", rate: attendanceStats.present }
  ];

  // Fees collected trend
  const totalCollectedFees = useMemo(() => {
    const paidFees = fees.filter(f => f.status === "Paid").reduce((sum, f) => sum + f.amount, 0);
    return 235680 + paidFees; // Base offset to match design + live payment updates
  }, [fees]);

  // Bottom row sparkline bar chart data
  const feeChartData = [
    { name: "Jan", amt: 12000 },
    { name: "Feb", amt: 19000 },
    { name: "Mar", amt: 15000 },
    { name: "Apr", amt: 22000 },
    { name: "May", amt: 30000 },
    { name: "Jun", amt: 25000 },
    { name: "Jul", amt: 32000 },
  ];

  const classChartData = [
    { name: "Math", val: 30 },
    { name: "Phys", val: 24 },
    { name: "Eng", val: 28 },
    { name: "Chem", val: 18 },
    { name: "Bio", val: 20 },
    { name: "Hist", val: 15 },
    { name: "CS", val: 25 },
  ];

  const examChartData = [
    { name: "W1", val: 2 },
    { name: "W2", val: 5 },
    { name: "W3", val: 3 },
    { name: "W4", val: 8 },
    { name: "W5", val: 4 },
  ];

  const reportChartData = [
    { name: "M1", val: 10 },
    { name: "M2", val: 15 },
    { name: "M3", val: 22 },
    { name: "M4", val: 32 },
  ];

  const itemTransition = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-slate-200 text-xs md:text-sm mt-0.5">
            Real-time analytics and institute overview.
          </p>
        </div>
        
        {/* Quick Action Info Banner */}
        <div className="flex items-center gap-3 py-1.5 px-3 rounded-lg border border-violet-500/20 bg-violet-500/5 text-violet-300 text-xs">
          <CalendarCheck className="w-4 h-4 text-brand-cyan animate-pulse" />
          <span>Academic Term: <b>Fall 2026</b></span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <motion.div 
          {...itemTransition}
          className="glass-panel hover:glass-panel-glow p-5 rounded-2xl relative overflow-hidden group cursor-pointer transition-all"
          onClick={() => setActiveTab("students")}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Total Students</p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-2 font-mono">
                {totalStudents.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-brand-blue/10 border border-brand-blue/20 text-brand-blue group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-brand-cyan font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+4.2% from last month</span>
          </div>
        </motion.div>

        {/* Total Teachers */}
        <motion.div 
          {...itemTransition}
          transition={{ delay: 0.05 }}
          className="glass-panel hover:glass-panel-glow p-5 rounded-2xl relative overflow-hidden group cursor-pointer transition-all"
          onClick={() => setActiveTab("teachers")}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Total Teachers</p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-2 font-mono">
                {totalTeachers}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-brand-cyan font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+2 new teachers added</span>
          </div>
        </motion.div>

        {/* Total Classes */}
        <motion.div 
          {...itemTransition}
          transition={{ delay: 0.1 }}
          className="glass-panel hover:glass-panel-glow p-5 rounded-2xl relative overflow-hidden group cursor-pointer transition-all"
          onClick={() => setActiveTab("classes")}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Total Classes</p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-2 font-mono">
                {totalClasses}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-300">
            <span>Occupancy Rate: <b>90%</b></span>
          </div>
        </motion.div>

        {/* Today's Attendance */}
        <motion.div 
          {...itemTransition}
          transition={{ delay: 0.15 }}
          className="glass-panel hover:glass-panel-glow p-5 rounded-2xl relative overflow-hidden group cursor-pointer transition-all"
          onClick={() => setActiveTab("attendance")}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Today's Attendance</p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-2 font-mono">
                {attendanceStats.present}%
              </h3>
            </div>
            <div className="w-24 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrendData}>
                  <defs>
                    <linearGradient id="attendanceGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#22c55e" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#attendanceGlow)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-green-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Optimal attendance index</span>
          </div>
        </motion.div>
      </div>

      {/* Middle Row: Student Management, Teacher Profiles, Attendance Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
        {/* Student Management Column (Takes 3/10) */}
        <motion.div 
          {...itemTransition}
          className="lg:col-span-3 glass-panel rounded-2xl p-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold tracking-wider text-slate-300 uppercase">
                Student Management
              </h4>
              <button 
                onClick={() => setActiveTab("students")}
                className="text-xs text-brand-blue hover:text-brand-cyan hover:underline transition"
              >
                View All
              </button>
            </div>
            <div className="space-y-3.5">
              {students.slice(0, 4).map((stu) => (
                <div key={stu.id} className="flex items-center gap-3 group">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={stu.avatar} 
                      alt={stu.name} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-800 group-hover:border-brand-blue transition"
                    />
                    <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-slate-950 ${
                      stu.status === "Active" ? "bg-green-500" : stu.status === "Grace Period" ? "bg-amber-500" : "bg-red-500"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{stu.name}</p>
                    <p className="text-xs text-slate-300 truncate">{stu.grade} • {stu.id}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-brand-cyan group-hover:bg-brand-blue/10 group-hover:border-brand-blue/30 transition">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => setActiveTab("students")}
            className="w-full mt-5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            Manage Enrolled Students
          </button>
        </motion.div>

        {/* Teacher Profiles Column (Takes 3/10) */}
        <motion.div 
          {...itemTransition}
          transition={{ delay: 0.05 }}
          className="lg:col-span-3 glass-panel rounded-2xl p-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold tracking-wider text-slate-300 uppercase">
                Teacher Profiles
              </h4>
              <button 
                onClick={() => setActiveTab("teachers")}
                className="text-xs text-brand-blue hover:text-brand-cyan hover:underline transition"
              >
                View All
              </button>
            </div>
            <div className="space-y-3.5">
              {teachers.slice(0, 3).map((tch) => (
                <div key={tch.id} className="flex items-center gap-3 group">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={tch.avatar} 
                      alt={tch.name} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-800 group-hover:border-brand-purple transition"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{tch.name}</p>
                    <p className="text-xs text-slate-300 truncate">{tch.subject} Instructor</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple">
                    Faculty
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => setActiveTab("teachers")}
            className="w-full mt-5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            View Faculty Directory
          </button>
        </motion.div>

        {/* Attendance Overview (Takes 4/10) */}
        <motion.div 
          {...itemTransition}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 glass-panel rounded-2xl p-5 flex flex-col justify-between"
        >
          <div>
            <h4 className="text-sm font-bold tracking-wider text-slate-300 uppercase mb-4">
              Attendance Overview
            </h4>
            <div className="flex items-center justify-around gap-4 h-48">
              {/* Donut chart */}
              <div className="relative w-36 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip 
                      contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px" }}
                      itemStyle={{ color: "#fff" }}
                    />
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Mid Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-white font-mono">{attendanceStats.present}%</span>
                  <span className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">Present</span>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-3.5">
                {pieData.map((p, index) => (
                  <div key={p.name} className="flex items-center gap-2.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shadow-lg"
                      style={{ 
                        backgroundColor: p.color, 
                        boxShadow: `0 0 8px ${p.color}` 
                      }} 
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-300">{p.name}</p>
                      <p className="text-sm font-bold text-white font-mono">{p.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab("attendance")}
            className="w-full py-2.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            Track & Log Student Attendance
          </button>
        </motion.div>
      </div>

      {/* Bottom Row: Fees, Classes Capacity, Upcoming Exams, Academic Reports */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fee Management */}
        <motion.div 
          {...itemTransition}
          className="glass-panel hover:glass-panel-glow rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between h-48 group"
          onClick={() => setActiveTab("fees")}
        >
          <div>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Fee Management</p>
            <p className="text-[11px] text-slate-450 mt-1">Total Collected</p>
            <h4 className="text-xl font-bold text-white font-mono mt-1">
              ${totalCollectedFees.toLocaleString()}
            </h4>
          </div>
          
          <div className="h-16 mt-2 relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feeChartData}>
                <defs>
                  <linearGradient id="barFee" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <Bar dataKey="amt" fill="url(#barFee)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Classes */}
        <motion.div 
          {...itemTransition}
          transition={{ delay: 0.05 }}
          className="glass-panel hover:glass-panel-glow rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between h-48 group"
          onClick={() => setActiveTab("classes")}
        >
          <div>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Classes</p>
            <p className="text-[11px] text-slate-450 mt-1">Total Classes</p>
            <h4 className="text-xl font-bold text-white font-mono mt-1">
              {totalClasses}
            </h4>
          </div>
          
          <div className="h-16 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classChartData}>
                <defs>
                  <linearGradient id="barClass" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <Bar dataKey="val" fill="url(#barClass)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Upcoming Exams */}
        <motion.div 
          {...itemTransition}
          transition={{ delay: 0.1 }}
          className="glass-panel hover:glass-panel-glow rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between h-48 group"
          onClick={() => setActiveTab("exams")}
        >
          <div>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Exams</p>
            <p className="text-[11px] text-slate-450 mt-1">Upcoming Exams</p>
            <h4 className="text-xl font-bold text-white font-mono mt-1">
              {exams.length}
            </h4>
          </div>
          
          <div className="h-16 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={examChartData}>
                <defs>
                  <linearGradient id="barExam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <Bar dataKey="val" fill="url(#barExam)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Academic Reports */}
        <motion.div 
          {...itemTransition}
          transition={{ delay: 0.15 }}
          className="glass-panel hover:glass-panel-glow rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between h-48 group"
          onClick={() => setActiveTab("reports")}
        >
          <div>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Academic Reports</p>
            <p className="text-[11px] text-slate-450 mt-1">Reports Generated</p>
            <h4 className="text-xl font-bold text-white font-mono mt-1">
              32
            </h4>
          </div>
          
          <div className="h-16 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportChartData}>
                <defs>
                  <linearGradient id="barReport" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <Bar dataKey="val" fill="url(#barReport)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
