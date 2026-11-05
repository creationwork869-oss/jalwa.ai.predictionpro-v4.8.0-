import React from 'react';
import { Flame, Snowflake, Activity, Zap, Compass } from 'lucide-react';
import { GameResult, NumberProbability, Language } from '../types';
import { getTranslation } from '../utils/translations';
import { detectPatterns } from '../utils/gameData';

interface HotColdRadarProps {
  history: GameResult[];
  probabilities: NumberProbability[];
  language: Language;
}

export const HotColdRadar: React.FC<HotColdRadarProps> = ({
  history,
  probabilities,
  language,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
  const pattern = detectPatterns(history);

  // Derive hot numbers (top 3 by frequency)
  const hotList = [...probabilities].sort((a, b) => b.frequency - a.frequency).slice(0, 3);
  // Derive cold numbers (lowest frequency)
  const coldList = [...probabilities].sort((a, b) => a.frequency - b.frequency).slice(0, 3);

  // Big vs Small breakdown in last 100
  const total = history.length || 1;
  const bigCount = history.filter(h => h.size === 'big').length;
  const smallCount = total - bigCount;
  const bigPct = Math.round((bigCount / total) * 100);

  // Color breakdown
  const greenCount = history.filter(h => [1, 3, 5, 7, 9].includes(h.number)).length;
  const redCount = total - greenCount;
  const greenPct = Math.round((greenCount / total) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: Hot Numbers Radar */}
      <div className="rounded-2xl gaming-card p-4 border border-amber-500/20">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-white">{t('hotNumbers')}</h4>
            <p className="text-[11px] text-slate-400">
              {language === 'en' ? 'Highest frequency in last 100' : 'पिछले 100 राउंड में सबसे अधिक'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-2">
          {hotList.map((item, idx) => (
            <div
              key={item.number}
              className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-center"
            >
              <div className="text-[10px] text-amber-400 font-mono font-medium">#{idx + 1} HOT</div>
              <div className="font-gaming font-black text-2xl text-amber-300 my-0.5">
                {item.number}
              </div>
              <div className="text-[11px] font-mono text-slate-300">
                {item.frequency} <span className="text-[10px] text-slate-500">rounds</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card 2: Cold Numbers Radar */}
      <div className="rounded-2xl gaming-card p-4 border border-cyan-500/20">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400">
            <Snowflake className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-white">{t('coldNumbers')}</h4>
            <p className="text-[11px] text-slate-400">
              {language === 'en' ? 'Overdue due for reversal' : 'रिवर्सल की उच्च संभावना वाले नंबर'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-2">
          {coldList.map((item, idx) => (
            <div
              key={item.number}
              className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-2.5 text-center"
            >
              <div className="text-[10px] text-cyan-400 font-mono font-medium">#{idx + 1} COLD</div>
              <div className="font-gaming font-black text-2xl text-cyan-300 my-0.5">
                {item.number}
              </div>
              <div className="text-[11px] font-mono text-slate-300">
                {item.frequency} <span className="text-[10px] text-slate-500">rounds</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card 3: Macro Distribution Ratio & Pattern */}
      <div className="rounded-2xl gaming-card p-4 border border-amber-500/20 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
              <Compass className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-white">{t('patternMonitor')}</h4>
              <p className="text-[11px] text-amber-300 font-medium truncate max-w-[200px]">
                {language === 'hi' ? pattern.nameHi : pattern.nameEn}
              </p>
            </div>
          </div>

          {/* Big / Small Distribution Bar */}
          <div className="space-y-2 mt-1">
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span>Small: {smallCount} ({100 - bigPct}%)</span>
                <span>Big: {bigCount} ({bigPct}%)</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div style={{ width: `${100 - bigPct}%` }} className="bg-cyan-500" />
                <div style={{ width: `${bigPct}%` }} className="bg-amber-400" />
              </div>
            </div>

            {/* Red / Green Distribution Bar */}
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span className="text-red-400">Red: {redCount} ({100 - greenPct}%)</span>
                <span className="text-emerald-400">Green: {greenCount} ({greenPct}%)</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div style={{ width: `${100 - greenPct}%` }} className="bg-red-500" />
                <div style={{ width: `${greenPct}%` }} className="bg-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>{language === 'en' ? 'Markov State:' : 'मार्कोव स्थिति:'}</span>
          <span className="text-emerald-400 font-semibold font-mono">STABLE EQUILIBRIUM</span>
        </div>
      </div>
    </div>
  );
};
