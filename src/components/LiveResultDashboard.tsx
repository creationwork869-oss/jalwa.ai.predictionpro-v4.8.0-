import React, { useState, useMemo } from 'react';
import { History, Search, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { GameResult, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface LiveResultDashboardProps {
  history: GameResult[];
  language: Language;
}

export const LiveResultDashboard: React.FC<LiveResultDashboardProps> = ({
  history,
  language,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'big' | 'small' | 'red' | 'green'>('all');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  // Filtered dataset
  const filtered = useMemo(() => {
    return history.filter(item => {
      // Period search
      if (search.trim() && !item.period.includes(search.trim())) {
        return false;
      }
      // Type filters
      if (filterType === 'big' && item.size !== 'big') return false;
      if (filterType === 'small' && item.size !== 'small') return false;
      if (filterType === 'red' && item.color !== 'red' && item.color !== 'red_violet') return false;
      if (filterType === 'green' && item.color !== 'green' && item.color !== 'green_violet') return false;
      return true;
    });
  }, [history, search, filterType]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // CSV Exporter
  const handleExportCsv = () => {
    const headers = ['Period', 'Number', 'Size', 'Color', 'Timestamp'];
    const rows = filtered.map(r => [
      r.period,
      r.number,
      r.size,
      r.color,
      new Date(r.timestamp).toISOString(),
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jalwa_game_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBallBadge = (item: GameResult) => {
    let bg = 'bg-red-600 text-white';
    if (item.color === 'green') bg = 'bg-emerald-600 text-white';
    if (item.color === 'red_violet') bg = 'bg-gradient-to-r from-red-600 to-purple-600 text-white';
    if (item.color === 'green_violet') bg = 'bg-gradient-to-r from-emerald-600 to-purple-600 text-white';

    return (
      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-gaming font-bold text-sm shadow-sm border border-white/20 ${bg}`}>
        {item.number}
      </span>
    );
  };

  return (
    <div className="rounded-2xl gaming-card p-4 sm:p-5 border border-amber-500/20">
      {/* Top Header & Search / Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-white">
              {t('recent100Results')}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'en' ? `Showing ${filtered.length} verified records` : `${filtered.length} रिकॉर्ड्स प्रदर्शित`}
            </p>
          </div>
        </div>

        {/* Search, Filter buttons and CSV export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={t('searchPeriod')}
              className="bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 w-36 sm:w-44 font-mono"
            />
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center p-0.5 bg-slate-900 rounded-lg border border-slate-800 overflow-x-auto max-w-full">
            {(['all', 'big', 'small', 'red', 'green'] as const).map((type) => (
              <button
                key={type}
                onClick={() => { setFilterType(type); setPage(1); }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  filterType === type
                    ? 'bg-amber-500/20 text-amber-300 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type === 'all' && t('filterAll')}
                {type === 'big' && t('big').split(' ')[0]}
                {type === 'small' && t('small').split(' ')[0]}
                {type === 'red' && t('red')}
                {type === 'green' && t('green')}
              </button>
            ))}
          </div>

          {/* Export CSV button */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-amber-500 text-slate-300 hover:text-amber-300 text-xs font-medium transition-colors whitespace-nowrap"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t('exportCsv')}</span>
          </button>
        </div>
      </div>

      {/* Table / Row list */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3 font-medium">Period</th>
              <th className="py-2.5 px-3 font-medium text-center">Number</th>
              <th className="py-2.5 px-3 font-medium">Size</th>
              <th className="py-2.5 px-3 font-medium">Color</th>
              <th className="py-2.5 px-3 font-medium text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {paginated.map(item => (
              <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-3 text-slate-300 font-bold">
                  #{item.period}
                </td>
                <td className="py-2.5 px-3 text-center">
                  {getBallBadge(item)}
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`font-semibold capitalize text-xs ${
                      item.size === 'big' ? 'text-amber-400' : 'text-cyan-400'
                    }`}
                  >
                    {item.size === 'big' ? t('big') : t('small')}
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                      item.color === 'green'
                        ? 'text-emerald-400'
                        : item.color === 'red'
                        ? 'text-red-400'
                        : 'text-purple-400'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.color === 'green'
                          ? 'bg-emerald-400'
                          : item.color === 'red'
                          ? 'bg-red-400'
                          : 'bg-purple-400'
                      }`}
                    />
                    {item.color === 'green' && t('green')}
                    {item.color === 'red' && t('red')}
                    {item.color === 'red_violet' && `${t('red')} + ${t('violet')}`}
                    {item.color === 'green_violet' && `${t('green')} + ${t('violet')}`}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right text-slate-400 text-[11px]">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-800 text-xs text-slate-400">
        <div>
          {language === 'en'
            ? `Page ${page} of ${totalPages}`
            : `पेज ${page} का ${totalPages}`}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40 hover:bg-slate-800 text-slate-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40 hover:bg-slate-800 text-slate-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
