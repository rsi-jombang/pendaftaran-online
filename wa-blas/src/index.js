import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import qrcode from 'qrcode';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.WA_API_KEY || '';

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

let qrDataUrl = null;
let isReady = false;

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  },
});

client.on('qr', async (qr) => {
  qrDataUrl = await qrcode.toDataURL(qr);
  isReady = false;
  console.log('[WA] QR updated — buka GET /qr untuk scan');
});

client.on('ready', () => {
  isReady = true;
  qrDataUrl = null;
  console.log('[WA] Client ready');
});

client.on('authenticated', () => console.log('[WA] Authenticated'));
client.on('auth_failure', (m) => console.error('[WA] Auth failure', m));
client.on('disconnected', (reason) => {
  isReady = false;
  console.log('[WA] Disconnected', reason);
});

client.initialize().catch((e) => console.error('[WA] initialize error', e));

function requireApiKey(req, res, next) {
  if (!API_KEY) return next();
  const key = req.headers['x-api-key'] || req.query.key;
  if (key !== API_KEY) return res.status(401).json({ success: false, message: 'Unauthorized' });
  next();
}

app.get('/status', (_req, res) => {
  res.json({ success: true, ready: isReady, hasQr: !!qrDataUrl });
});

app.get('/qr', (_req, res) => {
  if (qrDataUrl) return res.json({ success: true, qr: qrDataUrl });
  if (isReady) return res.json({ success: true, message: 'Already ready, no QR needed' });
  return res.status(404).json({ success: false, message: 'QR belum tersedia, tunggu initialize' });
});

app.get('/qr-image', async (_req, res) => {
  if (!qrDataUrl) return res.status(404).send('QR not ready');
  const base64 = qrDataUrl.replace(/^data:image\/png;base64,/, '');
  res.setHeader('Content-Type', 'image/png');
  res.send(Buffer.from(base64, 'base64'));
});

function normalizePhone(input) {
  if (!input) return null;
  let p = String(input).replace(/[^0-9]/g, '');
  if (!p) return null;
  if (p.startsWith('0')) p = '62' + p.slice(1);
  if (!p.startsWith('62')) p = '62' + p;
  return `${p}@c.us`;
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

app.post('/send', requireApiKey, async (req, res) => {
  const { to, message } = req.body || {};
  if (!to || !message) {
    return res.status(422).json({ success: false, message: 'Field to & message wajib' });
  }
  if (!isReady) {
    return res.status(503).json({ success: false, message: 'WA belum ready, scan QR dulu di /qr' });
  }
  const chatId = normalizePhone(to);
  if (!chatId) return res.status(422).json({ success: false, message: 'Nomor tidak valid' });

  // fire-and-forget dengan delay 3s anti-blokir (jangan block response lama)
  // tetap await delay di sini agar Laravel merasa terkirim, tapi tidak antri panjang
  try {
    await delay(3000);
    await client.sendMessage(chatId, String(message));
    return res.json({ success: true, message: 'Terkirim', to: chatId });
  } catch (e) {
    console.error('[WA] send error', e?.message || e);
    return res.status(500).json({ success: false, message: e?.message || 'Gagal kirim' });
  }
});

app.listen(PORT, () => console.log(`[WA] Gateway listen http://localhost:${PORT} — status: /status qr: /qr`));
