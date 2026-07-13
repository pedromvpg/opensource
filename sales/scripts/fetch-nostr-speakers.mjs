import { nip19, SimplePool } from "nostr-tools";
import { writeFileSync } from "fs";

const RAW = `
https://njump.me/npub1e96u96u3nrjax7hn8c4e5gr37hzkm2zxp86pv6c7skvvpngppu0sd58zhw
https://njump.me/npub19j2j53z4zeka2e9038yxxww093kjgrsphmddqrgntc03uwgs6wcsxmnm2u
https://njump.me/nprofile1qqs0g8p3hlljcchx2kef3ymv59yzsrq6z4glq3ya0dktye2sp4d2gtqpr4mhxue69uhkummnw3ezucnfw33k76twv4ezuum0vd5kzmp0506uyk
https://njump.me/npub1a0f90xnrj2e0v0rr5eh49zy48apww8j95mn3lzf95ghdxmsfdyts6s0j3x
https://njump.me/npub1ake09xg6t9nf6gsssumarwa7ev0kt2fdyjstvnc9k32hegr9y45seapfwt
https://njump.me/npub1c9r9lad84kpqwnh09u58vdzwnfsnxcr7a40uf5ulkpdguq4667jsgaxu4k
https://njump.me/npub1f7ptem2ztp9x4n7w62n90ddv40z0jrt4490d8lug3uasfwyjsccqkknerm
https://njump.me/npub1gxqyeea3xspkd68mxlxsvvk3gdzdd555u504ynwpdj0ghg503mvq2gydt0
https://njump.me/npub1jf54924h4509t9xz94juypy05wugenz85x6ez77flswl7cngd0lqnmuuw9
https://njump.me/npub1menrmd24ejnp9dk38au0vzw0fe9xsr25jdtdndj0eukapxz7vdps8sl4nq
https://njump.me/npub1prya33fnqerq0fljwjtp77ehtu7jlsjt5ydhwveuwmqdsdm6k8esk42xcv
https://njump.me/npub1r8l06leee9kjlam0slmky7h8j9zme9ca32erypgqtyu6t2gnhshs3jx5dk
https://njump.me/npub1r8343wqpra05l3jnc4jud4xz7vlnyeslf7gfsty7ahpf92rhfmpsmqwym8
https://njump.me/npub1u8r69esh5r7jt29nj9ufmz4yvuwp6cwl5xqp4e3d46vl8wla5smsexjcky
https://njump.me/npub1v3yrr2z6tza5580dwn0cfmh29f2qqdls9gq385v4t094eq9putkqtvsql3
https://njump.me/npub1xe9zavkhshgu3035uw3ah0qfge0qa0tnuqm26vn8z0ffg0dxv9jstzmgdc
https://njump.me/npub1yxkvnuk32mw0tvw36u48x008k7anrlytv4rrp6pcrkeytq2uusdqdmw8a5
https://njump.me/npub1zk6u7mxlflguqteghn8q7xtu47hyerruv6379c36l8lxzzr4x90q0gl6ef
https://njump.me/npub12r5zunqwnccf8dhy5jvx6wspynxrruy5t4yr4n7jqvxzqykwc7nqqe8g4s
https://njump.me/npub13nfdp7p3pacqn6202q33sur4djeehf50xagxq3y3pchhzjptz7yqenvn7c
https://njump.me/npub15g6xtc8endwv0lj8ukrxmqzjzaa20k4q69uhqdpdge6wvtx76n0qpfzj0w
https://njump.me/npub162mtqyjgtmrdhlras3zyd5nqsysdyhw9fepj242c93uvaxakthzqa7rrj8
https://njump.me/npub169s9jsu7dll9czldmtnfjhu22u4gt6f3umxpqn2k0r50tz9fdfwq0xl3h0
https://njump.me/npub1324a9y06c8qewx2yl952j78u26mv9h94z9xp8kcwfwdnhdyvspnsxkvcjz
https://primal.net/gsovereignty
https://primal.net/thewhalelounge
https://x.com/dawninthewild
https://njump.me/npub1gxpk0rvwh7afctazl7w33qxpxxcm6k0e29q3kqd5gcqgrn6acdwstlfx5j
npub1dg93ktmdyez89q98gg3lgjw2vrvmxr5cm69yc8c79tkfhmpfq09spgdu3h
npub147whqsr5vsj86x0ays70r0hgreklre3ey97uvcmxhum65skst56s30selt
`.trim().split(/\s+/);

function parseInput(raw) {
  if (raw.includes("x.com/")) return { type: "x", handle: raw.split("/").pop(), raw };
  if (raw.includes("primal.net/")) return { type: "primal", handle: raw.split("/").pop(), raw };
  let token = raw;
  if (raw.includes("njump.me/")) token = raw.split("/").pop();
  if (token.startsWith("npub") || token.startsWith("nprofile")) {
    const decoded = nip19.decode(token);
    const pubkey = decoded.type === "npub" ? decoded.data : decoded.data.pubkey;
    const npub = nip19.npubEncode(pubkey);
    return { type: "nostr", npub, pubkey, raw };
  }
  return { type: "unknown", raw };
}

function toNpub(pubkey) {
  return nip19.npubEncode(pubkey);
}

const parsed = RAW.map(parseInput);
const pool = new SimplePool();
const relays = [
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://relay.primal.net",
  "wss://purplepag.es",
  "wss://relay.nostr.band",
];

const hexes = [...new Set(parsed.filter(p => p.pubkey).map(p => p.pubkey))];
const events = await pool.querySync(relays, { kinds: [0], authors: hexes });
pool.close(relays);

const byPubkey = new Map();
for (const e of events.sort((a, b) => b.created_at - a.created_at)) {
  if (!byPubkey.has(e.pubkey)) byPubkey.set(e.pubkey, e);
}

async function resolvePrimal(handle) {
  const r = await fetch(`https://primal.net/api/v1/profile/${handle}`);
  if (!r.ok) return null;
  const j = await r.json();
  return j;
}

const out = [];
for (const p of parsed) {
  if (p.type === "x") {
    out.push({
      name: p.handle,
      org: "",
      angle: "Nostr speaker · X only in source list",
      tags: ["Nostr", "speaker"],
      conf: "ok",
      links: [{ t: "x", v: p.handle }],
      raw: p.raw,
    });
    continue;
  }
  if (p.type === "primal") {
    let meta = null;
    try { meta = await resolvePrimal(p.handle); } catch {}
    const pubkey = meta?.pubkey;
    const profile = pubkey ? byPubkey.get(pubkey) : null;
    let content = {};
    if (profile) try { content = JSON.parse(profile.content); } catch {}
    const name = content.display_name || content.name || meta?.display_name || meta?.name || p.handle;
    const picture = content.picture || meta?.picture || "";
    const npub = pubkey ? toNpub(pubkey) : null;
    const links = [{ t: "web_url", v: `https://primal.net/${p.handle}`, label: "Primal" }];
    if (npub) links.unshift({ t: "nostr", v: npub });
    out.push({
      name,
      org: content.nip05 || meta?.nip05 || "",
      angle: "Nostr speaker",
      tags: ["Nostr", "speaker"],
      conf: "ok",
      picture,
      links,
      raw: p.raw,
    });
    continue;
  }
  if (p.type === "nostr") {
    const ev = byPubkey.get(p.pubkey);
    let content = {};
    if (ev) try { content = JSON.parse(ev.content); } catch {}
    const name = content.display_name || content.name || p.npub.slice(0, 12) + "…";
    const links = [{ t: "nostr", v: p.npub }, { t: "web_url", v: `https://njump.me/${p.npub}`, label: "njump" }];
    if (content.nip05) links.push({ t: "web_url", v: `https://${content.nip05}`, label: content.nip05 });
    const xMatch = (content.nip05 || "").match(/@(\w+)/) || (content.about || "").match(/twitter\.com\/(\w+)/i) || (content.about || "").match(/x\.com\/(\w+)/i);
    out.push({
      name,
      org: content.nip05 || "",
      angle: content.about ? content.about.slice(0, 120).replace(/\s+/g, " ") : "Nostr speaker",
      tags: ["Nostr", "speaker"],
      conf: ev ? "ok" : "warn",
      picture: content.picture || "",
      links,
      raw: p.raw,
    });
    continue;
  }
}

writeFileSync("nostr-speakers.json", JSON.stringify(out, null, 2));
console.log(`Fetched ${out.length} speakers, ${out.filter(x => x.picture).length} with pictures`);
