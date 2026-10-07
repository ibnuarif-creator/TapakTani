"""
Zonasi agroekologi (klaster Ward), Location Quotient (LQ) hortikultura BPS 2024, dan validasi Spearman
skor SAW vs produksi aktual per kecamatan — paper JTEP-L (Okt 2026).
Input : Paper/Gambar/data_analisis/saw_matriks_lengkap.json (node tools/klaster_zonasi.js)
        Paper/Gambar/data_analisis/bps_hortikultura_2024_kecamatan.csv
Output: Paper/Gambar/data_analisis/zonasi_lq_validasi.json
"""
import csv, json, os
import numpy as np
from scipy.cluster.hierarchy import linkage, fcluster, cophenet
from scipy.spatial.distance import pdist
from scipy.stats import spearmanr
from sklearn.metrics import silhouette_score

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'Paper', 'Gambar', 'data_analisis')
m = json.load(open(os.path.join(D, 'saw_matriks_lengkap.json'), encoding='utf-8'))
kom, nama = m['komoditas'], [b['nama'] for b in m['baris']]
X = np.array([b['skor'] for b in m['baris']])

# ── klaster Ward ──
Z = linkage(X, 'ward')
sil = {k: float(silhouette_score(X, fcluster(Z, k, 'maxclust'))) for k in range(2, 6)}
K = 4
lab = fcluster(Z, K, 'maxclust')
# penamaan zona I–IV menurut skor jeruk siam rata-rata menurun? → urut menurut curah hujan rata-rata (tidak bergantung label scipy)
zona_kec = {}
for n, l in zip(nama, lab): zona_kec.setdefault(int(l), []).append(n)

# ── LQ hortikultura (per kelompok satuan: 1.x semusim ton, 2.x buah tahunan kuintal, 3.x biofarmaka kg) ──
bps = {}
for r in csv.DictReader(open(os.path.join(D, 'bps_hortikultura_2024_kecamatan.csv'), encoding='utf-8')):
    bps.setdefault(r['komoditas'], {'grup': r['tabel'].split('.')[0], 'prod': {}})['prod'][r['kecamatan']] = float(r['kolom3_produksi'])
PETA = {'alpukat': ['Alpukat'], 'cabai': ['Cabai Rawit', 'Cabai Besar/TW/Teropong'], 'daun_bawang': ['Bawang Daun'],
        'durian': ['Durian'], 'jahe': ['Jahe'], 'jambu_biji': ['Jambu Biji'], 'jeruk_siam': ['Jeruk Siam/ Keprok'],
        'langsat': ['Duku/ Langsat/ Kokosan'], 'nanas': ['Nenas'], 'pepaya': ['Pepaya'], 'pisang': ['Pisang'], 'semangka': ['Semangka']}
total_grup = {}
for k, v in bps.items():
    for kc, q in v['prod'].items():
        total_grup.setdefault(v['grup'], {}).setdefault(kc, 0.0)
        total_grup[v['grup']][kc] += q
# perkebunan (BPS Kabupaten Kubu Raya Dalam Angka 2025, Tabel 5.2.2, ton): satu kelompok satuan 'kebun'
for r in csv.DictReader(open(os.path.join(D, 'bps_perkebunan_2024_kecamatan.csv'), encoding='utf-8')):
    bps.setdefault(r['komoditas'], {'grup': 'kebun', 'prod': {}})['prod'][r['kecamatan']] = float(r['produksi_ton_2024'])
    total_grup.setdefault('kebun', {}).setdefault(r['kecamatan'], 0.0)
    total_grup['kebun'][r['kecamatan']] += float(r['produksi_ton_2024'])
PETA.update({'karet': ['Karet'], 'kelapa': ['Kelapa Dalam', 'Kelapa Hibrida', 'Kelapa Deres'], 'lada': ['Lada'],
             'pinang': ['Pinang'], 'sagu': ['Sagu']})
lq, prod = {}, {}
for c, bs in PETA.items():
    g = bps[bs[0]]['grup']
    q = {kc: sum(bps[b]['prod'][kc] for b in bs) for kc in nama}
    Q = sum(q.values()); T = total_grup[g]; TT = sum(T.values())
    prod[c] = q
    lq[c] = {kc: (q[kc] / T[kc]) / (Q / TT) if T[kc] > 0 and Q > 0 else 0.0 for kc in nama}

# ── validasi Spearman ──
validasi = []
for c in PETA:
    s = X[:, kom.index(c)]; q = [prod[c][kc] for kc in nama]
    rho, p = spearmanr(s, q)
    validasi.append({'komoditas': c, 'rho': round(float(rho), 3), 'p': round(float(p), 3)})

# ── ringkasan per zona ──
AMBANG = 0.85
zona = []
for l, ks in zona_kec.items():
    idx = [nama.index(n) for n in ks]
    rata = X[idx].mean(0)
    urut = [kom[i] for i in np.argsort(-rata)]
    aktual, potensial = [], []
    for c in kom:
        if rata[kom.index(c)] < AMBANG: continue
        if c in lq:
            lq_z = max(lq[c][kc] for kc in ks)
            (aktual if lq_z > 1 else potensial).append({'komoditas': c, 'skor': round(float(rata[kom.index(c)]), 3),
                                                        'lq_maks': round(lq_z, 2),
                                                        'kec_lq1': [kc for kc in ks if lq[c][kc] > 1]})
    zona.append({'label_scipy': l, 'kecamatan': ks,
                 'teratas': [{'komoditas': c, 'skor': round(float(rata[kom.index(c)]), 3),
                              'min': round(float(X[idx, kom.index(c)].min()), 3)} for c in urut[:6]],
                 'unggulan_aktual': aktual, 'potensial_horti': potensial})
hasil = {'k': K, 'silhouette': sil, 'kofenetik': float(cophenet(Z, pdist(X))[0]),
         'jarak_gabung': [float(z) for z in Z[:, 2]], 'linkage': Z.tolist(), 'nama': nama, 'komoditas': kom,
         'zona': zona, 'lq': lq, 'validasi': validasi, 'ambang_unggulan': AMBANG}
json.dump(hasil, open(os.path.join(D, 'zonasi_lq_validasi.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('silhouette', {k: round(v, 3) for k, v in sil.items()}, 'kofenetik', round(hasil['kofenetik'], 3))
for z in zona:
    print('\nZONA', z['kecamatan'])
    print('  teratas :', ', '.join(f"{t['komoditas']} {t['skor']}" for t in z['teratas']))
    print('  aktual  :', ', '.join(f"{a['komoditas']} {a['skor']} LQ{a['lq_maks']} {a['kec_lq1']}" for a in z['unggulan_aktual']))
    print('  potensial horti:', ', '.join(f"{a['komoditas']} {a['skor']} LQ{a['lq_maks']}" for a in z['potensial_horti']))
print('\nvalidasi:', validasi)
