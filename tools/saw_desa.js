// Skor SAW 9 kriteria dan kelas hukum minimum per desa Rasau Jaya (sama dengan WebGIS) — paper JTEP-L.
// Jalankan: node tools/saw_desa.js → ../Paper/Gambar/data_analisis/saw_desa.json
const fs = require('fs'), vm = require('vm'), path = require('path');
const R = path.join(__dirname, '..');
const CR = String.fromCharCode(13);
const src = fs.readFileSync(path.join(R, 'script.js'), 'utf8').split(CR).join('');
const cut = (a, b) => src.slice(src.indexOf(a), src.indexOf(b));
const ctx = { out: null };
vm.runInNewContext([
  fs.readFileSync(path.join(R, 'data/syarat_tumbuh.js'), 'utf8'),
  fs.readFileSync(path.join(R, 'data/rasau_jaya_desa.js'), 'utf8'),
  fs.readFileSync(path.join(R, 'data/parameter_lahan_desa.js'), 'utf8'),
  cut('const kecamatanData', '// ============================================================\n// ANALISIS SYARAT TUMBUH'),
  cut('const SAW_BOBOT =', 'function buildSAWPanel('),
  cut('// ── SAW komoditas tingkat DESA', '// Jumlah komoditas yang ditampilkan per desa'),
  'out = { kecamatanData, iklimKecamatan, syaratTumbuhDB, rasauJayaDesaData, hitungSkorKropDesa };'
].join('\n;\n'), ctx);
const S = ctx.out;
const iklim = S.iklimKecamatan['rasau-jaya'];
const crops = S.kecamatanData['rasau-jaya'].relevantCrops.filter(c => S.syaratTumbuhDB[c]);
const desa = S.rasauJayaDesaData.features.map(f => {
  const p = f.properties;
  const skor = crops.map(c => ({ c, ...S.hitungSkorKropDesa(iklim, S.syaratTumbuhDB[c], p) }))
    .sort((a, b) => b.sawScore - a.sawScore);
  const padi = skor.find(x => x.c === 'padi_sawah');
  const nama = p.NAME_4.replace(' Iii', ' III').replace(' Ii', ' II');
  return { desa: nama, teratas: skor.slice(0, 5).map(x => [x.c, x.sawScore]),
           juknisTeratas: skor[0].juknis && skor[0].juknis.label, padi: padi.sawScore, juknisPadi: padi.juknis && padi.juknis.label };
});
const out = path.join(R, '..', 'Paper', 'Gambar', 'data_analisis', 'saw_desa.json');
fs.writeFileSync(out, JSON.stringify(desa, null, 1));
desa.forEach(d => console.log(d.desa.padEnd(16), d.teratas.map(([c, v]) => `${c} ${v.toFixed(3)}`).join(', '), '| padi', d.padi.toFixed(3), d.juknisPadi, '| HM teratas', d.juknisTeratas));
