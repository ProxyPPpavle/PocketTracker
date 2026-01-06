
import React, { useState } from 'react';
import { CurrencyType } from '../types';
import { translations, Language } from '../i18n';

interface RecurringFormProps {
  currency: CurrencyType;
  lang: Language;
  onSubmit: (data: { name: string; amount: number; frequency: 'daily' | 'monthly' }) => void;
  onClose: () => void;
}

const RecurringForm: React.FC<RecurringFormProps> = ({ currency, lang, onSubmit, onClose }) => {
  const t = translations[lang];
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'monthly'>('monthly');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;
    onSubmit({ name, amount: Number(amount), frequency });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="glass-card w-full max-w-[380px] p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-white/20 shadow-2xl relative overflow-hidden modal-container">
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tighter">{t.addRecurring}</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-white p-1">
               <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-[9px] sm:text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{t.description}</label>
              <input
                autoFocus
                maxLength={15}
                className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-4 py-3 sm:py-5 text-white outline-none focus:ring-1 focus:ring-blue-500 text-sm sm:text-base font-bold"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rent, Netflix..."
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <div>
                <label className="block text-[9px] sm:text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{t.amount} ({currency})</label>
                <input
                  type="number"
                  className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-4 py-3 sm:py-5 text-white outline-none focus:ring-1 focus:ring-blue-500 text-sm sm:text-base font-bold"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] sm:text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{t.freq}</label>
                <select
                  className="w-full bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl px-4 py-3 sm:py-5 text-white outline-none focus:ring-1 focus:ring-blue-500 text-[10px] sm:text-base font-black appearance-none"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as 'daily' | 'monthly')}
                >
                  <option value="monthly" className="bg-slate-900">{t.monthly}</option>
                  <option value="daily" className="bg-slate-900">{t.daily}</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4 mt-8 sm:mt-10">
              <button type="button" onClick={onClose} className="flex-1 py-3.5 sm:py-5 text-slate-400 font-black text-[10px] sm:text-xs uppercase tracking-widest">Cancel</button>
              <button type="submit" className="flex-1 py-3.5 sm:py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl sm:rounded-[1.5rem] font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] shadow-xl">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecurringForm;
