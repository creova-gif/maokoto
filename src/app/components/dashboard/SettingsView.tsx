import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Globe, DollarSign, Calendar, Download, Upload,
  Trash2, AlertTriangle, X, CheckCircle, Shield, Lock, Unlock,
  TrendingUp, Star, Bell, BellOff,
} from 'lucide-react';
import { useApp } from '@/app/App';
import { t } from '@/app/utils/translations';
import { REGION_CONFIG } from '@/app/utils/currency';
import { LegalView } from './LegalView';
import { AppLockSetup } from './AppLock';
import { Analytics } from '@/app/utils/analytics';

interface SettingsViewProps {
  onBack: () => void;
}

function HealthBar({ score }: { score: number }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#3b82f6' : score >= 40 ? '#f59e0b' : '#ef4444';
  const label = score >= 80
    ? { en: 'Excellent', sw: 'Bora Sana' }
    : score >= 60
    ? { en: 'Good', sw: 'Nzuri' }
    : score >= 40
    ? { en: 'Fair', sw: 'Wastani' }
    : { en: 'Needs Work', sw: 'Inabidi Kuboresha' };
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-semibold text-gray-500">{label.en}</span>
        <span className="text-sm font-black" style={{ color }}>{score}/100</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  );
}

export function SettingsView({ onBack }: SettingsViewProps) {
  const { state, setLanguage, setRegion, clearAllData, setAppLockPin, disableAppLock, setUserName } = useApp();
  const lang = state.language;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [showLockSetup, setShowLockSetup] = useState(false);
  const [showDisableLockConfirm, setShowDisableLockConfirm] = useState(false);
  const [nameInput, setNameInput] = useState(state.userName);
  const [importDone, setImportDone] = useState(false);
  const [importError, setImportError] = useState('');
  const [pendingImport, setPendingImport] = useState<string | null>(null);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [notifyBudget, setNotifyBudget] = useState(true);
  const [notifyStreak, setNotifyStreak] = useState(true);
  const [notifyGoal, setNotifyGoal] = useState(true);

  const initials = (state.userName || 'P').slice(0, 2).toUpperCase();

  const healthScore = useMemo(() => {
    let score = 0;
    if (state.transactions.length > 0) score += 20;
    if (state.streak >= 3) score += 15;
    if (state.goals.length > 0) score += 15;
    if (Object.keys(state.categoryBudgets).length > 0) score += 20;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthIncome = state.transactions
      .filter(t => t.type === 'income' && t.date >= start)
      .reduce((s, t) => s + t.amount, 0);
    const monthExpense = state.transactions
      .filter(t => t.type === 'expense' && t.date >= start)
      .reduce((s, t) => s + t.amount, 0);
    if (monthIncome > 0 && monthExpense < monthIncome) score += 20;
    if (state.goals.some(g => g.completed)) score += 10;
    return Math.min(score, 100);
  }, [state]);

  const handleExportCSV = () => {
    if (state.transactions.length === 0) return;
    Analytics.logEvent('data_exported', { count: state.transactions.length });
    const regionCfg = REGION_CONFIG[state.region];
    const headers = ['Date', 'Time', 'Type', 'Category', `Amount (${regionCfg.currency})`, 'Source', 'Notes'];
    const rows = state.transactions.map(tx => [
      tx.date.toLocaleDateString(regionCfg.locale),
      tx.date.toLocaleTimeString(regionCfg.locale, { hour: '2-digit', minute: '2-digit' }),
      tx.type, tx.category, tx.amount.toString(), tx.source,
      (tx.notes || '').replace(/"/g, '""'),
    ]);
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pesaplan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setExportDone(true);
    setTimeout(() => setExportDone(false), 3000);
  };

  const handleDeleteData = () => {
    Analytics.logEvent('data_deleted');
    clearAllData();
    setShowDeleteConfirm(false);
  };

  const handleExportJSON = () => {
    const raw = localStorage.getItem('pesaplan_v1');
    if (!raw) return;
    const blob = new Blob([raw], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pesaplan-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    Analytics.logEvent('data_exported_json');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError('');
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = JSON.parse(text);
        if (typeof parsed !== 'object' || !Array.isArray(parsed.transactions)) {
          setImportError(t('invalidBackupFile', lang)); return;
        }
        setPendingImport(text);
        setShowImportConfirm(true);
      } catch {
        setImportError(t('invalidJSONFile', lang));
      }
    };
    reader.readAsText(file);
  };

  const confirmImport = () => {
    if (!pendingImport) return;
    localStorage.setItem('pesaplan_v1', pendingImport);
    Analytics.logEvent('data_imported_json');
    window.location.reload();
  };

  const AVATAR_COLORS = ['from-emerald-400 to-teal-500', 'from-purple-400 to-indigo-500', 'from-orange-400 to-red-400', 'from-blue-400 to-cyan-500'];
  const avatarColor = AVATAR_COLORS[(state.userName.charCodeAt(0) || 80) % AVATAR_COLORS.length];

  const settingsItems = [
    {
      icon: Globe,
      label: t('language', lang),
      value: lang === 'sw' ? 'Kiswahili' : 'English',
      action: () => setLanguage(lang === 'sw' ? 'en' : 'sw'),
    },
    {
      icon: DollarSign,
      label: t('countryCurrency', lang),
      value: `${REGION_CONFIG[state.region].flag} ${REGION_CONFIG[state.region].currency}`,
      action: () => {
        const order = ['TZ', 'KE', 'UG', 'RW', 'BI'] as const;
        const next = order[(order.indexOf(state.region) + 1) % order.length];
        setRegion(next);
      },
    },
    {
      icon: Calendar,
      label: t('incomeFrequency', lang),
      value: state.incomeFrequency
        ? {
            daily:     lang === 'sw' ? 'Kila Siku' : 'Daily',
            weekly:    lang === 'sw' ? 'Kila Wiki' : 'Weekly',
            monthly:   lang === 'sw' ? 'Kila Mwezi' : 'Monthly',
            irregular: lang === 'sw' ? 'Isiyo ya Kawaida' : 'Irregular',
          }[state.incomeFrequency]
        : t('notSet', lang),
      action: () => {},
    },
    {
      icon: Shield,
      label: t('legal', lang),
      value: lang === 'sw' ? 'Sera · Masharti' : 'Policy · Terms',
      action: () => setShowLegal(true),
    },
  ];

  if (showLegal) {
    return <LegalView onBack={() => setShowLegal(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white px-6 pb-8 min-safe-top">
        <div className="flex items-center mb-5">
          <button onClick={onBack} className="mr-4 p-2 hover:bg-white/10 rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">{t('settings', lang)}</h1>
        </div>

        {/* Profile card */}
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-xl font-black text-white shadow-lg`}>
            {initials}
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg text-white leading-tight">
              {state.userName || (lang === 'sw' ? 'Mtumiaji' : 'User')}
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              {REGION_CONFIG[state.region].flag} {REGION_CONFIG[state.region].currency} ·{' '}
              {lang === 'sw' ? 'Kiswahili' : 'English'} ·{' '}
              🔥 {state.streak} {lang === 'sw' ? 'siku' : 'days'}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-white/10 rounded-xl px-3 py-2">
              <p className="text-white/60 text-[10px] uppercase tracking-wide">
                {lang === 'sw' ? 'Afya' : 'Health'}
              </p>
              <p className="text-white font-black text-lg leading-tight">{healthScore}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Financial Health Score */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-gray-800">
              {lang === 'sw' ? 'Alama ya Afya ya Fedha' : 'Financial Health Score'}
            </h2>
          </div>
          <HealthBar score={healthScore} />
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { icon: '💸', label: lang === 'sw' ? 'Miamala' : 'Transactions', value: state.transactions.length },
              { icon: '🎯', label: lang === 'sw' ? 'Malengo' : 'Goals', value: state.goals.length },
              { icon: '🔥', label: lang === 'sw' ? 'Siku' : 'Streak', value: `${state.streak}d` },
            ].map(({ icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-2.5 text-center">
                <p className="text-base">{icon}</p>
                <p className="text-sm font-bold text-gray-800">{value}</p>
                <p className="text-[10px] text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Name input */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
            {t('yourName', lang)}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder={lang === 'sw' ? 'Weka jina lako...' : 'Enter your name...'}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              maxLength={30}
            />
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setUserName(nameInput)}
              disabled={nameInput.trim() === state.userName}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold disabled:opacity-40 hover:bg-emerald-600 transition"
            >
              {t('save', lang)}
            </motion.button>
          </div>
        </div>

        {/* General Settings */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            {t('settings', lang)}
          </h2>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {settingsItems.map((item, index) => (
              <motion.button
                key={index}
                onClick={item.action}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition ${
                  index < settingsItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <item.icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900 text-sm">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{item.value}</span>
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Notification Preferences */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            🔔 {lang === 'sw' ? 'Mipangilio ya Arifa' : 'Notification Preferences'}
          </h2>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {[
              {
                icon: AlertTriangle,
                color: 'text-orange-500',
                bg: 'bg-orange-50',
                label: lang === 'sw' ? 'Arifa za Bajeti' : 'Budget Alerts',
                sub: lang === 'sw' ? 'Arifu unapokaribia mipaka ya bajeti' : 'Alert when nearing budget limits',
                value: notifyBudget,
                toggle: () => setNotifyBudget(v => !v),
              },
              {
                icon: Star,
                color: 'text-yellow-500',
                bg: 'bg-yellow-50',
                label: lang === 'sw' ? 'Mfululizo wa Siku' : 'Daily Streak',
                sub: lang === 'sw' ? 'Kumbuka kurekodi kila siku' : 'Remind to log transactions daily',
                value: notifyStreak,
                toggle: () => setNotifyStreak(v => !v),
              },
              {
                icon: TrendingUp,
                color: 'text-purple-500',
                bg: 'bg-purple-50',
                label: lang === 'sw' ? 'Maendeleo ya Malengo' : 'Goal Progress',
                sub: lang === 'sw' ? 'Malengo ya hatua na mafanikio' : 'Milestone and goal completion alerts',
                value: notifyGoal,
                toggle: () => setNotifyGoal(v => !v),
              },
            ].map((item, i, arr) => (
              <div key={item.label} className={`flex items-center p-4 gap-3 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className={`${item.bg} p-2 rounded-full shrink-0`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-400 truncate">{item.sub}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={item.toggle}
                  className={`w-11 h-6 rounded-full flex items-center transition-colors duration-300 shrink-0 ${
                    item.value ? 'bg-emerald-500 justify-end' : 'bg-gray-200 justify-start'
                  } px-0.5`}
                >
                  <motion.div
                    layout
                    className="w-5 h-5 bg-white rounded-full shadow-sm"
                  />
                </motion.button>
              </div>
            ))}
          </div>
        </div>

        {/* Data Storage Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            {lang === 'sw'
              ? 'Data yako imehifadhiwa kwenye kifaa hiki peke yake. Hakuna akiba ya wingu. Hamisha CSV mara kwa mara ili kulinda data yako.'
              : 'Your data is stored on this device only. No cloud backup. Export CSV regularly to keep a safe copy.'}
          </p>
        </div>

        {/* Actions */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            {t('actions', lang)}
          </h2>
          <div className="space-y-3">
            <motion.button
              onClick={handleExportCSV}
              disabled={state.transactions.length === 0}
              className={`w-full bg-white rounded-2xl p-4 shadow-md flex items-center gap-3 hover:shadow-lg transition ${
                state.transactions.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              whileTap={state.transactions.length > 0 ? { scale: 0.98 } : {}}
            >
              <div className="bg-emerald-100 p-2 rounded-full">
                {exportDone
                  ? <CheckCircle className="w-5 h-5 text-emerald-600" />
                  : <Download className="w-5 h-5 text-emerald-600" />}
              </div>
              <div className="text-left">
                <span className="font-medium text-gray-900 block text-sm">
                  {exportDone ? t('downloaded', lang) : t('exportHistory', lang)}
                </span>
                <span className="text-xs text-gray-500">
                  {state.transactions.length === 0
                    ? t('noDataToExport', lang)
                    : `${state.transactions.length} ${lang === 'sw' ? 'miamala → CSV' : 'transactions → CSV'}`}
                </span>
              </div>
            </motion.button>

            <motion.button
              onClick={handleExportJSON}
              className="w-full bg-white rounded-2xl p-4 shadow-md flex items-center gap-3 hover:shadow-lg transition"
              whileTap={{ scale: 0.98 }}
            >
              <div className="bg-blue-100 p-2 rounded-full">
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <span className="font-medium text-gray-900 block text-sm">{t('saveBackupJSON', lang)}</span>
                <span className="text-xs text-gray-500">{t('fullDataBackup', lang)}</span>
              </div>
            </motion.button>

            <label className="w-full bg-white rounded-2xl p-4 shadow-md flex items-center gap-3 hover:shadow-lg transition cursor-pointer active:scale-[0.98]">
              <div className={`p-2 rounded-full ${importDone ? 'bg-emerald-100' : 'bg-purple-100'}`}>
                {importDone
                  ? <CheckCircle className="w-5 h-5 text-emerald-600" />
                  : <Upload className="w-5 h-5 text-purple-600" />}
              </div>
              <div className="text-left">
                <span className="font-medium text-gray-900 block text-sm">
                  {importDone ? t('restoredDone', lang) : t('restoreBackupJSON', lang)}
                </span>
                <span className="text-xs text-gray-500">{t('restoreFromFile', lang)}</span>
              </div>
              <input type="file" accept=".json,application/json" className="hidden" onChange={handleImportJSON} />
            </label>
            {importError && <p className="text-red-500 text-xs px-1">{importError}</p>}

            <motion.button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full bg-white rounded-2xl p-4 shadow-md flex items-center gap-3 hover:shadow-lg transition border border-red-100"
              whileTap={{ scale: 0.98 }}
            >
              <div className="bg-red-100 p-2 rounded-full">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-left">
                <span className="font-medium text-red-700 block text-sm">{t('deleteData', lang)}</span>
                <span className="text-xs text-gray-500">{t('eraseAllData', lang)}</span>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Security */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            🔒 {t('security', lang)}
          </h2>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <motion.button
              onClick={() => {
                if (state.appLockEnabled) setShowDisableLockConfirm(true);
                else setShowLockSetup(true);
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${state.appLockEnabled ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                  {state.appLockEnabled
                    ? <Lock className="w-4 h-4 text-emerald-600" />
                    : <Unlock className="w-4 h-4 text-gray-500" />}
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm">{t('appLock', lang)}</p>
                  <p className="text-xs text-gray-400">
                    {state.appLockEnabled ? t('enabledTapToChange', lang) : t('secureApp', lang)}
                  </p>
                </div>
              </div>
              <div className={`w-11 h-6 rounded-full flex items-center transition-colors duration-300 ${
                state.appLockEnabled ? 'bg-emerald-500 justify-end' : 'bg-gray-200 justify-start'
              } px-0.5`}>
                <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
              </div>
            </motion.button>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-2xl mx-auto mb-2`}>
            💰
          </div>
          <p className="font-bold text-gray-900">PesaPlan v1.0.0</p>
          <p className="text-xs text-gray-400 mt-0.5">{lang === 'sw' ? 'Imetengenezwa kwa East Africa 🌍' : 'Made for East Africa 🌍'}</p>
          <button
            onClick={() => setShowLegal(true)}
            className="mt-2 text-xs text-gray-400 underline underline-offset-2"
          >
            {t('privacyPolicy', lang)} · {t('termsOfService', lang)}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setShowDeleteConfirm(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed inset-x-6 top-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 z-50 shadow-2xl"
            >
              <button onClick={() => setShowDeleteConfirm(false)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-center text-gray-900 mb-2">{t('deleteAllDataTitle', lang)}</h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                {lang === 'sw'
                  ? 'Hii itafuta miamala yote, malengo, na mipangilio yako. Haitaweza kutenduliwa.'
                  : 'This will permanently erase all your transactions, goals, and settings. This cannot be undone.'}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold">
                  {t('cancel', lang)}
                </button>
                <button onClick={handleDeleteData} className="flex-1 py-3 rounded-2xl bg-red-600 text-white font-semibold">
                  {t('yesDelete', lang)}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Import Confirm Modal */}
      <AnimatePresence>
        {showImportConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setShowImportConfirm(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed inset-x-6 top-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 z-50 shadow-2xl"
            >
              <button onClick={() => setShowImportConfirm(false)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-7 h-7 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-center text-gray-900 mb-2">{t('restoreBackupTitle', lang)}</h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                {lang === 'sw'
                  ? 'Data yako ya sasa itafutwa na kubadilishwa na nakala. Hii haiwezi kutenduliwa.'
                  : 'Your current data will be replaced with the backup. This cannot be undone.'}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowImportConfirm(false)} className="flex-1 py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold">
                  {t('cancel', lang)}
                </button>
                <button onClick={confirmImport} className="flex-1 py-3 rounded-2xl bg-purple-600 text-white font-semibold">
                  {t('yesRestore', lang)}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* App Lock Setup Overlay */}
      <AnimatePresence>
        {showLockSetup && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <AppLockSetup
              onDone={(pin) => { setAppLockPin(pin); setShowLockSetup(false); }}
              onCancel={() => setShowLockSetup(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disable Lock Confirmation */}
      <AnimatePresence>
        {showDisableLockConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setShowDisableLockConfirm(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed inset-x-6 top-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 z-50 shadow-2xl"
            >
              <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Unlock className="w-7 h-7 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-center text-gray-900 mb-2">{t('disablePinLock', lang)}</h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                {lang === 'sw'
                  ? 'Je, una uhakika unataka kuzima kufunga kwa PIN?'
                  : 'Are you sure you want to disable PIN lock?'}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowDisableLockConfirm(false)} className="flex-1 py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold">
                  {t('cancel', lang)}
                </button>
                <button
                  onClick={() => { disableAppLock(); setShowDisableLockConfirm(false); }}
                  className="flex-1 py-3 rounded-2xl bg-amber-500 text-white font-semibold"
                >
                  {lang === 'sw' ? 'Ndio, Zima' : 'Yes, Disable'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
