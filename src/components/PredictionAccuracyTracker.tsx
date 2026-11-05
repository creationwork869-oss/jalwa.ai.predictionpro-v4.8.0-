import React from 'react';
import { Target, Award, Zap, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import { PredictionHistoryItem, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface PredictionAccuracyTrackerProps {
  predictionHistory: PredictionHistoryItem[];
  overallWinRate: number;
  currentStreak: number;
  language: Language;
}

export const PredictionAccuracyTracker: React.FC<PredictionAccuracyTrackerProps> = ({
  predictionHistory,
  overallWinRate,
  currentStreak,
  language,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  // Compute breakdown for last 10, 50, 100
  const computeRate = (count: number) => {
    const slice = predictionHistory.slice(0, count);
    if (!slice.length) return overallWinRate;
    const wins = slice.filter(s => s.status === 'win').length;
    const partials = slice.filter(s => s.status === 'partial').length;
    return Math.round(((wins + partials * 0.5) / slice.length) * 100);
  };

  const rate10 = computeRate(10);
  const rate50 = computeRate(50);
  const rate100 = computeRate(100);

  return (
    <div className="rounded-2xl gaming-card p-4 sm:p-5 border border-amber-500/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-white">
              {t('accuracyTracker')}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'en'
                ? 'Transparent round-by-round verification of AI predictions'
                : 'AI भविष्यवाणियों का पारदर्शी राउंड-दर-राउंड सत्यापन'}
            </p>
          </div>
        </div>

        {/* Global Hit Rate Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-xl">
            <Award className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-emerald-300/80 uppercase font-mono font-medium">
                {t('hitRate')}
              </div>
              <div className="font-gaming font-black text-xl text-emerald-300">
                {overallWinRate}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-950/60 border border-amber-500/40 px-3 py-1.5 rounded-xl">
            <Zap className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] text-amber-300/80 uppercase font-mono font-medium">
                {t('currentStreak')}
              </div>
              <div className="font-gaming font-black text-xl text-amber-300">
                {currentStreak} <span className="text-xs font-sans text-amber-400 font-normal">in a row</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Strip for 10 / 50 / 100 */}
      <div className="grid grid-cols-3 gap-3 my-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
          <div className="text-xs text-slate-400 font-mono mb-1">{t('last10')}</div>
          <div className="font-gaming font-bold text-2xl text-emerald-400">{rate10}%</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
          <div className="text-xs text-slate-400 font-mono mb-1">{t('last50')}</div>
          <div className="font-gaming font-bold text-2xl text-emerald-400">{rate50}%</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center">
          <div className="text-xs text-slate-400 font-mono mb-1">{t('last100')}</div>
          <div className="font-gaming font-bold text-2xl text-emerald-400">{rate100}%</div>
        </div>
      </div>

      {/* Prediction History Table */}
      <div className="overflow-x-auto mt-2">
        <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
          <span>{t('predictionLog')}</span>
          <span className="text-[11px] text-slate-500 font-mono">
            {predictionHistory.length} {language === 'en' ? 'verified rounds' : 'सत्यापित राउंड'}
          </span>
        </div>

        {predictionHistory.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            {language === 'en'
              ? 'New session initialized. Verification logs will appear after current round finishes.'
              : 'नया सत्र प्रारंभ हुआ। वर्तमान राउंड समाप्त होने के बाद सत्यापन लॉग यहाँ दिखाई देंगे।'}
          </div>
        ) : (
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                <th className="py-2 px-2.5">Period</th>
                <th className="py-2 px-2.5">AI Prediction</th>
                <th className="py-2 px-2.5">Actual Result</th>
                <th className="py-2 px-2.5">Hit Checks</th>
                <th className="py-2 px-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {predictionHistory.slice(0, 10).map(item => (
                <tr key={item.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-2.5 font-bold text-slate-300">
                    #{item.period}
                  </td>
                  <td className="py-2.5 px-2.5">
                    <span className="text-amber-300 font-bold">{item.predictedNumber}</span>
                    <span className="text-slate-400 text-[11px] ml-1">
                      ({item.predictedSize.toUpperCase()} · {item.predictedColor.toUpperCase()})
                    </span>
                  </td>
                  <td className="py-2.5 px-2.5">
                    {item.actualNumber !== undefined ? (
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded">
                          {item.actualNumber}
                        </span>
                        <span className="text-[11px] text-slate-400 capitalize">
                          {item.actualSize}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500">Pending</span>
                    )}
                  </td>
                  <td className="py-2.5 px-2.5">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      {item.hitNumber && (
                        <span className="bg-amber-500/20 text-amber-300 px-1 rounded font-bold">#Hit</span>
                      )}
                      {item.hitTop3 && !item.hitNumber && (
                        <span className="bg-emerald-500/20 text-emerald-300 px-1 rounded">Top3</span>
                      )}
                      {item.hitSize && (
                        <span className="bg-cyan-500/20 text-cyan-300 px-1 rounded">Size</span>
                      )}
                      {item.hitColor && (
                        <span className="bg-purple-500/20 text-purple-300 px-1 rounded">Color</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-2.5 text-right">
                    {item.status === 'win' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[11px]">
                        <CheckCircle2 className="w-3 h-3" /> {t('win')}
                      </span>
                    )}
                    {item.status === 'partial' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold text-[11px]">
                        {t('partial')}
                      </span>
                    )}
                    {item.status === 'loss' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[11px]">
                        <XCircle className="w-3 h-3" /> {t('loss')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
