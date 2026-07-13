// Edge Middleware — password gate for the whole site.
// Runs before any static file is served; the source is NOT downloadable by clients.
// Password can be overridden with the SITE_PASSWORD env var (recommended); the
// literal below is the fallback so protection works from the first deploy.
export const config = { matcher: '/(.*)' };

export default function middleware(request) {
  const PASSWORD = (typeof process !== 'undefined' && process.env && process.env.SITE_PASSWORD)
    ? process.env.SITE_PASSWORD
    : 'kpk%@$2a43_3249';

  const auth = request.headers.get('authorization');
  if (auth) {
    const sp = auth.indexOf(' ');
    const scheme = auth.slice(0, sp);
    const encoded = auth.slice(sp + 1);
    if (scheme === 'Basic') {
      try {
        const decoded = atob(encoded);
        const pass = decoded.slice(decoded.indexOf(':') + 1);
        if (pass === PASSWORD) return; // authorized -> serve the file
      } catch (_) { /* fall through */ }
    }
  }
  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Open Source Hub", charset="UTF-8"',
      'Content-Type': 'text/plain',
    },
  });
}
