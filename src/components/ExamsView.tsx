"use client";

import React, { useState, useMemo } from "react";
import { useData, Exam } from "@/context/DataContext";
import { ClipboardList, Plus, Trash2, X, PlusCircle, PenTool, CheckCircle, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExamsView() {
  const { exams, classes, students, grades, addExam, deleteExam, submitGrade } = useData();

  // Navigation tab
  const [activeSubTab, setActiveSubTab] = useState<"scheduler" | "gradebook">("scheduler");

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states (Create Exam)
  const [formTitle, setFormTitle] = useState("");
  const [formClassId, setFormClassId] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formTotalMarks, setFormTotalMarks] = useState(100);

  // Form states (Grade Entry)
  const [selectedExamId, setSelectedExamId] = useState("");
  const [localGrades, setLocalGrades] = useState<Record<string, number>>({});

  const activeClassesMap = useMemo(() => {
    const map = new Map<string, string>();
    classes.forEach(c => map.set(c.id, c.name));
    return map;
  }, [classes]);

  // Retrieve current grades for selected exam
  const currentGradesMap = useMemo(() => {
    const map = new Map<string, number>();
    grades.filter(g => g.examId === selectedExamId).forEach(g => {
      map.set(g.studentId, g.marksObtained);
    });
    return map;
  }, [grades, selectedExamId]);

  // Set default selected exam if empty
  useMemo(() => {
    if (exams.length > 0 && !selectedExamId) {
      setSelectedExamId(exams[0].id);
    }
  }, [exams, selectedExamId]);

  const openAddModal = () => {
    setFormTitle("");
    setFormClassId(classes[0]?.id || "");
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormTime("09:00");
    setFormTotalMarks(100);
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formClassId) return;

    addExam({
      title: formTitle,
      classId: formClassId,
      date: formDate,
      time: formTime,
      totalMarks: Number(formTotalMarks),
    });
    setIsAddOpen(false);
  };

  const handleGradeChange = (studentId: string, value: string) => {
    const val = Number(value);
    setLocalGrades(prev => ({
      ...prev,
      [studentId]: val
    }));
  };

  const handleSaveGrade = (studentId: string, maxMarks: number) => {
    const score = localGrades[studentId];
    if (score === undefined || score < 0 || score > maxMarks) {
      alert(`Invalid score. Must be between 0 and ${maxMarks}.`);
      return;
    }
    submitGrade(selectedExamId, studentId, score);
  };

  const selectedExamDetails = useMemo(() => {
    return exams.find(e => e.id === selectedExamId);
  }, [exams, selectedExamId]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Exams & Scheduling</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-0.5">
            Configure examination schedules and log marks in the official student gradebook.
          </p>
        </div>
        {activeSubTab === "scheduler" && (
          <button
            onClick={openAddModal}
            className="glow-btn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-white font-semibold text-sm hover:brightness-110 active:scale-98 transition shadow-lg shadow-brand-blue/20"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Exam</span>
          </button>
        )}
      </div>

      {/* Tabs Selectors */}
      <div className="flex border-b border-slate-900 gap-6">
        <button
          onClick={() => setActiveSubTab("scheduler")}
          className={`pb-3 text-sm font-semibold transition relative outline-none ${
            activeSubTab === "scheduler" ? "text-white" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <span>Exam Rosters</span>
          {activeSubTab === "scheduler" && (
            <motion.div layoutId="examSubTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab("gradebook")}
          className={`pb-3 text-sm font-semibold transition relative outline-none ${
            activeSubTab === "gradebook" ? "text-white" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <span>Grade Sheets</span>
          {activeSubTab === "gradebook" && (
            <motion.div layoutId="examSubTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple" />
          )}
        </button>
      </div>

      {/* Scheduler Tab */}
      {activeSubTab === "scheduler" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {exams.map((ex) => {
            const className = activeClassesMap.get(ex.classId) || "Course";
            
            return (
              <div
                key={ex.id}
                className="glass-panel hover:glass-panel-glow p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between group transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900 border border-slate-850 px-2 py-0.5 rounded">
                      {className}
                    </span>
                    <button
                      onClick={() => deleteExam(ex.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-slate-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h3 className="font-bold text-white text-base leading-tight mt-2">{ex.title}</h3>
                  
                  <div className="space-y-1.5 mt-5 text-xs text-slate-300 py-3 border-t border-slate-900/60">
                    <p>Date: <b>{ex.date}</b></p>
                    <p>Time: <b>{ex.time}</b></p>
                    <p>Marks Scope: <b className="text-brand-cyan">{ex.totalMarks} Points</b></p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedExamId(ex.id);
                    setActiveSubTab("gradebook");
                  }}
                  className="w-full mt-4 py-2 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5"
                >
                  <PenTool className="w-3 h-3 text-brand-purple" />
                  Enter Grades
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Gradebook Tab */}
      {activeSubTab === "gradebook" && (
        <div className="space-y-6">
          {/* Exam selector banner */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple">
                <GraduationCap className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Active Grade Sheet</h3>
                <p className="text-xs text-slate-400 mt-0.5">Select a scheduled exam to manage scores.</p>
              </div>
            </div>
            
            <div className="w-full md:w-64 shrink-0">
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 text-xs outline-none focus:border-brand-purple"
              >
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.id} className="bg-slate-950 text-slate-200">
                    {ex.title} ({activeClassesMap.get(ex.classId) || "Course"})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Student grades table */}
          {selectedExamDetails ? (
            <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
                <span className="text-xs font-bold text-white tracking-wider uppercase">
                  Class Roster: {activeClassesMap.get(selectedExamDetails.classId)}
                </span>
                <span className="text-xs text-brand-cyan font-semibold">
                  Exam Scope: {selectedExamDetails.totalMarks} Marks Max
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/20">
                      <th className="p-4 pl-6">Student</th>
                      <th className="p-4">Student ID</th>
                      <th className="p-4">Current Score</th>
                      <th className="p-4 pr-6 text-right">Submit Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-sm">
                    {students.map((stu) => {
                      const loggedScore = currentGradesMap.get(stu.id);
                      const localVal = localGrades[stu.id] !== undefined ? localGrades[stu.id] : (loggedScore || 0);
                      
                      return (
                        <tr key={stu.id} className="hover:bg-white/[0.01] transition">
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
                                <p className="text-xs text-slate-400">{stu.grade}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-xs text-slate-400">{stu.id}</td>
                          <td className="p-4">
                            {loggedScore !== undefined ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-400 font-mono bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                                <CheckCircle className="w-3.5 h-3.5" />
                                {loggedScore} / {selectedExamDetails.totalMarks} Points
                              </span>
                            ) : (
                              <span className="text-xs text-slate-500 italic">No score recorded</span>
                            )}
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="inline-flex items-center gap-2">
                              <input
                                type="number"
                                min={0}
                                max={selectedExamDetails.totalMarks}
                                value={localVal}
                                onChange={(e) => handleGradeChange(stu.id, e.target.value)}
                                className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950 focus:border-brand-purple text-xs text-center font-mono text-slate-200 outline-none"
                              />
                              <button
                                onClick={() => handleSaveGrade(stu.id, selectedExamDetails.totalMarks)}
                                className="px-3.5 py-1.5 rounded-lg bg-brand-purple hover:brightness-115 text-white font-semibold text-xs transition"
                              >
                                Save
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
          ) : (
            <div className="py-20 text-center text-slate-500 text-sm">
              Please schedule an exam first before opening the Grade Sheets.
            </div>
          )}
        </div>
      )}

      {/* --- ADD EXAM SCHEDULER MODAL --- */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md glass-panel-glow bg-slate-950/95 p-6 rounded-2xl border border-violet-500/20 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Schedule Examination</h3>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="p-1 rounded-md hover:bg-white/5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Exam Title
                  </label>
                  <input
                    required
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Limits & Continuity Quiz"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-100 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Course / Class Scope
                  </label>
                  <select
                    value={formClassId}
                    onChange={(e) => setFormClassId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-300 text-sm"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} className="bg-slate-950 text-slate-300" value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Exam Date
                    </label>
                    <input
                      required
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-200 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Start Time
                    </label>
                    <input
                      required
                      type="time"
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-200 text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Total Marks Limit
                  </label>
                  <input
                    required
                    type="number"
                    min={5}
                    max={200}
                    value={formTotalMarks}
                    onChange={(e) => setFormTotalMarks(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-100 text-sm"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-800 hover:bg-white/5 font-semibold text-sm text-slate-300 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple hover:brightness-110 active:scale-98 font-semibold text-sm text-white transition shadow-lg shadow-brand-blue/20"
                  >
                    Schedule
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
