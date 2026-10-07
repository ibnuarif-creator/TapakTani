// Analisis sensitivitas bobot SAW (one-at-a-time) — paper JTEP-L
// Setiap bobot w_j diubah ±10% dan ±20%; bobot lain diskalakan proporsional agar Σw = 1.
// Diukur: (1) korelasi Spearman peringkat desa untuk padi sawah (SAW 9 kriteria),
//         (2) korelasi Spearman peringkat komoditas per desa (min antar-desa),
//         (3) jumlah perubahan kategori SAW (Sangat Cocok/Cocok/...) pada semua pasangan desa–komoditas,
//         (4) korelasi Spearman peringkat komoditas per kecamatan (SAW 4 kriteria, min antar-kecamatan).
// Jalankan: node tools/sensitivitas_saw.js  → ../Paper/Gambar/data_analisis/sensitivitas.json
const fs = require('fs'), vm = require('vm'), path = require('path');
const R = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(R, 'script.js'), 'utf8').replace(/\r\n/g, '\n');
const cut = (a, b) => src.slice(src.indexOf(a), src.indexOf(b));

const ctx = { console, out: null };
vm.runInNewContext([
  fs.readFileSync(path.join(R, 'data/syarat_tumbuh.js'), 'utf8'),
  fs.readFileSync(path.join(R, 'data/rasau_jaya_desa.js'), 'utf8'),
  fs.readFileSync(path.join(R, 'data/parameter_lahan_desa.js'), 'utf8'),
  cut('const kecamatanData', '// ============================================================\n// ANALISIS SYARAT TUMBUH'),
  cut('const SAW_BOBOT =', 'function buildSAWPanel('),
  cut('// ── SAW komoditas tingkat DESA', '// Jumlah komoditas yang ditampilkan per desa'),
  'out = { kecamatanData, iklimKecamatan, syaratTumbuhDB, rasauJayaDesaData, SAW_BOBOT, SAW_BOBOT_DESA, hitungSkorKrop, hitungSkorKropDesa };'
].join('\n;\n'), ctx);
const S = ctx.out;

const NAMA9 = ['Curah hujan', 'Suhu', 'Elevasi', 'Tekstur tanah', 'pH tanah', 'C-organik', 'Ketebalan gambut', 'Lereng', 'Bahaya banjir'];
const NAMA4 = ['Curah hujan', 'Suhu', 'Elevasi', 'Tekstur tanah'];
const DELTA = [-0.2, -0.1, 0.1, 0.2];
const kategori = v => v >= 0.8 ? 'SC' : v >= 0.6 ? 'C' : v >= 0.4 ? 'CS' : 'K';

function geser(w, j, d) {
  const wj = w[j] * (1 + d), sisa = (1 - wj) / (1 - w[j]);
  return w.map((x, i) => i === j ? wj : x * sisa);
}
function peringkat(arr) {            // peringkat rata-rata untuk nilai sama (ties)
  const idx = arr.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]);
  const r = new Array(arr.length);
  for (let i = 0; i < idx.length;) {
    let j = i; while (j + 1 < idx.length && Math.abs(idx[j + 1][0] - idx[i][0]) < 1e-9) j++;
    for (let k = i; k <= j; k++) r[idx[k][1]] = (i + j) / 2 + 1;
    i = j + 1;
  }
  return r;
}
function spearman(a, b) {
  const ra = peringkat(a), rb = peringkat(b), n = a.length;
  const ma = ra.reduce((s, x) => s + x, 0) / n, mb = rb.reduce((s, x) => s + x, 0) / n;
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < n; i++) { num += (ra[i] - ma) * (rb[i] - mb); da += (ra[i] - ma) ** 2; db += (rb[i] - mb) ** 2; }
  return da && db ? num / Math.sqrt(da * db) : 1;
}

// ── SAW 9 kriteria (desa) dengan bobot sembarang ──
const iklimRJ = S.iklimKecamatan['rasau-jaya'];
const crops = S.kecamatanData['rasau-jaya'].relevantCrops.filter(id => S.syaratTumbuhDB[id]);
const desa = S.rasauJayaDesaData.features.map(f => f.properties);
// nilaiArr 9 elemen per desa–komoditas dihitung sekali (bobot tidak memengaruhi r)
const R9 = desa.map(p => crops.map(c => S.hitungSkorKropDesa(iklimRJ, S.syaratTumbuhDB[c], p).nilaiArr));
const skor9 = w => R9.map(baris => baris.map(r => r.reduce((s, v, i) => s + w[i] * v, 0)));

const base9 = skor9(S.SAW_BOBOT_DESA);
const iPadi = crops.indexOf('padi_sawah');
const hasil9 = [];
NAMA9.forEach((nama, j) => DELTA.forEach(d => {
  const s = skor9(geser(S.SAW_BOBOT_DESA, j, d));
  let rhoKomMin = 1, ubahKat = 0;
  s.forEach((baris, di) => {
    rhoKomMin = Math.min(rhoKomMin, spearman(base9[di], baris));
    baris.forEach((v, ci) => { if (kategori(v) !== kategori(base9[di][ci])) ubahKat++; });
  });
  hasil9.push({ kriteria: nama, delta: d, rhoDesaPadi: +spearman(base9.map(b => b[iPadi]), s.map(b => b[iPadi])).toFixed(3),
                rhoKomoditasMin: +rhoKomMin.toFixed(3), perubahanKategori: ubahKat, totalPasangan: desa.length * crops.length });
}));

// ── SAW 4 kriteria (kecamatan) ──
const kec = Object.entries(S.kecamatanData).map(([id, d]) => ({ id, crops: d.relevantCrops.filter(c => S.syaratTumbuhDB[c]) }));
const R4 = kec.map(k => k.crops.map(c => S.hitungSkorKrop(S.iklimKecamatan[k.id], S.syaratTumbuhDB[c]).nilaiArr));
const skor4 = w => R4.map(baris => baris.map(r => r.reduce((s, v, i) => s + w[i] * v, 0)));
const base4 = skor4(S.SAW_BOBOT);
const hasil4 = [];
NAMA4.forEach((nama, j) => DELTA.forEach(d => {
  const s = skor4(geser(S.SAW_BOBOT, j, d));
  let rhoMin = 1, top1Sama = 0;
  s.forEach((baris, ki) => {
    rhoMin = Math.min(rhoMin, spearman(base4[ki], baris));
    const maxB = Math.max(...base4[ki]), maxS = Math.max(...baris);
    const topB = base4[ki].map((v, i) => v === maxB ? i : -1).filter(i => i >= 0);
    const topS = baris.map((v, i) => Math.abs(v - maxS) < 1e-9 ? i : -1).filter(i => i >= 0);
    if (topS.some(i => topB.includes(i))) top1Sama++;
  });
  hasil4.push({ kriteria: nama, delta: d, rhoKomoditasMin: +rhoMin.toFixed(3), kecamatanTop1Tetap: top1Sama, totalKecamatan: kec.length });
}));

const outDir = path.join(R, '..', 'Paper', 'Gambar', 'data_analisis');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'sensitivitas.json'), JSON.stringify({ desa9: hasil9, kecamatan4: hasil4 }, null, 1));

const ring = (arr, kunci) => Math.min(...arr.map(x => x[kunci]));
console.log('SAW 9 kriteria — rho desa (padi) min:', ring(hasil9, 'rhoDesaPadi'), '| rho komoditas min:', ring(hasil9, 'rhoKomoditasMin'),
  '| perubahan kategori maks:', Math.max(...hasil9.map(x => x.perubahanKategori)), 'dari', hasil9[0].totalPasangan);
NAMA9.forEach(n => { const r = hasil9.filter(x => x.kriteria === n);
  console.log('  ', n.padEnd(17), 'rhoDesaPadi', r.map(x => x.rhoDesaPadi).join(' '), '| rhoKom', r.map(x => x.rhoKomoditasMin).join(' '), '| ubahKat', r.map(x => x.perubahanKategori).join(' ')); });
console.log('SAW 4 kriteria — rho komoditas min:', ring(hasil4, 'rhoKomoditasMin'));
NAMA4.forEach(n => { const r = hasil4.filter(x => x.kriteria === n);
  console.log('  ', n.padEnd(17), 'rhoKom', r.map(x => x.rhoKomoditasMin).join(' '), '| top1 tetap', r.map(x => x.kecamatanTop1Tetap + '/' + x.totalKecamatan).join(' ')); });
