const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const read = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, 'data', f), 'utf8'));

// المصحف الكامل (من npm run seed) أو النسخة التجريبية
let quran, partial = false;
try { quran = read('quran.json'); }
catch { quran = read('quran.sample.json'); partial = true; console.warn('quran.json غير موجود، تم استخدام النسخة التجريبية. شغّل: npm run seed'); }
const hadith = read('hadith.json');
const adhkar = read('adhkar.json');

// إزالة التشكيل للبحث
const plain = (s) => s.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
  .replace(/[إأآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');

app.get('/api/surah/:n', (req, res) => {
  const n = Number(req.params.n);
  if (!Number.isInteger(n) || n < 1 || n > 114) return res.status(400).json({ error: 'رقم السورة من 1 إلى 114' });
  const ayahs = quran[n];
  if (!ayahs) return res.status(404).json({ error: 'السورة غير متوفرة. شغّل npm run seed' });
  res.json({ number: n, ayahs, partial });
});

app.get('/api/search', (req, res) => {
  const q = plain(String(req.query.q || '').trim());
  if (q.length < 2) return res.json([]);
  const out = [];
  for (const [s, ayahs] of Object.entries(quran)) {
    ayahs.forEach((t, i) => { if (out.length < 50 && plain(t).includes(q)) out.push({ surah: +s, ayah: i + 1, text: t }); });
  }
  res.json(out);
});

app.get('/api/hadith', (_req, res) => res.json(hadith));
app.get('/api/adhkar', (_req, res) => res.json(adhkar));

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
