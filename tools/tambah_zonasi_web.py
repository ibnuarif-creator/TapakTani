"""Tambahkan gaya (style.css) dan logika peta/kartu zonasi (script.js) — sekali jalan, aman diulang."""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CSS = '''
/* ============================================================
   ZONASI AGROEKOLOGI — peta 4 zona + kartu unggulan
   ============================================================ */
.zonasi-section { background: var(--bg-alt); padding: 5rem 0; }
.zonasi-grid { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); gap: 1.5rem; margin-top: 2rem; align-items: start; }
.zonasi-map-wrap { position: relative; background: var(--surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); overflow: hidden; border: 1px solid var(--border); }
#zonasiMap { height: 520px; width: 100%; }
.zonasi-legend { display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; padding: 0.85rem 1rem; border-top: 1px solid var(--border); font-size: 0.8rem; color: var(--text-2); }
.zonasi-legend span { display: inline-flex; align-items: center; gap: 0.4rem; cursor: pointer; }
.zonasi-legend i { width: 14px; height: 14px; border-radius: 4px; display: inline-block; border: 1px solid rgba(0,0,0,0.15); }
.zonasi-cards { display: grid; gap: 0.85rem; }
.zona-card { background: var(--surface); border: 1px solid var(--border); border-left: 5px solid var(--zc, var(--accent)); border-radius: var(--radius); padding: 0.95rem 1.1rem; box-shadow: var(--shadow-sm); cursor: pointer; transition: transform 0.25s var(--silk), box-shadow 0.25s var(--silk); }
.zona-card:hover, .zona-card.aktif { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.zona-card.aktif { outline: 2px solid var(--zc); outline-offset: 1px; }
.zona-card h3 { font-family: var(--font-display); font-size: 1rem; color: var(--text-1); margin: 0 0 0.15rem; }
.zona-card .zona-kec { font-size: 0.82rem; color: var(--text-2); font-weight: 600; margin-bottom: 0.35rem; }
.zona-card .zona-ciri { font-size: 0.76rem; color: var(--text-3); margin-bottom: 0.55rem; line-height: 1.5; }
.zona-row { font-size: 0.8rem; color: var(--text-2); line-height: 1.55; margin-top: 0.3rem; }
.zona-row b { color: var(--text-1); }
.zona-chip { display: inline-block; font-size: 0.72rem; padding: 2px 8px; border-radius: 999px; margin: 2px 3px 2px 0; background: var(--accent-ghost); color: var(--accent); border: 1px solid var(--accent-border); }
.zona-chip.potensial { background: var(--gold-ghost); color: #92400E; border-color: rgba(217,119,6,0.25); }
.zona-chip small { opacity: 0.75; }
.zonasi-note { font-size: 0.78rem; color: var(--text-3); margin-top: 1.25rem; line-height: 1.6; }
.zonasi-tip { font-family: var(--font-sans); font-size: 12px; line-height: 1.5; }
@media (max-width: 900px) {
  .zonasi-grid { grid-template-columns: 1fr; }
  #zonasiMap { height: 380px; }
}
@media (max-width: 480px) {
  .zonasi-section { padding: 3.5rem 0; }
  #zonasiMap { height: 320px; }
}
'''

JS = r'''// ============================================================
// ZONASI AGROEKOLOGI — peta 4 zona (klaster Ward) + kartu unggulan aktual/potensial
// ============================================================
function initZonasi() {
  const el = document.getElementById('zonasiMap');
  if (!el || typeof zonasiAgroekologi === 'undefined' || typeof kesesuaianLahanData === 'undefined' || typeof L === 'undefined') return;
  const Z = zonasiAgroekologi;
  const zonaDari = {};
  Z.zona.forEach(z => z.kecamatan.forEach(k => { zonaDari[k] = z; }));
  const namaKec = n => n === "Telok Pa'Kedai" ? 'Teluk Pakedai' : n;
  const fmt = v => v.toFixed(2).replace('.', ',');

  const chip = (x, kelas) => `<span class="zona-chip ${kelas}">${x.komoditas}` +
    (x.kecamatan && x.kecamatan.length < 3 ? ` <small>(${x.kecamatan.join(', ')})</small>` : '') +
    (x.tanpaData ? ' <small>†</small>' : '') + '</span>';
  document.getElementById('zonasiCards').innerHTML = Z.zona.map(z => `
    <div class="zona-card" data-zona="${z.zona}" style="--zc:${z.warna}">
      <h3>Zona ${z.zona} — ${z.judul}</h3>
      <div class="zona-kec">${z.kecamatan.join(' · ')}</div>
      <div class="zona-ciri">${z.ciri}</div>
      <div class="zona-row"><b>Kesesuaian tertinggi:</b> ${z.teratas.map(t => `${t.komoditas} (${fmt(t.skor)})`).join(', ')}</div>
      <div class="zona-row"><b>Unggulan aktual:</b><br>${z.aktual.length ? z.aktual.map(a => chip(a, '')).join('') : '–'}</div>
      <div class="zona-row"><b>Unggulan potensial:</b><br>${z.potensial.length ? z.potensial.map(p => chip(p, 'potensial')).join('') : '–'}</div>
    </div>`).join('');
  document.getElementById('zonasiLegend').innerHTML = Z.zona.map(z =>
    `<span data-zona="${z.zona}"><i style="background:${z.warna}"></i>Zona ${z.zona}</span>`).join('');
  document.getElementById('zonasiNote').innerHTML =
    `Unggulan aktual: skor SAW rata-rata zona ≥ ${fmt(Z.meta.ambang)} dan LQ produksi hortikultura/perkebunan BPS 2024 > 1 pada sedikitnya satu kecamatan. ` +
    `Unggulan potensial: sangat sesuai tetapi belum menjadi basis produksi (LQ ≤ 1); † data produksi per kecamatan tidak tersedia. ` +
    `Klaster Ward: silhouette ${fmt(Z.meta.silhouette)}, korelasi kofenetik ${fmt(Z.meta.kofenetik)}. ` +
    `Zonasi bersifat kesesuaian biofisik dan berlaku di luar kawasan hutan, ekosistem gambut berfungsi lindung, dan mangrove.`;

  let map = null, lapisan = null;
  const pilih = zn => {
    document.querySelectorAll('.zona-card').forEach(c => c.classList.toggle('aktif', c.dataset.zona === zn));
    if (!lapisan) return;
    const terpilih = [];
    lapisan.eachLayer(l => {
      const z = zonaDari[namaKec(l.feature.properties.NAME_3)];
      const cocok = !zn || (z && z.zona === zn);
      l.setStyle({ fillOpacity: cocok ? 0.72 : 0.18, weight: cocok ? 2 : 1 });
      if (cocok) terpilih.push(l);
    });
    map.fitBounds(L.featureGroup(terpilih.length ? terpilih : [lapisan]).getBounds(), { padding: [20, 20], maxZoom: 11 });
  };
  // Peta dibuat saat bagian mendekati layar (hemat kuota tile)
  const buatPeta = () => {
    map = L.map(el, { scrollWheelZoom: false, zoomControl: true });
    addBasemap(map);
    lapisan = L.geoJSON(kesesuaianLahanData, {
      style: f => {
        const z = zonaDari[namaKec(f.properties.NAME_3)];
        return { color: '#ffffff', weight: 1.5, fillColor: z ? z.warna : '#999999', fillOpacity: 0.62 };
      },
      onEachFeature: (f, layer) => {
        const n = namaKec(f.properties.NAME_3), z = zonaDari[n];
        layer.bindTooltip(`<div class="zonasi-tip"><b>${n}</b><br>Zona ${z ? z.zona : '-'} · skor WO ${fmt(f.properties.skor || 0)}</div>`, { sticky: true });
        layer.on('click', () => pilih(z ? z.zona : null));
      }
    }).addTo(map);
    map.fitBounds(lapisan.getBounds(), { padding: [12, 12] });
  };
  document.querySelectorAll('.zona-card, .zonasi-legend span').forEach(c =>
    c.addEventListener('click', () => {
      const aktif = document.querySelector(`.zona-card.aktif[data-zona="${c.dataset.zona}"]`);
      pilih(aktif ? null : c.dataset.zona);
    }));
  if (!('IntersectionObserver' in window)) { buatPeta(); return; }
  const obs = new IntersectionObserver(es => {
    if (es.some(e => e.isIntersecting)) { buatPeta(); obs.disconnect(); }
  }, { rootMargin: '200px' });
  obs.observe(el);
}

'''

p = os.path.join(ROOT, 'style.css')
s = open(p, encoding='utf-8', newline='').read()
if 'ZONASI AGROEKOLOGI' not in s:
    nl = '\r\n' if '\r\n' in s else '\n'
    open(p, 'w', encoding='utf-8', newline='').write(s.rstrip() + nl + CSS.replace('\n', nl))
    print('style.css: gaya zonasi ditambahkan')

p = os.path.join(ROOT, 'script.js')
s = open(p, encoding='utf-8', newline='').read()
if 'function initZonasi' not in s:
    nl = '\r\n' if '\r\n' in s else '\n'
    jangkar = '// ============================================================' + nl + '// METODOLOGI — Animate weight bars on scroll'
    assert s.count(jangkar) == 1
    s = s.replace(jangkar, JS.replace('\n', nl) + jangkar)
    lama = '  initKomparasi();' + nl + '  initMetodologiWeights();'
    assert s.count(lama) == 1
    s = s.replace(lama, '  initKomparasi();' + nl + '  initZonasi();' + nl + '  initMetodologiWeights();')
    open(p, 'w', encoding='utf-8', newline='').write(s)
    print('script.js: initZonasi ditambahkan')
