import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

const PIE_COLORS = ["#7c3aed", "#f59e0b", "#ec4899", "#06b6d4"];

const RANK_BADGE = {
  1: { label: "1st", bg: "rgba(245,158,11,0.18)", color: "#fbbf24", border: "rgba(245,158,11,0.4)" },
  2: { label: "2nd", bg: "rgba(124,58,237,0.18)", color: "#c4b5fd", border: "rgba(124,58,237,0.4)" },
  3: { label: "3rd", bg: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)", border: "rgba(255,255,255,0.12)" },
};

const CAT_COLOR = {
  "Prom King":   { bg: "rgba(245,158,11,0.15)", color: "#fbbf24" },
  "Prom Queen":  { bg: "rgba(124,58,237,0.15)", color: "#c4b5fd" },
  "Best Couple": { bg: "rgba(236,72,153,0.15)", color: "#f9a8d4" },
  "Most Likely": { bg: "rgba(6,182,212,0.15)",  color: "#67e8f9" },
};

const NAV_ITEMS = [
  { icon: "🏠", label: "Home" },
  { icon: "📊", label: "Charts" },
  { icon: "🗳", label: "Votes" },
  { icon: "🏆", label: "Results" },
  { icon: "⚙️", label: "Settings" },
  { icon: "👤", label: "Profile" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#16131f", border: "1px solid rgba(124,58,237,0.35)",
      borderRadius: 10, padding: "8px 14px", fontFamily: "Poppins, sans-serif",
    }}>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 700, color: "#c4b5fd" }}>{payload[0].value} votes</p>
    </div>
  );
};

export default function Promadmindashboard() {
  // FIX: Explicitly match the state variables to your template markup names!
  const [votesOverTimeData, setVotesOverTimeData] = useState([]);
  const [categoryBreakdownData, setCategoryBreakdownData] = useState([]);
  const [nominationsData, setNominationsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeNav, setActiveNav] = useState(2);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [showSidePanel, setShowSidePanel] = useState(false);

  // Normal onload single execution block (No background timing intervals)
  useEffect(() => {
    Promise.all([
      fetch("https://mobilix.com.ng/promawards/dashboard_stats.php").then(res => res.json()),
      fetch("https://mobilix.com.ng/promawards/nominations_feed.php").then(res => res.json())
    ])
    .then(([statsRes, feedRes]) => {
      if (statsRes.success) {
        setVotesOverTimeData(statsRes.votesOverTime || []);
        setCategoryBreakdownData(statsRes.categoryBreakdown || []);
      }
      if (feedRes.success) {
        setNominationsData(feedRes.nominations || []);
      }
      setLoading(false);
    })
    .catch((err) => {
      console.error("Dashboard connection failed: ", err);
      setLoading(false);
    });
  }, []);

  // Recalculations mapping securely to nominationsData variables
  const totalSubmissions = new Set(nominationsData.map((n) => n.submission_id)).size;
  
  const topNominee = (() => {
    const counts = {};
    nominationsData.forEach((n) => { counts[n.nominee_name] = (counts[n.nominee_name] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  })();

  const categories = ["All", ...Object.keys(CAT_COLOR)];

  const filtered = nominationsData.filter((n) => {
    const matchSearch = n.nominee_name.toLowerCase().includes(search.toLowerCase()) ||
      n.submission_id.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "All" || n.category_id === filterCat;
    return matchSearch && matchCat;
  });

  const recentFeed = [...nominationsData]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  if (loading) return <div style={{ color: '#fff', background: '#0b0813', padding: '20px', minHeight: '100vh' }}>Loading admin metrics stream...</div>;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .adm-root {
          font-family: 'Poppins', sans-serif;
          background: #0d0b14;
          min-height: 100vh;
          display: flex;
          flex-direction: row;
          color: #fff;
          font-size: 13px;
        }

        /* ── SIDEBAR (desktop) ── */
        .sidebar {
          width: 68px;
          background: #120f1e;
          border-right: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 0 24px;
          gap: 6px;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
        }
        .sidebar-logo {
          width: 38px; height: 38px;
          border-radius: 11px;
          background: linear-gradient(135deg, #7c3aed, #f59e0b);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          margin-bottom: 20px;
          flex-shrink: 0;
        }
        .nav-btn {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.18s;
          background: transparent;
          border: none;
          position: relative;
          color: #fff;
        }
        .nav-btn:hover { background: rgba(255,255,255,0.06); }
        .nav-btn.active {
          background: rgba(124,58,237,0.22);
          border: 1px solid rgba(124,58,237,0.35);
        }
        .nav-btn.active::before {
          content: '';
          position: absolute;
          left: -1px; top: 25%; bottom: 25%;
          width: 3px;
          background: #7c3aed;
          border-radius: 0 3px 3px 0;
        }

        /* ── BOTTOM NAV (mobile) ── */
        .bottom-nav {
          display: none;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          height: 60px;
          background: #120f1e;
          border-top: 1px solid rgba(255,255,255,0.07);
          z-index: 100;
          align-items: center;
          justify-content: space-around;
          padding: 0 4px;
        }
        .bottom-nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.35);
          cursor: pointer;
          padding: 6px 8px;
          border-radius: 10px;
          font-family: 'Poppins', sans-serif;
          transition: all 0.15s;
          min-width: 44px;
        }
        .bottom-nav-btn.active { color: #c4b5fd; }
        .bottom-nav-btn .bn-icon { font-size: 18px; line-height: 1; }
        .bottom-nav-btn .bn-label { font-size: 9px; font-weight: 500; letter-spacing: 0.03em; }

        /* ── CONTENT AREA ── */
        .content-area {
          flex: 1;
          display: flex;
          flex-direction: row;
          overflow: hidden;
          min-width: 0;
        }

        /* ── MAIN ── */
        .main {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 28px 28px 40px;
          display: flex;
          flex-direction: column;
          gap: 22px;
          min-width: 0;
        }

        /* ── RIGHT PANEL ── */
        .right-panel {
          width: 280px;
          flex-shrink: 0;
          padding: 28px 20px;
          border-left: 1px solid rgba(255,255,255,0.05);
          background: #120f1e;
          display: flex;
          flex-direction: column;
          gap: 22px;
          overflow-y: auto;
        }

        /* ── TOP BAR ── */
        .topbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }
        .topbar h1 {
          font-size: 1.55rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #fff;
          line-height: 1.1;
        }
        .topbar p {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          font-weight: 400;
          margin-top: 3px;
        }
        .topbar-right { display: flex; align-items: center; gap: 10px; }
        .admin-chip {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 100px;
          padding: 5px 14px 5px 8px;
          font-size: 12px; font-weight: 500;
          color: rgba(255,255,255,0.7);
          white-space: nowrap;
        }
        .avatar {
          width: 26px; height: 26px; border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #f59e0b);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; flex-shrink: 0;
        }
        .panel-toggle-btn {
          display: none;
          align-items: center; gap: 6px;
          background: rgba(124,58,237,0.15);
          border: 1px solid rgba(124,58,237,0.35);
          border-radius: 100px;
          padding: 5px 12px;
          font-size: 11px; font-weight: 600;
          color: #c4b5fd;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          white-space: nowrap;
        }

        /* ── STATS ── */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .stat-card {
          background: #16131f;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 18px 20px;
          position: relative;
          overflow: hidden;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px; border-radius: 16px 16px 0 0;
        }
        .stat-king::before   { background: linear-gradient(90deg, #f59e0b, transparent); }
        .stat-queen::before  { background: linear-gradient(90deg, #7c3aed, transparent); }
        .stat-subs::before   { background: linear-gradient(90deg, #ec4899, transparent); }
        .stat-label {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(255,255,255,0.35); margin-bottom: 10px;
        }
        .stat-value { font-size: 1.9rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1; }
        .stat-icon { position: absolute; right: 16px; top: 16px; font-size: 22px; opacity: 0.25; }
        .stat-sub { font-size: 10px; color: rgba(255,255,255,0.25); margin-top: 6px; }

        /* ── PANELS ── */
        .panel {
          background: #16131f;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px; overflow: hidden;
        }
        .panel-head {
          padding: 18px 22px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 12px;
        }
        .panel-head h2 { font-size: 14px; font-weight: 700; color: #fff; line-height: 1.2; }
        .panel-head p { font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 2px; }
        .panel-body { padding: 18px 22px; }

        /* ── CHART ROW ── */
        .chart-row {
          display: grid;
          grid-template-columns: 1fr 260px;
          gap: 14px;
        }

        /* ── TABLE ── */
        .tbl-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .search-box {
          flex: 1; min-width: 140px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px; padding: 8px 14px;
          color: #fff; font-family: 'Poppins', sans-serif;
          font-size: 12px; outline: none; transition: all 0.2s;
        }
        .search-box::placeholder { color: rgba(255,255,255,0.2); }
        .search-box:focus {
          border-color: rgba(124,58,237,0.5);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
        }
        .filter-pill {
          padding: 6px 14px; border-radius: 100px;
          font-size: 11px; font-weight: 600;
          cursor: pointer; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          color: rgba(255,255,255,0.45);
          transition: all 0.15s; font-family: 'Poppins', sans-serif;
        }
        .filter-pill:hover { border-color: rgba(124,58,237,0.4); color: #c4b5fd; }
        .filter-pill.active { background: rgba(124,58,237,0.18); border-color: rgba(124,58,237,0.45); color: #c4b5fd; }
        .tbl-wrap { overflow-x: auto; margin-top: 16px; -webkit-overflow-scrolling: touch; }
        table { width: 100%; border-collapse: collapse; }
        thead tr { border-bottom: 1px solid rgba(255,255,255,0.07); }
        th {
          text-align: left; font-size: 10px; font-weight: 600;
          letter-spacing: 0.09em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); padding: 0 12px 12px;
          white-space: nowrap;
        }
        td {
          padding: 13px 12px; font-size: 12px; font-weight: 500;
          color: rgba(255,255,255,0.7);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          white-space: nowrap;
        }
        tbody tr:last-child td { border-bottom: none; }
        tbody tr { transition: background 0.15s; }
        tbody tr:hover td { background: rgba(255,255,255,0.03); }
        .badge {
          display: inline-block; padding: 3px 10px;
          border-radius: 100px; font-size: 10px; font-weight: 600;
          border: 1px solid transparent;
        }

        /* ── RIGHT PANEL CONTENT ── */
        .legend-row { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
        .legend-item { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .legend-dot-label { display: flex; align-items: center; gap: 8px; font-size: 12px; color: rgba(255,255,255,0.6); }
        .legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .legend-count { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.85); }
        .donut-total { text-align: center; margin-bottom: 4px; }
        .donut-total .big { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.03em; color: #fff; }
        .donut-total .small { font-size: 10px; color: rgba(255,255,255,0.3); }
        .feed-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .feed-item:last-child { border-bottom: none; }
        .feed-avatar {
          width: 34px; height: 34px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; flex-shrink: 0;
        }
        .feed-name { font-size: 13px; font-weight: 600; color: #fff; line-height: 1.2; }
        .feed-meta { font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 2px; }
        .rp-title { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 2px; }
        .rp-sub { font-size: 10px; color: rgba(255,255,255,0.3); margin-bottom: 14px; }
        .rp-divider { height: 1px; background: rgba(255,255,255,0.05); }

        /* ── OVERLAY (mobile side panel) ── */
        .side-panel-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 200;
        }
        .side-panel-drawer {
          position: absolute;
          right: 0; top: 0; bottom: 0;
          width: min(300px, 88vw);
          background: #120f1e;
          border-left: 1px solid rgba(255,255,255,0.07);
          overflow-y: auto;
          padding: 20px 18px 80px;
          display: flex; flex-direction: column; gap: 22px;
        }
        .drawer-close {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 4px;
        }
        .drawer-close-btn {
          background: rgba(255,255,255,0.07);
          border: none; border-radius: 8px;
          width: 30px; height: 30px;
          cursor: pointer; color: #fff;
          font-size: 16px;
          display: flex; align-items: center; justify-content: center;
        }

        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.3); border-radius: 4px; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .sidebar { display: none; }
          .bottom-nav { display: flex; }
          .main { padding: 20px 16px 80px; }
          .topbar h1 { font-size: 1.25rem; }
          .chart-row { grid-template-columns: 1fr; }
          .right-panel { display: none; }
          .panel-toggle-btn { display: flex; }
          .side-panel-overlay.open { display: block; }
        }

        @media (max-width: 600px) {
          .stats-row { grid-template-columns: 1fr; gap: 10px; }
          .stat-value { font-size: 1.5rem; }
          .stat-card { padding: 14px 16px; }
          .panel-body { padding: 14px 16px; }
          .panel-head { padding: 14px 16px 12px; }
          .tbl-controls { gap: 8px; }
          .filter-pill { padding: 5px 10px; font-size: 10px; }
        }

        @media (min-width: 480px) and (max-width: 700px) {
          .stats-row { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="adm-root">
        {/* Desktop Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">👑</div>
          {NAV_ITEMS.map((item, i) => (
            <button
              key={i}
              className={`nav-btn${activeNav === i ? " active" : ""}`}
              onClick={() => setActiveNav(i)}
              title={item.label}
            >
              {item.icon}
            </button>
          ))}
        </aside>

        {/* Content */}
        <div className="content-area">
          <main className="main">
            {/* Top Bar */}
            <div className="topbar">
              <div>
                <h1>Dashboard</h1>
                <p>Prom Royalty Nominations — Class of 2026</p>
              </div>
              <div className="topbar-right">
                <button className="panel-toggle-btn" onClick={() => setShowSidePanel(true)}>
                  📊 Stats
                </button>
                <div className="admin-chip">
                  <div className="avatar">👤</div>
                  Admin
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="stats-row">
              <div className="stat-card stat-king">
                <div className="stat-icon">👑</div>
                <div className="stat-label">Total Votes</div>
                <div className="stat-value" style={{ color: "#fbbf24" }}>{nominationsData.length}</div>
                <div className="stat-sub">Across all categories</div>
              </div>
              <div className="stat-card stat-queen">
                <div className="stat-icon">🗳</div>
                <div className="stat-label">Submissions</div>
                <div className="stat-value" style={{ color: "#c4b5fd" }}>{totalSubmissions}</div>
                <div className="stat-sub">Unique ballot forms</div>
              </div>
              <div className="stat-card stat-subs">
                <div className="stat-icon">🏆</div>
                <div className="stat-label">Leading Nominee</div>
                <div className="stat-value" style={{ fontSize: "1.1rem", paddingTop: 6, color: "#f9a8d4" }}>
                  {topNominee}
                </div>
                <div className="stat-sub">Most 1st-choice votes</div>
              </div>
            </div>

            {/* Chart Row */}
            <div className="chart-row">
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <h2>Voting Activity</h2>
                    <p>Daily vote count — last 10 days</p>
                  </div>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c3aed", display: "inline-block" }} />
                    Votes cast
                  </span>
                </div>
                <div className="panel-body" style={{ paddingTop: 10 }}>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={votesOverTimeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="voteGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="voteStroke" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%"  stopColor="#7c3aed" />
                          <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "Poppins" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "Poppins" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }} />
                      <Area type="monotone" dataKey="votes" stroke="url(#voteStroke)" strokeWidth={2.5} fill="url(#voteGrad)" dot={false} activeDot={{ r: 5, fill: "#f59e0b", stroke: "#0d0b14", strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Donut */}
              <div className="panel">
                <div className="panel-head">
                  <div><h2>By Category</h2><p>Vote distribution</p></div>
                </div>
                <div className="panel-body">
                  <div className="donut-total">
                    <div className="big">{categoryBreakdownData.reduce((s, c) => s + c.count, 0)}</div>
                    <div className="small">Total Nominations</div>
                  </div>
                  <ResponsiveContainer width="100%" height={130}>
                    <PieChart>
                      <Pie data={categoryBreakdownData} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3} dataKey="count">
                        {categoryBreakdownData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="legend-row">
                    {categoryBreakdownData.map((c, i) => (
                      <div className="legend-item" key={c.category}>
                        <div className="legend-dot-label">
                          <div className="legend-dot" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                          {c.category}
                        </div>
                        <span className="legend-count">{c.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="panel">
              <div className="panel-head">
                <div><h2>Nomination Records</h2><p>All submitted entries</p></div>
              </div>
              <div className="panel-body">
                <div className="tbl-controls">
                  <input
                    className="search-box"
                    placeholder="🔍 Search nominee or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {categories.map((cat) => (
                    <button key={cat} className={`filter-pill${filterCat === cat ? " active" : ""}`} onClick={() => setFilterCat(cat)}>
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="tbl-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Sub ID</th>
                        <th>Nominee</th>
                        <th>Category</th>
                        <th>Rank</th>
                        <th>Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr><td colSpan={6} style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", padding: "28px 0" }}>No records found</td></tr>
                      ) : filtered.map((row) => {
                        const rank = RANK_BADGE[row.choice_rank] || RANK_BADGE[3];
                        const cat = CAT_COLOR[row.category_id] || { bg: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" };
                        return (
                          <tr key={row.id}>
                            <td style={{ color: "rgba(255,255,255,0.3)" }}>#{row.id}</td>
                            <td style={{ color: "rgba(255,255,255,0.45)", fontFamily: "monospace", fontSize: 11 }}>{row.submission_id}</td>
                            <td style={{ fontWeight: 600, color: "#fff" }}>{row.nominee_name}</td>
                            <td><span className="badge" style={{ background: cat.bg, color: cat.color }}>{row.category_id}</span></td>
                            <td><span className="badge" style={{ background: rank.bg, color: rank.color, border: `1px solid ${rank.border}` }}>{rank.label}</span></td>
                            <td style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{row.created_at}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>

          {/* Desktop Right Panel */}
          <aside className="right-panel">
            <RightPanelContent nominationsData={nominationsData} categoryBreakdownData={categoryBreakdownData} recentFeed={recentFeed} />
          </aside>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="bottom-nav">
          {NAV_ITEMS.map((item, i) => (
            <button key={i} className={`bottom-nav-btn${activeNav === i ? " active" : ""}`} onClick={() => setActiveNav(i)}>
              <span className="bn-icon">{item.icon}</span>
              <span className="bn-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Mobile Stats Drawer */}
        <div className={`side-panel-overlay${showSidePanel ? " open" : ""}`} onClick={() => setShowSidePanel(false)}>
          <div className="side-panel-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-close">
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Stats & Activity</span>
              <button className="drawer-close-btn" onClick={() => setShowSidePanel(false)}>✕</button>
            </div>
            <RightPanelContent nominationsData={nominationsData} categoryBreakdownData={categoryBreakdownData} recentFeed={recentFeed} />
          </div>
        </div>
      </div>
    </>
  );
}

function RightPanelContent({ nominationsData, categoryBreakdownData, recentFeed }) {
  return (
    <>
      <div>
        <div className="rp-title">Vote Breakdown</div>
        <div className="rp-sub">All categories at a glance</div>
        {categoryBreakdownData.map((c, i) => {
          const total = categoryBreakdownData.reduce((s, x) => s + x.count, 0);
          const pct = Math.round((c.count / total) * 100);
          return (
            <div key={c.category} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{c.category}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{pct}%</span>
              </div>
              <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: PIE_COLORS[i % PIE_COLORS.length], borderRadius: 10, transition: "width 0.6s ease" }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="rp-divider" />

      <div>
        <div className="rp-title">Recent Activity</div>
        <div className="rp-sub">Latest nominations submitted</div>
        {recentFeed.map((n) => {
          const cat = CAT_COLOR[n.category_id] || { bg: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" };
          const rank = RANK_BADGE[n.choice_rank] || RANK_BADGE[3];
          return (
            <div className="feed-item" key={n.id}>
              <div className="feed-avatar" style={{ background: cat.bg }}>
                {n.category_id === "Prom King" ? "👑" : n.category_id === "Prom Queen" ? "💎" : n.category_id === "Best Couple" ? "✨" : "🌟"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="feed-name" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{n.nominee_name}</div>
                <div className="feed-meta">{n.category_id} · {n.created_at.split(" ")[1]}</div>
              </div>
              <span className="badge" style={{ background: rank.bg, color: rank.color, border: `1px solid ${rank.border}`, fontSize: 9, flexShrink: 0 }}>
                {rank.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="rp-divider" />

      <div>
        <div className="rp-title">Quick Stats</div>
        <div className="rp-sub">Summary numbers</div>
        {[
          { label: "1st Choice Votes", val: nominationsData.filter(n => n.choice_rank === 1).length, color: "#fbbf24" },
          { label: "2nd Choice Votes", val: nominationsData.filter(n => n.choice_rank === 2).length, color: "#c4b5fd" },
          { label: "3rd Choice Votes", val: nominationsData.filter(n => n.choice_rank === 3).length, color: "rgba(255,255,255,0.4)" },
          { label: "Unique Nominees",  val: new Set(nominationsData.map(n => n.nominee_name)).size, color: "#67e8f9" },
        ].map((s) => (
          <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{s.label}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.val}</span>
          </div>
        ))}
      </div>
    </>
  );
}