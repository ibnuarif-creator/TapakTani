"""
Perbaikan isi website sebelum hosting (Okt 2026):
  - statistik kecamatan & kabupaten dari BPS Kubu Raya Dalam Angka 2025 (luas, desa, penduduk, ibu kota)
  - gelar & susunan tim peneliti di footer
  - teks sumber data parameter lahan (sumber data terbuka)
  - catatan versi data & batasan penggunaan, favicon, meta Open Graph
Jalankan: python tools/perbaikan_hosting.py
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
baca = lambda f: open(os.path.join(ROOT, f), encoding='utf-8', newline='').read()
tulis = lambda f, s: open(os.path.join(ROOT, f), 'w', encoding='utf-8', newline='').write(s)


def ganti(s, lama, baru, n=1):
    if lama not in s and baru in s:
        return s                                   # sudah diterapkan sebelumnya
    assert s.count(lama) == n, (s.count(lama), lama[:80])
    return s.replace(lama, baru)


# ── BPS Kabupaten Kubu Raya Dalam Angka 2025: Tabel 1.1.1 (luas, ibu kota), 2.1.1 (desa 2024), 3.1.1 (penduduk 2024) ──
BPS = {'sungai-raya': ('1.190', 22, '251,7 rb', 'Sungai Raya'), 'sungai-kakap': ('587', 15, '131,2 rb', 'Sungai Kakap'),
       'rasau-jaya': ('209', 6, '33,1 rb', 'Rasau Jaya'), 'sungai-ambawang': ('1.181', 15, '89,8 rb', 'Ambawang Kuala'),
       'kubu': ('1.562', 20, '43,9 rb', 'Kubu'), 'batu-ampar': ('2.431', 15, '36,5 rb', 'Padang Tikar'),
       'teluk-pakedai': ('409', 14, '20,7 rb', 'Teluk Pakedai'), 'terentang': ('677', 10, '14,5 rb', 'Terentang'),
       'kuala-mandor': ('320', 6, '28,5 rb', 'Kuala Mandor')}

s = baca('script.js')
NL = '\r\n' if '\r\n' in s else '\n'
for kid, (luas, desa, pdd, ibu) in BPS.items():
    a = s.index(f"  '{kid}': {{"); b = s.index('\n  }', a)
    blok = s[a:b]
    baru = (f"stats: [{NL}      {{ val: '{luas} km²', key: 'Luas Wilayah' }}, {{ val: '{desa} Desa', key: 'Jumlah Desa' }},{NL}"
            f"      {{ val: '{pdd}', key: 'Penduduk 2024' }}, {{ val: '{ibu}', key: 'Ibu Kota' }}{NL}    ]")
    blok2 = re.sub(r"stats: \[.*?\n    \]", lambda m: baru, blok, count=1, flags=re.S)
    assert blok2 != blok or 'Penduduk 2024' in blok, kid
    s = s[:a] + blok2 + s[b:]

# teks sumber parameter lahan desa
s = ganti(s, '// 5 parameter kualitas lahan per desa dari data spasial parameter lahan',
          '// 5 parameter kualitas lahan per desa: OpenLandMap (pH, C-organik), KLHK (gambut), SRTM (lereng), InaRISK (banjir)')
s = ganti(s, '// Skor kelas 1–4 → r 0–1', '// Skor kelas 1–4 → r 0–1')
s = ganti(s, '// Faktor pembatas dari parameter lahan desa', '// Faktor pembatas dari parameter kualitas lahan desa')
s = ganti(s, ' Data parameter lahan desa mencakup ±', ' Data parameter kualitas lahan mencakup ±')
s = ganti(s, 'dari data spasial parameter lahan (rata-rata skor tertimbang luas; r = (skor &minus; 1) / 3).',
          '(pH dan C-organik OpenLandMap, ketebalan gambut KLHK, lereng SRTM, bahaya banjir InaRISK; dikelaskan dengan ambang padi sawah Permentan 79/2013; '
          'rata-rata skor tertimbang luas; r = (skor &minus; 1) / 3).')
s = ganti(s, 'dari data spasial parameter lahan (pH Tanah, C-Organik, Ketebalan Gambut, Kemiringan Lereng, Bahaya Banjir).',
          '(pH Tanah, C-Organik, Ketebalan Gambut, Kemiringan Lereng, Bahaya Banjir) dari data spasial OpenLandMap, KLHK, SRTM, dan InaRISK.')
s = s.replace("console.warn('kesesuaianLahanData tidak ditemukan — pastikan data/kesesuaian_lahan.js dimuat.');",
              "console.warn('kesesuaianLahanData tidak ditemukan — pastikan data/kesesuaian_data_v2.js dimuat.');")
s = s.replace('// kesesuaianLahanData dimuat dari data/kesesuaian_lahan.js', '// kesesuaianLahanData dimuat dari data/kesesuaian_data_v2.js')
tulis('script.js', s)
print('script.js: statistik BPS 2025 & teks sumber data diperbarui')

# ── index.html ──
h = baca('index.html'); crlf_h = chr(13) + chr(10) in h; h = h.replace(chr(13) + chr(10), chr(10)); NL = chr(10)
h = ganti(h, '<div class="hero-meta-item"><strong>6.985 km²</strong>Luas Wilayah</div>', '<div class="hero-meta-item"><strong>8.568 km²</strong>Luas Wilayah</div>')
h = ganti(h, '<div class="hero-meta-item"><strong>657 Rb</strong>Penduduk</div>', '<div class="hero-meta-item"><strong>650 Rb</strong>Penduduk</div>')
h = ganti(h, 'data-target="6985"', 'data-target="8568"')
h = ganti(h, 'Total area daratan &amp; perairan', 'Luas daerah (BPS, 2025)')
h = ganti(h, 'data-target="657"', 'data-target="650"')
h = ganti(h, 'Estimasi total populasi aktif', 'Penduduk 2024 (BPS, 2025)')
h = ganti(h, 'dari data spasial parameter lahan: pH tanah, C-organik, ketebalan gambut, kemiringan lereng, dan bahaya banjir.',
          'dari data spasial publik: pH tanah dan C-organik (OpenLandMap), ketebalan gambut (KLHK), kemiringan lereng (SRTM), dan bahaya banjir '
          '(indeks InaRISK), yang dikelaskan dengan ambang kesesuaian padi sawah Permentan No. 79/2013.')
h = ganti(h, '''          <span class="footer-team-item">Ibnu Arif, S.Kom., M.Cs. <em>(Ketua)</em></span>
          <span class="footer-team-sep">·</span>
          <span class="footer-team-item">Safriadi, S.T., M.T. <em>(Anggota)</em></span>'''.replace('\n', NL),
          '''          <span class="footer-team-item">Ibnu Arif, S.Kom., M.Kom. <em>(Ketua)</em></span>
          <span class="footer-team-sep">·</span>
          <span class="footer-team-item">Safriadi, S.P., M.P. <em>(Anggota)</em></span>
          <span class="footer-team-sep">·</span>
          <span class="footer-team-item">Ir. Boy Rangga, S.T., M.Ling., IPM <em>(Anggota)</em></span>'''.replace('\n', NL))
h = ganti(h, '<p class="footer-copy">',
          '<p class="footer-method"><strong>Versi data:</strong> Oktober 2026 (data iklim, tanah, dan citra 2022–2024; statistik BPS 2025). '
          'Zonasi dan rekomendasi komoditas bersifat kesesuaian biofisik untuk perencanaan, bukan penetapan tata ruang, dan berlaku di luar '
          'kawasan hutan, ekosistem gambut berfungsi lindung, dan mangrove.</p>' + NL + '        <p class="footer-copy">')
if 'rel="icon"' not in h:
    meta = (NL + '  <link rel="icon" type="image/png" sizes="32x32" href="gambar/favicon-32.png" />'
            + NL + '  <link rel="apple-touch-icon" href="gambar/apple-touch-icon.png" />'
            + NL + '  <meta name="theme-color" content="#1E6B3C" />'
            + NL + '  <meta property="og:type" content="website" />'
            + NL + '  <meta property="og:title" content="AgroRaya – SIG Pertanian Kabupaten Kubu Raya" />'
            + NL + '  <meta property="og:description" content="Kesesuaian lahan, zonasi agroekologi, dan komoditas unggulan 9 kecamatan Kabupaten Kubu Raya, Kalimantan Barat." />'
            + NL + '  <meta property="og:image" content="gambar/og-agroraya.jpg" />'
            + NL + '  <meta name="twitter:card" content="summary_large_image" />')
    h = re.sub(r'(<meta name="description"[^>]*/>)', lambda m: m.group(1) + meta, h, count=1)
tulis('index.html', h.replace(chr(10), chr(13) + chr(10)) if crlf_h else h)
print('index.html: statistik, tim peneliti, sumber data, versi data, favicon, meta OG diperbarui')

# ── sebaran.html ──
g = baca('sebaran.html'); crlf_g = chr(13) + chr(10) in g; g = g.replace(chr(13) + chr(10), chr(10))
g = ganti(g, 'berdasarkan klasifikasi kesesuaian lahan dari data spasial parameter lahan.',
          'berdasarkan klasifikasi kesesuaian lahan padi sawah yang disusun dengan hukum minimum dari tujuh parameter lahan.')
g = ganti(g, '(<em>Kesesuaian_Lahan_Padi_Sawah</em>) dari data spasial parameter lahan, dengan kelas',
          '(<em>Kesesuaian_Lahan_Padi_Sawah</em>) hasil hukum minimum tujuh parameter — pH dan C-organik (OpenLandMap), ketebalan gambut (KLHK), '
          'lereng (SRTM), bahaya banjir (InaRISK), temperatur (ERA5-Land), dan tekstur tanah — dengan ambang Permentan No. 79/2013, dengan kelas')
if 'rel="icon"' not in g:
    g = re.sub(r'(<meta name="description"[^>]*/>)', lambda m: m.group(1) + NL + '  <link rel="icon" type="image/png" sizes="32x32" href="gambar/favicon-32.png" />'
               + NL + '  <link rel="apple-touch-icon" href="gambar/apple-touch-icon.png" />' + NL + '  <meta name="theme-color" content="#1E6B3C" />', g, count=1)
tulis('sebaran.html', g.replace(chr(10), chr(13) + chr(10)) if crlf_g else g)
print('sebaran.html: sumber data & favicon diperbarui')
