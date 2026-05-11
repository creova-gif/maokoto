import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Check } from 'lucide-react';
import { useApp, type Language, type UserType, type IncomeFrequency } from '@/app/App';
import { REGION_CONFIG, type Region } from '@/app/utils/currency';

interface OnboardingFlowProps {
  onComplete: () => void;
}

// ── Progress bar ───────────────────────────────────────────────────────────
function ProgressBar({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-1.5 items-center flex-1">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="h-[3px] rounded-full flex-1"
          animate={{ backgroundColor: i <= current ? '#FD8240' : '#F4F4F2' }}
          transition={{ duration: 0.25 }}
        />
      ))}
    </div>
  );
}

// ── Slide variants ─────────────────────────────────────────────────────────
const SLIDE_VARIANTS = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

// ── Card style helpers ─────────────────────────────────────────────────────
const cardBase = 'relative overflow-hidden rounded-2xl text-left transition-all duration-200 cursor-pointer';
const cardIdle = 'bg-white border border-[#F4F4F2]';
const cardOn   = 'bg-white border-2 border-[#FD8240]';

// ── App icon ───────────────────────────────────────────────────────────────
function AppIcon() {
  return (
    <div
      style={{
        width: 80,
        height: 80,
        borderRadius: 24,
        background: '#4E886F',
        boxShadow: '0 20px 50px rgba(78,136,111,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M20 8C13.373 8 8 13.373 8 20s5.373 12 12 12 12-5.373 12-12S26.627 8 20 8z" stroke="white" strokeWidth="2.2" />
        <path d="M20 14v6l4 2" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 28h10" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 28v4" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ── Step 0: Welcome ────────────────────────────────────────────────────────
function WelcomeStep({ onNext, lang }: { onNext: () => void; lang: Language }) {
  const features = [
    {
      icon: '📲',
      en: 'M-Pesa · Airtel · Tigo',    subEn: 'All mobile money supported',
      sw: 'M-Pesa · Airtel · Tigo',    subSw: 'Pesa za simu zote',
    },
    {
      icon: '📊',
      en: 'AI budgeting',              subEn: 'Smart spending insights',
      sw: 'Bajeti ya AI',              subSw: 'Akili bandia inakusaidia',
    },
    {
      icon: '🔒',
      en: '100% private',              subEn: 'Data stays on your device',
      sw: 'Faragha kamili',            subSw: 'Data kwenye simu yako tu',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '64px 24px 40px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.05 }}
          style={{ marginBottom: 24 }}
        >
          <AppIcon />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: '#4D4845',
            fontFamily: 'Geist, sans-serif',
            textAlign: 'center',
            marginBottom: 8,
            letterSpacing: '-0.02em',
          }}
        >
          Maokoto
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            color: '#928F8B',
            fontSize: 15,
            textAlign: 'center',
            marginBottom: 36,
            fontFamily: 'Geist, sans-serif',
            maxWidth: 240,
            lineHeight: 1.5,
          }}
        >
          {lang === 'sw' ? 'Dhibiti pesa zako, usiogope' : 'Control your money, without fear'}
        </motion.p>

        <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {features.map((f, i) => (
            <motion.div
              key={f.en}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.1, type: 'spring', stiffness: 300, damping: 26 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 14,
                background: '#F6F6F4',
                border: '1px solid #F4F4F2',
              }}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>{f.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#4D4845', fontFamily: 'Geist, sans-serif' }}>
                  {lang === 'sw' ? f.sw : f.en}
                </p>
                <p style={{ fontSize: 12, color: '#928F8B', fontFamily: 'Geist, sans-serif', marginTop: 2 }}>
                  {lang === 'sw' ? f.subSw : f.subEn}
                </p>
              </div>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'rgba(78,136,111,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Check style={{ width: 12, height: 12, color: '#4E886F' }} strokeWidth={2.5} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 340, margin: '32px auto 0' }}>
        <motion.button
          onClick={onNext}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%',
            background: '#FD8240',
            color: '#fff',
            borderRadius: 999,
            padding: '16px 0',
            fontWeight: 600,
            fontSize: 16,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Geist, sans-serif',
          }}
        >
          {lang === 'sw' ? 'Anza Sasa' : 'Get Started'}
        </motion.button>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{ color: '#928F8B', textAlign: 'center', fontSize: 12, marginTop: 12, fontFamily: 'Geist, sans-serif' }}
        >
          {lang === 'sw' ? 'Bila malipo · Bila matangazo · Bila mtandao' : 'Free · No ads · Works offline'}
        </motion.p>
      </div>
    </div>
  );
}

// ── Step 1: Language ───────────────────────────────────────────────────────
function LanguageStep({ onPick }: { onPick: (l: Language) => void }) {
  const [picked, setPicked] = useState<Language | null>(null);
  const handle = (l: Language) => {
    setPicked(l);
    if (navigator.vibrate) navigator.vibrate(15);
    setTimeout(() => onPick(l), 320);
  };

  const options = [
    { code: 'sw' as Language, name: 'Kiswahili', flag: '🇹🇿', sub: 'Lugha ya kwanza ya Afrika Mashariki' },
    { code: 'en' as Language, name: 'English',   flag: '🇬🇧', sub: 'International language' },
    { code: 'fr' as Language, name: 'Français',  flag: '🇫🇷', sub: 'Pour les francophones' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '0 24px' }}>
      <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        style={{ color: '#928F8B', fontSize: 14, textAlign: 'center', marginBottom: 8, fontFamily: 'Geist, sans-serif' }}>
        Choose your language
      </motion.p>
      <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        style={{ fontSize: 28, fontWeight: 700, color: '#4D4845', textAlign: 'center', marginBottom: 28, fontFamily: 'Geist, sans-serif' }}>
        Habari? / Hello!
      </motion.h2>

      <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {options.map((l, i) => {
          const isSelected = picked === l.code;
          return (
            <motion.button
              key={l.code}
              onClick={() => handle(l.code)}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              whileTap={{ scale: 0.98 }}
              className={`${cardBase} ${isSelected ? cardOn : cardIdle}`}
              style={{ width: '100%', minHeight: 80 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                <span style={{ fontSize: 32, flexShrink: 0 }}>{l.flag}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 17, fontWeight: 600, color: '#4D4845', fontFamily: 'Geist, sans-serif' }}>{l.name}</p>
                  <p style={{ fontSize: 12, color: '#928F8B', marginTop: 2, fontFamily: 'Geist, sans-serif' }}>{l.sub}</p>
                </div>
                <AnimatePresence>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      style={{ width: 24, height: 24, borderRadius: '50%', background: '#FD8240', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check style={{ width: 13, height: 13, color: '#fff' }} strokeWidth={2.5} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 2: Name ───────────────────────────────────────────────────────────
function NameStep({ onNext, lang, initialName }: { onNext: (name: string) => void; lang: Language; initialName: string }) {
  const [name, setName] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 400); }, []);
  const displayName = name.trim() || (lang === 'sw' ? 'Rafiki' : 'Friend');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', padding: '40px 24px 24px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: 340 }}>
        <motion.div
          animate={{ rotate: [0, 15, -10, 15, 0] }}
          transition={{ delay: 0.2, duration: 1.2 }}
          style={{ fontSize: 48, marginBottom: 24 }}
        >
          👋
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 28, fontWeight: 700, color: '#4D4845', textAlign: 'center', marginBottom: 6, fontFamily: 'Geist, sans-serif' }}>
          {lang === 'sw' ? 'Jina lako ni nani?' : "What's your name?"}
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          style={{ color: '#928F8B', fontSize: 14, textAlign: 'center', marginBottom: 28, fontFamily: 'Geist, sans-serif' }}>
          {lang === 'sw' ? 'Tunataka kukusalimu vizuri' : "We'd love to greet you personally"}
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.p key={displayName}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            style={{ fontSize: 20, fontWeight: 600, color: '#4E886F', marginBottom: 24, textAlign: 'center', fontFamily: 'Geist, sans-serif' }}>
            {lang === 'sw' ? `Karibu, ${displayName}!` : `Hi, ${displayName}!`}
          </motion.p>
        </AnimatePresence>

        <motion.input
          ref={inputRef}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          type="text" value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && name.trim()) onNext(name.trim()); }}
          maxLength={30}
          placeholder={lang === 'sw' ? 'Andika jina lako...' : 'Type your name...'}
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 600,
            background: '#F6F6F4',
            border: '1.5px solid #F4F4F2',
            color: '#4D4845',
            borderRadius: 16,
            padding: '14px 20px',
            outline: 'none',
            fontFamily: 'Geist, sans-serif',
            boxSizing: 'border-box',
          }}
          onFocus={e => (e.target.style.borderColor = '#FD8240')}
          onBlur={e => (e.target.style.borderColor = '#F4F4F2')}
        />
        <p style={{ color: '#928F8B', fontSize: 12, marginTop: 8, textAlign: 'center', fontFamily: 'Geist, sans-serif' }}>
          {lang === 'sw' ? 'Au bonyeza Endelea bila jina' : 'Or continue without a name'}
        </p>
      </div>

      <motion.button
        onClick={() => onNext(name.trim())}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.97 }}
        style={{
          width: '100%',
          maxWidth: 340,
          background: '#FD8240',
          color: '#fff',
          borderRadius: 999,
          padding: '16px 0',
          fontWeight: 600,
          fontSize: 16,
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Geist, sans-serif',
        }}>
        {lang === 'sw' ? 'Endelea' : 'Continue'}
      </motion.button>
    </div>
  );
}

// ── Step 3: Region ─────────────────────────────────────────────────────────
const REGIONS: { code: Region }[] = [
  { code: 'TZ' }, { code: 'KE' }, { code: 'UG' }, { code: 'RW' }, { code: 'BI' },
];

function RegionStep({ onPick, lang }: { onPick: (r: Region) => void; lang: Language }) {
  const [picked, setPicked] = useState<Region | null>(null);
  const handle = (code: Region) => {
    setPicked(code);
    if (navigator.vibrate) navigator.vibrate(15);
    setTimeout(() => onPick(code), 320);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', padding: '32px 24px 24px' }}>
      <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 28, fontWeight: 700, color: '#4D4845', textAlign: 'center', marginBottom: 6, fontFamily: 'Geist, sans-serif' }}>
        {lang === 'sw' ? 'Uko wapi?' : 'Where are you?'}
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{ color: '#928F8B', fontSize: 14, textAlign: 'center', marginBottom: 24, fontFamily: 'Geist, sans-serif' }}>
        {lang === 'sw' ? 'Tutapanga sarafu sahihi kwa nchi yako' : "We'll set the right currency for your country"}
      </motion.p>

      <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {REGIONS.map(({ code }, i) => {
          const cfg = REGION_CONFIG[code];
          const isSelected = picked === code;
          return (
            <motion.button key={code} onClick={() => handle(code)}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }} whileTap={{ scale: 0.98 }}
              className={`${cardBase} ${isSelected ? cardOn : cardIdle}`}
              style={{ width: '100%', minHeight: 64 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px' }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{cfg.flag}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 500, color: '#4D4845', fontFamily: 'Geist, sans-serif' }}>{lang === 'sw' ? cfg.nameSw : cfg.nameEn}</p>
                  <p style={{ fontSize: 12, color: '#928F8B', fontFamily: 'Geist, sans-serif' }}>{cfg.currency} · {cfg.symbol}</p>
                </div>
                <AnimatePresence>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      style={{ width: 20, height: 20, borderRadius: '50%', background: '#FD8240', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check style={{ width: 11, height: 11, color: '#fff' }} strokeWidth={2.5} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 4: User Type ──────────────────────────────────────────────────────
type UserTypeConfig = {
  type: UserType; emoji: string;
  en: string; sw: string; subEn: string; subSw: string;
};
const USER_TYPES: UserTypeConfig[] = [
  { type: 'student',  emoji: '🎓', en: 'Student / Youth',   sw: 'Mwanafunzi / Kijana',   subEn: 'Stipends & school fees',   subSw: 'Posho na ada za shule' },
  { type: 'biashara', emoji: '🏪', en: 'Business owner',    sw: 'Mmiliki wa Biashara',   subEn: 'Business cash flow',       subSw: 'Mzunguko wa pesa biashara' },
  { type: 'informal', emoji: '🔧', en: 'Informal worker',   sw: 'Mfanyakazi wa Kawaida', subEn: 'Daily wages & gigs',       subSw: 'Mishahara ya kila siku' },
  { type: 'family',   emoji: '🏠', en: 'Family planner',    sw: 'Mpangaji wa Familia',   subEn: 'Household budget',         subSw: 'Bajeti ya familia' },
  { type: 'other',    emoji: '✨', en: 'Other',             sw: 'Nyingine',              subEn: 'Custom tracking',          subSw: 'Ufuatiliaji maalum' },
];

function UserTypeStep({ onPick, lang }: { onPick: (t: UserType) => void; lang: Language }) {
  const [picked, setPicked] = useState<UserType | null>(null);
  const handle = (type: UserType) => {
    setPicked(type);
    if (navigator.vibrate) navigator.vibrate(15);
    setTimeout(() => onPick(type), 340);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', padding: '32px 24px 24px' }}>
      <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 28, fontWeight: 700, color: '#4D4845', textAlign: 'center', marginBottom: 6, fontFamily: 'Geist, sans-serif' }}>
        {lang === 'sw' ? 'Nani wewe?' : 'Who are you?'}
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{ color: '#928F8B', fontSize: 14, textAlign: 'center', marginBottom: 24, fontFamily: 'Geist, sans-serif' }}>
        {lang === 'sw' ? 'Tunaboresha uzoefu wako' : 'We personalise your experience'}
      </motion.p>

      <div style={{ width: '100%', maxWidth: 340, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {USER_TYPES.map(({ type, emoji, en, sw: sw_, subEn, subSw }, i) => {
          const isLast = i === USER_TYPES.length - 1;
          const isSelected = picked === type;
          return (
            <motion.button key={type} onClick={() => handle(type)}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.06 }} whileTap={{ scale: 0.96 }}
              className={`${cardBase} ${isLast ? 'col-span-2' : ''} ${isSelected ? cardOn : cardIdle}`}
              style={{ minHeight: isLast ? 64 : 100 }}>
              <div style={{
                display: 'flex',
                flexDirection: isLast ? 'row' : 'column',
                alignItems: isLast ? 'center' : 'flex-start',
                gap: isLast ? 12 : 8,
                padding: 16,
                height: '100%',
                position: 'relative',
              }}>
                <span style={{ fontSize: isLast ? 22 : 24 }}>{emoji}</span>
                <div style={{ flex: isLast ? 1 : undefined, marginTop: isLast ? 0 : 'auto' }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#4D4845', fontFamily: 'Geist, sans-serif' }}>
                    {lang === 'sw' ? sw_ : en}
                  </p>
                  <p style={{ fontSize: 11, color: '#928F8B', marginTop: 2, fontFamily: 'Geist, sans-serif' }}>
                    {lang === 'sw' ? subSw : subEn}
                  </p>
                </div>
                <AnimatePresence>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      style={{ position: 'absolute', top: 10, right: 10, width: 18, height: 18, borderRadius: '50%', background: '#FD8240', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check style={{ width: 10, height: 10, color: '#fff' }} strokeWidth={2.5} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 5: Income Frequency ───────────────────────────────────────────────
type FreqConfig = {
  freq: IncomeFrequency; emoji: string;
  en: string; sw: string; subEn: string; subSw: string; tagEn: string; tagSw: string;
};
const FREQS: FreqConfig[] = [
  { freq: 'daily',     emoji: '☀️', en: 'Daily income',    sw: 'Mapato ya kila siku',    subEn: 'Market traders · hawkers',   subSw: 'Wachuuzi · mafundi',      tagEn: 'Every day',   tagSw: 'Kila siku' },
  { freq: 'weekly',    emoji: '📅', en: 'Weekly income',   sw: 'Mapato ya kila wiki',    subEn: 'Casual workers · drivers',   subSw: 'Wafanyakazi wa muda',      tagEn: 'Every week',  tagSw: 'Kila wiki' },
  { freq: 'monthly',   emoji: '💼', en: 'Monthly salary',  sw: 'Mshahara wa kila mwezi', subEn: 'Employed · salaried',        subSw: 'Wafanyakazi wa kudumu',    tagEn: 'Every month', tagSw: 'Kila mwezi' },
  { freq: 'irregular', emoji: '🔀', en: 'Irregular (mix)', sw: 'Mchanganyiko',           subEn: 'Freelancers · farmers',      subSw: 'Wakulima · kazi za muda',  tagEn: 'Varies',      tagSw: 'Hutofautiana' },
];

function IncomeStep({ onPick, lang }: { onPick: (f: IncomeFrequency) => void; lang: Language }) {
  const [picked, setPicked] = useState<IncomeFrequency | null>(null);
  const handle = (freq: IncomeFrequency) => {
    setPicked(freq);
    if (navigator.vibrate) navigator.vibrate(15);
    setTimeout(() => onPick(freq), 340);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', padding: '32px 24px 24px' }}>
      <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 28, fontWeight: 700, color: '#4D4845', textAlign: 'center', marginBottom: 6, fontFamily: 'Geist, sans-serif' }}>
        {lang === 'sw' ? 'Unapata pesa vipi?' : 'How do you earn?'}
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{ color: '#928F8B', fontSize: 14, textAlign: 'center', marginBottom: 24, fontFamily: 'Geist, sans-serif' }}>
        {lang === 'sw' ? 'Hii inasaidia kutabiri mwenendo wa pesa' : 'Helps us forecast your cash flow'}
      </motion.p>

      <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {FREQS.map(({ freq, emoji, en, sw: sw_, subEn, subSw, tagEn, tagSw }, i) => {
          const isSelected = picked === freq;
          return (
            <motion.button key={freq} onClick={() => handle(freq)}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }} whileTap={{ scale: 0.98 }}
              className={`${cardBase} ${isSelected ? cardOn : cardIdle}`}
              style={{ width: '100%', minHeight: 72 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#4D4845', fontFamily: 'Geist, sans-serif' }}>
                    {lang === 'sw' ? sw_ : en}
                  </p>
                  <p style={{ fontSize: 12, color: '#928F8B', marginTop: 2, fontFamily: 'Geist, sans-serif' }}>
                    {lang === 'sw' ? subSw : subEn}
                  </p>
                </div>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 500,
                  flexShrink: 0,
                  background: isSelected ? 'rgba(253,130,64,0.12)' : '#F6F6F4',
                  color: isSelected ? '#FD8240' : '#928F8B',
                  fontFamily: 'Geist, sans-serif',
                }}>
                  {lang === 'sw' ? tagSw : tagEn}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 6: Goal Setup ─────────────────────────────────────────────────────
type GoalOption = { id: string; emoji: string; en: string; sw: string };
const GOAL_OPTIONS: GoalOption[] = [
  { id: 'schoolFees',    emoji: '🎓', en: 'School fees',    sw: 'Ada za shule' },
  { id: 'bills',         emoji: '💡', en: 'Bills & rent',   sw: 'Bili na kodi' },
  { id: 'emergencyFund', emoji: '🛡️', en: 'Emergency fund', sw: 'Akiba ya dharura' },
  { id: 'data',          emoji: '📱', en: 'Data & airtime', sw: 'Data na muda' },
  { id: 'travel',        emoji: '✈️', en: 'Travel savings', sw: 'Akiba ya safari' },
  { id: 'custom',        emoji: '⭐', en: 'My own goal',    sw: 'Lengo langu' },
];
const GOAL_DEFAULTS: Record<string, Record<string, number>> = {
  TZ: { schoolFees: 500000, bills: 200000, emergencyFund: 300000, data: 50000, travel: 1000000 },
  KE: { schoolFees: 15000,  bills: 8000,   emergencyFund: 10000,  data: 1500,  travel: 30000 },
  UG: { schoolFees: 800000, bills: 300000, emergencyFund: 500000, data: 80000, travel: 1500000 },
  RW: { schoolFees: 100000, bills: 50000,  emergencyFund: 75000,  data: 10000, travel: 200000 },
  BI: { schoolFees: 200000, bills: 80000,  emergencyFund: 120000, data: 15000, travel: 400000 },
};

function GoalStep({ onDone, lang, region }: { onDone: (title: string, amount: number) => void; lang: Language; region: Region }) {
  const [goalId, setGoalId] = useState('');
  const [customName, setCustomName] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const cfg = REGION_CONFIG[region];
  const defaults = GOAL_DEFAULTS[region] ?? GOAL_DEFAULTS.TZ;
  const selectedGoal = GOAL_OPTIONS.find(g => g.id === goalId);

  const handlePick = (id: string) => {
    setGoalId(id);
    setError('');
    if (navigator.vibrate) navigator.vibrate(15);
    if (id !== 'custom' && defaults[id]) setAmount(String(defaults[id]));
    else if (id === 'custom') setAmount('');
  };

  const handleSubmit = () => {
    const num = parseInt(amount);
    if (!goalId) { setError(lang === 'sw' ? 'Chagua lengo kwanza' : 'Please pick a goal first'); return; }
    if (!amount || isNaN(num) || num < 100) { setError(lang === 'sw' ? `Ingiza kiasi (angalau ${cfg.symbol} 100)` : `Enter an amount (min ${cfg.symbol} 100)`); return; }
    if (num > 999_999_999) { setError(lang === 'sw' ? 'Kiasi kikubwa sana' : 'Amount too large'); return; }
    const title = goalId === 'custom'
      ? (customName.trim() || (lang === 'sw' ? 'Lengo Langu' : 'My Goal'))
      : (lang === 'sw' ? selectedGoal!.sw : selectedGoal!.en);
    onDone(title, num);
  };

  const fmt = (n: number) => `${cfg.symbol} ${n.toLocaleString()}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', padding: '32px 24px 24px' }}>
      <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 28, fontWeight: 700, color: '#4D4845', textAlign: 'center', marginBottom: 6, fontFamily: 'Geist, sans-serif' }}>
        {lang === 'sw' ? 'Lengo lako la kwanza' : 'Your first goal'}
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{ color: '#928F8B', fontSize: 14, textAlign: 'center', marginBottom: 20, fontFamily: 'Geist, sans-serif' }}>
        {lang === 'sw' ? 'Tuanze safari ya kuokoa!' : "Let's start your savings journey!"}
      </motion.p>

      <div style={{ width: '100%', maxWidth: 340, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
        {GOAL_OPTIONS.map(({ id, emoji, en, sw: sw_ }, i) => {
          const isSelected = goalId === id;
          return (
            <motion.button key={id} onClick={() => handlePick(id)}
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 + i * 0.05 }} whileTap={{ scale: 0.94 }}
              className={`${cardBase} ${isSelected ? cardOn : cardIdle}`}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 8px', gap: 6, minHeight: 80, position: 'relative' }}>
              <span style={{ fontSize: 22 }}>{emoji}</span>
              <p style={{ fontSize: 10, fontWeight: 500, color: isSelected ? '#FD8240' : '#928F8B', textAlign: 'center', fontFamily: 'Geist, sans-serif', lineHeight: 1.3 }}>
                {lang === 'sw' ? sw_ : en}
              </p>
              <AnimatePresence>
                {isSelected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    style={{ position: 'absolute', top: 6, right: 6, width: 14, height: 14, borderRadius: '50%', background: '#FD8240', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check style={{ width: 8, height: 8, color: '#fff' }} strokeWidth={2.5} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      <div style={{ width: '100%', maxWidth: 340 }}>
        <AnimatePresence>
          {goalId && (
            <motion.div
              initial={{ opacity: 0, y: 16, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 30 }}
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
              {goalId === 'custom' && (
                <input type="text" value={customName} onChange={e => setCustomName(e.target.value)}
                  placeholder={lang === 'sw' ? 'Jina la lengo lako...' : 'Name your goal...'}
                  style={{
                    width: '100%',
                    background: '#F6F6F4',
                    border: '1.5px solid #F4F4F2',
                    color: '#4D4845',
                    borderRadius: 14,
                    padding: '12px 16px',
                    fontSize: 14,
                    outline: 'none',
                    fontFamily: 'Geist, sans-serif',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#FD8240')}
                  onBlur={e => (e.target.style.borderColor = '#F4F4F2')}
                />
              )}

              <div style={{ borderRadius: 14, padding: 16, background: '#F6F6F4', border: '1px solid #F4F4F2' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <p style={{ fontSize: 11, fontWeight: 500, color: '#928F8B', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Geist, sans-serif' }}>
                    {lang === 'sw' ? 'Kiasi cha lengo' : 'Target amount'}
                  </p>
                  {goalId !== 'custom' && defaults[goalId] && (
                    <span style={{ fontSize: 11, color: '#4E886F', fontFamily: 'Geist, sans-serif' }}>
                      {lang === 'sw' ? 'Pendekezo:' : 'Suggested:'} {fmt(defaults[goalId])}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#928F8B', fontSize: 16, fontWeight: 600, fontFamily: 'Geist, sans-serif' }}>{cfg.symbol}</span>
                  <input type="number" inputMode="numeric" value={amount}
                    onChange={e => { setAmount(e.target.value); setError(''); }}
                    placeholder="0"
                    style={{ flex: 1, background: 'transparent', color: '#4D4845', fontSize: 24, fontWeight: 700, outline: 'none', border: 'none', fontFamily: 'Geist, sans-serif' }}
                  />
                </div>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  style={{ color: '#C9362B', fontSize: 12, paddingLeft: 4, fontFamily: 'Geist, sans-serif' }}>
                  {error}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <motion.button onClick={handleSubmit} whileTap={{ scale: 0.97 }} disabled={!goalId}
            style={{
              width: '100%',
              background: goalId ? '#FD8240' : '#F4F4F2',
              color: goalId ? '#fff' : '#928F8B',
              borderRadius: 999,
              padding: '16px 0',
              fontWeight: 600,
              fontSize: 16,
              border: 'none',
              cursor: goalId ? 'pointer' : 'not-allowed',
              fontFamily: 'Geist, sans-serif',
              transition: 'all 0.2s',
            }}>
            {lang === 'sw' ? 'Anza Kuokoa' : 'Start Saving'}
          </motion.button>
          <button onClick={() => onDone(lang === 'sw' ? 'Lengo Langu' : 'My Goal', 10000)}
            style={{ background: 'none', border: 'none', color: '#928F8B', fontSize: 14, padding: '8px 0', cursor: 'pointer', fontFamily: 'Geist, sans-serif' }}>
            {lang === 'sw' ? 'Ruka kwa sasa' : 'Skip for now'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main OnboardingFlow ────────────────────────────────────────────────────
const TOTAL_STEPS = 6;

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { state, setLanguage, setRegion, setUserType, setIncomeFrequency, setFirstGoal, setUserName } = useApp();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [pendingName, setPendingName] = useState(state.userName);

  const go = (nextStep: number) => {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
  };

  const handleLang = (l: Language) => { setLanguage(l); go(2); };
  const handleName = (n: string) => { setPendingName(n); if (n) setUserName(n); go(3); };
  const handleRegion = (r: Region) => { setRegion(r); go(4); };
  const handleUserType = (ut: UserType) => { setUserType(ut); go(5); };
  const handleIncome = (f: IncomeFrequency) => { setIncomeFrequency(f); go(6); };
  const handleGoal = (title: string, amount: number) => {
    setFirstGoal({ id: '1', title, target: amount, current: 0, completed: false });
    onComplete();
  };

  const lang = state.language;
  const progressStep = Math.max(0, step - 1);
  const showBack = step > 0;
  const showProgress = step >= 1;

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        userSelect: 'none',
      }}
    >
      {/* Top bar: back + progress */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', minHeight: 56 }}>
        <div style={{ width: 40, flexShrink: 0 }}>
          {showBack && (
            <motion.button
              key="back"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => go(step - 1)}
              style={{
                padding: 8,
                background: '#F6F6F4',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronLeft style={{ width: 18, height: 18, color: '#4D4845' }} />
            </motion.button>
          )}
        </div>

        {showProgress && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1 }}>
            <ProgressBar total={TOTAL_STEPS} current={progressStep} />
          </motion.div>
        )}

        <div style={{ width: 40, flexShrink: 0 }} />
      </div>

      {/* Sliding content */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, overflow: 'hidden' }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={SLIDE_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}
          >
            {step === 0 && <WelcomeStep onNext={() => go(1)} lang={lang} />}
            {step === 1 && <LanguageStep onPick={handleLang} />}
            {step === 2 && <NameStep onNext={handleName} lang={lang} initialName={pendingName} />}
            {step === 3 && <RegionStep onPick={handleRegion} lang={lang} />}
            {step === 4 && <UserTypeStep onPick={handleUserType} lang={lang} />}
            {step === 5 && <IncomeStep onPick={handleIncome} lang={lang} />}
            {step === 6 && <GoalStep onDone={handleGoal} lang={lang} region={state.region} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
