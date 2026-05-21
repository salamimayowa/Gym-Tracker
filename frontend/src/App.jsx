import { useState, useEffect, useCallback } from "react";

// ── CONFIG ──────────────────────────────────────────────────────────────────
const BASE_URL = "http://localhost:8080/api/v1";

const api = async (path, method = "GET", body = null, token = null) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE_URL}${path}`, opts);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `HTTP ${res.status}`);
  }
  return res.json();
};

// ── ICONS (inline SVG) ───────────────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    dumbbell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M3 9.5V6a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3.5"/><path d="M21 9.5V6a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-3.5"/><path d="M3 12h3"/><path d="M18 12h3"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    qr: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="5" y="5" width="3" height="3"/><rect x="16" y="5" width="3" height="3"/><rect x="16" y="16" width="3" height="3"/><rect x="5" y="16" width="3" height="3"/></svg>,
    report: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    zap: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  };
  return icons[name] || null;
};

// ── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0a0a0f;
      --surface: #111118;
      --surface2: #1a1a24;
      --border: #2a2a3a;
      --accent: #c8ff00;
      --accent2: #ff6b35;
      --text: #f0f0f8;
      --muted: #6b6b8a;
      --danger: #ff3b3b;
      --success: #00e676;
      --radius: 12px;
      --font-display: 'Bebas Neue', cursive;
      --font-body: 'DM Sans', sans-serif;
    }

    body {
      background:" var(--bg)";
      color: var(--text);
      font-family: var(--font-body);
      min-height: 100vh;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes slideIn {
      from { transform: translateX(-100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .fade-up { animation: fadeUp 0.4s ease both; }
    .fade-up-d1 { animation: fadeUp 0.4s 0.1s ease both; }
    .fade-up-d2 { animation: fadeUp 0.4s 0.2s ease both; }
    .fade-up-d3 { animation: fadeUp 0.4s 0.3s ease both; }

    input, select, textarea {
      width: 100%;
      background: var(--surface2);
      border: 1px solid var(--border);
      color: var(--text);
      font-family: var(--font-body);
      font-size: 14px;
      padding: 12px 16px;
      border-radius: var(--radius);
      outline: none;
      transition: border-color 0.2s;
    }
    input:focus, select:focus, textarea:focus {
      border-color: var(--accent);
    }
    input::placeholder { color: var(--muted); }

    button {
      font-family: var(--font-body);
      cursor: pointer;
      border: none;
      outline: none;
      transition: all 0.2s;
    }
    button:active { transform: scale(0.97); }
  `}</style>
);

// ── COMPONENTS ───────────────────────────────────────────────────────────────
const Spinner = () => (
  <div style={{
    width: 20, height: 20, border: "2px solid var(--border)",
    borderTopColor: "var(--accent)", borderRadius: "50%",
    animation: "spin 0.7s linear infinite", display: "inline-block"
  }} />
);

const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
    return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: type === "error" ? "#2a0f0f" : "#0f2a0f",
      border: `1px solid ${type === "error" ? "var(--danger)" : "var(--success)"}`,
      color: type === "error" ? "var(--danger)" : "var(--success)",
      padding: "12px 20px", borderRadius: "var(--radius)", fontSize: 14,
      display: "flex", gap: 10, alignItems: "center",
      animation: "fadeUp 0.3s ease",
      maxWidth: 320, boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
    }}>
      <Icon name={type === "error" ? "x" : "check"} size={16} />
      {msg}
    </div>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, backdropFilter: "blur(4px)", padding: 20
  }} onClick={e => e.target === e.currentTarget && onClose()}>
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 16, padding: 28, width: "100%", maxWidth: 480,
      animation: "fadeUp 0.3s ease"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 1 }}>{title}</h2>
        <button onClick={onClose} style={{
          background: "var(--surface2)", border: "1px solid var(--border)",
          color: "var(--muted)", borderRadius: 8, padding: "6px 8px",
          display: "flex", alignItems: "center"
        }}><Icon name="x" size={16} /></button>
      </div>
      {children}
    </div>
  </div>
);

const Btn = ({ onClick, children, variant = "primary", loading, style: s = {}, disabled }) => {
  const styles = {
    primary: { background: "var(--accent)", color: "#0a0a0f", fontWeight: 600 },
    secondary: { background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" },
    danger: { background: "transparent", color: "var(--danger)", border: "1px solid var(--danger)" },
    ghost: { background: "transparent", color: "var(--muted)" },
  };
    return (
    <button onClick={onClick} disabled={loading || disabled} style={{
      padding: "11px 20px", borderRadius: "var(--radius)", fontSize: 14,
      display: "flex", alignItems: "center", gap: 8,
      opacity: (loading || disabled) ? 0.6 : 1,
      ...styles[variant], ...s
    }}>
      {loading ? <Spinner /> : children}
    </button>
  );
};

const Field = ({ label, error, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>{label}</label>
    {children}
    {error && <span style={{ fontSize: 12, color: "var(--danger)" }}>{error}</span>}
  </div>
);

// ── AUTH SCREENS ─────────────────────────────────────────────────────────────
const AuthScreen = ({ onAuth }) => {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "", username: "", email: "", password: "", gender: "Male", dob: "", role: "USER"
  });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "login") {
        const res = await api("/login", "POST", { email: form.email, password: form.password, role: form.role });
        if (res.responseCode === "00") onAuth(res.token, form.email, res.role || form.role);
        else setError(res.responseMessage || "Login failed");
      } else {
        if (!form.dob) {
          setError("Date of Birth is required (yyyy-MM-dd)");
          return;
        }
        const res = await api("/register", "POST", {
          fullName: form.fullName, username: form.username,
          email: form.email, password: form.password,
          gender: form.gender, dob: form.dob
        });
        if (res.responseCode === "00") { setMode("login"); setError(""); alert("Registered! Please login."); }
        else setError(res.responseMessage || "Registration failed");
      }
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: 20,
      background: "radial-gradient(ellipse at 30% 20%, #1a2a00 0%, var(--bg) 60%)"
    }}>
      {/* Logo */}
      <div className="fade-up" style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{
          width: 60, height: 60, background: "var(--accent)", borderRadius: 16,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px", color: "#0a0a0f"
        }}>
          <Icon name="dumbbell" size={28} />
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: 42, letterSpacing: 3,
          color: "var(--accent)", lineHeight: 1
        }}>GYMTRACKER</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>Union Fitness Center</p>
      </div>

      {/* Card */}
      <div className="fade-up-d1" style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 20, padding: 32, width: "100%", maxWidth: 420
      }}>
        {/* Tab */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          background: "var(--surface2)", borderRadius: 10, padding: 4, marginBottom: 28
        }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
              padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              textTransform: "capitalize",
              background: mode === m ? "var(--accent)" : "transparent",
              color: mode === m ? "#0a0a0f" : "var(--muted)"
            }}>{m}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {mode === "register" && (
            <>
              <Field label="Full Name"><input value={form.fullName} onChange={set("fullName")} placeholder="Lastname Firstname" /></Field>
              <Field label="Username"><input value={form.username} onChange={set("username")} placeholder="@username" /></Field>
            </>
          )}
          {mode === "login" && (
            <Field label="Role">
              <select value={form.role} onChange={set("role")}>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </Field>
          )}
          <Field label="Email"><input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" /></Field>
          <Field label="Password"><input type="password" value={form.password} onChange={set("password")} placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special" /></Field>
          {mode === "register" && (
            <>
              <Field label="Gender">
                <select value={form.gender} onChange={set("gender")}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </Field>
              <Field label="Date of Birth (yyyy-MM-dd)">
                <input type="date" value={form.dob} onChange={set("dob")} />
              </Field>
            </>
          )}
        </div>

        {error && (
          <div style={{
            margin: "16px 0 0", padding: "10px 14px", background: "#2a0f0f",
            border: "1px solid var(--danger)", borderRadius: 8, fontSize: 13, color: "var(--danger)"
          }}>{error}</div>
        )}

        <Btn onClick={submit} loading={loading} style={{ width: "100%", marginTop: 24, justifyContent: "center", padding: "14px" }}>
          {mode === "login" ? "Login" : "Create Account"}
        </Btn>
      </div>
    </div>
  );
};

// ── SIDEBAR NAV ───────────────────────────────────────────────────────────────
const Sidebar = ({ active, setActive, onLogout, isAdmin }) => {
  const items = [
    { id: "dashboard", icon: "zap", label: "Dashboard" },
    { id: "available", icon: "clock", label: "Availability" },
    ...(isAdmin ? [
      { id: "adminManage", icon: "calendar", label: "Manage User" },
      { id: "report", icon: "report", label: "Reports" },
      { id: "qr", icon: "qr", label: "QR Code" },
      { id: "adminRegister", icon: "user", label: "Create Admin" },
    ] : [
      { id: "sessions", icon: "calendar", label: "My Sessions" },
      { id: "book", icon: "plus", label: "Book Session" },
      { id: "workout", icon: "dumbbell", label: "Log Workout" },
      { id: "workouts", icon: "dumbbell", label: "My Workouts" },
    ]),
  ];

  return (
    <div style={{
      width: 220, background: "var(--surface)", borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column", padding: "24px 12px",
      position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100,
      animation: "slideIn 0.3s ease"
    }}>
      <div style={{ padding: "0 8px 24px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "var(--accent)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#0a0a0f", flexShrink: 0 }}>
            <Icon name="dumbbell" size={18} />
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 2, color: "var(--accent)" }}>GYMTRACKER</span>
        </div>
      </div>

      <nav style={{ flex: 1, marginTop: 16, display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map(({ id, icon, label }) => (
          <button key={id} onClick={() => setActive(id)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
            borderRadius: 10, background: active === id ? "rgba(200,255,0,0.12)" : "transparent",
            color: active === id ? "var(--accent)" : "var(--muted)",
            fontSize: 14, fontWeight: active === id ? 600 : 400,
            textAlign: "left", width: "100%",
            borderLeft: active === id ? "3px solid var(--accent)" : "3px solid transparent"
          }}>
            <Icon name={icon} size={18} />
            {label}
          </button>
        ))}
      </nav>

      <button onClick={onLogout} style={{
        display: "flex", alignItems: "center", gap: 10, padding: "11px 14px",
        borderRadius: 10, background: "transparent", color: "var(--muted)",
        fontSize: 14, width: "100%", textAlign: "left",
        borderTop: "1px solid var(--border)", paddingTop: 14, marginTop: 8
      }}>
        <Icon name="logout" size={18} /> Logout
      </button>
    </div>
  );
};

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
const Dashboard = ({ token, setActive, refreshTick, isAdmin }) => {
  const [sessions, setSessions] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      setSessions([]);
      setWorkouts([]);
      setLoading(false);
      return;
    }

    Promise.all([
      api("/view", "GET", null, token),
      api("/workouts", "GET", null, token),
    ])
      .then(([sessionRes, workoutRes]) => {
        setSessions(sessionRes.bookedSessions || sessionRes.sessions || []);
        setWorkouts(workoutRes.workouts || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, refreshTick, isAdmin]);

  const upcoming = sessions.filter(s => new Date(s.startTime) > new Date()).length;
  const utilized = sessions.filter(s => s.utilize).length;
  const workoutsLogged = workouts.length;

  const stats = [
    { label: "Total Sessions", value: sessions.length, icon: "calendar", color: "var(--accent)" },
    { label: "Upcoming", value: upcoming, icon: "clock", color: "#64b5f6" },
    { label: "Completed", value: utilized, icon: "check", color: "var(--success)" },
    { label: "Workouts", value: workoutsLogged, icon: "dumbbell", color: "var(--accent2)" },
  ];

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, letterSpacing: 2, marginBottom: 4 }}>DASHBOARD</h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 32 }}>Welcome back! Here's your gym overview.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 16, padding: 24,
            borderTop: `3px solid ${s.color}`
          }}>
            <div style={{ color: s.color, marginBottom: 12 }}><Icon name={s.icon} size={24} /></div>
            {loading ? <div style={{ width: 40, height: 32, background: "var(--surface2)", borderRadius: 6, animation: "pulse 1.5s infinite" }} /> :
              <div style={{ fontFamily: "var(--font-display)", fontSize: 40, color: s.color }}>{s.value}</div>}
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent sessions */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 1 }}>RECENT SESSIONS</h3>
          {!isAdmin && <Btn variant="ghost" onClick={() => setActive("sessions")} style={{ fontSize: 13 }}>View all →</Btn>}
        </div>
        {loading ? <div style={{ color: "var(--muted)", textAlign: "center", padding: 24 }}><Spinner /></div> :
          sessions.length === 0 ? (
            <div style={{ textAlign: "center", padding: 32, color: "var(--muted)" }}>
              <p style={{ marginBottom: 16 }}>{isAdmin ? "Use Manage User to book sessions for members." : "No sessions booked yet."}</p>
              {!isAdmin ? <Btn onClick={() => setActive("book")}><Icon name="plus" size={16} /> Book Your First Session</Btn> : <Btn onClick={() => setActive("adminManage")}><Icon name="user" size={16} /> Manage a User</Btn>}
            </div>
          ) : sessions.slice(0, 5).map(s => <SessionRow key={s.id} session={s} />)}
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, marginTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 1 }}>RECENT WORKOUTS</h3>
          {!isAdmin && <Btn variant="ghost" onClick={() => setActive("workouts")} style={{ fontSize: 13 }}>View all →</Btn>}
        </div>
        {loading ? <div style={{ color: "var(--muted)", textAlign: "center", padding: 24 }}><Spinner /></div> :
          workouts.length === 0 ? (
            <div style={{ textAlign: "center", padding: 32, color: "var(--muted)" }}>
              <p style={{ marginBottom: 16 }}>No workouts logged yet.</p>
              {!isAdmin && <Btn onClick={() => setActive("workout")}><Icon name="dumbbell" size={16} /> Log Your First Workout</Btn>}
            </div>
          ) : workouts.slice(0, 5).map(workout => (
            <div key={workout.id} style={{ padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{workout.exerciseName}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{workout.sets} sets x {workout.targetReps} reps</div>
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{workout.workoutDate}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

// ── SESSION ROW ───────────────────────────────────────────────────────────────
const SessionRow = ({ session, onEdit, onDelete }) => {
  const dt = new Date(session.startTime);
  const isPast = dt < new Date();
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16, padding: "14px 0",
      borderBottom: "1px solid var(--border)"
    }}>
      <div style={{
        width: 44, height: 44, background: session.utilize ? "rgba(0,230,118,0.12)" : isPast ? "var(--surface2)" : "rgba(200,255,0,0.1)",
        borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        border: `1px solid ${session.utilize ? "var(--success)" : isPast ? "var(--border)" : "var(--accent)"}`,
        flexShrink: 0
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: session.utilize ? "var(--success)" : isPast ? "var(--muted)" : "var(--accent)" }}>
          {dt.toLocaleString("en", { month: "short" }).toUpperCase()}
        </span>
        <span style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>{dt.getDate()}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} — {new Date(session.endTime || dt.getTime() + 3600000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{dt.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
      </div>
      <div style={{
        fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20,
        background: session.utilize ? "rgba(0,230,118,0.12)" : isPast ? "var(--surface2)" : "rgba(200,255,0,0.1)",
        color: session.utilize ? "var(--success)" : isPast ? "var(--muted)" : "var(--accent)",
        border: `1px solid ${session.utilize ? "var(--success)" : isPast ? "var(--border)" : "rgba(200,255,0,0.3)"}`
      }}>
        {session.utilize ? "USED" : isPast ? "EXPIRED" : "UPCOMING"}
      </div>
      {onEdit && !isPast && <button onClick={() => onEdit(session)} style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 8, padding: "6px 8px", display: "flex" }}><Icon name="edit" size={14} /></button>}
      {onDelete && <button onClick={() => onDelete(session)} style={{ background: "rgba(255,59,59,0.1)", border: "1px solid rgba(255,59,59,0.3)", color: "var(--danger)", borderRadius: 8, padding: "6px 8px", display: "flex" }}><Icon name="trash" size={14} /></button>}
    </div>
  );
};

// ── MY SESSIONS ───────────────────────────────────────────────────────────────
const MySessions = ({ token, toast, refreshTick, onSuccess }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState(null);
  const [newTime, setNewTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    api("/view", "GET", null, token)
      .then(r => setSessions(r.bookedSessions || r.sessions || []))
      .catch(() => toast("Failed to load sessions", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token, refreshTick]);

  const deleteSession = async (s) => {
    if (!confirm("Delete this session?")) return;
    try {
      const r = await api("/delete", "DELETE", { sessionId: s.id }, token);
      toast(r.responseMessage || "Deleted", r.responseCode === "00" ? "success" : "error");
      if (r.responseCode === "00") {
        load();
        onSuccess?.();
      }
    } catch (e) { toast(e.message, "error"); }
  };

  const editSession = async () => {
    if (!newTime) return;
    setSubmitting(true);
    try {
      const r = await api("/edit", "PUT", { sessionId: editTarget.id, newTime: newTime + ":00" }, token);
      toast(r.responseMessage, r.responseCode === "00" ? "success" : "error");
      if (r.responseCode === "00") { setEditTarget(null); load(); onSuccess?.(); }
    } catch (e) { toast(e.message, "error"); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, letterSpacing: 2, marginBottom: 4 }}>MY SESSIONS</h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 32 }}>Manage all your booked gym sessions.</p>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 48 }}><Spinner /></div>
        ) : sessions.length === 0 ? (
          <div style={{ textAlign: "center", padding: 48, color: "var(--muted)" }}>No sessions found.</div>
        ) : sessions.sort((a, b) => new Date(b.startTime) - new Date(a.startTime)).map(s => (
          <SessionRow key={s.id} session={s}
            onEdit={setEditTarget}
            onDelete={deleteSession}
          />
        ))}
      </div>

      {editTarget && (
        <Modal title="Reschedule Session" onClose={() => setEditTarget(null)}>
          <Field label="New Date & Time">
            <input type="datetime-local" value={newTime} onChange={e => setNewTime(e.target.value)} />
          </Field>
          <div style={{ marginTop: 4, fontSize: 12, color: "var(--muted)" }}>Must be at least 24 hours from now.</div>
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <Btn onClick={editSession} loading={submitting}>Save Changes</Btn>
            <Btn variant="secondary" onClick={() => setEditTarget(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── BOOK SESSION ──────────────────────────────────────────────────────────────
const BookSession = ({ token, toast, onSuccess }) => {
  const [startTime, setStartTime] = useState("");
  const [loading, setLoading] = useState(false);

  const book = async () => {
    if (!startTime) return;
    setLoading(true);
    try {
      const r = await api("/bookSession", "POST", { startTime: startTime + ":00" }, token);
      toast(r.responseMessage, r.responseCode === "00" ? "success" : "error");
      if (r.responseCode === "00") {
        setStartTime("");
        onSuccess?.();
      }
    } catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  };

  const minDateTime = () => {
    const d = new Date();
    d.setHours(d.getHours() + 25);
    return d.toISOString().slice(0, 16);
  };

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, letterSpacing: 2, marginBottom: 4 }}>BOOK SESSION</h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 32 }}>Reserve your gym slot at Union Fitness Center.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 28 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 1, marginBottom: 24 }}>SELECT DATE & TIME</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label="Start Time">
              <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} min={minDateTime()} />
            </Field>
            <Btn onClick={book} loading={loading} style={{ justifyContent: "center", padding: 14 }}>
              <Icon name="calendar" size={16} /> Book Session
            </Btn>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "clock", title: "24-Hour Notice", desc: "Sessions must be booked at least 24 hours in advance." },
            { icon: "user", title: "Max 2 Per Day", desc: "You can book a maximum of 2 sessions per day." },
            { icon: "check", title: "Capacity: 50", desc: "Each time slot accommodates up to 50 members." },
            { icon: "calendar", title: "1 Hour Sessions", desc: "Each session runs for exactly 1 hour." },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ color: "var(--accent)", marginTop: 2 }}><Icon name={icon} size={18} /></div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── AVAILABILITY ──────────────────────────────────────────────────────────────
const Availability = ({ token, toast, onSlotClick, isAdmin = false }) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    setLoading(true);
    try {
      const r = await api("/available", "POST", { date }, token);
      setSlots(r.availabilityList || r.hourAvailabilityList || []);
    } catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, letterSpacing: 2, marginBottom: 4 }}>AVAILABILITY</h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 32 }}>Check available time slots for any date.</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 32, alignItems: "flex-end" }}>
        <div style={{ flex: 1, maxWidth: 240 }}>
          <Field label="Select Date">
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </Field>
        </div>
        <Btn onClick={check} loading={loading}><Icon name="check" size={16} /> Check Slots</Btn>
      </div>

      {slots.length > 0 && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 1, marginBottom: 20 }}>
            SLOTS FOR {new Date(date + "T12:00:00").toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" }).toUpperCase()}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8 }}>
            {slots.map(({ hour, available }) => {
              const h = hour % 12 || 12;
              const ampm = hour < 12 ? "AM" : "PM";
              const slotTime = `${date}T${String(hour).padStart(2, "0")}:00:00`;
              return (
                <button key={hour} onClick={() => {
                  if (!available) return;
                  onSlotClick?.(slotTime);
                }} disabled={!available} style={{
                  padding: "14px 8px", borderRadius: 10, textAlign: "center",
                  background: available ? "rgba(200,255,0,0.08)" : "rgba(255,59,59,0.08)",
                  border: `1px solid ${available ? "rgba(200,255,0,0.3)" : "rgba(255,59,59,0.3)"}`,
                  color: available ? "var(--accent)" : "var(--danger)",
                  opacity: available ? 1 : 0.6,
                  cursor: available ? "pointer" : "not-allowed"
                }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 20 }}>{h}:00</div>
                  <div style={{ fontSize: 11, opacity: 0.7 }}>{ampm}</div>
                  <div style={{ fontSize: 10, marginTop: 4, fontWeight: 600 }}>{available ? (isAdmin ? "SELECT" : "BOOK") : "FULL"}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ── WORKOUT ───────────────────────────────────────────────────────────────────
const WorkoutLog = ({ token, toast, onSuccess }) => {
  const [form, setForm] = useState({ exerciseName: "", targetReps: "", sets: "", workoutDate: "" });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setLoading(true);
    try {
      const r = await api("/workout", "POST", {
        exerciseName: form.exerciseName,
        targetReps: parseInt(form.targetReps),
        sets: parseInt(form.sets),
        workoutDate: form.workoutDate
      }, token);
      toast(r.responseMessage, r.responseCode === "00" ? "success" : "error");
      if (r.responseCode === "00") {
        setForm({ exerciseName: "", targetReps: "", sets: "", workoutDate: "" });
        onSuccess?.();
      }
    } catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  };

  const exercises = ["Bench Press", "Squat", "Deadlift", "Pull-Up", "Overhead Press", "Barbell Row", "Lunges", "Dips", "Bicep Curl", "Tricep Extension", "Leg Press", "Shoulder Press"];

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, letterSpacing: 2, marginBottom: 4 }}>LOG WORKOUT</h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 32 }}>Track your exercises, sets, and reps.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 28 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 1, marginBottom: 24 }}>NEW EXERCISE</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Exercise Name">
              <input list="exercises" value={form.exerciseName} onChange={set("exerciseName")} placeholder="e.g. Bench Press" />
              <datalist id="exercises">{exercises.map(e => <option key={e} value={e} />)}</datalist>
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Sets">
                <input type="number" min="1" value={form.sets} onChange={set("sets")} placeholder="3" />
              </Field>
              <Field label="Target Reps">
                <input type="number" min="1" value={form.targetReps} onChange={set("targetReps")} placeholder="10" />
              </Field>
            </div>
            <Field label="Workout Date">
              <input type="date" value={form.workoutDate} onChange={set("workoutDate")} min={new Date().toISOString().split("T")[0]} />
            </Field>
            <Btn onClick={submit} loading={loading} style={{ justifyContent: "center", padding: 14 }}>
              <Icon name="dumbbell" size={16} /> Log Workout
            </Btn>
          </div>
        </div>

        {/* Quick templates */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 28 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 1, marginBottom: 20 }}>QUICK TEMPLATES</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { name: "Push Day", exercises: "Bench Press, Overhead Press, Dips" },
              { name: "Pull Day", exercises: "Deadlift, Barbell Row, Pull-Up" },
              { name: "Leg Day", exercises: "Squat, Leg Press, Lunges" },
            ].map(t => (
              <div key={t.name} style={{ background: "var(--surface2)", borderRadius: 10, padding: "14px 16px", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: "var(--accent)" }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{t.exercises}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── MY WORKOUTS ──────────────────────────────────────────────────────────────
const MyWorkouts = ({ token, toast, refreshTick }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api("/workouts", "GET", null, token)
      .then(r => setWorkouts(r.workouts || []))
      .catch(() => toast("Failed to load workouts", "error"))
      .finally(() => setLoading(false));
  }, [token, refreshTick]);

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, letterSpacing: 2, marginBottom: 4 }}>MY WORKOUTS</h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 32 }}>Review your logged workouts.</p>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 48 }}><Spinner /></div>
        ) : workouts.length === 0 ? (
          <div style={{ textAlign: "center", padding: 48, color: "var(--muted)" }}>No workouts logged yet.</div>
        ) : workouts.map(workout => (
          <div key={workout.id} style={{ padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{workout.exerciseName}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{workout.sets} sets x {workout.targetReps} reps</div>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{workout.workoutDate}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── ADMIN MANAGE USER ───────────────────────────────────────────────────────
const AdminManageUser = ({ token, toast, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingTime, setBookingTime] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [slots, setSlots] = useState([]);

  const loadProfile = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const r = await api("/admin/user-data", "POST", { email }, token);
      if (r.responseCode === "00") {
        setProfile(r);
      } else {
        setProfile(null);
        toast(r.responseMessage, "error");
      }
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const checkSlots = async () => {
    setLoading(true);
    try {
      const r = await api("/available", "POST", { date: selectedDate }, token);
      setSlots(r.availabilityList || []);
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const bookForUser = async () => {
    if (!email || !bookingTime) return;
    setLoading(true);
    try {
      const r = await api("/admin/bookSession", "POST", { email, startTime: bookingTime + ":00" }, token);
      toast(r.responseMessage, r.responseCode === "00" ? "success" : "error");
      if (r.responseCode === "00") {
        setBookingTime("");
        await loadProfile();
        onSuccess?.();
      }
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId) => {
    if (!confirm("Delete this session for the user?")) return;
    setLoading(true);
    try {
      const r = await api("/admin/session", "DELETE", { email, resourceId: sessionId }, token);
      toast(r.responseMessage, r.responseCode === "00" ? "success" : "error");
      if (r.responseCode === "00") await loadProfile();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkout = async (workoutId) => {
    if (!confirm("Delete this workout for the user?")) return;
    setLoading(true);
    try {
      const r = await api("/admin/workout", "DELETE", { email, resourceId: workoutId }, token);
      toast(r.responseMessage, r.responseCode === "00" ? "success" : "error");
      if (r.responseCode === "00") await loadProfile();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, letterSpacing: 2, marginBottom: 4 }}>MANAGE USER</h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 32 }}>Search by email to book, inspect, or delete user records.</p>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <Field label="User Email">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="member@example.com" />
            </Field>
          </div>
          <Btn onClick={loadProfile} loading={loading}><Icon name="user" size={16} /> Load User</Btn>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 1, marginBottom: 16 }}>BOOK FOR USER</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Date">
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
            </Field>
            <Btn onClick={checkSlots} loading={loading} variant="secondary"><Icon name="clock" size={16} /> Check Availability</Btn>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))", gap: 8 }}>
              {slots.map(({ hour, available }) => {
                const slotTime = `${selectedDate}T${String(hour).padStart(2, "0")}:00:00`;
                return (
                  <button key={hour} disabled={!available} onClick={() => available && setBookingTime(slotTime.slice(0, 16))} style={{
                    padding: "10px 8px", borderRadius: 10, border: `1px solid ${available ? "rgba(200,255,0,0.3)" : "rgba(255,59,59,0.3)"}`,
                    background: bookingTime === slotTime.slice(0, 16) ? "rgba(200,255,0,0.18)" : available ? "rgba(200,255,0,0.08)" : "rgba(255,59,59,0.08)",
                    color: available ? "var(--accent)" : "var(--danger)", opacity: available ? 1 : 0.6
                  }}>
                    {String(hour).padStart(2, "0")}:00
                  </button>
                );
              })}
            </div>
            <Field label="Selected Booking Time">
              <input type="datetime-local" value={bookingTime} onChange={e => setBookingTime(e.target.value)} />
            </Field>
            <Btn onClick={bookForUser} loading={loading}><Icon name="calendar" size={16} /> Book For User</Btn>
          </div>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 1, marginBottom: 16 }}>USER DATA</h3>
          {!profile ? (
            <div style={{ color: "var(--muted)", padding: 24, textAlign: "center" }}>Load a user to see sessions and workouts.</div>
          ) : (
            <>
              <div style={{ marginBottom: 16, color: "var(--muted)", fontSize: 13 }}>{profile.sessions?.length || 0} sessions, {profile.workouts?.length || 0} workouts</div>
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 10 }}>Sessions</div>
                  {(profile.sessions || []).length === 0 ? <div style={{ color: "var(--muted)", fontSize: 13 }}>No sessions</div> : profile.sessions.map(session => (
                    <div key={session.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                      <div style={{ fontSize: 13 }}>{new Date(session.startTime).toLocaleString()}</div>
                      <Btn variant="danger" onClick={() => deleteSession(session.id)} style={{ padding: "8px 10px" }}><Icon name="trash" size={14} /> Delete</Btn>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 10 }}>Workouts</div>
                  {(profile.workouts || []).length === 0 ? <div style={{ color: "var(--muted)", fontSize: 13 }}>No workouts</div> : profile.workouts.map(workout => (
                    <div key={workout.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                      <div style={{ fontSize: 13 }}>{workout.exerciseName} - {workout.workoutDate}</div>
                      <Btn variant="danger" onClick={() => deleteWorkout(workout.id)} style={{ padding: "8px 10px" }}><Icon name="trash" size={14} /> Delete</Btn>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── REPORT (ADMIN) ────────────────────────────────────────────────────────────
const Report = ({ token, toast }) => {
  const [time, setTime] = useState("");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch_ = async () => {
    setLoading(true);
    try {
      const r = await api("/report", "POST", { time: time ? time + ":00" : new Date().toISOString().slice(0, 19) }, token);
      setSessions(r.sessions || []);
      if (r.responseCode !== "00") toast(r.responseMessage, "error");
    } catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, letterSpacing: 2, marginBottom: 4 }}>SESSION REPORT</h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 32 }}>Admin view of all gym sessions.</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "flex-end" }}>
        <div style={{ flex: 1, maxWidth: 280 }}>
          <Field label="From Date & Time">
            <input type="datetime-local" value={time} onChange={e => setTime(e.target.value)} />
          </Field>
        </div>
        <Btn onClick={fetch_} loading={loading}><Icon name="report" size={16} /> Generate Report</Btn>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}>
        {sessions.length === 0 ? (
          <div style={{ textAlign: "center", padding: 48, color: "var(--muted)" }}>Run a report to see sessions.</div>
        ) : (
          <>
            <div style={{ marginBottom: 16, color: "var(--muted)", fontSize: 13 }}>{sessions.length} sessions found</div>
            {sessions.map(s => <SessionRow key={s.id} session={s} />)}
          </>
        )}
      </div>
    </div>
  );
};

// ── QR CODE (ADMIN) ───────────────────────────────────────────────────────────
const QRCode = ({ token, toast }) => {
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const r = await api("/generate-qr", "GET", null, token);
      if (r.responseCode === "00") setQr(r.qrCode || r.responseMessage);
      else toast(r.responseMessage, "error");
    } catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, letterSpacing: 2, marginBottom: 4 }}>QR CODE</h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 32 }}>Generate session check-in QR code.</p>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 32, flex: 1, minWidth: 240 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 1, marginBottom: 20 }}>GENERATE QR</h3>
          <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 24, lineHeight: 1.7 }}>
            Generate a QR code that members can scan to mark their session as utilized when they arrive at the gym.
          </p>
          <Btn onClick={generate} loading={loading} style={{ justifyContent: "center", width: "100%", padding: 14 }}>
            <Icon name="qr" size={16} /> Generate QR Code
          </Btn>
        </div>

        {qr && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--accent)", borderRadius: 16, padding: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <img src={`data:image/png;base64,${qr}`} alt="QR Code" style={{ width: 200, height: 200, borderRadius: 8 }} />
            <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center" }}>Members scan this to check in</p>
            <Btn variant="secondary" onClick={() => {
              const a = document.createElement("a"); a.href = `data:image/png;base64,${qr}`;
              a.download = "gym-checkin-qr.png"; a.click();
            }}>Download QR</Btn>
          </div>
        )}
      </div>
    </div>
  );
};

// ── ADMIN REGISTER (ADMIN) ──────────────────────────────────────────────────
const AdminRegister = ({ token, toast }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "", username: "", email: "", password: "", gender: "Male", dob: ""
  });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setLoading(true);
    try {
      const r = await api("/admin/register", "POST", {
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
        gender: form.gender,
        dob: form.dob,
      }, token);
      toast(r.responseMessage, r.responseCode === "00" ? "success" : "error");
      if (r.responseCode === "00") {
        setForm({ fullName: "", username: "", email: "", password: "", gender: "Male", dob: "" });
      }
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, letterSpacing: 2, marginBottom: 4 }}>CREATE ADMIN</h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 32 }}>Admin-only flow to create another admin account.</p>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 28, maxWidth: 620 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Full Name"><input value={form.fullName} onChange={set("fullName")} placeholder="Lastname Firstname" /></Field>
          <Field label="Username"><input value={form.username} onChange={set("username")} placeholder="@adminuser" /></Field>
          <Field label="Email"><input type="email" value={form.email} onChange={set("email")} placeholder="admin@example.com" /></Field>
          <Field label="Password"><input type="password" value={form.password} onChange={set("password")} placeholder="Strong password" /></Field>
          <Field label="Gender">
            <select value={form.gender} onChange={set("gender")}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </Field>
          <Field label="Date of Birth (yyyy-MM-dd)"><input type="date" value={form.dob} onChange={set("dob")} /></Field>
        </div>
        <div style={{ marginTop: 20 }}>
          <Btn onClick={submit} loading={loading}><Icon name="user" size={16} /> Create Admin Account</Btn>
        </div>
      </div>
    </div>
  );
};

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("gt_token") || null);
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("gt_email") || "");
  const [userRole, setUserRole] = useState(() => localStorage.getItem("gt_role") || "USER");
  const [active, setActive] = useState("dashboard");
  const [toast_, setToast] = useState(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const isAdmin = userRole === "ADMIN";

  const toast = useCallback((msg, type = "success") => setToast({ msg, type }), []);
  const refresh = useCallback(() => setRefreshTick(t => t + 1), []);

  const onAuth = (tok, email, role) => {
    localStorage.setItem("gt_token", tok);
    localStorage.setItem("gt_email", email);
    localStorage.setItem("gt_role", role || "USER");
    setToken(tok); setUserEmail(email); setUserRole(role || "USER");
  };

  const logout = () => {
    localStorage.removeItem("gt_token"); localStorage.removeItem("gt_email"); localStorage.removeItem("gt_role");
    setToken(null); setUserEmail(""); setUserRole("USER"); setActive("dashboard");
  };

  if (!token) return <><GlobalStyle /><AuthScreen onAuth={onAuth} /></>;

  const pages = {
    dashboard: <Dashboard token={token} setActive={setActive} refreshTick={refreshTick} isAdmin={isAdmin} />,
    sessions: <MySessions token={token} toast={toast} refreshTick={refreshTick} onSuccess={refresh} />,
    book: <BookSession token={token} toast={toast} onSuccess={refresh} />,
    available: <Availability token={token} toast={toast} isAdmin={isAdmin} onSlotClick={async (slotTime) => {
      if (isAdmin) return;
      if (!confirm(`Book ${new Date(slotTime).toLocaleString()}?`)) return;
      try {
        const r = await api("/bookSession", "POST", { startTime: slotTime }, token);
        toast(r.responseMessage, r.responseCode === "00" ? "success" : "error");
        if (r.responseCode === "00") refresh();
      } catch (e) {
        toast(e.message, "error");
      }
    }} />,
    workout: <WorkoutLog token={token} toast={toast} onSuccess={refresh} />,
    workouts: <MyWorkouts token={token} toast={toast} refreshTick={refreshTick} />,
    report: <Report token={token} toast={toast} />,
    qr: <QRCode token={token} toast={toast} />,
    adminRegister: <AdminRegister token={token} toast={toast} />,
    adminManage: <AdminManageUser token={token} toast={toast} onSuccess={refresh} />,
  };

  return (
    <>
      <GlobalStyle />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar active={active} setActive={setActive} onLogout={logout} isAdmin={isAdmin} />
        <main style={{ marginLeft: 220, flex: 1, padding: "40px 36px", minHeight: "100vh" }}>
          {/* Top bar */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 40, padding: "8px 16px" }}>
              <div style={{ width: 28, height: 28, background: "var(--accent)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#0a0a0f" }}>
                <Icon name="user" size={14} />
              </div>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>{userEmail}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: isAdmin ? "var(--accent)" : "var(--muted)", border: "1px solid var(--border)", borderRadius: 20, padding: "2px 8px" }}>{userRole}</span>
            </div>
          </div>
          {pages[active] || pages.dashboard}
        </main>
      </div>
      {toast_ && <Toast msg={toast_.msg} type={toast_.type} onClose={() => setToast(null)} />}
    </>
  );
}
