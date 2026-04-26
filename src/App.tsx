/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Home from "./components/Home";
import StudentSection from "./components/StudentSection";
import TeacherWall from "./components/TeacherWall";
import AdminPanel from "./components/AdminPanel";
import AuthBarrier from "./components/AuthBarrier";
import { Student } from "./types";
import { DEFAULT_CONFIG } from "./constants";
import { db, collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc, getDocs, setDoc } from "./lib/firebase";

type View = "home" | "student" | "teacher" | "admin" | "student-barrier";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [students, setStudents] = useState<Student[]>([]);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  console.log("App Rendering - View:", view, "Ready:", isFirebaseReady);

  // Auto-scroll to top on view change for better UX
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  // 1. One-time Setup & Seeding Logic
  useEffect(() => {
    const performInitialSetup = async () => {
      const FINAL_ORDER_LIST = [
        { name: "遊*驥", isAttending: false },
        { name: "黃*翰", isAttending: false },
        { name: "張*瑜", isAttending: true },
        { name: "鄭*昀", isAttending: false },
        { name: "楊*洋", isAttending: true },
        { name: "陳*璵", isAttending: true },
        { name: "賴*妤", isAttending: true },
        { name: "蔡*妤", isAttending: true },
        { name: "黃*婷", isAttending: true },
        { name: "曹*苹", isAttending: true },
        { name: "張*美", isAttending: true },
        { name: "楊*傑", isAttending: true },
        { name: "鐘*諺", isAttending: true },
        { name: "劉*儀", isAttending: true },
        { name: "蕭*燁", isAttending: false },
        { name: "胡*晴", isAttending: true },
        { name: "涂*襦", isAttending: true },
        { name: "張*瑋", isAttending: true },
        { name: "呂*綾", isAttending: true },
        { name: "王*豪", isAttending: false },
        { name: "許*恩", isAttending: false },
      ];

      try {
        const querySnapshot = await getDocs(collection(db, "students"));
        
        // ONLY seed if the database is EMPTY.
        // This prevents wiping data when new users visit.
        if (!querySnapshot.empty) {
          console.log("Database already seeded. Skipping initialization.");
          return;
        }

        console.log("Database is empty. Starting canonical seeding...");
        // Seed final list with FIXED IDs to prevent duplicates
        for (let i = 0; i < FINAL_ORDER_LIST.length; i++) {
          const s = FINAL_ORDER_LIST[i];
          const studentId = `student_order_${i}`; 
          await setDoc(doc(db, "students", studentId), {
            ...s,
            paidAmount: 0,
            oneLiner: "",
            messageToTeacher: "",
            isAnonymous: false,
            createdAt: Date.now(),
            order: i
          });
        }
        console.log("Seeding complete.");
      } catch (err) {
        console.error("Setup error:", err);
      }
    };

    performInitialSetup();
  }, []);

  // 2. Real-time Sync (Pure listener)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "students"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Student[];
      
      setStudents(data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      setIsFirebaseReady(true);
    }, (error) => {
      console.error("Firebase sync error:", error);
    });

    return () => unsub();
  }, []);

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      const studentDoc = doc(db, "students", id);
      await updateDoc(studentDoc, updates);
    } catch (e) {
      console.error("Update failed:", e);
      // Optimistic update for local fallback
      setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    }
  };

  const addStudent = async (name: string) => {
    const newStudent = {
      name,
      isAttending: true,
      paidAmount: 0,
      oneLiner: "",
      messageToTeacher: "",
      isAnonymous: false,
      createdAt: Date.now(),
    };
    
    try {
      await addDoc(collection(db, "students"), newStudent);
    } catch (e) {
      console.error("Add failed:", e);
    }
  };

  const deleteStudent = async (id: string) => {
    if (window.confirm("確定要刪除這位同學嗎？")) {
      try {
        await deleteDoc(doc(db, "students", id));
      } catch (e) {
        console.error("Delete failed:", e);
      }
    }
  };

  return (
    <div className="min-h-screen">
      {!isFirebaseReady && view !== "home" && (
        <div className="fixed top-0 left-0 w-full h-1 bg-indigo-200 overflow-hidden z-50">
          <div className="w-1/2 h-full bg-indigo-600 animate-[loading_1s_infinite]" />
        </div>
      )}
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>

      {view === "home" && (
        <Home 
          onEnterStudent={() => setView("student-barrier")} 
          onEnterTeacher={() => setView("teacher")} 
          onEnterAdmin={() => setView("admin")} 
        />
      )}

      {view === "student-barrier" && (
        <AuthBarrier 
          teacherSurname={DEFAULT_CONFIG.teacherSurname} 
          onValidated={() => setView("student")} 
        />
      )}

      {view === "student" && (
        <StudentSection 
          students={students} 
          onUpdateStudent={updateStudent} 
          onBack={() => setView("home")} 
        />
      )}

      {view === "teacher" && (
        <TeacherWall 
          students={students} 
          onUpdateStudent={updateStudent} 
          onBack={() => setView("home")} 
        />
      )}

      {view === "admin" && (
        <AdminPanel 
          students={students} 
          onUpdateStudent={updateStudent} 
          onAddStudent={addStudent}
          onDeleteStudent={deleteStudent}
          onBack={() => setView("home")} 
        />
      )}
    </div>
  );
}


