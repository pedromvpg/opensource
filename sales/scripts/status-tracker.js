/* ============================================================
   Outreach status tracker
   - Shared tracking via Supabase (one table). Falls back to
     browser localStorage until Supabase is configured.
   - Self-contained: injects a status dropdown into each contact
     card/row after render, no changes to the main render code.

   SETUP (shared, multi-person):
   1. Create a free project at supabase.com
   2. SQL editor -> run:
        create table if not exists contact_status (
          id text primary key,
          status text,
          updated_by text,
          updated_at timestamptz default now()
        );
        alter table contact_status enable row level security;
        create policy "read"   on contact_status for select using (true);
        create policy "insert" on contact_status for insert with check (true);
        create policy "update" on contact_status for update using (true) with check (true);
   3. Project Settings -> API: paste Project URL + anon public key below.
   (RLS is permissive on purpose — the whole site sits behind Vercel
    password protection, so only your team reaches this table.)
============================================================ */
(function () {
  const SB_URL  = "https://cmgqajmcnczykodnnjqw.supabase.co";   // base project URL (no /rest/v1/)
  const SB_ANON = "sb_publishable_Fza1j_nG2PYd4kxt_JhzTw_GVPYGpUI";                      // <-- paste

  const STATUSES = ["", "Sent", "Responded", "Committed", "Declined", "No response"];
  const COLORS = {
    "Sent": "#5b8def", "Responded": "#e8b93b", "Committed": "#3ecf8e",
    "Declined": "#ef5f5f", "No response": "#888",
  };

  const configured = SB_URL && !SB_URL.includes("YOUR-") && SB_ANON && !SB_ANON.includes("YOUR-");
  const sb = (configured && window.supabase) ? window.supabase.createClient(SB_URL, SB_ANON) : null;
  const mode = sb ? "supabase" : "local";
  const cache = {};

  const slug = (s) => s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9/|_-]/g, "");
  function nameOf(el) {
    const c = el.querySelector(".card-name");
    if (c) {
      for (const n of c.childNodes) if (n.nodeType === 3 && n.textContent.trim()) return n.textContent.trim();
      return c.textContent.trim();
    }
    const r = el.querySelector(".cell-name-inner span, .cell-name");
    return r ? r.textContent.trim() : "";
  }
  const keyOf = (el) => slug((el.getAttribute("data-section") || "") + "|" + nameOf(el));

  async function loadAll() {
    if (sb) {
      const { data, error } = await sb.from("contact_status").select("id,status");
      if (error) { console.warn("[status] supabase read failed, using local", error.message); }
      else { (data || []).forEach((r) => (cache[r.id] = r.status)); return; }
    }
    Object.assign(cache, JSON.parse(localStorage.getItem("osh-status") || "{}"));
  }
  async function saveStatus(key, status) {
    cache[key] = status;
    if (sb) {
      const { error } = await sb.from("contact_status").upsert({
        id: key, status, updated_by: localStorage.getItem("osh-user") || null,
        updated_at: new Date().toISOString(),
      });
      if (error) console.warn("[status] supabase write failed", error.message);
    } else {
      localStorage.setItem("osh-status", JSON.stringify(cache));
    }
  }

  function paint(sel) {
    const c = COLORS[sel.value];
    sel.style.borderColor = c || "var(--border)";
    sel.style.color = c || "var(--ink-muted)";
  }
  function inject(el) {
    if (el.querySelector(".status-select")) return;
    const key = keyOf(el);
    if (!key || key === "|") return;
    const sel = document.createElement("select");
    sel.className = "status-select";
    sel.dataset.key = key;
    sel.innerHTML = STATUSES.map((s) => `<option value="${s}">${s || "— set status —"}</option>`).join("");
    sel.value = cache[key] || "";
    const inTable = el.tagName === "TR";
    sel.style.cssText =
      "margin-top:" + (inTable ? "0" : "10px") + ";width:100%;background:var(--panel);" +
      "border:1px solid var(--border);font-family:var(--font-mono,monospace);font-size:11px;" +
      "padding:5px 8px;outline:none;cursor:pointer;border-radius:0;";
    paint(sel);
    const target = el.querySelector(".card-body") || el.querySelector(".cell-links") || el;
    target.appendChild(sel);
  }
  const injectAll = () => document.querySelectorAll(".contact-item").forEach(inject);

  document.addEventListener("change", (e) => {
    const sel = e.target;
    if (sel.classList && sel.classList.contains("status-select")) {
      saveStatus(sel.dataset.key, sel.value);
      paint(sel);
      // keep both grid + table copies of the same item in sync on screen
      document.querySelectorAll('.status-select[data-key="' + sel.dataset.key + '"]').forEach((o) => {
        if (o !== sel) { o.value = sel.value; paint(o); }
      });
    }
  });

  function start() {
    loadAll().then(() => {
      injectAll();
      const content = document.getElementById("content");
      if (content) new MutationObserver(injectAll).observe(content, { childList: true, subtree: true });
      console.log("[status] tracking mode:", mode);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
