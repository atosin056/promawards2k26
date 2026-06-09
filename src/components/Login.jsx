import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .login-root {
    min-height: 100vh;
    background: #111111;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 1rem;
  }

  .login-card {
    display: flex;
    width: 100%;
    max-width: 960px;
    min-height: 560px;
    background: #0d0d0d;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 40px 100px rgba(0,0,0,0.7);
    opacity: 0;
    transform: translateY(32px) scale(0.98);
    animation: cardIn 0.75s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards;
  }

  @keyframes cardIn {
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── LEFT PANEL ── */
  .login-left {
    position: relative;
    width: 50%;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 20px;
    margin: 8px;
  }

  .login-left-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 30% 20%, #7c3aed55 0%, transparent 55%),
      radial-gradient(ellipse at 70% 70%, #f59e0b33 0%, transparent 50%),
      radial-gradient(ellipse at 60% 10%, #3b82f655 0%, transparent 40%),
      radial-gradient(ellipse at 20% 80%, #ec489944 0%, transparent 45%),
      linear-gradient(135deg, #1a0533 0%, #0d1a2e 40%, #1a0e0a 100%);
    animation: bgShimmer 8s ease-in-out infinite alternate;
  }

  @keyframes bgShimmer {
    0%   { filter: hue-rotate(0deg) brightness(1); }
    100% { filter: hue-rotate(15deg) brightness(1.08); }
  }

  .login-left-noise {
    position: absolute;
    inset: 0;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  .login-left-orb1 {
    position: absolute;
    width: 260px; height: 260px;
    border-radius: 50%;
    background: radial-gradient(circle, #a855f740 0%, transparent 70%);
    top: -60px; left: -60px;
    animation: orbFloat1 6s ease-in-out infinite;
  }

  .login-left-orb2 {
    position: absolute;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle, #f59e0b30 0%, transparent 70%);
    bottom: 40px; right: -40px;
    animation: orbFloat2 7s ease-in-out infinite;
  }

  @keyframes orbFloat1 {
    0%, 100% { transform: translate(0,0) scale(1); }
    50% { transform: translate(20px, 30px) scale(1.08); }
  }
  @keyframes orbFloat2 {
    0%, 100% { transform: translate(0,0) scale(1); }
    50% { transform: translate(-15px, -20px) scale(1.05); }
  }

  .login-left-logo {
    position: absolute;
    top: 24px; left: 24px;
    width: 40px; height: 40px;
    background: #f59e0b;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 16px; color: #000;
    letter-spacing: -0.5px;
    opacity: 0;
    transform: scale(0.7);
    animation: logoIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s forwards;
    z-index: 2;
  }

  @keyframes logoIn {
    to { opacity: 1; transform: scale(1); }
  }

  .login-left-tagline {
    position: absolute;
    bottom: 36px; left: 28px; right: 28px;
    z-index: 2;
    opacity: 0;
    transform: translateY(20px);
    animation: tagIn 0.6s ease 0.8s forwards;
  }

  @keyframes tagIn {
    to { opacity: 1; transform: translateY(0); }
  }

  .login-left-tagline p {
    font-size: clamp(22px, 3vw, 30px);
    font-weight: 300;
    color: rgba(255,255,255,0.88);
    line-height: 1.25;
    letter-spacing: -0.3px;
  }

  .login-left-tagline p strong {
    font-weight: 800;
    color: #fff;
  }

  /* ── RIGHT PANEL ── */
  .login-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: clamp(28px, 5vw, 56px) clamp(24px, 5vw, 52px);
  }

  .login-title {
    font-size: clamp(28px, 3.5vw, 38px);
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.8px;
    margin-bottom: 6px;
    opacity: 0;
    transform: translateY(16px);
    animation: fieldIn 0.5s ease 0.4s forwards;
  }

  .login-subtitle {
    font-size: 14px;
    color: rgba(255,255,255,0.45);
    font-weight: 400;
    margin-bottom: 36px;
    opacity: 0;
    transform: translateY(16px);
    animation: fieldIn 0.5s ease 0.5s forwards;
  }

  @keyframes fieldIn {
    to { opacity: 1; transform: translateY(0); }
  }

  .field-group {
    margin-bottom: 20px;
    opacity: 0;
    transform: translateY(14px);
  }

  .field-group:nth-of-type(1) { animation: fieldIn 0.5s ease 0.55s forwards; }
  .field-group:nth-of-type(2) { animation: fieldIn 0.5s ease 0.65s forwards; }

  .field-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: rgba(255,255,255,0.65);
    margin-bottom: 8px;
    letter-spacing: 0.2px;
  }

  .field-input {
    width: 100%;
    padding: 13px 16px;
    background: #1c1c1c;
    border: 1.5px solid #2a2a2a;
    border-radius: 12px;
    color: #fff;
    font-size: 14.5px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 400;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    -webkit-appearance: none;
  }

  .field-input::placeholder {
    color: rgba(255,255,255,0.2);
  }

  .field-input:focus {
    border-color: #f59e0b;
    background: #1f1f1f;
    box-shadow: 0 0 0 4px rgba(245,158,11,0.12);
  }

  .field-input.has-error {
    border-color: #ef4444;
    box-shadow: 0 0 0 4px rgba(239,68,68,0.1);
  }

  .field-error {
    font-size: 12px;
    color: #f87171;
    margin-top: 5px;
    font-weight: 500;
  }

  .password-wrapper {
    position: relative;
  }

  .password-toggle {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: rgba(255,255,255,0.3);
    font-size: 18px;
    line-height: 1;
    transition: color 0.2s;
    display: flex; align-items: center;
  }
  .password-toggle:hover { color: rgba(255,255,255,0.7); }

  .remember-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 28px;
    opacity: 0;
    transform: translateY(14px);
    animation: fieldIn 0.5s ease 0.75s forwards;
  }

  .remember-row input[type="checkbox"] {
    width: 17px; height: 17px;
    accent-color: #f59e0b;
    cursor: pointer;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .remember-row label {
    font-size: 13.5px;
    color: rgba(255,255,255,0.45);
    cursor: pointer;
    font-weight: 400;
  }

  .btn-login {
    width: 100%;
    padding: 14px;
    background: #f59e0b;
    border: none;
    border-radius: 12px;
    color: #0d0d0d;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    letter-spacing: 0.2px;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
    opacity: 0;
    transform: translateY(14px);
    animation: fieldIn 0.5s ease 0.85s forwards;
    position: relative;
    overflow: hidden;
  }

  .btn-login::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0);
    transition: background 0.2s;
  }

  .btn-login:hover:not(:disabled)::after {
    background: rgba(255,255,255,0.08);
  }

  .btn-login:hover:not(:disabled) {
    box-shadow: 0 8px 30px rgba(245,158,11,0.4);
    transform: translateY(-1px) !important;
  }

  .btn-login:active:not(:disabled) {
    transform: scale(0.98) !important;
    box-shadow: 0 4px 16px rgba(245,158,11,0.3);
  }

  .btn-login:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .btn-loader {
    display: inline-flex;
    gap: 5px;
    align-items: center;
  }

  .btn-loader span {
    width: 6px; height: 6px;
    background: #000;
    border-radius: 50%;
    animation: dotBounce 0.6s ease-in-out infinite;
  }
  .btn-loader span:nth-child(2) { animation-delay: 0.1s; }
  .btn-loader span:nth-child(3) { animation-delay: 0.2s; }

  @keyframes dotBounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
  }

  .login-footer {
    text-align: center;
    margin-top: 22px;
    font-size: 13.5px;
    color: rgba(255,255,255,0.35);
    opacity: 0;
    animation: fieldIn 0.5s ease 0.95s forwards;
  }

  .login-footer a {
    color: #f59e0b;
    text-decoration: none;
    font-weight: 600;
    transition: opacity 0.2s;
    cursor: pointer;
  }

  .login-footer a:hover { opacity: 0.75; }

  .success-overlay {
    position: absolute;
    inset: 0;
    background: #0d0d0d;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    border-radius: 24px;
    animation: fadeIn 0.3s ease forwards;
    z-index: 10;
  }

  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

  .success-check {
    width: 64px; height: 64px;
    background: #f59e0b;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 28px;
    animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  @keyframes popIn {
    from { transform: scale(0); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  .success-text {
    color: #fff;
    font-size: 18px;
    font-weight: 600;
  }

  /* ── MOBILE RESPONSIVE ── */
  @media (max-width: 640px) {
    .login-root { padding: 0; align-items: flex-end; }

    .login-card {
      flex-direction: column;
      border-radius: 20px 20px 0 0;
      min-height: unset;
      max-width: 100%;
      transform: translateY(60px) scale(1);
      animation: mobileCardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards;
    }

    @keyframes mobileCardIn {
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .login-left {
      width: calc(100% - 16px);
      height: 220px;
      margin: 8px 8px 0;
      border-radius: 14px;
    }

    .login-left-tagline p { font-size: 22px; }
    .login-left-logo { width: 34px; height: 34px; font-size: 13px; }

    .login-right {
      padding: 28px 24px 36px;
    }

    .login-title { font-size: 28px; }
  }
`;

export default function Login({ onLoginSuccess }) {
  const [seatNo, setSeatno] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!seatNo.trim()) e.seatNo = "Seat number is required";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    return e;
  };

  const handleLogin = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      const response = await fetch("https://mobilix.com.ng/promawards/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          seatNo: seatNo, 
          password: password 
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setLoading(false);
        setSuccess(true); 
        
        if (remember) {
          localStorage.setItem("remembered_seat", data.seatNo);
        }

        setTimeout(() => {
          onLoginSuccess(data.seatNo);
        }, 1200);

      } else {
        setLoading(false);
        // ─── HANDLES 403 & OTHER RESPONSES CLEANLY FOR THE USER ───
        setErrors({ 
          seatNo: data.message || "Invalid credentials", 
          password: " " 
        });
      }
    } catch (error) {
      setLoading(false);
      setErrors({ seatNo: "Could not connect to authentication server." });
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">
        <div className="login-card" style={{ position: "relative" }}>

          {/* ── LEFT PANEL ── */}
          <div className="login-left">
            <div className="login-left-bg" />
            <div className="login-left-noise" />
            <div className="login-left-orb1" />
            <div className="login-left-orb2" />
            <div className="login-left-logo">a.</div>
            <div className="login-left-tagline">
              <p>Be a Part of<br />Something <strong>Beautiful</strong></p>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="login-right">
            <h1 className="login-title">Login</h1>
            <p className="login-subtitle">Enter your credentials to access your account</p>

            <div className="field-group">
              <label className="field-label" htmlFor="email">Seat Number</label>
              <input
                id="email"
                type="number"
                className={`field-input ${errors.seatNo ? "has-error" : ""}`}
                placeholder="001"
                value={seatNo}
                onChange={e => { setSeatno(e.target.value); setErrors(p => ({ ...p, seatNo: "" })); }}
                autoComplete="seatno"
              />
              {errors.seatNo && <p className="field-error">{errors.seatNo}</p>}
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  className={`field-input ${errors.password ? "has-error" : ""}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: "" })); }}
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="field-error">{errors.password}</p>}
            </div>

            <div className="remember-row">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />
              <label htmlFor="remember">Remember me</label>
            </div>

            <button
              className="btn-login"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loader">
                  <span /><span /><span />
                </span>
              ) : "Login"}
            </button>
          </div>

          {/* ── SUCCESS OVERLAY ── */}
          {success && (
            <div className="success-overlay">
              <div className="success-check">✓</div>
              <p className="success-text">Welcome!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}