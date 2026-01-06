
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (username: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#030612] p-4">
      {/* Background Decorative Mesh - Ensuring circular shapes only */}
      <div className="mesh-glow w-[350px] h-[350px] sm:w-[700px] sm:h-[700px] bg-blue-600/40 -top-20 -left-20 animate-glow"></div>
      <div className="mesh-glow w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-purple-600/30 top-1/2 -right-20 animate-glow" style={{ animationDelay: '1s' }}></div>
      <div className="mesh-glow w-[250px] h-[250px] sm:w-[500px] sm:h-[500px] bg-emerald-600/20 bottom-0 left-1/4 animate-glow" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-[440px] glass-card p-10 sm:p-14 rounded-[2.5rem] sm:rounded-[4rem] border border-white/20 relative z-10 shadow-[0_40px_150px_rgba(0,0,0,0.9)] backdrop-blur-3xl mx-auto my-auto self-center">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/30 to-transparent blur-3xl pointer-events-none"></div>
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-3xl mx-auto flex items-center justify-center font-black text-2xl sm:text-3xl shadow-[0_15px_50px_rgba(59,130,246,0.5)] text-white mb-6">P</div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
            PocketTracker
          </h1>
          <p className="text-slate-400 mt-2 text-xs sm:text-sm font-semibold tracking-wide uppercase opacity-70">Financial clarity, evolved.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 sm:py-5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white font-bold text-sm sm:text-base shadow-inner"
                placeholder="hello@wallet.com"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 sm:py-5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white font-bold text-sm sm:text-base shadow-inner"
              placeholder="pocket_hero"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 sm:py-5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white font-bold text-sm sm:text-base shadow-inner"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-95 text-white font-black py-4 sm:py-6 rounded-2xl shadow-[0_20px_50px_rgba(59,130,246,0.4)] transition-all text-[11px] sm:text-xs uppercase tracking-[0.3em] mt-6 border-b-4 border-black/20"
          >
            {isLogin ? 'Enter Dashboard' : 'Join PocketTracker'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-400 hover:text-white text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-colors"
          >
            {isLogin ? "No account? Create one now" : "Already registered? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
