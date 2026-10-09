/**
 * Vite Dev Server Plugin: Cover Image Proxy & Validator
 * Handles server-side fetching of external book covers to bypass CORS,
 * validate image content-types and magic bytes, and reject HTML error pages.
 */

export function coverProxyPlugin() {
  return {
    name: 'borrow-cover-proxy-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        
        if (urlObj.pathname === '/api/cover-proxy') {
          const targetUrl = urlObj.searchParams.get('url');

          if (!targetUrl) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Missing "url" query parameter.' }));
            return;
          }

          if (!/^https?:\/\//i.test(targetUrl)) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'URL must use HTTP or HTTPS protocol.' }));
            return;
          }

          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const remoteRes = await fetch(targetUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) BorrowAdmin/1.0',
                Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
              },
              redirect: 'follow',
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!remoteRes.ok) {
              res.statusCode = 422;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                error: `Remote server responded with HTTP status ${remoteRes.status}: ${remoteRes.statusText}`,
              }));
              return;
            }

            const contentType = remoteRes.headers.get('content-type') || '';

            // Guard against HTML error pages, text, or non-image types
            if (!contentType.toLowerCase().startsWith('image/')) {
              res.statusCode = 422;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                error: `Invalid content type: expected image, but received "${contentType}". This may be an HTML error page or paywall.`,
              }));
              return;
            }

            const arrayBuf = await remoteRes.arrayBuffer();
            const buffer = Buffer.from(arrayBuf);

            if (buffer.length < 16) {
              res.statusCode = 422;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Image file is empty or corrupted (less than 16 bytes).' }));
              return;
            }

            // Verify Magic Bytes
            const hex = buffer.subarray(0, 4).toString('hex').toLowerCase();
            const isJpeg = hex.startsWith('ffd8ff');
            const isPng = hex === '89504e47';
            const isGif = hex.startsWith('474946');
            const isWebp = buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
            const isSvg = buffer.subarray(0, 100).toString('utf8').includes('<svg');

            if (!isJpeg && !isPng && !isGif && !isWebp && !isSvg) {
              res.statusCode = 422;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                error: 'File does not contain valid image signatures (magic bytes check failed).',
              }));
              return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Length', buffer.length);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=43200');
            res.end(buffer);
          } catch (err) {
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            const msg = err.name === 'AbortError' ? 'Image fetch timed out after 10s' : (err.message || 'Failed to fetch remote image');
            res.end(JSON.stringify({ error: msg }));
          }
          return;
        }

        if (urlObj.pathname === '/api/validate-cover-url' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { url } = JSON.parse(body || '{}');
              if (!url || !/^https?:\/\//i.test(url)) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ valid: false, error: 'Invalid or missing HTTP/HTTPS URL.' }));
                return;
              }

              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 7000);

              const remoteRes = await fetch(url, {
                method: 'HEAD',
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) BorrowAdmin/1.0',
                  Accept: 'image/*,*/*;q=0.8',
                },
                redirect: 'follow',
                signal: controller.signal,
              });

              clearTimeout(timeoutId);

              const ct = remoteRes.headers.get('content-type') || '';
              if (remoteRes.ok && ct.toLowerCase().startsWith('image/')) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  valid: true,
                  contentType: ct,
                  size: remoteRes.headers.get('content-length'),
                }));
                return;
              }

              // Fallback to GET check if HEAD was rejected by server
              const getController = new AbortController();
              const getTimeoutId = setTimeout(() => getController.abort(), 7000);
              const getRes = await fetch(url, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) BorrowAdmin/1.0',
                  Accept: 'image/*,*/*;q=0.8',
                },
                redirect: 'follow',
                signal: getController.signal,
              });
              clearTimeout(getTimeoutId);

              const getCt = getRes.headers.get('content-type') || '';
              if (getRes.ok && getCt.toLowerCase().startsWith('image/')) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  valid: true,
                  contentType: getCt,
                  size: getRes.headers.get('content-length'),
                }));
              } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  valid: false,
                  error: `Remote returned status ${getRes.status} with content-type "${getCt}".`,
                }));
              }
            } catch (err) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                valid: false,
                error: err.name === 'AbortError' ? 'Fetch timed out' : err.message,
              }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}
