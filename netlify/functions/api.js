const express = require('express');
const serverless = require('serverless-http');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA = path.join(__dirname, '..', '..', 'data');
const read = (f) => JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));

let quran, partial = false;
try {
  quran = read('quran.json');
} catch {
  quran = read('quran.sample.json');
  partial = true;
}
const hadith = read('hadith.json');
const adhkar = read('adhkar.json');

const plain = (s) => s
  .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
  .replace(/[إأآٱ]/g, 'ا')
  .replace(/ى/g, 'ي')
  .replace(/ة/g, 'ه');

app.get('/surah/:n', (req, res) => {
  const n = Number(req.params.n);
  if (!Number.isInteger(n) || n < 1 || n > 114) {
    return res.status(400).json({ error: 'رقم السورة من 1 إلى 114' });
  }
  const ayahs = quran[n];
  if (!ayahs) return res.status(404).json({ error: 'السورة غير متوفرة' });
  res.json({ number: n, ayahs, partial });
});

app.get('/search', (req, res) => {
  const q = plain(String(req.query.q || '').trim());
  if (q.length < 2) return res.json([]);
  const out = [];
  for (const [s, ayahs] of Object.entries(quran)) {
    ayahs.forEach((t, i) => {
      if (out.length < 50 && plain(t).includes(q)) {
        out.push({ surah: +s, ayah: i + 1, text: t });
      }
    });
  }
  res.json(out);
});

app.get('/hadith', (_req, res) => res.json(hadith));
app.get('/adhkar', (_req, res) => res.json(adhkar));

module.exports.handler = serverless(app);
