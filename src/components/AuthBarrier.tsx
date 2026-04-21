import React, { useState } from "react";
import { motion } from "motion/react";
import { Lock, GraduationCap } from "lucide-react";
import { cn } from "../lib/utils";

interface AuthBarrierProps {
  onValidated: () => void;
  teacherSurname: string;
}

export default function AuthBarrier({ onValidated, teacherSurname }: AuthBarrierProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === teacherSurname) {
      onValidated();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 text-indigo-600">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">謝師宴管理平台</h1>
          <p className="text-slate-500 mt-2">請輸入存取密鑰以繼續</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              班導師姓氏
            </label>
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={cn(
                  "w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all",
                  error ? "border-red-500 animate-shake" : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                )}
                placeholder="請輸入姓氏"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
            {error && <p className="mt-2 text-sm text-red-500 text-center">驗證錯誤，請重新輸入</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-100"
          >
            進入系統
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-400">
          <p>© 2026 畢業謝師宴籌備小組</p>
        </div>
      </motion.div>
    </div>
  );
}
