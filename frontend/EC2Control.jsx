import { useState, useEffect, useCallback } from "react";

// ─── CONFIG: Set your values here ───────────────────────────────────────────
const DEFAULT_INSTANCE_ID = "i-xxxxxxxxxxxxxxxxx";
const DEFAULT_API_ENDPOINT = "https://YOUR_LAMBDA_FUNCTION_URL";
const APP_PASSWORD = "your-secret-password"; // ← change this
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
      minHeight: "100vh", background: "#0a0a0f",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "24px 16px",
      fontFamily: "'IBM Plex Mono', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;600;700&display=swap');
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
        input:focus { outline: none; border-color: #6366f1 !important; }
      `}</style>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.3em", color: "#4b5563",
          textTransform: "uppercase", marginBottom: 8 }}>AWS Infrastructure</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f9fafb", margin: 0,
          fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}>
          EC2 Instance Control
        </h1>
      </div>
      <div style={{
        width: "100%", maxWidth: 380,
        background: "#111116", border: "1px solid #1f2937",
        borderRadius: 16, padding: "32px 28px",
        boxShadow: "0 0 60px rgba(0,0,0,0.6)",
        animation: "fadeIn 0.4s ease",
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
          <div style={{ color: "#9ca3af", fontSize: 14, fontFamily: "'Space Grotesk', sans-serif" }}>
            Enter password to continue
          </div>
        </div>
        <div style={{ animation: shake ? "shake 0.4s ease" : "none" }}>
          <div style={{ position: "relative", marginBottom: 14 }}>
            <input
              type={showPw ? "text" : "password"}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && attempt()}
              placeholder="Password"
              autoFocus
              style={{
                width: "100%", background: "#1a1a24", border: "1px solid #2d3748",
                color: "#e5e7eb", borderRadius: 10, padding: "12px 44px 12px 16px",
                fontSize: 14, fontFamily: "'IBM Plex Mono', monospace",
                boxSizing: "border-box", transition: "border-color 0.2s"
              }}
            />
            <button onClick={() => setShowPw(s => !s)} style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", color: "#4b5563", cursor: "pointer",
              fontSize: 16, padding: 0, lineHeight: 1
            }}>{showPw ? "🙈" : "👁"}</button>
          </div>
          <button onClick={attempt} style={{
            width: "100%", padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 600,
            cursor: "pointer", border: "none", letterSpacing: "0.03em",
            background: "linear-gradient(135deg, #4f46e5, #6366f1)",
            color: "#fff", fontFamily: "'Space Grotesk', sans-serif",
            boxShadow: "0 4px 12px rgba(99,102,241,0.3)", transition: "opacity 0.2s"
          }}>
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
  const [showConfig, setShowConfig] = useState(false);

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
      minHeight: "100vh", background: "#0a0a0f",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "24px 16px",
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
        <div style={{ fontSize: 11, letterSpacing: "0.3em", color: "#4b5563",
          textTransform: "uppercase", marginBottom: 8 }}>AWS Infrastructure</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f9fafb", margin: 0,
          fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}>
          EC2 Instance Control
        </h1>
      </div>

      {/* Main Card */}
      <div style={{
        width: "100%", maxWidth: 480,
        background: "#111116", border: "1px solid #1f2937",
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 0 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)",
        animation: "fadeIn 0.4s ease"
      }}>
        {/* Top status bar */}
        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #111827 100%)",
          borderBottom: "1px solid #1f2937", padding: "20px 24px",
          display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <StatusDot state={state} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: cfg.text,
                fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.01em" }}>
                {cfg.label}
              </div>
              <div style={{ fontSize: 11, color: "#4b5563", marginTop: 2 }}>
                {info?.name || instanceId}
              </div>
            </div>
          </div>
          <button onClick={() => setShowConfig(s => !s)} style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid #2d3748",
            color: "#6b7280", borderRadius: 8, padding: "6px 12px",
            cursor: "pointer", fontSize: 11, letterSpacing: "0.05em"
          }}>⚙ Config</button>
        </div>

        {/* Config Panel */}
        {showConfig && (
          <div style={{ background: "#0d0d12", borderBottom: "1px solid #1f2937",
            padding: "16px 24px", animation: "fadeIn 0.2s ease" }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, color: "#4b5563", letterSpacing: "0.1em",
                textTransform: "uppercase", display: "block", marginBottom: 6 }}>Instance ID</label>
              <input value={instanceId} onChange={e => setInstanceId(e.target.value)}
                style={{ width: "100%", background: "#1a1a24", border: "1px solid #2d3748",
                  color: "#e5e7eb", borderRadius: 8, padding: "8px 12px", fontSize: 12,
                  fontFamily: "'IBM Plex Mono', monospace", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: "#4b5563", letterSpacing: "0.1em",
                textTransform: "uppercase", display: "block", marginBottom: 6 }}>API Endpoint</label>
              <input value={apiEndpoint} onChange={e => setApiEndpoint(e.target.value)}
                style={{ width: "100%", background: "#1a1a24", border: "1px solid #2d3748",
                  color: "#e5e7eb", borderRadius: 8, padding: "8px 12px", fontSize: 12,
                  fontFamily: "'IBM Plex Mono', monospace", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
        )}

        {/* Instance metadata */}
        <div style={{ padding: "8px 24px 0" }}>
          {info && (<>
            <MetaRow label="Instance ID" value={info.instance_id} />
            <MetaRow label="Type" value={info.instance_type} />
            <MetaRow label="Public IP" value={info.public_ip} />
            <MetaRow label="Last Seen" value={new Date().toLocaleTimeString()} />
          </>)}
          {!info && !loading && (
            <div style={{ padding: "20px 0", textAlign: "center", color: "#374151", fontSize: 13 }}>
              Click <span style={{ color: "#6366f1" }}>Refresh Status</span> to load instance info
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ margin: "12px 24px 0", background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px",
            color: "#f87171", fontSize: 12 }}>
            ⚠ {error}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {/* START */}
          <button onClick={() => handleAction("start")}
            disabled={!canStart || actionLoading}
            style={{
              padding: "12px 8px", borderRadius: 10, fontSize: 13, fontWeight: 600,
              cursor: canStart && !actionLoading ? "pointer" : "not-allowed",
              border: "none", letterSpacing: "0.03em",
              background: canStart ? "linear-gradient(135deg, #16a34a, #15803d)" : "#1a2e1a",
              color: canStart ? "#fff" : "#2d4a2d",
              transition: "all 0.2s", fontFamily: "'Space Grotesk', sans-serif",
              boxShadow: canStart ? "0 4px 12px rgba(22,163,74,0.3)" : "none"
            }}>
            ▶ Start
          </button>

          {/* STOP */}
          <button onClick={() => handleAction("stop")}
            disabled={!canStop || actionLoading}
            style={{
              padding: "12px 8px", borderRadius: 10, fontSize: 13, fontWeight: 600,
              cursor: canStop && !actionLoading ? "pointer" : "not-allowed",
              border: "none", letterSpacing: "0.03em",
              background: canStop ? "linear-gradient(135deg, #dc2626, #b91c1c)" : "#2e1a1a",
              color: canStop ? "#fff" : "#4a2d2d",
              transition: "all 0.2s", fontFamily: "'Space Grotesk', sans-serif",
              boxShadow: canStop ? "0 4px 12px rgba(220,38,38,0.3)" : "none"
            }}>
            ■ Stop
          </button>

          {/* REFRESH */}
          <button onClick={fetchStatus} disabled={loading || actionLoading}
            style={{
              padding: "12px 8px", borderRadius: 10, fontSize: 13, fontWeight: 600,
              cursor: loading || actionLoading ? "not-allowed" : "pointer",
              border: "1px solid #2d3748", letterSpacing: "0.03em",
              background: "transparent", color: loading ? "#374151" : "#9ca3af",
              transition: "all 0.2s", fontFamily: "'Space Grotesk', sans-serif"
            }}>
            {loading ? (
              <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>↻</span>
            ) : "↻ Status"}
          </button>
        </div>

        {/* Activity Log */}
        {log.length > 0 && (
          <div style={{ borderTop: "1px solid #1f2937", padding: "12px 24px 20px" }}>
            <div style={{ fontSize: 10, color: "#374151", letterSpacing: "0.1em",
              textTransform: "uppercase", marginBottom: 8 }}>Activity Log</div>
            <div style={{ maxHeight: 120, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
              {log.map((l, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 11, alignItems: "baseline" }}>
                  <span style={{ color: "#374151", flexShrink: 0 }}>{l.ts}</span>
                  <span style={{ color: l.type === "error" ? "#f87171" : l.type === "success" ? "#4ade80" : l.type === "action" ? "#fbbf24" : "#6b7280" }}>
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

