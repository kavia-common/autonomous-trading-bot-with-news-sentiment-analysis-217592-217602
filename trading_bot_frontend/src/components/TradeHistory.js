import React from 'react';

/**
 * PUBLIC_INTERFACE
 * TradeHistory
 * Displays a table of trades.
 * Props:
 * - trades: array of { id, symbol, side, qty, price, time, pnl }
 */
export default function TradeHistory({ trades = [] }) {
  return (
    <div className="card">
      <div className="card-header"><h3>Trade History</h3></div>
      <div className="card-body overflow">
        <table className="table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Symbol</th>
              <th>Side</th>
              <th>Qty</th>
              <th>Price</th>
              <th>PNL</th>
            </tr>
          </thead>
          <tbody>
            {trades.length === 0 && (
              <tr><td colSpan="6" className="muted">No trades yet.</td></tr>
            )}
            {trades.map((t, idx) => (
              <tr key={t.id || idx}>
                <td>{t.time ? new Date(t.time).toLocaleString() : '-'}</td>
                <td>{t.symbol || '-'}</td>
                <td className={t.side === 'BUY' ? 'text-green' : 'text-red'}>
                  {t.side || '-'}
                </td>
                <td>{t.qty ?? '-'}</td>
                <td>{t.price != null ? Number(t.price).toFixed(2) : '-'}</td>
                <td className={(t.pnl ?? 0) >= 0 ? 'text-green' : 'text-red'}>
                  {t.pnl != null ? Number(t.pnl).toFixed(2) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
