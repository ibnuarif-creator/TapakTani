"""
Gambar non-screenshot untuk paper JEPIN AgroRaya.
Output: ../Paper/Gambar/*.png (300 dpi, Times New Roman, aman dicetak hitam-putih)

  Gambar_1_Alur_Penelitian.png
  Gambar_3_Arsitektur_Sistem.png
  Gambar_2_Model_Keputusan.png
  Gambar_10_Potensi_Padi_per_Desa.png

Jalankan: python tools/gambar_paper.py   (butuh matplotlib)
"""
import json, os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, '..', 'Paper', 'Gambar')
os.makedirs(OUT, exist_ok=True)

plt.rcParams.update({'font.family': 'Times New Roman', 'font.size': 9, 'savefig.dpi': 300})
HIJAU, HIJAU_MUDA, ABU, TEKS = '#1E6B3C', '#E4EFE9', '#F5F5F5', '#0D1F16'
EMAS = '#B45309'


def kotak(ax, x, y, w, h, teks, warna=HIJAU_MUDA, tepi=HIJAU, tebal=False, ukuran=8.5, gaya='round,pad=0.02,rounding_size=0.08'):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle=gaya, fc=warna, ec=tepi, lw=1.0))
    ax.text(x + w / 2, y + h / 2, teks, ha='center', va='center', fontsize=ukuran, color=TEKS,
            fontweight='bold' if tebal else 'normal', linespacing=1.25, wrap=True)


def panah(ax, x1, y1, x2, y2, gaya='-|>', warna=TEKS, garis='-', rad=0.0):
    ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle=gaya, mutation_scale=9, color=warna,
                                 lw=0.9, linestyle=garis, connectionstyle=f'arc3,rad={rad}'))


def simpan(fig, nama):
    p = os.path.join(OUT, nama)
    fig.savefig(p, bbox_inches='tight', pad_inches=0.04, facecolor='white')
    plt.close(fig)
    print('ditulis:', p)


# ── Gambar 1: Alur penelitian dan iterasi prototyping (satu kolom) ──────────
def gambar_alur():
    fig, ax = plt.subplots(figsize=(3.4, 4.6))
    ax.set_xlim(0, 10); ax.set_ylim(0, 14); ax.axis('off')
    tahap = [
        (12.4, 'Identifikasi masalah & kebutuhan\n(Dinas Pertanian, peneliti, penyuluh)'),
        (10.6, 'Pengumpulan & pengolahan data\n(GEE, QGIS, data konsultan, Python)'),
    ]
    for y, t in tahap:
        kotak(ax, 1.0, y, 8.0, 1.3, t)
    panah(ax, 5, 12.4, 5, 11.9)
    panah(ax, 5, 10.6, 5, 10.05)

    # Siklus prototyping
    ax.add_patch(FancyBboxPatch((0.4, 3.35), 9.2, 6.65, boxstyle='round,pad=0.02,rounding_size=0.15',
                                fc='white', ec=HIJAU, lw=1.0, ls=(0, (4, 2))))
    ax.text(5, 9.6, 'Siklus prototyping (Pressman & Maxim)', ha='center', fontsize=8.5, fontweight='bold', color=HIJAU)
    siklus = [(1.0, 7.9, 'Komunikasi'), (5.4, 7.9, 'Perencanaan\ncepat'),
              (5.4, 6.05, 'Pemodelan\ndesain cepat'), (1.0, 6.05, 'Konstruksi\nprototipe')]
    for x, y, t in siklus:
        kotak(ax, x, y, 3.6, 1.35, t, warna=ABU, tepi='#888888', ukuran=8)
    panah(ax, 4.6, 8.57, 5.4, 8.57)
    panah(ax, 7.2, 7.9, 7.2, 7.4)
    panah(ax, 5.4, 6.72, 4.6, 6.72)
    panah(ax, 2.8, 7.4, 2.8, 7.9, warna=EMAS)
    ax.text(0.85, 7.65, 'umpan\nbalik', fontsize=7, color=EMAS, ha='right', va='center', style='italic')
    ax.text(5, 4.65, 'Iterasi 1: peta & profil 9 kecamatan\nIterasi 2: SAW syarat tumbuh, metodologi, komparasi\n'
                     'Iterasi 3: rincian desa Rasau Jaya\nIterasi 4: SAW 9 kriteria & kelas Juknis\n'
                     'Iterasi 5: peta citra satelit & halaman Sebaran',
            ha='center', va='center', fontsize=7.2, color=TEKS, linespacing=1.35)

    panah(ax, 5, 3.35, 5, 2.95)
    kotak(ax, 1.0, 1.65, 8.0, 1.3, 'Verifikasi perhitungan &\npengujian kegunaan (SUS)')
    panah(ax, 5, 1.65, 5, 1.1)
    kotak(ax, 1.0, 0.0, 8.0, 1.1, 'Evaluasi & pelaporan', warna=HIJAU, tepi=HIJAU)
    ax.texts[-1].set_color('white'); ax.texts[-1].set_fontweight('bold')
    simpan(fig, 'Gambar_1_Alur_Penelitian.png')


# ── Gambar 2: Arsitektur sistem (dua kolom) ─────────────────────────────────
def gambar_arsitektur():
    fig, ax = plt.subplots(figsize=(7.0, 3.8))
    ax.set_xlim(0, 20); ax.set_ylim(0, 10); ax.axis('off')

    def lapis(y, h, judul, isi, warna):
        ax.add_patch(FancyBboxPatch((4.6, y), 15.2, h, boxstyle='round,pad=0.02,rounding_size=0.12', fc=warna, ec=HIJAU, lw=1.0))
        ax.text(4.9, y + h - 0.18, judul, fontsize=8.3, fontweight='bold', color=HIJAU, va='top')
        n = len(isi); lebar = (15.2 - 0.6 - 0.25 * (n - 1)) / n
        for i, t in enumerate(isi):
            kotak(ax, 4.9 + i * (lebar + 0.25), y + 0.2, lebar, h - 1.05, t, warna='white', tepi='#7A9A88', ukuran=6.9)

    # Sumber & pengolahan (kiri)
    ax.add_patch(FancyBboxPatch((0.1, 0.2), 3.7, 9.6, boxstyle='round,pad=0.02,rounding_size=0.12', fc=ABU, ec='#888888', lw=1.0))
    ax.text(1.95, 9.45, 'Pengolahan data\n(luar sistem)', ha='center', va='top', fontsize=8.2, fontweight='bold', color=TEKS)
    src = ['Google Earth\nEngine: Sentinel-2,\nCHIRPS, ERA5,\nSRTM', 'QGIS\n(statistik zonal)',
           'Data konsultan\n(GeoJSON parameter\n& kelas padi)', 'Skrip Python\n(Shapely, pyproj)']
    for i, t in enumerate(src):
        kotak(ax, 0.35, 6.55 - i * 2.05, 3.2, 1.75, t, warna='white', tepi='#888888', ukuran=6.6)
    for i in range(3):
        panah(ax, 1.95, 6.55 - i * 2.05, 1.95, 6.55 - (i + 1) * 2.05 + 1.75)
    panah(ax, 3.55, 1.37, 4.6, 1.37)
    ax.text(4.08, 1.6, 'ekspor', fontsize=6.8, ha='center', style='italic')

    lapis(0.2, 2.6, 'Lapisan data (berkas statis GeoJSON/JavaScript)',
          ['Batas & skor\nkecamatan', 'Batas & skor\ndesa', 'Syarat tumbuh\n22 komoditas\n& iklim', 'Parameter\nlahan desa (5)', 'Kesesuaian\npadi sawah'], '#F2F7F4')
    lapis(3.6, 2.6, 'Lapisan logika (JavaScript di peramban)',
          ['SAW 4 kriteria\n(kecamatan)', 'SAW 9 kriteria\n+ hukum\nminimum', 'Narasi &\nrekomendasi', 'Heatmap &\nstatistik padi', 'Grafik\nkomparasi'], '#E9F2EC')
    lapis(7.0, 2.8, 'Lapisan presentasi (HTML, CSS, Leaflet 1.9.4)',
          ['Peta interaktif\n& kartu\nkecamatan', 'Modal\nkecamatan\n& desa', 'Halaman\nSebaran', 'Metodologi\n& komparasi', 'Peta dasar\nEsri (citra\nsatelit)'], HIJAU_MUDA)
    panah(ax, 12.2, 2.8, 12.2, 3.6, gaya='<|-|>')
    panah(ax, 12.2, 6.2, 12.2, 7.0, gaya='<|-|>')
    simpan(fig, 'Gambar_3_Arsitektur_Sistem.png')


# ── Gambar 3: Model keputusan bertingkat (dua kolom) ────────────────────────
def gambar_model():
    fig, ax = plt.subplots(figsize=(7.0, 3.3))
    ax.set_xlim(0, 20); ax.set_ylim(0, 9.4); ax.axis('off')
    # Input kiri
    kotak(ax, 0.1, 6.3, 4.4, 2.6, 'Kriteria kecamatan\nCurah hujan (wa)\nSuhu, elevasi (tc)\nTekstur tanah (rc)', warna=ABU, tepi='#888888', ukuran=7.6)
    kotak(ax, 0.1, 2.0, 4.4, 3.4, 'Parameter lahan desa\n(data konsultan)\npH, C-organik (nr)\nKetebalan gambut (rc)\nLereng (eh), banjir (fh)', warna=ABU, tepi='#888888', ukuran=7.6)
    kotak(ax, 0.1, 0.1, 4.4, 1.4, 'Syarat tumbuh\n22 komoditas', warna=ABU, tepi='#888888', ukuran=7.6)

    # Normalisasi
    kotak(ax, 5.6, 6.3, 4.3, 2.6, 'Normalisasi trapesoid\nr = 1 (optimal),\n0–1 (transisi), 0 (di luar)', ukuran=7.6)
    kotak(ax, 5.6, 2.0, 4.3, 3.4, 'Rata-rata tertimbang\nluas per desa\ns̄ = Σ s·A / Σ A\nr = (s̄ − 1) / 3\n+ kelas dominan', ukuran=7.4)
    panah(ax, 4.5, 7.6, 5.6, 7.6); panah(ax, 4.5, 3.7, 5.6, 3.7)
    panah(ax, 4.5, 0.8, 5.6, 6.6)

    # Keluaran
    kotak(ax, 11.0, 6.3, 4.1, 2.6, 'SAW 4 kriteria\nS = Σ w·r\n(9 kecamatan)', warna=HIJAU_MUDA, ukuran=7.8, tebal=True)
    kotak(ax, 11.0, 2.9, 4.1, 2.6, 'SAW 9 kriteria\nbobot per\nkualitas lahan\n(6 desa Rasau Jaya)', warna=HIJAU_MUDA, ukuran=7.8, tebal=True)
    kotak(ax, 11.0, 0.1, 4.1, 2.2, 'Kelas hukum\nminimum: kelas\nterburuk + faktor\npembatas', warna='#FFF4E5', tepi=EMAS, ukuran=7.8, tebal=True)
    panah(ax, 9.9, 7.6, 11.0, 7.6)
    panah(ax, 9.9, 4.2, 11.0, 4.2)
    panah(ax, 9.9, 7.0, 11.0, 4.9, rad=0.15)
    panah(ax, 9.9, 2.6, 11.0, 1.2, rad=0.1)
    panah(ax, 9.9, 6.6, 11.0, 1.8, rad=0.25, warna=EMAS, garis='--')

    kotak(ax, 16.2, 6.3, 3.7, 2.6, 'Peringkat\nkomoditas per\nkecamatan', warna=HIJAU, tepi=HIJAU, ukuran=7.8)
    kotak(ax, 16.2, 2.9, 3.7, 2.6, 'Peringkat\nkomoditas\nper desa', warna=HIJAU, tepi=HIJAU, ukuran=7.8)
    kotak(ax, 16.2, 0.1, 3.7, 2.2, 'Rekomendasi\npengelolaan\nlahan', warna=EMAS, tepi=EMAS, ukuran=7.8)
    for t in ax.texts[-3:]:
        t.set_color('white'); t.set_fontweight('bold')
    panah(ax, 15.1, 7.6, 16.2, 7.6); panah(ax, 15.1, 4.2, 16.2, 4.2); panah(ax, 15.1, 1.2, 16.2, 1.2)
    simpan(fig, 'Gambar_2_Model_Keputusan.png')


# ── Gambar 10: Luas kelas kesesuaian padi sawah per desa (satu kolom) ──────
def gambar_padi():
    s = open(os.path.join(ROOT, 'data', 'padi_sawah.js'), encoding='utf-8').read()
    d = json.loads(s[s.index('{'):].rstrip().rstrip(';'))
    nama = lambda n: n.replace(' Iii', ' III').replace(' Ii', ' II')
    desa = sorted(d['desa'], key=lambda x: (x['S1'] + x['S2']) / sum(x[k] for k in ['S1', 'S2', 'S3', 'N']))
    warna = {'S1': '#1a6e3c', 'S2': '#5aac72', 'S3': '#e8c53a', 'N': '#d94f3a'}
    arsir = {'S1': '', 'S2': '///', 'S3': '...', 'N': 'xxx'}  # tetap terbedakan pada cetak hitam-putih
    fig, ax = plt.subplots(figsize=(3.4, 2.6))
    kiri = [0] * len(desa)
    for k in ['S1', 'S2', 'S3', 'N']:
        v = [x[k] for x in desa]
        ax.barh([nama(x['desa']) for x in desa], v, left=kiri, color=warna[k], hatch=arsir[k],
                edgecolor='white', linewidth=0.4, label=k)
        kiri = [a + b for a, b in zip(kiri, v)]
    for i, x in enumerate(desa):
        tot = sum(x[k] for k in ['S1', 'S2', 'S3', 'N'])
        ax.text(kiri[i] + 40, i, f"{(x['S1'] + x['S2']) / tot * 100:.1f}%".replace('.', ','), va='center', fontsize=7.2)
    ax.set_xlabel('Luas (ha)', fontsize=8)
    ax.tick_params(labelsize=7.5)
    ax.set_xlim(0, max(kiri) * 1.18)
    ax.xaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, _: f'{v:,.0f}'.replace(',', '.')))
    for sp in ['top', 'right']:
        ax.spines[sp].set_visible(False)
    ax.legend(ncol=4, fontsize=7, frameon=False, loc='upper center', bbox_to_anchor=(0.45, 1.13), handlelength=1.3)
    ax.text(1.0, -0.26, 'Persentase = lahan berpotensi (S1 + S2) terhadap area yang tercakup data',
            transform=ax.transAxes, ha='right', fontsize=6.3, style='italic', color='#444444')
    simpan(fig, 'Gambar_10_Potensi_Padi_per_Desa.png')


if __name__ == '__main__':
    gambar_alur()
    gambar_arsitektur()
    gambar_model()
    gambar_padi()
