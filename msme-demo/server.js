const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
  const rawUrl = req.url.split('?')[0];
  const filePath = path.join(ROOT, rawUrl === '/' ? 'index.html' : rawUrl);
  const ext  = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 — Not found: ${rawUrl}`);
      return;
    }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════════════╗');
  console.log('  ║   MSME Loan Underwriting Desk — Demo Server     ║');
  console.log('  ║                                                  ║');
  console.log(`  ║   🌐  http://localhost:${PORT}                     ║`);
  console.log('  ║                                                  ║');
  console.log('  ║   Press Ctrl+C to stop                          ║');
  console.log('  ╚══════════════════════════════════════════════════╝');
  console.log('');
});

