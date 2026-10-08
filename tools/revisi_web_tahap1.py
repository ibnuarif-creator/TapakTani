"""
Revisi website tahap 1 (catatan revisi manuskrip, Okt 2026) — script.js, index.html, sebaran.js:
  E1/A5  skor weighted overlay = indeks kondisi lahan (Tinggi/Sedang/Rendah), bukan kelas kesesuaian S1–N
  E2/E3  deskripsi weighted overlay & alasan bobot diselaraskan dengan naskah
  E4     "Jenis Tanah" -> "Tekstur Tanah"
  E10    rincian desa: hanya padi sawah (model desa memakai ambang padi) + peringkat desa & faktor pembatas
  A1     Rasau Jaya bukan "lahan gambut" (data gambut < 40 cm)
  A11    halaman sebaran: angka utama di dalam enam desa
Aman dijalankan ulang (setiap penggantian dilewati bila sudah diterapkan).
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def buka(f):
    s = open(os.path.join(ROOT, f), encoding='utf-8', newline='').read()
    return s, ('\r\n' if '\r\n' in s else '\n')


def ganti(s, lama, baru, wajib=True):
    if lama in s:
        return s.replace(lama, baru)
    if baru in s or not wajib:
        return s
    raise AssertionError('tidak ditemukan: ' + lama[:90])


# ── script.js ────────────────────────────────────────────────────────────────
s, NL = buka('script.js')
s = s.replace('\r\n', '\n')
s = ganti(s, "const kelasLabel = { S1: 'Sangat Sesuai', S2: 'Cukup Sesuai', S3: 'Sesuai Marginal', N: 'Tidak Sesuai' };",
          "const kelasLabel = { S1: 'Sangat Sesuai', S2: 'Cukup Sesuai', S3: 'Sesuai Marginal', N: 'Tidak Sesuai' };\n"
          "// Skor weighted overlay adalah indeks kondisi lahan aktual (NDVI, tekstur, NDWI, lereng, aksesibilitas),\n"
          "// bukan kelas kesesuaian komoditas: kelasnya diberi label kondisi agar tidak tertukar dengan S1–N.\n"
          "const kondisiLabel = { S1: 'Tinggi', S2: 'Sedang', S3: 'Rendah', N: 'Sangat Rendah' };")
# popup peta desa (modal kecamatan)
s = ganti(s, "<div style=\"font-size:11.5px;margin-bottom:2px\">Kelas: <b style=\"color:${kelasColor[k]}\">${k} — ${kelasLabel[k]}</b></div>\n"
             "            <div style=\"font-size:11.5px;color:#444\">Skor Weighted Overlay: <b>${p.skor ? p.skor.toFixed(2) : '-'}</b></div>",
          "<div style=\"font-size:11.5px;margin-bottom:2px\">Kondisi lahan: <b style=\"color:${kelasColor[k]}\">${kondisiLabel[k]}</b></div>\n"
          "            <div style=\"font-size:11.5px;color:#444\">Indeks kondisi lahan (WO): <b>${p.skor ? p.skor.toFixed(2) : '-'}</b></div>")
# narasi desa
i = s.index('function generateDesaNarrative('); j = s.index('\n}\n', i) + 3
s = s[:i] + '''function generateDesaNarrative(props, rank, totalDesa, luasKm2) {
  const k = props.kelas || 'N';
  const skorTxt = props.skor ? props.skor.toFixed(2) : '-';
  const ndviTxt = props.ndvi ? props.ndvi.toFixed(2) : '-';
  const posisiTxt = rank === 1 ? 'tertinggi di kecamatan ini'
    : rank === totalDesa ? 'terendah di kecamatan ini'
    : `peringkat ke-${rank} dari ${totalDesa} desa`;
  return `${props.NAME_4} merupakan salah satu dari ${totalDesa} desa di Kecamatan Rasau Jaya yang dianalisis secara rinci hingga tingkat desa. ` +
    `Indeks kondisi lahan (weighted overlay lima kriteria: NDVI, tekstur tanah, ketersediaan air/NDWI, kemiringan lereng, dan aksesibilitas) ` +
    `desa ini bernilai ${skorTxt} dari skala 1–4 (${posisiTxt}), yaitu kondisi lahan ${(kondisiLabel[k] || '').toLowerCase()}; indeks ini bukan kelas kesesuaian komoditas. ` +
    `NDVI rata-rata ${ndviTxt} menunjukkan tutupan vegetasi yang rapat. Desa ini berada di dataran rendah pasang surut; peta gambut KLHK skala 1:250.000 ` +
    `menunjukkan ketebalan gambut umumnya < 40 cm. Estimasi luas wilayah desa berdasarkan batas administrasi adalah ±${luasKm2.toFixed(1)} km².`;
}
''' + s[j:]
# rekomendasi desa: dari faktor pembatas lima parameter + potensi padi sawah per desa (Tabel 6 naskah)
i = s.index('function generateDesaRekomendasi('); j = s.index('\n}\n', i) + 3
s = s[:i] + '''// Potensi lahan sesuai padi sawah (S1+S2) per desa, % area tercakup data — Tabel 6 naskah (grid 50 m)
const POTENSI_PADI_DESA = {
  'Bintang Mas':     { aktual: 48.3, a: 90.7, b: 90.7, prioritas: 'perbaikan tata air' },
  'Pematang Tujuh':  { aktual: 38.6, a: 89.8, b: 90.0, prioritas: 'perbaikan tata air' },
  'Rasau Jaya I':    { aktual: 17.9, a: 94.0, b: 96.2, prioritas: 'perbaikan tata air' },
  'Rasau Jaya II':   { aktual: 49.5, a: 73.3, b: 85.9, prioritas: 'perbaikan tata air dan pengapuran' },
  'Rasau Jaya III':  { aktual: 44.6, a: 89.1, b: 89.9, prioritas: 'perbaikan tata air' },
  'Rasau Jaya Umum': { aktual: 35.3, a: 90.6, b: 90.9, prioritas: 'perbaikan tata air' }
};
const SARAN_PEMBATAS = {
  banjir: 'Bahaya banjir (fh) — perbaiki tata air: saluran drainase, pintu air, dan tanggul.',
  ph: 'Kemasaman tanah (nr) — pengapuran dan pemupukan berimbang.',
  corg: 'C-organik rendah (nr) — tambahkan bahan organik.',
  gambut: 'Ketebalan gambut (rc) — pertahankan muka air tanah; hindari drainase berlebih.',
  lereng: 'Kemiringan lereng (eh) — terapkan teras atau pematang mengikuti kontur.'
};

function generateDesaRekomendasi(props, rank, totalDesa) {
  const rekom = [];
  const param = (typeof getParamLahanDesa === 'function' ? getParamLahanDesa(props.NAME_4) : null) || {};
  const pembatas = PARAM_LAHAN_DESA.filter(p => param[p.key] && ['S3', 'N'].includes(param[p.key].kelas));
  if (pembatas.length) {
    rekom.push('Faktor pembatas dominan untuk padi sawah: ' + pembatas.map(p => `${p.nama} (${p.kode}, kelas ${param[p.key].kelas})`).join(', ') + '.');
    pembatas.forEach(p => { if (SARAN_PEMBATAS[p.key]) rekom.push(SARAN_PEMBATAS[p.key]); });
  } else {
    rekom.push('Tidak ada parameter kualitas lahan berkelas dominan S3/N; pertahankan pengelolaan air dan hara yang berjalan.');
  }
  const pp = POTENSI_PADI_DESA[props.NAME_4];
  if (pp) {
    const f = v => v.toFixed(1).replace('.', ',');
    rekom.push(`Lahan sesuai padi sawah (S1+S2): ${f(pp.aktual)}% saat ini, ${f(pp.a)}% dengan perbaikan tata air, dan ${f(pp.b)}% bila disertai pengapuran — prioritas intervensi: ${pp.prioritas}.`);
  }
  rekom.push(`Indeks kondisi lahan desa ini peringkat ${rank} dari ${totalDesa}; verifikasi lapangan tetap diperlukan karena parameter berasal dari data spasial skala 1:250.000–250 m.`);
  return rekom;
}
''' + s[j:]
s = ganti(s, "document.getElementById('desaModalTagline').textContent = `Desa di Kecamatan Rasau Jaya — ${kelasLabel[k] || ''}`;",
          "document.getElementById('desaModalTagline').textContent = `Desa di Kecamatan Rasau Jaya — kondisi lahan ${(kondisiLabel[k] || '').toLowerCase()}`;")
s = ganti(s, "    { val: k, key: 'Kelas Kesesuaian' },\n    { val: desaProps.skor ? desaProps.skor.toFixed(2) : '-', key: 'Skor Weighted Overlay' },",
          "    { val: kondisiLabel[k] || '-', key: 'Kondisi Lahan' },\n    { val: desaProps.skor ? desaProps.skor.toFixed(2) : '-', key: 'Indeks Kondisi Lahan' },")
s = ganti(s, "{ val: `${rank} / ${totalDesa}`, key: 'Peringkat Skor Desa' }", "{ val: `${rank} / ${totalDesa}`, key: 'Peringkat Indeks Desa' }")
s = ganti(s, "    { key: 'Kelas Kesesuaian', val: `${k} — ${kelasLabel[k] || ''}` },\n    { key: 'Skor Weighted Overlay', val: `${desaProps.skor ? desaProps.skor.toFixed(2) : '-'} / 4,00` },",
          "    { key: 'Kondisi Lahan', val: `${kondisiLabel[k] || '-'} (indeks weighted overlay)` },\n    { key: 'Indeks Kondisi Lahan', val: `${desaProps.skor ? desaProps.skor.toFixed(2) : '-'} / 4,00` },")
s = ganti(s, "    { key: 'Topografi', val: 'Lahan Gambut Dangkal–Sedang' },", "    { key: 'Topografi', val: 'Dataran rendah pasang surut' },")
# E10: hanya padi sawah + peringkat desa
s = ganti(s, "  const allCrops = getDesaCropRanking(desaProps);\n  const count = getDesaCropCount(rank, totalDesa, allCrops.length);\n  const items = allCrops.slice(0, count);",
          "  // Model 9 kriteria desa memakai ambang padi sawah untuk kelima parameter, sehingga hanya sahih untuk padi sawah;\n"
          "  // ditampilkan peringkat desa untuk padi sawah, bukan peringkat komoditas di dalam desa.\n"
          "  const items = getDesaCropRanking(desaProps).filter(c => c.id === 'padi_sawah');\n"
          "  const padiSemua = (rasauJayaDesaData.features || []).map(f => ({ n: f.properties.NAME_4,\n"
          "    s: (getDesaCropRanking(f.properties).find(c => c.id === 'padi_sawah') || {}).sawScore || 0 })).sort((a, b) => b.s - a.s);\n"
          "  const rankPadi = padiSemua.findIndex(x => x.n === desaProps.NAME_4) + 1;")
i = s.index("  document.getElementById('desaModalNote').textContent =")
j = s.index('\n', s.index('`;', i)) + 1 if '`;' in s[i:i + 2000] else s.index('\n', i) + 1
s = s[:i] + ("  document.getElementById('desaModalNote').textContent =\n"
             "    `Skor SAW 9 kriteria untuk padi sawah: peringkat ${rankPadi} dari ${padiSemua.length} desa. Empat kriteria iklim dan tekstur memakai nilai "
             "Kecamatan Rasau Jaya yang sama untuk semua desa, sehingga perbedaan antardesa berasal dari lima parameter kualitas lahan ${desaProps.NAME_4} "
             "(pH Tanah, C-Organik, Ketebalan Gambut, Kemiringan Lereng, Bahaya Banjir). Karena kelima parameter dikelaskan dengan ambang padi sawah "
             "(Permentan 79/2013), model desa tidak dipakai untuk membandingkan komoditas lain.`;\n") + s[j:]
# chip peta mini kartu kecamatan
s = ganti(s, "chip.innerHTML = `<span class=\"kec-map-chip-kelas\" style=\"background:${kelasColor[k] || '#888'}\">${k}</span>${kelasLabel[k] || ''} · ${skor}`;",
          "chip.innerHTML = `<span class=\"kec-map-chip-kelas\" style=\"background:${kelasColor[k] || '#888'}\">${kondisiLabel[k] || ''}</span>Kondisi lahan · ${skor}`;")
# popup & legenda peta beranda
s = ganti(s, "<div style=\"font-size:12px;margin-bottom:3px\">Kelas: <b style=\"color:${kelasColor[k]}\">${k} — ${kelasLabel[k]}</b></div>\n"
             "                <div style=\"font-size:12px;margin-bottom:3px;color:#444\">Komoditas: ${p.komoditas}</div>",
          "<div style=\"font-size:12px;margin-bottom:3px\">Kondisi lahan: <b style=\"color:${kelasColor[k]}\">${kondisiLabel[k]}</b></div>\n"
          "                <div style=\"font-size:12px;margin-bottom:3px;color:#444\">Komoditas: ${((kecamatanData[nameToKecId[p.NAME_3]] || {}).commodities || []).slice(0, 3).map(c => c.name).join(', ')}</div>")
s = ganti(s, "<div style=\"font-size:12px;color:#444\">Skor Weighted Overlay: <b>${p.skor ? p.skor.toFixed(2) : '-'}</b></div>\n"
             "                <div style=\"font-size:10px;color:#2B8A50;margin-top:6px;font-weight:600\">Sumber: Sentinel-2 SR 2022–2024</div>",
          "<div style=\"font-size:12px;color:#444\">Indeks kondisi lahan (WO): <b>${p.skor ? p.skor.toFixed(2) : '-'}</b></div>\n"
          "                <div style=\"font-size:10px;color:#2B8A50;margin-top:6px;font-weight:600\">Sumber: Google Earth Engine 2022–2024</div>")
s = ganti(s, """            <div class="legend-title">Kesesuaian Lahan</div>
            <div class="legend-item"><span class="legend-dot" style="background:#1a6e3c"></span>S1 — Sangat Sesuai</div>
            <div class="legend-item"><span class="legend-dot" style="background:#5aac72"></span>S2 — Cukup Sesuai</div>
            <div class="legend-item"><span class="legend-dot" style="background:#e8c53a"></span>S3 — Sesuai Marginal</div>
            <div class="legend-item"><span class="legend-dot" style="background:#d94f3a"></span>N — Tidak Sesuai</div>""",
          """            <div class="legend-title">Indeks Kondisi Lahan</div>
            <div class="legend-item"><span class="legend-dot" style="background:#1a6e3c"></span>Tinggi (&gt; 3,5)</div>
            <div class="legend-item"><span class="legend-dot" style="background:#5aac72"></span>Sedang (2,5–3,5)</div>
            <div class="legend-item"><span class="legend-dot" style="background:#e8c53a"></span>Rendah (1,5–2,5)</div>
            <div class="legend-item"><span class="legend-dot" style="background:#d94f3a"></span>Sangat rendah (&lt; 1,5)</div>""")
# E4: tekstur tanah
s = s.replace("nama: 'Jenis Tanah'", "nama: 'Tekstur Tanah'").replace('<div class="st-iklim-label">Jenis Tanah</div>', '<div class="st-iklim-label">Tekstur Tanah</div>')
s = s.replace('Jenis Tanah 0,18', 'Tekstur Tanah 0,18')
open(os.path.join(ROOT, 'script.js'), 'w', encoding='utf-8', newline='').write(s.replace('\n', NL))
print('script.js diperbarui')

# ── index.html ───────────────────────────────────────────────────────────────
h, NLh = buka('index.html')
h = h.replace('\r\n', '\n')
h = h.replace('<span class="wr-name">Jenis Tanah', '<span class="wr-name">Tekstur Tanah').replace('<div class="src-param">Jenis Tanah</div>', '<div class="src-param">Tekstur Tanah</div>')
h = ganti(h, 'Jenis tanah dan elevasi diberi bobot dominan karena merupakan faktor fisik lahan yang bersifat permanen dan paling menentukan kelas kesesuaian di wilayah Kubu Raya.',
          'Tekstur tanah dan elevasi diberi bobot terbesar karena bersifat permanen. Namun, seluruh kecamatan berada di dataran rendah (elevasi median 3–9 m dpl) '
          'sehingga elevasi dan suhu hampir bernilai sama di semua kecamatan; perbedaan skor antarkecamatan praktis ditentukan oleh tekstur tanah dan curah hujan.')
h = ganti(h, 'Berbeda dengan SAW yang menghitung kesesuaian per-komoditas, metode ini menghasilkan <strong>satu skor kesesuaian lahan per kecamatan</strong> secara keseluruhan',
          'Berbeda dengan SAW yang menghitung kesesuaian per komoditas, metode ini menghasilkan <strong>satu indeks kondisi lahan aktual per kecamatan</strong> — bukan kelas kesesuaian komoditas')
h = ganti(h, 'Skor dihitung dari overlay tertimbang 5 lapisan raster Sentinel-2 SR &amp; turunannya melalui statistik zonal per poligon kecamatan di Google Earth Engine.',
          'Indeks dihitung dari overlay tertimbang lima kriteria — NDVI dan NDWI (Sentinel-2), tekstur tanah (OpenLandMap), kemiringan lereng (SRTM), dan aksesibilitas '
          '(waktu tempuh ke kota) — melalui statistik zonal per poligon kecamatan di Google Earth Engine.')
h = ganti(h, 'Skor akhir berskala 0–4, dipetakan ke kelas kesesuaian yang sama seperti SAW (S1/S2/S3/N). Seluruh 9 kecamatan Kubu Raya saat ini berada pada kelas <strong>S2 &mdash; Cukup Sesuai (skor 2,5–3,5)</strong>.',
          'Indeks berskala 1–4 dan dikelaskan sebagai kondisi lahan tinggi (&gt; 3,5), sedang (2,5–3,5), rendah (1,5–2,5), atau sangat rendah (&lt; 1,5). '
          'Seluruh 9 kecamatan Kubu Raya saat ini berada pada <strong>kondisi lahan sedang (3,20–3,40)</strong>.')
h = ganti(h, 'Weighted Overlay GIS — Skor Tingkat Wilayah', 'Weighted Overlay GIS — Indeks Kondisi Lahan Wilayah')
h = ganti(h, 'Skor Weighted Overlay dihitung berdasarkan 5 kriteria: NDVI (30%), Jenis Tanah (25%), Ketersediaan Air/NDWI (20%), Kemiringan Lereng/SRTM (15%), Aksesibilitas (10%). Kelas S2 (Cukup Sesuai, skor 2,5–3,5) mencakup seluruh 9 kecamatan Kubu Raya.',
          'Indeks kondisi lahan (weighted overlay) dihitung dari 5 kriteria: NDVI (30%), Tekstur Tanah (25%), Ketersediaan Air/NDWI (20%), Kemiringan Lereng/SRTM (15%), '
          'Aksesibilitas (10%); seluruh 9 kecamatan berkondisi lahan sedang. Kesesuaian komoditas dinilai dengan SAW terhadap syarat tumbuh.')
# lencana skala SAW: jangan memakai S1–N (tertukar dengan kelas kesesuaian lahan)
for a, b in [('<span class="kelas-badge">S1</span>\n              <span class="kelas-name">Sangat Cocok</span>', '<span class="kelas-badge">SC</span>\n              <span class="kelas-name">Sangat Cocok</span>'),
             ('<span class="kelas-badge">S2</span>\n              <span class="kelas-name">Cocok</span>', '<span class="kelas-badge">C</span>\n              <span class="kelas-name">Cocok</span>'),
             ('<span class="kelas-badge">S3</span>\n              <span class="kelas-name">Cukup Sesuai</span>', '<span class="kelas-badge">CS</span>\n              <span class="kelas-name">Cukup Sesuai</span>'),
             ('<span class="kelas-badge">N</span>\n              <span class="kelas-name">Kurang Sesuai</span>', '<span class="kelas-badge">KS</span>\n              <span class="kelas-name">Kurang Sesuai</span>')]:
    h = ganti(h, a, b)
h = ganti(h, 'Komoditas Pertanian Unggulan Desa\n', 'Kesesuaian Padi Sawah &amp; Peringkat Desa\n')
open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8', newline='').write(h.replace('\n', NLh))
print('index.html diperbarui')

# ── sebaran.js (A11): angka utama di dalam enam desa ─────────────────────────
g, NLg = buka('sebaran.js')
g = g.replace('\r\n', '\n')
g = ganti(g, """  const r = padiSawahData.ringkas;
  const total = KELAS.reduce((s, k) => s + r[k], 0);
  const potensi = r.S1 + r.S2;
  const kartu = [
    { label: 'Total area dianalisis', nilai: fmtHa(total), unit: 'ha', ket: 'Sebagian besar di Kec. Rasau Jaya', warna: null },""",
          """  // Angka utama dihitung di dalam enam desa Rasau Jaya (bukan seluruh cakupan data yang juga menyentuh kecamatan tetangga)
  const r = KELAS.reduce((o, k) => (o[k] = padiSawahData.desa.reduce((s, d) => s + d[k], 0), o), {});
  const total = KELAS.reduce((s, k) => s + r[k], 0);
  const semua = KELAS.reduce((s, k) => s + padiSawahData.ringkas[k], 0);
  const potensi = r.S1 + r.S2;
  const kartu = [
    { label: 'Area dianalisis (6 desa)', nilai: fmtHa(total), unit: 'ha', ket: `Dari ${fmtHa(semua)} ha cakupan data; sisanya di luar batas desa`, warna: null },""")
open(os.path.join(ROOT, 'sebaran.js'), 'w', encoding='utf-8', newline='').write(g.replace('\n', NLg))
print('sebaran.js diperbarui')
