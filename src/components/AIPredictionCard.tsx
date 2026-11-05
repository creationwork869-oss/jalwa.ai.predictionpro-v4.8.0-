import React from 'react';
import { Sparkles, RefreshCw, TrendingUp, Cpu, Info, CheckCircle2 } from 'lucide-react';
import { PredictionData, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface AIPredictionCardProps {
  prediction: PredictionData;
  isLocked: boolean;
  isAnalyzing: boolean;
  onRefresh: () => void;
  language: Language;
}

export const AIPredictionCard: React.FC<AIPredictionCardProps> = ({
  prediction,
  isLocked,
  isAnalyzing,
  onRefresh,
  language,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const isBig = prediction.predictedSize === 'big';
  const isGreen = prediction.predictedColor === 'green';

  return (
    <div className="relative rounded-2xl gaming-card-active p-4 sm:p-6 overflow-hidden">
      {/* Visual background ambient glow ribbons */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-amber-500/15 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header bar of prediction */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-500/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg text-white">
                {t('nextPredictionTitle')}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold uppercase">
                {prediction.source === 'gemini-ai' ? 'Gemini 3.8 Flash' : 'Markov Matrix Pro'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'en' ? 'Target Period: ' : 'लक्ष्य पीरियड: '}
              <span className="font-mono text-amber-300 font-semibold">#{prediction.periodTarget}</span>
            </p>
          </div>
        </div>

        {/* Refresh AI button */}
        <button
          onClick={onRefresh}
          disabled={isAnalyzing || isLocked}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-amber-500/30 hover:border-amber-500 text-amber-400 hover:text-amber-300 text-xs font-semibold disabled:opacity-50 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? t('calculating') : t('refreshAi')}</span>
        </button>
      </div>

      {/* Main Grid: 3 Pillars (Top 3 Candidates, Big/Small, Red/Green) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-5 items-stretch">
        {/* Pillar 1: Prime & Top 3 Predicted Numbers (5 cols) */}
        <div className="md:col-span-5 bg-[#0D121C]/90 rounded-xl p-4 border border-amber-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-medium text-slate-300">{t('top3Candidates')}</span>
              <span className="text-amber-400 text-[11px] font-mono font-bold">
                {prediction.confidence}% {language === 'en' ? 'Probable' : 'संभावित'}
              </span>
            </div>

            {/* Prime Glowing Emblem */}
            <div className="flex items-center justify-center gap-4 py-3">
              <div className="text-center">
                <div className="text-[11px] text-amber-400/90 font-mono font-medium mb-1 uppercase tracking-wider">
                  {t('primaryEstimate')}
                </div>
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 text-slate-950 font-gaming font-black text-5xl shadow-xl shadow-amber-500/30 border-2 border-amber-200">
                  {prediction.predictedNumber}
                  {/* glowing ring indicator */}
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-300" />
                  </span>
                </div>
              </div>

              {/* Secondary candidates */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                  {language === 'en' ? 'Alt Candidates' : 'वैकल्पिक नंबर'}
                </span>
                <div className="flex items-center gap-2">
                  {prediction.top3Numbers.filter(n => n !== prediction.predictedNumber).map(num => (
                    <div
                      key={num}
                      className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center text-amber-300 font-gaming font-bold text-xl shadow-inner"
                    >
                      <span>{num}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>{language === 'en' ? 'Pattern:' : 'पैटर्न:'}</span>
            <span className="text-amber-300 font-semibold truncate max-w-[190px]">
              {language === 'hi' ? prediction.patternDetectedHi : prediction.patternDetectedEn}
            </span>
          </div>
        </div>

        {/* Pillar 2: Big vs Small Dual Gauge (4 cols) */}
        <div className="md:col-span-4 bg-[#0D121C]/90 rounded-xl p-4 border border-amber-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-300 font-medium">{t('sizeAnalysis')}</span>
              <span className="font-mono text-xs font-bold text-amber-400">
                {prediction.sizeConfidence}%
              </span>
            </div>

            {/* Selected Size Badge */}
            <div className="py-2 flex items-center justify-center">
              <div
                className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-between border ${
                  isBig
                    ? 'bg-amber-500/15 border-amber-400/60 text-amber-300 shadow-md shadow-amber-500/20'
                    : 'bg-cyan-500/15 border-cyan-400/60 text-cyan-300 shadow-md shadow-cyan-500/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-black font-gaming text-2xl tracking-wide uppercase">
                    {isBig ? t('big') : t('small')}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-950/60 px-2 py-0.5 rounded">
                  {prediction.sizeConfidence}% {language === 'en' ? 'Weight' : 'वेटेज'}
                </span>
              </div>
            </div>

            {/* Split Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>{language === 'en' ? 'Small (0-4)' : 'छोटा (0-4)'}</span>
                <span>{language === 'en' ? 'Big (5-9)' : 'बड़ा (5-9)'}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${100 - prediction.sizeConfidence}%` }}
                  className="bg-cyan-400/80 transition-all duration-500"
                />
                <div
                  style={{ width: `${prediction.sizeConfidence}%` }}
                  className="bg-amber-400 transition-all duration-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">
              {language === 'en'
                ? `Algorithm indicates high probability for ${isBig ? 'BIG' : 'SMALL'}`
                : `एल्गोरिदम ${isBig ? 'बड़ा (BIG)' : 'छोटा (SMALL)'} का संकेत दे रहा है`}
            </span>
          </div>
        </div>

        {/* Pillar 3: Red vs Green Dual Gauge (3 cols) */}
        <div className="md:col-span-3 bg-[#0D121C]/90 rounded-xl p-4 border border-amber-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-300 font-medium">{t('colorAnalysis')}</span>
              <span className="font-mono text-xs font-bold text-amber-400">
                {prediction.colorConfidence}%
              </span>
            </div>

            {/* Color Badge */}
            <div className="py-2 flex items-center justify-center">
              <div
                className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-between border ${
                  isGreen
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20'
                    : 'bg-red-500/20 border-red-400 text-red-300 shadow-md shadow-red-500/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3.5 h-3.5 rounded-full ${
                      isGreen ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-red-400 shadow-sm shadow-red-400'
                    }`}
                  />
                  <span className="font-black font-gaming text-2xl tracking-wide uppercase">
                    {isGreen ? t('green') : t('red')}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-950/60 px-2 py-0.5 rounded">
                  {prediction.colorConfidence}%
                </span>
              </div>
            </div>

            {/* Color Split Progress */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span className="text-red-400">{t('red')}</span>
                <span className="text-emerald-400">{t('green')}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${isGreen ? 100 - prediction.colorConfidence : prediction.colorConfidence}%` }}
                  className="bg-red-500"
                />
                <div
                  style={{ width: `${isGreen ? prediction.colorConfidence : 100 - prediction.colorConfidence}%` }}
                  className="bg-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">
              {isGreen ? 'Green (1,3,7,9)' : 'Red (2,4,6,8)'}
            </span>
          </div>
        </div>
      </div>

      {/* AI Intelligence Reasoning Box */}
      <div className="bg-slate-900/80 rounded-xl p-3 sm:p-4 border border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2 font-semibold text-amber-400 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('aiInsights')}</span>
        </div>
        <p className="text-slate-300 leading-relaxed font-sans">
          {language === 'hi' ? prediction.aiExplanationHi : prediction.aiExplanationEn}
        </p>
      </div>

      {/* Lock alert notice if period locked */}
      {isLocked && (
        <div className="mt-3 py-2 px-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center justify-center gap-2 animate-pulse">
          <span className="font-semibold uppercase tracking-wider">{t('lockedPredictions')}</span>
        </div>
      )}
    </div>
  );
};
