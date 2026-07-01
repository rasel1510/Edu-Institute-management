"use client";

import React, { useState, useMemo } from "react";
import { useData, Student, AttendanceStatus } from "@/context/DataContext";
import { CalendarCheck, Save, ClipboardList, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AttendanceView() {
  const { students, attendance, bulkMarkAttendance } = useData();

  // Date state (defaults to today)
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  // Local state for checking items before saving
  const [sheetRecords, setSheetRecords] = useState<Record<string, AttendanceStatus>>({});

  // Sync records with stored attendance whenever date changes or component loads
  const currentSheet = useMemo(() => {
    const records: Record<string, AttendanceStatus> = {};
    
    // 1. Set default status based on students list
    students.forEach((stu) => {
      records[stu.id] = "Present";
    });

    // 2. Overwrite with actual database records if exist for selected date
    const dateRecords = attendance.filter((r) => r.date === selectedDate);
    dateRecords.forEach((r) => {
      records[r.studentId] = r.status;
    });

    return records;
  }, [students, attendance, selectedDate]);

  // Compute stats on active sheet selection
  const sheetStats = useMemo(() => {
    const list = Object.values(currentSheet);
    if (list.length === 0) return { present: 100, absent: 0, leave: 0 };
    const total = list.length;
    const p = list.filter((v) => v === "Present").length;
    const a = list.filter((v) => v === "Absent").length;
    const l = list.filter((v) => v === "Leave").length;
    
    return {
      present: Math.round((p / total) * 100),
      absent: Math.round((a / total) * 100),
      leave: Math.round((l / total) * 100),
      presentCount: p,
      absentCount: a,
      leaveCount: l,
    };
  }, [currentSheet]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    // We update local records first, then apply immediately or let them click save.
    // The easiest and most interactive way is to log it to global state immediately, 
    // so we call bulkMarkAttendance or markAttendance right away!
    bulkMarkAttendance(selectedDate, [{ studentId, status }]);
  };

  const handleSetAllPresent = () => {
    const list = students.map((stu) => ({
      studentId: stu.id,
      status: "Present" as AttendanceStatus,
    }));
    bulkMarkAttendance(selectedDate, list);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Attendance Tracker</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-0.5">
            Log student attendance, check monthly rosters, and analyze daily rates.
          </p>
        </div>
        <button
          onClick={handleSetAllPresent}
          className="glow-btn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-white font-semibold text-sm transition"
        >
          <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
          <span>Mark All Present</span>
        </button>
      </div>

      {/* Date selector and Stats overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Date Card */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-5 border border-slate-800/80 space-y-4">
          <h3 className="text-sm font-bold tracking-wider text-slate-300 uppercase flex items-center gap-2">
            <CalendarCheck className="w-4.5 h-4.5 text-brand-blue" />
            Roster Calendar
          </h3>
          <div className="space-y-1">
            <label className="text-xs text-slate-500 font-semibold uppercase">Selected Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 outline-none focus:border-brand-blue font-mono text-sm"
            />
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed bg-brand-blue/5 border border-brand-blue/10 p-3.5 rounded-xl">
            Changing this date retrieves the attendance snapshot. Checking options automatically locks changes.
          </div>
        </div>

        {/* Live Stats Row */}
        <div className="lg:col-span-8 grid grid-cols-3 gap-4">
          {/* Present */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-850 flex flex-col justify-between h-32">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Present Rate</span>
            <div>
              <h4 className="text-2xl font-bold text-white font-mono mt-1">{sheetStats.present}%</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">{sheetStats.presentCount} Students</p>
            </div>
            <div className="h-1 w-full bg-slate-900 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-brand-blue rounded-full" style={{ width: `${sheetStats.present}%` }} />
            </div>
          </div>

          {/* Absent */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-850 flex flex-col justify-between h-32">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Absent Rate</span>
            <div>
              <h4 className="text-2xl font-bold text-brand-purple font-mono mt-1">{sheetStats.absent}%</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">{sheetStats.absentCount} Students</p>
            </div>
            <div className="h-1 w-full bg-slate-900 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-brand-purple rounded-full" style={{ width: `${sheetStats.absent}%` }} />
            </div>
          </div>

          {/* Leave */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-850 flex flex-col justify-between h-32">
            <span className="text-[10px] font-bold text-slate-400 uppercase">On Leave</span>
            <div>
              <h4 className="text-2xl font-bold text-brand-cyan font-mono mt-1">{sheetStats.leave}%</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">{sheetStats.leaveCount} Students</p>
            </div>
            <div className="h-1 w-full bg-slate-900 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-brand-cyan rounded-full" style={{ width: `${sheetStats.leave}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Roster sheet */}
      <div className="glass-panel rounded-2xl border border-slate-800/85 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-brand-purple" />
            Class Attendance Grid
          </h3>
          <span className="text-xs text-slate-400 font-mono">Date: {selectedDate}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/30">
                <th className="p-4 pl-6">Student Info</th>
                <th className="p-4">Student ID</th>
                <th className="p-4">Academic Level</th>
                <th className="p-4 pr-6 text-center">Status Selection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {students.map((stu) => {
                const currentStatus = currentSheet[stu.id] || "Present";
                
                return (
                  <tr key={stu.id} className="hover:bg-white/[0.01] transition">
                    {/* Student details */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={stu.avatar}
                          alt={stu.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-800"
                        />
                        <div>
                          <p className="font-semibold text-white">{stu.name}</p>
                          <p className="text-xs text-slate-400">{stu.email}</p>
                        </div>
                      </div>
                    </td>
                    
                    {/* ID */}
                    <td className="p-4 font-mono text-xs text-slate-400">{stu.id}</td>
                    
                    {/* Level */}
                    <td className="p-4 text-xs font-semibold text-slate-300">{stu.grade}</td>

                    {/* Status check toggles */}
                    <td className="p-4 pr-6 text-center">
                      <div className="inline-flex rounded-xl p-1 bg-slate-950 border border-slate-800 gap-1">
                        {/* Present Option */}
                        <button
                          onClick={() => handleStatusChange(stu.id, "Present")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            currentStatus === "Present"
                              ? "bg-brand-blue/20 text-brand-blue border border-brand-blue/35"
                              : "text-slate-500 hover:text-slate-300 border border-transparent"
                          }`}
                        >
                          Present
                        </button>

                        {/* Absent Option */}
                        <button
                          onClick={() => handleStatusChange(stu.id, "Absent")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            currentStatus === "Absent"
                              ? "bg-brand-purple/20 text-brand-purple border border-brand-purple/35"
                              : "text-slate-500 hover:text-slate-300 border border-transparent"
                          }`}
                        >
                          Absent
                        </button>

                        {/* Leave Option */}
                        <button
                          onClick={() => handleStatusChange(stu.id, "Leave")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            currentStatus === "Leave"
                              ? "bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/35"
                              : "text-slate-500 hover:text-slate-300 border border-transparent"
                          }`}
                        >
                          Leave
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
