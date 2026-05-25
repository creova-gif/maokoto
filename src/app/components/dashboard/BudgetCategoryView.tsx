import { ArrowLeft, TrendingDown } from 'lucide-react';
import { useApp } from '@/app/App';
import { formatCurrency } from '@/app/utils/currency';
import { getCategoryIcon } from '@/app/utils/categoryIcons';

interface Props {
  category: string;
  onBack: () => void;
}

export function BudgetCategoryView({ category, onBack }: Props) {
  const { state } = useApp();
  const { language: lang, transactions, categoryBudgets } = state;
  const fmt = (n: number) => formatCurrency(n, state.region);

  const categoryTxs = transactions
    .filter(t => t.category === category && t.type === 'expense')
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const spent = categoryTxs.reduce((s, t) => s + t.amount, 0);
  const budget = categoryBudgets[category] || 0;
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const remaining = Math.max(budget - spent, 0);
  const over = spent > budget && budget > 0;

  const icon = getCategoryIcon(category);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0D0D0D' }}>
      {/* Top nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: '#141414', borderBottom: '1px solid #2A2A2E' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', height: 56 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <ArrowLeft size={22} color="#FFFFFF" />
          </button>
          <span style={{ fontSize: 18, marginRight: 4 }}>{icon}</span>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', fontFamily: 'Geist, sans-serif' }}>{category}</p>
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px 20px 100px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Budget progress card */}
        <div style={{ background: '#1C1C1E', borderRadius: 16, border: '1px solid #2A2A2E', padding: 20 }}>
          <p style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Geist, sans-serif', marginBottom: 4 }}>
            {lang === 'sw' ? 'Imetumika' : 'Spent'}
          </p>
          <p style={{ fontSize: 36, fontWeight: 700, color: over ? '#FF3D3D' : '#FFFFFF', fontFamily: 'Geist, sans-serif', marginBottom: 16 }}>
            {fmt(spent)}
          </p>

          {/* Progress bar */}
          <div style={{ height: 8, borderRadius: 999, background: '#2A2A2E', overflow: 'hidden', marginBottom: 8 }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              borderRadius: 999,
              background: over ? '#FF3D3D' : 'linear-gradient(90deg, #FF6B00, #00E5A0)',
              transition: 'width 0.6s ease',
              boxShadow: over ? '0 0 8px rgba(255,61,61,0.5)' : '0 0 8px rgba(255,107,0,0.4)',
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Geist, sans-serif' }}>
                {lang === 'sw' ? 'Iliyotumika' : 'Spent'}
              </p>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#FF3D3D', fontFamily: 'Geist, sans-serif' }}>{fmt(spent)}</p>
            </div>
            {budget > 0 && (
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Geist, sans-serif' }}>
                  {lang === 'sw' ? 'Iliyobaki' : 'Remaining'}
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#00E5A0', fontFamily: 'Geist, sans-serif' }}>{fmt(remaining)}</p>
              </div>
            )}
          </div>

          {budget === 0 && (
            <p style={{ fontSize: 12, color: '#6B7280', marginTop: 8, fontFamily: 'Geist, sans-serif' }}>
              {lang === 'sw' ? 'Hakuna kikomo kilichowekwa' : 'No budget limit set for this category'}
            </p>
          )}
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ background: '#1C1C1E', borderRadius: 16, border: '1px solid #2A2A2E', padding: 16 }}>
            <p style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Geist, sans-serif', marginBottom: 4 }}>
              {lang === 'sw' ? 'Miamala' : 'Transactions'}
            </p>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#FFFFFF', fontFamily: 'Geist, sans-serif' }}>{categoryTxs.length}</p>
          </div>
          <div style={{ background: '#1C1C1E', borderRadius: 16, border: '1px solid #2A2A2E', padding: 16 }}>
            <p style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Geist, sans-serif', marginBottom: 4 }}>
              {lang === 'sw' ? 'Wastani' : 'Average'}
            </p>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#FFFFFF', fontFamily: 'Geist, sans-serif' }}>
              {fmt(categoryTxs.length > 0 ? spent / categoryTxs.length : 0)}
            </p>
          </div>
        </div>

        {/* Transaction list */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', fontFamily: 'Geist, sans-serif' }}>
              {lang === 'sw' ? 'Miamala Yote' : 'All Transactions'}
            </p>
            <p style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Geist, sans-serif' }}>
              {categoryTxs.length} {lang === 'sw' ? 'jumla' : 'total'}
            </p>
          </div>

          {categoryTxs.length === 0 ? (
            <div style={{ background: '#1C1C1E', borderRadius: 16, border: '1px solid #2A2A2E', padding: 32, textAlign: 'center' }}>
              <p style={{ fontSize: 32, marginBottom: 8 }}>{icon}</p>
              <p style={{ fontSize: 14, color: '#6B7280', fontFamily: 'Geist, sans-serif' }}>
                {lang === 'sw' ? 'Hakuna miamala bado' : 'No transactions yet'}
              </p>
            </div>
          ) : (
            <div style={{ background: '#1C1C1E', borderRadius: 16, border: '1px solid #2A2A2E', overflow: 'hidden' }}>
              {categoryTxs.map((tx, i) => (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    borderBottom: i < categoryTxs.length - 1 ? '1px solid #2A2A2E' : 'none',
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'rgba(255,61,61,0.1)', border: '1px solid rgba(255,61,61,0.2)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 18, flexShrink: 0,
                  }}>
                    <TrendingDown size={16} color="#FF3D3D" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', fontFamily: 'Geist, sans-serif' }}>
                      {tx.notes || category}
                    </p>
                    <p style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Geist, sans-serif' }}>
                      {tx.source} · {tx.date.toLocaleDateString(lang === 'sw' ? 'sw' : 'en', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#FF3D3D', fontFamily: 'Geist, sans-serif', flexShrink: 0 }}>
                    -{fmt(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
