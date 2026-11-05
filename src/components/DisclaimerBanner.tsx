import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface DisclaimerBannerProps {
  language: Language;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ language }) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  return (
    <div className="bg-amber-950/20 border-y border-amber-500/20 px-3 sm:px-6 py-2 text-xs text-amber-300/90">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="leading-tight">
            <strong>{language === 'en' ? 'Verified Statistical Engine: ' : 'सत्यापित सांख्यिकीय मॉडल: '}</strong>
            {t('disclaimerBar')}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 shrink-0 text-[11px] font-mono text-emerald-400/90 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{t('statusOnline')}</span>
        </div>
      </div>
    </div>
  );
};
