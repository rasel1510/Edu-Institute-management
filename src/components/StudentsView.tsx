"use client";

import React, { useState, useMemo } from "react";
import { useData, Student } from "@/context/DataContext";
import { Search, UserPlus, Edit2, Trash2, X, Filter, SlidersHorizontal, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentsView() {
  const { students, addStudent, updateStudent, deleteStudent } = useData();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formGrade, setFormGrade] = useState("10th Grade");
  const [formStatus, setFormStatus] = useState<"Active" | "Grace Period" | "Suspended">("Active");
  const [formAvatar, setFormAvatar] = useState("");

  const presetAvatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
  ];

  // Filtering Logic
  const filteredStudents = useMemo(() => {
    return students.filter((stu) => {
      const matchesSearch = 
        stu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stu.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stu.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGrade = gradeFilter === "All" || stu.grade === gradeFilter;
      const matchesStatus = statusFilter === "All" || stu.status === statusFilter;

      return matchesSearch && matchesGrade && matchesStatus;
    });
  }, [students, searchQuery, gradeFilter, statusFilter]);

  const openAddModal = () => {
    setFormName("");
    setFormEmail("");
    setFormGrade("10th Grade");
    setFormStatus("Active");
    setFormAvatar(presetAvatars[Math.floor(Math.random() * presetAvatars.length)]);
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;
    
    addStudent({
      name: formName,
      email: formEmail,
      grade: formGrade,
      status: formStatus,
      avatar: formAvatar || presetAvatars[0],
    });
    setIsAddOpen(false);
  };

  const openEditModal = (stu: Student) => {
    setEditingStudent(stu);
    setFormName(stu.name);
    setFormEmail(stu.email);
    setFormGrade(stu.grade);
    setFormStatus(stu.status);
    setFormAvatar(stu.avatar);
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !formName || !formEmail) return;

    updateStudent({
      ...editingStudent,
      name: formName,
      email: formEmail,
      grade: formGrade,
      status: formStatus,
      avatar: formAvatar,
    });
    setIsEditOpen(false);
    setEditingStudent(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this student?")) {
      deleteStudent(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Student Directory</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-0.5">
            Manage student registrations, academic grades, and enrollment status.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="glow-btn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-white font-semibold text-sm hover:brightness-110 active:scale-98 transition shadow-lg shadow-brand-blue/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>Enroll Student</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
        {/* Search */}
        <div className="relative md:col-span-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search by name, ID, or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 focus:bg-slate-950 focus:border-brand-blue outline-none text-sm text-slate-100 placeholder-slate-500 transition"
          />
        </div>

        {/* Grade Filter */}
        <div className="relative md:col-span-3 flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-3.5 py-2.5 rounded-xl">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="bg-transparent border-none outline-none text-slate-300 text-xs w-full cursor-pointer focus:text-white"
          >
            <option className="bg-slate-950 text-slate-300" value="All">All Grades</option>
            <option className="bg-slate-950 text-slate-300" value="10th Grade">10th Grade</option>
            <option className="bg-slate-950 text-slate-300" value="11th Grade">11th Grade</option>
            <option className="bg-slate-950 text-slate-300" value="12th Grade">12th Grade</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative md:col-span-3 flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-3.5 py-2.5 rounded-xl">
          <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none outline-none text-slate-300 text-xs w-full cursor-pointer focus:text-white"
          >
            <option className="bg-slate-950 text-slate-300" value="All">All Statuses</option>
            <option className="bg-slate-950 text-slate-300" value="Active">Active</option>
            <option className="bg-slate-950 text-slate-300" value="Grace Period">Grace Period</option>
            <option className="bg-slate-950 text-slate-300" value="Suspended">Suspended</option>
          </select>
        </div>

        {/* Clear Filters indicator */}
        {(searchQuery || gradeFilter !== "All" || statusFilter !== "All") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setGradeFilter("All");
              setStatusFilter("All");
            }}
            className="md:col-span-1 text-xs text-slate-500 hover:text-slate-300 underline font-medium text-left"
          >
            Clear
          </button>
        )}
      </div>

      {/* Student List Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800/80">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-950/50 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                <th className="p-4 pl-6">Student info</th>
                <th className="p-4">Student ID</th>
                <th className="p-4">Academic Level</th>
                <th className="p-4">Attendance Rate</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-sm">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    No students matching your filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => (
                  <tr key={stu.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={stu.avatar}
                          alt={stu.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-800"
                        />
                        <div>
                          <p className="font-semibold text-white">{stu.name}</p>
                          <p className="text-xs text-slate-400">{stu.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-300">{stu.id}</td>
                    <td className="p-4 text-xs font-semibold text-slate-300">{stu.grade}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                          <div 
                            className={`h-full rounded-full ${
                              stu.attendanceRate >= 90 
                                ? "bg-green-500" 
                                : stu.attendanceRate >= 80 
                                ? "bg-amber-500" 
                                : "bg-red-500"
                            }`}
                            style={{ width: `${stu.attendanceRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-semibold text-slate-300">
                          {stu.attendanceRate}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        stu.status === "Active" 
                          ? "bg-green-500/10 border-green-500/20 text-green-400" 
                          : stu.status === "Grace Period" 
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-400" 
                          : "bg-red-500/10 border-red-500/20 text-red-400"
                      }`}>
                        {stu.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(stu)}
                        className="p-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-slate-800 text-slate-400 hover:text-white transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(stu.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-slate-400 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD STUDENT MODAL --- */}
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
                <h3 className="text-lg font-bold text-white">Enroll Student</h3>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="p-1 rounded-md hover:bg-white/5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                {/* Avatar Select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Select Avatar
                  </label>
                  <div className="flex gap-2.5 overflow-x-auto py-1">
                    {presetAvatars.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setFormAvatar(av)}
                        className={`relative w-11 h-11 rounded-full object-cover shrink-0 overflow-hidden border-2 ${
                          formAvatar === av ? "border-brand-blue scale-110 shadow-lg" : "border-slate-800 opacity-60"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={av} alt="avatar option" className="w-full h-full object-cover" />
                        {formAvatar === av && (
                          <div className="absolute inset-0 bg-brand-blue/30 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white font-bold" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Sophia Johnson"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-100 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="sophia@neuravixor.edu"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-100 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Academic Level
                    </label>
                    <select
                      value={formGrade}
                      onChange={(e) => setFormGrade(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-300 text-sm"
                    >
                      <option className="bg-slate-950 text-slate-300" value="10th Grade">10th Grade</option>
                      <option className="bg-slate-950 text-slate-300" value="11th Grade">11th Grade</option>
                      <option className="bg-slate-950 text-slate-300" value="12th Grade">12th Grade</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-300 text-sm"
                    >
                      <option className="bg-slate-950 text-slate-300" value="Active">Active</option>
                      <option className="bg-slate-950 text-slate-300" value="Grace Period">Grace Period</option>
                      <option className="bg-slate-950 text-slate-300" value="Suspended">Suspended</option>
                    </select>
                  </div>
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
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- EDIT STUDENT MODAL --- */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md glass-panel-glow bg-slate-950/95 p-6 rounded-2xl border border-violet-500/20 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Edit Student Details</h3>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="p-1 rounded-md hover:bg-white/5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                {/* Avatar Select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Select Avatar
                  </label>
                  <div className="flex gap-2.5 overflow-x-auto py-1">
                    {presetAvatars.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setFormAvatar(av)}
                        className={`relative w-11 h-11 rounded-full object-cover shrink-0 overflow-hidden border-2 ${
                          formAvatar === av ? "border-brand-blue scale-110 shadow-lg" : "border-slate-800 opacity-60"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={av} alt="avatar option" className="w-full h-full object-cover" />
                        {formAvatar === av && (
                          <div className="absolute inset-0 bg-brand-blue/30 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white font-bold" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-100 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-100 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Academic Level
                    </label>
                    <select
                      value={formGrade}
                      onChange={(e) => setFormGrade(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-300 text-sm"
                    >
                      <option className="bg-slate-950 text-slate-300" value="10th Grade">10th Grade</option>
                      <option className="bg-slate-950 text-slate-300" value="11th Grade">11th Grade</option>
                      <option className="bg-slate-950 text-slate-300" value="12th Grade">12th Grade</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-300 text-sm"
                    >
                      <option className="bg-slate-950 text-slate-300" value="Active">Active</option>
                      <option className="bg-slate-950 text-slate-300" value="Grace Period">Grace Period</option>
                      <option className="bg-slate-950 text-slate-300" value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditOpen(false);
                      setEditingStudent(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-slate-800 hover:bg-white/5 font-semibold text-sm text-slate-300 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple hover:brightness-110 active:scale-98 font-semibold text-sm text-white transition shadow-lg shadow-brand-blue/20"
                  >
                    Save Changes
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
