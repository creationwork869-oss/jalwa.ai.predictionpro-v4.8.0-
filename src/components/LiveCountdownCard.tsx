import React, { useState } from 'react';
import { Clock, Copy, Check, FastForward, Lock, Zap } from 'lucide-react';
import { GameResult, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface LiveCountdownCardProps {
  currentPeriod: string;
  countdown: number;
  totalDuration: number;
  isLocked: boolean;
  latestResult?: GameResult;
  onFastForward: () => void;
  language: Language;
}

export const LiveCountdownCard: React.FC<LiveCountdownCardProps> = ({
  currentPeriod,
  countdown,
  totalDuration,
  isLocked,
  latestResult,
  onFastForward,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPeriod);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SVG Circular progress math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, countdown / (totalDuration || 30)));
  const strokeDashoffset = circumference - progress * circumference;

  const seconds = String(countdown % 60).padStart(2, '0');
  const minutes = String(Math.floor(countdown / 60)).padStart(2, '0');

  return (
    <div className="relative overflow-hidden rounded-2xl gaming-card p-4 sm:p-5 border border-amber-500/25">
      {/* Background ambient glow */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Period Info & Last Result */}
        <div className="flex-1 w-full text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
              {t('livePeriod')}
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-[11px] text-amber-400/90 hover:text-amber-300 font-mono transition-colors"
              title="Copy Period ID"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-white flex items-center justify-center sm:justify-start gap-2">
            <span className="text-amber-400">#</span>
            <span>{currentPeriod}</span>
          </div>

          {/* Previous Round Snapshot */}
          {latestResult && (
            <div className="mt-3 flex items-center justify-center sm:justify-start gap-2 text-xs">
              <span className="text-slate-400">{language === 'en' ? 'Last Result:' : 'पिछला परिणाम:'}</span>
              <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700">
                <span className="font-mono text-slate-400 text-[11px]">#{latestResult.period.slice(-4)}</span>
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold font-mono text-xs text-white shadow-sm ${
                    latestResult.color === 'green'
                      ? 'bg-emerald-600 border border-emerald-400'
                      : latestResult.color === 'red'
                      ? 'bg-red-600 border border-red-400'
                      : latestResult.color === 'red_violet'
                      ? 'bg-gradient-to-r from-red-600 to-purple-600 border border-purple-400'
                      : 'bg-gradient-to-r from-emerald-600 to-purple-600 border border-purple-400'
                  }`}
                >
                  {latestResult.number}
                </span>
                <span className={`font-semibold capitalize text-[11px] ${latestResult.size === 'big' ? 'text-amber-400' : 'text-cyan-400'}`}>
                  {latestResult.size === 'big' ? t('big').split(' ')[0] : t('small').split(' ')[0]}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Center/Right: Radial Countdown Timer */}
        <div className="flex items-center gap-5 shrink-0">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle track */}
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="6"
                fill="transparent"
              />
              {/* Animated Progress ring */}
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke={isLocked ? '#EF4444' : '#F59E0B'}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            {/* Inner Timer text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`font-gaming text-2xl sm:text-3xl font-bold tracking-wider tabular-nums ${isLocked ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                {minutes}:{seconds}
              </span>
              <span className="text-[10px] uppercase font-mono tracking-tight text-slate-400">
                {isLocked ? (
                  <span className="flex items-center gap-1 text-red-400 font-semibold">
                    <Lock className="w-2.5 h-2.5" /> LOCKED
                  </span>
                ) : (
                  <span className="text-amber-400/90 flex items-center gap-0.5">
                    <Zap className="w-2.5 h-2.5" /> SECS
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Quick round test trigger */}
          <div className="flex flex-col gap-1.5">
            <button
              onClick={onFastForward}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 text-xs font-semibold transition-all shadow-sm"
              title="Fast Forward 1 Round for demo testing"
            >
              <FastForward className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'en' ? 'Next' : 'अगला'}</span>
            </button>
            <div className="text-[10px] text-center font-mono text-slate-500">
              {totalDuration}s / {language === 'en' ? 'rnd' : 'राउंड'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
