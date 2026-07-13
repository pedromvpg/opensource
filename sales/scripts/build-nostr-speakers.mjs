import { readFileSync, writeFileSync } from "fs";
import { nip19, SimplePool } from "nostr-tools";

const data = JSON.parse(readFileSync("nostr-speakers.json", "utf8"));

const idx = data.findIndex(
  (d) => d.links?.[0]?.v === "npub1e96u96u3nrjax7hn8c4e5gr37hzkm2zxp86pv6c7skvvpngppu0sd58zhw"
);
if (idx >= 0) {
  data[idx].name = "TATTABONK";
  data[idx].conf = "ok";
  data[idx].picture =
    "https://profilepics.nostur.com/profilepic_v1/2012391b1d6ae8b3556e46945a58fbc97e5";
}

const pool = new SimplePool();
const relays = ["wss://relay.primal.net", "wss://purplepag.es", "wss://relay.damus.io"];
for (const handle of ["gsovereignty", "thewhalelounge"]) {
  let evs = await pool.querySync(relays, { kinds: [0], "#l": [handle], limit: 5 });
  if (!evs.length) {
    evs = await pool.querySync(relays, { kinds: [0], "#p": [`${handle}@primal.net`], limit: 5 });
  }
  const e = evs.sort((a, b) => b.created_at - a.created_at)[0];
  const item = data.find((d) => d.raw.includes(`primal.net/${handle}`));
  if (e && item) {
    const m = JSON.parse(e.content);
    const npub = nip19.npubEncode(e.pubkey);
    item.name = m.display_name || m.name || handle;
    item.picture = m.picture || "";
    item.org = m.nip05 || "";
    item.angle = (m.about || "Nostr speaker").slice(0, 140).replace(/\s+/g, " ");
    item.conf = "ok";
    item.links = [
      { t: "nostr", v: npub },
      { t: "web_url", v: `https://primal.net/${handle}`, label: "Primal" },
      { t: "web_url", v: `https://njump.me/${npub}`, label: "njump" },
    ];
  }
}
pool.close(relays);

function clean(item) {
  const links = item.links.filter((l) => !(l.t === "web_url" && l.v.includes("@")));
  const nostrLink = links.find((l) => l.t === "nostr");
  let pubkey = "";
  if (nostrLink) {
    try {
      pubkey = nip19.decode(nostrLink.v).data;
    } catch {}
  }
  const o = {
    name: item.name,
    angle: (item.angle || "").replace(/\n/g, " ").slice(0, 140),
    tags: item.tags,
    conf: item.conf,
    links,
  };
  if (pubkey) o.pubkey = pubkey;
  if (item.org) o.org = item.org;
  if (item.picture) o.picture = item.picture;
  if (item.name === "Code Orange Dev School" || item.name === "Stephan Livera" || item.name === "Roland")
    o.star = true;
  return o;
}

const items = data.map(clean);
writeFileSync(
  "nostr-speakers-items.js",
  `const NOSTR_SPEAKERS = ${JSON.stringify(items, null, 2)};\n`
);
console.log(`items ${items.length}, pictures ${items.filter((i) => i.picture).length}`);
