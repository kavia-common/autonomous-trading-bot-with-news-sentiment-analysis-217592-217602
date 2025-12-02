import React, { useState, useEffect } from 'react';

/**
 * PUBLIC_INTERFACE
 * ConfigForm
 * Displays and edits configuration (symbols, position sizing, risk params).
 * Props:
 * - initialConfig: object or null
 * - onSave: async function(payload) -> saves via API
 * - loading: boolean
 */
export default function ConfigForm({ initialConfig, onSave, loading }) {
  const [form, setForm] = useState({
    symbols: '',
    max_position_size: 1,
    max_daily_loss: 0,
    risk_per_trade: 1,
    enable_sentiment_filter: true
  });

  useEffect(() => {
    if (initialConfig) {
      setForm({
        symbols: Array.isArray(initialConfig.symbols)
          ? initialConfig.symbols.join(',')
          : initialConfig.symbols || '',
        max_position_size: initialConfig.max_position_size ?? 1,
        max_daily_loss: initialConfig.max_daily_loss ?? 0,
        risk_per_trade: initialConfig.risk_per_trade ?? 1,
        enable_sentiment_filter: !!initialConfig.enable_sentiment_filter
      });
    }
  }, [initialConfig]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      symbols: form.symbols
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      max_position_size: Number(form.max_position_size),
      max_daily_loss: Number(form.max_daily_loss),
      risk_per_trade: Number(form.risk_per_trade),
      enable_sentiment_filter: !!form.enable_sentiment_filter
    };
    await onSave(payload);
  };

  return (
    <div className="card">
      <div className="card-header"><h3>Configuration</h3></div>
      <form className="card-body" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="symbols">Symbols (comma-separated)</label>
          <input
            id="symbols"
            name="symbols"
            type="text"
            value={form.symbols}
            onChange={handleChange}
            placeholder="e.g., NIFTY, BANKNIFTY"
          />
        </div>

        <div className="row gap-16">
          <div className="form-group col">
            <label htmlFor="max_position_size">Max Position Size</label>
            <input
              id="max_position_size"
              name="max_position_size"
              type="number"
              min="1"
              value={form.max_position_size}
              onChange={handleChange}
            />
          </div>

          <div className="form-group col">
            <label htmlFor="risk_per_trade">Risk per Trade (%)</label>
            <input
              id="risk_per_trade"
              name="risk_per_trade"
              type="number"
              min="0"
              step="0.1"
              value={form.risk_per_trade}
              onChange={handleChange}
            />
          </div>

          <div className="form-group col">
            <label htmlFor="max_daily_loss">Max Daily Loss</label>
            <input
              id="max_daily_loss"
              name="max_daily_loss"
              type="number"
              min="0"
              step="0.01"
              value={form.max_daily_loss}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox">
            <input
              type="checkbox"
              name="enable_sentiment_filter"
              checked={form.enable_sentiment_filter}
              onChange={handleChange}
            />
            Use sentiment filter in signals
          </label>
        </div>

        <div className="card-footer">
          <button className="btn btn-primary" type="submit" disabled={loading} aria-busy={loading}>
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
