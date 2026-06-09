import { useState } from "react";

const CATEGORIES = [
  { id: "king", label: "Prom King", gender: "Male", required: true, titleClass: "title-king", chipClass: "chip-king", cardClass: "card-king" },
  { id: "queen", label: "Prom Queen", gender: "Female", required: true, titleClass: "title-queen", chipClass: "chip-queen", cardClass: "card-queen" },
  { id: "mrsebony", label: "Mrs Ebony", gender: "Female", required: true, titleClass: "title-queen", chipClass: "chip-queen", cardClass: "card-queen" },
  { id: "mrebony", label: "Mr Ebony", gender: "Male", required: false, titleClass: "title-king", chipClass: "chip-king", cardClass: "card-king" },
  { id: "lifeOfTheParty", label: "Life of the Party", gender: "Unisex", required: false },
  { id: "bestDancerMale", label: "Best Dancer (Male)", gender: "Male", required: false },
  { id: "bestDancerFemale", label: "Best Dancer (Female)", gender: "Female", required: false },
  { id: "bestGlowUpMale", label: "Best Glow-Up (Male)", gender: "Male", required: false },
  { id: "bestGlowUpFemale", label: "Best Glow-Up (Female)", gender: "Female", required: false },
  { id: "mostAthleticMale", label: "Most Athletic (Male)", gender: "Male", required: false },
  { id: "mostAthleticFemale", label: "Most Athletic (Female)", gender: "Female", required: false },
  { id: "mostPopularMale", label: "Most Popular (Male)", gender: "Male", required: false },
  { id: "mostPopularFemale", label: "Most Popular (Female)", gender: "Female", required: false },
  { id: "mostSocialMale", label: "Most Social (Male)", gender: "Male", required: false },
  { id: "mostSocialFemale", label: "Most Social (Female)", gender: "Female", required: false },
  { id: "twoPeasInAPod", label: "Two Peas In A Pod", gender: "Unisex Pairs", required: false },
  { id: "bestFriendGroupMale", label: "Best Friend Group (Male)", gender: "Male", required: false },
  { id: "bestFriendGroupFemale", label: "Best Friend Group (Female)", gender: "Female", required: false },
  { id: "mostFashionableMale", label: "Most Fashionable (Male)", gender: "Male", required: false },
  { id: "mostFashionableFemale", label: "Most Fashionable (Female)", gender: "Female", required: false },
  { id: "bigBoldBeautiful", label: "Big Bold and Beautiful", gender: "Females only...", required: false },
  { id: "rookieOfTheYear", label: "Rookie Of The Year", gender: "Unisex Award", required: false },
  { id: "ballonDor", label: "Ballon D'or", gender: "Male", required: false },
  { id: "mostAttractiveMale", label: "Most Attractive (Male)", gender: "Male", required: false },
  { id: "mostAttractiveFemale", label: "Most Attractive (Female)", gender: "Female", required: false },
  { id: "hourglass", label: "Hour Glass", gender: "Female", required: false },
  { id: "fairestOfThemAllMale", label: "Fairest Of Them All (Male)", gender: "Male", required: false },
  { id: "fairestOfThemAllFemale", label: "Fairest Of Them All (Female)", gender: "Female", required: false },
  { id: "influencerMale", label: "Influencer Of The Year (Male)", gender: "Male", required: false },
  { id: "influencerFemale", label: "Influencer Of The Year (Female)", gender: "Female", required: false },
  { id: "einsteinMale", label: "Einstein Of The Year (Male)", gender: "Male", required: false },
  { id: "einsteinFemale", label: "Einstein Of The Year (Female)", gender: "Female", required: false },
  { id: "mostNonchalant", label: "Most Nonchalant", gender: "Male only", required: false },
  { id: "arabMoneyMale", label: "Arab Money (Male)", gender: "Male", required: false },
  { id: "arabMoneyFemale", label: "Arab Money (Female)", gender: "Female", required: false },
  { id: "mrPetite", label: "Mr Petite", gender: "Male", required: false },
  { id: "mrsPetite", label: "Mrs Petite", gender: "Female", required: false },
  { id: "beautyWithBrains", label: "Beauty With Brains", gender: "Female", required: false },
  { id: "kevinHartMale", label: "Kevin Hart Of The Year (Male)", gender: "Male", required: false },
  { id: "kevinHartFemale", label: "Kevin Hart Of The Year (Female)", gender: "Female", required: false },
  { id: "entrepreneurMale", label: "Entrepreneur Of The Year (Male)", gender: "Male", required: false },
  { id: "entrepreneurFemale", label: "Entrepreneur Of The Year (Female)", gender: "Female", required: false },
  { id: "mostAesthetic", label: "Most Aesthetic (Best Artist/Drawer)", gender: "Unisex", required: false },
  { id: "musicArtist", label: "Music Artist of the Year", gender: "Unisex", required: false },
];

export default function Dashboard({ seatNo }) {
  const [choices, setChoices] = useState(() =>
    CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.id]: ["", "", ""] }), {})
  );

  const [errors, setErrors] = useState({ king: false, queen: false, mrsebony: false });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Handles slow internet loading state
  const [apiError, setApiError] = useState(""); // Captures unexpected backend script failures

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
    // Prevent multiple clicks if connection is lagging
    if (isSubmitting) return;

    const newErrors = {
      king: !choices.king[0].trim(),
      queen: !choices.queen[0].trim(),
      mrsebony: !choices.mrsebony[0].trim(),
    };

    setErrors(newErrors);

    if (newErrors.king || newErrors.queen || newErrors.mrsebony) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    try {
      // API call point using standard JavaScript fetch
      const response = await fetch("https://mobilix.com.ng/promawards/submit_votes.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ choices: choices, seatNo: seatNo}),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Grab error message directly from the PHP server script
        setApiError(result.message || "An unexpected error occurred on the ballot server.");
        
        // ─── ADDED: LOCK INTERFACE IF USER HAS ALREADY VOTED (403 FORBIDDEN) ───
        if (response.status === 403) {
          setSubmitted(true);
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error("Connection Error: ", err);
      setApiError("Network timeout. Could not connect to the ballot server. Please check your connection.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        .orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(90px);
          opacity: 0.16;
        }
        .orb1 { width: 480px; height: 480px; background: #6d28d9; top: -140px; left: -120px; }
        .orb2 { width: 380px; height: 380px; background: #d97706; top: 260px; right: -100px; }
        .orb3 { width: 340px; height: 340px; background: #7c3aed; bottom: 60px; left: 35%; }
        .header { text-align: center; position: relative; z-index: 2; padding-bottom: 2.5rem; }
        .badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(124, 58, 237, 0.18); border: 1px solid rgba(124, 58, 237, 0.35);
          border-radius: 100px; padding: 5px 18px; font-size: 11px; font-weight: 600;
          letter-spacing: 0.13em; text-transform: uppercase; color: #c4b5fd; margin-bottom: 1.25rem;
        }
        .badge-dot { width: 6px; height: 6px; background: #f59e0b; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.75); } }
        .hero-title { font-size: 3rem; font-weight: 900; color: #ffffff; line-height: 1.05; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
        .hero-title .gold { background: linear-gradient(135deg, #f59e0b, #fde68a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .divider-line { width: 56px; height: 2px; background: linear-gradient(90deg, #7c3aed, #f59e0b); border-radius: 2px; margin: 1rem auto; }
        .hero-sub { font-size: 13px; color: rgba(255,255,255,0.38); font-weight: 400; letter-spacing: 0.02em; }
        .form-body { max-width: 640px; margin: 0 auto; position: relative; z-index: 2; display: flex; flex-direction: column; gap: 0.875rem; }
        .section-head { display: flex; align-items: center; gap: 10px; padding: 1rem 0 0.25rem; }
        .icon-box { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; }
        .icon-king { background: rgba(245,158,11,0.14); border: 1px solid rgba(245,158,11,0.28); }
        .icon-queen { background: rgba(124,58,237,0.14); border: 1px solid rgba(124,58,237,0.28); }
        .icon-neutral { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
        .section-title { font-size: 0.85rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
        .section-subtitle { font-size: 11px; color: rgba(255,255,255,0.3); font-weight: 400; margin-left: auto; text-transform: none; letter-spacing: 0; }
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
        .input-row input {
          width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; color: #fff; font-family: 'Poppins', sans-serif; font-size: 13px;
          font-weight: 400; padding: 11px 52px 11px 15px; outline: none; transition: all 0.2s;
        }
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
        .submit-btn {
          width: 100%; padding: 15px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border: none; border-radius: 12px; color: #000; font-family: 'Poppins', sans-serif;
          font-size: 14px; font-weight: 700; letter-spacing: 0.04em; cursor: pointer;
          transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; position: relative; overflow: hidden;
        }
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
          <p className="success-title">
            You're <span className="gold">All In!</span>
          </p>
          <p className="success-sub">
            Your nominations have been cast. May the best royalty reign on prom night.
          </p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", marginTop: "1rem" }}>
            Results announced at the ceremony
          </p>
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
          <h1 className="hero-title">
            Prom<br /><span className="gold">Royalty</span> Ballot
          </h1>
          <div className="divider-line" />
          <p className="hero-sub">Cast your choices for the night's most prestigious honors</p>
        </div>

        {/* SERVER API ERROR ALERT DISPLAY */}
        {apiError && (
          <div className="api-error-box">
            ⚠️ {apiError}
          </div>
        )}

        <div className="form-body">
          {CATEGORIES.map((cat) => {
            const isKingTheme = cat.titleClass === "title-king" || (!cat.titleClass && cat.gender === "Male");
            const resolvedTitleClass = cat.titleClass || (isKingTheme ? "title-king" : cat.gender === "Female" ? "title-queen" : "title-neutral");
            const resolvedIconBoxClass = isKingTheme ? "icon-king" : cat.gender === "Female" ? "icon-queen" : "icon-neutral";
            const resolvedIcon = isKingTheme ? "👑" : cat.gender === "Female" ? "💎" : "✨";
            const resolvedCardClass = cat.cardClass || "";
            const resolvedLabelClass = isKingTheme ? "label-king" : cat.gender === "Female" ? "label-queen" : "label-neutral";
            const resolvedChipClass = cat.chipClass || (isKingTheme ? "chip-king" : cat.gender === "Female" ? "chip-queen" : "chip-neutral");

            return (
              <div key={cat.id}>
                <div className="section-head">
                  <div className={`icon-box ${resolvedIconBoxClass}`}>{resolvedIcon}</div>
                  <span className={`section-title ${resolvedTitleClass}`}>
                    {cat.label} {cat.required && <span className="req">*</span>}
                  </span>
                  <span className="section-subtitle">({cat.gender})</span>
                </div>

                {[0, 1, 2].map((index) => {
                  const isRequiredField = cat.required && index === 0;
                  const hasError = isRequiredField && errors[cat.id];
                  const choiceValue = choices[cat.id][index];

                  let cardStyling = `card ${resolvedCardClass}`;
                  if (isRequiredField) cardStyling += ` ${isKingTheme ? "card-king" : "card-queen"}`;
                  if (hasError) cardStyling += " card-error";

                  return (
                    <div className={cardStyling} key={index}>
                      <div className={`card-label ${resolvedLabelClass}`}>
                        {index === 0 ? "1st Choice" : index === 1 ? "2nd Choice" : "3rd Choice"} 
                        {isRequiredField ? " — Required" : " — Optional"}
                      </div>
                      <div className="input-row">
                        <input
                          type="text"
                          value={choiceValue}
                          onChange={(e) => handleInputChange(cat.id, index, e.target.value)}
                          disabled={isSubmitting} // Lock components during submit processing
                          placeholder={
                            cat.id === "twoPeasInAPod" || cat.id === "bestFriendGroupMale" || cat.id === "bestFriendGroupFemale"
                              ? "e.g. Names of the group/pair members"
                              : "Full name of your nominee"
                          }
                        />
                        <span className={`chip ${index === 0 ? resolvedChipClass : "chip-neutral"}`}>
                          #{index + 1}
                        </span>
                      </div>
                      {hasError && (
                        <div className="error-row">
                          <span>⚠</span> This is a required field
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="sep"><hr /><span>· · ·</span><hr /></div>
              </div>
            );
          })}

          <div className="submit-area">
            <button 
              className="submit-btn" 
              onClick={handleSubmit} 
              disabled={isSubmitting}
            >
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