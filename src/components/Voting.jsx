import { useState } from "react";
import { Crown, Gem, Check } from "lucide-react";

// TODO: replace with your Node.js endpoint (was the PHP processvotes.php)
const VOTE_ENDPOINT = "https://promawards2k26backend.onrender.com/api/vote";

const TOP_NOMINEES = {
  promKing: [
    "Ehuwa Obanla",
    "Olukayode Zane",
    "Nwadugbo Edoziem (Leke)",
    "Olayemi Oluwadara",
  ],
  // promKing: ["Test user 1", "Test user 2", "Test user 3", "Test user 4"],
  promQueen: [
    "Aiyewumi Jemima",
    "Abioye Rodiah",
    "Gobir Maryam",
    "Odukwe Ojinika",
  ],
};

const ALL_CATEGORIES = [
  { id: "promKing", label: "Prom King", gender: "Male", is_required: true },
  { id: "promQueen", label: "Prom Queen", gender: "Female", is_required: true },
];

const ICON_BY_GENDER = { Male: Crown, Female: Gem };
const ACCENT_PALETTE = ["#F2A93C", "#8B6CF2"];

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
  .pb-root, .pb-root * { box-sizing: border-box; font-family: 'Poppins', sans-serif; }
  .pb-option:hover .pb-checkbox:not(.pb-checked) { border-color: rgba(255,255,255,0.5) !important; }
  .pb-option:hover { background: rgba(255,255,255,0.035) !important; }
  .pb-submit:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(139,108,242,0.35); }
  .pb-submit:not(:disabled):active { transform: translateY(0); }
  .pb-ghost:hover { background: rgba(255,255,255,0.06) !important; }
  .pb-fade-in { animation: pbFadeIn 0.4s ease both; }
  @keyframes pbFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
`;

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    background: "#0A0612",
    overflow: "hidden",
    padding: "56px 20px 80px",
    color: "#fff",
  },
  glowTL: {
    position: "absolute",
    top: -140,
    left: -120,
    width: 420,
    height: 420,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(139,108,242,0.28), transparent 70%)",
    filter: "blur(10px)",
    pointerEvents: "none",
  },
  glowBR: {
    position: "absolute",
    bottom: -160,
    right: -140,
    width: 480,
    height: 480,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(242,169,60,0.20), transparent 70%)",
    filter: "blur(10px)",
    pointerEvents: "none",
  },
  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: 640,
    margin: "0 auto",
  },
  pillRow: { display: "flex", justifyContent: "center" },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 18px",
    borderRadius: 999,
    border: "1px solid rgba(139,108,242,0.45)",
    background: "rgba(139,108,242,0.10)",
    color: "#CBB6FF",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.8,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#F2A93C",
    flexShrink: 0,
  },
  title: {
    textAlign: "center",
    fontSize: 42,
    fontWeight: 800,
    lineHeight: 1.15,
    marginTop: 22,
    letterSpacing: -0.5,
  },
  underline: {
    width: 64,
    height: 3,
    borderRadius: 999,
    background: "linear-gradient(90deg,#8B6CF2,#F2A93C)",
    margin: "18px auto 0",
  },
  subtitle: {
    textAlign: "center",
    color: "rgba(255,255,255,0.45)",
    fontSize: 13.5,
    marginTop: 14,
  },
  errorBox: {
    background: "rgba(239,68,68,0.10)",
    border: "1px solid rgba(239,68,68,0.30)",
    borderRadius: 10,
    padding: "12px 16px",
    color: "#f87171",
    fontSize: 13,
    fontWeight: 500,
    textAlign: "center",
    marginBottom: 24,
  },
  catHeaderRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  catHeaderLeft: { display: "flex", alignItems: "center", gap: 10 },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  catLabel: { fontSize: 13.5, fontWeight: 700, letterSpacing: 0.4 },
  genderTag: {
    fontSize: 11,
    color: "rgba(255,255,255,0.32)",
    whiteSpace: "nowrap",
  },
  card: {
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "16px 16px 10px",
    background: "rgba(255,255,255,0.025)",
    transition: "border-color 0.2s",
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
    color: "rgba(255,255,255,0.35)",
    paddingLeft: 10,
    marginBottom: 4,
  },
  optionRow: {
    display: "flex",
    alignItems: "center",
    gap: 11,
    padding: "9px 10px",
    borderRadius: 10,
    cursor: "pointer",
    transition: "background 0.15s",
    userSelect: "none",
  },
  checkbox: {
    width: 18,
    height: 18,
    minWidth: 18,
    borderRadius: 6,
    border: "1.5px solid rgba(255,255,255,0.28)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
  },
  optionText: { fontSize: 13.5, transition: "color 0.15s" },
  divider: {
    textAlign: "center",
    color: "rgba(255,255,255,0.18)",
    fontSize: 12,
    margin: "26px 0",
    letterSpacing: 5,
  },
  submitWrap: { display: "flex", justifyContent: "center", marginTop: 36 },
  submitBtn: {
    padding: "14px 44px",
    borderRadius: 999,
    border: "none",
    background: "linear-gradient(90deg,#8B6CF2,#F2A93C)",
    color: "#15101F",
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: 0.3,
    transition: "transform 0.15s, box-shadow 0.15s",
    cursor: "pointer",
  },
  hint: {
    textAlign: "center",
    fontSize: 11.5,
    color: "rgba(255,255,255,0.32)",
    marginTop: 12,
  },
  ghostBtn: {
    padding: "11px 28px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.22)",
    background: "transparent",
    color: "#fff",
    fontSize: 13,
    cursor: "pointer",
    transition: "background 0.15s",
  },
};

export default function Voting({ seatNo }) {
  const [selections, setSelections] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const select = (catId, nominee) => {
    setSelections((prev) => ({
      ...prev,
      [catId]: prev[catId] === nominee ? null : nominee,
    }));
  };

  const requiredIds = ALL_CATEGORIES.filter((c) => c.is_required).map(
    (c) => c.id,
  );
  const canSubmit = !isSubmitting && requiredIds.every((id) => selections[id]);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    setApiError("");

    // submission_id is now generated server-side by the Node backend
    const payload = {
      seat_no: seatNo,
      choices: ALL_CATEGORIES.filter((cat) => selections[cat.id]).reduce(
        (acc, cat) => {
          acc[cat.id] = selections[cat.id]; // Creates key-value pairs
          return acc;
        },
        {},
      ),
    };

    try {
      const res = await fetch(VOTE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      // NOTE: backend returns `success: true/false`, not `status: "success"`
      if (res.ok && result.success) {
        setSuccessMessage(result.message || "Your ballot has been submitted!");
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (res.status === 403) {
        // Seat already voted
        setApiError(
          result.message || "This seat has already submitted a ballot.",
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setApiError(
          result.message || "Something went wrong. Please try again.",
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error("Submit error:", err);
      setApiError(
        "Network error. Could not reach the ballot server. Check your connection.",
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="pb-root" style={styles.page}>
        <style>{GLOBAL_CSS}</style>
        <div style={styles.glowTL} />
        <div style={styles.glowBR} />
        <div
          className="pb-fade-in"
          style={{
            ...styles.container,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: 16,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 18,
              background: "linear-gradient(135deg,#8B6CF2,#F2A93C)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={28} color="#15101F" strokeWidth={3} />
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>
            Ballot submitted!
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 13.5,
              margin: 0,
            }}
          >
            {successMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-root" style={styles.page}>
      <style>{GLOBAL_CSS}</style>
      <div style={styles.glowTL} />
      <div style={styles.glowBR} />

      <div style={styles.container}>
        <div style={styles.pillRow}>
          <span style={styles.pill}>
            <span style={styles.pillDot} />
            CLASS OF 2026 — VOTING OPEN
          </span>
        </div>

        <h1 style={styles.title}>
          <span style={{ color: "#fff" }}>Prom</span>
          <br />
          <span style={{ color: "#F2A93C" }}>Royalty</span>{" "}
          <span style={{ color: "#fff" }}>Ballot</span>
        </h1>
        <div style={styles.underline} />
        <p style={styles.subtitle}>
          Cast your vote for the night's most prestigious honors
        </p>

        {apiError && (
          <div style={{ ...styles.errorBox, marginTop: 24 }}>⚠️ {apiError}</div>
        )}

        <div style={{ marginTop: 44 }}>
          {ALL_CATEGORIES.map((cat, idx) => {
            const Icon = ICON_BY_GENDER[cat.gender];
            const accent = ACCENT_PALETTE[idx % ACCENT_PALETTE.length];
            const accentSoft = accent + "24";
            const nominees = TOP_NOMINEES[cat.id] || [];
            const sel = selections[cat.id];

            return (
              <div key={cat.id}>
                <div style={styles.catHeaderRow}>
                  <div style={styles.catHeaderLeft}>
                    <div style={{ ...styles.iconBox, background: accentSoft }}>
                      <Icon size={17} color={accent} />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 5,
                      }}
                    >
                      <span style={styles.catLabel}>
                        {cat.label.toUpperCase()}
                      </span>
                      {cat.is_required && (
                        <span style={{ color: "#E8556B", fontSize: 13 }}>
                          *
                        </span>
                      )}
                    </div>
                  </div>
                  <span style={styles.genderTag}>({cat.gender})</span>
                </div>

                {nominees.length === 0 ? (
                  <p style={{ ...styles.hint, marginTop: 0, marginBottom: 18 }}>
                    No nominees on file for this category yet.
                  </p>
                ) : (
                  <div
                    style={{
                      ...styles.card,
                      borderColor: sel
                        ? accent + "55"
                        : "rgba(255,255,255,0.08)",
                    }}
                  >
                    <div style={styles.cardLabel}>
                      YOUR VOTE — {cat.is_required ? "REQUIRED" : "OPTIONAL"}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      {nominees.map((name) => {
                        const checked = sel === name;
                        return (
                          <div
                            key={name}
                            className="pb-option"
                            style={{
                              ...styles.optionRow,
                              background: checked ? accentSoft : "transparent",
                            }}
                            onClick={() => select(cat.id, name)}
                          >
                            <span
                              className={`pb-checkbox${checked ? " pb-checked" : ""}`}
                              style={{
                                ...styles.checkbox,
                                borderColor: checked
                                  ? accent
                                  : "rgba(255,255,255,0.28)",
                                background: checked ? accent : "transparent",
                              }}
                            >
                              {checked && (
                                <Check
                                  size={11}
                                  color="#15101F"
                                  strokeWidth={3.5}
                                />
                              )}
                            </span>
                            <span
                              style={{
                                ...styles.optionText,
                                color: checked
                                  ? "#fff"
                                  : "rgba(255,255,255,0.72)",
                              }}
                            >
                              {name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {idx < ALL_CATEGORIES.length - 1 && (
                  <div style={styles.divider}>• • •</div>
                )}
              </div>
            );
          })}
        </div>

        <div style={styles.submitWrap}>
          <button
            className="pb-submit"
            disabled={!canSubmit}
            onClick={handleSubmit}
            style={{
              ...styles.submitBtn,
              opacity: canSubmit ? 1 : 0.4,
              cursor: canSubmit ? "pointer" : "not-allowed",
            }}
          >
            {isSubmitting ? "Submitting…" : "Submit Ballot"}
          </button>
        </div>
        {!canSubmit && !isSubmitting && (
          <p style={styles.hint}>
            Fill in all required (*) categories to submit.
          </p>
        )}
      </div>
    </div>
  );
}
