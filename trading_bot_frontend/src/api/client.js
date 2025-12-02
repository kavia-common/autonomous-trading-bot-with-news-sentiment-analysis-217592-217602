const BASE_URL =
  (typeof process !== 'undefined' &&
    process.env &&
    process.env.REACT_APP_BACKEND_URL) ||
  'http://localhost:3001';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const opts = { ...options, headers };

  try {
    const res = await fetch(url, opts);
    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const message = isJson ? (data?.detail || JSON.stringify(data)) : data;
      throw new Error(message || `HTTP ${res.status}`);
    }
    return data;
  } catch (err) {
    // Bubble up, but include path for debugging
    throw new Error(`Request failed (${url}): ${err.message}`);
  }
}

// PUBLIC_INTERFACE
export const api = {
  /** Bot control and status */
  // PUBLIC_INTERFACE
  startBot: () => request('/bot/start', { method: 'POST' }),
  // PUBLIC_INTERFACE
  stopBot: () => request('/bot/stop', { method: 'POST' }),
  // PUBLIC_INTERFACE
  getBotStatus: () => request('/bot/status', { method: 'GET' }),

  /** Configuration */
  // PUBLIC_INTERFACE
  getConfig: () => request('/config', { method: 'GET' }),
  // PUBLIC_INTERFACE
  updateConfig: (payload) =>
    request('/config', { method: 'PUT', body: JSON.stringify(payload) }),

  /** Trades */
  // PUBLIC_INTERFACE
  getTrades: () => request('/trades', { method: 'GET' }),

  /** News & Sentiment */
  // PUBLIC_INTERFACE
  getSentiment: () => request('/news/sentiment', { method: 'GET' }),
  // PUBLIC_INTERFACE
  refreshNews: () => request('/news/refresh', { method: 'POST' })
};

export default api;
