"""
Gambar naskah JTEP-L versi bahasa Inggris (data & tata letak identik dengan versi Indonesia).
Skrip ini menurunkan gambar_jtep_en.py dan gambar_jtep2_en.py dari skrip asli dengan kamus label,
lalu menjalankan gambar yang dipakai naskah. Output: ../Paper/Gambar_JTEP_EN/*.png
Jalankan: python tools/buat_gambar_en.py
"""
import os, sys, importlib

T = os.path.dirname(os.path.abspath(__file__))

KRIT_EN = {'Bahaya banjir': 'Flood hazard', 'C-organik': 'Organic C', 'Curah hujan': 'Rainfall', 'Elevasi': 'Elevation',
           'Ketebalan gambut': 'Peat thickness', 'Lereng': 'Slope', 'Suhu': 'Temperature', 'Tekstur tanah': 'Soil texture',
           'pH tanah': 'Soil pH'}
KOM_EN = {'padi_sawah': 'Paddy rice', 'kelapa': 'Coconut', 'karet': 'Rubber', 'sagu': 'Sago', 'pisang': 'Banana',
          'nanas': 'Pineapple', 'pinang': 'Areca nut', 'kakao': 'Cocoa', 'jagung': 'Maize', 'cabai': 'Chili',
          'semangka': 'Watermelon', 'kopi_robusta': 'Robusta coffee', 'ubi_kayu': 'Cassava', 'pepaya': 'Papaya',
          'jeruk_siam': 'Tangerine', 'lada': 'Black pepper', 'durian': 'Durian', 'jahe': 'Ginger',
          'daun_bawang': 'Spring onion', 'langsat': 'Langsat', 'jambu_biji': 'Guava', 'alpukat': 'Avocado'}

GANTI_1 = [
    ("OUT = os.path.join(ROOT, '..', 'Paper', 'Gambar_JTEP')", "OUT = os.path.join(ROOT, '..', 'Paper', 'Gambar_JTEP_EN')"),
    ("'S1 – Sangat sesuai'", "'S1 – Highly suitable'"), ("'S2 – Cukup sesuai'", "'S2 – Moderately suitable'"),
    ("'S3 – Sesuai marginal'", "'S3 – Marginally suitable'"), ("'N – Tidak sesuai'", "'N – Not suitable'"),
    ("ax.annotate('U',", "ax.annotate('N',"),
    ("'(a) Kabupaten Kubu Raya'", "'(a) Kubu Raya Regency'"),
    ("'Timur, UTM 49S (km)'", "'Easting, UTM 49S (km)'"), ("'Utara, UTM 49S (km)'", "'Northing, UTM 49S (km)'"),
    ("'(b) Kecamatan Rasau Jaya (wilayah percontohan)'", "'(b) Rasau Jaya District (pilot area)'"),
    ("'Cakupan data parameter lahan (±21.400 ha)'", "'Land quality data coverage (±21,400 ha)'"),
    ("'Batas desa'", "'Village boundary'"),
    ("'(a) pH tanah (nr)'", "'(a) Soil pH (nr)'"), ("'(b) C-organik (nr)'", "'(b) Organic C (nr)'"),
    ("'(c) Ketebalan gambut (rc)'", "'(c) Peat thickness (rc)'"), ("'(d) Kemiringan lereng (eh)'", "'(d) Slope (eh)'"),
    ("'(e) Bahaya banjir (fh)'", "'(e) Flood hazard (fh)'"), ("'Kelas kesesuaian'", "'Suitability class'"),
    ("'Koordinat: UTM zona 49S (km)'", "'Coordinates: UTM zone 49S (km)'"),
    ("'Hanya bahaya banjir (fh)'", "'Flood hazard only (fh)'"), ("'Hanya pH (nr)'", "'pH only (nr)'"),
    ("'Banjir + pH (fh, nr)'", "'Flood hazard + pH (fh, nr)'"), ("'Melibatkan eh/rc/C-org'", "'Involving eh/rc/organic C'"),
    ("'Di luar lima parameter'", "'Other (temperature or texture)'"), ("'Bukan kelas S3'", "'Not class S3'"),
    ("'Faktor pembatas pada lahan S3'", "'Limiting factors on S3 land'"),
    ("'(a) Aktual'", "'(a) Actual'"), ("'(b) Potensial: perbaikan tata air'", "'(b) Potential: water management'"),
    ("'(c) Potensial: tata air + ameliorasi'", "'(c) Potential: water management + liming'"),
    ("f'S1+S2: {s12:,.0f} ha'.replace(',', '.')", "f'S1+S2: {s12:,.0f} ha'"),
    ("'ρ Spearman peringkat desa (padi sawah)'", "'Spearman ρ, village ranking (paddy rice)'"),
    ("'(a) SAW 9 kriteria, 6 desa'", "'(a) Nine-criterion SAW, 6 villages'"),
    # A10: perpindahan kategori komoditas per desa tidak dilaporkan (model desa hanya sahih untuk padi sawah)
    ("            a1.text(1.006, i, f\"{max(x['perubahanKategori'] for x in s['desa9'] if x['kriteria'] == n)}\", fontsize=6.5, va='center')\n", ""),
    ("    a1.text(1.006, -0.9, 'Δkat.', fontsize=6.3, ha='left')\n", ""),
    ("title='Perubahan bobot'", "title='Weight change'"),
    ("'ρ minimum peringkat komoditas'", "'Minimum ρ, commodity ranking'"),
    ("'(b) SAW 4 kriteria, 9 kecamatan'", "'(b) Four-criterion SAW, 9 districts'"),
    ("a1.set_yticks(range(len(nama9)), nama9)", "a1.set_yticks(range(len(nama9)), [KRIT_EN.get(n, n) for n in nama9])"),
    ("a2.set_yticks(range(len(nama4)), nama4)", "a2.set_yticks(range(len(nama4)), [KRIT_EN.get(n, n) for n in nama4])"),
    ("TEKS = '#0D1F16'", f"TEKS = '#0D1F16'\nKRIT_EN = {KRIT_EN!r}\nKOM_EN = {KOM_EN!r}"),
]
GANTI_2 = [
    ("import gambar_jtep as G", "import gambar_jtep_en as G"),
    ("'Paper', 'Gambar_JTEP_v2')", "'Paper', 'Gambar_JTEP_EN')"),
    ("(5.15, 'Pengolahan geospasial'), (10.2, 'Evaluasi lahan'), (15.25, 'Keluaran')",
     "(5.15, 'Geospatial processing'), (10.2, 'Land evaluation'), (15.25, 'Outputs')"),
    ("'Tingkat 1: Kabupaten (9 kecamatan)'", "'Level 1: Regency (9 districts)'"),
    ("'Tingkat 2: Percontohan Rasau Jaya (6 desa)'", "'Level 2: Rasau Jaya pilot area (6 villages)'"),
    ("'CHIRPS, ERA5-Land,\\nFABDEM, tekstur tanah'", "'CHIRPS, ERA5-Land,\\nFABDEM, soil texture'"),
    ("'Syarat tumbuh\\n22 komoditas'", "'Crop requirements\\n(20 commodities)'"),
    ("'pH, C-org. (OpenLandMap),\\ngambut (KLHK), lereng,\\nbanjir (InaRISK)'", "'pH, organic C (OpenLandMap),\\npeat (KLHK), slope,\\nflood (InaRISK)'"),
    ("'Kesesuaian lahan\\npadi sawah (poligon)'", "'Paddy rice land\\nsuitability (polygons)'"),
    ("'Komposit median\\n2022–2024 (GEE) &\\nzonal per poligon'", "'Median composite\\n2022–2024 (GEE) &\\nzonal statistics'"),
    ("'Normalisasi trapesoid\\nterhadap syarat tumbuh'", "'Trapezoidal normalization\\nto crop requirements'"),
    ("'Skor weighted overlay\\n& SAW 4 kriteria'", "'Weighted overlay score\\n& four-criterion SAW'"),
    ("'Klaster Ward, LQ\\n& validasi BPS 2024'", "'Ward clustering, LQ &\\nBPS 2024 validation'"),
    ("'Zonasi & komoditas\\nunggulan aktual/\\npotensial per zona'", "'Zoning & actual/\\npotential leading\\ncommodities'"),
    ("'Rata-rata tertimbang\\nluas per desa\\n(UTM 49S)'", "'Area-weighted mean\\nper village\\n(UTM 49S)'"),
    ("'Grid titik 50 m\\n(85.661 titik)'", "'50 m point grid\\n(85,661 points)'"),
    ("'SAW 9 kriteria &\\nhukum minimum'", "'Nine-criterion SAW &\\nlaw of the minimum'"),
    ("'Kesesuaian aktual vs\\npotensial padi sawah'", "'Actual vs potential\\npaddy rice suitability'"),
    ("'Sensitivitas bobot\\n(±10%, ±20%)'", "'Weight sensitivity\\n(±10%, ±20%)'"),
    ("'Rekomendasi\\npengelolaan lahan\\n& tata air per desa'", "'Village land and\\nwater management\\nrecommendations'"),
    ("'Diseminasi\\nWebGIS TapakTani'", "'Dissemination via\\nTapakTani WebGIS'"),
    ("(n + \"\\n\" + f\"{kec[n]['skorWO']:.2f}\").replace('.', ',')", "(n + \"\\n\" + f\"{kec[n]['skorWO']:.2f}\")"),
    ("'(a) Zona agroekologi dan skor weighted overlay'", "'(a) Agroecological zones and weighted overlay scores'"),
    ("'Timur, UTM 49S (km)'", "'Easting, UTM 49S (km)'"), ("'Utara, UTM 49S (km)'", "'Northing, UTM 49S (km)'"),
    ("label=f'Zona {zn}'", "label=f'Zone {zn}'"), ("'potong (4 zona)'", "'cut (4 zones)'"),
    ("'Jarak gabung Ward'", "'Ward linkage distance'"),
    ("f\"(b) Dendrogram klaster (silhouette {z['silhouette']['4']:.2f})\".replace('.', ',')",
     "f\"(b) Cluster dendrogram (silhouette {z['silhouette']['4']:.2f})\""),
    ("'(c) Skor SAW empat kriteria, 20 komoditas × 9 kecamatan'", "'(c) Four-criterion SAW scores, 20 commodities × 9 districts'"),
    ("cb.set_label('Skor SAW'", "cb.set_label('SAW score'"),
    ("[d['nama'][c].split(' / ')[0] for c in kom_u]", "[G.KOM_EN.get(c, d['nama'][c]) for c in kom_u]"),
]


def turunkan(asal, tujuan, ganti):
    s = open(os.path.join(T, asal), encoding='utf-8').read()
    for a, b in ganti:
        assert a in s, f'{asal}: tidak ditemukan {a[:60]}'
        s = s.replace(a, b)
    s = s.split("\nif __name__ == '__main__':")[0] + '\n'
    open(os.path.join(T, tujuan), 'w', encoding='utf-8').write('# DIBUAT OTOMATIS oleh buat_gambar_en.py — jangan disunting\n' + s)


turunkan('gambar_jtep.py', 'gambar_jtep_en.py', GANTI_1)
turunkan('gambar_jtep2.py', 'gambar_jtep2_en.py', GANTI_2)
sys.path.insert(0, T)
import numpy as np
G = importlib.import_module('gambar_jtep_en')
G2 = importlib.import_module('gambar_jtep2_en')
padi = G.per_kelas('Kesesuaian_Lahan_Padi_Sawah')
param = {'ph': G.per_kelas('Skor_pH_Tanah'), 'corg': G.per_kelas('Skor_C_Organik'), 'gambut': G.per_kelas('Skor_Ketebalan_Gambut'),
         'lereng': G.per_kelas('Skor_Lereng', 30), 'banjir': G.per_kelas('Skor_Bahaya_Banjir')}
npz = np.load(os.path.join(G.DATA, 'grid_potensial.npz'))
G.gambar_lokasi(padi)              # Figure 1
G2.gambar_alir()                   # Figure 2
G2.gambar_zonasi()                 # Figure 3
G.gambar_parameter(param, padi)    # Figure 4
G.gambar_pembatas(npz)             # Figure 5
G.gambar_potensial(npz)            # Figure 6
G.gambar_sensitivitas()            # Figure 7
