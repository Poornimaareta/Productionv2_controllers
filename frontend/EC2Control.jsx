import { useState, useEffect, useCallback } from "react";

// ─── CONFIG: Set your values here ───────────────────────────────────────────
const DEFAULT_INSTANCE_ID = "i-02413380b122ed0a7";
const DEFAULT_API_ENDPOINT = "https://4oi4pmg6qdnpbz35cvev5xvk240vanzy.lambda-url.us-east-2.on.aws/";
const APP_PASSWORD = "prodv2@2024"; // ← change this
// ─────────────────────────────────────────────────────────────────────────────

function PasswordGate({ onUnlock }) {
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const attempt = () => {
    if (input === APP_PASSWORD) {
      onUnlock();
    } else {
      setShake(true);
      setInput("");
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f3f4f6",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 16px",
      fontFamily: "'IBM Plex Mono', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;600;700&display=swap');
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
        input:focus { outline: none; border-color: #6366f1 !important; box-shadow: 0 0 0 1px rgba(129,140,248,0.5); }
      `}</style>

      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div style={{
          fontSize: 11,
          letterSpacing: "0.3em",
          color: "#6b7280",
          textTransform: "uppercase",
          marginBottom: 8
        }}>
          AWS Infrastructure
        </div>
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#111827",
          margin: 0,
          fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: "-0.02em"
        }}>
          EC2 Instance Control
        </h1>
      </div>

      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 18,
        padding: "32px 30px 26px",
        boxShadow: "0 22px 55px rgba(15,23,42,0.20)",
        animation: "fadeIn 0.4s ease",
      }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🔒</div>
          <div style={{
            color: "#4b5563",
            fontSize: 14,
            fontFamily: "'Space Grotesk', sans-serif"
          }}>
            Enter password to continue
          </div>
        </div>

        <div style={{ animation: shake ? "shake 0.4s ease" : "none" }}>
          <div style={{ position: "relative", marginBottom: 16 }}>
            <input
              type={showPw ? "text" : "password"}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && attempt()}
              placeholder="Password"
              autoFocus
              style={{
                width: "100%",
                background: "#f9fafb",
                border: "1px solid #d1d5db",
                color: "#111827",
                borderRadius: 999,
                padding: "12px 48px 12px 16px",
                fontSize: 14,
                fontFamily: "'IBM Plex Mono', monospace",
                boxSizing: "border-box",
                transition: "border-color 0.2s, box-shadow 0.2s, background-color 0.2s"
              }}
            />
            <button
              type="button"
              onClick={() => setShowPw(s => !s)}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#6b7280",
                cursor: "pointer",
                fontSize: 16,
                padding: 0,
                lineHeight: 1
              }}
            >
              {showPw ? "🙈" : "👁"}
            </button>
          </div>

          <button
            onClick={attempt}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: "linear-gradient(135deg, #4f46e5, #6366f1)",
              color: "#ffffff",
              fontFamily: "'Space Grotesk', sans-serif",
              boxShadow: "0 6px 18px rgba(79,70,229,0.45)",
              transition: "transform 0.08s ease, box-shadow 0.08s ease, opacity 0.15s ease"
            }}
          >
            Unlock
          </button>
        </div>
      </div>
    </div>
  );
}

const STATE_COLORS = {
  running: { dot: "#22c55e", text: "#4ade80", label: "RUNNING" },
  stopped: { dot: "#ef4444", text: "#f87171", label: "STOPPED" },
  pending: { dot: "#f59e0b", text: "#fbbf24", label: "STARTING..." },
  stopping: { dot: "#f59e0b", text: "#fbbf24", label: "STOPPING..." },
  unknown: { dot: "#6b7280", text: "#9ca3af", label: "UNKNOWN" },
};

function StatusDot({ state }) {
  const cfg = STATE_COLORS[state] || STATE_COLORS.unknown;
  const pulse = state === "running" || state === "pending" || state === "stopping";
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      {pulse && (
        <span style={{
          position: "absolute", width: 12, height: 12, borderRadius: "50%",
          background: cfg.dot, opacity: 0.4,
          animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite"
        }} />
      )}
      <span style={{
        width: 12, height: 12, borderRadius: "50%", background: cfg.dot,
        display: "inline-block", position: "relative"
      }} />
    </span>
  );
}

function MetaRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <span style={{ color: "#6b7280", fontSize: 12, letterSpacing: "0.08em",
        textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>{label}</span>
      <span style={{ color: "#e5e7eb", fontSize: 13, fontFamily: "'IBM Plex Mono', monospace",
        background: "rgba(255,255,255,0.05)", padding: "2px 10px", borderRadius: 4 }}>{value}</span>
    </div>
  );
}

export default function EC2Control() {
  const [unlocked, setUnlocked] = useState(false);
  const [instanceId, setInstanceId] = useState(DEFAULT_INSTANCE_ID);
  const [apiEndpoint, setApiEndpoint] = useState(DEFAULT_API_ENDPOINT);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [log, setLog] = useState([]);

  const addLog = (msg, type = "info") => {
    const ts = new Date().toLocaleTimeString();
    setLog(prev => [{ ts, msg, type }, ...prev].slice(0, 20));
  };

  const callApi = useCallback(async (action) => {
    const res = await fetch(apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, instance_id: instanceId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "API error");
    return data;
  }, [apiEndpoint, instanceId]);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await callApi("status");
      setInfo(data);
      addLog(`Status fetched — ${data.state}`, "info");
    } catch (e) {
      setError(e.message);
      addLog(`Error: ${e.message}`, "error");
    } finally {
      setLoading(false);
    }
  }, [callApi]);

  const handleAction = async (action) => {
    setActionLoading(true);
    setError(null);
    addLog(`Sending ${action.toUpperCase()} command...`, "action");
    try {
      await callApi(action);
      addLog(`Command accepted: ${action.toUpperCase()}`, "success");
      // Poll for status update
      setTimeout(fetchStatus, 2000);
      setTimeout(fetchStatus, 6000);
      setTimeout(fetchStatus, 12000);
    } catch (e) {
      setError(e.message);
      addLog(`Failed: ${e.message}`, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const state = info?.state || "unknown";
  const cfg = STATE_COLORS[state] || STATE_COLORS.unknown;
  const canStart = state === "stopped";
  const canStop = state === "running";

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  return (
    <div style={{
      minHeight: "100vh", background: "#f3f4f6",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "32px 16px",
      fontFamily: "'IBM Plex Mono', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;600;700&display=swap');
        @keyframes ping { 75%,100%{transform:scale(2);opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#333;border-radius:2px}
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div style={{
          fontSize: 11,
          letterSpacing: "0.3em",
          color: "#6b7280",
          textTransform: "uppercase",
          marginBottom: 8
        }}>
          AWS Infrastructure
        </div>
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#111827",
          margin: 0,
          fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: "-0.02em"
        }}>
          EC2 Instance Control
        </h1>
      </div>

      {/* Main Card */}
      <div style={{
        width: "100%",
        maxWidth: 520,
        background: "#ffffff",
        border: "1px solid #d1d5db",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 24px 60px rgba(15,23,42,0.18)",
        animation: "fadeIn 0.4s ease"
      }}>
        {/* Top status bar */}
        <div style={{
          background: "#f9fafb",
          borderBottom: "1px solid #e5e7eb", padding: "20px 24px",
          display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <StatusDot state={state} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#111827",
                fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.01em" }}>
                WebBackendServer
              </div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                Current state: {cfg.label}
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ margin: "16px 24px 0", background: "rgba(248,113,113,0.08)",
            border: "1px solid rgba(248,113,113,0.5)", borderRadius: 8, padding: "10px 14px",
            color: "#b91c1c", fontSize: 12 }}>
            ⚠ {error}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          padding: "20px 24px 18px",
          borderTop: "1px solid #e5e7eb",
          borderBottom: log.length ? "1px solid #e5e7eb" : "none",
          background: "#f9fafb"
        }}>
          <div style={{
            fontSize: 11,
            color: "#6b7280",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 10
          }}>
            Controls
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 12
          }}>
            {/* START */}
            <button
              onClick={() => handleAction("start")}
              disabled={!canStart || actionLoading}
              style={{
                padding: "12px 10px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                cursor: canStart && !actionLoading ? "pointer" : "not-allowed",
                border: "none",
                letterSpacing: "0.05em",
                background: canStart ? "linear-gradient(135deg, #16a34a, #15803d)" : "#1a2e1a",
                color: canStart ? "#ffffff" : "#4ade80",
                transition: "transform 0.1s ease, box-shadow 0.1s ease, opacity 0.15s ease",
                fontFamily: "'Space Grotesk', sans-serif",
                boxShadow: canStart ? "0 6px 18px rgba(22,163,74,0.45)" : "none",
                opacity: canStart ? 1 : 0.55
              }}
            >
              ▶ Start
            </button>

            {/* STOP */}
            <button
              onClick={() => handleAction("stop")}
              disabled={!canStop || actionLoading}
              style={{
                padding: "12px 10px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                cursor: canStop && !actionLoading ? "pointer" : "not-allowed",
                border: "none",
                letterSpacing: "0.05em",
                background: canStop ? "linear-gradient(135deg, #dc2626, #b91c1c)" : "#2e1a1a",
                color: canStop ? "#ffffff" : "#fca5a5",
                transition: "transform 0.1s ease, box-shadow 0.1s ease, opacity 0.15s ease",
                fontFamily: "'Space Grotesk', sans-serif",
                boxShadow: canStop ? "0 6px 18px rgba(220,38,38,0.45)" : "none",
                opacity: canStop ? 1 : 0.55
              }}
            >
              ■ Stop
            </button>

            {/* REFRESH */}
            <button
              onClick={fetchStatus}
              disabled={loading || actionLoading}
              style={{
                padding: "12px 10px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                cursor: loading || actionLoading ? "not-allowed" : "pointer",
                border: "1px solid #d1d5db",
                letterSpacing: "0.05em",
                background: "#ffffff",
                color: loading ? "#9ca3af" : "#111827",
                transition: "background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.1s ease",
                fontFamily: "'Space Grotesk', sans-serif",
                boxShadow: "0 3px 10px rgba(15,23,42,0.08)",
                opacity: loading || actionLoading ? 0.7 : 1
              }}
            >
              {loading ? (
                <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>↻ Checking...</span>
              ) : "↻ Status"}
            </button>
          </div>
        </div>

        {/* Activity Log */}
        {log.length > 0 && (
          <div style={{
            padding: "16px 24px 20px",
            background: "#ffffff"
          }}>
            <div style={{
              fontSize: 10,
              color: "#6b7280",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 8
            }}>
              Activity Log
            </div>
            <div style={{
              maxHeight: 140,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              borderRadius: 10,
              border: "1px dashed rgba(148,163,184,0.6)",
              padding: "8px 10px",
              background: "linear-gradient(to bottom, rgba(249,250,251,0.9), rgba(249,250,251,0.7))"
            }}>
              {log.map((l, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 11, alignItems: "baseline" }}>
                  <span style={{ color: "#6b7280", flexShrink: 0, minWidth: 78 }}>{l.ts}</span>
                  <span style={{
                    color:
                      l.type === "error"
                        ? "#b91c1c"
                        : l.type === "success"
                        ? "#15803d"
                        : l.type === "action"
                        ? "#92400e"
                        : "#374151"
                  }}>
                    {l.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, fontSize: 11, color: "#1f2937", textAlign: "center", lineHeight: 1.8 }}>
        Powered by AWS Lambda Function URL
      </div>
    </div>
  );
}

