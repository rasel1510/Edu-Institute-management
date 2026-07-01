"use client";

import React, { useState, useMemo } from "react";
import { useData, FeeInvoice } from "@/context/DataContext";
import { DollarSign, Plus, X, Landmark, CreditCard, Receipt, FileText, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FeesView() {
  const { fees, students, payInvoice, createInvoice } = useData();

  // Modals state
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<FeeInvoice | null>(null);

  // Form states (Create Invoice)
  const [formStudentId, setFormStudentId] = useState("");
  const [formAmount, setFormAmount] = useState(1500);
  const [formDueDate, setFormDueDate] = useState("");

  // Form states (Pay Invoice)
  const [payMethod, setPayMethod] = useState("Credit Card");

  const studentsMap = useMemo(() => {
    const map = new Map<string, { name: string; avatar: string }>();
    students.forEach(s => map.set(s.id, { name: s.name, avatar: s.avatar }));
    return map;
  }, [students]);

  // Set default student ID for form
  useMemo(() => {
    if (students.length > 0 && !formStudentId) {
      setFormStudentId(students[0].id);
    }
  }, [students, formStudentId]);

  const openInvoiceModal = () => {
    setFormStudentId(students[0]?.id || "");
    setFormAmount(1500);
    setFormDueDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]); // 14 days default
    setIsInvoiceOpen(true);
  };

  const handleInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStudentId || !formAmount || !formDueDate) return;

    createInvoice(formStudentId, Number(formAmount), formDueDate);
    setIsInvoiceOpen(false);
  };

  const openPayModal = (inv: FeeInvoice) => {
    setSelectedInvoice(inv);
    setPayMethod("Credit Card");
    setIsPayOpen(true);
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    payInvoice(selectedInvoice.id, payMethod);
    setIsPayOpen(false);
    setSelectedInvoice(null);
  };

  // Financial summary calculations
  const finances = useMemo(() => {
    let collected = 0;
    let pending = 0;
    let overdue = 0;

    fees.forEach((f) => {
      if (f.status === "Paid") {
        collected += f.amount;
      } else if (f.status === "Unpaid") {
        pending += f.amount;
      } else if (f.status === "Overdue") {
        overdue += f.amount;
      }
    });

    return { collected, pending, overdue };
  }, [fees]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Fee Management</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-0.5">
            Overview collections, invoice academic programs, and log financial logs.
          </p>
        </div>
        <button
          onClick={openInvoiceModal}
          className="glow-btn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-white font-semibold text-sm hover:brightness-110 active:scale-98 transition shadow-lg shadow-brand-blue/20"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Invoice</span>
        </button>
      </div>

      {/* Finance Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Collected */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-850 flex items-center justify-between h-28">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Collected</span>
            <h4 className="text-2xl font-bold text-white font-mono mt-1.5">${(235680 + finances.collected).toLocaleString()}</h4>
            <p className="text-[10px] text-slate-500 mt-1">Base + Term payments</p>
          </div>
          <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
            <Landmark className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Invoices */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-850 flex items-center justify-between h-28">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Collections</span>
            <h4 className="text-2xl font-bold text-brand-blue font-mono mt-1.5">${finances.pending.toLocaleString()}</h4>
            <p className="text-[10px] text-slate-500 mt-1">Awaiting due dates</p>
          </div>
          <div className="p-3 rounded-xl bg-brand-blue/10 border border-brand-blue/20 text-brand-blue">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        {/* Overdue Accounts */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-850 flex items-center justify-between h-28">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overdue Accounts</span>
            <h4 className="text-2xl font-bold text-brand-purple font-mono mt-1.5">${finances.overdue.toLocaleString()}</h4>
            <p className="text-[10px] text-slate-500 mt-1">Requires immediate follow-up</p>
          </div>
          <div className="p-3 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/40">
          <h3 className="text-sm font-bold text-white tracking-wide">Issued Invoices</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/20">
                <th className="p-4 pl-6">Invoice details</th>
                <th className="p-4">Student</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-sm">
              {fees.map((inv) => {
                const stu = studentsMap.get(inv.studentId) || { name: "Unknown Student", avatar: "" };
                
                return (
                  <tr key={inv.id} className="hover:bg-white/[0.01] transition">
                    {/* Invoice ID */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-brand-cyan shrink-0" />
                        <span className="font-mono text-xs font-semibold text-slate-300">{inv.id}</span>
                      </div>
                    </td>

                    {/* Student Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        {stu.avatar && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={stu.avatar}
                            alt={stu.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-800"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-white">{stu.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{inv.studentId}</p>
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="p-4 font-mono text-xs text-slate-300 font-semibold">
                      ${inv.amount.toLocaleString()}
                    </td>

                    {/* Due Date */}
                    <td className="p-4 text-xs text-slate-400 font-mono">
                      {inv.dueDate}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                        inv.status === "Paid"
                          ? "bg-green-500/10 border-green-500/20 text-green-400"
                          : inv.status === "Unpaid"
                          ? "bg-brand-blue/10 border-brand-blue/20 text-brand-blue"
                          : "bg-red-500/10 border-red-500/20 text-red-450"
                      }`}>
                        {inv.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="p-4 pr-6 text-right">
                      {inv.status === "Paid" ? (
                        <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-semibold font-mono pr-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                          Paid ({inv.paymentMethod})
                        </div>
                      ) : (
                        <button
                          onClick={() => openPayModal(inv)}
                          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-brand-blue to-brand-purple hover:brightness-110 text-white font-semibold text-xs transition"
                        >
                          Record Payment
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ISSUE INVOICE MODAL --- */}
      <AnimatePresence>
        {isInvoiceOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInvoiceOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md glass-panel-glow bg-slate-950/95 p-6 rounded-2xl border border-violet-500/20 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Issue Student Invoice</h3>
                <button
                  onClick={() => setIsInvoiceOpen(false)}
                  className="p-1 rounded-md hover:bg-white/5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleInvoiceSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Select Student
                  </label>
                  <select
                    value={formStudentId}
                    onChange={(e) => setFormStudentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-300 text-sm"
                  >
                    {students.map((stu) => (
                      <option key={stu.id} className="bg-slate-950 text-slate-350" value={stu.id}>
                        {stu.name} ({stu.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Billing Amount ($)
                    </label>
                    <input
                      required
                      type="number"
                      min={100}
                      max={10000}
                      value={formAmount}
                      onChange={(e) => setFormAmount(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Payment Due Date
                    </label>
                    <input
                      required
                      type="date"
                      value={formDueDate}
                      onChange={(e) => setFormDueDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-brand-blue outline-none text-slate-100 text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsInvoiceOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-800 hover:bg-white/5 font-semibold text-sm text-slate-300 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple hover:brightness-110 active:scale-98 font-semibold text-sm text-white transition shadow-lg shadow-brand-blue/20"
                  >
                    Issue Invoice
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- RECORD PAYMENT MODAL --- */}
      <AnimatePresence>
        {isPayOpen && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsPayOpen(false);
                setSelectedInvoice(null);
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
                <h3 className="text-lg font-bold text-white">Record Invoice Payment</h3>
                <button
                  onClick={() => {
                    setIsPayOpen(false);
                    setSelectedInvoice(null);
                  }}
                  className="p-1 rounded-md hover:bg-white/5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 mb-4 text-xs space-y-2 text-slate-300">
                <p>Invoice ID: <b className="font-mono text-white">{selectedInvoice.id}</b></p>
                <p>Student: <b className="text-white">{studentsMap.get(selectedInvoice.studentId)?.name}</b></p>
                <p>Amount Due: <b className="text-brand-cyan">${selectedInvoice.amount.toLocaleString()}</b></p>
              </div>

              <form onSubmit={handlePaySubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3.5">
                    {["Credit Card", "Bank Transfer", "PayPal", "Cash"].map((method) => {
                      const isSelected = payMethod === method;
                      const Icon = method === "Credit Card" ? CreditCard : Landmark;
                      return (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPayMethod(method)}
                          className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 font-semibold transition ${
                            isSelected
                              ? "bg-brand-blue/15 border-brand-blue text-brand-blue"
                              : "bg-slate-900 border-slate-850 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[10px]">{method}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPayOpen(false);
                      setSelectedInvoice(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-slate-800 hover:bg-white/5 font-semibold text-sm text-slate-300 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple hover:brightness-110 active:scale-98 font-semibold text-sm text-white transition shadow-lg shadow-brand-blue/20"
                  >
                    Confirm Payment
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
