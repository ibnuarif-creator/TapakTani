"""
Data zonasi agroekologi untuk website (data/zonasi.js), konsisten dengan Tabel 5 naskah JTEP-L:
klaster Ward (zonasi_lq_validasi.json), skor SAW rata-rata zona, unggulan aktual (LQ > 1) dan potensial.
Jalankan: python tools/buat_data_zonasi.py
"""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, '..', 'Paper', 'Gambar', 'data_analisis')
z = json.load(open(os.path.join(D, 'zonasi_lq_validasi.json'), encoding='utf-8'))
nama = json.load(open(os.path.join(D, 'saw_kecamatan.json'), encoding='utf-8'))['nama']
pol = {}
import csv
for r in csv.DictReader(open(os.path.join(ROOT, '..', 'data', 'agroraya_kecamatan_poligon_2022_2024.csv'), encoding='utf-8')):
    pol[r['kecamatan']] = r
# curah hujan: normal CHIRPS 1991–2020 (revisi A8)
for r in csv.DictReader(open(os.path.join(ROOT, '..', 'data', 'tapaktani_kecamatan_chirps_normal.csv'), encoding='utf-8')):
    pol[r['kecamatan']]['curah_hujan_mm'] = r['ch_normal_1991_2020']
fab = {r['kecamatan']: r for r in csv.DictReader(open(os.path.join(ROOT, '..', 'data', 'agroraya_kecamatan_fabdem.csv'), encoding='utf-8'))}

# 2 zona utama (k = 2: tekstur tanah; silhouette & lonjakan jarak gabung terbesar) dibelah menjadi 4 subzona (k = 4: curah hujan)
ZONA = [('A1', ['Sungai Kakap', 'Batu Ampar', 'Teluk Pakedai'], '#4A90C8', 'Zona A tekstur campuran — pesisir barat, curah hujan terendah'),
        ('A2', ['Sungai Raya', 'Terentang'], '#B5649A', 'Zona A tekstur campuran — curah hujan tinggi'),
        ('B1', ['Rasau Jaya', 'Kubu'], '#2B8A50', 'Zona B lempung liat berpasir — curah hujan sedang'),
        ('B2', ['Sungai Ambawang', 'Kuala Mandor B'], '#D9A21B', 'Zona B lempung liat berpasir — curah hujan tinggi')]
NM = lambda c: nama.get(c, c).split(' / ')[0]
ribu = lambda v: f'{v:,.0f}'.replace(',', '.')
koma = lambda v, d=2: f'{v:.{d}f}'.replace('.', ',')

out = []
for zn, ks, warna, judul in ZONA:
    zz = next(x for x in z['zona'] if sorted(x['kecamatan']) == sorted(ks))
    idx = [z['nama'].index(k) for k in ks]
    ch = [float(pol[k]['curah_hujan_mm']) for k in ks]
    el = [float(fab[k]['median']) for k in ks]
    scl, cl = [], []   # proporsi lempung liat berpasir (kode 6) dan lempung berliat (kode 4)
    for k in ks:
        h = {int(a): b for a, b in json.loads(pol[k]['tekstur_hist']).items()}
        scl.append(h.get(6, 0) / sum(h.values()) * 100); cl.append(h.get(4, 0) / sum(h.values()) * 100)
    rentang = lambda v: f'{round(min(v))}–{round(max(v))}%'
    if max(cl) >= 40:   # tekstur campuran: sebut kedua kelas, kelas dengan rerata lebih besar lebih dulu
        dua = [('lempung liat berpasir', scl), ('lempung berliat', cl)]
        dua.sort(key=lambda x: -sum(x[1]))
        tekstur = f'{dua[0][0].capitalize()} {rentang(dua[0][1])}, {dua[1][0]} {rentang(dua[1][1])}'
    else:
        tekstur = f'Lempung liat berpasir {rentang(scl)}'
    ciri = f'{tekstur}; curah hujan normal {ribu(min(ch))}–{ribu(max(ch))} mm/tahun; elevasi median {round(min(el))}–{round(max(el))} m dpl'
    aktual = [{'komoditas': NM(a['komoditas']), 'skor': a['skor'], 'kecamatan': a['kec_lq1'],
               'peringatan': NM(a['komoditas']) == 'Karet' and zn in ('A1', 'A2', 'B1')} for a in zz['unggulan_aktual']]
    # karet di zona pasang surut: skor model cenderung terlalu tinggi (validasi produksi ρ = −0,85; model tanpa drainase)
    akt_id = {a['komoditas'] for a in zz['unggulan_aktual']}
    # potensial: skor rata-rata zona ≥ 0,85, belum LQ > 1 (termasuk komoditas tanpa data produksi, mis. padi sawah)
    rata = {}
    for c in z['komoditas']:
        rata[c] = sum(b for b in [json.load(open(os.path.join(D, 'saw_matriks_lengkap.json'), encoding='utf-8'))['baris'][i]['skor'][z['komoditas'].index(c)] for i in idx]) / len(idx)
    potensial = [{'komoditas': NM(c), 'skor': round(v, 3), 'tanpaData': c not in z['lq'], 'peringatan': NM(c) == 'Karet' and zn in ('A1', 'A2', 'B1')}
                 for c, v in sorted(rata.items(), key=lambda x: -x[1]) if v >= z['ambang_unggulan'] and c not in akt_id]
    out.append({'zona': zn, 'judul': judul, 'warna': warna, 'kecamatan': ks, 'ciri': ciri,
                'teratas': [{'komoditas': NM(t['komoditas']), 'skor': t['skor']} for t in zz['teratas'][:4]],
                'aktual': aktual, 'potensial': potensial})

meta = {'silhouette2': round(z['silhouette']['2'], 2), 'silhouette': round(z['silhouette']['4'], 2), 'kofenetik': round(z['kofenetik'], 2), 'ambang': z['ambang_unggulan']}
js = ('// Zonasi agroekologi Kabupaten Kubu Raya — klaster Ward atas skor SAW 20 komoditas × 9 kecamatan,\n'
      '// unggulan aktual = skor rata-rata zona ≥ 0,85 dan LQ produksi BPS 2024 > 1; potensial = belum LQ > 1 / tanpa data produksi.\n'
      '// Dibuat otomatis oleh tools/buat_data_zonasi.py — jangan diedit manual.\n'
      'const zonasiAgroekologi = ' + json.dumps({'meta': meta, 'zona': out}, ensure_ascii=False, indent=1) + ';\n')
open(os.path.join(ROOT, 'data', 'zonasi.js'), 'w', encoding='utf-8').write(js)
for o in out:
    print(o['zona'], o['kecamatan'], '| aktual:', ', '.join(a['komoditas'] for a in o['aktual']), '| potensial:', ', '.join(p['komoditas'] for p in o['potensial']))
