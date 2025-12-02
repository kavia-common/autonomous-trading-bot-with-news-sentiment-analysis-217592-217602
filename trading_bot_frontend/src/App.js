import React, { useEffect, useMemo, useState, useCallback } from 'react';
import './App.css';
import { api } from './api/client';
import BotStatus from './components/BotStatus';
import ConfigForm from './components/ConfigForm';
import TradeHistory from './components/TradeHistory';
import SentimentFeed from './components/SentimentFeed';
import KeyManager from './components/KeyManager';
import RiskPanel from './components/RiskPanel';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [status, setStatus] = useState({ running: false });
  const [config, setConfig] = useState(null);
  const [trades, setTrades] = useState([]);
  const [sentiment, setSentiment] = useState([]);
  const [loading, setLoading] = useState({ start: false, stop: false, save: false, refreshNews: false });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, []);

  const loadAll = useCallback(async () => {
    try {
      const [st, cfg, tr, sn] = await Promise.allSettled([
        api.getBotStatus(),
        api.getConfig(),
        api.getTrades(),
        api.getSentiment()
      ]);
      if (st.status === 'fulfilled') setStatus(st.value);
      if (cfg.status === 'fulfilled') setConfig(cfg.value);
      if (tr.status === 'fulfilled') setTrades(Array.isArray(tr.value) ? tr.value : (tr.value?.items || []));
      if (sn.status === 'fulfilled') setSentiment(Array.isArray(sn.value) ? sn.value : (sn.value?.items || []));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadAll();
    const timer = setInterval(() => {
      api.getBotStatus().then(setStatus).catch(() => {});
    }, 8000);
    return () => clearInterval(timer);
  }, [loadAll]);

  const onStart = async () => {
    setLoading((l) => ({ ...l, start: true }));
    try {
      await api.startBot();
      const st = await api.getBotStatus();
      setStatus(st);
    } catch (e) {
      console.error(e);
      alert(`Failed to start bot: ${e.message}`);
    } finally {
      setLoading((l) => ({ ...l, start: false }));
    }
  };

  const onStop = async () => {
    setLoading((l) => ({ ...l, stop: true }));
    try {
      await api.stopBot();
      const st = await api.getBotStatus();
      setStatus(st);
    } catch (e) {
      console.error(e);
      alert(`Failed to stop bot: ${e.message}`);
    } finally {
      setLoading((l) => ({ ...l, stop: false }));
    }
  };

  const onSaveConfig = async (payload) => {
    setLoading((l) => ({ ...l, save: true }));
    try {
      const saved = await api.updateConfig(payload);
      setConfig(saved);
      alert('Configuration saved');
    } catch (e) {
      console.error(e);
      alert(`Failed to save configuration: ${e.message}`);
    } finally {
      setLoading((l) => ({ ...l, save: false }));
    }
  };

  const onRiskChange = useCallback((partial) => {
    // Preview hook; currently no-op
  }, []);

  const onRiskCommit = async (full) => {
    await onSaveConfig(full);
  };

  const onRefreshNews = async () => {
    setLoading((l) => ({ ...l, refreshNews: true }));
    try {
      await api.refreshNews();
      const items = await api.getSentiment();
      setSentiment(Array.isArray(items) ? items : (items?.items || []));
    } catch (e) {
      console.error(e);
      alert(`Failed to refresh news: ${e.message}`);
    } finally {
      setLoading((l) => ({ ...l, refreshNews: false }));
    }
  };

  const backendUrl = useMemo(() => {
    const envUrl =
      (typeof process !== 'undefined' &&
        process.env &&
        process.env.REACT_APP_BACKEND_URL) || 'http://localhost:3001';
    return envUrl;
  }, []);

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-title">Trading Bot Dashboard</div>
        <div className="navbar-actions">
          <span className="small muted">Backend: {backendUrl}</span>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>

      <main className="container grid">
        <section className="grid-col-2">
          <BotStatus status={status} onStart={onStart} onStop={onStop} loading={loading.start || loading.stop} />
          <RiskPanel config={config} onChange={onRiskChange} onCommit={onRiskCommit} loading={loading.save} />
          <KeyManager />
        </section>

        <section className="grid-col-2">
          <ConfigForm initialConfig={config} onSave={onSaveConfig} loading={loading.save} />
          <SentimentFeed items={sentiment} onRefresh={onRefreshNews} loading={loading.refreshNews} />
        </section>

        <section className="grid-col-4">
          <TradeHistory trades={trades} />
        </section>
      </main>

      <footer className="footer muted small">
        © {new Date().getFullYear()} Autonomous Trading Bot — Stay disciplined.
      </footer>
    </div>
  );
}

export default App;
