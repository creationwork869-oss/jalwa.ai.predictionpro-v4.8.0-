import React from 'react';
import { ShieldCheck, Download, Smartphone, Monitor, Globe, User, Settings } from 'lucide-react';
import { Language, UserAuth } from '../types';
import { getTranslation } from '../utils/translations';

interface TopHeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  deviceMode: 'mobile' | 'desktop';
  onToggleDeviceMode: () => void;
  user: UserAuth;
  onOpenLogin: () => void;
  onOpenAdmin: () => void;
  onOpenApkModal: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  language,
  onLanguageChange,
  activeTab,
  onTabChange,
  deviceMode,
  onToggleDeviceMode,
  user,
  onOpenLogin,
  onOpenAdmin,
  onOpenApkModal,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  return (
    <header className="sticky top-0 z-40 bg-[#0B0E14]/95 backdrop-blur-md border-b border-amber-500/20 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Zone 1: Brand Wordmark with Gold Insignia */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-amber-400/40 shadow-sm shadow-amber-500/30 shrink-0">
            <img
              src="/pwa-192x192.png"
              alt="Jalwa AI Pro"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // styled CSS fallback if image not loaded yet
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-base sm:text-lg tracking-wider text-gold-gradient whitespace-nowrap">
                {t('appTitle')}
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 whitespace-nowrap">
                APK PRO
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {[
            { id: 'prediction', label: t('nextPredictionTitle') },
            { id: 'results', label: t('recent100Results') },
            { id: 'heatmap', label: t('numberStats') },
            { id: 'accuracy', label: t('accuracyTracker') },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-700/80 text-amber-300 hover:border-amber-500/40 transition-colors whitespace-nowrap shrink-0"
            title="Toggle Hindi / English"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium">{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Device Frame Viewport Toggle */}
          <button
            onClick={onToggleDeviceMode}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700/80 text-slate-300 hover:border-slate-600 transition-colors whitespace-nowrap shrink-0"
            title={deviceMode === 'mobile' ? 'Switch to Full Desktop View' : 'Simulate Android Mobile App'}
          >
            {deviceMode === 'mobile' ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px]">{t('desktopView')}</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px]">{t('mobileView')}</span>
              </>
            )}
          </button>

          {/* Admin Control Trigger */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 transition-colors shrink-0"
            title="Admin Dashboard"
            aria-label="Admin settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* APK Install / Download Button */}
          <button
            onClick={onOpenApkModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/25 transition-all whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">APK</span>
            <span>{language === 'en' ? 'Install' : 'इंस्टॉल'}</span>
          </button>

          {/* Login / Profile */}
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-medium hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span className="max-w-[70px] truncate">
              {user.role === 'admin' ? t('adminName') : (user.isDemo ? 'Demo' : user.username)}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
