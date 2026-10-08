"""
Perbarui data kecamatan website dari hasil GEE per poligon (Okt 2026):
  data/agroraya_kecamatan_poligon_2022_2024.csv  (CHIRPS, ERA5-Land, OpenLandMap, Sentinel-2, akses, skor WO)
  data/agroraya_kecamatan_fabdem.csv             (elevasi permukaan tanah FABDEM, median)
  data/tapaktani_kecamatan_chirps_normal.csv     (normal curah hujan CHIRPS 1991–2020)
→ data/syarat_tumbuh.js       blok iklimKecamatan (+ tanahProporsi untuk nilai tekstur tertimbang luas)
→ data/kesesuaian_data_v2.js  atribut ndvi, skor, kelas, luas_s1, luas_s2, data_status
Jalankan: python tools/perbarui_data_kecamatan.py
"""
import csv, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SUMBER = os.path.join(ROOT, '..', 'data')
ID = {'Sungai Raya': 'sungai-raya', 'Sungai Kakap': 'sungai-kakap', 'Rasau Jaya': 'rasau-jaya',
      'Sungai Ambawang': 'sungai-ambawang', 'Kubu': 'kubu', 'Batu Ampar': 'batu-ampar',
      'Teluk Pakedai': 'teluk-pakedai', 'Terentang': 'terentang', 'Kuala Mandor B': 'kuala-mandor'}
TANAH = {1: 'Clay', 2: 'Silty Clay', 3: 'Sandy Clay', 4: 'Clay Loam', 5: 'Silty Clay Loam', 6: 'Sandy Clay Loam',
         7: 'Loam', 8: 'Silty Loam', 9: 'Sandy Loam', 10: 'Silt', 11: 'Loamy Sand', 12: 'Sand'}

poligon = {r['kecamatan']: r for r in csv.DictReader(open(os.path.join(SUMBER, 'agroraya_kecamatan_poligon_2022_2024.csv'), encoding='utf-8'))}
fabdem = {r['kecamatan']: r for r in csv.DictReader(open(os.path.join(SUMBER, 'agroraya_kecamatan_fabdem.csv'), encoding='utf-8'))}
# Curah hujan: normal 30 tahun CHIRPS 1991–2020 (catatan revisi A8), menggantikan rerata 2022–2024
normal = {r['kecamatan']: r for r in csv.DictReader(open(os.path.join(SUMBER, 'tapaktani_kecamatan_chirps_normal.csv'), encoding='utf-8'))}
for k in poligon:
    poligon[k]['curah_hujan_mm'] = normal[k]['ch_normal_1991_2020']
assert set(poligon) == set(ID) == set(fabdem)


def kelas_wo(skor):
    return 'S1' if skor >= 3.5 else 'S2' if skor >= 2.5 else 'S3' if skor >= 1.5 else 'N'


# ── 1. iklimKecamatan ──
blok = ['const iklimKecamatan = {']
for nama, kid in ID.items():
    p, f = poligon[nama], fabdem[nama]
    hist = {int(k): v for k, v in json.loads(p['tekstur_hist']).items()}
    tot = sum(hist.values())
    prop = {k: round(v / tot, 3) for k, v in sorted(hist.items(), key=lambda kv: -kv[1]) if v / tot >= 0.001}
    dom = max(hist, key=hist.get)
    blok.append(f"  '{kid}': {{\n"
                f"    curahHujan: {round(float(p['curah_hujan_mm']))}, suhu: {float(p['suhu_c']):.1f}, "
                f"elevasi: {round(float(f['median']))}, kodeTanah: {dom},\n"
                f"    namaTanah: '{TANAH[dom]}', dataStatus: 'real',\n"
                f"    tanahProporsi: {{ {', '.join(f'{k}: {v}' for k, v in prop.items())} }}\n  }},")
blok[-1] = blok[-1].rstrip(',')
blok.append('};')
baru = '\n'.join(blok)

p_st = os.path.join(ROOT, 'data', 'syarat_tumbuh.js')
s = open(p_st, encoding='utf-8-sig').read()
s = re.sub(r'// Data iklim & fisik per kecamatan.*?\n};', lambda m: (
    '// Data iklim & fisik per kecamatan — statistik zonal per POLIGON kecamatan (GEE, Okt 2026):\n'
    '//   curahHujan = normal CHIRPS 1991–2020 (mm/tahun), suhu = ERA5-Land 2022–2024 (°C),\n'
    '//   elevasi = median FABDEM (m dpl, tanpa pengaruh tajuk/bangunan),\n'
    '//   kodeTanah/namaTanah = kelas tekstur USDA dominan (OpenLandMap),\n'
    '//   tanahProporsi = proporsi luas tiap kelas tekstur → nilai r tekstur tertimbang luas\n' + baru), s, count=1, flags=re.S)
s = s.replace('// Iklim: CHIRPS v2 + ERA5-Land + SRTM + OpenLandMap (GEE 2022–2024)',
              '// Iklim: CHIRPS v2 + ERA5-Land + FABDEM + OpenLandMap (GEE 2022–2024, per poligon kecamatan)')
open(p_st, 'w', encoding='utf-8').write(s)
print('syarat_tumbuh.js diperbarui')

# ── 2. atribut peta kecamatan ──
p_kd = os.path.join(ROOT, 'data', 'kesesuaian_data_v2.js')
t = open(p_kd, encoding='utf-8-sig').read()
awal = t.index('{'); akhir = t.rstrip().rstrip(';').rindex('}') + 1
gj = json.loads(t[awal:akhir])
for ft in gj['features']:
    pr = ft['properties']
    nama = pr['NAME_3'].replace("Telok Pa'Kedai", 'Teluk Pakedai')
    p = poligon[nama]
    kh = {int(k): v for k, v in json.loads(p['kelas_wo_hist']).items()}     # piksel 100 m = 1 ha
    pr['ndvi'] = round(float(p['NDVI']), 3)
    pr['skor'] = round(float(p['skor_wo']), 2)
    pr['kelas'] = kelas_wo(float(p['skor_wo']))
    pr['luas_s1'] = round(kh.get(4, 0) / 100) * 100
    pr['luas_s2'] = round(kh.get(3, 0) / 100) * 100
    pr['data_status'] = 'real'
open(p_kd, 'w', encoding='utf-8').write(t[:awal] + json.dumps(gj, ensure_ascii=False, separators=(',', ':')) + t[akhir:])
print('kesesuaian_data_v2.js diperbarui')
for ft in gj['features']:
    pr = ft['properties']; print(f"  {pr['NAME_3']:16s} ndvi {pr['ndvi']}  skor {pr['skor']}  {pr['kelas']}  S1 {pr['luas_s1']} ha  S2 {pr['luas_s2']} ha")
