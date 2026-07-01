"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// --- Types ---
export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  grade: string;
  status: "Active" | "Grace Period" | "Suspended";
  attendanceRate: number;
  joinedDate: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  avatar: string;
  joinedDate: string;
  schedule: string[];
  bio: string;
}

export interface ClassItem {
  id: string;
  name: string;
  teacherId: string;
  studentsCount: number;
  maxCapacity: number;
  schedule: string;
  room: string;
}

export type AttendanceStatus = "Present" | "Absent" | "Leave";

export interface AttendanceRecord {
  date: string;
  studentId: string;
  status: AttendanceStatus;
}

export interface Exam {
  id: string;
  title: string;
  classId: string;
  date: string;
  time: string;
  totalMarks: number;
}

export interface GradeRecord {
  examId: string;
  studentId: string;
  marksObtained: number;
}

export interface FeeInvoice {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Unpaid" | "Overdue";
  paymentMethod?: string;
  paymentDate?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success";
  timestamp: string;
}

interface DataContextType {
  students: Student[];
  teachers: Teacher[];
  classes: ClassItem[];
  attendance: AttendanceRecord[];
  exams: Exam[];
  grades: GradeRecord[];
  fees: FeeInvoice[];
  notifications: NotificationItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Actions
  addStudent: (student: Omit<Student, "id" | "joinedDate" | "attendanceRate">) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  
  addTeacher: (teacher: Omit<Teacher, "id" | "joinedDate">) => void;
  updateTeacher: (teacher: Teacher) => void;
  deleteTeacher: (id: string) => void;
  
  addClass: (classItem: Omit<ClassItem, "id" | "studentsCount">) => void;
  updateClass: (classItem: ClassItem) => void;
  deleteClass: (id: string) => void;
  
  markAttendance: (date: string, studentId: string, status: AttendanceStatus) => void;
  bulkMarkAttendance: (date: string, records: { studentId: string; status: AttendanceStatus }[]) => void;
  
  addExam: (exam: Omit<Exam, "id">) => void;
  deleteExam: (id: string) => void;
  submitGrade: (examId: string, studentId: string, marksObtained: number) => void;
  
  payInvoice: (invoiceId: string, method: string) => void;
  createInvoice: (studentId: string, amount: number, dueDate: string) => void;
  
  addNotification: (title: string, message: string, type: "info" | "warning" | "success") => void;
  removeNotification: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // --- Initial Pre-Populated Mock Data ---
  const [students, setStudents] = useState<Student[]>([
    {
      id: "STU-001",
      name: "Sophia Johnson",
      email: "sophia.j@neuravixor.edu",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      grade: "10th Grade",
      status: "Active",
      attendanceRate: 98,
      joinedDate: "2024-09-01",
    },
    {
      id: "STU-002",
      name: "Liam Williams",
      email: "liam.w@neuravixor.edu",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      grade: "11th Grade",
      status: "Active",
      attendanceRate: 92,
      joinedDate: "2023-09-01",
    },
    {
      id: "STU-003",
      name: "Ava Brown",
      email: "ava.b@neuravixor.edu",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      grade: "10th Grade",
      status: "Active",
      attendanceRate: 88,
      joinedDate: "2024-09-01",
    },
    {
      id: "STU-004",
      name: "Noah Davis",
      email: "noah.d@neuravixor.edu",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      grade: "12th Grade",
      status: "Active",
      attendanceRate: 90,
      joinedDate: "2022-09-01",
    },
    {
      id: "STU-005",
      name: "Mia Martinez",
      email: "mia.m@neuravixor.edu",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      grade: "12th Grade",
      status: "Active",
      attendanceRate: 95,
      joinedDate: "2022-09-01",
    },
    {
      id: "STU-006",
      name: "Ethan Miller",
      email: "ethan.m@neuravixor.edu",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
      grade: "11th Grade",
      status: "Grace Period",
      attendanceRate: 84,
      joinedDate: "2023-09-01",
    },
    {
      id: "STU-007",
      name: "Isabella Wilson",
      email: "isabella.w@neuravixor.edu",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150",
      grade: "10th Grade",
      status: "Active",
      attendanceRate: 96,
      joinedDate: "2024-09-01",
    },
    {
      id: "STU-008",
      name: "James Taylor",
      email: "james.t@neuravixor.edu",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
      grade: "12th Grade",
      status: "Suspended",
      attendanceRate: 70,
      joinedDate: "2022-09-01",
    }
  ]);

  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: "TCH-001",
      name: "Dr. Emily Carter",
      subject: "Mathematics",
      email: "emily.carter@neuravixor.edu",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      joinedDate: "2020-08-15",
      schedule: ["Mon 9:00 AM", "Wed 9:00 AM", "Fri 10:30 AM"],
      bio: "Ph.D. in Applied Mathematics from MIT. 10+ years teaching experience. Specialist in algebraic models and statistics.",
    },
    {
      id: "TCH-002",
      name: "Mr. James Wilson",
      subject: "Physics",
      email: "james.wilson@neuravixor.edu",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
      joinedDate: "2021-09-01",
      schedule: ["Tue 10:30 AM", "Thu 10:30 AM", "Fri 1:00 PM"],
      bio: "M.S. in Physics from Stanford. Dedicated to making thermodynamics and quantum concepts accessible to high schoolers.",
    },
    {
      id: "TCH-003",
      name: "Ms. Olivia Martinez",
      subject: "English",
      email: "olivia.m@neuravixor.edu",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
      joinedDate: "2022-01-10",
      schedule: ["Mon 1:00 PM", "Wed 1:00 PM", "Thu 9:00 AM"],
      bio: "B.A. in English Literature from Oxford. Enthusiast of Shakespearean theater and modern creative writing workshops.",
    },
    {
      id: "TCH-004",
      name: "Dr. Robert Chen",
      subject: "Chemistry",
      email: "robert.chen@neuravixor.edu",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      joinedDate: "2019-09-01",
      schedule: ["Tue 9:00 AM", "Wed 10:30 AM", "Fri 9:00 AM"],
      bio: "Ph.D. in Chemistry. Passionate researcher in organic chemistry and laboratory safety protocols.",
    }
  ]);

  const [classes, setClasses] = useState<ClassItem[]>([
    {
      id: "CLS-001",
      name: "Mathematics AP",
      teacherId: "TCH-001",
      studentsCount: 28,
      maxCapacity: 30,
      schedule: "Mon, Wed 9:00 AM - 10:30 AM",
      room: "Room 304",
    },
    {
      id: "CLS-002",
      name: "Classical Physics",
      teacherId: "TCH-002",
      studentsCount: 22,
      maxCapacity: 25,
      schedule: "Tue, Thu 10:30 AM - 12:00 PM",
      room: "Lab 2",
    },
    {
      id: "CLS-003",
      name: "English Literature",
      teacherId: "TCH-003",
      studentsCount: 25,
      maxCapacity: 25,
      schedule: "Mon, Wed 1:00 PM - 2:30 PM",
      room: "Room 102",
    },
    {
      id: "CLS-004",
      name: "Organic Chemistry",
      teacherId: "TCH-004",
      studentsCount: 18,
      maxCapacity: 20,
      schedule: "Tue, Fri 9:00 AM - 10:30 AM",
      room: "Lab 4",
    }
  ]);

  // Prepopulate attendance records for today and yesterday
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  const [exams, setExams] = useState<Exam[]>([
    {
      id: "EXM-001",
      title: "Calculus Limits Exam",
      classId: "CLS-001",
      date: "2026-07-05",
      time: "09:30 AM",
      totalMarks: 100,
    },
    {
      id: "EXM-002",
      title: "Newtonian Mechanics Quiz",
      classId: "CLS-002",
      date: "2026-07-08",
      time: "11:00 AM",
      totalMarks: 50,
    },
    {
      id: "EXM-003",
      title: "Shakespeare Essay Submission",
      classId: "CLS-003",
      date: "2026-07-12",
      time: "02:00 PM",
      totalMarks: 100,
    },
    {
      id: "EXM-004",
      title: "Acid-Base Chemistry Lab Test",
      classId: "CLS-004",
      date: "2026-07-15",
      time: "09:30 AM",
      totalMarks: 75,
    }
  ]);

  const [grades, setGrades] = useState<GradeRecord[]>([]);

  const [fees, setFees] = useState<FeeInvoice[]>([
    {
      id: "INV-001",
      studentId: "STU-001",
      amount: 1500,
      dueDate: "2026-07-15",
      status: "Paid",
      paymentMethod: "Credit Card",
      paymentDate: "2026-06-28",
    },
    {
      id: "INV-002",
      studentId: "STU-002",
      amount: 1500,
      dueDate: "2026-07-15",
      status: "Paid",
      paymentMethod: "Bank Transfer",
      paymentDate: "2026-06-30",
    },
    {
      id: "INV-003",
      studentId: "STU-003",
      amount: 1500,
      dueDate: "2026-07-15",
      status: "Unpaid",
    },
    {
      id: "INV-004",
      studentId: "STU-004",
      amount: 1500,
      dueDate: "2026-07-15",
      status: "Unpaid",
    },
    {
      id: "INV-005",
      studentId: "STU-005",
      amount: 1500,
      dueDate: "2026-07-15",
      status: "Paid",
      paymentMethod: "PayPal",
      paymentDate: "2026-06-29",
    },
    {
      id: "INV-006",
      studentId: "STU-006",
      amount: 1500,
      dueDate: "2026-06-20",
      status: "Overdue",
    },
    {
      id: "INV-007",
      studentId: "STU-007",
      amount: 1500,
      dueDate: "2026-07-15",
      status: "Paid",
      paymentMethod: "Credit Card",
      paymentDate: "2026-06-27",
    },
    {
      id: "INV-008",
      studentId: "STU-008",
      amount: 1500,
      dueDate: "2026-06-15",
      status: "Overdue",
    }
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "NTF-001",
      title: "Welcome to Neuravixor",
      message: "The Educational Institution Management System is loaded. Interactive Demo Mode active.",
      type: "success",
      timestamp: "Just now",
    },
    {
      id: "NTF-002",
      title: "Outstanding Fees Alert",
      message: "Student Ethan Miller's invoice INV-006 is currently overdue.",
      type: "warning",
      timestamp: "2 hours ago",
    },
    {
      id: "NTF-003",
      title: "Calculus Exam Scheduled",
      message: "Dr. Emily Carter scheduled Calculus Limits Exam for 2026-07-05.",
      type: "info",
      timestamp: "5 hours ago",
    }
  ]);

  // Fill in default attendance for previous days
  useEffect(() => {
    const dates = ["2026-06-30", "2026-07-01"];
    const initialAttendance: AttendanceRecord[] = [];
    
    dates.forEach(d => {
      students.forEach(s => {
        // Base attendance status on their overall rate to make charts consistent
        let status: AttendanceStatus = "Present";
        const rand = Math.random() * 100;
        if (s.attendanceRate < 80) {
          status = rand > 40 ? "Present" : (rand > 15 ? "Absent" : "Leave");
        } else if (s.attendanceRate < 92) {
          status = rand > 15 ? "Present" : (rand > 5 ? "Absent" : "Leave");
        } else {
          status = rand > 6 ? "Present" : (rand > 2 ? "Absent" : "Leave");
        }
        initialAttendance.push({
          date: d,
          studentId: s.id,
          status
        });
      });
    });
    setAttendance(initialAttendance);
  }, []);

  // Recalculate attendance rate for student whenever attendance changes
  const recalculateStudentAttendance = (studentId: string, currentAttendance: AttendanceRecord[]) => {
    const studentRecords = currentAttendance.filter(r => r.studentId === studentId);
    if (studentRecords.length === 0) return;
    const presentOrLeave = studentRecords.filter(r => r.status === "Present" || r.status === "Leave").length;
    const rate = Math.round((presentOrLeave / studentRecords.length) * 100);
    
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, attendanceRate: rate } : s));
  };

  // --- Actions ---

  const addStudent = (newStu: Omit<Student, "id" | "joinedDate" | "attendanceRate">) => {
    const id = `STU-0${students.length + 1}`;
    const joinedDate = new Date().toISOString().split("T")[0];
    const student: Student = {
      ...newStu,
      id,
      joinedDate,
      attendanceRate: 100
    };
    
    setStudents(prev => [student, ...prev]);
    addNotification("Student Added", `${student.name} has been enrolled in the institution.`, "success");
  };

  const updateStudent = (updatedStu: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStu.id ? updatedStu : s));
    addNotification("Student Updated", `${updatedStu.name}'s profile has been updated.`, "info");
  };

  const deleteStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    if (student) {
      addNotification("Student Removed", `${student.name} has been removed from records.`, "warning");
    }
  };

  const addTeacher = (newTch: Omit<Teacher, "id" | "joinedDate">) => {
    const id = `TCH-0${teachers.length + 1}`;
    const joinedDate = new Date().toISOString().split("T")[0];
    const teacher: Teacher = {
      ...newTch,
      id,
      joinedDate
    };
    
    setTeachers(prev => [...prev, teacher]);
    addNotification("Teacher Registered", `${teacher.name} is now registered under ${teacher.subject}.`, "success");
  };

  const updateTeacher = (updatedTch: Teacher) => {
    setTeachers(prev => prev.map(t => t.id === updatedTch.id ? updatedTch : t));
    addNotification("Teacher Updated", `${updatedTch.name}'s details have been updated.`, "info");
  };

  const deleteTeacher = (id: string) => {
    const teacher = teachers.find(t => t.id === id);
    setTeachers(prev => prev.filter(t => t.id !== id));
    if (teacher) {
      addNotification("Teacher Removed", `${teacher.name} has been removed from profiles.`, "warning");
    }
  };

  const addClass = (newCls: Omit<ClassItem, "id" | "studentsCount">) => {
    const id = `CLS-0${classes.length + 1}`;
    const classItem: ClassItem = {
      ...newCls,
      id,
      studentsCount: 0
    };
    setClasses(prev => [...prev, classItem]);
    addNotification("Class Created", `Class ${classItem.name} has been added.`, "success");
  };

  const updateClass = (updatedCls: ClassItem) => {
    setClasses(prev => prev.map(c => c.id === updatedCls.id ? updatedCls : c));
    addNotification("Class Updated", `Class ${updatedCls.name} updated.`, "info");
  };

  const deleteClass = (id: string) => {
    const cls = classes.find(c => c.id === id);
    setClasses(prev => prev.filter(c => c.id !== id));
    if (cls) {
      addNotification("Class Cancelled", `Class ${cls.name} has been cancelled.`, "warning");
    }
  };

  const markAttendance = (date: string, studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => {
      const filtered = prev.filter(r => !(r.date === date && r.studentId === studentId));
      const updated = [...filtered, { date, studentId, status }];
      setTimeout(() => recalculateStudentAttendance(studentId, updated), 50);
      return updated;
    });
  };

  const bulkMarkAttendance = (date: string, records: { studentId: string; status: AttendanceStatus }[]) => {
    setAttendance(prev => {
      const studentIdsToUpdate = records.map(r => r.studentId);
      const filtered = prev.filter(r => !(r.date === date && studentIdsToUpdate.includes(r.studentId)));
      const newRecords = records.map(r => ({ date, studentId: r.studentId, status: r.status }));
      const updated = [...filtered, ...newRecords];
      
      // Recalculate for each updated student
      setTimeout(() => {
        studentIdsToUpdate.forEach(sid => recalculateStudentAttendance(sid, updated));
      }, 50);
      
      return updated;
    });
    addNotification("Attendance Logged", `Attendance for ${records.length} students recorded for ${date}.`, "success");
  };

  const addExam = (newExam: Omit<Exam, "id">) => {
    const id = `EXM-0${exams.length + 1}`;
    const exam: Exam = { ...newExam, id };
    setExams(prev => [...prev, exam]);
    addNotification("Exam Scheduled", `${exam.title} has been scheduled for ${exam.date}.`, "info");
  };

  const deleteExam = (id: string) => {
    const exam = exams.find(e => e.id === id);
    setExams(prev => prev.filter(e => e.id !== id));
    if (exam) {
      addNotification("Exam Cancelled", `${exam.title} scheduled on ${exam.date} is cancelled.`, "warning");
    }
  };

  const submitGrade = (examId: string, studentId: string, marksObtained: number) => {
    setGrades(prev => {
      const filtered = prev.filter(g => !(g.examId === examId && g.studentId === studentId));
      return [...filtered, { examId, studentId, marksObtained }];
    });
    
    const student = students.find(s => s.id === studentId);
    const exam = exams.find(e => e.id === examId);
    if (student && exam) {
      addNotification("Grade Logged", `Score logged for ${student.name} in ${exam.title}: ${marksObtained}/${exam.totalMarks}.`, "success");
    }
  };

  const payInvoice = (invoiceId: string, method: string) => {
    setFees(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          status: "Paid",
          paymentMethod: method,
          paymentDate: new Date().toISOString().split("T")[0]
        };
      }
      return inv;
    }));
    const inv = fees.find(i => i.id === invoiceId);
    const stu = inv ? students.find(s => s.id === inv.studentId) : null;
    if (stu && inv) {
      addNotification("Payment Received", `Received $${inv.amount} fee payment for ${stu.name}.`, "success");
    }
  };

  const createInvoice = (studentId: string, amount: number, dueDate: string) => {
    const id = `INV-0${fees.length + 1}`;
    const invoice: FeeInvoice = {
      id,
      studentId,
      amount,
      dueDate,
      status: "Unpaid"
    };
    setFees(prev => [...prev, invoice]);
    const stu = students.find(s => s.id === studentId);
    if (stu) {
      addNotification("Invoice Issued", `Issued invoice ${id} for $${amount} to ${stu.name}.`, "info");
    }
  };

  const addNotification = (title: string, message: string, type: "info" | "warning" | "success") => {
    const newNotif: NotificationItem = {
      id: `NTF-0${Date.now()}`,
      title,
      message,
      type,
      timestamp: "Just now",
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 19)]); // Keep last 20
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        students,
        teachers,
        classes,
        attendance,
        exams,
        grades,
        fees,
        notifications,
        activeTab,
        setActiveTab,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addClass,
        updateClass,
        deleteClass,
        markAttendance,
        bulkMarkAttendance,
        addExam,
        deleteExam,
        submitGrade,
        payInvoice,
        createInvoice,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
