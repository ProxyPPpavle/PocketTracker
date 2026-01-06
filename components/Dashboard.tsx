
import React, { useState, useMemo } from 'react';
import { CurrencyType, Transaction, Goal, RecurringPayment } from '../types';
import { fromBase, toBase, formatCurrency } from '../utils/currency';
import { translations, Language } from '../i18n';
import Visualizations from './Visualizations';
import TransactionForm from './TransactionForm';
import GoalForm from './GoalForm';
import RecurringForm from './RecurringForm';
import FriendTab from './FriendTab';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  user: { username: string };
  onLogout: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

const TIER_THRESHOLDS = [200, 1000, 5000, 15000, 50000, 150000, 500000, 1500000, 5000000, 10000000];
const RANKS = [
  "Spender", "Saver", "Manager", "Owner", "Businessman", 
  "Investor", "Magnate", "Tycoon", "Billionaire", "Wealth Master"
];

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, lang, setLang }) => {
  const t = translations[lang];
  const [currency, setCurrency] = useState<CurrencyType>('USD');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [recurring, setRecurring] = useState<RecurringPayment[]>([]);
  const [showModal, setShowModal] = useState<'earn' | 'spend' | 'goal' | 'edit_goal' | 'edit_tx' | 'recurring' | null>(null);
  const [activeTxId, setActiveTxId] = useState<string | null>(null);
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const totalEarned = transactions.filter(t => t.type === 'earn').reduce((acc, t) => acc + t.amount, 0);
    const totalSpent = transactions.filter(t => t.type === 'spend').reduce((acc, t) => acc + t.amount, 0);
    const balance = totalEarned - totalSpent;
    const streak = transactions.length > 0 ? 7 : 0; 
    const balanceInUSD = fromBase(balance, 'USD');
    const tierIndex = TIER_THRESHOLDS.findIndex(th => balanceInUSD < th);
    const currentTier = tierIndex === -1 ? 9 : Math.max(0, tierIndex);
    const nextThreshold = TIER_THRESHOLDS[currentTier] || TIER_THRESHOLDS[TIER_THRESHOLDS.length - 1];
    const prevThreshold = TIER_THRESHOLDS[currentTier - 1] || 0;
    const progress = balanceInUSD <= prevThreshold ? 0 : Math.min(100, ((balanceInUSD - prevThreshold) / (nextThreshold - prevThreshold)) * 100);
    const rank = RANKS[Math.min(currentTier, RANKS.length - 1)];
    return { totalEarned, totalSpent, balance, streak, currentTier, progress, rank, nextThreshold };
  }, [transactions]);

  const handleAddTransaction = (data: { amount: number; description: string; goalId?: string }) => {
    const amountInBase = toBase(data.amount, currency);
    if (showModal === 'edit_tx' && activeTxId) {
       setTransactions(prev => prev.map(t => t.id === activeTxId ? { ...t, amount: amountInBase, description: data.description } : t));
    } else {
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        type: showModal === 'earn' ? 'earn' : 'spend',
        amount: amountInBase,
        category: 'General',
        description: data.description,
        date: new Date().toISOString(),
        goalId: data.goalId,
      };
      setTransactions([newTransaction, ...transactions]);
    }
    if (data.goalId) {
      setGoals(prev => prev.map(g => g.id === data.goalId ? { ...g, currentAmount: Math.max(0, g.currentAmount + (showModal === 'earn' ? amountInBase : -amountInBase)) } : g));
    }
    setShowModal(null);
  };

  const handleAddRecurring = (data: { name: string; amount: number; frequency: 'daily' | 'monthly' }) => {
    const amountInBase = toBase(data.amount, currency);
    const newR: RecurringPayment = { id: Math.random().toString(36).substr(2, 9), ...data, amount: amountInBase, type: 'spend' };
    setRecurring(prev => [newR, ...prev]);
    setTransactions(prev => [{ id: Math.random().toString(36).substr(2, 9), type: 'spend', amount: amountInBase, category: 'Recurring', description: data.name, date: new Date().toISOString() }, ...prev]);
    setShowModal(null);
  };

  const pieData = [{ value: stats.progress }, { value: 100 - stats.progress }];

  return (
    <div className="min-h-screen pb-32">
      <header className="sticky top-0 z-50 bg-[#030612]/95 backdrop-blur-3xl border-b border-white/10 py-2.5 sm:py-4 px-4 sm:px-10 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2.5">
           <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-black shadow-[0_5px_20px_rgba(59,130,246,0.3)] text-white text-[11px] sm:text-xl">P</div>
           <div className="flex flex-col">
             <h1 className="text-[10px] sm:text-sm font-black text-white uppercase tracking-tight leading-none">{user.username}</h1>
             <span className="text-[8px] sm:text-[9px] font-black text-blue-400 uppercase tracking-widest mt-0.5">Lvl {stats.currentTier + 1} • {stats.rank}</span>
           </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex bg-white/5 rounded-xl p-0.5 border border-white/10 scale-90 sm:scale-100">
            <button onClick={() => setLang('en')} className={`px-2 py-1 text-[9px] sm:text-[10px] rounded-lg font-black uppercase transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500'}`}>EN</button>
            <button onClick={() => setLang('sr')} className={`px-2 py-1 text-[9px] sm:text-[10px] rounded-lg font-black uppercase transition-all ${lang === 'sr' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500'}`}>SR</button>
          </div>
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value as CurrencyType)} 
            className="bg-white/10 border border-white/20 rounded-xl px-2 py-1 text-[9px] sm:text-[11px] font-black text-white focus:outline-none cursor-pointer appearance-none text-center shadow-inner"
          >
            <option value="USD">$</option>
            <option value="EUR">€</option>
            <option value="RSD">дин</option>
          </select>
          <button onClick={onLogout} className="text-rose-500/80 hover:text-rose-400 transition-all p-1 bg-rose-500/10 rounded-lg border border-rose-500/20"><svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-10 mt-6 sm:mt-10 space-y-6 sm:space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
          <div className="lg:col-span-4 flex flex-col gap-5 sm:gap-8 min-h-[400px]">
            <div className="flex-1 glass-card rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-7 relative overflow-hidden border border-white/20">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-500/5 to-transparent"></div>
               <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                     <div className="flex justify-between items-center mb-1">
                        <p className="text-slate-500 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em]">{t.balance}</p>
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-orange-500/10 border border-orange-500/30 rounded-full">
                          <span className="w-1 h-1 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.4)]"></span>
                          <span className="text-[8px] sm:text-[9px] font-black text-orange-400 uppercase tracking-tighter">{stats.streak} {t.streak}</span>
                        </div>
                     </div>
                     <h2 className="text-xl sm:text-3xl font-black tracking-tighter text-white mb-2 sm:mb-4 drop-shadow-xl">
                       {formatCurrency(fromBase(stats.balance, currency), currency)}
                     </h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                     <div>
                       <p className="text-[8px] sm:text-[9px] text-slate-500 font-black uppercase mb-0.5">{t.earned}</p>
                       <p className="text-base sm:text-xl font-black text-emerald-400">+{fromBase(stats.totalEarned, currency).toFixed(0)}</p>
                     </div>
                     <div>
                       <p className="text-[8px] sm:text-[9px] text-slate-500 font-black uppercase mb-0.5">{t.spent}</p>
                       <p className="text-base sm:text-xl font-black text-rose-400">-{fromBase(stats.totalSpent, currency).toFixed(0)}</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex-1 glass-card rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
               <p className="text-slate-500 text-[8px] sm:text-[9px] font-black uppercase mb-2 tracking-[0.3em]">{t.nextTier}</p>
               <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} innerRadius="72%" outerRadius="88%" startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                        <Cell fill="#3b82f6" /><Cell fill="rgba(255,255,255,0.06)" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm sm:text-xl font-black text-white">{Math.round(stats.progress)}%</span>
                  </div>
               </div>
               <div className="mt-2">
                 <p className="text-[9px] sm:text-[10px] font-black text-blue-400 uppercase tracking-widest">{stats.rank}</p>
               </div>
            </div>
          </div>

          <div className="lg:col-span-8 glass-card rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 min-h-[400px]">
             <h3 className="text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">{t.distribution}</h3>
             <div className="h-[calc(100%-2rem)]">
                <Visualizations transactions={transactions} currency={currency} type="daily" />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8">
           <div className="md:col-span-8 space-y-4 sm:space-y-6">
              <div className="flex justify-between items-center px-2">
                 <h3 className="text-[10px] sm:text-sm font-black uppercase tracking-[0.4em] text-slate-500">{t.goals}</h3>
                 <button onClick={() => setShowModal('goal')} className="text-[10px] sm:text-xs font-black uppercase text-blue-400 hover:text-blue-300 transition-colors">+ {t.addGoal}</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {goals.length === 0 && <div className="col-span-full py-16 text-center text-slate-600 italic text-sm border-2 border-dashed border-white/5 rounded-[2rem]">{t.noGoals}</div>}
                {goals.map(goal => {
                  const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
                  return (
                    <div key={goal.id} className="glass-card p-6 rounded-[2.5rem] border border-white/15 flex flex-col justify-between h-[140px] sm:h-[180px] group transition-all relative overflow-hidden bg-white/[0.02]">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm sm:text-xl font-black text-white truncate max-w-[150px]">{goal.name}</h4>
                        <button onClick={() => { setActiveGoalId(goal.id); setShowModal('edit_goal'); }} className="p-2 bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all shadow-inner border border-white/10">
                          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                      </div>
                      <div className="space-y-3 sm:space-y-5">
                        <div className="h-2.5 sm:h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
                          <div className="h-full bg-gradient-to-r from-blue-600 via-emerald-400 to-indigo-600 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(59,130,246,0.3)]" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] sm:text-xs font-black uppercase tracking-widest">
                          <span className="text-emerald-400">{fromBase(goal.currentAmount, currency).toFixed(0)}</span>
                          <span className="text-slate-500">{fromBase(goal.targetAmount, currency).toFixed(0)} {currency}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
           </div>

           <div className="md:col-span-4 glass-card rounded-2xl sm:rounded-[3rem] p-6 sm:p-8 border border-white/20 h-[250px] sm:h-auto flex flex-col bg-white/[0.01]">
              <div className="flex justify-between items-center mb-6 sm:mb-10">
                <h3 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">{t.recurring}</h3>
                <button onClick={() => setShowModal('recurring')} className="w-9 h-9 sm:w-12 sm:h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-black flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all text-base sm:text-2xl shadow-xl">+</button>
              </div>
              <div className="space-y-3 sm:space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
                {recurring.length === 0 && <p className="text-slate-600 italic text-xs py-10 text-center">{t.noActivity}</p>}
                {recurring.map(r => (
                  <div key={r.id} className="flex justify-between items-center p-3.5 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] transition-all">
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-black text-slate-300">{r.name}</span>
                      <span className="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase bg-white/10 px-2 py-0.5 rounded-md mt-1 w-fit">{r.frequency}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-black text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-xl">-{fromBase(r.amount, currency).toFixed(0)} {currency}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10">
           <div className="md:col-span-4 h-[300px] sm:h-[400px]">
              <FriendTab lang={lang} />
           </div>
           <div className="md:col-span-8 glass-card rounded-2xl sm:rounded-[3rem] p-6 sm:p-10 flex flex-col h-[320px] sm:h-[400px]">
              <div className="flex justify-between items-center mb-6 sm:mb-10">
                <h3 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.4em]">{t.recent}</h3>
                <span className="text-[9px] sm:text-xs font-black uppercase text-slate-600 tracking-widest">Global Activity</span>
              </div>
              <div className="space-y-3 sm:space-y-5 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {transactions.slice(0, 20).map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] transition-all group">
                     <div className="flex items-center gap-4 sm:gap-6">
                        <div className={`w-9 h-9 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-sm sm:text-2xl font-black ${item.type === 'earn' ? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-rose-500/10 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]'}`}>
                          {item.type === 'earn' ? '↑' : '↓'}
                        </div>
                        <div>
                          <p className="text-xs sm:text-lg font-black text-white">{item.description}</p>
                          <p className="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 opacity-60">{new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 sm:gap-10">
                        <p className={`text-sm sm:text-2xl font-black ${item.type === 'earn' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {item.type === 'earn' ? '+' : '-'}{fromBase(item.amount, currency).toFixed(0)} <span className="text-[10px] opacity-40">{currency}</span>
                        </p>
                        <button onClick={() => { setActiveTxId(item.id); setShowModal('edit_tx'); }} className="p-2 sm:p-3 bg-white/10 rounded-xl text-slate-500 hover:text-white transition-all border border-transparent hover:border-white/15">
                          <svg className="w-4 h-4 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                     </div>
                  </div>
                ))}
              </div>
           </div>
        </div>

        <div className="glass-card rounded-[2.5rem] sm:rounded-[4rem] p-6 sm:p-10 h-[250px] sm:h-[400px]">
           <h3 className="text-[10px] sm:text-sm font-black text-slate-400 uppercase tracking-widest mb-8 sm:mb-12">{t.performance}</h3>
           <Visualizations transactions={transactions} currency={currency} type="weekly" />
        </div>
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] sm:w-[calc(100%-5rem)] max-w-lg flex justify-center gap-4 sm:gap-8 z-[100]">
        <button onClick={() => setShowModal('spend')} className="flex-1 min-w-0 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 text-white font-black py-4 sm:py-7 rounded-[1.5rem] sm:rounded-[3rem] shadow-[0_20px_50px_rgba(244,63,94,0.35)] hover:scale-[1.03] active:scale-95 transition-all text-[10px] sm:text-sm uppercase tracking-[0.1em] sm:tracking-[0.2em] border-b-4 border-rose-900/30 truncate px-4">{t.addSpend}</button>
        <button onClick={() => setShowModal('earn')} className="flex-1 min-w-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-white font-black py-4 sm:py-7 rounded-[1.5rem] sm:rounded-[3rem] shadow-[0_20px_50px_rgba(16,185,129,0.35)] hover:scale-[1.03] active:scale-95 transition-all text-[10px] sm:text-sm uppercase tracking-[0.1em] sm:tracking-[0.2em] border-b-4 border-emerald-900/30 truncate px-4">{t.addEarn}</button>
      </div>

      {showModal === 'recurring' && <RecurringForm currency={currency} lang={lang} onSubmit={handleAddRecurring} onClose={() => setShowModal(null)} />}
      {(showModal === 'goal' || showModal === 'edit_goal') && (
        <GoalForm currency={currency} lang={lang} editingGoal={goals.find(g => g.id === activeGoalId)} onSubmit={(gData) => {
          if (gData.id) {
            setGoals(prev => prev.map(g => g.id === gData.id ? { ...g, name: gData.name, targetAmount: toBase(gData.targetAmount, currency), currentAmount: toBase(gData.currentAmount, currency) } : g));
          } else {
            setGoals(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), name: gData.name, targetAmount: toBase(gData.targetAmount, currency), currentAmount: toBase(gData.currentAmount, currency) }]);
          }
          setShowModal(null);
          setActiveGoalId(null);
        }} onClose={() => { setShowModal(null); setActiveGoalId(null); }} />
      )}
      {(showModal === 'earn' || showModal === 'spend' || showModal === 'edit_tx') && (
        <TransactionForm type={showModal === 'edit_tx' ? (transactions.find(it => it.id === activeTxId)?.type || 'earn') : (showModal as 'earn' | 'spend')} currency={currency} lang={lang} goals={goals} onSubmit={handleAddTransaction} onClose={() => { setShowModal(null); setActiveTxId(null); }} />
      )}
    </div>
  );
};

export default Dashboard;
