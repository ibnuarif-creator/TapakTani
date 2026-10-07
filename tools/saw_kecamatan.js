// Skor SAW 4 kriteria per kecamatan × komoditas (sama dengan perhitungan di WebGIS) — paper JTEP-L.
// Jalankan: node tools/saw_kecamatan.js  → ../Paper/Gambar/data_analisis/saw_kecamatan.json
const fs = require('fs'), vm = require('vm'), path = require('path');
const R = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(R, 'script.js'), 'utf8').replace(/\r\n/g, '\n');
const cut = (a, b) => src.slice(src.indexOf(a), src.indexOf(b));

const ctx = { console, out: null };
vm.runInNewContext([
  fs.readFileSync(path.join(R, 'data/syarat_tumbuh.js'), 'utf8'),
  fs.readFileSync(path.join(R, 'data/kesesuaian_data_v2.js'), 'utf8'),
  cut('const kecamatanData', '// ============================================================\n// ANALISIS SYARAT TUMBUH'),
  cut('const SAW_BOBOT =', 'function buildSAWPanel('),
  'out = { kecamatanData, iklimKecamatan, syaratTumbuhDB, SAW_BOBOT, hitungSkorKrop, peta: kesesuaianLahanData };'
].join('\n;\n'), ctx);
const S = ctx.out;

const kecamatan = Object.entries(S.kecamatanData).map(([id, d]) => {
  const iklim = S.iklimKecamatan[id];
  const skor = {};
  d.relevantCrops.filter(c => S.syaratTumbuhDB[c]).forEach(c => {
    skor[c] = +S.hitungSkorKrop(iklim, S.syaratTumbuhDB[c]).sawScore.toFixed(3);
  });
  const pr = S.peta.features.map(f => f.properties)
    .find(p => p.NAME_3.replace("Telok Pa'Kedai", 'Teluk Pakedai') === d.name);
  return { id, nama: d.name, iklim, ndvi: pr.ndvi, skorWO: pr.skor, kelasWO: pr.kelas, skor };
});
const nama = Object.fromEntries(Object.entries(S.syaratTumbuhDB).map(([k, v]) => [k, v.nama]));

const out = path.join(R, '..', 'Paper', 'Gambar', 'data_analisis', 'saw_kecamatan.json');
fs.writeFileSync(out, JSON.stringify({ bobot: S.SAW_BOBOT, nama, kecamatan }, null, 1));
console.log('ditulis:', out);
