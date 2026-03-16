import { useState, useEffect, useCallback } from "react";

// ─── CONFIG: Set your values here ───────────────────────────────────────────
const Productionv2_INSTANCE_ID = "i-04029e0d7b5c9802b";
// Placeholder for a second instance. Replace this with your new instance ID.
const Development_INSTANCE_ID = "i-03dfb40b5dfab9897"; 


const Development_API_ENDPOINT = "https://pv3ibyl74eh5vnnjwvucoapvve0hohuh.lambda-url.us-east-2.on.aws/";
// Previous endpoint kept as secondary option
const Productionv2_API_ENDPOINT = "https://7rtolhiu35vnthqgqhsvkgfvgm0pveha.lambda-url.us-east-2.on.aws/";



// You can adjust / extend this list to add more connections
const SERVERS = [
  {
    id: "production_server",
    label: "production_server",
    instanceId: Productionv2_INSTANCE_ID,
    apiEndpoint: Productionv2_API_ENDPOINT,
  },
  {
    id: "Development-server",
    label: "Development-server",
    instanceId: Development_INSTANCE_ID,
    apiEndpoint: Development_API_ENDPOINT,
  },
  
];
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
              aria-label={showPw ? "Hide password" : "Show password"}
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
                padding: 0,
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {showPw ? (
                // Eye with slash (hide)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-5 0-9.27-3.11-11-7.5a11.8 11.8 0 0 1 3.06-4.36" />
                  <path d="M6.1 6.1A9.94 9.94 0 0 1 12 4c5 0 9.27 3.11 11 7.5a11.82 11.82 0 0 1-2.33 3.41" />
                  <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
                  <path d="M1 1l22 22" />
                </svg>
              ) : (
                // Normal eye (show)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12S4 5 12 5s11 7 11 7-3 7-11 7S1 12 1 12Z" />
                  <circle cx="12" cy="12" r="3.5" />
                </svg>
              )}
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
  const [selectedServerId, setSelectedServerId] = useState(SERVERS[0].id);
  const [instanceId, setInstanceId] = useState(SERVERS[0].instanceId);
  const [apiEndpoint, setApiEndpoint] = useState(SERVERS[0].apiEndpoint);
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

  const currentServer =
    SERVERS.find((s) => s.id === selectedServerId) || SERVERS[0];

  const handleServerChange = (e) => {
    const nextId = e.target.value;
    const next = SERVERS.find((s) => s.id === nextId);
    if (!next) return;
    setSelectedServerId(next.id);
    setInstanceId(next.instanceId);
    setApiEndpoint(next.apiEndpoint);
    setInfo(null);
    setError(null);
    setLog([]);
    addLog(`Switched to ${next.label}`, "info");
  };

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  return (
    <div
      className="ec2-root"
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;600;700&display=swap');
        @keyframes ping { 75%,100%{transform:scale(2);opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#333;border-radius:2px}

        /* Responsive layout tweaks */
        .ec2-root {
          padding: 32px 16px;
        }

        .ec2-controls-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        @media (max-width: 640px) {
          .ec2-root {
            padding: 20px 12px;
          }

          .ec2-controls-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (min-width: 641px) and (max-width: 900px) {
          .ec2-controls-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
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
        <div
          style={{
            background: "#f9fafb",
            borderBottom: "1px solid #e5e7eb",
            padding: "16px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <StatusDot state={state} />
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#111827",
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: "-0.01em",
                }}
              >
                {currentServer.label}
              </div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                Current state: {cfg.label}
              </div>
            </div>
          </div>

          {/* Server selector */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
            }}
          >
            <span
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#6b7280",
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              Target
            </span>
            <select
              value={selectedServerId}
              onChange={handleServerChange}
              style={{
                fontSize: 12,
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid #d1d5db",
                background: "#ffffff",
                fontFamily: "'IBM Plex Mono', monospace",
                cursor: "pointer",
              }}
            >
              {SERVERS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
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
          <div
            className="ec2-controls-grid"
            style={{
              gap: 12,
            }}
          >
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
                background: loading || actionLoading ? "#f3f4f6" : "#ffffff",
                color: loading || actionLoading ? "#9ca3af" : "#111827",
                transition: "background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.1s ease",
                fontFamily: "'Space Grotesk', sans-serif",
                boxShadow: "0 3px 10px rgba(15,23,42,0.08)",
                opacity: loading || actionLoading ? 0.8 : 1
              }}
            >
              {loading || actionLoading ? (
                <span>{loading ? "Checking..." : "Processing..."}</span>
              ) : (
                "Status"
              )}
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

