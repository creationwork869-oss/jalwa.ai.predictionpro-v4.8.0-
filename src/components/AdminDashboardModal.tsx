import React, { useState } from 'react';
import { X, Settings, RotateCcw, FastForward, PlayCircle, ShieldAlert } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  roundDuration: number;
  onSetRoundDuration: (duration: number) => void;
  onFastForward: () => void;
  onInjectNextNumber: (num: number) => void;
  onResetHistory: () => void;
  language: Language;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  roundDuration,
  onSetRoundDuration,
  onFastForward,
  onInjectNextNumber,
  onResetHistory,
  language,
}) => {
  const [selectedInject, setSelectedInject] = useState<number | null>(null);
  const [injectedSuccess, setInjectedSuccess] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  if (!isOpen) return null;

  const handleInject = () => {
    if (selectedInject !== null) {
      onInjectNextNumber(selectedInject);
      setInjectedSuccess(true);
      setTimeout(() => setInjectedSuccess(false), 2500);
    }
  };

  const handleReset = () => {
    onResetHistory();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl gaming-card border border-amber-500/40 p-5 sm:p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-lg text-white">
              {t('admin')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 my-4 text-xs">
          {/* Round Duration Control */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">
              {t('roundDuration')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 30, 60].map(sec => (
                <button
                  key={sec}
                  onClick={() => onSetRoundDuration(sec)}
                  className={`py-2 px-3 rounded-xl font-mono font-bold text-center border transition-all ${
                    roundDuration === sec
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {sec}s {sec === 10 ? '(Rapid Demo)' : sec === 30 ? '(Standard)' : '(Full)'}
                </button>
              ))}
            </div>
          </div>

          {/* Inject Test Result for Next Round */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              {t('injectResult')}
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              {language === 'en'
                ? 'Specify exact number that will be revealed in the next countdown round:'
                : 'निर्दिष्ट करें कि अगले राउंड में कौन सा नंबर प्रकट होगा:'}
            </p>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 mb-3">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  onClick={() => setSelectedInject(num)}
                  className={`h-9 rounded-lg font-gaming font-bold text-base transition-all ${
                    selectedInject === num
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 shadow-md scale-105'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleInject}
                disabled={selectedInject === null}
                className="flex-1 py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold transition-all text-center"
              >
                {t('injectBtn')} ({selectedInject ?? '-'})
              </button>
              <button
                onClick={onFastForward}
                className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-amber-300 font-semibold"
                title="Trigger immediate round resolution"
              >
                <FastForward className="w-4 h-4" />
                <span>Next Round</span>
              </button>
            </div>
            {injectedSuccess && (
              <p className="text-emerald-400 text-[11px] mt-2 font-semibold">
                ✓ Next outcome primed for round execution.
              </p>
            )}
          </div>

          {/* Reset Historical Database */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-300 font-semibold block">{t('resetHistory')}</span>
                <span className="text-[11px] text-slate-500">
                  {language === 'en' ? 'Re-seed 100 historical rounds with fresh statistics' : '100 नए रैंडमाइज्ड राउंड्स जनरेट करें'}
                </span>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 hover:bg-red-900/50 font-semibold text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
            {resetDone && (
              <p className="text-emerald-400 text-[11px] mt-2 font-semibold">
                ✓ {t('resetSuccess')}
              </p>
            )}
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              {language === 'en'
                ? 'Admin credentials verified. All modifications logged in local telemetry.'
                : 'एडमिन अनुमति सत्यापित। सभी परिवर्तन स्थानीय रूप से सुरक्षित हैं।'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
