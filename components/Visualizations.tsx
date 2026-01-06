
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, 
  BarChart, Bar, Cell
} from 'recharts';
import { Transaction, CurrencyType } from '../types';
import { fromBase } from '../utils/currency';

interface VisualizationsProps {
  transactions: Transaction[];
  currency: CurrencyType;
  type: 'weekly' | 'daily';
}

const CustomTooltip = ({ active, payload, label, currency }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card border border-white/20 p-3 rounded-2xl shadow-2xl text-[10px]">
        <p className="text-slate-400 font-black uppercase tracking-widest mb-2 border-b border-white/5 pb-1">{label}</p>
        <div className="flex items-center gap-2 mb-2">
           <span className={`w-2 h-2 rounded-full ${payload[0].value >= 0 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`}></span>
           <p className="text-white font-black text-xs">
            {payload[0].value.toFixed(2)} {currency}
          </p>
        </div>
        {payload[0].payload.details && payload[0].payload.details.length > 0 && (
          <div className="pt-2 space-y-1">
            {payload[0].payload.details.slice(0, 3).map((d: any, i: number) => (
              <p key={i} className="text-[9px] text-slate-400 flex justify-between gap-4">
                <span className="truncate max-w-[80px] font-bold">{d.description || 'Entry'}</span>
                <span className={d.amount >= 0 ? 'text-emerald-500/80' : 'text-rose-500/80'}>
                  {d.amount >= 0 ? '+' : ''}{d.amount.toFixed(0)}
                </span>
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }
  return null;
};

const Visualizations: React.FC<VisualizationsProps> = ({ transactions, currency, type }) => {
  const getData = () => {
    if (type === 'weekly') {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayTransactions = transactions.filter(t => t.date.startsWith(dateStr));
        const net = dayTransactions.reduce((acc, curr) => {
          const val = fromBase(curr.amount, currency);
          return curr.type === 'earn' ? acc + val : acc - val;
        }, 0);
        days.push({
          name: d.toLocaleDateString('en-US', { weekday: 'short' }),
          value: net,
          details: dayTransactions.map(t => ({ 
            description: t.description, 
            amount: fromBase(t.type === 'earn' ? t.amount : -t.amount, currency) 
          }))
        });
      }
      return days;
    } else {
      const hours = [];
      const today = new Date().toISOString().split('T')[0];
      for (let i = 0; i < 24; i++) {
        const hourTransactions = transactions.filter(t => {
          const tDate = new Date(t.date);
          return t.date.startsWith(today) && tDate.getHours() === i;
        });
        const net = hourTransactions.reduce((acc, curr) => {
          const val = fromBase(curr.amount, currency);
          return curr.type === 'earn' ? acc + val : acc - val;
        }, 0);
        hours.push({
          name: `${i}:00`,
          value: net,
          details: hourTransactions.map(t => ({ 
            description: t.description, 
            amount: fromBase(t.type === 'earn' ? t.amount : -t.amount, currency) 
          }))
        });
      }
      return hours;
    }
  };

  const chartData = getData();

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'weekly' ? (
          <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 35 }}>
            <defs>
              <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} 
              dy={5}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} 
            />
            <Tooltip content={<CustomTooltip currency={currency} />} cursor={{stroke: '#3b82f6', strokeWidth: 1.5, strokeDasharray: '4 4'}} />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
            <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#areaGlow)" />
          </AreaChart>
        ) : (
          <BarChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 30 }}>
            <defs>
              <linearGradient id="barEarn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="barSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b', fontSize: 8, fontWeight: 700}} 
              interval={3} 
              dy={5}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} 
            />
            <Tooltip content={<CustomTooltip currency={currency} />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value >= 0 ? 'url(#barEarn)' : 'url(#barSpend)'} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default Visualizations;
