
import React, { useState } from 'react';
import { CurrencyType, Goal } from '../types';
import { translations, Language } from '../i18n';

interface TransactionFormProps {
  type: 'earn' | 'spend';
  currency: CurrencyType;
  lang: Language;
  goals: Goal[];
  onSubmit: (data: {
    amount: number;
    description: string;
    goalId?: string;
  }) => void;
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ type, currency, lang, goals, onSubmit, onClose }) => {
  const t = translations[lang];
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [goalId, setGoalId] = useState<string>('');
  const MAX_DESC = 15;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    onSubmit({
      amount: Number(amount),
      description: description.slice(0, MAX_DESC),
      goalId: goalId || undefined,
    });
  };

  const isEarn = type === 'earn';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
      <div className="glass-card w-full max-w-[420px] p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[4rem] border border-white/20 shadow-[0_0_120px_rgba(0,0,0,0.9)] relative overflow-hidden self-center mx-auto">
        <div className={`absolute inset-0 bg-gradient-to-br ${isEarn ? 'from-emerald-600/30' : 'from-rose-600/30'} to-transparent opacity-60 pointer-events-none`}></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8 sm:mb-12">
            <h2 className={`text-2xl sm:text-4xl font-black uppercase tracking-tighter ${isEarn ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isEarn ? t.addEarn : t.addSpend}
            </h2>
            <button onClick={onClose} className="text-slate-500 hover:text-white p-2 transition-all hover:rotate-90">
              <svg className="w-7 h-7 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-10">
            <div>
              <label className="block text-[10px] sm:text-[12px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">{t.amount} ({currency})</label>
              <input
                autoFocus
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 sm:py-8 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white text-3xl sm:text-6xl font-black shadow-inner placeholder:text-white/10"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-[10px] sm:text-[12px] font-black text-slate-500 uppercase tracking-widest px-1">{t.description}</label>
                <span className={`text-[9px] sm:text-[11px] font-black ${description.length >= MAX_DESC ? 'text-rose-500' : 'text-slate-600'}`}>
                  {description.length}/{MAX_DESC}
                </span>
              </div>
              <input
                type="text"
                value={description}
                maxLength={MAX_DESC}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 sm:py-6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white text-base sm:text-xl font-bold shadow-inner placeholder:text-white/20"
                placeholder="YouTube, Shopping, Rent..."
                required
              />
            </div>

            {goals.length > 0 && (
              <div>
                <label className="block text-[10px] sm:text-[12px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Link to Goal</label>
                <select
                  value={goalId}
                  onChange={(e) => setGoalId(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 sm:py-6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white text-xs sm:text-lg font-black appearance-none"
                >
                  <option value="" className="bg-slate-900 text-white">General Wallet</option>
                  {goals.map((g) => (
                    <option key={g.id} value={g.id} className="bg-slate-900 text-white">{g.name}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-5 sm:py-8 rounded-2xl sm:rounded-[3rem] font-black text-xs sm:text-base uppercase tracking-[0.3em] shadow-2xl transform active:scale-95 transition-all mt-6 border-b-4 ${
                isEarn 
                ? 'bg-emerald-600 text-white shadow-emerald-500/30 border-emerald-900/40' 
                : 'bg-rose-600 text-white shadow-rose-500/30 border-rose-900/40'
              }`}
            >
              {t.confirm}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
