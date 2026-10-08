"""
Pengolahan Kesesuaian_Lahan_Padi_Sawah.geojson (data spasial parameter lahan)
untuk halaman Sebaran -> data/padi_sawah.js

Input : ../../newgjson/Kesesuaian_Lahan_Padi_Sawah.geojson  (atribut kelas S1/S2/S3/N, skor 4..1)
        data/rasau_jaya_desa.js                             (batas desa Rasau Jaya)
Output: data/padi_sawah.js berisi konstanta padiSawahData:
  kelas  : GeoJSON poligon yang digabung (dissolve) per kelas & disederhanakan
  heat   : titik grid [lat, lng, intensitas] untuk heatmap; intensitas = (skor - 1) / 3
  ringkas: luas (ha) per kelas
  desa   : luas (ha) per kelas untuk tiap desa + bagian di luar batas desa

Jalankan: python tools/olah_padi_sawah.py   (butuh shapely, pyproj, numpy)
"""
import json, os
import numpy as np
import shapely
from shapely.geometry import shape, mapping
from shapely.ops import transform, unary_union
from shapely import make_valid
from pyproj import Transformer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, '..', 'newgjson', 'Kesesuaian_Lahan_Padi_Sawah.geojson')
GRID_M = 200          # jarak titik heatmap (meter)
SIMPLIFY_M = 30       # toleransi penyederhanaan poligon (meter)
MIN_FRAGMEN_HA = 0.5  # bagian/lubang poligon lebih kecil dari ini dibuang dari tampilan peta
                      # (noise khas data hasil raster); statistik luas tetap dari data asli
SKOR = {'S1': 4, 'S2': 3, 'S3': 2, 'N': 1}

to_utm = Transformer.from_crs(4326, 32749, always_xy=True).transform
to_wgs = Transformer.from_crs(32749, 4326, always_xy=True).transform

def load_js_geojson(path):
    s = open(path, encoding='utf-8').read()
    return json.loads(s[s.index('{'):].rstrip().rstrip(';'))

def bulatkan(geom, nd=5):
    return shapely.set_precision(geom, 10 ** -nd)

def buang_fragmen(geom, min_m2):
    """Hapus bagian poligon dan lubang yang luasnya < min_m2 (geometri UTM)."""
    bagian = []
    for p in getattr(geom, 'geoms', [geom]):
        if p.area < min_m2:
            continue
        lubang = [r for r in p.interiors if shapely.Polygon(r).area >= min_m2]
        bagian.append(shapely.Polygon(p.exterior, lubang))
    return shapely.MultiPolygon(bagian)

# ── 1. Dissolve per kelas (dalam UTM agar luas & toleransi dalam meter) ──
gj = json.load(open(SRC, encoding='utf-8'))
per_kelas = {}
for f in gj['features']:
    per_kelas.setdefault(f['properties']['kelas'], []).append(make_valid(shape(f['geometry'])))
per_kelas = {k: transform(to_utm, unary_union(v)).buffer(0) for k, v in per_kelas.items()}

ringkas = {k: round(g.area / 1e4, 1) for k, g in per_kelas.items()}

fitur = []
for k in ['S1', 'S2', 'S3', 'N']:
    if k not in per_kelas:
        continue
    g = buang_fragmen(per_kelas[k], MIN_FRAGMEN_HA * 1e4)
    g = g.simplify(SIMPLIFY_M, preserve_topology=True)
    g = bulatkan(transform(to_wgs, g))
    fitur.append({'type': 'Feature', 'properties': {'kelas': k, 'skor': SKOR[k], 'luas_ha': ringkas[k]},
                  'geometry': mapping(g)})

# ── 2. Titik grid untuk heatmap ──
semua = unary_union(list(per_kelas.values()))
minx, miny, maxx, maxy = semua.bounds
xs, ys = np.meshgrid(np.arange(minx, maxx, GRID_M), np.arange(miny, maxy, GRID_M))
xs, ys = xs.ravel(), ys.ravel()
heat = []
for k, g in per_kelas.items():
    nilai = (SKOR[k] - 1) / 3
    if nilai <= 0:
        continue  # kelas N tidak ikut memanaskan peta
    shapely.prepare(g)
    m = shapely.contains_xy(g, xs, ys)
    lon, lat = to_wgs(xs[m], ys[m])
    heat += [[round(float(a), 5), round(float(o), 5), round(nilai, 2)] for a, o in zip(lat, lon)]

# ── 3. Statistik per desa ──
desa = load_js_geojson(os.path.join(ROOT, 'data', 'rasau_jaya_desa.js'))
per_desa = []
gabungan_desa = []
for f in desa['features']:
    g = transform(to_utm, make_valid(shape(f['geometry'])))
    gabungan_desa.append(g)
    luas = {k: round(g.intersection(p).area / 1e4, 1) for k, p in per_kelas.items()}
    per_desa.append({'desa': f['properties']['NAME_4'].replace(' Iii', ' III').replace(' Ii', ' II'), 'luas_desa_ha': round(g.area / 1e4, 1),
                     **{k: luas.get(k, 0.0) for k in ['S1', 'S2', 'S3', 'N']}})
luar = semua.difference(unary_union(gabungan_desa))
luar_kelas = {k: round(p.intersection(luar).area / 1e4, 1) for k, p in per_kelas.items()}

data = {
    'sumber': 'Kesesuaian_Lahan_Padi_Sawah.geojson (data spasial parameter lahan)',
    'ringkas': {k: ringkas.get(k, 0.0) for k in ['S1', 'S2', 'S3', 'N']},
    'desa': per_desa,
    'luarDesa': {k: luar_kelas.get(k, 0.0) for k in ['S1', 'S2', 'S3', 'N']},
    'kelas': {'type': 'FeatureCollection', 'features': fitur},
    'heat': heat,
}
out = os.path.join(ROOT, 'data', 'padi_sawah.js')
with open(out, 'w', encoding='utf-8') as fh:
    fh.write('// Kesesuaian lahan padi sawah — Kecamatan Rasau Jaya (data spasial parameter lahan)\n')
    fh.write('// Digenerasi oleh tools/olah_padi_sawah.py — jangan diedit manual.\n')
    fh.write('const padiSawahData = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')
print('ditulis:', out, '| ukuran KB:', round(os.path.getsize(out) / 1024), '| titik heat:', len(heat))
print('ringkas:', data['ringkas'])
for d in per_desa: print(d)
print('luar desa:', data['luarDesa'])
