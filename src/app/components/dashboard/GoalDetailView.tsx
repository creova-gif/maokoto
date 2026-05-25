import { useState } from 'react';
import { ArrowLeft, Calendar, Repeat, Target, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '@/app/App';
import { formatCurrency } from '@/app/utils/currency';
import type { Goal } from '@/app/App';

interface Props {
  goal: Goal;
  onBack: () => void;
}

export function GoalDetailView({ goal, onBack }: Props) {
  const { state, updateGoal, deleteGoal } = useApp();
  const { language: lang } = state;
  const fmt = (n: number) => formatCurrency(n, state.region);

  const [fundAmount, setFundAmount] = useState('');
  const [showFund, setShowFund] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [recurringAmount, setRecurringAmount] = useState('');

  const pct = Math.min((goal.current / goal.target) * 100, 100);
  const remaining = Math.max(goal.target - goal.current, 0);

  function handleFund() {
    const amt = parseFloat(fundAmount);
    if (!amt || amt <= 0) return;
    updateGoal(goal.id, amt);
    setFundAmount('');
    setShowFund(false);
  }

  const milestones = [25, 50, 75, 100];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--mk-bg)' }}>
      {/* Top nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'var(--mk-sheet)', borderBottom: '1px solid var(--mk-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', height: 56 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <ArrowLeft size={22} color="var(--mk-text)" />
          </button>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--mk-text)', fontFamily: 'Geist, sans-serif' }}>
            {goal.title}
          </p>
          <button
            onClick={() => { deleteGoal(goal.id); onBack(); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <Trash2 size={18} color="var(--mk-red)" />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px 20px 100px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Goal hero */}
        <div style={{ background: 'linear-gradient(135deg, var(--mk-card), var(--mk-border))', borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, border: '1px solid var(--mk-border)' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(var(--mk-orange-rgb),0.15)', border: '2px solid rgba(var(--mk-orange-rgb),0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
            {goal.emoji || '🎯'}
          </div>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--mk-text)', fontFamily: 'Geist, sans-serif', textAlign: 'center' }}>{goal.title}</p>
          <p style={{ fontSize: 36, fontWeight: 300, color: 'var(--mk-orange)', fontFamily: 'Geist, sans-serif' }}>{fmt(goal.target)}</p>

          {/* Milestone trail */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: '100%', marginTop: 8 }}>
            {milestones.map((ms, i) => {
              const reached = pct >= ms;
              return (
                <div key={ms} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, position: 'relative' }}>
                  {i < milestones.length - 1 && (
                    <div style={{
                      position: 'absolute', top: 10, left: '50%', width: '100%', height: 2,
                      background: pct >= milestones[i + 1] ? 'rgba(var(--mk-orange-rgb),0.8)' : 'rgba(var(--mk-text-rgb),0.1)',
                    }} />
                  )}
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', zIndex: 1,
                    background: reached ? 'var(--mk-orange)' : 'rgba(var(--mk-text-rgb),0.1)',
                    border: reached ? '2px solid rgba(var(--mk-orange-rgb),0.4)' : '2px solid rgba(var(--mk-text-rgb),0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: 'var(--mk-text)', fontWeight: 700,
                    boxShadow: reached ? '0 0 8px rgba(var(--mk-orange-rgb),0.4)' : 'none',
                  }}>
                    {reached ? '✓' : ''}
                  </div>
                  <p style={{ fontSize: 10, color: 'rgba(var(--mk-text-rgb),0.4)', fontFamily: 'Geist, sans-serif' }}>{ms}%</p>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div style={{ width: '100%', height: 6, borderRadius: 999, background: 'rgba(var(--mk-text-rgb),0.1)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, borderRadius: 999, background: 'linear-gradient(90deg, var(--mk-orange), var(--mk-red))', transition: 'width 0.8s ease', boxShadow: '0 0 8px rgba(var(--mk-orange-rgb),0.5)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <p style={{ fontSize: 12, color: 'rgba(var(--mk-text-rgb),0.5)', fontFamily: 'Geist, sans-serif' }}>
              {fmt(goal.current)} {lang === 'sw' ? 'imehifadhiwa' : 'saved'}
            </p>
            <p style={{ fontSize: 12, color: 'rgba(var(--mk-text-rgb),0.5)', fontFamily: 'Geist, sans-serif' }}>
              {fmt(remaining)} {lang === 'sw' ? 'zimebaki' : 'to go'}
            </p>
          </div>
        </div>

        {/* Auto Save card */}
        <div style={{ background: 'var(--mk-card)', borderRadius: 16, border: '1px solid var(--mk-border)', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: autoSave ? 16 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(var(--mk-green-rgb),0.1)', border: '1px solid rgba(var(--mk-green-rgb),0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Repeat size={18} color="var(--mk-green)" />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--mk-text)', fontFamily: 'Geist, sans-serif' }}>Auto Save</p>
                <p style={{ fontSize: 12, color: 'var(--mk-text-secondary)', fontFamily: 'Geist, sans-serif' }}>
                  {autoSave ? (lang === 'sw' ? 'Amilifu' : 'Active') : (lang === 'sw' ? 'Imezimwa' : 'Inactive')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAutoSave(p => !p)}
              style={{
                width: 44, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer',
                background: autoSave ? 'var(--mk-green)' : 'var(--mk-border)',
                display: 'flex', alignItems: 'center', padding: '0 2px',
                justifyContent: autoSave ? 'flex-end' : 'flex-start',
                transition: 'background 0.2s',
                boxShadow: autoSave ? '0 0 8px rgba(var(--mk-green-rgb),0.4)' : 'none',
              }}
            >
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--mk-text)', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }} />
            </button>
          </div>

          {autoSave && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 12, borderTop: '1px solid var(--mk-border)' }}>
              <div>
                <p style={{ fontSize: 12, color: 'var(--mk-text-secondary)', fontFamily: 'Geist, sans-serif', marginBottom: 6 }}>
                  {lang === 'sw' ? 'Kiasi cha Kila Mwezi' : 'Recurring Deposit'}
                </p>
                <input
                  type="number"
                  value={recurringAmount}
                  onChange={e => setRecurringAmount(e.target.value)}
                  placeholder="0"
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--mk-border)',
                    fontSize: 16, fontFamily: 'Geist, sans-serif', color: 'var(--mk-text)', outline: 'none',
                    background: 'var(--mk-sheet)', boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--mk-orange)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--mk-border)')}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={16} color="#4B5563" />
                <p style={{ fontSize: 12, color: 'var(--mk-text-secondary)', fontFamily: 'Geist, sans-serif' }}>
                  {lang === 'sw' ? 'Tarehe ya Akiba Inayofuata:' : 'Next Saving Date:'}{' '}
                  <span style={{ color: 'var(--mk-text)', fontWeight: 600 }}>
                    {new Date(Date.now() + 30 * 86400000).toLocaleDateString(lang === 'sw' ? 'sw' : 'en', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Plan type */}
        <div style={{ background: 'var(--mk-card)', borderRadius: 16, border: '1px solid var(--mk-border)', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(var(--mk-orange-rgb),0.1)', border: '1px solid rgba(var(--mk-orange-rgb),0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={18} color="var(--mk-orange)" />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--mk-text)', fontFamily: 'Geist, sans-serif' }}>
                {lang === 'sw' ? 'Aina ya Mpango' : 'Plan Type'}
              </p>
              <p style={{ fontSize: 12, color: 'var(--mk-text-secondary)', fontFamily: 'Geist, sans-serif' }}>
                {lang === 'sw' ? 'Akiba ya Malengo' : 'Goal-based Savings'}
              </p>
            </div>
          </div>
          {goal.daysLeft != null && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--mk-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={16} color="#4B5563" />
              <p style={{ fontSize: 12, color: 'var(--mk-text-secondary)', fontFamily: 'Geist, sans-serif' }}>
                {goal.daysLeft} {lang === 'sw' ? 'siku zimebaki' : 'days remaining'}
              </p>
            </div>
          )}
        </div>

        {/* Fund button */}
        {!showFund ? (
          <button
            onClick={() => setShowFund(true)}
            style={{
              background: 'linear-gradient(135deg, var(--mk-orange), var(--mk-red))', color: 'var(--mk-text)', fontFamily: 'Geist, sans-serif',
              fontSize: 15, fontWeight: 700, padding: '16px', borderRadius: 16,
              border: 'none', cursor: 'pointer', width: '100%',
              boxShadow: '0 0 20px rgba(var(--mk-orange-rgb),0.4)',
            }}
          >
            {lang === 'sw' ? 'Weka Fedha' : 'Fund this Goal'}
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ background: 'var(--mk-card)', borderRadius: 16, border: '1px solid var(--mk-border)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--mk-text)', fontFamily: 'Geist, sans-serif' }}>
              {lang === 'sw' ? 'Ingiza Kiasi' : 'Enter Amount'}
            </p>
            <input
              type="number"
              value={fundAmount}
              onChange={e => setFundAmount(e.target.value)}
              autoFocus
              placeholder="0"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid var(--mk-border)',
                fontSize: 24, fontFamily: 'Geist, sans-serif', color: 'var(--mk-text)', outline: 'none',
                textAlign: 'center', boxSizing: 'border-box', background: 'var(--mk-sheet)',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--mk-orange)')}
              onBlur={e => (e.target.style.borderColor = 'var(--mk-border)')}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setShowFund(false)}
                style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid var(--mk-border)', background: 'var(--mk-sheet)', color: 'var(--mk-text-secondary)', fontFamily: 'Geist, sans-serif', fontSize: 14, cursor: 'pointer' }}
              >
                {lang === 'sw' ? 'Ghairi' : 'Cancel'}
              </button>
              <button
                onClick={handleFund}
                style={{ flex: 2, padding: '12px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, var(--mk-orange), var(--mk-red))', color: 'var(--mk-text)', fontFamily: 'Geist, sans-serif', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 12px rgba(var(--mk-orange-rgb),0.3)' }}
              >
                {lang === 'sw' ? 'Weka' : 'Add Funds'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
