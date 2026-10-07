/* ============================================================
   TapakTani — Halaman Sebaran Potensi Padi Sawah (Rasau Jaya)
   Data: data/padi_sawah.js (padiSawahData), data/rasau_jaya_desa.js
   ============================================================ */

const KELAS = ['S1', 'S2', 'S3', 'N'];
const KELAS_WARNA = { S1: '#1a6e3c', S2: '#5aac72', S3: '#e8c53a', N: '#d94f3a' };
const KELAS_LABEL = { S1: 'Sangat Sesuai', S2: 'Cukup Sesuai', S3: 'Sesuai Marginal', N: 'Tidak Sesuai' };
// Gradasi heatmap: konsentrasi lahan sesuai rendah (kuning) → tinggi (merah tua)
const HEAT_GRADIENT = { 0.25: '#fde68a', 0.5: '#fbbf24', 0.7: '#f97316', 0.88: '#dc2626', 1.0: '#7f1d1d' };

const fmtHa = v => v.toLocaleString('id-ID', { maximumFractionDigits: 0 });
const fmtPct = v => v.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

let peta, lapisHeat, lapisKelas, lapisDesa;
const lapisDesaPerNama = {};

// ── Peta dasar Esri (tanpa API key), sama dengan halaman utama ──
function esriLayer(service, attribution) {
  return L.tileLayer(`https://server.arcgisonline.com/ArcGIS/rest/services/${service}/MapServer/tile/{z}/{y}/{x}`, {
    attribution: attribution || 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, Maxar, Earthstar Geographics, &copy; OpenStreetMap contributors',
    maxZoom: 18
  });
}

function initPeta() {
  peta = L.map('sebaranMap', { zoomControl: true, scrollWheelZoom: false });
  const satelit = L.layerGroup([esriLayer('World_Imagery'), esriLayer('Reference/World_Boundaries_and_Places')]).addTo(peta);
  const jalan = esriLayer('World_Street_Map');
  L.control.layers({ 'Citra Satelit': satelit, 'Peta Jalan': jalan }, null, { position: 'topright' }).addTo(peta);
  L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(peta);

  // Heatmap: intensitas dikuadratkan agar S1/S2 menonjol dan S3 hanya sebagai latar tipis.
  // Bila plugin Leaflet.heat gagal dimuat, halaman tetap jalan dengan mode Kelas Kesesuaian.
  if (typeof L.heatLayer === 'function') {
    const titik = padiSawahData.heat.map(([lat, lng, v]) => [lat, lng, v * v]);
    // max > 1 karena titik grid saling bertumpuk; nilai 3 menjaga gradasi S2 vs S1 tetap terbaca
    lapisHeat = L.heatLayer(titik, { radius: 14, blur: 18, maxZoom: 13, max: 3, minOpacity: 0.15, gradient: HEAT_GRADIENT });
  }

  lapisKelas = L.geoJSON(padiSawahData.kelas, {
    style: f => ({ color: KELAS_WARNA[f.properties.kelas], weight: 0.6, fillColor: KELAS_WARNA[f.properties.kelas], fillOpacity: 0.62 }),
    onEachFeature: (f, layer) => {
      const k = f.properties.kelas;
      layer.bindTooltip(`<strong>${k} — ${KELAS_LABEL[k]}</strong><br>Total ${fmtHa(padiSawahData.ringkas[k])} ha`, { sticky: true });
    }
  });

  lapisDesa = L.geoJSON(rasauJayaDesaData, {
    style: { color: '#ffffff', weight: 1.6, opacity: 0.9, fill: false, dashArray: '5 4' },
    onEachFeature: (f, layer) => {
      lapisDesaPerNama[f.properties.NAME_4] = layer;
      layer.bindTooltip(f.properties.NAME_4, { permanent: true, direction: 'center', className: 'sb-desa-label' });
    }
  }).addTo(peta);

  peta.fitBounds(lapisKelas.getBounds(), { padding: [12, 12] });
  setMode('heat');
}

function setMode(mode) {
  if (mode === 'heat' && !lapisHeat) mode = 'kelas';
  if (mode === 'heat') { peta.removeLayer(lapisKelas); lapisHeat.addTo(peta); }
  else { if (lapisHeat) peta.removeLayer(lapisHeat); lapisKelas.addTo(peta); }
  if (peta.hasLayer(lapisDesa)) lapisDesa.bringToFront();
  document.querySelectorAll('.sb-seg-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  renderLegenda(mode);
}

function renderLegenda(mode) {
  const el = document.getElementById('sbLegend');
  if (mode === 'heat') {
    // Urutkan numerik: kunci "1.0" disimpan JS sebagai "1" dan akan berada di urutan pertama
    const stops = Object.entries(HEAT_GRADIENT).sort((a, b) => a[0] - b[0]).map(([p, c]) => `${c} ${p * 100}%`).join(', ');
    el.innerHTML = `
      <div class="sb-legend-title">Konsentrasi lahan sesuai padi</div>
      <div class="sb-legend-ramp" style="background:linear-gradient(90deg, rgba(253,230,138,0) 0%, ${stops})"></div>
      <div class="sb-legend-scale"><span>Rendah</span><span>Tinggi</span></div>`;
  } else {
    el.innerHTML = `<div class="sb-legend-title">Kelas kesesuaian padi sawah</div>` +
      KELAS.map(k => `<div class="sb-legend-item"><span class="sb-legend-sw" style="background:${KELAS_WARNA[k]}"></span>${k} — ${KELAS_LABEL[k]}</div>`).join('');
  }
}

function renderStatistik() {
  const r = padiSawahData.ringkas;
  const total = KELAS.reduce((s, k) => s + r[k], 0);
  const potensi = r.S1 + r.S2;
  const kartu = [
    { label: 'Total area dianalisis', nilai: fmtHa(total), unit: 'ha', ket: 'Sebagian besar di Kec. Rasau Jaya', warna: null },
    { label: 'Lahan berpotensi (S1 + S2)', nilai: fmtHa(potensi), unit: 'ha', ket: `${fmtPct(potensi / total * 100)}% dari area`, warna: 'var(--accent)', utama: true },
    ...KELAS.map(k => ({ label: `${k} — ${KELAS_LABEL[k]}`, nilai: fmtHa(r[k]), unit: 'ha', ket: `${fmtPct(r[k] / total * 100)}% dari area`, warna: KELAS_WARNA[k] }))
  ];
  document.getElementById('sbStats').innerHTML = kartu.map(c => `
    <div class="sb-stat${c.utama ? ' sb-stat--utama' : ''}">
      ${c.warna && !c.utama ? `<span class="sb-stat-sw" style="background:${c.warna}"></span>` : ''}
      <div class="sb-stat-label">${c.label}</div>
      <div class="sb-stat-val">${c.nilai}<span>${c.unit}</span></div>
      <div class="sb-stat-ket">${c.ket}</div>
    </div>`).join('');
}

function renderTabelDesa() {
  const baris = padiSawahData.desa.map(d => {
    const dianalisis = KELAS.reduce((s, k) => s + d[k], 0);
    const potensi = d.S1 + d.S2;
    return { ...d, dianalisis, potensi, pct: dianalisis ? potensi / dianalisis * 100 : 0, cakupan: dianalisis / d.luas_desa_ha * 100 };
  }).sort((a, b) => b.pct - a.pct);

  document.querySelector('#sbTable tbody').innerHTML = baris.map(d => `
    <tr data-desa="${d.desa}" tabindex="0" role="button" aria-label="Perbesar peta ke Desa ${d.desa}">
      <td class="sb-td-desa">${d.desa}${d.cakupan < 90 ? `<small>Data mencakup ${fmtPct(d.cakupan)}% wilayah desa</small>` : ''}</td>
      <td class="num">${fmtHa(d.S1)}</td>
      <td class="num">${fmtHa(d.S2)}</td>
      <td class="num">${fmtHa(d.S3)}</td>
      <td class="num">${fmtHa(d.N)}</td>
      <td>
        <div class="sb-bar"><div class="sb-bar-fill" style="width:${d.pct}%"></div></div>
        <div class="sb-bar-txt"><strong>${fmtPct(d.pct)}%</strong> · ${fmtHa(d.potensi)} ha</div>
      </td>
    </tr>`).join('');

  document.querySelectorAll('#sbTable tbody tr').forEach(tr => {
    const fokus = () => {
      const layer = lapisDesaPerNama[tr.dataset.desa];
      if (!layer) return;
      document.querySelector('.sb-map-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
      peta.fitBounds(layer.getBounds(), { padding: [30, 30] });
    };
    tr.addEventListener('click', fokus);
    tr.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fokus(); } });
  });

  const luar = padiSawahData.luarDesa;
  const luarTotal = KELAS.reduce((s, k) => s + luar[k], 0);
  document.getElementById('sbLuarDesa').textContent =
    `Sekitar ${fmtHa(luarTotal)} ha area data berada di luar batas keenam desa (tepi Kecamatan Sungai Raya, Sungai Kakap, dan Kubu), ` +
    `termasuk ${fmtHa(luar.S1 + luar.S2)} ha lahan berpotensi. Area ini ikut digambar di peta tetapi tidak masuk tabel desa.`;
}

function initKontrol() {
  document.querySelectorAll('.sb-seg-btn').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  document.getElementById('sbToggleDesa').addEventListener('change', e => {
    if (e.target.checked) lapisDesa.addTo(peta); else peta.removeLayer(lapisDesa);
  });
}

function initHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  const tutup = () => {
    menu.classList.remove('open'); btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
  };
  btn.addEventListener('click', () => {
    const buka = menu.classList.toggle('open');
    btn.classList.toggle('open', buka);
    btn.setAttribute('aria-expanded', buka);
    document.body.style.overflow = buka ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', tutup));
}

document.addEventListener('DOMContentLoaded', () => {
  initHamburger();
  if (typeof padiSawahData === 'undefined' || typeof L === 'undefined') {
    document.getElementById('sebaranMap').innerHTML = '<p class="sb-error">Data peta gagal dimuat. Muat ulang halaman.</p>';
    return;
  }
  renderStatistik();
  initPeta();
  renderTabelDesa();
  initKontrol();
});
