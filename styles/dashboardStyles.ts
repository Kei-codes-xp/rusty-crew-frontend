import { CSSProperties } from "react";

type Styles = {
  wrap: CSSProperties;
  sidebar: CSSProperties;
  main: CSSProperties;
  content: CSSProperties;
  topbar: CSSProperties;

  sTop: CSSProperties;
  logoTxt: CSSProperties;

  card: CSSProperties;
  metric: CSSProperties;
  h2: CSSProperties;
  row: CSSProperties;

  table: CSSProperties;
  th: CSSProperties;
  td: CSSProperties;

  input: CSSProperties;
  btn: CSSProperties;
  btnSm: CSSProperties;
  btnDanger: CSSProperties;

  modal: CSSProperties;
  mCard: CSSProperties;
  label: CSSProperties;
  fGroup: CSSProperties;

  grid2: CSSProperties;
  grid4: CSSProperties;

  // ✅ function must be explicitly allowed
  navItem: (active: boolean) => CSSProperties;
};


export const S: Styles = {
  wrap: { display: "flex", minHeight: "100vh", background: "#0f0f0f", color: "#e8e8e8", fontFamily: '"JetBrains Mono", "Fira Code", monospace' },

  sidebar: { width: 200, background: "#141414", borderRight: "1px solid #222", display: "flex", flexDirection: "column", flexShrink: 0 },

  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },

  content: { flex: 1, padding: 20, overflowY: "auto" },

  topbar: { background: "#141414", borderBottom: "1px solid #222", padding: "0 20px", height: 50, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 },

  sTop: { padding: "18px 16px", borderBottom: "1px solid #222", display: "flex", alignItems: "center", gap: 10 },

  logoTxt: { fontSize: 15, fontWeight: 700, color: "#e8e8e8", letterSpacing: 1 },

  navItem: (active: boolean) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 14px",
    margin: "1px 6px",
    borderRadius: 7,
    cursor: "pointer",
    fontSize: 12.5,
    fontWeight: active ? 600 : 400,
    background: active ? "#1e1e1e" : "transparent",
    color: active ? "#f5a623" : "#888",
    border: active ? "1px solid #2a2a2a" : "1px solid transparent",
  }),

  card: { background: "#1a1a1a", border: "1px solid #252525", borderRadius: 10, padding: "16px 18px" },

  metric: { background: "#1a1a1a", border: "1px solid #252525", borderRadius: 10, padding: "14px 16px" },

  h2: { fontSize: 13, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 },

  row: { display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #1e1e1e" },

  table: { width: "100%", borderCollapse: "collapse", fontSize: 12.5 },

  th: { textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #222", color: "#555", fontWeight: 600, fontSize: 11, textTransform: "uppercase" },

  td: { padding: "9px 12px", borderBottom: "1px solid #1c1c1c", color: "#ccc" },

  input: { background: "#111", border: "1px solid #2a2a2a", borderRadius: 7, padding: "8px 11px", fontSize: 13, color: "#e8e8e8", width: "100%" },

  btn: { background: "#f5a623", color: "#0f0f0f", border: "none", borderRadius: 7, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" },

  btnSm: { background: "#1e1e1e", color: "#ccc", border: "1px solid #2a2a2a", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" },

  btnDanger: { background: "#3d1a1a", color: "#f87171", border: "1px solid #5a1a1a", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" },

  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },

  mCard: { background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 12, padding: 24, width: 420, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto" },

  label: { fontSize: 11, color: "#666", fontWeight: 600, textTransform: "uppercase", marginBottom: 5 },

  fGroup: { marginBottom: 14 },

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },

  grid4: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 },
};