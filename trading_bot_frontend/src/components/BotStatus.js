import React from 'react';

/**
 * PUBLIC_INTERFACE
 * BotStatus
 * A panel to display and control bot status with start/stop actions.
 * Props:
 * - status: object { running: boolean, last_run?: string, message?: string }
 * - onStart: function to call when starting
 * - onStop: function to call when stopping
 * - loading: boolean indicating action in progress
 */
export default function BotStatus({ status, onStart, onStop, loading }) {
  const running = !!status?.running;

  return (
    <div className="card">
      <div className="card-header">
        <h3>Bot Status & Control</h3>
        <span className={`badge ${running ? 'badge-success' : 'badge-muted'}`}>
          {running ? 'Running' : 'Stopped'}
        </span>
      </div>
      <div className="card-body">
        <p className="muted">
          {status?.message || (running ? 'Bot is active and monitoring.' : 'Bot is idle.')}
        </p>
        {status?.last_run && (
          <p className="small muted">Last run: {new Date(status.last_run).toLocaleString()}</p>
        )}
      </div>
      <div className="card-footer row gap-8">
        <button
          className="btn btn-primary"
          onClick={onStart}
          disabled={running || loading}
          aria-busy={loading}
        >
          ▶ Start
        </button>
        <button
          className="btn btn-secondary"
          onClick={onStop}
          disabled={!running || loading}
          aria-busy={loading}
        >
          ■ Stop
        </button>
      </div>
    </div>
  );
}
