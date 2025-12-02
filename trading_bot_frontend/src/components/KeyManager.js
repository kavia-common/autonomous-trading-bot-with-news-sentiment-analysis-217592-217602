import React, { useEffect, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * KeyManager
 * Manages API keys client-side (placeholder). In real app, send to backend secure store.
 * Stores values in localStorage under 'apikeys'.
 */
export default function KeyManager() {
  const [form, setForm] = useState({ zerodha_key: '', zerodha_secret: '', newsapi_key: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('apikeys');
      if (raw) {
        const parsed = JSON.parse(raw);
        setForm({
          zerodha_key: parsed.zerodha_key || '',
          zerodha_secret: parsed.zerodha_secret || '',
          newsapi_key: parsed.newsapi_key || ''
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('apikeys', JSON.stringify(form));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header"><h3>API Key Manager</h3></div>
      <form className="card-body" onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="zerodha_key">Zerodha API Key</label>
          <input
            id="zerodha_key"
            name="zerodha_key"
            type="password"
            value={form.zerodha_key}
            onChange={handleChange}
            placeholder="Enter Zerodha API key"
          />
        </div>
        <div className="form-group">
          <label htmlFor="zerodha_secret">Zerodha API Secret</label>
          <input
            id="zerodha_secret"
            name="zerodha_secret"
            type="password"
            value={form.zerodha_secret}
            onChange={handleChange}
            placeholder="Enter Zerodha API secret"
          />
        </div>
        <div className="form-group">
          <label htmlFor="newsapi_key">NewsAPI Key</label>
          <input
            id="newsapi_key"
            name="newsapi_key"
            type="password"
            value={form.newsapi_key}
            onChange={handleChange}
            placeholder="Enter NewsAPI key"
          />
        </div>
        <div className="card-footer row gap-8">
          <button type="submit" className="btn btn-primary">Save Keys</button>
          {saved && <span className="small text-green">Saved locally</span>}
        </div>
      </form>
    </div>
  );
}
