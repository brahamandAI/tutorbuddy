#!/usr/bin/env node
/**
 * Download NCERT chapter PDFs from public/links.txt into public/pdfs/.
 *
 * The /ncert pages read files from:
 *   public/pdfs/class{N}/class{N}{subject}/chapter{N}.pdf
 *
 * Usage:
 *   node scripts/download-ncert-pdfs.js
 *   node scripts/download-ncert-pdfs.js --limit 3 --concurrency 3
 *   npm run pdfs:download -- --limit 20 --concurrency 10
 *   npm run pdfs:download --limit 20 --concurrency 10
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const LINKS_FILE = path.join(ROOT, 'public', 'links.txt');
const DEST_ROOT = path.join(ROOT, 'public', 'pdfs');
const MANIFEST_PATH = path.join(DEST_ROOT, '.completed.json');

function parseArgs(argv) {
  const opts = {
    concurrency: 4,
    limit: Infinity,
    timeoutMs: 10 * 60 * 1000,
  };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const equals = arg.match(/^(--?[a-z-]+)=(.+)$/);
    const flag = equals ? equals[1] : arg;
    const inlineValue = equals ? equals[2] : null;
    const nextValue = () => {
      if (inlineValue !== null) return inlineValue;
      return argv[++i];
    };
    if (flag === '--concurrency') opts.concurrency = Number(nextValue());
    else if (flag === '--limit' || flag === '-limit') opts.limit = Number(nextValue());
    else if (flag === '--timeout') opts.timeoutMs = Number(nextValue()) * 1000;
    else if (flag === '--help' || flag === '-h') opts.help = true;
    else if (/^\d+$/.test(arg)) positional.push(Number(arg));
    else throw new Error(`Unknown argument: ${arg}`);
  }
  // npm run pdfs:download --limit 20 --concurrency 10 forwards only "20 10".
  if (positional.length >= 1 && opts.limit === Infinity) opts.limit = positional[0];
  if (positional.length >= 2 && opts.concurrency === 4) opts.concurrency = positional[1];
  if (!Number.isFinite(opts.concurrency) || opts.concurrency < 1) {
    throw new Error('--concurrency must be a positive number');
  }
  if (!Number.isFinite(opts.limit) || opts.limit < 1) {
    throw new Error('--limit must be a positive number');
  }
  return opts;
}

function printHelp() {
  console.log(`Download NCERT PDFs listed in public/links.txt into public/pdfs/.

Options:
  --concurrency N   Parallel Mega downloads (default 4)
  --limit N         Download N files that are not already saved
  --timeout SEC     Per-file timeout in seconds (default 600)

npm swallows --limit and --concurrency unless you add an extra --:
  npm run pdfs:download -- --limit 20 --concurrency 10

This also accepts the values npm forwards on their own:
  npm run pdfs:download --limit 20 --concurrency 10
`);
}

function parseLinks(text) {
  const entries = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const match = trimmed.match(/^(.+?):\s+(https:\/\/mega\.nz\/\S+)\s*$/);
    if (!match) {
      throw new Error(`Could not parse links.txt line ${index + 1}: ${trimmed}`);
    }
    const relativePath = match[1].replace(/^\/+/, '');
    if (relativePath.includes('..') || path.isAbsolute(relativePath)) {
      throw new Error(`Unsafe path on line ${index + 1}: ${relativePath}`);
    }
    entries.push({ relativePath, url: match[2] });
  });
  return entries;
}

function loadManifest() {
  try {
    const data = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    return new Set(Array.isArray(data) ? data : []);
  } catch {
    return new Set();
  }
}

function saveManifest(done) {
  fs.mkdirSync(DEST_ROOT, { recursive: true });
  const tmp = `${MANIFEST_PATH}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify([...done].sort(), null, 2));
  fs.renameSync(tmp, MANIFEST_PATH);
}

function isValidPdf(filePath) {
  let fd;
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile() || stat.size < 1024) return false;
    fd = fs.openSync(filePath, 'r');
    const buf = Buffer.alloc(5);
    const read = fs.readSync(fd, buf, 0, 5, 0);
    return read === 5 && buf.toString() === '%PDF-';
  } catch {
    return false;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}

function fileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--';
  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

function renderBar(ratio, width = 24) {
  const filled = Math.round(Math.max(0, Math.min(1, ratio)) * width);
  return `[${'█'.repeat(filled)}${'░'.repeat(width - filled)}]`;
}

function fitLine(line) {
  const cols = process.stdout.columns || 80;
  if (line.length < cols) return line;
  return line.slice(0, Math.max(1, cols - 1));
}

function downloadFile(url, dest, timeoutMs) {
  return new Promise((resolve) => {
    const child = spawn(
      'megadl',
      [
        '--no-progress',
        '--print-names',
        '--no-ask-password',
        '--ignore-config-file',
        `--path=${dest}`,
        url,
      ],
      { stdio: ['ignore', 'pipe', 'pipe'] }
    );

    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      stderr += `\nTimed out after ${Math.round(timeoutMs / 1000)}s`;
    }, timeoutMs);

    child.on('error', (error) => {
      clearTimeout(timer);
      resolve({ ok: false, error: error.message });
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0 && isValidPdf(dest)) {
        resolve({ ok: true, bytes: fileSize(dest) });
        return;
      }
      const detail = stderr.trim().split('\n').slice(-3).join(' ') || `megadl exited ${code}`;
      resolve({ ok: false, error: detail });
    });
  });
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    printHelp();
    return;
  }

  const allEntries = parseLinks(fs.readFileSync(LINKS_FILE, 'utf8'));
  const completed = loadManifest();
  const entries = [];
  let already = 0;
  for (const entry of allEntries) {
    const dest = path.join(DEST_ROOT, entry.relativePath);
    if (completed.has(entry.relativePath) && isValidPdf(dest)) {
      already += 1;
      continue;
    }
    entries.push(entry);
    if (entries.length >= opts.limit) break;
  }

  const startedAt = Date.now();
  const active = new Map();
  const failures = [];
  let downloadedBytes = 0;
  let downloadedCount = 0;

  const status = () => {
    const elapsed = Math.max((Date.now() - startedAt) / 1000, 0.001);
    const partialBytes = [...active.keys()].reduce((sum, dest) => sum + fileSize(dest), 0);
    const bytes = downloadedBytes + partialBytes;
    const speed = bytes / elapsed;
    const left = entries.length - downloadedCount;
    const avg = downloadedCount > 0 ? downloadedBytes / downloadedCount : 0;
    const leftBytes = avg > 0 ? Math.max(0, avg * left - partialBytes) : Infinity;
    const eta = left === 0 ? 0 : speed > 0 && Number.isFinite(leftBytes) ? leftBytes / speed : Infinity;
    const ratio = entries.length === 0 ? 1 : downloadedCount / entries.length;
    const fail = failures.length ? `  fail ${failures.length}` : '';
    return {
      line: `${renderBar(ratio)} ${downloadedCount}/${entries.length}  ${formatBytes(bytes)}  ${formatBytes(speed)}/s  ETA ${formatDuration(eta)}  active ${active.size}${fail}`,
      elapsed,
      bytes,
    };
  };

  let lastDraw = 0;
  const draw = (force = false) => {
    if (!process.stdout.isTTY) return;
    const now = Date.now();
    if (!force && now - lastDraw < 200) return;
    lastDraw = now;
    process.stdout.write(`\x1b[2K\r${fitLine(status().line)}`);
  };

  const timer = setInterval(() => draw(true), 500);

  console.log(`Already on disk: ${already}`);
  console.log(`Downloading ${entries.length} file(s), ${Math.min(opts.concurrency, entries.length) || 0} at a time`);
  console.log(`Destination: ${DEST_ROOT}`);
  if (entries.length === 0) {
    clearInterval(timer);
    console.log('Nothing left to download.');
    return;
  }

  let cursor = 0;
  async function worker() {
    while (cursor < entries.length) {
      const entry = entries[cursor++];
      const dest = path.join(DEST_ROOT, entry.relativePath);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      active.set(dest, entry.relativePath);
      draw(true);
      const result = await downloadFile(entry.url, dest, opts.timeoutMs);
      active.delete(dest);
      if (result.ok) {
        downloadedCount += 1;
        downloadedBytes += result.bytes;
        completed.add(entry.relativePath);
        saveManifest(completed);
        if (!process.stdout.isTTY) {
          const snap = status();
          console.log(`ok  ${downloadedCount}/${entries.length}  ${entry.relativePath}  ${formatBytes(result.bytes)}  ${formatBytes(snap.bytes / snap.elapsed)}/s  ETA ${formatDuration(snap.elapsed === 0 ? Infinity : (entries.length - downloadedCount) * (snap.elapsed / downloadedCount))}`);
        }
      } else {
        failures.push({ path: entry.relativePath, error: result.error });
        if (process.stdout.isTTY) process.stdout.write('\x1b[2K\r');
        console.log(`fail ${entry.relativePath}: ${result.error}`);
      }
      draw(true);
    }
  }

  const workers = Array.from(
    { length: Math.min(opts.concurrency, entries.length) },
    () => worker()
  );
  await Promise.all(workers);
  clearInterval(timer);
  if (process.stdout.isTTY) process.stdout.write('\n');

  const finalStatus = status();
  console.log(finalStatus.line);
  console.log(
    `Finished in ${formatDuration(finalStatus.elapsed)}: ${downloadedCount} downloaded, ${already} already present, ${failures.length} failed.`
  );
  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
