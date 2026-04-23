import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, MessageSquare, Heart, Info, DollarSign, ArrowLeft, CheckCircle2, ChevronRight, Lock, Key, ShieldCheck } from "lucide-react";
import { DEFAULT_CONFIG } from "../constants";
import { Student } from "../types";
import { cn } from "../lib/utils";

interface StudentSectionProps {
  students: Student[];
  onUpdateStudent: (id: string, updates: Partial<Student>) => void;
  onBack: () => void;
}

export default function StudentSection({ students, onUpdateStudent, onBack }: StudentSectionProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showFormula, setShowFormula] = useState(false);
  const [showTeachers, setShowTeachers] = useState(false);
  const [oneLiner, setOneLiner] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  // Stats calculation
  const totalPaidCount = useMemo(() => students.filter(s => {
    const target = s.isAttending ? DEFAULT_CONFIG.attendingFee : DEFAULT_CONFIG.absentFee;
    return s.paidAmount >= target;
  }).length, [students]);
  
  const paymentPercentage = useMemo(() => students.length > 0 ? Math.round((totalPaidCount / students.length) * 100) : 0, [students.length, totalPaidCount]);

  // Handle student selection
  const handleSelect = (id: string) => {
    setSelectedStudentId(id);
    setIsVerified(false);
    setPasswordInput("");
    setPasswordError("");
    const student = students.find(s => s.id === id);
    if (student) {
      setOneLiner(student.oneLiner || "");
      setMessage(student.messageToTeacher || "");
      setIsAnonymous(student.isAnonymous || false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVerifyPassword = () => {
    if (!selectedStudent) return;
    if (selectedStudent.password === passwordInput) {
      setIsVerified(true);
      setPasswordError("");
    } else {
      setPasswordError("密碼錯誤，請再試一次");
    }
  };

  const handleSetPassword = () => {
    if (!selectedStudentId || !passwordInput) return;
    if (passwordInput.length < 4) {
      setPasswordError("請設定至少 4 位數密碼");
      return;
    }
    onUpdateStudent(selectedStudentId, { password: passwordInput });
    setIsVerified(true);
    setPasswordError("");
  };

  const handleSave = async () => {
    if (!selectedStudentId) return;
    setIsSaving(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    onUpdateStudent(selectedStudentId, {
      oneLiner,
      messageToTeacher: message,
      isAnonymous
    });
    setIsSaving(false);
    setLastSaved(new Date().toLocaleTimeString());
    setTimeout(() => setLastSaved(null), 3000);
  };

  // Password Barrier View
  const renderPasswordBarrier = () => {
    if (!selectedStudent) return null;
    const hasPassword = !!selectedStudent.password;

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center"
        >
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            {hasPassword ? <Lock size={32} /> : <ShieldCheck size={32} />}
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {hasPassword ? "身分驗證" : "建立安全防護"}
          </h2>
          <p className="text-slate-500 text-sm mb-8">
            {hasPassword 
              ? `${selectedStudent.name}，請輸入您設定的密碼以繼續。` 
              : "這是您第一次進入，請設定一個簡單的密碼，防止他人修改您的感言。"}
          </p>

          <div className="space-y-4">
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
                placeholder={hasPassword ? "請輸入密碼" : "設定新密碼 (至少 4 位)"}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-center tracking-widest font-bold"
                onKeyDown={(e) => e.key === 'Enter' && (hasPassword ? handleVerifyPassword() : handleSetPassword())}
              />
            </div>
            
            {passwordError && (
              <p className="text-xs font-bold text-rose-500">{passwordError}</p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedStudentId(null)}
                className="bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                返回名單
              </button>
              <button
                onClick={hasPassword ? handleVerifyPassword : handleSetPassword}
                className="bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
              >
                {hasPassword ? "進入驗證" : "確認設定"}
              </button>
            </div>

            {!hasPassword && (
              <button
                onClick={() => setIsVerified(true)}
                className="w-full text-indigo-600/60 text-xs font-bold hover:text-indigo-600 py-1"
              >
                先不設定，直接進入 →
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  if (!selectedStudentId) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-12">
        <div className="max-w-2xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-8">
            <ArrowLeft size={18} /> 返回首頁
          </button>
          
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">身分確認</h1>
            <p className="text-slate-500">請從名單中選擇您的名字，即可開始填寫感言與查詢細節。</p>
          </div>

          {/* Progress Bar Header */}
          <div className="mb-8 p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  📊 全班對帳進度集結
                </h3>
                <p className="text-slate-500 text-xs">目前的繳費對帳進度，大家一起達成目標吧！</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-indigo-600">{paymentPercentage}%</span>
                <span className="text-[10px] font-bold text-slate-400 ml-1">({totalPaidCount}/{students.length})</span>
              </div>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner flex relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${paymentPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 relative z-10"
              />
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.05)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.05)_50%,rgba(0,0,0,0.05)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress-bar-stripes_1s_linear_infinite]" />
            </div>
            <div className="mt-3 flex justify-between">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Start</p>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest animate-pulse">
                {paymentPercentage === 100 ? "MISSION COMPLETED! 🥳" : "Almost there, Keep Going! 🚀"}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">100%</p>
            </div>

            {/* Reminder for exact change */}
            <div className="mt-6 pt-6 border-t border-slate-50">
              <div className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                  <DollarSign size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-900">繳費溫馨提示</p>
                  <p className="text-[11px] text-amber-700 leading-relaxed mt-0.5">
                    歡迎 <span className="font-bold text-amber-900">隨時或預約時間</span> 交錢給班代，請盡量自備剛好金額，並務必於 <span className="font-bold underline text-rose-600">活動當天之前</span> 完成對帳喔！ 🚀
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {students.map((student) => {
              const requiredFee = student.isAttending ? DEFAULT_CONFIG.attendingFee : DEFAULT_CONFIG.absentFee;
              const isPaid = student.paidAmount >= requiredFee;
              
              return (
                <button
                  key={student.id}
                  onClick={() => handleSelect(student.id)}
                  className="w-full bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-indigo-500 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                      <User size={20} />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">{student.name}</span>
                        {student.isAttending ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">出席</span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">缺席</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {isPaid ? (
                          <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-0.5">
                            <CheckCircle2 size={12} /> 已繳清
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-amber-600 flex items-center gap-0.5">
                            <DollarSign size={12} /> 待繳費 (${requiredFee - student.paidAmount})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Password Verification Check
  if (!isVerified) {
    return renderPasswordBarrier();
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={onBack} className="text-slate-400 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <span className="font-bold text-slate-900">{selectedStudent?.name}</span>
          </div>
          <div className="w-8" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* Payment Status Card */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                selectedStudent?.paidAmount! >= (selectedStudent?.isAttending ? DEFAULT_CONFIG.attendingFee : DEFAULT_CONFIG.absentFee)
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              )}>
                <DollarSign size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">繳費進度</h3>
                <p className="text-sm text-slate-500">
                  {selectedStudent?.isAttending ? "出席者" : "不克出席"}分攤
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-slate-900">
                ${selectedStudent?.paidAmount} <span className="text-sm font-normal text-slate-400">/ ${selectedStudent?.isAttending ? DEFAULT_CONFIG.attendingFee : DEFAULT_CONFIG.absentFee}</span>
              </p>
              <div className="flex flex-col items-end gap-1 mt-1">
                <button 
                  onClick={() => setShowFormula(!showFormula)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                >
                  <Info size={12} /> 精算細節
                </button>
                <p className="text-[10px] font-bold text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full">
                  💡 隨時/預約交給班代，請於活動前收齊
                </p>
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {showFormula && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-slate-50 border-t border-slate-100 px-6 py-6"
              >
                <div className="space-y-4 text-sm text-slate-600">
                  <div>
                    <p className="font-bold text-slate-900 mb-2">🍽️ 餐廳現場消費精算 (三倆三)：</p>
                    <ul className="space-y-2 list-disc list-inside text-xs leading-relaxed">
                      <li><span className="font-medium">葷食桌菜 (23人份)：</span>$6,388 × 2套 = <span className="font-bold text-slate-800">$12,776</span></li>
                      <li><span className="font-medium">人數差額加收 (菜色加量)：</span>
                        <ul className="ml-5 mt-1 list-none space-y-0.5 opacity-80">
                          <li>• 第一桌 11人：+$71 (1人份)</li>
                          <li>• 第二桌 12人：+$142 (2人份)</li>
                          <li>小計：<span className="font-bold">$213</span></li>
                        </ul>
                      </li>
                      <li><span className="font-medium">個人素食套餐 (1人份)：</span><span className="font-bold text-slate-800">$528</span></li>
                    </ul>
                    <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between items-center px-1">
                      <span className="font-bold text-slate-900">餐廳端總計 (未含服務費)</span>
                      <span className="text-lg font-black text-indigo-600">$13,517</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="font-bold text-slate-900 mb-2">📊 每位學生分攤詳解：</p>
                    <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-100 text-xs">
                      <div className="pb-2 border-b border-slate-100">
                        <button 
                          onClick={() => setShowTeachers(!showTeachers)}
                          className="w-full text-left font-bold text-indigo-600 mb-1 flex items-center justify-between group"
                        >
                          <span>1. 老師餐費分攤 (共8位)</span>
                          <span className="text-[10px] bg-indigo-50 px-1.5 py-0.5 rounded text-indigo-400 group-hover:text-indigo-600 transition-colors">
                            {showTeachers ? "收合 ↑" : "點開看老師名單 ↓"}
                          </span>
                        </button>
                        
                        <AnimatePresence>
                          {showTeachers && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3 mt-1 px-2 py-2 bg-indigo-50/30 rounded-xl border border-indigo-50">
                                {[
                                  "嚴立模老師", "陳志峰老師", "李美燕老師", "余昭玟老師",
                                  "簡光明老師", "林秀蓉老師", "柯明傑老師", "劉建志老師"
                                ].map((t, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5 text-slate-500">
                                    <div className="w-1 h-1 rounded-full bg-indigo-300" />
                                    {t}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <p className="flex justify-between items-center">
                          <span>老師餐費總計 ÷ 全班 21人</span>
                          <span className="font-mono font-bold">$215 / 人</span>
                        </p>
                      </div>
                      <div className="pb-2 border-b border-slate-100">
                        <p className="font-bold text-slate-700 mb-1">2. 參加同學實收</p>
                        <p className="flex justify-between items-center">
                          <span>個人 $563 + 分攤 $215 = $778</span>
                          <span className="font-mono">實收 <span className="font-bold text-slate-900">$800</span> (含預備金)</span>
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-700 mb-1">3. 不參加者實收</p>
                        <p className="flex justify-between items-center">
                          <span>分攤 $215 + 收整數</span>
                          <span className="font-mono">實收 <span className="font-bold text-slate-900">$220</span> (含預備金)</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="font-bold text-slate-900 mb-1">💡 繳費原則說明：</p>
                    <p className="text-xs leading-relaxed opacity-80 italic">
                      目前收取的整數費用包含預備金，將採「多退少補」原則，或挪作「送老師的小禮物費」使用。我們秉持透明公平，每一分錢都會花在謝師宴的初衷上。
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <p className="font-bold text-slate-900 mb-1">分攤公式預覽：</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>出席：${DEFAULT_CONFIG.attendingFee} (含餐費＋雜支分攤)</li>
                      <li>缺席：${DEFAULT_CONFIG.absentFee} (僅基本雜支分攤)</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Testimonials Form */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="text-indigo-600" size={24} />
            <h2 className="text-xl font-bold text-slate-900">學生的聲明</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">一句話形容自己</label>
              <input
                type="text"
                value={oneLiner}
                onChange={(e) => setOneLiner(e.target.value)}
                placeholder="例如：班上的開心果、沈默的戰士"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">想對老師說的話</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="那些說不出口的話，都在這裡留給老師吧..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">是否匿名發表（僅管理員可見原名）</span>
              </label>

              <div className="flex items-center gap-4">
                {lastSaved && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 size={14} /> 已同步 ({lastSaved})
                  </motion.span>
                )}
                <button
                  disabled={isSaving}
                  onClick={handleSave}
                  className={cn(
                    "px-6 py-2 rounded-xl font-bold transition-all shadow-lg",
                    isSaving 
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100"
                  )}
                >
                  {isSaving ? "存取中..." : "保存感言"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="px-6 py-8 text-center bg-indigo-50/50 rounded-3xl border border-indigo-100/50">
          <Heart className="mx-auto text-indigo-400 mb-2" size={24} />
          <p className="text-sm text-indigo-900/60 leading-relaxed italic">
            「最好的告別，是把彼此最美好的樣子留在名為回憶的書信裡。」
          </p>
        </div>
      </div>
    </div>
  );
}
