import { useState } from "react";

export default function Adminlogin({ onLoginSuccess }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (isLoading) return;
    if (!name.trim() || !password.trim()) {
      setError("Please enter your name and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://mobilix.com.ng/promawards/adminlogin.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        onLoginSuccess();
      } else {
        setError(result.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Connection failed. Check your network and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
          background: #13121a;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        /* ── Ambient orbs ── */
        .orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: float 8s ease-in-out infinite;
        }
        .orb-pink {
          width: 220px; height: 220px;
          background: radial-gradient(circle at 40% 40%, #e040fb, #f06292);
          top: -60px; left: 50%;
          transform: translateX(-60%);
          filter: blur(2px);
          opacity: 0.85;
          animation-delay: 0s;
        }
        .orb-dark-right {
          width: 110px; height: 110px;
          background: radial-gradient(circle at 40% 40%, #2a2535, #1a1825);
          top: 30px; right: 8%;
          filter: blur(1px);
          opacity: 0.9;
          animation-delay: 1.5s;
        }
        .orb-dark-left {
          width: 80px; height: 80px;
          background: radial-gradient(circle at 40% 40%, #2a2535, #1a1825);
          bottom: 18%; left: 4%;
          filter: blur(1px);
          opacity: 0.85;
          animation-delay: 3s;
        }
        .orb-pink-corner {
          width: 130px; height: 130px;
          background: radial-gradient(circle at 40% 60%, #e040fb, #f06292);
          bottom: 10%; left: -30px;
          filter: blur(3px);
          opacity: 0.75;
          animation-delay: 2s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }
        .orb-pink { animation-name: floatCenter; }
        @keyframes floatCenter {
          0%, 100% { transform: translateX(-60%) translateY(0px); }
          50%       { transform: translateX(-60%) translateY(-14px); }
        }

        /* ── Card ── */
        .login-card {
          position: relative;
          z-index: 10;
          background: #1a1825;
          border-radius: 20px;
          padding: 3rem 2.5rem;
          width: 100%;
          max-width: 420px;
          animation: cardIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }

        /* ── Title ── */
        .login-title {
          font-size: 2rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 2rem;
          letter-spacing: -0.02em;
          animation: fadeUp 0.5s 0.1s cubic-bezier(0.22,1,0.36,1) both;
        }

        /* ── Inputs ── */
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
          animation: fadeUp 0.5s 0.2s cubic-bezier(0.22,1,0.36,1) both;
        }
        .input-wrap {
          position: relative;
        }
        .login-input {
          width: 100%;
          background: #222030;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 13.5px;
          font-weight: 400;
          padding: 13px 44px 13px 16px;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .login-input::placeholder { color: rgba(255,255,255,0.25); }
        .login-input:focus {
          border-color: rgba(224, 64, 251, 0.5);
          background: #241f34;
          box-shadow: 0 0 0 3px rgba(224, 64, 251, 0.1);
        }
        .toggle-pw {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.3);
          font-size: 16px;
          padding: 0;
          line-height: 1;
          transition: color 0.2s;
        }
        .toggle-pw:hover { color: rgba(255,255,255,0.6); }

        /* ── Error ── */
        .login-error {
          font-size: 12px;
          color: #f87171;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 6px;
          animation: fadeUp 0.3s ease both;
        }

        /* ── Submit button ── */
        .login-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #e040fb 0%, #f06292 100%);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
          position: relative;
          overflow: hidden;
          animation: fadeUp 0.5s 0.3s cubic-bezier(0.22,1,0.36,1) both;
        }
        .login-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent 60%);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .login-btn:hover:not(:disabled)::after { opacity: 1; }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(224, 64, 251, 0.35);
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── Spinner inside button ── */
        .btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Footer links ── */
        .login-footer {
          margin-top: 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 6px;
          animation: fadeUp 0.5s 0.4s cubic-bezier(0.22,1,0.36,1) both;
        }
        .login-footer p {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
        }
        .login-footer a {
          color: #fff;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .login-footer a:hover { color: #e040fb; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 480px) {
          .login-card { padding: 2.25rem 1.5rem; border-radius: 16px; }
          .login-title { font-size: 1.75rem; }
          .orb-pink { width: 160px; height: 160px; top: -40px; }
        }
      `}</style>

      <div className="login-root">
        {/* Ambient orbs */}
        <div className="orb orb-pink" />
        <div className="orb orb-dark-right" />
        <div className="orb orb-dark-left" />
        <div className="orb orb-pink-corner" />

        <div className="login-card">
          <h1 className="login-title">Sign in.</h1>

          <div className="input-group">
            <div className="input-wrap">
              <input
                className="login-input"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
            </div>
            <div className="input-wrap">
              <input
                className="login-input"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                className="toggle-pw"
                onClick={() => setShowPassword((p) => !p)}
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {error && (
            <p className="login-error">
              <span>⚠</span> {error}
            </p>
          )}

          <button
            className="login-btn"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            <span className="btn-inner">
              {isLoading && <span className="spinner" />}
              {isLoading ? "Signing in..." : "Sign in"}
            </span>
          </button>
{/* 
          <div className="login-footer">
            <p>
              Don't have an account? <a href="#">Create Account</a>
            </p>
            <p>
              <a href="#">Forgot Password?</a>
            </p>
          </div> */}
        </div>
      </div>
    </>
  );
}