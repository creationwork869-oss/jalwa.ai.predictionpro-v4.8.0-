/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Smartphone,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  History,
  Target,
  Download,
  AlertTriangle,
  Lock,
  Layers,
  Flame,
  CheckCircle,
} from 'lucide-react';
import { Language, UserAuth } from './types';
import { useGameEngine } from './hooks/useGameEngine';
import { analyzeFrequencies } from './utils/gameData';
import { getTranslation } from './utils/translations';
import { TopHeader } from './components/TopHeader';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { LiveCountdownCard } from './components/LiveCountdownCard';
import { AIPredictionCard } from './components/AIPredictionCard';
import { NumberProbabilityGrid } from './components/NumberProbabilityGrid';
import { LiveResultDashboard } from './components/LiveResultDashboard';
import { HotColdRadar } from './components/HotColdRadar';
import { PredictionAccuracyTracker } from './components/PredictionAccuracyTracker';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { LoginModal } from './components/LoginModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<string>('prediction');

  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isApkOpen, setIsApkOpen] = useState(false);

  // User state
  const [user, setUser] = useState<UserAuth>({
    isAuthenticated: true,
    isDemo: true,
    role: 'guest',
    username: 'Guest Analyst',
  });

  // Game Engine Hook
  const {
    history,
    currentPeriod,
    countdown,
    roundDuration,
    setRoundDuration,
    isLocked,
    currentPrediction,
    isAnalyzing,
    predictionHistory,
    setManualNextNumber,
    refreshPrediction,
    resetHistoricalData,
    fastForwardRound,
    overallWinRate,
    currentStreak,
  } = useGameEngine(language);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  // Calculate probabilities and frequencies
  const probabilities = analyzeFrequencies(history);

  // Main Dashboard Content
  const renderDashboardContent = () => {
    return (
      <div className="space-y-6">
        {/* Tab 1: Prediction & Live Radar */}
        {(activeTab === 'prediction' || activeTab === 'all') && (
          <>
            {/* Live Countdown & Period Info */}
            <LiveCountdownCard
              currentPeriod={currentPeriod}
              countdown={countdown}
              totalDuration={roundDuration}
              isLocked={isLocked}
              latestResult={history[0]}
              onFastForward={fastForwardRound}
              language={language}
            />

            {/* AI Prediction Hero */}
            <AIPredictionCard
              prediction={currentPrediction}
              isLocked={isLocked}
              isAnalyzing={isAnalyzing}
              onRefresh={refreshPrediction}
              language={language}
            />

            {/* 0-9 Number Probability Matrix */}
            <NumberProbabilityGrid
              probabilities={probabilities}
              highlightNumber={currentPrediction.predictedNumber}
              language={language}
            />

            {/* Hot and Cold Radar + Pattern Analytics */}
            <HotColdRadar
              history={history}
              probabilities={probabilities}
              language={language}
            />
          </>
        )}

        {/* Tab 2: Live Results History (Previous 100 rounds) */}
        {activeTab === 'results' && (
          <LiveResultDashboard history={history} language={language} />
        )}

        {/* Tab 3: Heatmap & Radar */}
        {activeTab === 'heatmap' && (
          <div className="space-y-6">
            <NumberProbabilityGrid
              probabilities={probabilities}
              highlightNumber={currentPrediction.predictedNumber}
              language={language}
            />
            <HotColdRadar
              history={history}
              probabilities={probabilities}
              language={language}
            />
          </div>
        )}

        {/* Tab 4: Accuracy & Prediction History */}
        {activeTab === 'accuracy' && (
          <PredictionAccuracyTracker
            predictionHistory={predictionHistory}
            overallWinRate={overallWinRate}
            currentStreak={currentStreak}
            language={language}
          />
        )}

        {/* When in prediction tab, also show compact accuracy tracker below */}
        {activeTab === 'prediction' && (
          <PredictionAccuracyTracker
            predictionHistory={predictionHistory}
            overallWinRate={overallWinRate}
            currentStreak={currentStreak}
            language={language}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <TopHeader
        language={language}
        onLanguageChange={setLanguage}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        deviceMode={deviceMode}
        onToggleDeviceMode={() => setDeviceMode(d => d === 'desktop' ? 'mobile' : 'desktop')}
        user={user}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenApkModal={() => setIsApkOpen(true)}
      />

      {/* Verified Statistical Disclaimer Banner */}
      <DisclaimerBanner language={language} />

      {/* Main Container: supports standard Desktop Responsive or Simulated Android Mobile Shell */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 pb-24 md:pb-12">
        {deviceMode === 'mobile' ? (
          /* Android Smartphone Shell Simulator */
          <div className="flex justify-center items-center py-4">
            <div className="relative w-full max-w-[420px] bg-[#0B0E14] rounded-[48px] p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-amber-500/30 overflow-hidden">
              {/* Android Notch & Speaker Slot */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-5 bg-slate-900 rounded-b-2xl z-30 flex items-center justify-center">
                <div className="w-12 h-1 bg-slate-700 rounded-full" />
                <div className="w-2.5 h-2.5 bg-slate-800 rounded-full ml-3 border border-slate-700" />
              </div>

              {/* Android Status Bar */}
              <div className="pt-2 px-5 pb-2 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none">
                <span>09:41</span>
                <div className="flex items-center gap-1.5 text-amber-400">
                  <span className="text-[10px] font-bold">5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Scrollable Screen Body */}
              <div className="max-h-[780px] overflow-y-auto px-1 pt-1 pb-16 space-y-4">
                {renderDashboardContent()}
              </div>

              {/* Android Bottom Navigation Pill */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-600 rounded-full" />
            </div>
          </div>
        ) : (
          /* Full Desktop / Responsive Dashboard */
          renderDashboardContent()
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Tab Bar (Ergonomic Thumb Zone) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0B0E14]/95 backdrop-blur-md border-t border-amber-500/20 px-2 py-1.5 pb-safe">
        <div className="grid grid-cols-4 items-center">
          <button
            onClick={() => setActiveTab('prediction')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition-colors ${
              activeTab === 'prediction' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] truncate">{language === 'en' ? 'Predict' : 'अनुमान'}</span>
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition-colors ${
              activeTab === 'results' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <History className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] truncate">{language === 'en' ? '100 Logs' : 'परिणाम'}</span>
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition-colors ${
              activeTab === 'heatmap' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <BarChart3 className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] truncate">{language === 'en' ? 'Radar' : 'रडार'}</span>
          </button>
          <button
            onClick={() => setIsApkOpen(true)}
            className="flex flex-col items-center py-1.5 px-1 rounded-xl text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <Download className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] truncate">APK</span>
          </button>
        </div>
      </div>

      {/* Footer with Ethical Compliance & Responsible Gaming Notice */}
      <footer className="border-t border-slate-900 bg-[#07090E] py-6 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Jalwa AI Number Prediction Pro · Android Release v4.8</span>
            </div>
            <p className="text-[11px] text-slate-500 max-w-2xl leading-normal">
              {t('ethicalNote')}
            </p>
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            © 2026 Jalwa AI Intelligence Lab. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        roundDuration={roundDuration}
        onSetRoundDuration={setRoundDuration}
        onFastForward={fastForwardRound}
        onInjectNextNumber={setManualNextNumber}
        onResetHistory={resetHistoricalData}
        language={language}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentUser={user}
        onUpdateUser={setUser}
        language={language}
      />

      <ApkDownloadModal
        isOpen={isApkOpen}
        onClose={() => setIsApkOpen(false)}
        language={language}
      />
    </div>
  );
}
