const fs = require('fs');
const http = require('http');
const path = require('path');
const vm = require('vm');

const root = __dirname;
const annotationFile = path.join(root, 'annotations', 'annotations.js');
const port = Number(process.env.PORT || 5178);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml'
};

function send(res, status, body, headers = {}) {
  const payload = typeof body === 'string' ? body : JSON.stringify(body);
  res.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    ...headers
  });
  res.end(payload);
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 10 * 1024 * 1024) {
        req.destroy(new Error('Request body too large'));
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function loadAnnotationData() {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(annotationFile, 'utf8'), sandbox, {
    filename: annotationFile
  });
  return sandbox.window.AnnotationData || {};
}

function writeAnnotationData(data) {
  const content = [
    '/**',
    ' * 页面标注数据',
    ' * 所有业务标注统一维护在此文件。',
    ' */',
    `window.AnnotationData = ${JSON.stringify(data, null, 2)};`,
    ''
  ].join('\n');
  fs.writeFileSync(annotationFile, content, 'utf8');
}

function safeResolve(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const resolved = path.join(root, normalized === '/' ? 'index.html' : normalized);
  if (!resolved.startsWith(root)) return null;
  return resolved;
}

async function handleSave(req, res) {
  try {
    const body = await readRequestBody(req);
    const payload = JSON.parse(body || '{}');
    const page = String(payload.page || '');
    const annotations = payload.annotations;

    if (!page || !Array.isArray(annotations)) {
      send(res, 400, { ok: false, error: 'Expected { page, annotations[] }' }, {
        'Content-Type': 'application/json; charset=utf-8'
      });
      return;
    }

    const data = loadAnnotationData();
    if (!Array.isArray(data[page])) {
      send(res, 400, { ok: false, error: `Unknown annotation page: ${page}` }, {
        'Content-Type': 'application/json; charset=utf-8'
      });
      return;
    }

    data[page] = annotations;
    writeAnnotationData(data);
    send(res, 200, {
      ok: true,
      page,
      count: annotations.length,
      file: path.relative(root, annotationFile)
    }, {
      'Content-Type': 'application/json; charset=utf-8'
    });
  } catch (error) {
    send(res, 500, { ok: false, error: error.message }, {
      'Content-Type': 'application/json; charset=utf-8'
    });
  }
}

function serveStatic(req, res) {
  const filePath = safeResolve(req.url);
  if (!filePath) {
    send(res, 403, 'Forbidden', { 'Content-Type': 'text/plain; charset=utf-8' });
    return;
  }

  fs.stat(filePath, (statError, stat) => {
    if (statError || !stat.isFile()) {
      send(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' });
      return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, {
      'Content-Type': contentTypes[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    send(res, 204, '');
    return;
  }

  if (req.url.split('?')[0] === '/__annotations/save') {
    if (req.method !== 'POST') {
      send(res, 405, { ok: false, error: 'Method not allowed' }, {
        'Content-Type': 'application/json; charset=utf-8'
      });
      return;
    }
    handleSave(req, res);
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, 'Method not allowed', { 'Content-Type': 'text/plain; charset=utf-8' });
    return;
  }

  serveStatic(req, res);
});

server.listen(port, () => {
  console.log(`Annotation save server running at http://127.0.0.1:${port}/`);
  console.log('Open pages/workbench.html or pages/userinsight.html through this server to write edits back to annotations/annotations.js.');
});
