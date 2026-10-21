
الهيكل
`server.js` سيرفر Express والـ API
`seed.js` تحميل المصحف إلى `data/quran.json`
`data/` الأحاديث والأذكار (عدّل الملفات لإضافة المزيد)
`public/index.html` الواجهة (HTML/CSS/JS)
الـ API
`GET /api/surah/:n` آيات سورة (1–114)
`GET /api/search?q=كلمة` بحث في الآيات (بدون تشكيل)
`GET /api/hadith` الأحاديث
`GET /api/adhkar` الأذكار حسب الفئة
