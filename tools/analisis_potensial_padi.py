"""
Analisis kesesuaian lahan AKTUAL vs POTENSIAL padi sawah — Kecamatan Rasau Jaya
(paper JTEP-L). Mengacu konsep Juknis BBSDLP: kesesuaian potensial = kelas setelah
faktor pembatas yang dapat diperbaiki ditangani.

Metode (grid titik 50 m, tiap titik mewakili 0,25 ha):
  - kelas aktual  = kelas pada Kesesuaian_Lahan_Padi_Sawah (data parameter lahan)
  - parameter     = kelas pH (nr), C-organik (nr), ketebalan gambut (rc), lereng (eh), banjir (fh)
  - pembatas titik S3 = parameter yang berkelas S3/N di titik itu
  - Skenario A (perbaikan tata air)            : S3 -> S2 bila satu-satunya pembatas = banjir
  - Skenario B (tata air + ameliorasi kapur)   : S3 -> S2 bila pembatas hanya banjir dan/atau pH
  - Titik S3 tanpa parameter S3/N = pembatas di luar kelima parameter (tetap S3)

Output: ../Paper/Gambar/data_analisis/potensial_padi.json + grid_potensial.npz (untuk peta)
Jalankan: python tools/analisis_potensial_padi.py
"""
import json, os
import numpy as np
import shapely
from shapely.geometry import shape
from shapely.ops import transform, unary_union
from shapely import make_valid
from pyproj import Transformer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, '..', 'newgjson')
OUT = os.path.join(ROOT, '..', 'Paper', 'Gambar', 'data_analisis')
os.makedirs(OUT, exist_ok=True)
GRID = 50.0
HA_TITIK = GRID * GRID / 1e4
SKOR_KELAS = {4: 'S1', 3: 'S2', 2: 'S3', 1: 'N'}
to_utm = Transformer.from_crs(4326, 32749, always_xy=True).transform

def per_kelas(nama):
    gj = json.load(open(os.path.join(SRC, nama + '.geojson'), encoding='utf-8'))
    d = {}
    for f in gj['features']:
        d.setdefault(SKOR_KELAS[int(f['properties']['skor'])], []).append(make_valid(shape(f['geometry'])))
    return {k: transform(to_utm, unary_union(v)).buffer(0) for k, v in d.items()}

def klasifikasi(lapis, xs, ys):
    hasil = np.full(xs.shape, '', dtype=object)
    for k, g in lapis.items():
        shapely.prepare(g)
        m = (hasil == '') & shapely.contains_xy(g, xs, ys)
        hasil[m] = k
    return hasil

padi = per_kelas('Kesesuaian_Lahan_Padi_Sawah')
param = {
    'ph': per_kelas('Skor_pH_Tanah'), 'corg': per_kelas('Skor_C_Organik'),
    'gambut': per_kelas('Skor_Ketebalan_Gambut'), 'lereng': per_kelas('Skor_Lereng'),
    'banjir': per_kelas('Skor_Bahaya_Banjir'),
}
semua = unary_union(list(padi.values()))
minx, miny, maxx, maxy = semua.bounds
xs, ys = np.meshgrid(np.arange(minx + GRID / 2, maxx, GRID), np.arange(miny + GRID / 2, maxy, GRID))
xs, ys = xs.ravel(), ys.ravel()
aktual = klasifikasi(padi, xs, ys)
m = aktual != ''
xs, ys, aktual = xs[m], ys[m], aktual[m]
kelas_param = {p: klasifikasi(g, xs, ys) for p, g in param.items()}

# desa
s = open(os.path.join(ROOT, 'data', 'rasau_jaya_desa.js'), encoding='utf-8').read()
desa_gj = json.loads(s[s.index('{'):].rstrip().rstrip(';'))
desa = np.full(xs.shape, 'Di luar batas desa', dtype=object)
for f in desa_gj['features']:
    g = transform(to_utm, make_valid(shape(f['geometry'])))
    shapely.prepare(g)
    desa[shapely.contains_xy(g, xs, ys)] = f['properties']['NAME_4'].replace(' Iii', ' III').replace(' Ii', ' II')

buruk = {p: np.isin(v, ['S3', 'N']) for p, v in kelas_param.items()}
tanpa_data = {p: (v == '') for p, v in kelas_param.items()}
lain = buruk['corg'] | buruk['gambut'] | buruk['lereng']
s3 = aktual == 'S3'
hanya_fh = s3 & buruk['banjir'] & ~buruk['ph'] & ~lain
hanya_nr = s3 & buruk['ph'] & ~buruk['banjir'] & ~lain
fh_nr = s3 & buruk['banjir'] & buruk['ph'] & ~lain
dgn_lain = s3 & lain
tanpa_pembatas = s3 & ~buruk['banjir'] & ~buruk['ph'] & ~lain

pot_a = aktual.copy(); pot_a[hanya_fh] = 'S2'
pot_b = aktual.copy(); pot_b[hanya_fh | hanya_nr | fh_nr] = 'S2'

def ringkas(maska):
    r = {}
    for nama, arr in [('aktual', aktual), ('potensial_A', pot_a), ('potensial_B', pot_b)]:
        r[nama] = {k: round(float(((arr == k) & maska).sum() * HA_TITIK), 1) for k in ['S1', 'S2', 'S3', 'N']}
    r['dekomposisi_S3'] = {
        'hanya_banjir_fh': round(float((hanya_fh & maska).sum() * HA_TITIK), 1),
        'hanya_pH_nr': round(float((hanya_nr & maska).sum() * HA_TITIK), 1),
        'banjir_dan_pH': round(float((fh_nr & maska).sum() * HA_TITIK), 1),
        'melibatkan_eh_rc_nr_lain': round(float((dgn_lain & maska).sum() * HA_TITIK), 1),
        'pembatas_di_luar_5_parameter': round(float((tanpa_pembatas & maska).sum() * HA_TITIK), 1),
    }
    r['total_ha'] = round(float(maska.sum() * HA_TITIK), 1)
    return r

hasil = {'grid_m': GRID, 'jumlah_titik': int(len(xs)),
         'cakupan_parameter_pct': {p: round(float((~tanpa_data[p]).mean() * 100), 1) for p in param},
         'total': ringkas(np.ones(xs.shape, bool)),
         'desa': {d: ringkas(desa == d) for d in sorted(set(desa))}}
json.dump(hasil, open(os.path.join(OUT, 'potensial_padi.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
np.savez_compressed(os.path.join(OUT, 'grid_potensial.npz'), x=xs, y=ys, aktual=aktual.astype('U2'),
                    pot_a=pot_a.astype('U2'), pot_b=pot_b.astype('U2'),
                    pembatas=np.select([hanya_fh, hanya_nr, fh_nr, dgn_lain, tanpa_pembatas],
                                       ['fh', 'nr', 'fh+nr', 'lain', 'luar'], default='').astype('U5'))

t = hasil['total']
print('titik', len(xs), '| cakupan parameter', hasil['cakupan_parameter_pct'])
for k in ['aktual', 'potensial_A', 'potensial_B']:
    v = t[k]; print(f"{k:12s}", v, '| S1+S2 =', round(v['S1'] + v['S2'], 1), 'ha')
print('dekomposisi S3:', t['dekomposisi_S3'])
for d, r in hasil['desa'].items():
    a, b = r['aktual'], r['potensial_B']
    print(f"{d:20s} total {r['total_ha']:8.1f} | S1+S2 aktual {a['S1']+a['S2']:8.1f} -> A {r['potensial_A']['S1']+r['potensial_A']['S2']:8.1f} -> B {b['S1']+b['S2']:8.1f}")
