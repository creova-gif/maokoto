import { motion } from 'motion/react';
import { useApp } from '@/app/App';
import { t } from '@/app/utils/translations';

interface SplashScreensProps {
  onComplete: () => void;
}

const features = [
  {
    icon: '📱',
    en: 'M-Pesa · Airtel · Tigo Pesa',
    sw: 'M-Pesa · Airtel · Tigo Pesa',
    label: { en: 'Mobile Money', sw: 'Pesa ya Simu' },
    accentRgb: 'var(--mk-orange-rgb)',
    accent: 'var(--mk-orange)',
  },
  {
    icon: '📊',
    en: 'Smart budget tracking',
    sw: 'Ufuatiliaji wa bajeti mahiri',
    label: { en: 'AI Budgeting', sw: 'Bajeti ya AI' },
    accentRgb: 'var(--mk-green-rgb)',
    accent: 'var(--mk-green)',
  },
  {
    icon: '🔒',
    en: 'Your data stays on your device',
    sw: 'Data yako inabaki kwenye kifaa chako',
    label: { en: '100% Private', sw: 'Faragha Kamili' },
    accentRgb: 'var(--mk-purple-rgb)',
    accent: 'var(--mk-purple)',
  },
];

export function SplashScreens({ onComplete }: SplashScreensProps) {
  const { state } = useApp();
  const lang = state.language;

  return (
    <div
      style={{
        height: '100vh',
        background: 'var(--mk-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        position: 'relative',
        padding: '0 24px',
      }}
    >
      {/* Subtle background accent */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'rgba(var(--mk-orange-rgb),0.06)',
          pointerEvents: 'none',
        }}
      />

      {/* Top section: Logo + Name */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 24,
        }}
      >
        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.4, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.2 }}
          style={{ marginBottom: 24 }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 26,
              background: 'linear-gradient(135deg, var(--mk-orange), var(--mk-red))',
              boxShadow: '0 20px 50px rgba(var(--mk-orange-rgb),0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <path d="M22 4 L25 19 L40 22 L25 25 L22 40 L19 25 L4 22 L19 19 Z" fill="white" fillOpacity="0.95" />
              <path d="M36 5 L37.5 11 L43 12.5 L37.5 14 L36 20 L34.5 14 L29 12.5 L34.5 11 Z" fill="white" fillOpacity="0.5" />
              <circle cx="8" cy="34" r="2.5" fill="white" fillOpacity="0.3" />
            </svg>
          </div>
        </motion.div>

        {/* App name */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 10 }}
        >
          <h1
            style={{
              fontSize: 44,
              fontWeight: 700,
              color: 'var(--mk-text)',
              fontFamily: 'Geist, sans-serif',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            Maokoto
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            color: 'var(--mk-text-secondary)',
            textAlign: 'center',
            marginBottom: 36,
            maxWidth: 260,
            lineHeight: 1.5,
            fontSize: 15,
            fontFamily: 'Geist, sans-serif',
          }}
        >
          {t('tagline', lang)}
        </motion.p>

        {/* Feature pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 }}>
          {features.map((f, i) => (
            <motion.div
              key={f.en}
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.75 + i * 0.14, type: 'spring', stiffness: 280, damping: 24 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 16px',
                borderRadius: 16,
                background: 'var(--mk-card)',
                border: '1px solid var(--mk-border)',
              }}
            >
              {/* Left accent */}
              <div style={{ width: 3, height: 32, borderRadius: 999, background: f.accent, flexShrink: 0 }} />

              {/* Icon */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: `rgba(var(--mk-${f.accent === 'var(--mk-orange)' ? 'orange' : f.accent === 'var(--mk-green)' ? 'green' : 'purple'}-rgb),0.12)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                {f.icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 10, color: 'var(--mk-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Geist, sans-serif', marginBottom: 2 }}>
                  {lang === 'sw' ? f.label.sw : f.label.en}
                </p>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--mk-text)', fontFamily: 'Geist, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lang === 'sw' ? f.sw : f.en}
                </p>
              </div>

              {/* Check */}
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: f.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom: CTA */}
      <div style={{ width: '100%', maxWidth: 360, paddingBottom: 48 }}>
        <motion.button
          onClick={onComplete}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, type: 'spring', stiffness: 240, damping: 22 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, var(--mk-orange), var(--mk-red))',
            color: '#FFFFFF',
            borderRadius: 999,
            padding: '18px 0',
            fontSize: 17,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Geist, sans-serif',
            boxShadow: '0 8px 24px rgba(var(--mk-orange-rgb),0.35)',
          }}
          aria-label={lang === 'sw' ? 'Endelea kuanza Maokoto' : 'Continue to start Maokoto'}
        >
          {t('continue', lang)} →
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          style={{ color: 'var(--mk-text-secondary)', textAlign: 'center', fontSize: 12, marginTop: 12, fontFamily: 'Geist, sans-serif' }}
        >
          {t('freeTagline', lang)}
        </motion.p>
      </div>
    </div>
  );
}
