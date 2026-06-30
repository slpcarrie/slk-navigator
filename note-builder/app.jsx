const { useState } = React;

const PRONOUNS = {
  "he/him":    { sub:"he",   obj:"him",  pos:"his",   ref:"himself" },
  "she/her":   { sub:"she",  obj:"her",  pos:"her",   ref:"herself" },
  "they/them": { sub:"they", obj:"them", pos:"their", ref:"themselves" },
};

function fmtDate(val) {
  if (!val) return new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
  return new Date(val+"T12:00:00").toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
}

const inputStyle = {
  width:"100%", padding:"7px 10px", border:"1px solid #ccd8ce", borderRadius:6,
  fontSize:13, fontFamily:"inherit", color:"#2d3a32", background:"white",
  outline:"none", boxSizing:"border-box"
};
const labelStyle = { display:"block", fontSize:12, fontWeight:600, color:"#4a6354", marginBottom:3 };
const secTitleStyle = {
  fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.07em",
  color:"#2e7d52", marginBottom:10, paddingBottom:5, borderBottom:"1px solid #d4ead9"
};

function GoalCard({ num, goal, onChange, onRemove, type }) {
  const setField = (k, v) => onChange({ ...goal, [k]: v });
  return (
    <div style={{ border:"1px solid #d0ddd4", borderRadius:8, padding:12, marginBottom:8, background:"#f8fbf9" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <span style={{ fontSize:11, fontWeight:700, color:"#2e7d52", background:"#d4ead9", padding:"2px 8px", borderRadius:20 }}>Goal {num}</span>
        <button onClick={onRemove} style={{ fontSize:11, color:"#aabdb3", background:"none", border:"none", cursor:"pointer" }}>Remove</button>
      </div>
      <div style={{ marginBottom:8 }}>
        <label style={labelStyle}>Target skill</label>
        <input style={inputStyle} value={goal.skill||""} onChange={e=>setField("skill",e.target.value)}
          placeholder="e.g. /r/ in initial position, 2-step directions, expressive vocabulary" />
      </div>
      {type === "session" ? (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
          <div>
            <label style={labelStyle}>Accuracy / performance</label>
            <input style={inputStyle} value={goal.acc||""} onChange={e=>setField("acc",e.target.value)}
              placeholder="e.g. 8/10 with min cues" />
          </div>
          <div>
            <label style={labelStyle}>Adequate progress?</label>
            <div style={{ display:"flex", gap:6 }}>
              {["yes","no"].map(opt => (
                <button key={opt} onClick={()=>setField("prog",opt)} style={{
                  flex:1, padding:"7px 4px", fontSize:11, fontWeight:700, borderRadius:6, cursor:"pointer", border:"1.5px solid",
                  borderColor: goal.prog===opt ? (opt==="yes"?"#27ae60":"#c0392b") : "#d0ddd4",
                  background: goal.prog===opt ? (opt==="yes"?"#d5f5e3":"#fde8e8") : "white",
                  color: goal.prog===opt ? (opt==="yes"?"#1a7a42":"#922b21") : "#4a6354"
                }}>{opt==="yes"?"✓ Yes":"✗ No"}</button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom:8 }}>
          <div style={{ marginBottom:8 }}>
            <label style={labelStyle}>Current ability / accuracy</label>
            <input style={inputStyle} value={goal.curr||""} onChange={e=>setField("curr",e.target.value)}
              placeholder="e.g. 70% accuracy with visual supports" />
          </div>
          <div>
            <label style={labelStyle}>Adequate progress?</label>
            <div style={{ display:"flex", gap:6 }}>
              {[["yes","✓ Making adequate progress"],["no","✗ Not making adequate progress"]].map(([opt,lbl]) => (
                <button key={opt} onClick={()=>setField("prog",opt)} style={{
                  flex:1, padding:"7px 6px", fontSize:11, fontWeight:700, borderRadius:6, cursor:"pointer", border:"1.5px solid",
                  borderColor: goal.prog===opt ? (opt==="yes"?"#27ae60":"#c0392b") : "#d0ddd4",
                  background: goal.prog===opt ? (opt==="yes"?"#d5f5e3":"#fde8e8") : "white",
                  color: goal.prog===opt ? (opt==="yes"?"#1a7a42":"#922b21") : "#4a6354"
                }}>{lbl}</button>
              ))}
            </div>
          </div>
        </div>
      )}
      <div>
        <label style={labelStyle}>Notes <span style={{ fontWeight:400, color:"#aabdb3" }}>(optional)</span></label>
        <input style={inputStyle} value={goal.note||""} onChange={e=>setField("note",e.target.value)}
          placeholder="e.g. best on CVC words, clusters still challenging" />
      </div>
    </div>
  );
}

function copyText(text, onDone) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(onDone).catch(() => fallbackCopy(text, onDone));
  } else {
    fallbackCopy(text, onDone);
  }
}

function fallbackCopy(text, onDone) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    onDone();
  } catch (err) {
    // no-op; button will just not show "Copied!"
  }
}

function NoteBlock({ title, body, billing }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    copyText(body, () => { setCopied(true); setTimeout(()=>setCopied(false),1800); });
  };
  return (
    <div style={{
      background: billing ? "#fffbf0" : "white",
      border: `1px solid ${billing ? "#f5d59a" : "#d0ddd4"}`,
      borderRadius:10, overflow:"hidden", marginBottom:10
    }}>
      <div style={{
        background: billing ? "#fef3d0" : "#edf7f1",
        borderBottom: `1px solid ${billing ? "#f5d59a" : "#d4ead9"}`,
        padding:"7px 14px", display:"flex", justifyContent:"space-between", alignItems:"center"
      }}>
        <span style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.05em", color: billing?"#8a6010":"#2e7d52" }}>{title}</span>
        <button onClick={copy} style={{ fontSize:11, color:"#8aaa96", background:"none", border:"none", cursor:"pointer", padding:"2px 6px", borderRadius:4 }}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div style={{ padding:14, fontSize:13, lineHeight:1.85, color:"#2d3a32", fontFamily: billing ? "inherit" : "Georgia, serif", whiteSpace:"pre-wrap" }}>
        {body}
      </div>
    </div>
  );
}

function SLKNoteBuilder() {
  const [mode, setMode] = useState("session");
  const [pronoun, setPronoun] = useState("he/him");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Session state
  const [sType, setSType] = useState("individual");
  const [sAttend, setSAttend] = useState("present");
  const [sBehavior, setSBehavior] = useState("");
  const [sPlan, setSPlan] = useState("");
  const [sGoals, setSGoals] = useState([{ skill:"", acc:"", prog:"", note:"" }]);

  // Progress state
  const [pPeriod, setPPeriod] = useState("");
  const [pGoals, setPGoals] = useState([{ skill:"", curr:"", prog:"", note:"" }]);

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState("");

  const addSGoal = () => setSGoals(g => [...g, { skill:"", acc:"", prog:"", note:"" }]);
  const addPGoal = () => setPGoals(g => [...g, { skill:"", curr:"", prog:"", note:"" }]);
  const updateSGoal = (i, v) => setSGoals(g => g.map((x,idx) => idx===i ? v : x));
  const updatePGoal = (i, v) => setPGoals(g => g.map((x,idx) => idx===i ? v : x));
  const removeSGoal = (i) => setSGoals(g => g.filter((_,idx)=>idx!==i));
  const removePGoal = (i) => setPGoals(g => g.filter((_,idx)=>idx!==i));

  const p = PRONOUNS[pronoun];

  // Update this to your deployed backend URL once you have it (e.g. https://your-app.vercel.app/api/generate)
  const API_URL = window.SLK_API_URL || "/api/generate";

  const callClaude = async (prompt, system) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        system: system || "You are a school-based speech-language pathologist writing clear, concise clinical notes. Use 'Client' as the student name. Write only what is supported by the data provided — do not invent session details, activities, diagnoses, or assumptions about the student's educational plan. Keep language plain and accessible, and let a warm, encouraging, supportive tone come through naturally — while staying professional and credible."
      })
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    if (!data.text) throw new Error("No content returned");
    return data.text;
  };

  const generateSession = async () => {
    setLoading(true); setError(""); setOutput(null);
    const dateStr = fmtDate(date);
    const absent = sAttend !== "present";
    try {
      let soapNote;
      if (absent) {
        const reason = { "absent-illness":"absent due to illness","absent-parent":"absent at parent request","absent-event":"absent due to a school event","cancelled":"session cancelled by provider" }[sAttend]||sAttend;
        soapNote = await callClaude(`Write a short SOAP note for a speech-language session that did not take place. Date: ${dateStr}. Reason: ${reason}. Use "Client" as the name. Keep it to 2–3 sentences total. Output only the note, starting with "S:".`);
      } else {
        const goalLines = sGoals.filter(g=>g.skill).map((g,i)=>
          `Goal ${i+1}: ${g.skill}. Performance: ${g.acc||"not recorded"}. ${g.prog==="yes"?"Adequate progress.":g.prog==="no"?"Not making adequate progress.":""}${g.note?` Note: ${g.note}`:""}`
        ).join("\n");
        if (!goalLines) { setError("Please add at least one goal with a skill name."); setLoading(false); return; }
        soapNote = await callClaude(`Write a concise SOAP note for a speech-language session. Use "Client" throughout. Pronouns: ${pronoun}.
Date: ${dateStr}. Session type: ${sType}.
${sBehavior ? `Behavior/engagement: ${sBehavior}.` : ""}
${sPlan ? `Plan for next session: ${sPlan}.` : ""}

Goals:
${goalLines}

Rules:
- Only use information provided above. Do not invent activities, materials, diagnoses, or background details.
- S: 1–2 sentences on behavior/engagement. If none was provided, write only "Client attended the session."
- O: One sentence per goal stating the skill, the performance data, and prompt level if given. Keep it factual.
- A: 1–3 sentences interpreting the data. Note progress or lack of it. Do not speculate beyond what the data shows. A warm, encouraging note is welcome where genuinely earned by the data, but stay factual.
- P: 1–2 sentences on next steps${sPlan ? " based on the plan provided" : ""}.
- Plain language. No jargon. No bullet points. Friendly, supportive tone throughout — still professional. Start with "S:" — no preamble.`);
      }

      const billingNote = absent ? null : buildBilling(sGoals, dateStr, sType, p);
      setOutput({ type:"session", soap: soapNote, billing: billingNote });
    } catch(e) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const generateProgress = async () => {
    setLoading(true); setError(""); setOutput(null);
    const dateStr = fmtDate(date);
    const goalLines = pGoals.filter(g=>g.skill).map((g,i)=>
      `Goal ${i+1}: Skill: ${g.skill}. Current performance: ${g.curr||"not specified"}. Progress status: ${g.prog==="yes"?"Making adequate progress":g.prog==="no"?"NOT making adequate progress":"not indicated"}${g.note?`. Notes: ${g.note}`:""}.`
    ).join("\n");
    if (!goalLines) { setError("Please add at least one goal with a skill name."); setLoading(false); return; }
    try {
      const report = await callClaude(`Write a speech-language progress report for a parent to read. Use "Client" throughout. Pronouns: ${pronoun} (${p.sub}/${p.obj}/${p.pos}).
Reporting period: ${pPeriod || "this reporting period"}. Date: ${dateStr}.

Goals:
${goalLines}

Write in full paragraphs, parent-friendly language — minimal jargon, warm, encouraging, and supportive in tone while remaining professional and credible. Only use information provided below; do not invent background, diagnoses, activities, or session details.

Structure:
1. Opening paragraph: 1–2 sentences noting that Client has been working on the goals below during speech/language therapy sessions this reporting period.
2. One paragraph per goal, covering in this order:
   - What skill Client is working on, described in plain terms
   - Why that skill matters (briefly — communication, learning, or daily life relevance)
   - Client's current ability level, using the data provided, with a short plain-language interpretation of what that level means
   - Whether Client is making progress toward the goal, stated clearly
   - 1–2 specific carryover/generalization suggestions for home or the classroom, tied to that specific goal

No separate sections, no bullet points, no headers — just flowing paragraphs, one per goal after the opening. No preamble before the report and no closing summary paragraph — end after the last goal paragraph.`);
      setOutput({ type:"progress", report });
    } catch(e) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const buildBilling = (goals, dateStr, type, p) => {
    const cpt = type==="group" ? "92508" : "92507";
    const desc = type==="group"
      ? "92508 — Treatment of speech, language, voice, communication, and/or auditory processing disorder; group"
      : "92507 — Treatment of speech, language, voice, communication, and/or auditory processing disorder; individual";
    const skills = goals.filter(g=>g.skill).map(g=>g.skill).join("; ");
    return `Date of service: ${dateStr}
Procedure code: ${desc}
Goals addressed this session: ${skills||"[see SOAP note]"}

Suggested medical necessity statement:
"Skilled speech-language pathology services are medically necessary to address Client's communication disorder(s), which impact ${p.pos} academic participation and functional communication. Goals addressed align with Client's current IEP."

⚠ Note: Add your NPI, ICD-10 diagnosis code(s), and any state-specific fields required by your district Medicaid billing system before submitting. Requirements vary by state and district.`;
  };

  const [copiedAll, setCopiedAll] = useState(false);
  const copyAll = () => {
    if (!output) return;
    const parts = output.type==="session"
      ? [output.soap, output.billing].filter(Boolean)
      : [output.report];
    copyText(parts.join("\n\n" + "─".repeat(40) + "\n\n"), () => {
      setCopiedAll(true);
      setTimeout(()=>setCopiedAll(false), 1800);
    });
  };

  const btn = (active, onClick, children) => (
    <button onClick={onClick} style={{
      padding:"14px 12px", border:`2px solid ${active?"#2e7d52":"#d0ddd4"}`,
      borderRadius:10, background: active?"#edf7f1":"white", cursor:"pointer", textAlign:"left", width:"100%",
      transition:"all 0.15s"
    }}>{children}</button>
  );

  return (
    <div style={{ fontFamily:"'Segoe UI', system-ui, sans-serif", fontSize:14, color:"#2d3a32", background:"#f0f4f1", minHeight:"100vh" }}>
      {/* Header */}
      <div style={{ background:"#1e5c3a", color:"white", padding:"16px 28px" }}>
        <div style={{ fontSize:17, fontWeight:600 }}>SLK Note Builder</div>
        <div style={{ fontSize:11, opacity:0.7, marginTop:1 }}>Speech & Language Kids · AI-powered documentation</div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", minHeight:"calc(100vh - 60px)" }}>
        {/* FORM PANEL */}
        <div style={{ background:"white", padding:"24px 28px", borderBottom:"1px solid #dde8e1" }}>

          {/* Mode */}
          <div style={{ marginBottom:22 }}>
            <div style={secTitleStyle}>What are you documenting?</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {btn(mode==="session", ()=>{ setMode("session"); setOutput(null); setError(""); },
                <><div style={{fontSize:20,marginBottom:4}}>🗒️</div><span style={{display:"block",fontWeight:700,fontSize:13,color:"#1e3d2a"}}>Single session</span><span style={{fontSize:11,color:"#7a9482"}}>What happened today</span></>
              )}
              {btn(mode==="progress", ()=>{ setMode("progress"); setOutput(null); setError(""); },
                <><div style={{fontSize:20,marginBottom:4}}>📈</div><span style={{display:"block",fontWeight:700,fontSize:13,color:"#1e3d2a"}}>Progress report</span><span style={{fontSize:11,color:"#7a9482"}}>Progress over time</span></>
              )}
            </div>
          </div>

          {/* Client info */}
          <div style={{ marginBottom:22 }}>
            <div style={secTitleStyle}>Client info</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div>
                <label style={labelStyle}>Date</label>
                <input type="date" style={inputStyle} value={date} onChange={e=>setDate(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Pronoun set</label>
                <div style={{ display:"flex", gap:6 }}>
                  {["he/him","she/her","they/them"].map(pr => (
                    <button key={pr} onClick={()=>setPronoun(pr)} style={{
                      padding:"5px 10px", border:"1.5px solid", borderRadius:20, background:"white",
                      fontSize:12, fontWeight:600, cursor:"pointer",
                      borderColor: pronoun===pr?"#2e7d52":"#ccd8ce",
                      color: pronoun===pr?"#1e5c3a":"#4a6354",
                      background: pronoun===pr?"#edf7f1":"white"
                    }}>{pr}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SESSION FORM */}
          {mode==="session" && (
            <>
              <div style={{ marginBottom:22 }}>
                <div style={secTitleStyle}>Session details</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <div>
                    <label style={labelStyle}>Session type</label>
                    <select style={inputStyle} value={sType} onChange={e=>setSType(e.target.value)}>
                      <option value="individual">Individual</option>
                      <option value="group">Group</option>
                      <option value="consultation">Consultation</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Attendance</label>
                    <select style={inputStyle} value={sAttend} onChange={e=>setSAttend(e.target.value)}>
                      <option value="present">Present</option>
                      <option value="absent-illness">Absent — illness</option>
                      <option value="absent-parent">Absent — parent</option>
                      <option value="absent-event">Absent — school event</option>
                      <option value="cancelled">Session cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {sAttend==="present" && (
                <>
                  <div style={{ marginBottom:22 }}>
                    <div style={secTitleStyle}>Goals targeted this session</div>
                    {sGoals.map((g,i) => (
                      <GoalCard key={i} num={i+1} goal={g} type="session"
                        onChange={v=>updateSGoal(i,v)} onRemove={()=>removeSGoal(i)} />
                    ))}
                    <button onClick={addSGoal} style={{
                      width:"100%", padding:8, border:"1.5px dashed #a8c9b4", borderRadius:6,
                      background:"white", color:"#2e7d52", fontSize:12, fontWeight:700, cursor:"pointer", marginTop:4
                    }}>+ Add goal</button>
                  </div>
                  <div style={{ marginBottom:22 }}>
                    <div style={secTitleStyle}>Additional context <span style={{fontWeight:400,color:"#aabdb3",textTransform:"none",letterSpacing:0,fontSize:11}}>(optional)</span></div>
                    <div style={{ marginBottom:10 }}>
                      <label style={labelStyle}>Student behavior / engagement today</label>
                      <input style={inputStyle} value={sBehavior} onChange={e=>setSBehavior(e.target.value)}
                        placeholder="e.g. cooperative, required redirections, fatigued" />
                    </div>
                    <div>
                      <label style={labelStyle}>Plan for next session</label>
                      <input style={inputStyle} value={sPlan} onChange={e=>setSPlan(e.target.value)}
                        placeholder="e.g. advance to sentence level, introduce new vocabulary" />
                    </div>
                  </div>
                </>
              )}

              <button onClick={generateSession} disabled={loading} style={{
                width:"100%", padding:13, background: loading?"#7ab895":"#2e7d52", color:"white",
                border:"none", borderRadius:8, fontSize:14, fontWeight:700, cursor: loading?"not-allowed":"pointer"
              }}>
                {loading ? "Writing note…" : "✦ Generate session note"}
              </button>
            </>
          )}

          {/* PROGRESS FORM */}
          {mode==="progress" && (
            <>
              <div style={{ marginBottom:22 }}>
                <div style={secTitleStyle}>Reporting period</div>
                <input style={inputStyle} value={pPeriod} onChange={e=>setPPeriod(e.target.value)}
                  placeholder="e.g. January 13 – March 21, 2025" />
              </div>
              <div style={{ marginBottom:22 }}>
                <div style={secTitleStyle}>Goals &amp; current performance</div>
                {pGoals.map((g,i) => (
                  <GoalCard key={i} num={i+1} goal={g} type="progress"
                    onChange={v=>updatePGoal(i,v)} onRemove={()=>removePGoal(i)} />
                ))}
                <button onClick={addPGoal} style={{
                  width:"100%", padding:8, border:"1.5px dashed #a8c9b4", borderRadius:6,
                  background:"white", color:"#2e7d52", fontSize:12, fontWeight:700, cursor:"pointer", marginTop:4
                }}>+ Add goal</button>
              </div>
              <button onClick={generateProgress} disabled={loading} style={{
                width:"100%", padding:13, background: loading?"#7ab895":"#2e7d52", color:"white",
                border:"none", borderRadius:8, fontSize:14, fontWeight:700, cursor: loading?"not-allowed":"pointer"
              }}>
                {loading ? "Writing report…" : "✦ Generate progress report"}
              </button>
            </>
          )}
        </div>

        {/* OUTPUT PANEL */}
        <div style={{ background:"#f7faf8", padding:"24px 28px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.07em", color:"#8aaa96" }}>Generated note</div>
            {output && (
              <button onClick={copyAll} style={{
                padding:"6px 14px", background:"#1e5c3a", color:"white", border:"none",
                borderRadius:6, fontSize:12, fontWeight:700, cursor:"pointer"
              }}>{copiedAll ? "Copied!" : "Copy all"}</button>
            )}
          </div>

          {!output && !loading && !error && (
            <div style={{ textAlign:"center", padding:"56px 24px", color:"#aabdb3" }}>
              <div style={{ fontSize:32, marginBottom:10 }}>✦</div>
              <p style={{ fontSize:12, lineHeight:1.8 }}>Fill in the details on the left,<br/>then click <strong>Generate</strong> to have<br/>Claude write your note.</p>
            </div>
          )}

          {loading && (
            <div style={{ textAlign:"center", padding:"48px 24px" }}>
              <div style={{
                width:32, height:32, border:"3px solid #d4ead9", borderTopColor:"#2e7d52",
                borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 14px"
              }} />
              <p style={{ fontSize:13, fontWeight:600, color:"#2e7d52" }}>Writing your note…</p>
              <small style={{ fontSize:11, color:"#8aaa96" }}>Claude is generating clinical language</small>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {error && (
            <div style={{ background:"#fde8e8", border:"1px solid #e8a8a8", borderRadius:8, padding:"12px 14px", fontSize:13, color:"#7a2020", marginBottom:12 }}>
              ⚠ {error}
            </div>
          )}

          {output && !loading && (
            <>
              <div style={{ background:"#fef8ee", border:"1px solid #f5d59a", borderRadius:8, padding:"10px 14px", fontSize:12, color:"#7a5010", marginBottom:14 }}>
                📝 <strong>Replace "Client"</strong> with the student's name when copying into your system.
              </div>
              {output.type==="session" && (
                <>
                  <NoteBlock title="SOAP Note" body={output.soap} />
                  {output.billing && <NoteBlock title="Billing Reference" body={output.billing} billing />}
                </>
              )}
              {output.type==="progress" && (
                <NoteBlock title="Progress Report" body={output.report} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<SLKNoteBuilder />);
