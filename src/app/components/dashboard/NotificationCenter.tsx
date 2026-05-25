import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, AlertTriangle, CheckCircle, TrendingUp, Target, Flame, RefreshCw } from 'lucide-react';
import { useApp } from '@/app/App';
import { t } from '@/app/utils/translations';
import { formatCurrency } from '@/app/utils/currency';
import { detectRecurring } from '@/app/utils/recurringDetect';

/** Risk 2 — Notification System (in-app computed alerts) */

interface Alert {
  id: string;
  type: 'warning' | 'success' | 'info' | 'urgent';
  icon: typeof Bell;
  title: { sw: string; en: string };
  body: { sw: string; en: string };
  action?: { sw: string; en: string };
}

export function NotificationCenter() {
  const { state, dismissNotification } = useApp();
  const lang = state.language;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('maokoto:open-notifications', handler);
    return () => window.removeEventListener('maokoto:open-notifications', handler);
  }, []);

  const fmt = (n: number) => formatCurrency(n, state.region);

  const dismissed = state.dismissedNotifications ?? [];

  const alerts = useMemo<Alert[]>(() => {
    const list: Alert[] = [];
    const now = new Date();
    const today = now.toDateString();

    // ── 1: Over-budget categories ──
    const byCategory: Record<string, number> = {};
    state.transactions.filter(t => t.type === 'expense').forEach(t => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    });
    Object.entries(state.categoryBudgets).forEach(([cat, limit]) => {
      const spent = byCategory[cat] || 0;
      if (spent > limit) {
        list.push({
          id: `over-budget-${cat}`,
          type: 'urgent',
          icon: AlertTriangle,
          title: { sw: `${cat} — Bajeti Imezidiwa`, en: `${cat} — Budget Exceeded` },
          body: {
            sw: `Umetumia ${fmt(spent)} dhidi ya bajeti ya ${fmt(limit)}. Punguza matumizi.`,
            en: `Spent ${fmt(spent)} vs budget of ${fmt(limit)}. Reduce spending.`,
          },
        });
      } else if (spent > limit * 0.85) {
        list.push({
          id: `near-budget-${cat}`,
          type: 'warning',
          icon: AlertTriangle,
          title: { sw: `${cat} — Bajeti Karibu Kumalizika`, en: `${cat} — Budget Nearly Full` },
          body: {
            sw: `Umetumia ${Math.round((spent / limit) * 100)}% ya bajeti yako ya ${cat}.`,
            en: `You've used ${Math.round((spent / limit) * 100)}% of your ${cat} budget.`,
          },
        });
      }
    });

    // ── 2: Streak reminder (no tx today) ──
    const hasLoggedToday = state.transactions.some(t => t.date.toDateString() === today);
    if (state.streak > 0 && !hasLoggedToday) {
      list.push({
        id: 'streak-reminder',
        type: 'info',
        icon: Flame,
        title: { sw: `🔥 Mfululizo Wako wa ${state.streak} Siku Uko Hatarini!`, en: `🔥 Your ${state.streak}-day streak is at risk!` },
        body: {
          sw: 'Bado hujarekodi muamala leo. Rekodi sasa ili kuendelea.',
          en: "You haven't logged a transaction today. Log one to keep your streak.",
        },
        action: { sw: 'Rekodi Muamala', en: 'Log Transaction' },
      });
    }

    // ── 3: Goal milestones ──
    state.goals.forEach(goal => {
      const pct = Math.round((goal.current / goal.target) * 100);
      for (const milestone of [25, 50, 75]) {
        if (pct >= milestone && pct < milestone + 5) {
          list.push({
            id: `goal-milestone-${goal.id}-${milestone}`,
            type: 'success',
            icon: Target,
            title: { sw: `🎯 ${milestone}% ya "${goal.title}"`, en: `🎯 ${milestone}% of "${goal.title}"` },
            body: {
              sw: `Hongera! Umefika ${milestone}% ya lengo lako. Endelea!`,
              en: `Congrats! You've hit ${milestone}% of your goal. Keep going!`,
            },
          });
        }
      }
      if (goal.completed) {
        list.push({
          id: `goal-done-${goal.id}`,
          type: 'success',
          icon: CheckCircle,
          title: { sw: `🎉 Lengo Limefanikiwa!`, en: `🎉 Goal Completed!` },
          body: {
            sw: `"${goal.title}" imekamilika — ${fmt(goal.target)}. Hongera sana!`,
            en: `"${goal.title}" completed — ${fmt(goal.target)}. Incredible work!`,
          },
        });
      }
    });

    // ── 4: Weekly report (on Mondays) ──
    if (now.getDay() === 1) { // Monday
      const weekStart = new Date(now); weekStart.setDate(now.getDate() - 7); weekStart.setHours(0, 0, 0, 0);
      const lastWeekExpenses = state.transactions
        .filter(t => t.type === 'expense' && t.date >= weekStart)
        .reduce((s, t) => s + t.amount, 0);
      if (lastWeekExpenses > 0) {
        list.push({
          id: `weekly-report-${now.toISOString().split('T')[0]}`,
          type: 'info',
          icon: TrendingUp,
          title: { sw: '📋 Ripoti ya Wiki — Tayari', en: '📋 Weekly Report — Ready' },
          body: {
            sw: `Wiki iliyopita ulitumia ${fmt(lastWeekExpenses)}. Angalia maarifa.`,
            en: `Last week you spent ${fmt(lastWeekExpenses)}. Check your insights.`,
          },
          action: { sw: 'Ona Maarifa', en: 'View Insights' },
        });
      }
    }

    // ── 5: Low balance warning ──
    const totalBalance = state.cashBalance + state.mobileMoneyBalance + state.bankBalance;
    const avgDaily = byCategory['Chakula'] || byCategory['Food']
      ? (byCategory['Chakula'] || byCategory['Food']) / 30
      : 5000;
    if (totalBalance > 0 && totalBalance < avgDaily * 3) {
      list.push({
        id: 'low-balance',
        type: 'urgent',
        icon: AlertTriangle,
        title: { sw: '⚠️ Bakaa Ndogo — Tahadhari', en: '⚠️ Low Balance — Warning' },
        body: {
          sw: `Bakaa yako ya ${fmt(totalBalance)} inaweza kukwisha hivi karibuni.`,
          en: `Your balance of ${fmt(totalBalance)} may run out soon.`,
        },
      });
    }

    // ── 6: Subscription / recurring bill due soon ──
    const upcomingBills = detectRecurring(state.transactions).filter(r => r.daysUntil >= 0 && r.daysUntil <= 7);
    upcomingBills.forEach(bill => {
      const label = bill.daysUntil === 0
        ? (lang === 'sw' ? 'Leo' : 'Today')
        : (lang === 'sw' ? `Siku ${bill.daysUntil}` : `${bill.daysUntil} day${bill.daysUntil === 1 ? '' : 's'}`);
      list.push({
        id: `bill-due-${bill.category}-${bill.nextDue.toISOString().split('T')[0]}`,
        type: bill.daysUntil <= 3 ? 'urgent' : 'warning',
        icon: RefreshCw,
        title: {
          sw: `${bill.category} — Inakuja (${label})`,
          en: `${bill.category} — Due ${label === 'Today' ? 'Today' : `in ${label}`}`,
        },
        body: {
          sw: `Malipo ya kawaida ya ~${fmt(bill.avgAmount)} inatarajiwa ${bill.daysUntil === 0 ? 'leo' : `ndani ya siku ${bill.daysUntil}`}.`,
          en: `Your regular ~${fmt(bill.avgAmount)} payment is expected ${bill.daysUntil === 0 ? 'today' : `in ${bill.daysUntil} day${bill.daysUntil === 1 ? '' : 's'}`}.`,
        },
      });
    });

    return list.filter(a => !dismissed.includes(a.id));
  }, [state, dismissed]);

  const unreadCount = alerts.length;

  const typeConfig = {
    urgent:  { bg: 'rgba(255,61,61,0.08)',   border: 'rgba(255,61,61,0.2)',   iconColor: '#FF3D3D' },
    warning: { bg: 'rgba(255,107,0,0.08)',   border: 'rgba(255,107,0,0.2)',   iconColor: '#FF6B00' },
    success: { bg: 'rgba(0,229,160,0.08)',   border: 'rgba(0,229,160,0.2)',   iconColor: '#00E5A0' },
    info:    { bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)', iconColor: '#A78BFA' },
  };

  return (
    <>
      {/* Notification sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#141414', border: '1px solid #2A2A2E', borderBottom: 'none', borderRadius: '24px 24px 0 0', zIndex: 50, maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Handle */}
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4, flexShrink: 0 }}>
                <div style={{ width: 40, height: 4, borderRadius: 999, background: '#2A2A2E' }} />
              </div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 14px', borderBottom: '1px solid #2A2A2E', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Bell size={18} color="#FFFFFF" />
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', fontFamily: 'Geist, sans-serif' }}>
                    {t('notifications', lang)}
                  </h2>
                  {unreadCount > 0 && (
                    <span style={{ background: '#FF3D3D', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 700, fontFamily: 'Geist, sans-serif', boxShadow: '0 0 8px rgba(255,61,61,0.4)' }}>{unreadCount}</span>
                  )}
                </div>
                <button onClick={() => setOpen(false)} style={{ width: 30, height: 30, borderRadius: '50%', background: '#1C1C1E', border: '1px solid #2A2A2E', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={14} color="#FFFFFF" />
                </button>
              </div>

              {/* Alerts list */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {alerts.length === 0 ? (
                  <div style={{ padding: '48px 0', textAlign: 'center' }}>
                    <CheckCircle size={48} color="#2A2A2E" style={{ margin: '0 auto 12px' }} />
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#6B7280', fontFamily: 'Geist, sans-serif' }}>
                      {t('noNotifications', lang)}
                    </p>
                    <p style={{ fontSize: 12, color: '#4B5563', marginTop: 4, fontFamily: 'Geist, sans-serif' }}>
                      {t('allCaughtUp', lang)}
                    </p>
                  </div>
                ) : (
                  alerts.map((alert, i) => {
                    const cfg = typeConfig[alert.type];
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12, borderRadius: 16, border: `1px solid ${cfg.border}`, background: cfg.bg }}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <alert.icon size={16} color={cfg.iconColor} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF', fontFamily: 'Geist, sans-serif' }}>{alert.title[lang]}</p>
                          <p style={{ fontSize: 12, color: '#6B7280', marginTop: 2, lineHeight: 1.5, fontFamily: 'Geist, sans-serif' }}>{alert.body[lang]}</p>
                          {alert.action && (
                            <button style={{ marginTop: 6, fontSize: 11, fontWeight: 700, color: cfg.iconColor, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Geist, sans-serif' }}>
                              {alert.action[lang]} →
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => dismissNotification(alert.id)}
                          style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <X size={12} color="#4B5563" />
                        </button>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {alerts.length > 0 && (
                <div style={{ padding: '8px 16px 24px', flexShrink: 0 }}>
                  <button
                    onClick={() => { alerts.forEach(a => dismissNotification(a.id)); setOpen(false); }}
                    style={{ width: '100%', padding: '12px 0', fontSize: 13, color: '#6B7280', background: '#1C1C1E', border: '1.5px solid #2A2A2E', borderRadius: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'Geist, sans-serif' }}
                  >
                    {t('dismissAll', lang)}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}