"use client";

import React, { useState, useMemo } from "react";
import { useData, ClassItem } from "@/context/DataContext";
import { Plus, Edit2, Trash2, X, BookOpen, Calendar, MapPin, Users, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClassesView() {
  const { classes, teachers, addClass, updateClass, deleteClass } = useData();

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formTeacherId, setFormTeacherId] = useState("");
  const [formMaxCapacity, setFormMaxCapacity] = useState(25);
  const [formSchedule, setFormSchedule] = useState("");
  const [formRoom, setFormRoom] = useState("");

  const activeTeacherMap = useMemo(() => {
    const map = new Map<string, string>();
    teachers.forEach(t => map.set(t.id, t.name));
    return map;
  }, [teachers]);

  const openAddModal = () => {
    setFormName("");
    setFormTeacherId(teachers[0]?.id || "");
    setFormMaxCapacity(25);
    setFormSchedule("Mon, Wed 9:00 AM - 10:30 AM");
    setFormRoom("Room 101");
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formTeacherId) return;

    addClass({
      name: formName,
      teacherId: formTeacherId,
      maxCapacity: Number(formMaxCapacity),
      schedule: formSchedule,
      room: formRoom,
    });
    setIsAddOpen(false);
  };

  const openEditModal = (cls: ClassItem) => {
    setEditingClass(cls);
    setFormName(cls.name);
    setFormTeacherId(cls.teacherId);
    setFormMaxCapacity(cls.maxCapacity);
    setFormSchedule(cls.schedule);
    setFormRoom(cls.room);
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass || !formName || !formTeacherId) return;

    updateClass({
      ...editingClass,
      name: formName,
      teacherId: formTeacherId,
      maxCapacity: Number(formMaxCapacity),
      schedule: formSchedule,
      room: formRoom,
    });
    setIsEditOpen(false);
    setEditingClass(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to cancel this class?")) {
      deleteClass(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Classes & Rooms</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-0.5">
            Manage course lists, classroom locations, scheduling, and assigned teachers.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="glow-btn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-white font-semibold text-sm hover:brightness-110 active:scale-98 transition shadow-lg shadow-brand-blue/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create Class</span>
        </button>
      </div>

      {/* Grid of classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {classes.map((cls) => {
          const teacherName = activeTeacherMap.get(cls.teacherId) || "Unassigned Instructor";
          const occupancyRate = Math.round((cls.studentsCount / cls.maxCapacity) * 100);
          
          return (
            <div
              key={cls.id}
              className="glass-panel hover:glass-panel-glow rounded-2xl p-5 flex flex-col justify-between group border border-slate-800/80 transition-all duration-300"
            >
              <div>
                {/* Header info */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan">
                      <BookOpen className="w-5 h-5 animate-pulse-glow" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight">{cls.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{teacherName}</p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 bg-slate-900 border border-slate-850 px-2 py-0.5 rounded">
                    {cls.id}
                  </span>
                </div>

                {/* Details list */}
                <div className="space-y-2 mt-5 py-4 border-t border-slate-900/60">
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>{cls.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{cls.room}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span>{cls.studentsCount} / {cls.maxCapacity} Enrolled Students</span>
                  </div>
                </div>

                {/* Enrollment Progress Indicator */}
                <div className="space-y-1.5 mt-3">
                  <div className="flex justify-between text-[10px] font-semibold">
                    <span className="text-slate-400">Roster Capacity</span>
                    <span className={occupancyRate >= 95 ? "text-red-400" : "text-brand-cyan"}>
                      {occupancyRate}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        occupancyRate >= 95 
                          ? "bg-red-500" 
                          : occupancyRate >= 80 
                          ? "bg-amber-500" 
                          : "bg-brand-cyan"
                      }`}
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions panel */}
              <div className="mt-6 pt-4 border-t border-slate-900/60 flex justify-end gap-2.5">
                <button
                  onClick={() => openEditModal(cls)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/80 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1.5"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cls.id)}
                  className="px-3.5 py-1.5 rounded-lg border border-transparent hover:border-red-500/20 hover:bg-red-500/10 text-xs font-semibold text-slate-400 hover:text-red-400 transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-3 h-3" />
                  Cancel
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- CREATE CLASS MODAL --- */}
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
                <h3 className="text-lg font-bold text-white">Create Class</h3>
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
                    Class Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Chemistry AP"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-100 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Assigned Teacher
                  </label>
                  <select
                    value={formTeacherId}
                    onChange={(e) => setFormTeacherId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-300 text-sm"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} className="bg-slate-950 text-slate-300" value={t.id}>
                        {t.name} ({t.subject})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Max Capacity
                    </label>
                    <input
                      required
                      type="number"
                      min={5}
                      max={100}
                      value={formMaxCapacity}
                      onChange={(e) => setFormMaxCapacity(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Room Location
                    </label>
                    <input
                      required
                      type="text"
                      value={formRoom}
                      onChange={(e) => setFormRoom(e.target.value)}
                      placeholder="Room 304"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-100 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Roster Schedule
                  </label>
                  <input
                    required
                    type="text"
                    value={formSchedule}
                    onChange={(e) => setFormSchedule(e.target.value)}
                    placeholder="Tue, Thu 10:30 AM - 12:00 PM"
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
                    Create Class
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- EDIT CLASS MODAL --- */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsEditOpen(false);
                setEditingClass(null);
              }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md glass-panel-glow bg-slate-950/95 p-6 rounded-2xl border border-violet-500/20 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Edit Class Roster</h3>
                <button
                  onClick={() => {
                    setIsEditOpen(false);
                    setEditingClass(null);
                  }}
                  className="p-1 rounded-md hover:bg-white/5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Class Name
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
                    Assigned Teacher
                  </label>
                  <select
                    value={formTeacherId}
                    onChange={(e) => setFormTeacherId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-300 text-sm"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} className="bg-slate-950 text-slate-300" value={t.id}>
                        {t.name} ({t.subject})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Max Capacity
                    </label>
                    <input
                      required
                      type="number"
                      min={5}
                      max={100}
                      value={formMaxCapacity}
                      onChange={(e) => setFormMaxCapacity(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Room Location
                    </label>
                    <input
                      required
                      type="text"
                      value={formRoom}
                      onChange={(e) => setFormRoom(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-100 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Roster Schedule
                  </label>
                  <input
                    required
                    type="text"
                    value={formSchedule}
                    onChange={(e) => setFormSchedule(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-100 text-sm"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditOpen(false);
                      setEditingClass(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-slate-800 hover:bg-white/5 font-semibold text-sm text-slate-300 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple hover:brightness-110 active:scale-98 font-semibold text-sm text-white transition shadow-lg shadow-brand-blue/20"
                  >
                    Save Roster
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
