import React, { useEffect, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * RiskPanel
 * Quick risk controls with inline update callback.
 * Props:
 * - config: initial risk config
 * - onChange: function(partial) -> not persisted by itself
 * - onCommit: function(fullConfig) -> persist changes
 * - loading: boolean
 */
export default function RiskPanel({ config, onChange, onCommit, loading }) {
  const [local, setLocal] = useState({
    max_position_size: 1,
    risk_per_trade: 1,
    max_daily_loss: 0
  });

  useEffect(() => {
    if (config) {
      setLocal({
        max_position_size: config.max_position_size ?? 1,
        risk_per_trade: config.risk_per_trade ?? 1,
        max_daily_loss: config.max_daily_loss ?? 0
      });
    }
  }, [config]);

  const applyAndNotify = (patch) => {
    setLocal((p) => {
      const next = { ...p, ...patch };
      onChange?.(next);
      return next;
    });
  };

  const commit = () => {
    onCommit?.({
      ...config,
      ...local,
      symbols: config?.symbols || []
    });
  };

  return (
    <div className="card">
      <div className="card-header"><h3>Risk Controls</h3></div>
      <div className="card-body">
        <div className="row gap-16">
          <div className="form-group col">
            <label>Max Position Size</label>
            <input
              type="number"
              min="1"
              value={local.max_position_size}
              onChange={(e) => applyAndNotify({ max_position_size: Number(e.target.value) })}
            />
          </div>
          <div className="form-group col">
            <label>Risk per Trade (%)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={local.risk_per_trade}
              onChange={(e) => applyAndNotify({ risk_per_trade: Number(e.target.value) })}
            />
          </div>
          <div className="form-group col">
            <label>Max Daily Loss</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={local.max_daily_loss}
              onChange={(e) => applyAndNotify({ max_daily_loss: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>
      <div className="card-footer">
        <button className="btn btn-secondary" onClick={commit} disabled={loading} aria-busy={loading}>
          Apply Risk Settings
        </button>
      </div>
    </div>
  );
}
