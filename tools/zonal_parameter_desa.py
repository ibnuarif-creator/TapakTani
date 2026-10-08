"""
Zonal statistik 5 parameter kualitas lahan (data spasial parameter lahan) per desa
Kecamatan Rasau Jaya -> data/parameter_lahan_desa.js

Input : ../../newgjson/Skor_*.geojson  (atribut skor 1-4 = N/S3/S2/S1)
        data/rasau_jaya_desa.js         (batas desa)
Output: data/parameter_lahan_desa.js
  skor    = rata-rata skor tertimbang luas (dipakai SAW)
  kelas   = kelas dominan berdasarkan luas (dipakai kelas Juknis / hukum minimum)
  dist    = persentase luas tiap kelas
  cakupan = persentase luas desa yang tercakup data parameter

Jalankan: python tools/zonal_parameter_desa.py   (butuh shapely, pyproj)
"""
import json, os
from shapely.geometry import shape
from shapely.ops import transform, unary_union
from shapely import make_valid
from pyproj import Transformer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, '..', 'newgjson')
PARAMS = {  # key di website -> berkas data parameter
    'lereng': 'Skor_Lereng',
    'banjir': 'Skor_Bahaya_Banjir',
    'ph':     'Skor_pH_Tanah',
    'corg':   'Skor_C_Organik',
    'gambut': 'Skor_Ketebalan_Gambut',
}
KELAS = {4: 'S1', 3: 'S2', 2: 'S3', 1: 'N'}

to_utm = Transformer.from_crs(4326, 32749, always_xy=True).transform  # UTM 49S

def load_js_geojson(path):
    s = open(path, encoding='utf-8').read()
    return json.loads(s[s.index('{'):].rstrip().rstrip(';'))

desa = load_js_geojson(os.path.join(ROOT, 'data', 'rasau_jaya_desa.js'))
desa_geom = [(f['properties']['NAME_4'].replace(' Iii', ' III').replace(' Ii', ' II'), transform(to_utm, make_valid(shape(f['geometry']))))
             for f in desa['features']]

hasil = {nama: {} for nama, _ in desa_geom}
for key, fname in PARAMS.items():
    gj = json.load(open(os.path.join(SRC, fname + '.geojson'), encoding='utf-8'))
    per_skor = {}
    for f in gj['features']:
        per_skor.setdefault(int(f['properties']['skor']), []).append(make_valid(shape(f['geometry'])))
    per_skor = {s: transform(to_utm, unary_union(g).buffer(0)) for s, g in per_skor.items()}

    for nama, g in desa_geom:
        luas = {s: g.intersection(p).area for s, p in per_skor.items()}
        total = sum(luas.values())
        if total == 0:
            hasil[nama][key] = None
            continue
        dominan = max(luas, key=luas.get)
        hasil[nama][key] = {
            'skor': round(sum(s * a for s, a in luas.items()) / total, 3),
            'kelas': KELAS[dominan],
            'dist': {KELAS[s]: round(a / total * 100, 1) for s, a in sorted(luas.items(), reverse=True) if a > 0},
            'cakupan': round(total / g.area * 100, 1),
        }

out = os.path.join(ROOT, 'data', 'parameter_lahan_desa.js')
with open(out, 'w', encoding='utf-8') as fh:
    fh.write('// Parameter kualitas lahan per desa — Kecamatan Rasau Jaya\n')
    fh.write('// Sumber: data spasial parameter lahan (Skor_Lereng, Skor_Bahaya_Banjir, Skor_pH_Tanah,\n')
    fh.write('// Skor_C_Organik, Skor_Ketebalan_Gambut); skala skor 1–4 (N/S3/S2/S1).\n')
    fh.write('// Digenerasi oleh tools/zonal_parameter_desa.py — jangan diedit manual.\n')
    fh.write('const parameterLahanDesa = ' + json.dumps(hasil, ensure_ascii=False, indent=2) + ';\n')
print('ditulis:', out)
