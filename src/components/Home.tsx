import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, MapPin, UserRound, GraduationCap, Settings, Lock, Timer } from "lucide-react";
import { DEFAULT_CONFIG } from "../constants";
import { cn } from "../lib/utils";
import { Student } from "../types";

interface HomeProps {
  onEnterStudent: () => void;
  onEnterTeacher: () => void;
  onEnterAdmin: () => void;
}

export default function Home({ onEnterStudent, onEnterTeacher, onEnterAdmin }: HomeProps) {
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);
  const [isWallOpen, setIsWallOpen] = useState(false);

  // Target: 2026-05-27 18:00
  const TARGET_DATE = new Date("2026-05-27T18:00:00").getTime();
  // Wall Opening: 2026-05-27 17:50
  const WALL_OPEN_DATE = new Date("2026-05-27T17:50:00").getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = TARGET_DATE - now;

      setIsWallOpen(now >= WALL_OPEN_DATE);

      if (diff > 0) {
        setTimeLeft({
          d: Math.floor(diff / (1000 * 60 * 60 * 24)),
          h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((diff % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft(null);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTeacherWallClick = () => {
    if (isWallOpen) {
      onEnterTeacher();
    } else {
      alert("🎁 感言牆目前封印中，將於 5/27 下午 17:50 準時揭幕，保持神秘感！");
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Hero Section */}
      <section className="relative min-h-[75vh] py-20 flex items-center justify-center overflow-hidden bg-indigo-900 text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/seed/graduation/1920/1080')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/40 to-transparent" />
        
        <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-[10px] font-bold tracking-widest uppercase mb-6">
              Class of 2026 Graduation
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-10 leading-tight">
              畢業謝師宴 <br className="hidden md:block"/><span className="text-indigo-400">GradGroup</span>
            </h1>

            {/* Countdown Display */}
            {timeLeft && (
              <div className="flex justify-center gap-3 md:gap-8 mt-12">
                {[
                  { label: "DAYS", val: timeLeft.d },
                  { label: "HRS", val: timeLeft.h },
                  { label: "MINS", val: timeLeft.m },
                  { label: "SECS", val: timeLeft.s }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/20 flex flex-col items-center justify-center mb-2 shadow-2xl">
                      <span className="text-2xl md:text-4xl font-black">{item.val}</span>
                      <span className="text-[8px] md:text-[10px] font-bold text-indigo-300 tracking-widest">{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!timeLeft && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 bg-emerald-500 px-6 py-3 rounded-full text-sm font-black tracking-widest uppercase shadow-lg shadow-emerald-500/30"
              >
                🎉 活動進行中 PARTY ON!
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* (Moved Announcement Banner into the Details Card below) */}
      
      {/* Event Details Card */}
      <section className="max-w-4xl mx-auto px-4 -mt-12 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 p-8 md:p-12 border border-slate-100"
        >
          {/* Announcement Banner IN-CARD */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-amber-800 uppercase tracking-[0.2em] mb-1">最新公告 UPDATED</p>
              <p className="text-sm text-amber-800/80 leading-relaxed font-semibold">
                最新情報更新！與餐廳確認桌數與菜單後（取消單份素飯），總額降至 $12,989。經重新精算，每人應繳費用維持原定金額不變。再次感謝大家見諒！
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">活動日期</p>
                <p className="text-slate-900 font-semibold">{DEFAULT_CONFIG.eventDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <Timer size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">聚餐時間</p>
                <p className="text-slate-900 font-semibold">{DEFAULT_CONFIG.eventTime}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">活動地點</p>
                <p className="text-slate-900 font-semibold mb-2">{DEFAULT_CONFIG.eventLocation}</p>
                <a
                  href={DEFAULT_CONFIG.eventMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  查看 Google Maps →
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Entry Points */}
      <section className="max-w-4xl mx-auto px-4 py-20 pb-10">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Student Entrance */}
          <motion.button
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onEnterStudent}
            className="group relative h-64 bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 text-left p-8 transition-all hover:bg-white hover:shadow-xl hover:shadow-indigo-100"
          >
            <div className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
              <UserRound size={24} />
            </div>
            <div className="mt-20">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">學生專區</h3>
              <p className="text-slate-500 text-sm">填寫個人感言、查詢繳費進度與分攤細節。</p>
            </div>
            <div className="absolute bottom-8 left-8 flex items-center text-xs font-bold text-indigo-600 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
              身分驗證進入 →
            </div>
          </motion.button>

          {/* Teacher Entrance */}
          <motion.button
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTeacherWallClick}
            className={cn(
              "group relative h-64 rounded-3xl overflow-hidden border border-slate-100 text-left p-8 transition-all hover:shadow-xl",
              isWallOpen ? "bg-slate-50 hover:bg-white hover:shadow-indigo-100" : "bg-slate-100/50 cursor-not-allowed"
            )}
          >
            <div className={cn(
              "absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center transition-colors",
              isWallOpen ? "text-slate-400 group-hover:text-amber-600" : "text-slate-300"
            )}>
              {isWallOpen ? <GraduationCap size={24} /> : <Lock size={24} />}
            </div>
            <div className="mt-20">
              <h3 className={cn("text-2xl font-bold mb-2", isWallOpen ? "text-slate-900" : "text-slate-400")}>
                老師感言牆
              </h3>
              <p className="text-slate-500 text-sm">
                {isWallOpen ? "查看來自同學們最真摯的祝福與未來展望。" : "此區域目前封印中，等待謝師宴當天下午揭幕。"}
              </p>
            </div>
            <div className={cn(
              "absolute bottom-8 left-8 flex items-center text-xs font-bold tracking-widest uppercase transition-all transform",
              isWallOpen 
                ? "text-amber-600 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0" 
                : "text-slate-300 opacity-100"
            )}>
              {isWallOpen ? "立即查看 →" : "5/27 17:50 揭幕"}
            </div>
          </motion.button>
        </div>
      </section>

      {/* Dietary Restrictions Table */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              🍽️ 菜單飲食禁忌參考
            </h3>
            <span className="text-[10px] px-2 py-1 bg-slate-200 text-slate-500 rounded-full font-bold">
              AI 生成，僅供參考
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-4 font-bold text-slate-400 uppercase tracking-widest text-xs">菜名</th>
                  <th className="py-4 px-4 font-bold text-slate-400 uppercase tracking-widest text-xs text-center">海鮮素/奶蛋素</th>
                  <th className="py-4 px-4 font-bold text-slate-400 uppercase tracking-widest text-xs text-center">不吃牛羊海鮮</th>
                  <th className="py-4 px-4 font-bold text-slate-400 uppercase tracking-widest text-xs text-center">不能吃海鮮</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["1. 老媽在晾衣", "❌ 不能吃", "✅ 可以吃", "✅ 可以吃"],
                  ["2. 蔥香滿溢滾燙雞", "❌ 不能吃", "✅ 可以吃", "✅ 可以吃"],
                  ["3. 蟹黃豆腐煲 (含蟹)", "✅ 可以吃", "❌ 不能吃", "❌ 不能吃"],
                  ["4. 橙汁排骨 (豬肉)", "❌ 不能吃", "✅ 可以吃", "✅ 可以吃"],
                  ["5. 奶香麥酥蝦", "✅ 可以吃", "❌ 不能吃", "❌ 不能吃"],
                  ["6. 鬼馬溜雞片", "❌ 不能吃", "✅ 可以吃", "✅ 可以吃"],
                  ["7. 蝦仁滑蛋肉絲炒飯", "❌ 挑掉肉絲", "❌ 不能吃", "❌ 不能吃"],
                  ["8. 三把菇聊檸檬魚", "✅ 可以吃", "❌ 不能吃", "❌ 不能吃"],
                  ["9. 金銀蛋絲瓜", "✅ 可以吃", "✅ 可以吃", "✅ 可以吃"],
                  ["10. 祖傳花生豬腳湯", "❌ 不能吃", "✅ 可以吃", "✅ 可以吃"],
                  ["11. 螺絲奶子捲", "✅ 可以吃", "✅ 可以吃", "✅ 可以吃"],
                  ["12. 冰糖燉銀耳", "✅ 可以吃", "✅ 可以吃", "✅ 可以吃"],
                ].map(([name, v1, v2, v3], i) => (
                  <tr key={i} className="hover:bg-white/50 transition-colors">
                    <td className="py-4 font-medium text-slate-700">{name}</td>
                    <td className="py-4 px-4 text-center">{v1}</td>
                    <td className="py-4 px-4 text-center">{v2}</td>
                    <td className="py-4 px-4 text-center">{v3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-xs text-slate-400 italic leading-relaxed">
            * 註：以上標註為 AI 根據一般食材組成之推論，實際成分可能因餐廳烹調方式有所調整，過敏或嚴格素食者請於現場再次與餐廳人員確認。
          </p>
        </div>
      </section>

      {/* Footer & Admin Entry */}
      <footer className="max-w-4xl mx-auto px-4 py-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-400">© 2026 GradGroup. All rights reserved.</p>
        <button
          onClick={onEnterAdmin}
          className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-slate-900 transition-colors"
        >
          <Settings size={14} /> 管理員後台
        </button>
      </footer>
    </div>
  );
}
