import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Zap, X, Play, CheckCircle, Users, Plus, Trash2, Flame } from 'lucide-react';
import { useApp } from '@/app/App';
import { toast } from 'sonner';
import { formatCurrency, REGION_CONFIG } from '@/app/utils/currency';

interface ChallengeTemplate {
  id: string;
  emoji: string;
  name: { sw: string; en: string; fr: string; ar: string; pt: string };
  desc: { sw: string; en: string; fr: string; ar: string; pt: string };
  targetDays: number;
  dailyAmount: number;
  communityPct: number;
  accent: string;
  glow: string;
}

const TEMPLATES: ChallengeTemplate[] = [
  {
    id: 'tpl-30day',
    emoji: '🔥',
    name: {
      sw: 'Changamoto ya Siku 30', en: '30-Day Savings Sprint',
      fr: 'Défi 30 Jours', ar: 'تحدي 30 يوماً', pt: 'Desafio 30 Dias',
    },
    desc: {
      sw: 'Hifadhi TSh 3,000 kila siku kwa siku 30', en: 'Save TSh 3,000 every day for 30 days',
      fr: 'Épargnez 3 000 TSh chaque jour pendant 30 jours', ar: 'وفر 3,000 TSh يومياً لمدة 30 يوماً', pt: 'Poupe 3.000 TSh por dia durante 30 dias',
    },
    targetDays: 30, dailyAmount: 3000, communityPct: 68,
    accent: '#F97316', glow: 'rgba(249,115,22,0.18)',
  },
  {
    id: 'tpl-emergency',
    emoji: '🏦',
    name: {
      sw: 'Sprint ya Mfuko wa Dharura', en: 'Emergency Fund Sprint',
      fr: "Sprint Fonds d'Urgence", ar: 'سباق صندوق الطوارئ', pt: 'Sprint Fundo de Emergência',
    },
    desc: {
      sw: 'Hifadhi TSh 5,000 kila siku kwa miezi 3', en: 'Save TSh 5,000 daily for 90 days',
      fr: 'Épargnez 5 000 TSh/jour pendant 90 jours', ar: 'وفر 5,000 TSh يومياً لـ 90 يوماً', pt: 'Poupe 5.000 TSh/dia por 90 dias',
    },
    targetDays: 90, dailyAmount: 5000, communityPct: 42,
    accent: '#3B82F6', glow: 'rgba(59,130,246,0.18)',
  },
  {
    id: 'tpl-no-spend',
    emoji: '🚫',
    name: {
      sw: 'Wiki ya Bila Starehe', en: 'No-Entertainment Week',
      fr: 'Semaine Sans Loisirs', ar: 'أسبوع بدون ترفيه', pt: 'Semana Sem Entretenimento',
    },
    desc: {
      sw: 'Epuka matumizi ya burudani kwa siku 7', en: 'Zero entertainment spending for 7 days',
      fr: 'Zéro dépense loisirs pendant 7 jours', ar: 'صفر إنفاق ترفيهي لمدة 7 أيام', pt: 'Zero gastos com entretenimento por 7 dias',
    },
    targetDays: 7, dailyAmount: 2000, communityPct: 55,
    accent: '#A855F7', glow: 'rgba(168,85,247,0.18)',
  },
  {
    id: 'tpl-data',
    emoji: '📱',
    name: {
      sw: 'Punguza Data – Siku 14', en: 'Data Detox – 14 Days',
      fr: 'Détox Data – 14 Jours', ar: 'إزالة سموم البيانات – 14 يوماً', pt: 'Detox de Dados – 14 Dias',
    },
    desc: {
      sw: 'Hifadhi TSh 1,000 kwa siku kwa kupunguza data', en: 'Save TSh 1,000/day by cutting data costs',
      fr: 'Économisez 1 000 TSh/jour en réduisant data', ar: 'وفر 1,000 TSh/يوم بتقليل تكاليف البيانات', pt: 'Poupe 1.000 TSh/dia reduzindo custos de dados',
    },
    targetDays: 14, dailyAmount: 1000, communityPct: 74,
    accent: '#00A875', glow: 'rgba(0,168,117,0.18)',
  },
];

function CommunityRing({ pct, color }: { pct: number; color: string }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ position: 'relative', width: 50, height: 50, flexShrink: 0 }}>
      <svg width={50} height={50} viewBox="0 0 50 50" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={25} cy={25} r={r} fill="none" stroke="var(--mk-border)" strokeWidth={4} />
        <motion.circle
          cx={25} cy={25} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${dash} ${circ}` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 10, fontWeight: 800, color, fontFamily: 'Geist, sans-serif', letterSpacing: '-0.01em' }}>
          {pct}%
        </span>
      </div>
    </div>
  );
}

type Lang = 'sw' | 'en' | 'fr' | 'ar' | 'pt';

function tx(obj: Record<string, string>, lang: string): string {
  return obj[lang] || obj.en;
}

const UI = {
  header:       { sw: 'Changamoto za Akiba', en: 'Savings Challenges', fr: 'Défis Épargne', ar: 'تحديات الادخار', pt: 'Desafios de Poupança' },
  completed:    { sw: 'zilizokamilika', en: 'completed', fr: 'complétés', ar: 'مكتملة', pt: 'completos' },
  succeed:      { sw: 'wanafanikiwa', en: 'succeed', fr: 'réussissent', ar: 'ينجحون', pt: 'têm sucesso' },
  days:         { sw: 'siku', en: 'days', fr: 'jours', ar: 'أيام', pt: 'dias' },
  start:        { sw: 'Anza', en: 'Start', fr: 'Commencer', ar: 'ابدأ', pt: 'Iniciar' },
  startNow:     { sw: 'Anza Sasa!', en: 'Start Now!', fr: 'Commencer!', ar: 'ابدأ الآن!', pt: 'Começar Agora!' },
  cancel:       { sw: 'Ghairi', en: 'Cancel', fr: 'Annuler', ar: 'إلغاء', pt: 'Cancelar' },
  daysLeft:     { sw: 'siku zimebaki', en: 'days left', fr: 'jours restants', ar: 'أيام متبقية', pt: 'dias restantes' },
  saved:        { sw: 'imeokolewa', en: 'saved', fr: 'économisé', ar: 'مدخر', pt: 'poupado' },
  logToday:     { sw: 'Rekodi Leo', en: 'Log Today', fr: "Enregistrer Aujourd'hui", ar: 'سجّل اليوم', pt: 'Registrar Hoje' },
  onTrack:      { sw: 'Kwenye mkondo', en: 'On track', fr: 'Dans les temps', ar: 'في المسار', pt: 'No caminho' },
  behind:       { sw: 'Umechelewa', en: 'Behind', fr: 'En retard', ar: 'متأخر', pt: 'Atrasado' },
  abandon:      { sw: 'Acha changamoto?', en: 'Abandon challenge?', fr: 'Abandonner le défi?', ar: 'التخلي عن التحدي؟', pt: 'Abandonar desafio?' },
  started:      { sw: '🔥 Changamoto imeanza!', en: '🔥 Challenge started!', fr: '🔥 Défi commencé!', ar: '🔥 بدأ التحدي!', pt: '🔥 Desafio iniciado!' },
  dayLogged:    { sw: '✅ Siku imerekodiwa!', en: '✅ Day logged!', fr: '✅ Jour enregistré!', ar: '✅ تم تسجيل اليوم!', pt: '✅ Dia registrado!' },
  daily:        { sw: 'kila siku', en: '/day', fr: '/jour', ar: '/يوم', pt: '/dia' },
  goal:         { sw: 'Lengo', en: 'Goal', fr: 'Objectif', ar: 'الهدف', pt: 'Meta' },
  dailyAmt:     { sw: 'Kiasi cha kila siku — hiari', en: 'Daily amount — optional', fr: 'Montant quotidien — optionnel', ar: 'المبلغ اليومي — اختياري', pt: 'Valor diário — opcional' },
  defaultAmt:   { sw: 'Kiasi cha chaguo msingi:', en: 'Default:', fr: 'Par défaut:', ar: 'الافتراضي:', pt: 'Padrão:' },
  communityTxt: {
    sw: 'ya watumiaji wa Maokoto wanaofanya changamoto hii wanafanikiwa.',
    en: 'of Maokoto users taking this challenge succeed.',
    fr: 'des utilisateurs Maokoto réussissent ce défi.',
    ar: 'من مستخدمي Maokoto الذين يأخذون هذا التحدي ينجحون.',
    pt: 'dos usuários do Maokoto que fazem este desafio têm sucesso.',
  },
};

export function SavingsChallenge() {
  const { state, startChallenge, logChallengeDay, abandonChallenge } = useApp();
  const lang = (state.language || 'en') as Lang;
  const [showStart, setShowStart] = useState<ChallengeTemplate | null>(null);
  const [logAmount, setLogAmount] = useState('');
  const [logTarget, setLogTarget] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  const fmt = (n: number) => formatCurrency(n, state.region);
  const symbol = REGION_CONFIG[state.region].symbol;

  const activeChallenges = state.challenges?.filter(c => !c.completed) ?? [];
  const completedChallenges = state.challenges?.filter(c => c.completed) ?? [];

  const getChallengeProgress = (c: typeof state.challenges[0]) => {
    const daysElapsed = Math.floor((Date.now() - new Date(c.startDate).getTime()) / 86400000);
    const daysLogged = c.contributions.length;
    const totalSaved = c.contributions.reduce((s, v) => s + v, 0);
    const pct = Math.round((daysLogged / c.targetDays) * 100);
    const expectedByNow = Math.min(daysElapsed + 1, c.targetDays) * c.dailyAmount;
    const onTrack = totalSaved >= expectedByNow * 0.8;
    return { daysElapsed, daysLogged, totalSaved, pct, onTrack, remaining: c.targetDays - daysLogged };
  };

  const handleStart = (tpl: ChallengeTemplate) => {
    const dailyAmt = customAmount ? parseInt(customAmount) : tpl.dailyAmount;
    startChallenge({
      name: tx(tpl.name, lang),
      emoji: tpl.emoji,
      targetDays: tpl.targetDays,
      dailyAmount: dailyAmt,
      startDate: new Date().toISOString(),
    });
    setShowStart(null);
    setCustomAmount('');
    toast.success(tx(UI.started, lang));
  };

  const handleLogDay = (id: string) => {
    const amount = parseFloat(logAmount);
    if (!amount || amount <= 0) return;
    logChallengeDay(id, amount);
    setLogTarget(null);
    setLogAmount('');
    toast.success(`${tx(UI.dayLogged, lang)} +${fmt(amount)}`);
  };

  const availableTemplates = TEMPLATES.filter(
    tpl => !activeChallenges.some(c => c.name === tx(tpl.name, lang))
  );

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--mk-orange), var(--mk-red))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Trophy style={{ width: 16, height: 16, color: '#fff' }} />
            </div>
            <h3 style={{
              fontSize: 16, fontWeight: 800, color: 'var(--mk-text)',
              fontFamily: 'Geist, sans-serif', letterSpacing: '-0.02em',
            }}>
              {tx(UI.header, lang)}
            </h3>
          </div>
          {completedChallenges.length > 0 && (
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
                borderRadius: 999, padding: '4px 10px',
              }}
            >
              <span style={{ fontSize: 11 }}>🏆</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#D97706', fontFamily: 'Geist, sans-serif' }}>
                {completedChallenges.length} {tx(UI.completed, lang)}
              </span>
            </motion.div>
          )}
        </div>

        {/* ── Active challenges ────────────────────────────────────────── */}
        {activeChallenges.map((c, idx) => {
          const { daysLogged, totalSaved, pct, onTrack, remaining } = getChallengeProgress(c);
          const tpl = TEMPLATES.find(t => t.emoji === c.emoji) || TEMPLATES[0];
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              style={{
                background: 'var(--mk-card)',
                border: `1.5px solid ${tpl.accent}40`,
                borderRadius: 20,
                overflow: 'hidden',
                position: 'relative',
                boxShadow: `0 4px 20px ${tpl.accent}14`,
              }}
            >
              {/* Accent top bar */}
              <div style={{ height: 3, background: `linear-gradient(90deg, ${tpl.accent}, ${tpl.accent}66)` }} />

              <div style={{ padding: '14px 16px 0', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12, fontSize: 20,
                      background: `${tpl.accent}14`, border: `1px solid ${tpl.accent}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {c.emoji}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--mk-text)', fontFamily: 'Geist, sans-serif', letterSpacing: '-0.01em', marginBottom: 2 }}>
                        {c.name}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, fontFamily: 'Geist, sans-serif',
                          color: onTrack ? '#00A875' : '#F97316',
                          background: onTrack ? 'rgba(0,168,117,0.1)' : 'rgba(249,115,22,0.1)',
                          padding: '2px 7px', borderRadius: 999,
                        }}>
                          {onTrack ? `✅ ${tx(UI.onTrack, lang)}` : `⚠️ ${tx(UI.behind, lang)}`}
                        </span>
                        <span style={{ fontSize: 10, color: 'var(--mk-text-secondary)', fontFamily: 'Geist, sans-serif' }}>
                          {remaining} {tx(UI.daysLeft, lang)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => { if (confirm(tx(UI.abandon, lang))) abandonChallenge(c.id); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'var(--mk-text-secondary)' }}
                  >
                    <Trash2 style={{ width: 14, height: 14 }} />
                  </button>
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, marginBottom: 10 }}>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--mk-text-secondary)', fontFamily: 'Geist, sans-serif', marginBottom: 2 }}>
                      {daysLogged}/{c.targetDays} {tx(UI.days, lang)}
                    </p>
                    <p style={{ fontSize: 18, fontWeight: 800, color: tpl.accent, fontFamily: 'Geist, sans-serif', letterSpacing: '-0.02em' }}>
                      {fmt(totalSaved)}
                    </p>
                    <p style={{ fontSize: 10, color: 'var(--mk-text-secondary)', fontFamily: 'Geist, sans-serif' }}>
                      {tx(UI.saved, lang)}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 28, fontWeight: 900, color: tpl.accent, fontFamily: 'Geist, sans-serif', letterSpacing: '-0.03em', lineHeight: 1 }}>
                      {pct}<span style={{ fontSize: 14 }}>%</span>
                    </p>
                    <p style={{ fontSize: 10, color: 'var(--mk-text-secondary)', fontFamily: 'Geist, sans-serif' }}>
                      {lang === 'sw' ? 'imekamilika' : lang === 'fr' ? 'terminé' : lang === 'ar' ? 'مكتمل' : lang === 'pt' ? 'concluído' : 'complete'}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ height: 6, background: 'var(--mk-border)', borderRadius: 999, overflow: 'hidden', marginBottom: 14 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${tpl.accent}, ${tpl.accent}bb)` }}
                  />
                </div>
              </div>

              {/* Log row */}
              {logTarget === c.id ? (
                <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8 }}>
                  <div style={{
                    flex: 1, display: 'flex', alignItems: 'center',
                    border: `2px solid ${tpl.accent}`, borderRadius: 12, overflow: 'hidden',
                    background: 'var(--mk-bg)',
                  }}>
                    <span style={{ padding: '0 10px', fontSize: 12, color: 'var(--mk-text-secondary)', fontFamily: 'Geist, sans-serif' }}>{symbol}</span>
                    <input
                      type="number"
                      placeholder={c.dailyAmount.toString()}
                      value={logAmount}
                      onChange={e => setLogAmount(e.target.value)}
                      style={{ flex: 1, padding: '10px 0', fontSize: 14, fontWeight: 700, background: 'none', border: 'none', outline: 'none', color: 'var(--mk-text)', fontFamily: 'Geist, sans-serif' }}
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={() => handleLogDay(c.id)}
                    style={{ background: tpl.accent, border: 'none', borderRadius: 12, padding: '0 16px', cursor: 'pointer', fontSize: 16 }}
                  >
                    ✅
                  </button>
                  <button onClick={() => setLogTarget(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mk-text-secondary)', padding: '0 6px' }}>
                    <X style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              ) : (
                <div style={{ padding: '0 16px 16px' }}>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setLogTarget(c.id); setLogAmount(c.dailyAmount.toString()); }}
                    style={{
                      width: '100%', padding: '11px 0', border: `1.5px solid ${tpl.accent}40`,
                      borderRadius: 12, background: `${tpl.accent}10`,
                      color: tpl.accent, fontSize: 13, fontWeight: 700,
                      fontFamily: 'Geist, sans-serif', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <Plus style={{ width: 15, height: 15 }} />
                    {tx(UI.logToday, lang)} (+{fmt(c.dailyAmount)})
                  </motion.button>
                </div>
              )}
            </motion.div>
          );
        })}

        {/* ── Template cards — horizontal scroll ───────────────────────── */}
        {availableTemplates.length > 0 && (
          <div
            style={{
              display: 'flex', gap: 12,
              overflowX: 'auto', scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
              marginLeft: -20, paddingLeft: 20, paddingRight: 20, paddingBottom: 4,
            }}
          >
            {availableTemplates.map((tpl, i) => (
              <motion.button
                key={tpl.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, type: 'spring', stiffness: 260, damping: 26 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowStart(tpl)}
                style={{
                  minWidth: 220, maxWidth: 240, scrollSnapAlign: 'start', flexShrink: 0,
                  background: 'var(--mk-card)',
                  border: `1.5px solid ${tpl.accent}35`,
                  borderRadius: 20, padding: 18, textAlign: 'left', cursor: 'pointer',
                  position: 'relative', overflow: 'hidden',
                  boxShadow: `0 4px 20px ${tpl.accent}14, 0 1px 4px rgba(0,0,0,0.06)`,
                }}
              >
                {/* Accent top strip */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: `linear-gradient(90deg, ${tpl.accent}, ${tpl.accent}66)`,
                  pointerEvents: 'none',
                }} />

                {/* Emoji badge */}
                <div style={{
                  width: 48, height: 48, borderRadius: 14, fontSize: 24,
                  background: `${tpl.accent}12`, border: `1.5px solid ${tpl.accent}28`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 14, marginTop: 8, position: 'relative',
                }}>
                  {tpl.emoji}
                </div>

                {/* Days badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: `${tpl.accent}12`, border: `1px solid ${tpl.accent}25`,
                  borderRadius: 999, padding: '3px 8px', marginBottom: 8,
                }}>
                  <Flame style={{ width: 10, height: 10, color: tpl.accent }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: tpl.accent, fontFamily: 'Geist, sans-serif' }}>
                    {tpl.targetDays} {tx(UI.days, lang)}
                  </span>
                </div>

                {/* Name */}
                <p style={{
                  fontSize: 14, fontWeight: 800, color: 'var(--mk-text)',
                  fontFamily: 'Geist, sans-serif', letterSpacing: '-0.02em',
                  lineHeight: 1.2, marginBottom: 6,
                }}>
                  {tx(tpl.name, lang)}
                </p>

                {/* Desc */}
                <p style={{
                  fontSize: 11, color: 'var(--mk-text-secondary)',
                  fontFamily: 'Geist, sans-serif', lineHeight: 1.5, marginBottom: 16,
                }}>
                  {tx(tpl.desc, lang)}
                </p>

                {/* Community ring row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <CommunityRing pct={tpl.communityPct} color={tpl.accent} />
                  <span style={{ fontSize: 11, color: 'var(--mk-text-secondary)', fontFamily: 'Geist, sans-serif', lineHeight: 1.4 }}>
                    {tx(UI.succeed, lang)}
                  </span>
                </div>

                {/* CTA */}
                <div style={{
                  background: 'linear-gradient(135deg, var(--mk-orange), var(--mk-red))',
                  borderRadius: 12, padding: '10px 0', textAlign: 'center',
                  color: '#fff', fontWeight: 700, fontSize: 13,
                  fontFamily: 'Geist, sans-serif', letterSpacing: '-0.01em',
                  boxShadow: `0 4px 16px rgba(var(--mk-orange-rgb),0.25)`,
                }}>
                  {tx(UI.start, lang)} →
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* ── Start challenge bottom sheet ──────────────────────────────── */}
      <AnimatePresence>
        {showStart && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50 }}
              onClick={() => setShowStart(null)}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
                background: 'var(--mk-card)', borderRadius: '28px 28px 0 0',
                padding: '8px 20px 36px', boxShadow: '0 -12px 48px rgba(0,0,0,0.3)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Handle */}
              <div style={{ width: 36, height: 4, background: 'var(--mk-border)', borderRadius: 999, margin: '0 auto 20px' }} />

              {/* Light hero header */}
              <div style={{
                background: 'var(--mk-bg)',
                border: `1.5px solid ${showStart.accent}35`,
                borderRadius: 20, padding: 20, marginBottom: 16, position: 'relative', overflow: 'hidden',
                boxShadow: `0 2px 16px ${showStart.accent}12`,
              }}>
                {/* Accent top bar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: `linear-gradient(90deg, ${showStart.accent}, ${showStart.accent}66)`,
                }} />
                <div style={{ fontSize: 36, marginBottom: 10, marginTop: 8 }}>{showStart.emoji}</div>
                <h2 style={{
                  fontSize: 20, fontWeight: 900, color: 'var(--mk-text)',
                  fontFamily: 'Geist, sans-serif', letterSpacing: '-0.03em', marginBottom: 4,
                }}>
                  {tx(showStart.name, lang)}
                </h2>
                <p style={{ fontSize: 13, color: 'var(--mk-text-secondary)', fontFamily: 'Geist, sans-serif', marginBottom: 14 }}>
                  {tx(showStart.desc, lang)}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 10, color: 'var(--mk-text-secondary)', fontFamily: 'Geist, sans-serif', marginBottom: 2 }}>
                      {tx(UI.days, lang)}
                    </p>
                    <p style={{ fontSize: 20, fontWeight: 900, color: showStart.accent, fontFamily: 'Geist, sans-serif', letterSpacing: '-0.02em' }}>
                      {showStart.targetDays}
                    </p>
                  </div>
                  <div style={{ width: 1, height: 32, background: 'var(--mk-border)' }} />
                  <div>
                    <p style={{ fontSize: 10, color: 'var(--mk-text-secondary)', fontFamily: 'Geist, sans-serif', marginBottom: 2 }}>
                      {tx(UI.goal, lang)}
                    </p>
                    <p style={{ fontSize: 20, fontWeight: 900, color: 'var(--mk-text)', fontFamily: 'Geist, sans-serif', letterSpacing: '-0.02em' }}>
                      {fmt(showStart.targetDays * showStart.dailyAmount)}
                    </p>
                  </div>
                  <div style={{ width: 1, height: 32, background: 'var(--mk-border)' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CommunityRing pct={showStart.communityPct} color={showStart.accent} />
                    <p style={{ fontSize: 10, color: 'var(--mk-text-secondary)', fontFamily: 'Geist, sans-serif', maxWidth: 60, lineHeight: 1.4 }}>
                      {tx(UI.succeed, lang)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Community strip */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--mk-bg-alt)', borderRadius: 14, padding: '10px 14px', marginBottom: 16,
              }}>
                <Users style={{ width: 16, height: 16, color: 'var(--mk-text-secondary)', flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: 'var(--mk-text-secondary)', fontFamily: 'Geist, sans-serif', lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 800, color: 'var(--mk-text)' }}>{showStart.communityPct}%</span>{' '}
                  {tx(UI.communityTxt, lang)}
                </p>
              </div>

              {/* Custom daily amount */}
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  fontSize: 10, fontWeight: 700, color: 'var(--mk-text-secondary)',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  fontFamily: 'Geist, sans-serif', display: 'block', marginBottom: 8,
                }}>
                  {tx(UI.dailyAmt, lang)}
                </label>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  border: '1.5px solid var(--mk-border)', borderRadius: 14,
                  overflow: 'hidden', background: 'var(--mk-bg)',
                }}>
                  <span style={{ padding: '0 12px', fontSize: 13, color: 'var(--mk-text-secondary)', fontFamily: 'Geist, sans-serif' }}>
                    {symbol}
                  </span>
                  <input
                    type="number"
                    placeholder={showStart.dailyAmount.toString()}
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    style={{
                      flex: 1, padding: '13px 0', fontSize: 15, fontWeight: 700,
                      background: 'none', border: 'none', outline: 'none',
                      color: 'var(--mk-text)', fontFamily: 'Geist, sans-serif',
                    }}
                  />
                </div>
                <p style={{ fontSize: 11, color: 'var(--mk-text-secondary)', fontFamily: 'Geist, sans-serif', marginTop: 6 }}>
                  {tx(UI.defaultAmt, lang)} {fmt(showStart.dailyAmount)}{tx(UI.daily, lang)}
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => { setShowStart(null); setCustomAmount(''); }}
                  style={{
                    flex: 1, padding: '14px 0', border: '1.5px solid var(--mk-border)',
                    borderRadius: 16, background: 'none', color: 'var(--mk-text-secondary)',
                    fontWeight: 600, fontSize: 14, fontFamily: 'Geist, sans-serif', cursor: 'pointer',
                  }}
                >
                  {tx(UI.cancel, lang)}
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleStart(showStart)}
                  style={{
                    flex: 2, padding: '14px 0', border: 'none', borderRadius: 16,
                    background: 'linear-gradient(135deg, var(--mk-orange), var(--mk-red))',
                    color: '#fff', fontWeight: 800, fontSize: 15,
                    fontFamily: 'Geist, sans-serif', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: '0 6px 20px rgba(var(--mk-orange-rgb),0.35)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  <Play style={{ width: 16, height: 16 }} />
                  {tx(UI.startNow, lang)}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
