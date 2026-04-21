import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { 
  Users, DollarSign, UserCheck, UserMinus, Plus, Trash2, 
  Search, ArrowLeft, MoreVertical, Check, AlertCircle, 
  PieChart as PieChartIcon, BarChart as BarChartIcon,
  MessageSquare, User
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Student } from "../types";
import { ADMIN_PASSWORD, DEFAULT_CONFIG } from "../constants";
import { cn } from "../lib/utils";

interface AdminPanelProps {
  students: Student[];
  onUpdateStudent: (id: string, updates: Partial<Student>) => void;
  onAddStudent: (name: string) => void;
  onDeleteStudent: (id: string) => void;
  onBack: () => void;
}

export default function AdminPanel({ students, onUpdateStudent, onAddStudent, onDeleteStudent, onBack }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [newName, setNewName] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<'all' | 'unpaid' | 'attending' | 'absent'>('all');
  const [activeTab, setActiveTab] = useState<'roster' | 'messages'>('roster');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert("密碼不正確");
    }
  };

  const totals = useMemo(() => ({
    attending: students.filter(s => s.isAttending).length,
    absent: students.filter(s => !s.isAttending).length,
    paid: students.filter(s => {
      const target = s.isAttending ? DEFAULT_CONFIG.attendingFee : DEFAULT_CONFIG.absentFee;
      return s.paidAmount >= target;
    }).length,
    totalExpected: students.reduce((acc, s) => acc + (s.isAttending ? DEFAULT_CONFIG.attendingFee : DEFAULT_CONFIG.absentFee), 0),
    totalCollected: students.reduce((acc, s) => acc + s.paidAmount, 0),
  }), [students]);

  const chartData = useMemo(() => [
    { name: '已繳費', value: totals.paid, color: '#10b981' },
    { name: '未結清', value: students.length - totals.paid, color: '#f59e0b' },
  ], [students.length, totals.paid]);

  const filteredStudents = useMemo(() => students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'unpaid') {
      const target = s.isAttending ? DEFAULT_CONFIG.attendingFee : DEFAULT_CONFIG.absentFee;
      return matchesSearch && s.paidAmount < target;
    }
    if (filter === 'attending') return matchesSearch && s.isAttending;
    if (filter === 'absent') return matchesSearch && !s.isAttending;
    return matchesSearch;
  }), [students, search, filter]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-400">
              <Users size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white">後台管理系統</h1>
            <p className="text-slate-400 mt-2">請輸入管理員金鑰</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="密碼"
            />
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all">驗證登入</button>
            <button type="button" onClick={onBack} className="w-full text-slate-500 text-sm hover:text-slate-300">返回</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 hidden lg:flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Users size={16} />
          </div>
          <span className="font-black text-slate-900 tracking-tight">GradGroup Admin</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button 
            onClick={() => setActiveTab('roster')} 
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-bold transition-all", 
              activeTab === 'roster' ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <Users size={18} /> 名單與財務
          </button>
          <button 
            onClick={() => setActiveTab('messages')} 
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-bold transition-all", 
              activeTab === 'messages' ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <MessageSquare size={18} /> 留言管理
          </button>
        </nav>

        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-red-600 font-bold text-sm transition-all pb-4">
          <ArrowLeft size={18} /> 離開後台
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="lg:hidden flex items-center gap-2 mr-2">
              <button 
                onClick={() => setActiveTab(activeTab === 'roster' ? 'messages' : 'roster')}
                className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm"
              >
                {activeTab === 'roster' ? <MessageSquare size={20} /> : <Users size={20} />}
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                {activeTab === 'roster' ? "財務與名單管理" : "感言留言管理"}
              </h1>
              <p className="text-slate-500">
                {activeTab === 'roster' ? "即時監控出席狀態與對帳紀錄。" : "管理學生留言與老師回覆內容。"}
              </p>
            </div>
          </div>
          {activeTab === 'roster' && (
            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
              <div className="px-4 py-2 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-[10px]">實收總額</p>
                <p className="text-lg font-black text-slate-900">${totals.totalCollected}</p>
              </div>
              <div className="w-px bg-slate-100" />
              <div className="px-4 py-2 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-[10px]">預計差額</p>
                <p className="text-lg font-black text-rose-600">-${totals.totalExpected - totals.totalCollected}</p>
              </div>
            </div>
          )}
        </header>

        {activeTab === 'roster' ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard title="出席人數" value={totals.attending} icon={<UserCheck />} color="indigo" />
              <StatCard title="缺席人數" value={totals.absent} icon={<UserMinus />} color="slate" />
              <StatCard title="繳費完成" value={totals.paid} icon={<Check />} color="emerald" />
              <StatCard title="總名單" value={students.length} icon={<Users />} color="blue" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="搜尋學生姓名..."
                      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none shadow-sm"
                    />
                  </div>
                  <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="新增姓名"
                      className="px-3 py-1 outline-none text-sm w-32"
                    />
                    <button
                      onClick={() => { if(newName) { onAddStudent(newName); setNewName(""); } }}
                      className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr className="text-xs font-black text-slate-400 uppercase tracking-widest">
                          <th className="px-6 py-4">姓名</th>
                          <th className="px-6 py-4">狀態</th>
                          <th className="px-6 py-4">已繳 / 應繳</th>
                          <th className="px-6 py-4">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-slate-900">{student.name}</span>
                                {student.isAnonymous && <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400 text-[10px] font-bold">匿名</span>}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => onUpdateStudent(student.id, { isAttending: !student.isAttending })}
                                className={cn(
                                  "px-3 py-1 rounded-full text-xs font-bold transition-all",
                                  student.isAttending ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400"
                                )}
                              >
                                {student.isAttending ? "當天出席" : "不克出席"}
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={student.paidAmount}
                                  onChange={(e) => onUpdateStudent(student.id, { paidAmount: parseInt(e.target.value) || 0 })}
                                  className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none"
                                />
                                <span className="text-slate-400 text-xs">/ ${student.isAttending ? DEFAULT_CONFIG.attendingFee : DEFAULT_CONFIG.absentFee}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => onDeleteStudent(student.id)}
                                className="text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Charts & Tools */}
              <div className="space-y-8">
                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 text-sm">
                    <PieChartIcon size={18} className="text-indigo-600" /> 繳費狀態分佈
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chartData} innerRadius={45} outerRadius={65} paddingAngle={5} dataKey="value">
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4 text-[10px] font-bold">
                    {chartData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-slate-500 uppercase tracking-wider">{item.name}</span>
                        </div>
                        <span className="text-slate-900">{item.value} 人</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-900 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100">
                  <h3 className="text-lg font-bold mb-4 text-sm">管理員公告</h3>
                  <p className="text-indigo-200 text-xs leading-relaxed mb-6">
                    提醒：活動即將開始，請確認所有款項已結清。本系統採即時同步，請勿隨意刪除正式名單。
                  </p>
                  <button className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 rounded-xl font-bold text-xs transition-all">
                    匯出數據報表
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6">
              {students.filter(s => s.messageToTeacher || s.oneLiner || s.teacherReply).map(student => (
                <div key={student.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{student.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          {student.isAnonymous ? "匿名傳送" : "實名傳送"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onUpdateStudent(student.id, { oneLiner: "", messageToTeacher: "" })}
                        className="text-xs font-bold text-rose-500 hover:bg-rose-50 px-3 py-1 rounded-lg transition-all border border-rose-100"
                        title="清除留言"
                      >
                        清空感言
                      </button>
                      {student.teacherReply && (
                        <button 
                          onClick={() => onUpdateStudent(student.id, { teacherReply: "", teacherReplyName: "" })}
                          className="text-xs font-bold text-indigo-500 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-all border border-indigo-100"
                          title="修復回覆內容"
                        >
                          刪除回覆
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {student.oneLiner && (
                    <div className="bg-slate-50 p-4 rounded-2xl space-y-1">
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">一句話總結</p>
                      <p className="text-sm text-slate-700 italic font-medium">"{student.oneLiner}"</p>
                    </div>
                  )}

                  {student.messageToTeacher && (
                    <div className="space-y-1 p-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">給老師的真心話</p>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {student.messageToTeacher}
                      </p>
                    </div>
                  )}

                  {student.teacherReply && (
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 relative">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Check size={10} /> 老師的回覆 ({student.teacherReplyName})
                      </p>
                      <p className="text-sm text-emerald-700 font-medium">
                        {student.teacherReply}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              {students.filter(s => s.messageToTeacher || s.oneLiner || s.teacherReply).length === 0 && (
                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                  <MessageSquare className="mx-auto text-slate-200 mb-4" size={48} />
                  <p className="text-slate-400 font-bold">目前尚無任何同學填寫感言</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colors: any = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    slate: "bg-slate-50 text-slate-500",
    blue: "bg-blue-50 text-blue-600",
  };
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", colors[color])}>
        {icon}
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 tracking-tighter">{title}</p>
      <p className="text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}
