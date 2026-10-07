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
fab = {r['kecamatan']: r for r in csv.DictReader(open(os.path.join(ROOT, '..', 'data', 'agroraya_kecamatan_fabdem.csv'), encoding='utf-8'))}

ZONA = [('I', ['Sungai Kakap', 'Teluk Pakedai'], '#4A90C8', 'Pesisir barat, curah hujan terendah'),
        ('II', ['Rasau Jaya', 'Kubu'], '#2B8A50', 'Lempung liat berpasir, curah hujan sedang'),
        ('III', ['Sungai Ambawang', 'Kuala Mandor B'], '#D9A21B', 'Lempung liat berpasir, curah hujan tinggi'),
        ('IV', ['Sungai Raya', 'Batu Ampar', 'Terentang'], '#B5649A', 'Tekstur campuran, curah hujan tinggi')]
NM = lambda c: nama.get(c, c).split(' / ')[0]
ribu = lambda v: f'{v:,.0f}'.replace(',', '.')
koma = lambda v, d=2: f'{v:.{d}f}'.replace('.', ',')

out = []
for zn, ks, warna, judul in ZONA:
    zz = next(x for x in z['zona'] if sorted(x['kecamatan']) == sorted(ks))
    idx = [z['nama'].index(k) for k in ks]
    ch = [float(pol[k]['curah_hujan_mm']) for k in ks]
    el = [float(fab[k]['median']) for k in ks]
    scl = []
    for k in ks:
        h = {int(a): b for a, b in json.loads(pol[k]['tekstur_hist']).items()}
        scl.append(h.get(6, 0) / sum(h.values()) * 100)
    ciri = (f'Lempung liat berpasir {round(min(scl))}–{round(max(scl))}%; curah hujan {ribu(min(ch))}–{ribu(max(ch))} mm/tahun; '
            f'elevasi median {round(min(el))}–{round(max(el))} m dpl')
    aktual = [{'komoditas': NM(a['komoditas']), 'skor': a['skor'], 'kecamatan': a['kec_lq1']} for a in zz['unggulan_aktual']]
    akt_id = {a['komoditas'] for a in zz['unggulan_aktual']}
    # potensial: skor rata-rata zona ≥ 0,85, belum LQ > 1 (termasuk komoditas tanpa data produksi, mis. padi sawah)
    rata = {}
    for c in z['komoditas']:
        rata[c] = sum(b for b in [json.load(open(os.path.join(D, 'saw_matriks_lengkap.json'), encoding='utf-8'))['baris'][i]['skor'][z['komoditas'].index(c)] for i in idx]) / len(idx)
    potensial = [{'komoditas': NM(c), 'skor': round(v, 3), 'tanpaData': c not in z['lq']}
                 for c, v in sorted(rata.items(), key=lambda x: -x[1]) if v >= z['ambang_unggulan'] and c not in akt_id]
    out.append({'zona': zn, 'judul': judul, 'warna': warna, 'kecamatan': ks, 'ciri': ciri,
                'teratas': [{'komoditas': NM(t['komoditas']), 'skor': t['skor']} for t in zz['teratas'][:4]],
                'aktual': aktual, 'potensial': potensial})

meta = {'silhouette': round(z['silhouette']['4'], 2), 'kofenetik': round(z['kofenetik'], 2), 'ambang': z['ambang_unggulan']}
js = ('// Zonasi agroekologi Kabupaten Kubu Raya — klaster Ward atas skor SAW 20 komoditas × 9 kecamatan,\n'
      '// unggulan aktual = skor rata-rata zona ≥ 0,85 dan LQ produksi BPS 2024 > 1; potensial = belum LQ > 1 / tanpa data produksi.\n'
      '// Dibuat otomatis oleh tools/buat_data_zonasi.py — jangan diedit manual.\n'
      'const zonasiAgroekologi = ' + json.dumps({'meta': meta, 'zona': out}, ensure_ascii=False, indent=1) + ';\n')
open(os.path.join(ROOT, 'data', 'zonasi.js'), 'w', encoding='utf-8').write(js)
for o in out:
    print(o['zona'], o['kecamatan'], '| aktual:', ', '.join(a['komoditas'] for a in o['aktual']), '| potensial:', ', '.join(p['komoditas'] for p in o['potensial']))
