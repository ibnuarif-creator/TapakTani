# DIBUAT OTOMATIS oleh buat_gambar_en.py — jangan disunting
"""
Gambar naskah JTEP-L versi bingkai kabupaten (komoditas unggulan Kubu Raya + percontohan Rasau Jaya).
Output: ../Paper/Gambar_JTEP_v2/*.png (300 dpi)

Gambar baru : 2 (diagram alir dua tingkat), 3 (zonasi agroekologi + matriks SAW kecamatan × komoditas)
Gambar lama : 1, 4, 5, 6, 7 disalin dari Gambar_JTEP (dibuat oleh gambar_jtep.py)

Prasyarat: node tools/saw_kecamatan.js ; python tools/gambar_jtep.py
Jalankan : python tools/gambar_jtep2.py
"""
import json, os, shutil
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Patch, FancyBboxPatch, FancyArrowPatch
from matplotlib.colors import LinearSegmentedColormap
from shapely.ops import unary_union

import gambar_jtep_en as G   # memakai fungsi peta & geometri kecamatan yang sama

OUT = os.path.join(G.ROOT, '..', 'Paper', 'Gambar_JTEP_EN')
os.makedirs(OUT, exist_ok=True)
TEKS = G.TEKS

# Zonasi agroekologi hasil klaster Ward (tools/zonasi_lq_validasi.py); urutan & warna zona tetap
ZONA_URUT = [('I', ['Sungai Kakap', 'Teluk Pakedai'], '#8fb8de', '....'),
             ('II', ['Rasau Jaya', 'Kubu'], '#7cc28f', '////'),
             ('III', ['Sungai Ambawang', 'Kuala Mandor B'], '#f0cf4a', ''),
             ('IV', ['Sungai Raya', 'Batu Ampar', 'Terentang'], '#d9a3c6', '\\')]
ZONA_KEC = {k: z for z, ks, _, _ in ZONA_URUT for k in ks}
GAYA = {z: (w, h) for z, _, w, h in ZONA_URUT}


def simpan(fig, nama):
    p = os.path.join(OUT, nama)
    fig.savefig(p, bbox_inches='tight', pad_inches=0.04, facecolor='white')
    plt.close(fig); print('ditulis:', p)


# ── Gambar 2: Diagram alir dua tingkat ────────────────────────────────────
def gambar_alir():
    fig, ax = plt.subplots(figsize=(6.8, 3.9)); ax.set_xlim(0, 20); ax.set_ylim(0, 11.4); ax.axis('off')

    def kotak(x, y, w, h, t, fc='#E4EFE9', ec='#1E6B3C', ukuran=7.0, tebal=False, warna_teks=TEKS):
        ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0.02,rounding_size=0.1', fc=fc, ec=ec, lw=0.9))
        ax.text(x + w / 2, y + h / 2, t, ha='center', va='center', fontsize=ukuran, color=warna_teks,
                fontweight='bold' if tebal else 'normal', linespacing=1.2)

    def panah(x1, y1, x2, y2):
        ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle='-|>', mutation_scale=8, color=TEKS, lw=0.8))

    for x, t in [(0.1, 'Data'), (5.15, 'Geospatial processing'), (10.2, 'Land evaluation'), (15.25, 'Outputs')]:
        ax.text(x + 2.3, 11.05, t, ha='center', fontsize=8.3, fontweight='bold', color='#1E6B3C')

    # pita tingkat analisis
    ax.add_patch(FancyBboxPatch((4.95, 5.75), 15.0, 4.95, boxstyle='round,pad=0.02,rounding_size=0.15',
                                fc='none', ec='#999999', lw=0.7, ls='--'))
    ax.add_patch(FancyBboxPatch((4.95, 0.1), 15.0, 5.35, boxstyle='round,pad=0.02,rounding_size=0.15',
                                fc='none', ec='#999999', lw=0.7, ls='--'))
    ax.text(5.1, 10.5, 'Level 1: Regency (9 districts)', ha='left', fontsize=6.8, style='italic', color='#555555', va='center', bbox=dict(fc='white', ec='none', pad=1))
    ax.text(5.1, 5.15, 'Level 2: Rasau Jaya pilot area (6 villages)', ha='left', fontsize=6.8, style='italic', color='#555555', va='center', bbox=dict(fc='white', ec='none', pad=1))

    data = [('Sentinel-2\n(NDVI, NDWI)', 9.0), ('CHIRPS, ERA5-Land,\nFABDEM, soil texture', 7.3),
            ('Crop requirements\n(20 commodities)', 5.6), ('pH, organic C (OpenLandMap),\npeat (KLHK), slope,\nflood (InaRISK)', 3.5),
            ('Paddy rice land\nsuitability (polygons)', 1.4)]
    for t, y in data:
        kotak(0.1, y, 4.5, 1.45, t, fc='#F5F5F5', ec='#888888', ukuran=6.8)

    # tingkat 1
    kotak(5.15, 8.3, 4.6, 1.75, 'Median composite\n2022–2024 (GEE) &\nzonal statistics')
    kotak(5.15, 6.2, 4.6, 1.75, 'Trapezoidal normalization\nto crop requirements')
    kotak(10.2, 8.3, 4.6, 1.75, 'Weighted overlay score\n& four-criterion SAW')
    kotak(10.2, 6.2, 4.6, 1.75, 'Ward clustering, LQ &\nBPS 2024 validation')
    kotak(15.25, 7.3, 4.6, 2.6, 'Zoning & actual/\npotential leading\ncommodities', fc='#1E6B3C', tebal=True, warna_teks='white')

    # tingkat 2
    kotak(5.15, 2.95, 4.6, 1.75, 'Area-weighted mean\nper village\n(UTM 49S)')
    kotak(5.15, 0.75, 4.6, 1.75, '50 m point grid\n(85,661 points)')
    kotak(10.2, 3.75, 4.6, 1.2, 'Nine-criterion SAW &\nlaw of the minimum', ukuran=6.8)
    kotak(10.2, 2.35, 4.6, 1.2, 'Actual vs potential\npaddy rice suitability', ukuran=6.8)
    kotak(10.2, 0.75, 4.6, 1.2, 'Weight sensitivity\n(±10%, ±20%)', ukuran=6.8)
    kotak(15.25, 2.75, 4.6, 2.2, 'Village land and\nwater management\nrecommendations', fc='#1E6B3C', tebal=True, warna_teks='white')
    kotak(15.25, 0.35, 4.6, 1.75, 'Dissemination via\nTapakTani WebGIS', fc='#1E6B3C', tebal=True, warna_teks='white')

    for y in (9.7, 8.0):
        panah(4.6, y, 5.15, 9.15)
    panah(4.6, 6.3, 5.15, 7.05)
    panah(4.6, 4.2, 5.15, 3.8)
    panah(4.6, 2.1, 5.15, 1.6)
    panah(7.45, 8.3, 7.45, 7.95)
    panah(9.75, 9.15, 10.2, 9.15); panah(9.75, 7.05, 10.2, 8.85)
    panah(12.5, 8.3, 12.5, 7.95)
    panah(14.8, 9.3, 15.25, 8.9); panah(14.8, 7.05, 15.25, 7.9)
    panah(9.75, 3.8, 10.2, 4.35); panah(9.75, 1.6, 10.2, 2.95); panah(9.75, 1.6, 10.2, 1.35)
    panah(14.8, 4.35, 15.25, 4.2); panah(14.8, 2.95, 15.25, 3.5)
    panah(17.55, 2.75, 17.55, 2.1)
    simpan(fig, 'Gambar_2_Diagram_Alir.png')


# ── Gambar 3: Zonasi (peta, dendrogram Ward, matriks SAW 20 komoditas) ───────
def gambar_zonasi():
    from scipy.cluster.hierarchy import dendrogram
    d = json.load(open(os.path.join(G.DATA, 'saw_kecamatan.json'), encoding='utf-8'))
    z = json.load(open(os.path.join(G.DATA, 'zonasi_lq_validasi.json'), encoding='utf-8'))
    kec = {k['nama']: k for k in d['kecamatan']}
    # cek konsistensi zona statis dengan hasil klaster
    for ks in [k['kecamatan'] for k in z['zona']]:
        assert len({ZONA_KEC[n] for n in ks}) == 1, ks
    kom, nama = z['komoditas'], z['nama']
    mat = {b['nama']: b['skor'] for b in json.load(open(os.path.join(G.DATA, 'saw_matriks_lengkap.json'), encoding='utf-8'))['baris']}
    urut_kec = [k for _, ks, _, _ in ZONA_URUT for k in ks]
    M = np.array([mat[k] for k in urut_kec])
    urut_kom = list(np.argsort(-M.mean(0)))
    M = M[:, urut_kom]; kom_u = [kom[i] for i in urut_kom]

    fig = plt.figure(figsize=(6.8, 7.0))
    a1 = fig.add_axes([0.0, 0.53, 0.47, 0.45])
    a2 = fig.add_axes([0.58, 0.60, 0.40, 0.33])
    a3 = fig.add_axes([0.17, 0.035, 0.76, 0.36])
    cax = fig.add_axes([0.945, 0.035, 0.012, 0.36])

    for n, g in G.kec_geom:
        w, h = GAYA[ZONA_KEC[n]]
        G.gambar_poligon(a1, g, fc=w, ec='#444444', lw=0.5, hatch=h)
        p = g.representative_point()
        a1.text(p.x, p.y, (n + "\n" + f"{kec[n]['skorWO']:.2f}"), fontsize=5.4, ha='center', va='center',
                color=TEKS, bbox=dict(boxstyle='round,pad=0.12', fc='white', ec='none', alpha=0.8))
    G.sumbu_utm(a1, unary_union([g for _, g in G.kec_geom]).bounds, pad=2000)
    a1.set_title('(a) Agroecological zones and weighted overlay scores', loc='left')
    G.panah_utara(a1); G.skala(a1, 20000, '20 km')
    a1.set_xlabel('Easting, UTM 49S (km)', fontsize=7); a1.set_ylabel('Northing, UTM 49S (km)', fontsize=7)
    a1.tick_params(labelsize=6.5)
    a1.legend(handles=[Patch(fc=w, hatch=h, ec='#444444', label=f'Zone {zn}') for zn, _, w, h in ZONA_URUT],
              loc='lower right', fontsize=6.3, frameon=True, framealpha=0.9, ncol=1)

    Z = np.array(z['linkage'])
    dendrogram(Z, labels=[f'{n} ({ZONA_KEC[n]})' for n in nama], orientation='right', ax=a2, color_threshold=0.2, above_threshold_color='#555555',
                    leaf_font_size=6.5)
    a2.axvline(0.2, color='#c05621', lw=0.8, ls='--')
    a2.text(0.205, 0.3, 'cut (4 zones)', fontsize=6, color='#c05621', rotation=90, va='bottom')
    a2.set_xlabel('Ward linkage distance', fontsize=7); a2.tick_params(labelsize=6.3)
    for sp in ['top', 'right']: a2.spines[sp].set_visible(False)
    a2.set_title(f"(b) Cluster dendrogram (silhouette {z['silhouette']['4']:.2f})", loc='left')

    cmap = LinearSegmentedColormap.from_list('hijau', ['#f7fcf5', '#c7e9c0', '#74c476', '#238b45', '#00441b'])
    im = a3.imshow(M, cmap=cmap, vmin=0.5, vmax=1.0, aspect='auto')
    for i in range(M.shape[0]):
        for j in range(M.shape[1]):
            a3.text(j, i, f'{M[i, j]:.2f}'.replace('0.', '.'), ha='center', va='center', fontsize=4.8,
                    color='white' if M[i, j] >= 0.86 else TEKS)
    a3.set_yticks(range(len(urut_kec)), [f'{k} ({ZONA_KEC[k]})' for k in urut_kec], fontsize=6.4)
    a3.set_xticks(range(len(kom_u)), [G.KOM_EN.get(c, d['nama'][c]) for c in kom_u], rotation=55, ha='right', fontsize=6.2)
    y = -0.5
    for _, ks, _, _ in ZONA_URUT[:-1]:
        y += len(ks); a3.axhline(y, color='white', lw=2.2)
    a3.tick_params(length=0)
    for sp in a3.spines.values(): sp.set_visible(False)
    a3.set_title('(c) Four-criterion SAW scores, 20 commodities × 9 districts', loc='left', x=-0.22)
    cb = fig.colorbar(im, cax=cax); cb.ax.tick_params(labelsize=6); cb.set_label('SAW score', fontsize=6.5)
    cb.ax.axhline(0.8, color=TEKS, lw=0.8); cb.ax.axhline(0.85, color='#c05621', lw=0.8, ls='--')
    simpan(fig, 'Gambar_3_Zonasi_Kabupaten.png')


def salin():
    lama = os.path.join(G.ROOT, '..', 'Paper', 'Gambar_JTEP')
    for a, b in [('Gambar_1_Lokasi_Penelitian.png', 'Gambar_1_Lokasi_Penelitian.png'),
                 ('Gambar_3_Peta_Parameter_Lahan.png', 'Gambar_4_Peta_Parameter_Lahan.png'),
                 ('Gambar_4_Peta_Faktor_Pembatas.png', 'Gambar_5_Peta_Faktor_Pembatas.png'),
                 ('Gambar_5_Peta_Aktual_Potensial.png', 'Gambar_6_Peta_Aktual_Potensial.png'),
                 ('Gambar_7_Sensitivitas_Bobot.png', 'Gambar_7_Sensitivitas_Bobot.png')]:
        shutil.copyfile(os.path.join(lama, a), os.path.join(OUT, b)); print('disalin:', b)


