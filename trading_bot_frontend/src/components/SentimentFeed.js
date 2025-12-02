import React from 'react';

/**
 * PUBLIC_INTERFACE
 * SentimentFeed
 * Shows news sentiment list with quick refresh.
 * Props:
 * - items: array of { source, title, sentiment, time, url }
 * - onRefresh: function to call to refresh news
 * - loading: boolean
 */
export default function SentimentFeed({ items = [], onRefresh, loading }) {
  return (
    <div className="card">
      <div className="card-header row justify-between align-center">
        <h3>News Sentiment</h3>
        <button className="btn btn-secondary" onClick={onRefresh} disabled={loading} aria-busy={loading}>
          Refresh
        </button>
      </div>
      <div className="card-body list">
        {items.length === 0 && <p className="muted">No recent headlines.</p>}
        {items.map((n, idx) => (
          <a
            key={idx}
            className="list-item"
            href={n.url || '#'}
            target="_blank"
            rel="noreferrer"
          >
            <div className="row justify-between align-start">
              <div>
                <div className="small muted">{n.source || 'Unknown'}</div>
                <div className="title-6">{n.title}</div>
                {n.time && <div className="small muted">{new Date(n.time).toLocaleString()}</div>}
              </div>
              <span className={`badge ${
                (n.sentiment ?? 0) > 0 ? 'badge-success' :
                (n.sentiment ?? 0) < 0 ? 'badge-danger' : 'badge-muted'
              }`}>
                {Number(n.sentiment ?? 0).toFixed(2)}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
