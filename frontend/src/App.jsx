import { useState } from "react";
import "./App.css";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

function levelColor(level) {
  switch ((level || "").toLowerCase()) {
    case "error":
      return "#ef4444";
    case "warn":
      return "#f59e0b";
    case "info":
      return "#3b82f6";
    default:
      return "#6b7280";
  }
}

export default function App() {
  const [serviceId, setServiceId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [limit, setLimit] = useState(100);
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stats = {
    total: logs.length,
    errors: logs.filter((l) => (l.level || "").toLowerCase() === "error")
      .length,
    warns: logs.filter((l) => (l.level || "").toLowerCase() === "warn").length,
  };

  const filtered = logs.filter((l) => {
    const matchLevel =
      filter === "all" || (l.level || "").toLowerCase() === filter;
    const matchSearch =
      !search || l.message?.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchSearch;
  });

  async function fetchLogs() {
    if (!serviceId.trim() || !apiKey.trim() || !ownerId.trim()) {
      setError("Service ID, Owner ID and API key are all required.");
      return;
    }
    setError("");
    setLogs([]);
    setLoading(true);
    try {
      const res = await fetch(
        `${BACKEND}/api/logs?serviceId=${encodeURIComponent(serviceId)}&apiKey=${encodeURIComponent(apiKey)}&ownerId=${encodeURIComponent(ownerId)}&limit=${limit}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch logs");
      const rawLogs = Array.isArray(data) ? data : data.logs || [];
      setLogs(rawLogs);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <span className="dot" />
        <h1>Render Log Viewer</h1>
      </header>

      <section className="card inputs">
        <div className="row">
          <div className="field">
            <label>
              Service ID{" "}
              <span className="hint">srv-xxxx (from dashboard URL)</span>
            </label>
            <input
              placeholder="srv-xxxxxxxxxxxxxxxx"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
            />
          </div>
          <div className="field">
            <label>
              Owner / Workspace ID{" "}
              <span className="hint">tea-xxxx or usr-xxxx</span>
            </label>
            <input
              placeholder="tea-xxxxxxxxxxxxxxxx"
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="field">
            <label>API Key</label>
            <input
              type="password"
              placeholder="rnd_xxxxxxxxxxxx"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <div className="field field--small">
            <label>Limit</label>
            <input
              type="number"
              min={1}
              max={500}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            />
          </div>
        </div>
        <button
          className="btn btn--primary"
          onClick={fetchLogs}
          disabled={loading}
        >
          {loading ? "Fetching…" : "Fetch Logs"}
        </button>
        {error && <p className="error">{error}</p>}
      </section>

      {logs.length > 0 && (
        <>
          <div className="stats">
            <div className="stat">
              <span className="stat__num">{stats.total}</span>
              <span className="stat__label">total</span>
            </div>
            <div className="stat">
              <span className="stat__num stat__num--error">{stats.errors}</span>
              <span className="stat__label">errors</span>
            </div>
            <div className="stat">
              <span className="stat__num stat__num--warn">{stats.warns}</span>
              <span className="stat__label">warnings</span>
            </div>
          </div>

          <section className="card log-panel">
            <div className="log-toolbar">
              <div className="filters">
                {["all", "error", "warn", "info"].map((f) => (
                  <button
                    key={f}
                    className={`filter ${filter === f ? "filter--active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <input
                className="search"
                placeholder="Search logs…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="log-list">
              {filtered.length === 0 ? (
                <p className="empty">No logs match your filter.</p>
              ) : (
                filtered.map((l, i) => (
                  <div key={i} className="log-row">
                    <span
                      className="log-level"
                      style={{ color: levelColor(l.level) }}
                    >
                      {(l.level || "info").toLowerCase()}
                    </span>
                    <span className="log-ts">
                      {l.timestamp
                        ? new Date(l.timestamp).toLocaleTimeString()
                        : ""}
                    </span>
                    <span className="log-msg">{l.message}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
