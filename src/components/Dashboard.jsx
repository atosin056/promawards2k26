import { useState } from "react";

const CATEGORIES = [
  { id: "promKing", label: "Prom King", gender: "Male", required: true, titleClass: "title-king", chipClass: "chip-king", cardClass: "card-king" },
  { id: "promQueen", label: "Prom Queen", gender: "Female", required: true, titleClass: "title-queen", chipClass: "chip-queen", cardClass: "card-queen" },
  { id: "brainieeOfTheYear", label: "Brainee of the Year", gender: "Unisex", subtitle: "The Einstein Reloaded Award", required: false },
  { id: "lifeOfThePartyMale", label: "Life of the Party (Male)", gender: "Male", subtitle: "The Showstopper Award", required: false },
  { id: "lifeOfThePartyFemale", label: "Life of the Party (Female)", gender: "Female", subtitle: "The Headliner Award", required: false },
  { id: "mostPopularMale", label: "Most Popular (Male)", gender: "Male", required: false },
  { id: "mostPopularFemale", label: "Most Popular (Female)", gender: "Female", required: false },
  { id: "fashionistaMale", label: "Fashionista (Male)", gender: "Male", subtitle: "Trendsetter of the Year Award", required: false },
  { id: "fashionistaFemale", label: "Fashionista (Female)", gender: "Female", subtitle: "Style Icon Award", required: false },
  { id: "bestGlowUpMale", label: "Best Glow-Up (Male)", gender: "Male", subtitle: "The Nova Glow Up Award", required: false },
  { id: "bestGlowUpFemale", label: "Best Glow-Up (Female)", gender: "Female", subtitle: "Supernova Stunner Award", required: false },
  { id: "mostCreative", label: "Most Creative", gender: "Unisex", required: false },
  { id: "funniest", label: "Funniest", gender: "Unisex", subtitle: "The Kevin Hart Award", required: false },
  { id: "mrPetite", label: "Mr Petite", gender: "Male", required: false },
  { id: "msPetite", label: "Ms Petite", gender: "Female", required: false },
  { id: "ballonDor", label: "Ballon D'or Award", gender: "Male", required: false },
  { id: "mostSocialMale", label: "Most Social (Male)", gender: "Male", required: false },
  { id: "mostSocialFemale", label: "Most Social (Female)", gender: "Female", required: false },
  { id: "bestMaleDancer", label: "Best Male Dancer", gender: "Male", subtitle: "The Pocolee Award", required: false },
  { id: "bestFemaleDancer", label: "Best Female Dancer", gender: "Female", subtitle: "The Kaffy Award", required: false },
  { id: "mostAttractiveMale", label: "Most Attractive (Male)", gender: "Male", required: false },
  { id: "mostAttractiveFemale", label: "Most Attractive (Female)", gender: "Female", required: false },
  { id: "ebonyKing", label: "Ebony King", gender: "Male", required: false, titleClass: "title-king", chipClass: "chip-king", cardClass: "card-king" },
  { id: "ebonyQueen", label: "Ebony Queen", gender: "Female", required: false, titleClass: "title-queen", chipClass: "chip-queen", cardClass: "card-queen" },
  { id: "bestMusicArtist", label: "Best Music Artist", gender: "Unisex", subtitle: "iSL Idol", required: false },
  { id: "beautyWithBrains", label: "Beauty With Brains", gender: "Female", required: false },
  { id: "rookieOfTheYear", label: "Rookie of the Year", gender: "Unisex", subtitle: "Transferee of the Year", required: false },
  { id: "lebronJames", label: "LeBron James of the Year", gender: "Male", required: false },
  { id: "fairestOfThemAllMale", label: "Fairest of Them All (Male)", gender: "Male", required: false },
  { id: "fairestOfThemAllFemale", label: "Fairest of Them All (Female)", gender: "Female", required: false },
  { id: "bigBoldBeautiful", label: "Big Bold and Beautiful", gender: "Female", required: false },
  { id: "usainBolt", label: "Usain Bolt of the Year", gender: "Male", subtitle: "Best Male Athlete - Track", required: false },
  { id: "tobiAmusan", label: "Tobi Amusan of the Year", gender: "Female", subtitle: "Best Female Athlete - Track", required: false },
  { id: "businessGuruFemale", label: "Business Guru Of The Year (Female)", gender: "Female", required: true },
  { id: "businessGuruMale", label: "Business Guru Of The Year (Male)", gender: "Male", required: true },
];

export default function Dashboard({ seatNo }) {
  const [choices, setChoices] = useState(() =>
    CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.id]: ["", "", ""] }), {})
  );

  const [errors, setErrors] = useState(() =>
  CATEGORIES.filter(c => c.required).reduce((acc, c) => ({ ...acc, [c.id]: false }), {})
);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleInputChange = (categoryId, index, value) => {
    setChoices((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId].map((val, i) => (i === index ? value : val)),
    }));

    if (index === 0 && value.trim()) {
      setErrors((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  const handleSubmit = async () => {
  if (isSubmitting) return;

  const newErrors = CATEGORIES
    .filter(c => c.required)
    .reduce((acc, c) => ({ ...acc, [c.id]: !choices[c.id][0].trim() }), {});

  setErrors(newErrors);

  if (Object.values(newErrors).some(Boolean)) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

    setErrors(newErrors);

    if (newErrors.promKing || newErrors.promQueen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    try {
      const response = await fetch("https://mobilix.com.ng/promawards/submit_votes.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choices: choices, seatNo: seatNo }),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setApiError(result.message || "An unexpected error occurred on the ballot server.");
        if (response.status === 403) setSubmitted(true);

        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error("Connection Error: ", err);
      setApiError("Network timeout. Could not connect to the ballot server. Please check your connection.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .prom-root {
          font-family: 'Poppins', sans-serif;
          background: #09090f;
          min-height: 100vh;
          padding: 2.5rem 1rem 5rem;
          position: relative;
          overflow: hidden;
        }
        .orb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(90px); opacity: 0.16; }
        .orb1 { width: 480px; height: 480px; background: #6d28d9; top: -140px; left: -120px; }
        .orb2 { width: 380px; height: 380px; background: #d97706; top: 260px; right: -100px; }
        .orb3 { width: 340px; height: 340px; background: #7c3aed; bottom: 60px; left: 35%; }
        .header { text-align: center; position: relative; z-index: 2; padding-bottom: 2.5rem; }
        .badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(124, 58, 237, 0.18); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 100px; padding: 5px 18px; font-size: 11px; font-weight: 600; letter-spacing: 0.13em; text-transform: uppercase; color: #c4b5fd; margin-bottom: 1.25rem; }
        .badge-dot { width: 6px; height: 6px; background: #f59e0b; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.75); } }
        .hero-title { font-size: 3rem; font-weight: 900; color: #ffffff; line-height: 1.05; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
        .hero-title .gold { background: linear-gradient(135deg, #f59e0b, #fde68a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .divider-line { width: 56px; height: 2px; background: linear-gradient(90deg, #7c3aed, #f59e0b); border-radius: 2px; margin: 1rem auto; }
        .hero-sub { font-size: 13px; color: rgba(255,255,255,0.38); font-weight: 400; letter-spacing: 0.02em; }
        .form-body { max-width: 640px; margin: 0 auto; position: relative; z-index: 2; display: flex; flex-direction: column; gap: 0.875rem; }
        .section-head { display: flex; align-items: center; gap: 10px; padding: 1rem 0 0.25rem; flex-wrap: wrap; }
        .icon-box { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; }
        .icon-king { background: rgba(245,158,11,0.14); border: 1px solid rgba(245,158,11,0.28); }
        .icon-queen { background: rgba(124,58,237,0.14); border: 1px solid rgba(124,58,237,0.28); }
        .icon-neutral { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
        .section-title { font-size: 0.85rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
        .section-subtitle { font-size: 11px; color: rgba(255,255,255,0.3); font-weight: 400; margin-left: auto; text-transform: none; letter-spacing: 0; }
        .award-subtitle { font-size: 10px; color: rgba(255,255,255,0.22); font-weight: 400; letter-spacing: 0.05em; font-style: italic; width: 100%; padding-left: 44px; margin-top: -4px; margin-bottom: 2px; }
        .title-king { color: #fbbf24; }
        .title-queen { color: #c4b5fd; }
        .title-neutral { color: rgba(255,255,255,0.7); }
        .req { color: #ef4444; margin-left: 3px; }
        .card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 14px; padding: 1rem 1.2rem; margin-bottom: 0.4rem; transition: border-color 0.2s; }
        .card:hover { border-color: rgba(255,255,255,0.1); }
        .card-king { border-color: rgba(245,158,11,0.2); background: rgba(245,158,11,0.02); }
        .card-queen { border-color: rgba(124,58,237,0.2); background: rgba(124,58,237,0.02); }
        .card-error { border-color: rgba(239, 68, 68, 0.4) !important; background: rgba(239, 68, 68, 0.02) !important; }
        .card-label { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }
        .label-king { color: rgba(251,191,36,0.6); }
        .label-queen { color: rgba(196,181,253,0.6); }
        .label-neutral { color: rgba(255,255,255,0.3); }
        .input-row { position: relative; }
        .input-row input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: #fff; font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 400; padding: 11px 52px 11px 15px; outline: none; transition: all 0.2s; }
        .input-row input::placeholder { color: rgba(255,255,255,0.15); }
        .input-row input:focus { border-color: rgba(124,58,237,0.55); background: rgba(124,58,237,0.06); box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
        .card-king .input-row input:focus { border-color: rgba(245,158,11,0.55); background: rgba(245,158,11,0.06); box-shadow: 0 0 0 3px rgba(245,158,11,0.1); }
        .chip { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 10px; font-weight: 700; padding: 2px 9px; border-radius: 100px; pointer-events: none; font-family: 'Poppins', sans-serif; letter-spacing: 0.04em; }
        .chip-king { background: rgba(245,158,11,0.15); color: #fbbf24; }
        .chip-queen { background: rgba(124,58,237,0.15); color: #c4b5fd; }
        .chip-neutral { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.4); }
        .error-row { display: flex; align-items: center; gap: 6px; margin-top: 8px; font-size: 11px; color: #f87171; font-weight: 500; }
        .sep { display: flex; align-items: center; gap: 12px; margin: 1rem 0; }
        .sep hr { flex: 1; border: none; border-top: 1px solid rgba(255,255,255,0.06); }
        .sep span { font-size: 11px; color: rgba(255,255,255,0.12); letter-spacing: 0.08em; }
        .submit-area { padding-top: 2rem; display: flex; flex-direction: column; align-items: stretch; gap: 12px; }
        .submit-btn { width: 100%; padding: 15px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border: none; border-radius: 12px; color: #000; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 0.04em; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; position: relative; overflow: hidden; }
        .submit-btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.18), transparent 60%); opacity: 0; transition: opacity 0.2s; }
        .submit-btn:hover::after { opacity: 1; }
        .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(245,158,11,0.28); }
        .submit-btn:disabled { background: #334155; color: #94a3b8; cursor: not-allowed; box-shadow: none; transform: none; }
        .submit-btn:disabled::after { display: none; }
        .submit-note { font-size: 11px; color: rgba(255,255,255,0.2); text-align: center; font-weight: 400; letter-spacing: 0.02em; }
        .api-error-box { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 10px; padding: 12px; color: #f87171; font-size: 13px; text-align: center; max-width: 640px; margin: 0 auto 1.5rem; font-weight: 500; }
        .success-screen { position: fixed; inset: 0; background: #09090f; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; text-align: center; padding: 2rem; z-index: 100; animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .success-icon { width: 80px; height: 80px; border-radius: 50%; background: rgba(245,158,11,0.12); border: 2px solid rgba(245,158,11,0.35); display: flex; align-items: center; justify-content: center; font-size: 36px; margin-bottom: 0.5rem; animation: pop 0.45s cubic-bezier(.36,.07,.19,.97); }
        @keyframes pop { 0% { transform: scale(0.4); opacity: 0; } 80% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        .success-title { font-family: 'Poppins', sans-serif; font-size: 2.2rem; font-weight: 800; color: #fff; letter-spacing: -0.02em; line-height: 1.1; }
        .success-title .gold { background: linear-gradient(135deg, #f59e0b, #fde68a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .success-sub { font-size: 14px; color: rgba(255,255,255,0.4); max-width: 300px; line-height: 1.65; font-weight: 400; }
      `}</style>

      {submitted && (
        <div className="success-screen">
          <div className="orb orb1" />
          <div className="orb orb2" />
          <div className="success-icon">👑</div>
          <p className="success-title">You're <span className="gold">All In!</span></p>
          <p className="success-sub">Your nominations have been cast. May the best royalty reign on prom night.</p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", marginTop: "1rem" }}>Results announced at the ceremony</p>
        </div>
      )}

      <div className="prom-root">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />

        <div className="header">
          <div className="badge">
            <span className="badge-dot" />
            Class of 2026 - Nominations Open
          </div>
          <h1 className="hero-title">Prom<br /><span className="gold">Royalty</span> Ballot</h1>
          <div className="divider-line" />
          <p className="hero-sub">Cast your choices for the night's most prestigious honors</p>
        </div>

        {apiError && <div className="api-error-box">⚠️ {apiError}</div>}

        <div className="form-body">
          {CATEGORIES.map((cat) => {
            const isKingTheme = cat.titleClass === "title-king" || (!cat.titleClass && cat.gender === "Male");
            const resolvedTitleClass = cat.titleClass || (isKingTheme ? "title-king" : cat.gender === "Female" ? "title-queen" : "title-neutral");
            const resolvedIconBoxClass = isKingTheme ? "icon-king" : cat.gender === "Female" ? "icon-queen" : "icon-neutral";
            const resolvedIcon = isKingTheme ? "👑" : cat.gender === "Female" ? "💎" : "✨";
            const resolvedCardClass = cat.cardClass || "";
            const resolvedLabelClass = isKingTheme ? "label-king" : cat.gender === "Female" ? "label-queen" : "label-neutral";
            const resolvedChipClass = cat.chipClass || (isKingTheme ? "chip-king" : cat.gender === "Female" ? "chip-queen" : "chip-neutral");
            const hasError = cat.required && errors[cat.id];

            let cardStyling = `card ${resolvedCardClass}`;
            if (cat.required) cardStyling += ` ${isKingTheme ? "card-king" : "card-queen"}`;
            if (hasError) cardStyling += " card-error";

            return (
              <div key={cat.id}>
                <div className="section-head">
                  <div className={`icon-box ${resolvedIconBoxClass}`}>{resolvedIcon}</div>
                  <span className={`section-title ${resolvedTitleClass}`}>
                    {cat.label} {cat.required && <span className="req">*</span>}
                  </span>
                  <span className="section-subtitle">({cat.gender})</span>
                  {cat.subtitle && <span className="award-subtitle">— {cat.subtitle}</span>}
                </div>

                <div className={cardStyling}>
                  <div className={`card-label ${resolvedLabelClass}`}>
                    Your Nomination {cat.required ? "— Required" : "— Optional"}
                  </div>
                  <div className="input-row">
                    <input
                      type="text"
                      value={choices[cat.id][0]}
                      onChange={(e) => handleInputChange(cat.id, 0, e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Full name of your nominee"
                    />
                    <span className={`chip ${resolvedChipClass}`}>✦</span>
                  </div>
                  {hasError && (
                    <div className="error-row"><span>⚠</span> This is a required field</div>
                  )}
                </div>

                <div className="sep"><hr /><span>· · ·</span><hr /></div>
              </div>
            );
          })}

          <div className="submit-area">
            <button className="submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
              <span>{isSubmitting ? "⏳" : "🎟"}</span>
              {isSubmitting ? "Casting Ballots Securely..." : "Submit My Nominations"}
            </button>
            <p className="submit-note">Your vote is anonymous · One submission per student</p>
          </div>
        </div>
      </div>
    </>
  );
}