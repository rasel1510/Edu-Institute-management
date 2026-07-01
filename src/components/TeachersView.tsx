"use client";

import React, { useState, useMemo } from "react";
import { useData, Teacher } from "@/context/DataContext";
import { Search, Plus, Edit2, Trash2, X, GraduationCap, Calendar, Mail, FileText, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TeachersView() {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useData();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formSubject, setFormSubject] = useState("Mathematics");
  const [formBio, setFormBio] = useState("");
  const [formAvatar, setFormAvatar] = useState("");
  const [formSchedule, setFormSchedule] = useState<string[]>([]);

  const presetAvatars = [
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
  ];

  const subjects = ["Mathematics", "Physics", "English", "Chemistry", "Biology", "Computer Science", "History"];

  const schedulesOptions = [
    "Mon 9:00 AM",
    "Mon 1:00 PM",
    "Tue 9:00 AM",
    "Tue 10:30 AM",
    "Wed 9:00 AM",
    "Wed 10:30 AM",
    "Wed 1:00 PM",
    "Thu 9:00 AM",
    "Thu 10:30 AM",
    "Fri 9:00 AM",
    "Fri 10:30 AM",
    "Fri 1:00 PM",
  ];

  // Filtering Logic
  const filteredTeachers = useMemo(() => {
    return teachers.filter((tch) => {
      return (
        tch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tch.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tch.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [teachers, searchQuery]);

  const openAddModal = () => {
    setFormName("");
    setFormEmail("");
    setFormSubject("Mathematics");
    setFormBio("");
    setFormSchedule([]);
    setFormAvatar(presetAvatars[Math.floor(Math.random() * presetAvatars.length)]);
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    addTeacher({
      name: formName,
      email: formEmail,
      subject: formSubject,
      bio: formBio || `Professional instructor of ${formSubject}. Committed to student growth and academic success.`,
      avatar: formAvatar || presetAvatars[0],
      schedule: formSchedule.length > 0 ? formSchedule : ["Mon 9:00 AM", "Wed 10:30 AM"],
    });
    setIsAddOpen(false);
  };

  const openEditModal = (e: React.MouseEvent, tch: Teacher) => {
    e.stopPropagation(); // Avoid triggering open detail card
    setEditingTeacher(tch);
    setFormName(tch.name);
    setFormEmail(tch.email);
    setFormSubject(tch.subject);
    setFormBio(tch.bio);
    setFormAvatar(tch.avatar);
    setFormSchedule(tch.schedule);
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher || !formName || !formEmail) return;

    updateTeacher({
      ...editingTeacher,
      name: formName,
      email: formEmail,
      subject: formSubject,
      bio: formBio,
      avatar: formAvatar,
      schedule: formSchedule,
    });
    setIsEditOpen(false);
    setEditingTeacher(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Avoid opening details
    if (confirm("Are you sure you want to remove this teacher?")) {
      deleteTeacher(id);
    }
  };

  const toggleScheduleOption = (opt: string) => {
    setFormSchedule((prev) =>
      prev.includes(opt) ? prev.filter((item) => item !== opt) : [...prev, opt]
    );
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Teacher Profiles</h1>
          <p className="text-slate-200 text-xs md:text-sm mt-0.5">
            View details, teaching rosters, schedules, and departments of Neuravixor faculty.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="glow-btn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-white font-semibold text-sm hover:brightness-110 active:scale-98 transition shadow-lg shadow-brand-blue/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          placeholder="Search teachers by name, subject, department..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 focus:bg-slate-950 focus:border-brand-blue outline-none text-sm text-slate-100 placeholder-slate-450 transition"
        />
      </div>

      {/* Faculty Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredTeachers.map((tch) => (
          <motion.div
            key={tch.id}
            layoutId={`teacher-card-${tch.id}`}
            onClick={() => setSelectedTeacher(tch)}
            className="glass-panel hover:glass-panel-glow rounded-2xl overflow-hidden cursor-pointer group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between border border-slate-800/80"
          >
            {/* Design accents */}
            <div className="h-2 bg-gradient-to-r from-brand-blue/50 to-brand-purple/50 group-hover:from-brand-blue group-hover:to-brand-purple transition-all" />
            
            <div className="p-5 flex-1 flex flex-col items-center text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tch.avatar}
                alt={tch.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-800 group-hover:border-brand-purple transition-colors mb-4"
              />
              <h3 className="font-bold text-white text-base truncate max-w-full">{tch.name}</h3>
              <p className="text-brand-cyan text-xs font-semibold mt-1">{tch.subject} Instructor</p>
              
              <p className="text-slate-200 text-xs mt-3 line-clamp-2 italic px-2">
                &ldquo;{tch.bio}&rdquo;
              </p>
            </div>

            {/* Quick specifications */}
            <div className="px-5 py-3.5 bg-slate-950/40 border-t border-slate-900/60 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-purple" />
                {tch.schedule.length} Classes/wk
              </span>
              <div className="space-x-1.5 shrink-0">
                <button
                  onClick={(e) => openEditModal(e, tch)}
                  className="p-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-slate-800 text-slate-200 hover:text-white transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => handleDelete(e, tch.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-slate-200 hover:text-red-400 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- DETAILED PROFILE MODAL --- */}
      <AnimatePresence>
        {selectedTeacher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTeacher(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              layoutId={`teacher-card-${selectedTeacher.id}`}
              className="relative w-full max-w-lg glass-panel-glow bg-slate-950/95 rounded-2xl border border-violet-500/20 shadow-2xl overflow-hidden"
            >
              {/* Header design decoration */}
              <div className="h-32 bg-gradient-to-r from-brand-blue/30 to-brand-purple/30 relative flex items-end px-6">
                <button
                  onClick={() => setSelectedTeacher(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-950/40 hover:bg-slate-950/80 text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Main Body */}
              <div className="px-6 pb-6 relative">
                {/* Overlapping Avatar */}
                <div className="absolute -top-12 left-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedTeacher.avatar}
                    alt={selectedTeacher.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-slate-950"
                  />
                </div>

                <div className="pt-14">
                  <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold text-brand-purple uppercase bg-brand-purple/10 border border-brand-purple/20 rounded-full">
                    Faculty Member
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1.5">{selectedTeacher.name}</h3>
                  <p className="text-xs text-brand-cyan font-medium">{selectedTeacher.subject} Department Head</p>
                  
                  {/* Info list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 py-4 border-y border-slate-900/60">
                    <div className="flex items-center gap-2.5 text-xs text-slate-300">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span>{selectedTeacher.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-300">
                      <GraduationCap className="w-4 h-4 text-slate-500" />
                      <span>Joined {selectedTeacher.joinedDate}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mt-5 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-brand-blue" />
                      Biography
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 border border-slate-900/80 p-3 rounded-xl italic">
                      &ldquo;{selectedTeacher.bio}&rdquo;
                    </p>
                  </div>

                  {/* Schedule */}
                  <div className="mt-5 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-purple" />
                      Weekly Teaching Schedule
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeacher.schedule.map((sch) => (
                        <span key={sch} className="text-[10px] font-semibold text-slate-300 bg-slate-900 border border-slate-800/80 px-2.5 py-1.5 rounded-lg">
                          {sch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ADD TEACHER MODAL --- */}
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
              className="relative w-full max-w-lg glass-panel-glow bg-slate-950/95 p-6 rounded-2xl border border-violet-500/20 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Register Faculty Member</h3>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="p-1 rounded-md hover:bg-white/5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                {/* Avatar Select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Select Profile Avatar
                  </label>
                  <div className="flex gap-2.5 overflow-x-auto py-1">
                    {presetAvatars.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setFormAvatar(av)}
                        className={`relative w-11 h-11 rounded-full object-cover shrink-0 overflow-hidden border-2 ${
                          formAvatar === av ? "border-brand-purple scale-110 shadow-lg" : "border-slate-800 opacity-60"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={av} alt="avatar option" className="w-full h-full object-cover" />
                        {formAvatar === av && (
                          <div className="absolute inset-0 bg-brand-purple/30 flex items-center justify-center">
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
                    placeholder="Dr. Eleanor Vance"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-100 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="eleanor.v@neuravixor.edu"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Department / Subject
                    </label>
                    <select
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-300 text-sm"
                    >
                      {subjects.map((sub) => (
                        <option key={sub} className="bg-slate-950 text-slate-300" value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Biographical Abstract
                  </label>
                  <textarea
                    rows={2}
                    value={formBio}
                    onChange={(e) => setFormBio(e.target.value)}
                    placeholder="Ph.D. researcher. Dedicated instructor..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-100 text-xs leading-relaxed resize-none"
                  />
                </div>

                {/* Schedule select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Select Teaching Schedules
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {schedulesOptions.map((opt) => {
                      const isChecked = formSchedule.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleScheduleOption(opt)}
                          className={`p-2 rounded-lg text-[10px] text-center border font-semibold transition ${
                            isChecked
                              ? "bg-brand-purple/20 border-brand-purple text-brand-purple"
                              : "bg-slate-900 border-slate-805 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
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
                    Save Faculty
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- EDIT TEACHER MODAL --- */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsEditOpen(false);
                setEditingTeacher(null);
              }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg glass-panel-glow bg-slate-950/95 p-6 rounded-2xl border border-violet-500/20 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Edit Faculty Member</h3>
                <button
                  onClick={() => {
                    setIsEditOpen(false);
                    setEditingTeacher(null);
                  }}
                  className="p-1 rounded-md hover:bg-white/5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                {/* Avatar Select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Select Profile Avatar
                  </label>
                  <div className="flex gap-2.5 overflow-x-auto py-1">
                    {presetAvatars.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setFormAvatar(av)}
                        className={`relative w-11 h-11 rounded-full object-cover shrink-0 overflow-hidden border-2 ${
                          formAvatar === av ? "border-brand-purple scale-110 shadow-lg" : "border-slate-800 opacity-60"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={av} alt="avatar option" className="w-full h-full object-cover" />
                        {formAvatar === av && (
                          <div className="absolute inset-0 bg-brand-purple/30 flex items-center justify-center">
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

                <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Department / Subject
                    </label>
                    <select
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-300 text-sm"
                    >
                      {subjects.map((sub) => (
                        <option key={sub} className="bg-slate-950 text-slate-300" value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Biographical Abstract
                  </label>
                  <textarea
                    rows={2}
                    value={formBio}
                    onChange={(e) => setFormBio(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-100 text-xs leading-relaxed resize-none"
                  />
                </div>

                {/* Schedule select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Select Teaching Schedules
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {schedulesOptions.map((opt) => {
                      const isChecked = formSchedule.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleScheduleOption(opt)}
                          className={`p-2 rounded-lg text-[10px] text-center border font-semibold transition ${
                            isChecked
                              ? "bg-brand-purple/20 border-brand-purple text-brand-purple"
                              : "bg-slate-900 border-slate-805 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditOpen(false);
                      setEditingTeacher(null);
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
