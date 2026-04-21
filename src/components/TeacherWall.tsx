import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Quote, Sparkles, Heart, Trash2, Reply } from "lucide-react";
import { Student } from "../types";

interface TeacherWallProps {
  students: Student[];
  onUpdateStudent: (id: string, updates: Partial<Student>) => void;
  onBack: () => void;
}

export default function TeacherWall({ students, onUpdateStudent, onBack }: TeacherWallProps) {
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyName, setReplyName] = useState("老師");
  const [replyText, setReplyText] = useState("");

  // Only show students who have written a message
  const messages = students.filter(s => s.messageToTeacher || s.oneLiner);

  const startReply = (student: Student) => {
    setReplyingToId(student.id);
    setReplyName(student.teacherReplyName || "老師");
    setReplyText(student.teacherReply || "");
  };

  const submitReply = (id: string) => {
    if (!replyText.trim()) return;
    onUpdateStudent(id, {
      teacherReply: replyText,
      teacherReplyName: replyName
    });
    setReplyingToId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-6">
              <ArrowLeft size={18} /> 返回首頁
            </button>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2">老師感言牆</h1>
            <p className="text-slate-500 font-light text-lg">來自 Class of 2026 同學們最真誠的祝福與自省。</p>
          </div>
          <div className="flex -space-x-4">
            {students.slice(0, 5).map((s, i) => (
              <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center text-indigo-600 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${s.id}`} alt="avatar" referrerPolicy="no-referrer" />
              </div>
            ))}
            <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center text-slate-500 text-sm font-bold">
              +{Math.max(0, students.length - 5)}
            </div>
          </div>
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {messages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <Sparkles className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400">目前還沒有留言，快請同學們來填寫吧！</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {messages.map((student) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="break-inside-avoid bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all group"
              >
                <div className="relative">
                  <Quote className="absolute -top-4 -left-4 text-indigo-50 group-hover:text-indigo-100 transition-colors" size={48} />
                  <div className="relative z-10">
                    {student.oneLiner && (
                      <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-1">
                        <Sparkles size={12} /> {student.oneLiner}
                      </p>
                    )}
                    <p className="text-slate-700 leading-relaxed text-lg mb-6 whitespace-pre-wrap">
                      {student.messageToTeacher}
                    </p>
                    <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden bg-gradient-to-br from-indigo-50 to-white">
                          <img 
                            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${student.isAnonymous ? 'anon' + student.id : student.id}`} 
                            alt="sender" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {student.isAnonymous ? "畢業的小透明" : student.name}
                          </p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Graduated 2026</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => startReply(student)}
                        className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all lg:opacity-0 lg:group-hover:opacity-100"
                        title="老師回覆"
                      >
                        <Reply size={18} />
                      </button>
                    </div>

                    <AnimatePresence>
                      {replyingToId === student.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-6 space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">回覆姓名:</span>
                            <input 
                              type="text"
                              value={replyName}
                              onChange={(e) => setReplyName(e.target.value)}
                              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1 text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                          <textarea 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="輸入回覆內容..."
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                          />
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setReplyingToId(null)}
                              className="flex-1 py-2 bg-slate-200 text-slate-600 rounded-lg font-bold text-xs"
                            >
                              取消
                            </button>
                            <button 
                              onClick={() => submitReply(student.id)}
                              className="flex-2 py-2 bg-indigo-600 text-white rounded-lg font-bold text-xs"
                            >
                              送出回覆
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {student.teacherReply && replyingToId !== student.id && (
                      <div className="mt-6 bg-indigo-50 p-5 rounded-2xl border border-indigo-100 relative shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart size={14} className="text-indigo-500" fill="currentColor" />
                          <span className="text-xs font-bold text-indigo-600">
                            來自 {student.teacherReplyName} 的回覆：
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                          {student.teacherReply}
                        </p>
                        <button 
                          onClick={() => onUpdateStudent(student.id, { teacherReply: "", teacherReplyName: "" })}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-300 hover:text-rose-500 shadow-sm lg:opacity-0 lg:group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
