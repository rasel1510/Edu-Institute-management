"use client";

import React, { useMemo } from "react";
import { useData } from "@/context/DataContext";
import { BarChart3, LineChart, PieChart as PieIcon, Award, FileSpreadsheet, Download } from "lucide-react";
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart as ReLineChart, 
  Line, 
  PieChart as RePieChart, 
  Pie, 
  Cell 
} from "recharts";

export default function ReportsView() {
  const { students } = useData();

  // Subject competency data
  const subjectAverages = [
    { subject: "Math", average: 84, color: "#3b82f6" },
    { subject: "Physics", average: 76, color: "#8b5cf6" },
    { subject: "English", average: 88, color: "#06b6d4" },
    { subject: "Chemistry", average: 81, color: "#ec4899" },
    { subject: "Biology", average: 83, color: "#10b981" },
    { subject: "History", average: 90, color: "#f59e0b" },
  ];

  // Correlation: Attendance vs Grade Index (calculated from student profiles for clean demonstration)
  const correlationData = useMemo(() => {
    return students.map((s) => {
      // Approximate grade index based on attendance rate and minor randomized factors
      // e.g. Sophia (98% attendance) -> 96 grade, James (70% attendance) -> 64 grade.
      const baseGrade = 40 + (s.attendanceRate * 0.55);
      const randOffset = (s.id.charCodeAt(5) % 8) - 4; // pseudo-random based on id
      const grade = Math.min(100, Math.round(baseGrade + randOffset));

      return {
        name: s.name,
        attendance: s.attendanceRate,
        gradeIndex: grade
      };
    }).sort((a, b) => a.attendance - b.attendance);
  }, [students]);

  // GPA Distribution categories
  const gpaCategories = [
    { name: "First Honors (GPA 3.8+)", value: 3, color: "#06b6d4" },
    { name: "Second Honors (GPA 3.5-3.8)", value: 4, color: "#3b82f6" },
    { name: "Satisfactory (GPA 3.0-3.5)", value: 5, color: "#8b5cf6" },
    { name: "Unsatisfactory (GPA < 3.0)", value: 2, color: "#ef4444" },
  ];

  const handleExport = () => {
    alert("Exporting official academic audit. PDF generated successfully.");
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Academic Reports</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-0.5">
            Statistical analysis of subject competencies, GPA standings, and performance correlations.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="glow-btn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-750 text-white font-semibold text-sm transition"
        >
          <Download className="w-4 h-4 text-brand-cyan" />
          <span>Export Analytics</span>
        </button>
      </div>

      {/* Main Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Subject competency (Takes 8/12) */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between h-96">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-blue" />
              Subject Competency Index
            </h3>
            <span className="text-[10px] text-slate-500 font-semibold font-mono">TERM AVERAGE COMPARISON</span>
          </div>
          
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAverages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barBlueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="subject" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px" }}
                  labelStyle={{ color: "#94a3b8" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Bar dataKey="average" fill="url(#barBlueGrad)" radius={[5, 5, 0, 0]} barSize={36}>
                  {subjectAverages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GPA Standing (Takes 4/12) */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between h-96">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-brand-purple" />
              GPA Rank Standing
            </h3>
          </div>
          
          {/* Donut chart */}
          <div className="relative w-full h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={gpaCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {gpaCategories.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
                  itemStyle={{ color: "#fff" }}
                />
              </RePieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <Award className="w-6 h-6 text-brand-cyan" />
              <span className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Honors</span>
            </div>
          </div>

          {/* Legends list */}
          <div className="space-y-2 mt-2">
            {gpaCategories.map((g) => (
              <div key={g.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: g.color }} />
                  <span className="text-slate-400 font-medium">{g.name}</span>
                </div>
                <span className="font-mono font-bold text-white">{g.value} Students</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Correlation Line (Takes 12/12) */}
        <div className="lg:col-span-12 glass-panel rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between h-96">
          <div>
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2 mb-1">
              <LineChart className="w-4 h-4 text-brand-cyan" />
              Roster Performance Correlation
            </h3>
            <p className="text-[11px] text-slate-500">Compares Student Attendance Rate (%) vs overall Grade Index (0-100 Score)</p>
          </div>
          
          <div className="flex-1 w-full min-h-0 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={correlationData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="attendance" stroke="#64748b" label={{ value: "Attendance Rate (%)", position: "insideBottomRight", offset: -5, fill: "#64748b", fontSize: 10 }} fontSize={11} />
                <YAxis stroke="#64748b" label={{ value: "Grade Index Score", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 10 }} fontSize={11} domain={[40, 100]} />
                <Tooltip 
                  contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px" }}
                  labelStyle={{ color: "#94a3b8" }}
                  itemStyle={{ color: "#fff" }}
                  formatter={(value, name) => [value, name === "gradeIndex" ? "Grade Index" : "Attendance"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="gradeIndex" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  activeDot={{ r: 6, stroke: "#06b6d4", strokeWidth: 2 }}
                  dot={{ r: 4, stroke: "#3b82f6", strokeWidth: 1 }}
                />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
