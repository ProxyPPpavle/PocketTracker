
import React, { useState } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { Language } from './i18n';

const App: React.FC = () => {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [lang, setLang] = useState<Language>('en');

  const handleLogin = (username: string) => {
    setUser({ username });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen">
      {!user ? (
        <Auth onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} lang={lang} setLang={setLang} />
      )}
    </div>
  );
};

export default App;
