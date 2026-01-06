
import React, { useState } from 'react';
import { translations, Language } from '../i18n';
import Visualizations from './Visualizations';

interface FriendTabProps {
  lang: Language;
}

const FriendTab: React.FC<FriendTabProps> = ({ lang }) => {
  const t = translations[lang];
  const [search, setSearch] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  
  const friends = [
    { username: 'LukaM', dailyChange: 1200, balance: 14500, transactions: [] },
    { username: 'Sofia_Dev', dailyChange: -450, balance: 3200, transactions: [] },
    { username: 'CryptoBoss', dailyChange: 8900, balance: 128000, transactions: [] },
    { username: 'Nemanja', dailyChange: -120, balance: 50, transactions: [] },
  ];

  return (
    <div className="glass-card p-3 sm:p-6 rounded-xl sm:rounded-3xl border border-white/10 h-full flex flex-col relative bg-white/[0.01]">
      <h3 className="text-[7px] sm:text-[9px] font-black mb-3 flex items-center gap-1.5 uppercase tracking-widest text-slate-500">
        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full"></span>
        {t.friends}
      </h3>
      
      <form onSubmit={(e) => e.preventDefault()} className="mb-3 flex gap-1.5">
        <input 
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[8px] sm:text-[10px] text-white outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600"
          placeholder={t.searchFriends}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1 pr-1">
        {friends.map(f => (
          <div key={f.username} className="p-2 sm:p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between group">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center text-[8px] sm:text-[10px] font-black shadow">
                {f.username[0].toUpperCase()}
              </div>
              <div className="leading-tight">
                <p className="text-[8px] sm:text-[10px] font-black text-slate-200">{f.username}</p>
                <p className={`text-[6px] sm:text-[8px] font-black ${f.dailyChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {f.dailyChange >= 0 ? '↑' : '↓'} {Math.abs(f.dailyChange)}$
                </p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedFriend(f)}
              className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-[7px] sm:text-[9px] font-black uppercase transition-all"
            >
              {t.show}
            </button>
          </div>
        ))}
      </div>

      {selectedFriend && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
          <div className="glass-card w-full max-w-lg rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-white/20 shadow-2xl relative overflow-hidden scale-90 sm:scale-100">
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[80px] -mr-16 -mt-16"></div>
            <div className="flex justify-between items-start mb-6 sm:mb-8 relative z-10">
              <div className="flex items-center gap-3 sm:gap-4">
                 <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center text-base sm:text-xl font-black shadow-lg">
                   {selectedFriend.username[0]}
                 </div>
                 <div>
                   <h4 className="text-base sm:text-xl font-black">{selectedFriend.username}</h4>
                   <p className="text-slate-500 text-[8px] sm:text-[9px] font-black uppercase tracking-widest mt-0.5">Profile Stats</p>
                 </div>
              </div>
              <button onClick={() => setSelectedFriend(null)} className="text-slate-500 hover:text-white p-1">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
               <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
                 <p className="text-[7px] sm:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.balance}</p>
                 <p className="text-sm sm:text-lg font-black text-white">{selectedFriend.balance}$</p>
               </div>
               <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
                 <p className="text-[7px] sm:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">24h Flow</p>
                 <p className={`text-sm sm:text-lg font-black ${selectedFriend.dailyChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                   {selectedFriend.dailyChange > 0 ? '+' : ''}{selectedFriend.dailyChange}$
                 </p>
               </div>
            </div>

            <div className="h-[150px] sm:h-[200px] w-full bg-black/40 rounded-xl p-3 border border-white/5">
              <Visualizations transactions={[]} currency="USD" type="weekly" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendTab;
