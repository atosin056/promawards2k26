import { useState } from "react";
import { Crown, Gem, Sparkles, Check } from "lucide-react";

const TOP_NOMINEES = {
  ballonDor: ["Fagbulu", "Jubril", "Azeez",],
  // ✅ No change — Fagzzy was rank 4 (merged from raw variants, not shown in extract but 4th slot retained)
  // ⚠️ Actually the sheet only shows 3 nominees for Ballon D'or. "Fagzzy" may need manual review.

  beautyWithBrains: ["Ummayyah", "Joan", "Abioye Rodiah", "Micheal-Madukwe Shalom"],
  // ✅ Rank 4 corrected: was "Priscilla Njoku", should be "Micheal-Madukwe Shalom"

  bestFemaleDancer: ["Wiqooyat", "Akpa Miracle", "Tosin Emoruwa", "Simi"],
  // ✅ Rank 2 corrected: was "Miracle", should be "Akpa Miracle"; Rank 3: was "Akpa Miracle", should be "Tosin Emoruwa"

  bestGlowUpFemale: ["Temitope", "Tamilore", "Godfrey Grace", "Anjola"],
  // ✅ No change

  bestGlowUpMale: ["Ezun Mayowa", "Ogunba Azeez", "Kayowa", "Kelvin"],
  // ✅ Rank 1 corrected: was "Mayowa", should be "Ezun Mayowa"; Rank 2 corrected: was "Ezun Mayowa", should be "Ogunba Azeez"

  bestMaleDancer: ["Kayowa", "Zane", "Semilore", "Muhammed"],
  // ✅ No change

  bestMusicArtist: ["Nathan", "Semilore (Maylee)", "Mololuwa"],
  // ✅ Rank 2 corrected: was "Semilore", should be "Semilore (Maylee)" (they are one nominee per sheet)
  // ⚠️ Only 3 nominees shown in sheet for this award — "Maylee" as rank 4 may need review

  bigBoldBeautiful: ["Francisca", "Tijani Kanyinsola", "Kulepa Khadijah", "Carmen"],
  // ✅ No change

  brainieeOfTheYear: ["Adedeji Victor", "Olusola Oluseyi", "Godson-Nwankwo Samuel", "Soyingbe ummayyah"],
  // ✅ Rank 2 corrected: was "Victor", should be "Olusola Oluseyi" (ambiguous single-name votes)

  businessGuruFemale: ["Abayomi Abibat", "Miracle", "Khadijah", "Shalom"],
  // ✅ No change

  businessGuruMale: ["Tosin", "Victor", "Maajid", "Obune"],
  // ✅ No change

  ebonyKing: ["Khalid", "Habeeb", "Mayowa", "Olusola Oluseyi"],
  // ✅ Rank 4 corrected: was "Ezun oluwamayowa", should be "Olusola Oluseyi"

  ebonyQueen: ["Janet", "Ramon farida", "Olokooba Aramide", "Iliasu Eniola"],
  // ✅ Rank 4 corrected: was "Jessica", should be "Iliasu Eniola" (Jessica votes were merged under Iliasu Eniola)

  fairestOfThemAllFemale: ["Rebecca", "Mary Claire", "Dora", "Shalom"],
  // ✅ No change

  fairestOfThemAllMale: ["Godson", "Justus", "Adegbesan oluwadamilola", "Erubami Eseoghene"],
  // ✅ No change

  fashionistaFemale: ["Priscilla", "Joan", "Ameera", "Akaayar Martha"],
  // ✅ No change

  fashionistaMale: ["Kelvin", "Olayemi Dara", "Fagbulu Emmanuel", "Zane"],
  // ✅ No change

  funniest: ["Okechukwu Emmanuel", "Awobolaji Andrew", "Nifemi", "Maajid"],
  // ✅ Rank 3 corrected: was "Andrew", should be "Nifemi" (rank 4 in sheet); Rank 4 corrected: was "Nifemi", should be "Maajid" (rank 3 in sheet, but ambiguous)

  lebronJames: ["Oba", "Leke", "Zane", "Ifunaya chukwuma"],
  // ✅ No change

  lifeOfThePartyFemale: ["Francisca", "Ezeji Amarachi", "Yomi-sikiru Ameera", "Miracle"],
  // ✅ No change

  lifeOfThePartyMale: ["Andrew", "Hassan Faiz", "Gbadamosi Idris", "Zane"],
  // ✅ Rank 3 & 4 swapped: sheet rank 3 = Zane (ambiguous), rank 4 = Gbadamosi Idris — corrected order

  mostAttractiveFemale: ["Grace", "Jemima", "Rodiah", "Gbede aishat"],
  // ✅ No change

  mostAttractiveMale: ["Ese", "Kelvin", "Nwadugbo David", "Godson"],
  // ✅ No change

  mostCreative: ["Zainab", "Tosin", "Odukwe ojinika", "Khadijah"],
  // ✅ No change

  mostPopularFemale: ["Carmen", "Yomi-sikiru ameera", "Jemima", "Khadija"],
  // ✅ Rank 3 corrected: was "Yanju", should be "Jemima" (Yanju votes were merged under Jemima per sheet)

  mostPopularMale: ["Obune", "Victor", "Ehuwa Obanla", "Nwadugbo David"],
  // ✅ No change

  mostSocialFemale: ["Carmen", "Yomi-sikiru ameera", "Khadija", "Ezeji Amarachi"],
  // ✅ No change

  mostSocialMale: ["Olayemi Dara", "Adedeji Victor", "Andrew", "Obune Emmanuel"],
  // ✅ No change

  mrPetite: ["Adegbesan Oluwadamilola", "Teriba Dara", "Adeyemi Samuel"],
  // ✅ Rank 1 corrected: was "Damilola", should be "Adegbesan Oluwadamilola"; Rank 2: "Short Dara" → "Teriba Dara"; added rank 3

  msPetite: ["Chizoba", "Otu favour", "Adewuyi ameerah", "Mudashiru Rodiat"],
  // ✅ No change

  // promKing: ["Zane", "Leke", "Ehuwa obanla", "Olayemi Dara"],
  // // ✅ No change

  // promQueen: ["Jemima", "Abioye Rodiah", "Gobir Maryam", "Ojinika"],
  // ✅ No change

  rookieOfTheYear: ["Ese", "Wesey", "Okusanya David", "Alex"],
  // ✅ No change (note: "Wesey" is correct per the sheet — not "Wesley")

  tobiAmusan: ["Jessica", "Makolo Deborah", "Egbowon Blessing", "Akpa Miracle"],
  // ✅ No change

  usainBolt: ["Mosimi", "Juwon", "Eniola"],
  // ✅ No change
};

const ALL_CATEGORIES = [
  // { id: "promKing",               label: "Prom King",                          gender: "Male",   is_required: true  },
  // { id: "promQueen",              label: "Prom Queen",                         gender: "Female", is_required: true  },
  { id: "businessGuruMale",       label: "Business Guru Of The Year (Male)",   gender: "Male",   is_required: true  },
  { id: "businessGuruFemale",     label: "Business Guru Of The Year (Female)", gender: "Female", is_required: true  },
  { id: "ballonDor",              label: "Ballon D'or",                        gender: "Male",   is_required: false },
  { id: "beautyWithBrains",       label: "Beauty With Brains",                 gender: "Female", is_required: false },
  { id: "bestFemaleDancer",       label: "Best Female Dancer",                 gender: "Female", is_required: false },
  { id: "bestGlowUpFemale",       label: "Best Glow Up (Female)",              gender: "Female", is_required: false },
  { id: "bestGlowUpMale",         label: "Best Glow Up (Male)",                gender: "Male",   is_required: false },
  { id: "bestMaleDancer",         label: "Best Male Dancer",                   gender: "Male",   is_required: false },
  { id: "bestMusicArtist",        label: "Best Music Artist",                  gender: "Unisex", is_required: false },
  { id: "bigBoldBeautiful",       label: "Big Bold & Beautiful",               gender: "Female", is_required: false },
  { id: "brainieeOfTheYear",      label: "Brainee of the Year",                gender: "Unisex", is_required: false },
  { id: "ebonyKing",              label: "Ebony King",                         gender: "Male",   is_required: false },
  { id: "ebonyQueen",             label: "Ebony Queen",                        gender: "Female", is_required: false },
  { id: "fairestOfThemAllFemale", label: "Fairest Of Them All (Female)",       gender: "Female", is_required: false },
  { id: "fairestOfThemAllMale",   label: "Fairest Of Them All (Male)",         gender: "Male",   is_required: false },
  { id: "fashionistaFemale",      label: "Fashionista (Female)",               gender: "Female", is_required: false },
  { id: "fashionistaMale",        label: "Fashionista (Male)",                 gender: "Male",   is_required: false },
  { id: "funniest",               label: "Funniest",                           gender: "Unisex", is_required: false },
  { id: "lebronJames",            label: "LeBron James",                       gender: "Male",   is_required: false },
  { id: "lifeOfThePartyFemale",   label: "Life Of The Party (Female)",         gender: "Female", is_required: false },
  { id: "lifeOfThePartyMale",     label: "Life Of The Party (Male)",           gender: "Male",   is_required: false },
  { id: "mostAttractiveFemale",   label: "Most Attractive (Female)",           gender: "Female", is_required: false },
  { id: "mostAttractiveMale",     label: "Most Attractive (Male)",             gender: "Male",   is_required: false },
  { id: "mostCreative",           label: "Most Creative",                      gender: "Unisex", is_required: false },
  { id: "mostPopularFemale",      label: "Most Popular (Female)",              gender: "Female", is_required: false },
  { id: "mostPopularMale",        label: "Most Popular (Male)",                gender: "Male",   is_required: false },
  { id: "mostSocialFemale",       label: "Most Social (Female)",               gender: "Female", is_required: false },
  { id: "mostSocialMale",         label: "Most Social (Male)",                 gender: "Male",   is_required: false },
  { id: "mrPetite",               label: "Mr. Petite",                         gender: "Male",   is_required: false },
  { id: "msPetite",               label: "Ms. Petite",                         gender: "Female", is_required: false },
  { id: "rookieOfTheYear",        label: "Rookie Of The Year",                 gender: "Unisex", is_required: false },
  { id: "tobiAmusan",             label: "Tobi Amusan",                        gender: "Female", is_required: false },
  { id: "usainBolt",              label: "Usain Bolt",                         gender: "Male",   is_required: false },
];

const ICON_BY_GENDER = { Male: Crown, Female: Gem, Unisex: Sparkles };
const ACCENT_PALETTE = ["#F2A93C", "#8B6CF2", "#F2884C", "#3FC9C2", "#E8556B", "#5CC2F2", "#C2E85C", "#C46CF2"];

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
  page: { position: "relative", minHeight: "100vh", background: "#0A0612", overflow: "hidden", padding: "56px 20px 80px", color: "#fff" },
  glowTL: { position: "absolute", top: -140, left: -120, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,108,242,0.28), transparent 70%)", filter: "blur(10px)", pointerEvents: "none" },
  glowBR: { position: "absolute", bottom: -160, right: -140, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(242,169,60,0.20), transparent 70%)", filter: "blur(10px)", pointerEvents: "none" },
  container: { position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto" },
  pillRow: { display: "flex", justifyContent: "center" },
  pill: { display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 999, border: "1px solid rgba(139,108,242,0.45)", background: "rgba(139,108,242,0.10)", color: "#CBB6FF", fontSize: 11, fontWeight: 600, letterSpacing: 0.8 },
  pillDot: { width: 6, height: 6, borderRadius: "50%", background: "#F2A93C", flexShrink: 0 },
  title: { textAlign: "center", fontSize: 42, fontWeight: 800, lineHeight: 1.15, marginTop: 22, letterSpacing: -0.5 },
  underline: { width: 64, height: 3, borderRadius: 999, background: "linear-gradient(90deg,#8B6CF2,#F2A93C)", margin: "18px auto 0" },
  subtitle: { textAlign: "center", color: "rgba(255,255,255,0.45)", fontSize: 13.5, marginTop: 14 },
  errorBox: { background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.30)", borderRadius: 10, padding: "12px 16px", color: "#f87171", fontSize: 13, fontWeight: 500, textAlign: "center", marginBottom: 24 },
  catHeaderRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  catHeaderLeft: { display: "flex", alignItems: "center", gap: 10 },
  iconBox: { width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  catLabel: { fontSize: 13.5, fontWeight: 700, letterSpacing: 0.4 },
  genderTag: { fontSize: 11, color: "rgba(255,255,255,0.32)", whiteSpace: "nowrap" },
  card: { border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "16px 16px 10px", background: "rgba(255,255,255,0.025)", transition: "border-color 0.2s" },
  cardLabel: { fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.35)", paddingLeft: 10, marginBottom: 4 },
  optionRow: { display: "flex", alignItems: "center", gap: 11, padding: "9px 10px", borderRadius: 10, cursor: "pointer", transition: "background 0.15s", userSelect: "none" },
  checkbox: { width: 18, height: 18, minWidth: 18, borderRadius: 6, border: "1.5px solid rgba(255,255,255,0.28)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" },
  optionText: { fontSize: 13.5, transition: "color 0.15s" },
  divider: { textAlign: "center", color: "rgba(255,255,255,0.18)", fontSize: 12, margin: "26px 0", letterSpacing: 5 },
  submitWrap: { display: "flex", justifyContent: "center", marginTop: 36 },
  submitBtn: { padding: "14px 44px", borderRadius: 999, border: "none", background: "linear-gradient(90deg,#8B6CF2,#F2A93C)", color: "#15101F", fontWeight: 700, fontSize: 14, letterSpacing: 0.3, transition: "transform 0.15s, box-shadow 0.15s", cursor: "pointer" },
  hint: { textAlign: "center", fontSize: 11.5, color: "rgba(255,255,255,0.32)", marginTop: 12 },
  ghostBtn: { padding: "11px 28px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.22)", background: "transparent", color: "#fff", fontSize: 13, cursor: "pointer", transition: "background 0.15s" },
};

function genSubmissionId() {
  // crypto.randomUUID() is guaranteed unique — no more collisions
  return "sub_" + crypto.randomUUID().replace(/-/g, "").slice(0, 24);
}

export default function Voting({ seatNo }) {
  const [selections, setSelections]   = useState({});
  const [submitted, setSubmitted]     = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError]       = useState("");

  const select = (catId, nominee) => {
    setSelections((prev) => ({ ...prev, [catId]: prev[catId] === nominee ? null : nominee }));
  };

  const requiredIds = ALL_CATEGORIES.filter((c) => c.is_required).map((c) => c.id);
  const canSubmit   = !isSubmitting && requiredIds.every((id) => selections[id]);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    setApiError("");

    const payload = {
      submission_id: genSubmissionId(),
      seat_no: seatNo,
      votes: ALL_CATEGORIES
        .filter((cat) => selections[cat.id])
        .map((cat) => ({
          category_id:  cat.id,
          nominee_name: selections[cat.id],
          choice_rank:  1,
        })),
      submitted_at: new Date().toISOString(),
    };

    try {
      const res = await fetch("https://mobilix.com.ng/promawards/processvotes.php", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.status === "success") {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (res.status === 403) {
        // Seat already voted
        setApiError(result.message || "This seat has already submitted a ballot.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setApiError(result.message || "Something went wrong. Please try again.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error("Submit error:", err);
      setApiError("Network error. Could not reach the ballot server. Check your connection.");
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
          style={{ ...styles.container, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16, textAlign: "center" }}
        >
          <div style={{ width: 60, height: 60, borderRadius: 18, background: "linear-gradient(135deg,#8B6CF2,#F2A93C)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Check size={28} color="#15101F" strokeWidth={3} />
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Ballot submitted!</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13.5, margin: 0 }}>
            Thanks for voting, Class of 2026. Results announced at the ceremony.
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
          <span style={{ color: "#F2A93C" }}>Royalty</span> <span style={{ color: "#fff" }}>Ballot</span>
        </h1>
        <div style={styles.underline} />
        <p style={styles.subtitle}>Cast your vote for the night's most prestigious honors</p>

        {apiError && (
          <div style={{ ...styles.errorBox, marginTop: 24 }}>⚠️ {apiError}</div>
        )}

        <div style={{ marginTop: 44 }}>
          {ALL_CATEGORIES.map((cat, idx) => {
            const Icon      = ICON_BY_GENDER[cat.gender] || Sparkles;
            const accent    = ACCENT_PALETTE[idx % ACCENT_PALETTE.length];
            const accentSoft = accent + "24";
            const nominees  = TOP_NOMINEES[cat.id] || [];
            const sel       = selections[cat.id];

            return (
              <div key={cat.id}>
                <div style={styles.catHeaderRow}>
                  <div style={styles.catHeaderLeft}>
                    <div style={{ ...styles.iconBox, background: accentSoft }}>
                      <Icon size={17} color={accent} />
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                      <span style={styles.catLabel}>{cat.label.toUpperCase()}</span>
                      {cat.is_required && <span style={{ color: "#E8556B", fontSize: 13 }}>*</span>}
                    </div>
                  </div>
                  <span style={styles.genderTag}>({cat.gender})</span>
                </div>

                {nominees.length === 0 ? (
                  <p style={{ ...styles.hint, marginTop: 0, marginBottom: 18 }}>No nominees on file for this category yet.</p>
                ) : (
                  <div style={{ ...styles.card, borderColor: sel ? accent + "55" : "rgba(255,255,255,0.08)" }}>
                    <div style={styles.cardLabel}>YOUR VOTE — {cat.is_required ? "REQUIRED" : "OPTIONAL"}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {nominees.map((name) => {
                        const checked = sel === name;
                        return (
                          <div
                            key={name}
                            className="pb-option"
                            style={{ ...styles.optionRow, background: checked ? accentSoft : "transparent" }}
                            onClick={() => select(cat.id, name)}
                          >
                            <span
                              className={`pb-checkbox${checked ? " pb-checked" : ""}`}
                              style={{ ...styles.checkbox, borderColor: checked ? accent : "rgba(255,255,255,0.28)", background: checked ? accent : "transparent" }}
                            >
                              {checked && <Check size={11} color="#15101F" strokeWidth={3.5} />}
                            </span>
                            <span style={{ ...styles.optionText, color: checked ? "#fff" : "rgba(255,255,255,0.72)" }}>{name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {idx < ALL_CATEGORIES.length - 1 && <div style={styles.divider}>• • •</div>}
              </div>
            );
          })}
        </div>

        <div style={styles.submitWrap}>
          <button
            className="pb-submit"
            disabled={!canSubmit}
            onClick={handleSubmit}
            style={{ ...styles.submitBtn, opacity: canSubmit ? 1 : 0.4, cursor: canSubmit ? "pointer" : "not-allowed" }}
          >
            {isSubmitting ? "Submitting…" : "Submit Ballot"}
          </button>
        </div>
        {!canSubmit && !isSubmitting && (
          <p style={styles.hint}>Fill in all required (*) categories to submit.</p>
        )}
      </div>
    </div>
  );
}