
import React, { useState, useEffect } from 'react';
import { CurrencyType, Goal } from '../types';
import { translations, Language } from '../i18n';
import { fromBase } from '../utils/currency';

interface GoalFormProps {
  currency: CurrencyType;
  lang: Language;
  editingGoal?: Goal;
  onSubmit: (goal: Omit<Goal, 'id'> & { id?: string }) => void;
  onClose: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ currency, lang, editingGoal, onSubmit, onClose }) => {
  const t = translations[lang];
  const [name, setName] = useState(editingGoal?.name || '');
  const [target, setTarget] = useState(editingGoal ? fromBase(editingGoal.targetAmount, currency).toString() : '');
  const [current, setCurrent] = useState(editingGoal ? fromBase(editingGoal.currentAmount, currency).toString() : '0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !target) return;
    onSubmit({
      id: editingGoal?.id,
      name,
      targetAmount: Number(target),
      currentAmount: Number(current)
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
      <div className="glass-card w-full max-w-sm p-8 rounded-[3rem] border border-white/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-48 h-48 bg-blue-600/20 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-8 text-white uppercase tracking-tighter">
            {editingGoal ? t.edit : t.addGoal}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{t.description}</label>
              <input
                autoFocus
                maxLength={15}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500 text-base font-bold shadow-inner"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Buy a Porsche..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{t.target}</label>
                <input
                  type="number"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500 text-lg font-black"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{t.current}</label>
                <input
                  type="number"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500 text-lg font-black"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-10">
              <button type="button" onClick={onClose} className="flex-1 py-4 text-slate-400 font-black text-[11px] uppercase tracking-[0.2em] hover:text-white transition-colors">Cancel</button>
              <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] hover:scale-105 shadow-2xl shadow-blue-500/20 active:scale-95 transition-all">{t.confirm}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GoalForm;
