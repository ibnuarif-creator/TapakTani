"""
Gambar naskah JEPIN (WebGIS TapakTani) — semua selebar satu kolom IEEE (±8,2 cm).
Output: ../Paper/Gambar_JEPIN/Gambar_*.png (300 dpi, Times New Roman)

  Gambar_1_Alur_Penelitian.png        diagram alur & iterasi prototyping
  Gambar_2_Use_Case.png               diagram use case
  Gambar_4_Arsitektur.png             arsitektur sistem
  Gambar_3_Alur_Data.png              alur transformasi data spasial
  Gambar_5_Beranda.png ... Gambar_10_Ponsel.png   susunan tangkapan layar
                                      (mentah dari Paper/_builder/tangkap_jepin.js)

Jalankan: python tools/gambar_jepin.py
"""
import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Ellipse, Rectangle
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, '..', 'Paper', 'Gambar_JEPIN')
LAYAR = os.path.join(OUT, 'layar')
os.makedirs(OUT, exist_ok=True)

plt.rcParams.update({'font.family': 'Times New Roman', 'font.size': 8, 'savefig.dpi': 300})
HIJAU, HIJAU_MUDA, ABU, TEKS, EMAS = '#1E6B3C', '#E4EFE9', '#F2F2F2', '#0D1F16', '#B45309'
LEBAR = 3.3  # inci, satu kolom


def kotak(ax, x, y, w, h, teks, warna=HIJAU_MUDA, tepi=HIJAU, tebal=False, ukuran=7.5, warna_teks=TEKS, garis='-'):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0.02,rounding_size=0.12', fc=warna, ec=tepi, lw=0.9, ls=garis))
    ax.text(x + w / 2, y + h / 2, teks, ha='center', va='center', fontsize=ukuran, color=warna_teks,
            fontweight='bold' if tebal else 'normal', linespacing=1.2)


def panah(ax, x1, y1, x2, y2, warna=TEKS, garis='-', gaya='-|>', rad=0.0):
    ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle=gaya, mutation_scale=8, color=warna, lw=0.8,
                                 linestyle=garis, connectionstyle=f'arc3,rad={rad}', shrinkA=0, shrinkB=0))


def simpan(fig, nama):
    p = os.path.join(OUT, nama)
    fig.savefig(p, bbox_inches='tight', pad_inches=0.03, facecolor='white')
    plt.close(fig)
    print('ditulis:', p)


# ── Gambar 1: alur penelitian dan iterasi prototyping ───────────────────────
def gambar_alur():
    fig, ax = plt.subplots(figsize=(LEBAR, 5.0))
    ax.set_xlim(0, 10); ax.set_ylim(0, 15.2); ax.axis('off')
    kotak(ax, 0.6, 13.8, 8.8, 1.2, 'Identifikasi masalah dan kebutuhan\n(Dinas Pertanian, penyuluh, peneliti)')
    kotak(ax, 0.6, 12.0, 8.8, 1.2, 'Pengumpulan dan pengolahan data\n(Google Earth Engine, QGIS, Python)')
    panah(ax, 5, 13.8, 5, 13.2); panah(ax, 5, 12.0, 5, 11.4)

    ax.add_patch(FancyBboxPatch((0.25, 4.2), 9.5, 7.2, boxstyle='round,pad=0.02,rounding_size=0.15',
                                fc='white', ec=HIJAU, lw=0.9, ls=(0, (4, 2))))
    ax.text(5, 11.0, 'Siklus prototyping', ha='center', fontsize=8, fontweight='bold', color=HIJAU)
    siklus = [(0.7, 9.55, 'Komunikasi'), (5.3, 9.55, 'Perencanaan\ncepat'), (5.3, 7.65, 'Pemodelan\ndesain cepat'),
              (0.7, 7.65, 'Konstruksi\nprototipe')]
    for x, y, t in siklus:
        kotak(ax, x, y, 4.0, 1.2, t, warna=ABU, tepi='#888888', ukuran=7.3)
    panah(ax, 4.7, 10.15, 5.3, 10.15); panah(ax, 7.3, 9.55, 7.3, 8.85); panah(ax, 5.3, 8.25, 4.7, 8.25)
    panah(ax, 2.7, 8.85, 2.7, 9.55, warna=EMAS)
    ax.text(2.85, 9.2, 'penyerahan dan umpan balik', fontsize=6.4, color=EMAS, ha='left', va='center', style='italic')
    iterasi = ['I-1 (Jul): peta interaktif dan profil 9 kecamatan',
               'I-2 (Jul): analisis SAW, metodologi, komparasi, responsif',
               'I-3 (Agu): rincian desa Kecamatan Rasau Jaya',
               'I-4 (Okt): data per poligon, SAW 9 kriteria, hukum',
               '        minimum, halaman Sebaran padi sawah',
               'I-5 (Okt): zonasi agroekologi (Ward + LQ),',
               '        identitas TapakTani, publikasi']
    ax.text(0.7, 7.3, '\n'.join(iterasi), ha='left', va='top', fontsize=6.8, color=TEKS, linespacing=1.3)

    panah(ax, 5, 4.2, 5, 3.85)
    kotak(ax, 0.6, 2.55, 8.8, 1.3, 'Pengujian blackbox (27 kasus uji)\nperbaikan cacat dan uji ulang')
    panah(ax, 5, 2.55, 5, 1.95)
    kotak(ax, 0.6, 0.75, 8.8, 1.2, 'Publikasi melalui GitHub Pages', warna=HIJAU, tepi=HIJAU, tebal=True, warna_teks='white')
    simpan(fig, 'Gambar_1_Alur_Penelitian.png')


# ── Gambar 2: diagram use case ──────────────────────────────────────────────
def aktor(ax, x, y, label):
    ax.add_patch(Ellipse((x, y + 1.15), 0.5, 0.5, fc='white', ec=TEKS, lw=0.8))
    ax.plot([x, x], [y + 0.9, y + 0.25], color=TEKS, lw=0.8)
    ax.plot([x - 0.4, x + 0.4], [y + 0.7, y + 0.7], color=TEKS, lw=0.8)
    ax.plot([x, x - 0.3], [y + 0.25, y - 0.2], color=TEKS, lw=0.8)
    ax.plot([x, x + 0.3], [y + 0.25, y - 0.2], color=TEKS, lw=0.8)
    ax.text(x, y - 0.35, label, ha='center', va='top', fontsize=6.6, linespacing=1.15)


def gambar_use_case():
    fig, ax = plt.subplots(figsize=(LEBAR, 4.3))
    ax.set_xlim(0, 10.4); ax.set_ylim(0, 13); ax.axis('off')
    ax.add_patch(Rectangle((2.45, 0.25), 6.05, 12.5, fc='white', ec=TEKS, lw=0.8))
    ax.text(5.47, 12.4, 'WebGIS TapakTani', ha='center', fontsize=7.6, fontweight='bold')
    uc = [(11.3, 'Melihat peta dan\nstatistik wilayah'), (9.95, 'Melihat profil\nkecamatan'),
          (8.6, 'Menelusuri perhitungan\nSAW komoditas'), (7.25, 'Melihat rincian desa\nRasau Jaya'),
          (5.9, 'Melihat zonasi dan\nkomoditas unggulan'), (4.55, 'Membandingkan\nkesesuaian'),
          (3.2, 'Melihat sebaran\npotensi padi sawah'), (1.85, 'Melihat metodologi\ndan sumber data')]
    pos = {}
    for i, (y, t) in enumerate(uc):
        ax.add_patch(Ellipse((5.07, y), 4.5, 1.12, fc=HIJAU_MUDA, ec=HIJAU, lw=0.8))
        ax.text(5.07, y, t, ha='center', va='center', fontsize=6.6, linespacing=1.1)
        pos[i] = y
    aktor(ax, 1.05, 6.4, 'Pengguna\n(perencana,\npenyuluh,\npeneliti,\nmasyarakat)')
    for i in [0, 1, 4, 5, 6, 7]:
        ax.plot([1.5, 2.82], [7.1, pos[i]], color=TEKS, lw=0.6)
    for i, rad in [(2, 0.55), (3, 0.6)]:
        panah(ax, 7.3, pos[i], 7.3, pos[1] - 0.05, garis='--', rad=rad)
    ax.text(8.22, pos[2] - 0.3, '«extend»', fontsize=5.8, style='italic', va='center', rotation=90)
    aktor(ax, 9.5, 6.4, 'Pengelola\ndata\n(tim\npeneliti)')
    ax.add_patch(Ellipse((9.5, 2.0), 1.6, 1.5, fc=ABU, ec='#777777', lw=0.8, ls='--'))
    ax.text(9.5, 2.0, 'Memperbarui\nberkas data\n(di luar\naplikasi)', ha='center', va='center', fontsize=5.9, linespacing=1.05)
    ax.plot([9.5, 9.5], [5.0, 2.78], color=TEKS, lw=0.6)
    simpan(fig, 'Gambar_2_Use_Case.png')


# ── Gambar 3: arsitektur sistem ─────────────────────────────────────────────
def gambar_arsitektur():
    fig, ax = plt.subplots(figsize=(LEBAR, 4.9))
    ax.set_xlim(0, 10); ax.set_ylim(0, 15); ax.axis('off')
    kotak(ax, 0.3, 13.75, 5.8, 1.05, 'Peramban pengguna\n(desktop dan ponsel)', warna=ABU, tepi='#888888')
    kotak(ax, 6.5, 13.75, 3.2, 1.05, 'Tile citra\nEsri World Imagery', warna=ABU, tepi='#888888', ukuran=6.8)
    panah(ax, 6.1, 14.27, 6.5, 14.27, gaya='<|-|>')
    panah(ax, 3.2, 13.75, 3.2, 13.15, gaya='<|-|>')
    ax.text(3.35, 13.45, 'HTTPS', fontsize=6.3, style='italic', va='center')

    ax.add_patch(FancyBboxPatch((0.15, 4.25), 9.7, 8.85, boxstyle='round,pad=0.02,rounding_size=0.15', fc='white', ec=HIJAU, lw=0.9))
    ax.text(0.4, 12.85, 'GitHub Pages — situs statis TapakTani', fontsize=7.4, fontweight='bold', color=HIJAU, va='top')

    def lapis(y, h, judul, isi, warna):
        ax.add_patch(FancyBboxPatch((0.45, y), 9.1, h, boxstyle='round,pad=0.02,rounding_size=0.1', fc=warna, ec='#7A9A88', lw=0.7))
        ax.text(0.65, y + h - 0.15, judul, fontsize=7, fontweight='bold', color=HIJAU, va='top')
        n = len(isi); lebar = (9.1 - 0.4 - 0.15 * (n - 1)) / n
        for i, t in enumerate(isi):
            kotak(ax, 0.65 + i * (lebar + 0.15), y + 0.15, lebar, h - 0.8, t, warna='white', tepi='#9DB5A6', ukuran=6.1)

    lapis(9.85, 2.55, 'Lapisan presentasi (HTML, CSS, Leaflet 1.9.4)',
          ['index.html\nberanda, kartu,\nzonasi, metodo-\nlogi, komparasi', 'Jendela profil\nkecamatan\ndan desa', 'sebaran.html\npeta & tabel\npotensi padi'], HIJAU_MUDA)
    lapis(7.05, 2.35, 'Lapisan logika (JavaScript di peramban)',
          ['SAW 4 kriteria\n& SAW 9\nkriteria', 'Hukum mini-\nmum, narasi,\nrekomendasi', 'Zonasi, grafik,\nheatmap\n(Leaflet.heat)'], '#EEF5F0')
    lapis(4.45, 2.15, 'Lapisan data (berkas JavaScript statis)',
          ['Batas, indeks,\niklim kecamatan,\nsyarat tumbuh', 'Batas dan\nparameter\nlahan desa', 'Zonasi,\nkesesuaian\npadi sawah'], '#F6FAF7')
    for bawah, atas in ((9.4, 9.85), (6.6, 7.05)):
        panah(ax, 5, bawah, 5, atas, gaya='<|-|>')

    ax.add_patch(FancyBboxPatch((0.15, 0.1), 9.7, 3.35, boxstyle='round,pad=0.02,rounding_size=0.15', fc=ABU, ec='#888888', lw=0.8, ls='--'))
    ax.text(0.4, 3.25, 'Pengolahan data (di luar aplikasi, oleh pengelola data)', fontsize=7, fontweight='bold', va='top')
    kotak(ax, 0.4, 0.35, 2.9, 2.2, 'GEE: Sentinel-2,\nCHIRPS, ERA5-Land,\nFABDEM,\nOpenLandMap', warna='white', tepi='#888888', ukuran=5.9)
    kotak(ax, 3.55, 0.35, 2.9, 2.2, 'QGIS dan Python:\nstatistik zonal,\nklaster Ward, LQ,\nparameter desa', warna='white', tepi='#888888', ukuran=5.9)
    kotak(ax, 6.7, 0.35, 2.9, 2.2, 'Ekspor berkas\n.js ke folder\ndata/ lalu\ngit push', warna='white', tepi='#888888', ukuran=5.9)
    panah(ax, 3.3, 1.45, 3.55, 1.45); panah(ax, 6.45, 1.45, 6.7, 1.45)
    panah(ax, 8.15, 2.55, 8.15, 4.6)
    simpan(fig, 'Gambar_4_Arsitektur.png')


# ── Gambar 3: alur transformasi data spasial menjadi informasi di antarmuka ──
def gambar_alur_data():
    fig, ax = plt.subplots(figsize=(LEBAR, 5.6))
    ax.set_xlim(0, 10); ax.set_ylim(0, 18.4); ax.axis('off')
    u = 5.7
    # Bagian luar aplikasi
    ax.add_patch(FancyBboxPatch((0.1, 7.55), 9.8, 10.7, boxstyle='round,pad=0.02,rounding_size=0.15', fc='#FAFAFA', ec='#888888', lw=0.8, ls='--'))
    ax.text(0.3, 18.05, 'Di luar aplikasi — diolah sekali oleh pengelola data', fontsize=6.6, fontweight='bold', va='top')
    kol = [0.3, 3.55, 6.8]; lb = 2.9
    sumber = ['Raster: Sentinel-2,\nCHIRPS, ERA5-Land,\nFABDEM,\nOpenLandMap',
              'Vektor parameter\nlahan: 5 GeoJSON\n(17,8 MB)',
              'Poligon padi\nsawah (2,99 MB);\nbatas kecamatan\n(719 KB)']
    proses = ['Agregasi spasial:\nstatistik zonal\nper poligon\n→ CSV 9 baris',
              'Irisan dengan\nbatas desa → rerata\ntertimbang luas,\nkelas dominan',
              'Generalisasi:\nsimplifikasi, buang\n< 0,5 ha; grid\n200 m (heatmap)']
    keluaran = ['syarat_tumbuh.js\n(11 KB);\nkesesuaian_data\n_v2.js (70 KB)',
                'parameter_lahan_\ndesa.js (5,6 KB)',
                'padi_sawah.js\n(312 KB)']
    for x, s, p, k in zip(kol, sumber, proses, keluaran):
        kotak(ax, x, 14.75, lb, 2.75, s, warna=ABU, tepi='#888888', ukuran=u)
        kotak(ax, x, 11.35, lb, 2.75, p, ukuran=u)
        kotak(ax, x, 8.0, lb, 2.35, k, warna='white', tepi=HIJAU, ukuran=u)
        panah(ax, x + lb / 2, 14.75, x + lb / 2, 14.1)
        panah(ax, x + lb / 2, 11.35, x + lb / 2, 10.35)
    ax.text(5.0, 10.85, 'serialisasi ke objek JavaScript', ha='center', fontsize=5.8, style='italic', color='#555555')
    panah(ax, 5.0, 8.0, 5.0, 7.0)
    ax.text(5.2, 7.35, 'unggah ke GitHub Pages', fontsize=5.9, style='italic', va='center')

    # Bagian peramban
    ax.add_patch(FancyBboxPatch((0.1, 0.1), 9.8, 6.75, boxstyle='round,pad=0.02,rounding_size=0.15', fc='white', ec=HIJAU, lw=0.9))
    ax.text(0.3, 6.6, 'Di peramban — setiap kali halaman dibuka', fontsize=6.6, fontweight='bold', color=HIJAU, va='top')
    kotak(ax, 0.3, 3.45, 4.5, 2.6, 'Normalisasi r (0–1):\ntrapesoid, tekstur\ntertimbang luas,\nr = (s̄ − 1) / 3', ukuran=u)
    kotak(ax, 5.2, 3.45, 4.5, 2.6, 'Skor SAW S = Σ w·r\ndan label kelas;\nkelas hukum minimum\n+ faktor pembatas', ukuran=u, tebal=True)
    kotak(ax, 5.2, 0.4, 4.5, 2.45, 'Aturan rekomendasi:\nfaktor pembatas →\nsaran pengelolaan', warna='#FFF4E5', tepi=EMAS, ukuran=u)
    kotak(ax, 0.3, 0.4, 4.5, 2.45, 'Antarmuka: peta, kartu,\ntabel w × r, grafik,\nheatmap, rekomendasi', warna=HIJAU, tepi=HIJAU, warna_teks='white', ukuran=u, tebal=True)
    panah(ax, 4.8, 4.75, 5.2, 4.75); panah(ax, 7.45, 3.45, 7.45, 2.85); panah(ax, 5.2, 1.6, 4.8, 1.6)
    panah(ax, 2.55, 3.45, 2.55, 2.85, garis='--')
    ax.text(2.7, 3.15, 'nilai r dan w·r', fontsize=5.6, style='italic', va='center')
    simpan(fig, 'Gambar_3_Alur_Data.png')


# ── Susunan tangkapan layar ─────────────────────────────────────────────────
def potong(nama, kotak_px=None):
    im = Image.open(os.path.join(LAYAR, nama)).convert('RGB')
    return im.crop(kotak_px) if kotak_px else im


def susun(panel, nama, jarak=0.05):
    """panel = [(gambar PIL, label)], disusun vertikal selebar kolom dengan label (a), (b) di bawahnya."""
    tinggi = [LEBAR * im.size[1] / im.size[0] for im, _ in panel]
    total = sum(tinggi) + len(panel) * (0.17 + jarak)
    fig = plt.figure(figsize=(LEBAR, total))
    y = total
    for (im, label), h in zip(panel, tinggi):
        y -= h
        ax = fig.add_axes([0, y / total, 1, h / total])
        ax.imshow(im); ax.set_xticks([]); ax.set_yticks([])
        for s in ax.spines.values():
            s.set_color('#BBBBBB'); s.set_linewidth(0.5)
        y -= 0.17
        fig.text(0.5, (y + 0.06) / total, label, ha='center', va='center', fontsize=7.5)
        y -= jarak
    simpan(fig, nama)


def sejajar(panel, nama):
    """Dua tangkapan layar ponsel berdampingan."""
    fig, axs = plt.subplots(1, len(panel), figsize=(LEBAR, LEBAR / len(panel) * 2.25))
    for ax, (im, label) in zip(axs, panel):
        ax.imshow(im); ax.set_xticks([]); ax.set_yticks([])
        for s in ax.spines.values():
            s.set_color('#BBBBBB'); s.set_linewidth(0.5)
        ax.set_xlabel(label, fontsize=7.5, labelpad=3)
    fig.subplots_adjust(wspace=0.06, left=0, right=1, bottom=0.06, top=1)
    simpan(fig, nama)


def gambar_layar():
    susun([(potong('beranda.png', (0, 0, 2560, 1150)), '(a)'), (potong('kartu.png'), '(b)')], 'Gambar_5_Beranda_Kartu.png')
    susun([(potong('n_saw_kartu.png'), '(a)'), (potong('n_saw_tabel.png'), '(b)')], 'Gambar_6_Profil_Kecamatan_SAW.png')
    susun([(potong('n_desa_tabel.png', (0, 0, 1692, 2190)), '(a)'), (potong('n_desa_rekom.png'), '(b)')], 'Gambar_7_Profil_Desa.png')
    susun([(potong('zonasi.png', (0, 0, 1165, 1160)), '(a)'), (potong('n_zona_a1.png'), '(b)')], 'Gambar_8_Zonasi.png')
    susun([(potong('n_komparasi.png', (0, 0, 1860, 1560)), '(a)'), (potong('sebaran_kelas.png'), '(b)')], 'Gambar_9_Komparasi_Sebaran.png')
    sejajar([(potong('ponsel_beranda.png'), '(a)'), (potong('ponsel_modal.png'), '(b)')], 'Gambar_10_Ponsel.png')


if __name__ == '__main__':
    gambar_alur()
    gambar_use_case()
    gambar_arsitektur()
    gambar_alur_data()
    gambar_layar()
