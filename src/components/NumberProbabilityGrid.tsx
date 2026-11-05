import React from 'react';
import { Flame, Snowflake, BarChart3 } from 'lucide-react';
import { NumberProbability, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface NumberProbabilityGridProps {
  probabilities: NumberProbability[];
  highlightNumber?: number;
  language: Language;
}

export const NumberProbabilityGrid: React.FC<NumberProbabilityGridProps> = ({
  probabilities,
  highlightNumber,
  language,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const getBallStyle = (num: number) => {
    if (num === 0) return 'from-red-600 via-purple-600 to-purple-800 text-white border-purple-400';
    if (num === 5) return 'from-emerald-600 via-purple-600 to-purple-800 text-white border-purple-400';
    if ([1, 3, 7, 9].includes(num)) return 'from-emerald-600 to-emerald-800 text-white border-emerald-400';
    return 'from-red-600 to-red-800 text-white border-red-400';
  };

  return (
    <div className="rounded-2xl gaming-card p-4 sm:p-5 border border-amber-500/20">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-amber-400" />
          <h3 className="font-display font-bold text-sm sm:text-base text-white">
            {t('numberStats')}
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1 text-amber-400">
            <Flame className="w-3 h-3 text-amber-500" /> {t('hotNumbers').split(' ')[0]}
          </span>
          <span className="flex items-center gap-1 text-cyan-400">
            <Snowflake className="w-3 h-3 text-cyan-400" /> {t('coldNumbers').split(' ')[0]}
          </span>
        </div>
      </div>

      {/* Grid of 0-9 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2.5">
        {probabilities.map(item => {
          const isPrime = highlightNumber === item.number;
          return (
            <div
              key={item.number}
              className={`relative rounded-xl p-3 flex flex-col items-center justify-between border transition-all ${
                isPrime
                  ? 'bg-amber-500/15 border-amber-400/80 shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Hot/Cold micro indicator */}
              <div className="absolute top-1.5 right-1.5">
                {item.isHot && <Flame className="w-3 h-3 text-amber-400" />}
                {item.isCold && <Snowflake className="w-3 h-3 text-cyan-400" />}
              </div>

              {/* Number Ball */}
              <div
                className={`w-11 h-11 rounded-full bg-gradient-to-br flex items-center justify-center font-gaming font-bold text-2xl shadow-md border ${getBallStyle(
                  item.number
                )}`}
              >
                {item.number}
              </div>

              {/* Probability Percentage */}
              <div className="mt-2 text-center w-full">
                <div className="font-mono font-bold text-xs text-amber-300">
                  {item.prob}%
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {item.frequency}x
                </div>

                {/* Micro Probability Bar */}
                <div className="mt-1 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, item.prob * 4)}%` }}
                    className={`h-full rounded-full ${isPrime ? 'bg-amber-400' : 'bg-slate-500'}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
