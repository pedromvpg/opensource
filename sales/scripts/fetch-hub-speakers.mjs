import { nip19, SimplePool } from "nostr-tools";
import { writeFileSync } from "fs";

const SPEAKERS = [
  {
    name: "Alex Bergeron", org: "Ark Labs", role: "Ecosystem Lead",
    angle: "Institutions Going Cypherpunk / Cypherpunks Going Tradfi · Nakamoto Stage · Aug 28, 2:00–2:30 pm",
    tags: ["speaker", "protocol", "Nakamoto Stage"],
    links: [{ t: "email", v: "alex@arklabs.xyz" }, { t: "x", v: "bergealex4" }],
  },
  {
    name: "Dusty Daemon", org: "Lightning", role: "Protocol Developer",
    angle: "The Next Step Forward to the Omega-Everything-Splice · Genesis Stage · Aug 28, 12:15–12:30 pm",
    tags: ["speaker", "Lightning", "Genesis Stage"],
    links: [{ t: "email", v: "dustin@koinkeep.com" }, { t: "x", v: "dusty_daemon" }],
  },
  {
    name: "Jonathan C", org: "Ellipal", role: "CBO",
    angle: "Meeting Users Where They Are: Bitcoin Wallets Without Compromise · Genesis Stage · Aug 27, 3:30–4:00 pm",
    tags: ["speaker", "wallets", "Genesis Stage"],
    links: [{ t: "email", v: "john@ellipal.com" }, { t: "x", v: "ellipal" }, { t: "instagram", v: "ellipal_wallet" }],
  },
  {
    name: "Lea Thompson", org: "Cake Wallet", role: "Marketing Manager",
    angle: "Meeting Users Where They Are (content host) · Girl Gone Crypto · privacy & self-custody education",
    tags: ["speaker", "wallets", "Genesis Stage"],
    links: [{ t: "email", v: "lea@cakewallet.com" }, { t: "x", v: "girlgone_crypto" }, { t: "instagram", v: "girl_gone_crypto" }],
  },
  {
    name: "Stephan Livera", org: "Stephan Livera Podcast", role: "Podcaster",
    angle: "Dispelling Bitcoin Myths · They Forked Bitcoin… · From Self-Custody to Shareholders (host)",
    tags: ["speaker", "Nostr", "Genesis Stage"],
    npub: "npub1r8l06leee9kjlam0slmky7h8j9zme9ca32erypgqtyu6t2gnhshs3jx5dk",
    star: true,
    links: [
      { t: "email", v: "stephan.livera@gmail.com" },
      { t: "x", v: "stephanlivera" },
      { t: "nostr", v: "npub1r8l06leee9kjlam0slmky7h8j9zme9ca32erypgqtyu6t2gnhshs3jx5dk" },
      { t: "youtube", v: "stephanlivera" },
    ],
    partnership: {
      to: "stephan.livera@gmail.com",
      subject: "Partnership — Open Source Hub @ Bitcoin Asia 2026",
      label: "Partnership proposal",
      body: `Hey Stephan,

I'm Pedro, experience designer for the Open Source Hub at Bitcoin Asia 2026 (Hong Kong, late August). You're already hosting on the Genesis stage — I'd love to line up a simple partnership around the Hub while you're in town.

Proposal: credit Stephan Livera Podcast as a community partner of the Open Source Hub, and give your audience a block of comp developer passes to claim ([CLAIM LINK], code [CODE]). Happy to coordinate a Hub segment or cross-promo on the pod if that's useful — builders, self-custody, and open source are right in your lane.

No pressure either way. Would you be open to a quick thread to set it up?

Pedro
pedro@btcmedia.org
Open Source Hub · Bitcoin Asia 2026`,
    },
  },
  {
    name: "Balaji Chandra", org: "Bitasha", role: "Co-Founder",
    angle: "Long Wave Radio Bitcoin Transaction Workshop · Open Source Hub · Aug 28, 10:00–11:00 am",
    tags: ["speaker", "Open Source Hub", "India"],
    npub: "npub15g6xtc8endwv0lj8ukrxmqzjzaa20k4q69uhqdpdge6wvtx76n0qpfzj0w",
    star: true,
    links: [
      { t: "email", v: "balaji.c.86@gmail.com" },
      { t: "x", v: "bala_1116" },
      { t: "nostr", v: "npub15g6xtc8endwv0lj8ukrxmqzjzaa20k4q69uhqdpdge6wvtx76n0qpfzj0w" },
      { t: "linkedin", v: "in/balajic8756" },
    ],
  },
  {
    name: "Christoph Ono", org: "Bitcoin Design", role: "Designer",
    angle: "Which Customer is Always Right: Developing Bitcoin for Agents & Humans · Genesis Stage · Aug 27, 3:00–3:30 pm",
    tags: ["speaker", "design", "Genesis Stage"],
    links: [{ t: "email", v: "chri@sto.ph" }, { t: "linkedin", v: "in/germanysbestkeptsecret" }],
  },
  {
    name: "Gareth", org: "Bitcoin Association of HK", role: "Director",
    angle: "Nostr 101 / web of trust · history of Bitcoin in Hong Kong · Bitcoin security model",
    tags: ["speaker", "Nostr", "Hong Kong"],
    primal: "gsovereignty",
    star: true,
    links: [
      { t: "email", v: "gareth.hayes@bitcoin.org.hk" },
      { t: "web_url", v: "https://primal.net/gsovereignty", label: "Primal" },
    ],
  },
  {
    name: "Liam Eagen", org: "{ ideal }", role: "Co-founder",
    angle: "Institutions Going Cypherpunk / Cypherpunks Going Tradfi · Nakamoto Stage · Aug 28, 2:00–2:30 pm",
    tags: ["speaker", "protocol", "Nakamoto Stage"],
    links: [
      { t: "email", v: "liam@ideal.group" },
      { t: "email", v: "liameagen@protonmail.com", label: "proton" },
      { t: "x", v: "liameagen" },
    ],
  },
  {
    name: "Pedro 🧨", org: "Bitcoin Conference", role: "Experience Designer",
    angle: "How to Set Up a Lightning Wallet · Open Source Hub · Aug 28, 11:00–11:30 am",
    tags: ["speaker", "Open Source Hub"],
    npub: "npub13nfdp7p3pacqn6202q33sur4djeehf50xagxq3y3pchhzjptz7yqenvn7c",
    star: true,
    links: [
      { t: "email", v: "pedro@btcmedia.org" },
      { t: "nostr", v: "npub13nfdp7p3pacqn6202q33sur4djeehf50xagxq3y3pchhzjptz7yqenvn7c" },
    ],
  },
  {
    name: "Roland Bewick", org: "Alby", role: "Lightning Developer",
    angle: "How to Build Bitcoin Apps From a Single Prompt · Open Source Hub · Aug 27, 11:00 am–12:00 pm",
    tags: ["speaker", "Open Source Hub", "Lightning", "Nostr"],
    npub: "npub1zk6u7mxlflguqteghn8q7xtu47hyerruv6379c36l8lxzzr4x90q0gl6ef",
    star: true,
    links: [
      { t: "email", v: "roland@getalby.com" },
      { t: "x", v: "rolznz" },
      { t: "nostr", v: "npub1zk6u7mxlflguqteghn8q7xtu47hyerruv6379c36l8lxzzr4x90q0gl6ef" },
      { t: "youtube", v: "getalbycom" },
    ],
  },
  {
    name: "Shaun Gao", org: "YakiHonne", role: "Partner",
    angle: "Nostr Workshop · Bitcoin × AI × Nostr · co-founder YakiHonne · BitcoinHouse Malaysia",
    tags: ["speaker", "Nostr", "Malaysia"],
    npub: "npub147whqsr5vsj86x0ays70r0hgreklre3ey97uvcmxhum65skst56s30selt",
    star: true,
    links: [
      { t: "email", v: "shaun0.0time@gmail.com" },
      { t: "x", v: "ShaunTime" },
      { t: "nostr", v: "npub147whqsr5vsj86x0ays70r0hgreklre3ey97uvcmxhum65skst56s30selt" },
    ],
  },
  {
    name: "Ying Tong Lai", org: "{ ideal }", role: "Co-founder & CTO",
    angle: "隐私保护型客户端验证（CSV）· Genesis Stage · Aug 27, 10:00–10:15 am",
    tags: ["speaker", "protocol", "Genesis Stage", "Singapore"],
    links: [{ t: "email", v: "yingtong@ideal.group" }, { t: "x", v: "therealyingtong" }],
  },
];

const pool = new SimplePool();
const relays = ["wss://relay.damus.io", "wss://nos.lol", "wss://relay.primal.net", "wss://purplepag.es"];
const hexes = SPEAKERS.filter((s) => s.npub).map((s) => nip19.decode(s.npub).data);
const events = await pool.querySync(relays, { kinds: [0], authors: hexes });
pool.close(relays);
const byPubkey = new Map();
for (const e of events.sort((a, b) => b.created_at - a.created_at)) {
  if (!byPubkey.has(e.pubkey)) byPubkey.set(e.pubkey, e);
}

// Gareth via primal lud16
let garethEv = null;
const garethPool = new SimplePool();
const garethEvs = await garethPool.querySync(relays, { kinds: [0], "#p": ["gsovereignty@primal.net"], limit: 3 });
garethPool.close(relays);
garethEv = garethEvs.sort((a, b) => b.created_at - a.created_at)[0];

const items = SPEAKERS.map((s) => {
  const o = {
    name: s.name,
    org: s.org,
    angle: s.angle,
    tags: s.tags,
    conf: "ok",
    links: s.links,
  };
  if (s.star) o.star = true;
  if (s.partnership) o.partnership = s.partnership;
  if (s.npub) {
    const hex = nip19.decode(s.npub).data;
    o.pubkey = hex;
    const ev = byPubkey.get(hex);
    if (ev) {
      try {
        const meta = JSON.parse(ev.content);
        if (meta.picture) o.picture = meta.picture;
      } catch {}
    }
  }
  if (s.primal === "gsovereignty" && garethEv) {
    o.pubkey = garethEv.pubkey;
    try {
      const meta = JSON.parse(garethEv.content);
      if (meta.picture) o.picture = meta.picture;
      if (meta.display_name || meta.name) o.name = meta.display_name || meta.name;
      o.links = [
        { t: "email", v: "gareth.hayes@bitcoin.org.hk" },
        { t: "nostr", v: nip19.npubEncode(garethEv.pubkey) },
        { t: "web_url", v: "https://primal.net/gsovereignty", label: "Primal" },
      ];
    } catch {}
  }
  return o;
});

writeFileSync("open-source-nostr-speakers.js", `const OPEN_SOURCE_NOSTR_SPEAKERS = ${JSON.stringify(items, null, 2)};\n`);
console.log(JSON.stringify(items.map((i) => ({ name: i.name, picture: !!i.picture, pubkey: !!i.pubkey })), null, 2));
