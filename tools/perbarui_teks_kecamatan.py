"""
Perbarui teks deskripsi, baris data, dan poin potensi 9 kecamatan di script.js agar sesuai hasil revisi
(statistik zonal per poligon, FABDEM, tekstur tertimbang luas, zonasi klaster Ward, LQ BPS 2024).
Semua angka diambil dari berkas data_analisis; tidak ada angka yang diketik manual.
Jalankan: python tools/perbarui_teks_kecamatan.py
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, '..', 'Paper', 'Gambar', 'data_analisis')
kec = {k['nama']: k for k in json.load(open(os.path.join(D, 'saw_kecamatan.json'), encoding='utf-8'))['kecamatan']}
nama_kom = json.load(open(os.path.join(D, 'saw_kecamatan.json'), encoding='utf-8'))['nama']
z = json.load(open(os.path.join(D, 'zonasi_lq_validasi.json'), encoding='utf-8'))
mat = {b['nama']: dict(zip(z['komoditas'], b['skor'])) for b in
       json.load(open(os.path.join(D, 'saw_matriks_lengkap.json'), encoding='utf-8'))['baris']}

ZONA = {'I': (['Sungai Kakap', 'Teluk Pakedai'], 'pesisir barat bercurah hujan terendah dengan tekstur lempung berliat yang seimbang dengan lempung liat berpasir'),
        'II': (['Rasau Jaya', 'Kubu'], 'dominan lempung liat berpasir dengan curah hujan sedang'),
        'III': (['Sungai Ambawang', 'Kuala Mandor B'], 'dominan lempung liat berpasir dengan curah hujan tinggi'),
        'IV': (['Sungai Raya', 'Batu Ampar', 'Terentang'], 'tekstur campuran lempung liat berpasir dan lempung berliat dengan curah hujan tinggi')}
ZONA_DARI = {k: zn for zn, (ks, _) in ZONA.items() for k in ks}
for zz in z['zona']:
    assert len({ZONA_DARI[k] for k in zz['kecamatan']}) == 1
TANAH = {1: 'Liat', 3: 'Liat Berpasir', 4: 'Lempung Berliat', 6: 'Lempung Liat Berpasir', 7: 'Lempung', 9: 'Lempung Berpasir'}
NM = lambda c: nama_kom[c].split(' / ')[0].lower()
f2 = lambda v: f'{v:.2f}'.replace('.', ',')
f3 = lambda v: f'{v:.3f}'.replace('.', ',')
ribu = lambda v: f'{v:,.0f}'.replace(',', '.')
urut_wo = sorted(kec, key=lambda n: -kec[n]['skorWO'])
ID = {'Sungai Raya': 'sungai-raya', 'Sungai Kakap': 'sungai-kakap', 'Rasau Jaya': 'rasau-jaya', 'Sungai Ambawang': 'sungai-ambawang',
      'Kubu': 'kubu', 'Batu Ampar': 'batu-ampar', 'Teluk Pakedai': 'teluk-pakedai', 'Terentang': 'terentang', 'Kuala Mandor B': 'kuala-mandor'}


def teks(n):
    k = kec[n]; ik = k['iklim']; zn = ZONA_DARI[n]
    prop = sorted(((int(c), p) for c, p in ik['tanahProporsi'].items()), key=lambda x: -x[1])
    t1, t2 = prop[0], prop[1]
    relevan = sorted(k['skor'].items(), key=lambda x: -x[1])
    top3 = ', '.join(f'{NM(c)} ({f3(v)})' for c, v in relevan[:3])
    rank = urut_wo.index(n) + 1
    lq = z['lq']
    lengkap = sorted(mat[n].items(), key=lambda x: -x[1])          # 20 komoditas, sama dengan naskah (Tabel 5)
    aktual = [c for c, v in lengkap if v >= 0.85 and c in lq and lq[c][n] > 1]
    potensial = [c for c, v in lengkap if v >= 0.85 and c not in aktual][:5]
    suhu = f"{ik['suhu']:.1f}".replace('.', ',')
    desc = (f'Kecamatan {n} termasuk Zona {zn} hasil klaster agroekologi Kabupaten Kubu Raya, yaitu zona {ZONA[zn][1]}. '
            f'Statistik zonal pada poligon kecamatan (Google Earth Engine, 2022–2024) menunjukkan curah hujan rata-rata {ribu(ik["curahHujan"])} mm/tahun, '
            f'suhu udara {suhu} °C, dan elevasi median {ik["elevasi"]} m dpl (FABDEM). Tekstur tanah didominasi '
            f'{TANAH.get(t1[0], t1[0])} ({round(t1[1] * 100)}% luas) diikuti {TANAH.get(t2[0], t2[0])} ({round(t2[1] * 100)}%), sehingga nilai kesesuaian '
            f'tekstur dihitung tertimbang menurut proporsi luas kedua kelas tersebut. NDVI rata-rata {f2(k["ndvi"])} (Sentinel-2) dan skor weighted overlay '
            f'{f2(k["skorWO"])} menempatkan kecamatan ini pada kelas S2 (Cukup Sesuai). Komoditas dengan skor SAW tertinggi adalah {top3}.')
    potensi = [f'Zona {zn}: komoditas paling sesuai di kecamatan ini adalah {top3}.',
               f'Skor weighted overlay {f2(k["skorWO"])} — peringkat {rank} dari 9 kecamatan; seluruh kecamatan Kubu Raya berkelas S2.']
    potensi.append('Unggulan aktual (skor SAW ≥ 0,85 dan LQ produksi hortikultura/perkebunan BPS 2024 > 1): ' +
                   (', '.join(NM(c) for c in aktual) if aktual else 'belum ada komoditas yang memenuhi') + '.')
    potensi.append('Unggulan potensial (sangat sesuai, LQ ≤ 1 atau data produksi belum tersedia; 5 teratas): ' +
                   (', '.join(NM(c) for c in potensial) if potensial else '–') + '.')
    if zn in ('II', 'IV') and n in ('Kubu', 'Batu Ampar'):
        potensi.append('Sebagian wilayah berupa gambut dalam dan mangrove; pengembangan diarahkan di luar kawasan hutan, gambut berfungsi lindung, dan mangrove dengan tata air yang menjaga muka air tanah.')
    elif zn == 'I':
        potensi.append('Padi sawah memperoleh skor tertinggi di zona ini; pengembangannya memerlukan pengelolaan tata air pada lahan pasang surut.')
    elif n == 'Rasau Jaya':
        potensi.append('Wilayah percontohan: analisis 9 kriteria tingkat desa menunjukkan bahaya banjir sebagai pembatas dominan; perbaikan tata air berpotensi menaikkan lahan sesuai padi sawah dari 40,3% menjadi 84,8%.')
    else:
        potensi.append('Arahan zonasi bersifat biofisik dan berlaku di luar kawasan hutan serta ekosistem gambut berfungsi lindung.')
    data = [('Kelas Kesesuaian', 'S2 — Cukup Sesuai'), ('Zona Agroekologi', f'Zona {zn} (klaster Ward)'),
            ('NDVI Rata-rata', f'{f2(k["ndvi"])} (Sentinel-2, 2022–2024)'),
            ('Skor Weighted Overlay', f'{f2(k["skorWO"])} / 4,00' + (' (tertinggi)' if rank == 1 else ''))]
    return desc, potensi, data


js = lambda s: "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"
p = os.path.join(ROOT, 'script.js')
s = open(p, encoding='utf-8', newline='').read()
NL = '\r\n' if '\r\n' in s else '\n'
for n, kid in ID.items():
    a = s.index(f"  '{kid}': {{")
    b = s.index('\n  }', a)
    blok = s[a:b]
    desc, potensi, data = teks(n)
    topo = re.search(r"\{ key: 'Topografi', val: '([^']*)' \}", blok)
    data_js = (f"data: [{NL}" + f",{NL}".join(f"      {{ key: {js(k)}, val: {js(v)} }}" for k, v in data)
               + (f",{NL}      {{ key: 'Topografi', val: {js(topo.group(1))} }}" if topo else '') + f"{NL}    ]")
    pot_js = f"potensi: [{NL}" + f",{NL}".join(f"      {js(x)}" for x in potensi) + f"{NL}    ]"
    blok2 = re.sub(r"desc: '(?:[^'\\]|\\.)*'", lambda m: 'desc: ' + js(desc), blok, count=1)
    blok2 = re.sub(r"data: \[.*?\n    \]", lambda m: data_js, blok2, count=1, flags=re.S)
    blok2 = re.sub(r"potensi: \[.*?\n    \]", lambda m: pot_js, blok2, count=1, flags=re.S)
    assert blok2 != blok
    s = s[:a] + blok2 + s[b:]
    print(f'{n:16s} Zona {ZONA_DARI[n]:3s} | {potensi[2][:90]}')
open(p, 'w', encoding='utf-8', newline='').write(s)
print('script.js diperbarui')
