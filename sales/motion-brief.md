# Motion Design Brief — Open Source Hub Hero Assets

**For:** motion designer (After Effects / Lottie).
**Source frames:** the static SVGs in `assets/graphics/` (partner-social-square, -landscape, meetup-board-header, etc.) and the brand vectors in `assets/` (`bitcoinAsia2026_openSource_square.svg` = emblem+glow, `bitcoin_asia_hongkong_lockup.svg`, `open_source_lockup_asia2026.svg`). **Animate these — do not redraw.**

---

## Brand & motion principles (non-negotiable)

- **Palette:** pure black `#000`, white `#fff` (with soft glow/bloom), one accent orange `#F7931A`. No other colors.
- **Type:** Inter (700–900 for display, letter-spaced uppercase for kickers/tags). Mono-spaced corner tags (`~964479`, `103.144.202.255`) are a signature — keep them.
- **Aesthetic = restrained technical / cypherpunk.** This audience distrusts slick. **Allowed motion:** glow pulse, type-on, slow emblem drift/rotation, subtle parallax, badge pop, scanline/grid reveal. **Banned:** bouncy easing, swooshes, lens flares, stock "tech" transitions, anything that reads as an ad.
- **Silent, looping, strong first frame** (the first frame IS the static fallback). 4–6s.
- **Easing:** slow ease-in-out; nothing snappy. Glow breathes; it doesn't flash.

---

## Deliverable matrix

**3 masters × 3 formats × 2 file types.**

| Master | What it is |
|---|---|
| **A · VR-teaser loop** | The spectacle / pre-event stand-in until real capture exists |
| **B · Brand hero loop** | Restrained motion on the existing brand frame |
| **C · Per-track headline swaps** | B with the display headline + vernacular swapped per track (4 variants) |

| Format | Size | Use |
|---|---|---|
| Square | 1080×1080 | IG / Telegram / X |
| Vertical | 1080×1920 | IG/WhatsApp Stories |
| Landscape | 1200×675 | X / email / LinkedIn |

**File types:** MP4 (H.264, silent, seamless loop) + GIF fallback (≤5 MB). Also export the **first frame as PNG** (static fallback).

---

## Storyboards

### A — VR-teaser loop (the hero spectacle)
Pre-event: **no real footage exists** — this is a motion *mockup* evoking immersion.
1. **0–1s:** black; mono tags type on (`~964479` left, IP right); faint emblem materializes.
2. **1–3s:** the medallion emblem tilts/renders into a **spatial/3D depth** (slow z-rotation or parallax layers), a subtle headset/portal motif implied — "you can step inside."
3. **3–4.5s:** glow-in kicker **"STEP INTO OPEN SOURCE"** + smaller **"VR ACTIVATION · OPEN SOURCE HUB."**
4. **4.5–6s:** settle to a clean end-frame (= first frame), loop.
*During/after event: replace the mockup middle with real headset/activation footage.*

### B — Brand hero loop
1. **0–1s:** HK lockup (`bitcoin_asia_hongkong_lockup.svg`) fades/draws in top; mono tags type on.
2. **1–2.5s:** "OPEN SOURCE HUB" kicker glows in (bloom rises from 0).
3. **2.5–4s:** display headline resolves (glow settle); emblem drifts slowly behind.
4. **4–5s:** orange **"FREE DEV PASS"** badge pops (small scale-in, no bounce).
5. **loop.**

### C — Per-track headline swaps (reuse B's timeline)
Swap only the display headline + kicker vernacular:
- **Bitcoin-native:** "BUILDERS" / kicker "OPEN SOURCE HUB"
- **AI × open-source:** "OPEN SOURCE × AI" / kicker "AGENTS · INFERENCE · OPEN WEIGHTS"
- **Students:** "BUILD IN PUBLIC" / kicker "FREE STUDENT PASS"
- **Pro OSS communities:** "SHIP TOGETHER" / kicker "OPEN SOURCE HUB"
- **Swappable partner variant:** "[ COMMUNITY ]" (the partner's name) / kicker "PROUD COMMUNITY PARTNER"

---

## Notes
- Keep every headline swap on the **same timeline/comp** so producing variants is a text change, not a re-animation.
- Loops must be **seamless** (last frame → first frame).
- Deliver an editable master (AE project or Lottie JSON) so headlines/partner names can be swapped without the designer for future partners.
- Reference look: the `OpenSource_FreeGAPass_Square.jpg` in `assets/` — match that energy, add restrained motion.
