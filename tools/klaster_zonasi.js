// Matriks skor SAW 4 kriteria untuk SEMUA komoditas (gabungan komoditas relevan) di 9 kecamatan,
// dipakai untuk analisis klaster zonasi agroekologi (paper JTEP-L).
// Jalankan: node tools/klaster_zonasi.js → ../Paper/Gambar/data_analisis/saw_matriks_lengkap.json
const fs = require('fs'), vm = require('vm'), path = require('path');
const R = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(R, 'script.js'), 'utf8').replace(/\r\n/g, '\n');
const cut = (a, b) => src.slice(src.indexOf(a), src.indexOf(b));
const ctx = { out: null };
vm.runInNewContext([
  fs.readFileSync(path.join(R, 'data/syarat_tumbuh.js'), 'utf8'),
  cut('const kecamatanData', '// ============================================================\n// ANALISIS SYARAT TUMBUH'),
  cut('const SAW_BOBOT =', 'function buildSAWPanel('),
  'out = { kecamatanData, iklimKecamatan, syaratTumbuhDB, hitungSkorKrop };'
].join('\n;\n'), ctx);
const S = ctx.out;
const komoditas = [...new Set(Object.values(S.kecamatanData).flatMap(d => d.relevantCrops))].filter(c => S.syaratTumbuhDB[c]).sort();
const baris = Object.entries(S.kecamatanData).map(([id, d]) => ({
  nama: d.name,
  skor: komoditas.map(c => +S.hitungSkorKrop(S.iklimKecamatan[id], S.syaratTumbuhDB[c]).sawScore.toFixed(4))
}));
const out = path.join(R, '..', 'Paper', 'Gambar', 'data_analisis', 'saw_matriks_lengkap.json');
fs.writeFileSync(out, JSON.stringify({ komoditas, baris }, null, 1));
console.log('ditulis:', out, komoditas.length, 'komoditas');
