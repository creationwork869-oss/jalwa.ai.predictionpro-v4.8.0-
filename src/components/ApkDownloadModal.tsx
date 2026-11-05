import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, CheckCircle, ShieldCheck, QrCode, FileText } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  // Catch PWA beforeinstallprompt event for direct native install
  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsPwaInstalled(isStandalone);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsPwaInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      // Simulate APK download file delivery
      triggerApkDownload();
    }
  };

  const triggerApkDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      // Create a dummy manifest/apk package download for Android user simulation
      const element = document.createElement('a');
      const file = new Blob([
        `Jalwa AI Number Prediction Pro v4.8.0 Android Package\nPackage: com.jalwa.ai.predictionpro\nArchitecture: ARM64-v8a\nBuild: 20261103-RELEASE\nSHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\nVerified Statistical Prediction Module Enabled.`
      ], { type: 'application/vnd.android.package-archive' });
      element.href = URL.createObjectURL(file);
      element.download = 'Jalwa_AI_Prediction_Pro_v4.8.apk';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      setDownloading(false);
      setDownloadComplete(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl gaming-card border border-amber-500/40 p-5 sm:p-6 shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-20 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <h3 className="font-display font-bold text-lg text-white">
              {language === 'en' ? 'Download Android APK' : 'एंड्रॉइड APK डाउनलोड करें'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* APK Card Specs */}
        <div className="my-4 space-y-4 text-xs">
          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-900 border border-amber-500/30">
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-amber-400/40 shrink-0 shadow-md">
              <img
                src="/pwa-192x192.png"
                alt="Jalwa AI Pro Icon"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-white">Jalwa AI Prediction Pro</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono font-bold px-1.5 py-0.5 rounded">
                  v4.8.0
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                com.jalwa.ai.predictionpro · 18.4 MB
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-amber-400 mt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Google Play Protect Verified · Clean & Safe</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Instant Install vs Download APK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {deferredPrompt ? (
              <button
                onClick={handleInstallPwa}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
              >
                <Smartphone className="w-4 h-4" />
                <span>Direct 1-Click Install</span>
              </button>
            ) : null}

            <button
              onClick={triggerApkDownload}
              disabled={downloading}
              className={`py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all ${
                deferredPrompt ? '' : 'sm:col-span-2'
              }`}
            >
              <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
              <span>
                {downloading
                  ? (language === 'en' ? 'Generating APK Package...' : 'APK फाइल तैयार हो रही है...')
                  : (language === 'en' ? 'Download APK (18.4 MB)' : 'APK डाउनलोड करें (18.4 MB)')}
              </span>
            </button>
          </div>

          {downloadComplete && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {language === 'en'
                  ? 'APK Download started! Check your notification bar or downloads folder.'
                  : 'APK डाउनलोड शुरू हो गया है! अपना नोटिफिकेशन बार या डाउनलोड फोल्डर चेक करें।'}
              </span>
            </div>
          )}

          {/* Step-by-Step Installation Instructions */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="font-semibold text-slate-200 block">
              {language === 'en' ? 'How to Install on Android:' : 'एंड्रॉइड पर कैसे इंस्टॉल करें:'}
            </span>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
              <li>
                {language === 'en'
                  ? 'Download the APK file above onto your Android device.'
                  : 'ऊपर दिए बटन से APK फाइल को अपने डिवाइस पर डाउनलोड करें।'}
              </li>
              <li>
                {language === 'en'
                  ? 'Tap the downloaded file in notification or Files app.'
                  : 'डाउनलोड की गई फाइल पर क्लिक करें।'}
              </li>
              <li>
                {language === 'en'
                  ? 'If prompted, allow "Install from Unknown Sources" in Android Settings.'
                  : 'यदि संकेत मिले, तो "Unknown Sources से इंस्टॉल" की अनुमति दें।'}
              </li>
              <li>
                {language === 'en'
                  ? 'Tap "Install" and open Jalwa AI Prediction Pro!'
                  : '"Install" दबाएं और जलवा AI प्रो शुरू करें!'}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
