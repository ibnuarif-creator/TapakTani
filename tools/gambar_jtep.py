"""
Gambar untuk paper JTEP-L (Jurnal Teknik Pertanian Lampung) — AgroRaya / Rasau Jaya.
Output: ../Paper/Gambar_JTEP/*.png (300 dpi, Times New Roman, terbaca saat dicetak hitam-putih)

Prasyarat: jalankan dulu tools/analisis_potensial_padi.py dan tools/sensitivitas_saw.js
Jalankan : python tools/gambar_jtep.py
"""
import json, os
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import PathPatch, Patch, FancyBboxPatch, FancyArrowPatch
from matplotlib.path import Path as MPath
from matplotlib.colors import ListedColormap
from shapely.geometry import shape
from shapely.ops import transform, unary_union
from shapely import make_valid
from pyproj import Transformer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, '..', 'newgjson')
DATA = os.path.join(ROOT, '..', 'Paper', 'Gambar', 'data_analisis')
OUT = os.path.join(ROOT, '..', 'Paper', 'Gambar_JTEP')
os.makedirs(OUT, exist_ok=True)
plt.rcParams.update({'font.family': 'Times New Roman', 'font.size': 9, 'savefig.dpi': 300,
                     'axes.titlesize': 9, 'axes.labelsize': 9, 'xtick.labelsize': 7.5, 'ytick.labelsize': 7.5})
to_utm = Transformer.from_crs(4326, 32749, always_xy=True).transform

KELAS = ['S1', 'S2', 'S3', 'N']
WARNA = {'S1': '#1a6e3c', 'S2': '#7cc28f', 'S3': '#f0cf4a', 'N': '#d94f3a'}
ARSIR = {'S1': '', 'S2': '////', 'S3': '....', 'N': 'xxxx'}
LABEL = {'S1': 'S1 – Sangat sesuai', 'S2': 'S2 – Cukup sesuai', 'S3': 'S3 – Sesuai marginal', 'N': 'N – Tidak sesuai'}
SKOR_KELAS = {4: 'S1', 3: 'S2', 2: 'S3', 1: 'N'}
TEKS = '#0D1F16'


def muat_js(nama):
    s = open(os.path.join(ROOT, 'data', nama), encoding='utf-8-sig').read()
    return json.loads(s[s.index('{'):].rstrip().rstrip(';'))


def per_kelas(nama, toleransi=20):
    gj = json.load(open(os.path.join(SRC, nama + '.geojson'), encoding='utf-8'))
    d = {}
    for f in gj['features']:
        d.setdefault(SKOR_KELAS[int(f['properties']['skor'])], []).append(make_valid(shape(f['geometry'])))
    return {k: transform(to_utm, unary_union(v)).buffer(0).simplify(toleransi) for k, v in d.items()}


def gambar_poligon(ax, geom, **kw):
    for p in getattr(geom, 'geoms', [geom]):
        if p.geom_type != 'Polygon' or p.is_empty:
            continue
        verts, codes = [], []
        for ring in [p.exterior] + list(p.interiors):
            xy = np.asarray(ring.coords)
            verts.extend(xy); codes.extend([MPath.MOVETO] + [MPath.LINETO] * (len(xy) - 2) + [MPath.CLOSEPOLY])
        ax.add_patch(PathPatch(MPath(verts, codes), **kw))


def sumbu_utm(ax, bounds, pad=600):
    minx, miny, maxx, maxy = bounds
    ax.set_xlim(minx - pad, maxx + pad); ax.set_ylim(miny - pad, maxy + pad)
    ax.set_aspect('equal')
    fmt = matplotlib.ticker.FuncFormatter(lambda v, _: f'{v / 1000:.0f}')
    ax.xaxis.set_major_formatter(fmt); ax.yaxis.set_major_formatter(fmt)
    ax.xaxis.set_major_locator(matplotlib.ticker.MaxNLocator(4)); ax.yaxis.set_major_locator(matplotlib.ticker.MaxNLocator(4))
    ax.tick_params(length=2)


def panah_utara(ax, x=0.93, y=0.86):
    ax.annotate('U', xy=(x, y + 0.09), xytext=(x, y), xycoords='axes fraction', ha='center', va='center',
                fontsize=8, fontweight='bold', arrowprops=dict(arrowstyle='-|>', lw=1, color=TEKS))


def skala(ax, panjang_m=5000, label='5 km'):
    x0, x1 = ax.get_xlim(); y0, y1 = ax.get_ylim()
    xs = x0 + (x1 - x0) * 0.06; ys = y0 + (y1 - y0) * 0.06
    ax.plot([xs, xs + panjang_m], [ys, ys], color=TEKS, lw=2.2, solid_capstyle='butt')
    ax.text(xs + panjang_m / 2, ys + (y1 - y0) * 0.025, label, ha='center', fontsize=7)


def simpan(fig, nama):
    p = os.path.join(OUT, nama)
    fig.savefig(p, bbox_inches='tight', pad_inches=0.04, facecolor='white')
    plt.close(fig); print('ditulis:', p)


desa_gj = muat_js('rasau_jaya_desa.js')
desa_geom = [(f['properties']['NAME_4'].replace(' Iii', ' III').replace(' Ii', ' II'),
              transform(to_utm, make_valid(shape(f['geometry'])))) for f in desa_gj['features']]
kec_gj = muat_js('kesesuaian_data_v2.js')
kec_geom = [(f['properties']['NAME_3'].replace("Telok Pa'Kedai", 'Teluk Pakedai'),
             transform(to_utm, make_valid(shape(f['geometry']))).simplify(150)) for f in kec_gj['features']]


def batas_desa(ax, label=True, warna='#222222'):
    for n, g in desa_geom:
        gambar_poligon(ax, g, fc='none', ec=warna, lw=0.6)
        if label:
            p = g.representative_point()
            ax.text(p.x, p.y, n.replace('Rasau Jaya ', 'RJ '), fontsize=6.2, ha='center', va='center', color=TEKS,
                    bbox=dict(boxstyle='round,pad=0.12', fc='white', ec='none', alpha=0.75))


# ── Gambar 1: Peta lokasi penelitian ────────────────────────────────────────
def gambar_lokasi(padi):
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.8, 3.4), gridspec_kw={'width_ratios': [1, 1.25]})
    for n, g in kec_geom:
        gambar_poligon(a1, g, fc='#7cc28f' if n == 'Rasau Jaya' else '#eef3ef', ec='#555555', lw=0.5)
        p = g.representative_point()
        a1.text(p.x, p.y, n, fontsize=5.6, ha='center', va='center', color=TEKS, fontweight='bold' if n == 'Rasau Jaya' else 'normal')
    sumbu_utm(a1, unary_union([g for _, g in kec_geom]).bounds, pad=2000)
    a1.set_title('(a) Kabupaten Kubu Raya', loc='left'); panah_utara(a1); skala(a1, 20000, '20 km')
    a1.set_xlabel('Timur, UTM 49S (km)'); a1.set_ylabel('Utara, UTM 49S (km)')

    area = unary_union(list(padi.values()))
    gambar_poligon(a2, area, fc='#f0cf4a', ec='none', alpha=0.35)
    batas_desa(a2)
    sumbu_utm(a2, area.union(unary_union([g for _, g in desa_geom])).bounds)
    a2.set_title('(b) Kecamatan Rasau Jaya (wilayah percontohan)', loc='left'); panah_utara(a2); skala(a2)
    a2.set_xlabel('Timur, UTM 49S (km)')
    a2.legend(handles=[Patch(fc='#f0cf4a', alpha=0.35, label='Cakupan data parameter lahan (±21.400 ha)'),
                       Patch(fc='none', ec='#222222', label='Batas desa')], fontsize=6.5, loc='lower right', frameon=True)
    fig.tight_layout(); simpan(fig, 'Gambar_1_Lokasi_Penelitian.png')


# ── Gambar 2: Diagram alir penelitian (sudut pandang teknologi pertanian) ──
def gambar_alir():
    fig, ax = plt.subplots(figsize=(6.8, 3.6)); ax.set_xlim(0, 20); ax.set_ylim(0, 10.6); ax.axis('off')

    def kotak(x, y, w, h, t, fc='#E4EFE9', ec='#1E6B3C', ukuran=7.3, tebal=False, warna_teks=TEKS):
        ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0.02,rounding_size=0.1', fc=fc, ec=ec, lw=0.9))
        ax.text(x + w / 2, y + h / 2, t, ha='center', va='center', fontsize=ukuran, color=warna_teks,
                fontweight='bold' if tebal else 'normal', linespacing=1.25)

    def panah(x1, y1, x2, y2):
        ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle='-|>', mutation_scale=8, color=TEKS, lw=0.8))

    judul = [(0.1, 'Akuisisi data'), (5.2, 'Pengolahan geospasial'), (10.3, 'Evaluasi lahan'), (15.4, 'Keluaran')]
    for x, t in judul:
        ax.text(x + 2.25, 10.25, t, ha='center', fontsize=8.3, fontweight='bold', color='#1E6B3C')
    data = ['Citra Sentinel-2\n(NDVI, NDWI)', 'Iklim: CHIRPS,\nERA5-Land', 'DEM SRTM &\ntekstur tanah', 'Survei lahan\npendukung: pH, C-org,\ngambut, lereng, banjir', 'Syarat tumbuh\n22 komoditas']
    for i, t in enumerate(data):
        kotak(0.1, 8.3 - i * 1.95, 4.5, 1.6, t, fc='#F5F5F5', ec='#888888')
    olah = ['Komposit median\n2022–2024 (GEE)', 'Statistik zonal\nkecamatan & desa', 'Reproyeksi UTM 49S,\noverlay & rata-rata\ntertimbang luas', 'Grid titik 50 m\n(85.661 titik)']
    for i, t in enumerate(olah):
        kotak(5.2, 8.1 - i * 2.4, 4.5, 1.9, t)
    evalu = ['SAW 4 kriteria\n(9 kecamatan)', 'SAW 9 kriteria per\nkualitas lahan (6 desa)', 'Hukum minimum &\nfaktor pembatas', 'Kesesuaian aktual vs\npotensial padi sawah', 'Analisis sensitivitas\nbobot (±10%, ±20%)']
    for i, t in enumerate(evalu):
        kotak(10.3, 8.3 - i * 1.95, 4.5, 1.6, t)
    kel = ['Peringkat komoditas\nkecamatan & desa', 'Rekomendasi\npengelolaan lahan\n& tata air', 'Diseminasi WebGIS\nAgroRaya']
    for i, t in enumerate(kel):
        kotak(15.4, 7.7 - i * 3.0, 4.5, 2.2, t, fc='#1E6B3C', ec='#1E6B3C', tebal=True, warna_teks='white')
    for i in range(5):
        panah(4.6, 9.1 - i * 1.95, 5.2, min(9.05, max(1.05, 9.05 - i * 2.0)))
    for i in range(5):
        panah(9.7, 9.05 - min(i, 3) * 2.4, 10.3, 9.1 - i * 1.95)
    for i, j in [(0, 0), (1, 0), (2, 1), (3, 1), (4, 1)]:
        panah(14.8, 9.1 - i * 1.95, 15.4, 8.8 - j * 3.0)
    panah(17.65, 4.7 - 3.0 + 2.2, 17.65, 1.7 + 0.0) if False else None
    panah(17.65, 4.7, 17.65, 3.9)
    simpan(fig, 'Gambar_2_Diagram_Alir.png')


# ── Gambar 3: Peta lima parameter kualitas lahan ────────────────────────────
def gambar_parameter(param, padi):
    nama = [('ph', '(a) pH tanah (nr)'), ('corg', '(b) C-organik (nr)'), ('gambut', '(c) Ketebalan gambut (rc)'),
            ('lereng', '(d) Kemiringan lereng (eh)'), ('banjir', '(e) Bahaya banjir (fh)')]
    fig, axs = plt.subplots(2, 3, figsize=(6.8, 4.6))
    bounds = unary_union(list(padi.values())).bounds
    for ax, (k, judul) in zip(axs.ravel(), nama):
        for kl in KELAS:
            if kl in param[k]:
                gambar_poligon(ax, param[k][kl], fc=WARNA[kl], ec='none', hatch=ARSIR[kl], lw=0)
        batas_desa(ax, label=False, warna='#333333')
        sumbu_utm(ax, bounds); ax.set_title(judul, loc='left'); ax.tick_params(labelsize=6.5)
    ax = axs.ravel()[-1]; ax.axis('off')
    ax.legend(handles=[Patch(fc=WARNA[k], hatch=ARSIR[k], label=LABEL[k]) for k in KELAS] +
              [Patch(fc='none', ec='#333333', label='Batas desa')], loc='center', fontsize=7.5, frameon=False,
              title='Kelas kesesuaian', title_fontsize=8)
    fig.text(0.5, 0.005, 'Koordinat: UTM zona 49S (km)', ha='center', fontsize=7.5)
    fig.tight_layout(rect=(0, 0.02, 1, 1)); simpan(fig, 'Gambar_3_Peta_Parameter_Lahan.png')


# ── Gambar 4: Faktor pembatas lahan S3 padi sawah; Gambar 5: aktual vs potensial ─
def raster(npz, kunci, peta):
    x, y = npz['x'], npz['y']; g = 50.0
    ix = np.round((x - x.min()) / g).astype(int); iy = np.round((y - y.min()) / g).astype(int)
    arr = np.full((iy.max() + 1, ix.max() + 1), np.nan)
    v = npz[kunci]
    for nilai, kode in peta.items():
        m = v == nilai; arr[iy[m], ix[m]] = kode
    ext = (x.min() - g / 2, x.max() + g / 2, y.min() - g / 2, y.max() + g / 2)
    return arr, ext


def gambar_pembatas(npz):
    peta = {'fh': 0, 'nr': 1, 'fh+nr': 2, 'lain': 3, 'luar': 4}
    warna = ['#2b6cb0', '#c05621', '#6b46c1', '#718096', '#cbd5e0']
    label = ['Hanya bahaya banjir (fh)', 'Hanya pH (nr)', 'Banjir + pH (fh, nr)', 'Melibatkan eh/rc/C-org', 'Di luar lima parameter']
    arr, ext = raster(npz, 'pembatas', peta)
    akt, _ = raster(npz, 'aktual', {'S1': 0, 'S2': 0, 'N': 0})
    fig, ax = plt.subplots(figsize=(4.4, 3.6))
    ax.imshow(np.where(np.isnan(akt), np.nan, 0), extent=ext, origin='lower', cmap=ListedColormap(['#eeeeee']), interpolation='nearest')
    ax.imshow(arr, extent=ext, origin='lower', cmap=ListedColormap(warna), vmin=-0.5, vmax=4.5, interpolation='nearest')
    batas_desa(ax)
    sumbu_utm(ax, (ext[0], ext[2], ext[1], ext[3]), pad=200); panah_utara(ax); skala(ax)
    ax.set_xlabel('Timur, UTM 49S (km)'); ax.set_ylabel('Utara, UTM 49S (km)')
    ax.legend(handles=[Patch(fc=c, label=l) for c, l in zip(warna, label)] + [Patch(fc='#eeeeee', label='Bukan kelas S3')],
              fontsize=6.5, loc='upper center', bbox_to_anchor=(0.5, -0.16), ncol=2, frameon=False,
              title='Faktor pembatas pada lahan S3', title_fontsize=7)
    simpan(fig, 'Gambar_4_Peta_Faktor_Pembatas.png')


def gambar_potensial(npz):
    peta = {'S1': 0, 'S2': 1, 'S3': 2, 'N': 3}
    cmap = ListedColormap([WARNA[k] for k in KELAS])
    fig, axs = plt.subplots(1, 3, figsize=(6.8, 2.3))
    judul = [('aktual', '(a) Aktual'), ('pot_a', '(b) Potensial: perbaikan tata air'), ('pot_b', '(c) Potensial: tata air + ameliorasi')]
    for ax, (k, j) in zip(axs, judul):
        arr, ext = raster(npz, k, peta)
        ax.imshow(arr, extent=ext, origin='lower', cmap=cmap, vmin=-0.5, vmax=3.5, interpolation='nearest')
        batas_desa(ax, label=False)
        sumbu_utm(ax, (ext[0], ext[2], ext[1], ext[3]), pad=200); ax.set_title(j, loc='left', fontsize=8)
        ax.tick_params(labelsize=6.3)
        s12 = ((npz[k] == 'S1') | (npz[k] == 'S2')).sum() * 0.25
        ax.text(0.03, 0.04, f'S1+S2: {s12:,.0f} ha'.replace(',', '.'), transform=ax.transAxes, fontsize=7,
                bbox=dict(boxstyle='round,pad=0.2', fc='white', ec='none', alpha=0.85))
    fig.tight_layout(rect=(0, 0.15, 1, 1))
    fig.legend(handles=[Patch(fc=WARNA[k], label=LABEL[k]) for k in KELAS], loc='lower center',
               bbox_to_anchor=(0.5, 0.0), ncol=4, fontsize=7, frameon=False)
    fig.text(0.5, 0.115, 'Koordinat: UTM zona 49S (km)', ha='center', fontsize=7)
    simpan(fig, 'Gambar_5_Peta_Aktual_Potensial.png')


# ── Gambar 6: Lahan berpotensi padi per desa, aktual vs potensial ─────────
def gambar_potensial_desa():
    d = json.load(open(os.path.join(DATA, 'potensial_padi.json'), encoding='utf-8'))['desa']
    desa = [n for n in d if n != 'Di luar batas desa']
    pct = lambda r, k: (r[k]['S1'] + r[k]['S2']) / r['total_ha'] * 100
    desa.sort(key=lambda n: pct(d[n], 'aktual'))
    y = np.arange(len(desa)); h = 0.26
    fig, ax = plt.subplots(figsize=(3.4, 3.0))
    gaya = [('aktual', 'Aktual', '#7cc28f', ''), ('potensial_A', 'Potensial A (tata air)', '#2b6cb0', '////'),
            ('potensial_B', 'Potensial B (tata air + ameliorasi)', '#1a365d', '....')]
    for i, (k, lab, c, ha) in enumerate(gaya):
        v = [pct(d[n], k) for n in desa]
        ax.barh(y + (1 - i) * h, v, h, color=c, hatch=ha, edgecolor='white', lw=0.3, label=lab)
    ax.set_yticks(y, desa); ax.set_xlim(0, 100); ax.set_xlabel('Lahan S1 + S2 (% area tercakup data)')
    for sp in ['top', 'right']: ax.spines[sp].set_visible(False)
    ax.legend(fontsize=6.5, loc='lower center', bbox_to_anchor=(0.4, 1.0), ncol=1, frameon=False)
    simpan(fig, 'Gambar_6_Potensi_Padi_per_Desa.png')


# ── Gambar 7: Sensitivitas bobot ───────────────────────────────────────────
def gambar_sensitivitas():
    s = json.load(open(os.path.join(DATA, 'sensitivitas.json'), encoding='utf-8'))
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(6.8, 2.8), gridspec_kw={'width_ratios': [1.6, 1]})
    delta = [-0.2, -0.1, 0.1, 0.2]
    mk = {-0.2: ('v', '#c05621'), -0.1: ('<', '#dd9a6b'), 0.1: ('>', '#6b9bd1'), 0.2: ('^', '#2b6cb0')}
    nama9 = list(dict.fromkeys(x['kriteria'] for x in s['desa9']))
    for i, n in enumerate(nama9):
        for dlt in delta:
            r = next(x for x in s['desa9'] if x['kriteria'] == n and x['delta'] == dlt)
            m, c = mk[dlt]
            a1.scatter(r['rhoDesaPadi'], i + (dlt * 1.2), marker=m, color=c, s=16, label=f'{dlt:+.0%}' if i == 0 else None, zorder=3)
            a1.text(1.006, i, f"{max(x['perubahanKategori'] for x in s['desa9'] if x['kriteria'] == n)}", fontsize=6.5, va='center')
    a1.set_yticks(range(len(nama9)), nama9); a1.set_xlim(0.9, 1.012); a1.invert_yaxis()
    a1.set_xlabel('ρ Spearman peringkat desa (padi sawah)'); a1.axvline(1, color='#999999', lw=0.6, ls='--')
    a1.set_title('(a) SAW 9 kriteria, 6 desa', loc='left')
    a1.text(1.006, -0.9, 'Δkat.', fontsize=6.3, ha='left')
    a1.legend(title='Perubahan bobot', fontsize=6.3, title_fontsize=6.5, loc='lower left', frameon=False)
    nama4 = list(dict.fromkeys(x['kriteria'] for x in s['kecamatan4']))
    for i, n in enumerate(nama4):
        for dlt in delta:
            r = next(x for x in s['kecamatan4'] if x['kriteria'] == n and x['delta'] == dlt)
            m, c = mk[dlt]
            a2.scatter(r['rhoKomoditasMin'], i + dlt * 1.2, marker=m, color=c, s=16, zorder=3)
    a2.set_yticks(range(len(nama4)), nama4); a2.set_xlim(0.85, 1.01); a2.invert_yaxis()
    a2.set_xlabel('ρ minimum peringkat komoditas'); a2.axvline(1, color='#999999', lw=0.6, ls='--')
    a2.set_title('(b) SAW 4 kriteria, 9 kecamatan', loc='left')
    for ax in (a1, a2):
        for sp in ['top', 'right']: ax.spines[sp].set_visible(False)
    fig.tight_layout(); simpan(fig, 'Gambar_7_Sensitivitas_Bobot.png')


if __name__ == '__main__':
    print('memuat lapisan…')
    padi = per_kelas('Kesesuaian_Lahan_Padi_Sawah')
    param = {'ph': per_kelas('Skor_pH_Tanah'), 'corg': per_kelas('Skor_C_Organik'), 'gambut': per_kelas('Skor_Ketebalan_Gambut'),
             'lereng': per_kelas('Skor_Lereng', 30), 'banjir': per_kelas('Skor_Bahaya_Banjir')}
    npz = np.load(os.path.join(DATA, 'grid_potensial.npz'))
    gambar_lokasi(padi)
    gambar_alir()
    gambar_parameter(param, padi)
    gambar_pembatas(npz)
    gambar_potensial(npz)
    gambar_potensial_desa()
    gambar_sensitivitas()
