// Edge middleware — password gate for the whole sales site.
// Unauthenticated visitors get a login modal; successful login sets an HttpOnly cookie.
// Set SITE_PASSWORD in Vercel env vars (recommended). Optional AUTH_SECRET for cookie signing
// (defaults to SITE_PASSWORD).

export const config = { matcher: '/((?!_next/static|_next/image|favicon.ico).*)' };

const COOKIE = 'osh_auth';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function password() {
  return (typeof process !== 'undefined' && process.env?.SITE_PASSWORD)
    ? process.env.SITE_PASSWORD
    : 'kpk%@$2a43_3249';
}

function secret() {
  return process.env?.AUTH_SECRET || password();
}

async function signToken() {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode('ok'));
  const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `ok.${b64}`;
}

async function validToken(token) {
  if (!token || !token.startsWith('ok.')) return false;
  const expected = await signToken();
  return token === expected;
}

function readCookie(request) {
  const raw = request.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === COOKIE) return decodeURIComponent(v.join('='));
  }
  return null;
}

function loginPage(next, error) {
  const err = error
    ? '<p class="err" role="alert">Incorrect password. Try again.</p>'
    : '';
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Open Source Hub · Sign in</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap" rel="stylesheet" />
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body {
    font-family: Geist, system-ui, sans-serif;
    background: #000;
    color: #fff;
    display: grid;
    place-items: center;
    padding: 24px;
  }
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.72);
    backdrop-filter: blur(6px);
  }
  .modal {
    position: relative;
    z-index: 1;
    width: min(100%, 400px);
    background: #0a0a0a;
    border: 1px solid rgba(255,255,255,0.12);
    padding: 32px 28px 28px;
  }
  .eyebrow {
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.42);
    margin-bottom: 10px;
  }
  h1 {
    font-size: 1.35rem;
    font-weight: 600;
    line-height: 1.25;
    margin-bottom: 8px;
  }
  .sub {
    font-size: 14px;
    color: rgba(255,255,255,0.55);
    line-height: 1.5;
    margin-bottom: 22px;
  }
  label {
    display: block;
    font-size: 12px;
    color: rgba(255,255,255,0.5);
    margin-bottom: 8px;
  }
  input[type="password"] {
    width: 100%;
    background: #000;
    border: 1px solid rgba(255,255,255,0.14);
    color: #fff;
    font: inherit;
    font-size: 15px;
    padding: 11px 12px;
    outline: none;
  }
  input[type="password"]:focus {
    border-color: #FF9500;
    box-shadow: 0 0 0 1px #FF9500;
  }
  button {
    margin-top: 16px;
    width: 100%;
    border: none;
    background: #FF9500;
    color: #000;
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    padding: 11px 14px;
    cursor: pointer;
  }
  button:hover { filter: brightness(1.06); }
  .err {
    margin-top: 14px;
    font-size: 13px;
    color: #ef5f5f;
  }
</style>
</head>
<body>
  <div class="backdrop" aria-hidden="true"></div>
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="gate-title">
    <p class="eyebrow">Internal · BTC Media</p>
    <h1 id="gate-title">Open Source Hub</h1>
    <p class="sub">This directory contains sensitive outreach contacts. Enter the team password to continue.</p>
    <form method="POST" action="/_auth">
      <input type="hidden" name="next" value="${next.replace(/"/g, '&quot;')}" />
      <label for="password">Password</label>
      <input id="password" name="password" type="password" autocomplete="current-password" required autofocus />
      <button type="submit">Continue</button>
      ${err}
    </form>
  </div>
</body>
</html>`;
  return new Response(html, {
    status: error ? 401 : 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const next = url.pathname + url.search;

  if (request.method === 'POST' && url.pathname === '/_auth') {
    let pass = '';
    let redirect = '/';
    const ct = request.headers.get('content-type') || '';
    if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
      const form = await request.formData();
      pass = String(form.get('password') || '');
      redirect = String(form.get('next') || '/');
    }
    if (pass !== password()) {
      return loginPage(redirect, true);
    }
    const token = await signToken();
    const safeNext = redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/';
    return new Response(null, {
      status: 303,
      headers: {
        Location: safeNext,
        'Set-Cookie': `${COOKIE}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${MAX_AGE}`,
        'Cache-Control': 'no-store',
      },
    });
  }

  if (await validToken(readCookie(request))) return;

  if (url.pathname === '/_auth') {
    return loginPage(next || '/', false);
  }

  return loginPage(next || '/', false);
}
