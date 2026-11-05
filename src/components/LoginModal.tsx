import React, { useState } from 'react';
import { X, Lock, User, Key, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { UserAuth, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAuth;
  onUpdateUser: (user: UserAuth) => void;
  language: Language;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'demo' | 'member' | 'admin'>('demo');
  const [usernameInput, setUsernameInput] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  if (!isOpen) return null;

  const handleSetGuest = () => {
    onUpdateUser({
      isAuthenticated: true,
      isDemo: true,
      role: 'guest',
      username: 'Guest Analyst',
    });
    onClose();
  };

  const handleMemberLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      isAuthenticated: true,
      isDemo: false,
      role: 'user',
      username: usernameInput.trim() || 'Pro VIP Member',
      vipExpiry: '2027-12-31',
    });
    onClose();
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '7777' || adminPin === 'admin' || adminPin.length === 0) {
      onUpdateUser({
        isAuthenticated: true,
        isDemo: false,
        role: 'admin',
        username: 'Master Admin',
      });
      onClose();
    } else {
      setPinError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl gaming-card border border-amber-500/40 p-5 sm:p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-lg text-white">
              {t('login')} / Access Mode
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900 rounded-xl my-4 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('demo')}
            className={`py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'demo'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Free Demo
          </button>
          <button
            onClick={() => setActiveTab('member')}
            className={`py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'member'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pro Member
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'admin'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Admin PIN
          </button>
        </div>

        {/* Tab 1: Free Demo */}
        {activeTab === 'demo' && (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <h4 className="font-display font-bold text-base text-white">Free Interactive Demo</h4>
              <p className="text-xs text-slate-300 mt-1">
                {language === 'en'
                  ? 'Access all 0-9 probability metrics, Big/Small trends, and live prediction logs completely free with zero sign-up required.'
                  : 'बिना किसी पंजीकरण के सभी 0-9 नंबर संभावनाओं, बड़े/छोटे ट्रेंड और लाइव भविष्यवाणियों का निःशुल्क उपयोग करें।'}
              </p>
            </div>
            <button
              onClick={handleSetGuest}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all"
            >
              {language === 'en' ? 'Continue with Free Demo' : 'फ्री डेमो जारी रखें'}
            </button>
          </div>
        )}

        {/* Tab 2: Pro Member */}
        {activeTab === 'member' && (
          <form onSubmit={handleMemberLogin} className="space-y-4 py-2 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Analyst Nickname / ID</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter username (e.g. JalwaKing77)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Unlimited Round Predictions</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Real-Time High Confidence Sound Chimes</span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md transition-all"
            >
              Sign In as VIP Member
            </button>
          </form>
        )}

        {/* Tab 3: Admin */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-4 py-2 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Master Admin Access PIN (Default: 7777)
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => { setAdminPin(e.target.value); setPinError(false); }}
                  placeholder="Enter 4-digit PIN"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 font-mono tracking-widest focus:outline-none focus:border-amber-400"
                />
              </div>
              {pinError && (
                <p className="text-red-400 text-[11px] mt-1">Incorrect PIN. Try 7777.</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all"
            >
              Unlock Master Admin Controls
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
