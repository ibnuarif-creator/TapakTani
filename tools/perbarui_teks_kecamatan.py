"""
Perbarui teks deskripsi, baris data, poin potensi, tag komoditas, dan tagline 9 kecamatan di script.js,
serta kartu kecamatan statis di index.html, agar sesuai naskah JTEP-L (revisi Okt 2026):
  - skor weighted overlay = indeks kondisi lahan (Tinggi/Sedang/Rendah), bukan kelas kesesuaian S1–N
  - unggulan aktual/potensial memakai definisi zona yang sama dengan Tabel 4 naskah (data/zonasi.js)
  - karet di zona pasang surut (I, II, IV) diberi catatan: skornya cenderung terlalu tinggi (validasi produksi)
  - tag komoditas diturunkan dari hasil zonasi; topografi dari elevasi median FABDEM
Semua angka diambil dari berkas data_analisis dan data/zonasi.js; tidak ada angka yang diketik manual.
Jalankan: python tools/buat_data_zonasi.py ; python tools/perbarui_teks_kecamatan.py
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, '..', 'Paper', 'Gambar', 'data_analisis')
kec = {k['nama']: k for k in json.load(open(os.path.join(D, 'saw_kecamatan.json'), encoding='utf-8'))['kecamatan']}
nama_kom = json.load(open(os.path.join(D, 'saw_kecamatan.json'), encoding='utf-8'))['nama']
zs = open(os.path.join(ROOT, 'data', 'zonasi.js'), encoding='utf-8').read()
ZONASI = json.loads(zs[zs.index('{'):zs.rindex('}') + 1])
ZONA_DARI = {k: z for z in ZONASI['zona'] for k in z['kecamatan']}
pot = json.load(open(os.path.join(D, 'potensial_padi.json'), encoding='utf-8'))['desa']

TANAH = {1: 'Liat', 3: 'Liat Berpasir', 4: 'Lempung Berliat', 6: 'Lempung Liat Berpasir', 7: 'Lempung', 9: 'Lempung Berpasir'}
IKON = {'Padi Sawah': '🌾', 'Kelapa': '🥥', 'Karet': '🌳', 'Sagu': '🌴', 'Pisang': '🍌', 'Nanas': '🍍', 'Pinang': '🌴',
        'Kakao': '🍫', 'Jagung': '🌽', 'Cabai': '🌶️', 'Semangka': '🍉', 'Kopi Robusta': '☕', 'Ubi Kayu': '🥔', 'Pepaya': '🍈',
        'Jeruk Siam': '🍊', 'Lada': '🫑', 'Durian': '🍈', 'Jahe': '🫚', 'Daun Bawang': '🧅', 'Langsat': '🍇',
        'Jambu Biji': '🍐', 'Alpukat': '🥑'}
TAGLINE = {'Rasau Jaya': 'Kawasan Transmigrasi Lahan Pasang Surut', 'Teluk Pakedai': 'Sentra Buah & Pinang Pesisir',
           'Kuala Mandor B': 'Sentra Karet Lahan Daratan'}
KARET_PASANG_SURUT = {'A1', 'A2', 'B1'}      # karet dinilai terlalu tinggi oleh model di lahan pasang surut (ρ = −0,85)
f2 = lambda v: f'{v:.2f}'.replace('.', ',')
f3 = lambda v: f'{v:.3f}'.replace('.', ',')
ribu = lambda v: f'{v:,.0f}'.replace(',', '.')
pct = lambda v: f'{v:.1f}'.replace('.', ',')
urut_wo = sorted(kec, key=lambda n: -kec[n]['skorWO'])
ID = {'Sungai Raya': 'sungai-raya', 'Sungai Kakap': 'sungai-kakap', 'Rasau Jaya': 'rasau-jaya', 'Sungai Ambawang': 'sungai-ambawang',
      'Kubu': 'kubu', 'Batu Ampar': 'batu-ampar', 'Teluk Pakedai': 'teluk-pakedai', 'Terentang': 'terentang', 'Kuala Mandor B': 'kuala-mandor'}
NM = lambda c: nama_kom[c].split(' / ')[0].lower()


def kondisi(skor):
    return 'Tinggi' if skor > 3.5 else 'Sedang' if skor >= 2.5 else 'Rendah' if skor >= 1.5 else 'Sangat Rendah'


def label_kom(nama, zona):
    return nama.lower() + ('‡' if nama == 'Karet' and zona in KARET_PASANG_SURUT else '')


def padi_enam_desa():
    dalam = [d for d in pot if d != 'Di luar batas desa']
    tot = sum(pot[d]['total_ha'] for d in dalam)
    s = lambda k: sum(pot[d][k]['S1'] + pot[d][k]['S2'] for d in dalam)
    return s('aktual') / tot * 100, s('potensial_A') / tot * 100, s('potensial_B') / tot * 100


def teks(n):
    k = kec[n]; ik = k['iklim']; z = ZONA_DARI[n]; zn = z['zona']
    prop = sorted(((int(c), p) for c, p in ik['tanahProporsi'].items()), key=lambda x: -x[1])
    t1, t2 = prop[0], prop[1]
    relevan = sorted(k['skor'].items(), key=lambda x: -x[1])
    top3 = ', '.join(f'{NM(c)} ({f3(v)})' for c, v in relevan[:3])
    rank = urut_wo.index(n) + 1
    kond = kondisi(k['skorWO'])
    suhu = f"{ik['suhu']:.1f}".replace('.', ',')
    desc = (f'Kecamatan {n} termasuk Subzona {zn} hasil klaster agroekologi Kabupaten Kubu Raya ({z["judul"]}). '
            f'Statistik zonal pada poligon kecamatan (Google Earth Engine) menunjukkan curah hujan normal 1991–2020 {ribu(ik["curahHujan"])} mm/tahun (CHIRPS), '
            f'suhu udara {suhu} °C, dan elevasi median {ik["elevasi"]} m dpl (FABDEM). Tekstur tanah didominasi '
            f'{TANAH.get(t1[0], t1[0])} ({round(t1[1] * 100)}% luas) diikuti {TANAH.get(t2[0], t2[0])} ({round(t2[1] * 100)}%), sehingga nilai kesesuaian '
            f'tekstur dihitung tertimbang menurut proporsi luas kedua kelas tersebut. NDVI rata-rata {f2(k["ndvi"])} (Sentinel-2) dan indeks kondisi lahan '
            f'(weighted overlay) {f2(k["skorWO"])} menunjukkan kondisi lahan {kond.lower()}; indeks ini bukan kelas kesesuaian komoditas. '
            f'Komoditas dengan skor SAW tertinggi adalah {top3}.')
    aktual = ', '.join(label_kom(a['komoditas'], zn) + (f" ({', '.join(a['kecamatan'])})" if a['kecamatan'] else '') for a in z['aktual'])
    potensial = ', '.join(label_kom(p['komoditas'], zn) + ('†' if p['tanpaData'] else '') for p in z['potensial'])
    potensi = [f'Subzona {zn}: komoditas paling sesuai di kecamatan ini adalah {top3}.',
               f'Indeks kondisi lahan (weighted overlay) {f2(k["skorWO"])} — kondisi {kond.lower()}, peringkat {rank} dari 9 kecamatan; '
               f'seluruh kecamatan berada pada kondisi sedang (2,5–3,5).',
               f'Unggulan aktual Subzona {zn} (skor SAW rata-rata subzona ≥ 0,85 dan LQ produksi BPS 2024 > 1 di kecamatan yang disebut): '
               + (aktual or 'belum ada') + '.',
               f'Unggulan potensial Subzona {zn} (sangat sesuai, LQ ≤ 1 atau data produksi belum tersedia †): ' + (potensial or '–') + '.']
    if zn in KARET_PASANG_SURUT and any(x['komoditas'] == 'Karet' for x in z['aktual'] + z['potensial']):
        potensi.append('‡ Skor karet di lahan pasang surut kemungkinan terlalu tinggi karena model belum memuat drainase dan bahaya banjir '
                       '(produksi karet justru terpusat di Kuala Mandor B dan Sungai Ambawang, Subzona B2); jangan direkomendasikan tanpa kajian drainase.')
    if n in ('Kubu', 'Batu Ampar'):
        potensi.append('Sebagian wilayah berupa gambut dalam dan mangrove; pengembangan diarahkan di luar kawasan hutan, gambut berfungsi lindung, dan mangrove dengan tata air yang menjaga muka air tanah.')
    elif zn == 'A1':
        potensi.append('Padi sawah memperoleh skor tertinggi di zona ini; pengembangannya memerlukan pengelolaan tata air pada lahan pasang surut.')
    elif n == 'Rasau Jaya':
        a, pa, pb = padi_enam_desa()
        potensi.append(f'Wilayah percontohan: analisis 9 kriteria tingkat desa menunjukkan bahaya banjir sebagai pembatas dominan; di enam desa, '
                       f'perbaikan tata air berpotensi menaikkan lahan sesuai padi sawah dari {pct(a)}% menjadi {pct(pa)}% ({pct(pb)}% bila disertai pengapuran).')
    else:
        potensi.append('Arahan zonasi bersifat biofisik dan berlaku di luar kawasan hutan serta ekosistem gambut berfungsi lindung.')
    topo = f'Dataran rendah (elevasi median {ik["elevasi"]} m dpl)' + ('; sebagian gambut dalam & mangrove' if n in ('Kubu', 'Batu Ampar') else '')
    data = [('Kondisi Lahan', f'{kond} (indeks weighted overlay)'), ('Zona Agroekologi', f'Subzona {zn} (klaster Ward)'),
            ('NDVI Rata-rata', f'{f2(k["ndvi"])} (Sentinel-2, 2022–2024)'),
            ('Indeks Kondisi Lahan', f'{f2(k["skorWO"])} / 4,00' + (' (tertinggi)' if rank == 1 else '')),
            ('Topografi', topo)]
    # tag komoditas: unggulan aktual di kecamatan ini → unggulan aktual zona lain → potensial (karet pasang surut dilewati)
    tag = [a['komoditas'] for a in z['aktual'] if n in a['kecamatan']]
    tag += [a['komoditas'] for a in z['aktual'] if a['komoditas'] not in tag]
    tag += [p['komoditas'] for p in z['potensial'] if p['komoditas'] not in tag
            and not (p['komoditas'] == 'Karet' and zn in KARET_PASANG_SURUT)]
    tag = [t for t in tag if not (t == 'Karet' and zn in KARET_PASANG_SURUT)][:6]
    return desc, potensi, data, tag


js = lambda s: "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"
p = os.path.join(ROOT, 'script.js')
s = open(p, encoding='utf-8', newline='').read()
NL = '\r\n' if '\r\n' in s else '\n'
h = open(os.path.join(ROOT, 'index.html'), encoding='utf-8', newline='').read()
for n, kid in ID.items():
    a = s.index(f"  '{kid}': {{")
    b = s.index('\n  }', a)
    blok = s[a:b]
    desc, potensi, data, tag = teks(n)
    data_js = f"data: [{NL}" + f",{NL}".join(f"      {{ key: {js(k)}, val: {js(v)} }}" for k, v in data) + f"{NL}    ]"
    pot_js = f"potensi: [{NL}" + f",{NL}".join(f"      {js(x)}" for x in potensi) + f"{NL}    ]"
    kom_js = (f"commodities: [{NL}" + f",{NL}".join(f"      {{ icon: {js(IKON.get(t, '🌱'))}, name: {js(t)} }}" for t in tag) + f"{NL}    ]")
    blok2 = re.sub(r"desc: '(?:[^'\\]|\\.)*'", lambda m: 'desc: ' + js(desc), blok, count=1)
    blok2 = re.sub(r"data: \[.*?\n    \]", lambda m: data_js, blok2, count=1, flags=re.S)
    blok2 = re.sub(r"potensi: \[.*?\n    \]", lambda m: pot_js, blok2, count=1, flags=re.S)
    blok2 = re.sub(r"commodities: \[.*?\n    \]", lambda m: kom_js, blok2, count=1, flags=re.S)
    if n in TAGLINE:
        blok2 = re.sub(r"tagline: '(?:[^'\\]|\\.)*'", lambda m: 'tagline: ' + js(TAGLINE[n]), blok2, count=1)
    tagline = re.search(r"tagline: '((?:[^'\\]|\\.)*)'", blok2).group(1)
    s = s[:a] + blok2 + s[b:]
    # kartu statis index.html (terbaca tanpa JavaScript & oleh mesin pencari)
    i = h.index(f'id="card-{kid}"'); j = h.index('<div class="kec-cta">', i)
    kartu = h[i:j]
    kartu = re.sub(r'<p class="kec-tagline">.*?</p>', f'<p class="kec-tagline">{tagline}</p>', kartu, count=1)
    ind = re.search(r'(\n[ \t]*)<span class="tag">', kartu).group(1)
    kartu = re.sub(r'(<div class="kec-tags">).*?(\s*</div>)', lambda m: m.group(1) + ''.join(f'{ind}<span class="tag">{t}</span>' for t in tag[:3]) + m.group(2),
                   kartu, count=1, flags=re.S)
    h = h[:i] + kartu + h[j:]
    print(f'{n:16s} Subzona {ZONA_DARI[n]["zona"]:3s} | tag: {", ".join(tag)}')
open(p, 'w', encoding='utf-8', newline='').write(s)
open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8', newline='').write(h)
print('script.js & index.html diperbarui')
