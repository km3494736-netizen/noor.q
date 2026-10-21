// يحمّل المصحف كاملاً (رسم عثماني) مرة واحدة ويحفظه في data/quran.json
const fs = require('fs');
const path = require('path');
const strip = (s) => s.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');

(async () => {
  const r = await fetch('https://api.alquran.cloud/v1/quran/quran-uthmani');
  if (!r.ok) throw new Error('فشل التحميل: ' + r.status);
  const j = await r.json();
  const out = {};
  for (const s of j.data.surahs) {
    const ayahs = s.ayahs.map((a) => a.text);
    // الـ API يضيف البسملة لأول آية في كل سورة (عدا الفاتحة والتوبة)، نحذفها هنا
    if (s.number !== 1 && s.number !== 9) {
      const w = ayahs[0].split(' ');
      if (strip(w[0]) === 'بسم') ayahs[0] = w.slice(4).join(' ');
    }
    out[s.number] = ayahs;
  }
  fs.writeFileSync(path.join(__dirname, 'data', 'quran.json'), JSON.stringify(out));
  console.log('تم حفظ', Object.keys(out).length, 'سورة');
})().catch((e) => { console.error(e.message); process.exit(1); });
