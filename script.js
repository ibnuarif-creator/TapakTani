/* ============================================================
   SIG Pertanian Kubu Raya — script.js
   Light Theme · Leaflet Maps · Interactive Modal
   ============================================================ */

// ============================================================
// KOORDINAT KECAMATAN (lat, lng) — Kabupaten Kubu Raya
// ============================================================
// Warna & label kelas kesesuaian lahan (dipakai hero map & peta detail desa)
const kelasColor = { S1: '#1a6e3c', S2: '#5aac72', S3: '#e8c53a', N: '#d94f3a' };
const kelasLabel = { S1: 'Sangat Sesuai', S2: 'Cukup Sesuai', S3: 'Sesuai Marginal', N: 'Tidak Sesuai' };

// Titik penanda = representative point poligon batas kecamatan (selalu berada di dalam
// wilayahnya); zoom hanya cadangan bila poligon batas tidak ditemukan
const kecamatanCoords = {
  'sungai-raya':      { lat: -0.2270,  lng: 109.6700, zoom: 11 },
  'sungai-kakap':     { lat: -0.1030,  lng: 109.2620, zoom: 11 },
  'rasau-jaya':       { lat: -0.2510,  lng: 109.3340, zoom: 12 },
  'sungai-ambawang':  { lat: -0.0580,  lng: 109.6290, zoom: 11 },
  'kubu':             { lat: -0.4640,  lng: 109.3180, zoom: 11 },
  'batu-ampar':       { lat: -0.8380,  lng: 109.4810, zoom: 10 },
  'teluk-pakedai':    { lat: -0.2970,  lng: 109.1950, zoom: 11 },
  'terentang':        { lat: -0.3710,  lng: 109.7760, zoom: 11 },
  'kuala-mandor':     { lat:  0.1170,  lng: 109.4350, zoom: 11 },
};

// Nama kecamatan di data batas wilayah (GADM) → id kecamatan di website
const nameToKecId = {
  'Sungai Raya': 'sungai-raya', 'Sungai Kakap': 'sungai-kakap',
  'Rasau Jaya': 'rasau-jaya', 'Sungai Ambawang': 'sungai-ambawang',
  'Kubu': 'kubu', 'Batu Ampar': 'batu-ampar',
  "Telok Pa'Kedai": 'teluk-pakedai', 'Terentang': 'terentang',
  'Kuala Mandor B': 'kuala-mandor'
};

function getKecamatanFeature(kecId) {
  if (typeof kesesuaianLahanData === 'undefined') return null;
  return kesesuaianLahanData.features.find(f => nameToKecId[f.properties.NAME_3] === kecId) || null;
}

// ── Peta dasar Esri (tanpa API key) ────────────────────────────────────────
// Tile CARTO kini mewajibkan API key (tanpa key hanya tampil watermark
// "API KEY REQUIRED"), sehingga seluruh peta memakai layanan tile Esri.
const ESRI_ATTRIBUTION = 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, Maxar, Earthstar Geographics, &copy; OpenStreetMap contributors';

function esriLayer(service, attribution = ESRI_ATTRIBUTION) {
  return L.tileLayer(`https://server.arcgisonline.com/ArcGIS/rest/services/${service}/MapServer/tile/{z}/{y}/{x}`, {
    attribution,
    maxZoom: 18
  });
}

// Citra satelit sebagai default (peta jalan di wilayah Kubu Raya sangat minim detail),
// dengan pilihan beralih ke peta jalan
function addBasemap(map) {
  const satelit = L.layerGroup([esriLayer('World_Imagery'), esriLayer('Reference/World_Boundaries_and_Places')]).addTo(map);
  const jalan = esriLayer('World_Street_Map');
  L.control.layers({ 'Citra Satelit': satelit, 'Peta Jalan': jalan }, null, { position: 'topright' }).addTo(map);
}

// ============================================================
// DATA LENGKAP 9 KECAMATAN
// ============================================================
const kecamatanData = {
  'sungai-raya': {
    number: '02',
    name: 'Sungai Raya',
    tagline: 'Ibu Kota Kabupaten Kubu Raya',
    desc: 'Kecamatan Sungai Raya termasuk Zona IV hasil klaster agroekologi Kabupaten Kubu Raya, yaitu zona tekstur campuran lempung liat berpasir dan lempung berliat dengan curah hujan tinggi. Statistik zonal pada poligon kecamatan (Google Earth Engine, 2022–2024) menunjukkan curah hujan rata-rata 3.284 mm/tahun, suhu udara 26,2 °C, dan elevasi median 7 m dpl (FABDEM). Tekstur tanah didominasi Lempung Liat Berpasir (53% luas) diikuti Lempung Berliat (42%), sehingga nilai kesesuaian tekstur dihitung tertimbang menurut proporsi luas kedua kelas tersebut. NDVI rata-rata 0,67 (Sentinel-2) dan skor weighted overlay 3,27 menempatkan kecamatan ini pada kelas S2 (Cukup Sesuai). Komoditas dengan skor SAW tertinggi adalah jeruk siam (0,886), jahe (0,861), pinang (0,857).',
    stats: [
      { val: '1.190 km²', key: 'Luas Wilayah' }, { val: '22 Desa', key: 'Jumlah Desa' },
      { val: '251,7 rb', key: 'Penduduk 2024' }, { val: 'Sungai Raya', key: 'Ibu Kota' }
    ],
    commodities: [
      { icon: '🍍', name: 'Nanas' }, { icon: '🌾', name: 'Padi Sawah' },
      { icon: '🥥', name: 'Kelapa' }, { icon: '🍌', name: 'Pisang' },
      { icon: '🌴', name: 'Pinang' }, { icon: '🌶️', name: 'Sayuran' }
    ],
    relevantCrops: ['padi_sawah', 'nanas', 'kelapa', 'pisang', 'pinang', 'cabai', 'pepaya', 'jeruk_siam', 'langsat', 'jambu_biji', 'jahe'],
    data: [
      { key: 'Kelas Kesesuaian', val: 'S2 — Cukup Sesuai' },
      { key: 'Zona Agroekologi', val: 'Zona IV (klaster Ward)' },
      { key: 'NDVI Rata-rata', val: '0,67 (Sentinel-2, 2022–2024)' },
      { key: 'Skor Weighted Overlay', val: '3,27 / 4,00' },
      { key: 'Topografi', val: 'Dataran Rendah' }
    ],
    potensi: [
      'Zona IV: komoditas paling sesuai di kecamatan ini adalah jeruk siam (0,886), jahe (0,861), pinang (0,857).',
      'Skor weighted overlay 3,27 — peringkat 5 dari 9 kecamatan; seluruh kecamatan Kubu Raya berkelas S2.',
      'Unggulan aktual (skor SAW ≥ 0,85 dan LQ produksi hortikultura/perkebunan BPS 2024 > 1): jahe, lada.',
      'Unggulan potensial (sangat sesuai, LQ ≤ 1 atau data produksi belum tersedia; 5 teratas): jeruk siam, karet, pinang.',
      'Arahan zonasi bersifat biofisik dan berlaku di luar kawasan hutan serta ekosistem gambut berfungsi lindung.'
    ]
  },
  'sungai-kakap': {
    number: '03',
    name: 'Sungai Kakap',
    tagline: 'Sentra Kelapa & Padi Pasang Surut',
    desc: 'Kecamatan Sungai Kakap termasuk Zona I hasil klaster agroekologi Kabupaten Kubu Raya, yaitu zona pesisir barat bercurah hujan terendah dengan tekstur lempung berliat yang seimbang dengan lempung liat berpasir. Statistik zonal pada poligon kecamatan (Google Earth Engine, 2022–2024) menunjukkan curah hujan rata-rata 2.961 mm/tahun, suhu udara 26,5 °C, dan elevasi median 4 m dpl (FABDEM). Tekstur tanah didominasi Lempung Berliat (52% luas) diikuti Lempung Liat Berpasir (46%), sehingga nilai kesesuaian tekstur dihitung tertimbang menurut proporsi luas kedua kelas tersebut. NDVI rata-rata 0,68 (Sentinel-2) dan skor weighted overlay 3,37 menempatkan kecamatan ini pada kelas S2 (Cukup Sesuai). Komoditas dengan skor SAW tertinggi adalah karet (0,936), padi sawah (0,917), pinang (0,917).',
    stats: [
      { val: '587 km²', key: 'Luas Wilayah' }, { val: '15 Desa', key: 'Jumlah Desa' },
      { val: '131,2 rb', key: 'Penduduk 2024' }, { val: 'Sungai Kakap', key: 'Ibu Kota' }
    ],
    commodities: [
      { icon: '🥥', name: 'Kelapa' }, { icon: '🌾', name: 'Padi Pasut' },
      { icon: '🌿', name: 'Sagu' }, { icon: '🌴', name: 'Pinang' },
      { icon: '🍌', name: 'Pisang' }, { icon: '🌳', name: 'Karet' }
    ],
    relevantCrops: ['padi_sawah', 'kelapa', 'sagu', 'pinang', 'pisang', 'karet', 'langsat', 'jeruk_siam'],
    data: [
      { key: 'Kelas Kesesuaian', val: 'S2 — Cukup Sesuai' },
      { key: 'Zona Agroekologi', val: 'Zona I (klaster Ward)' },
      { key: 'NDVI Rata-rata', val: '0,68 (Sentinel-2, 2022–2024)' },
      { key: 'Skor Weighted Overlay', val: '3,37 / 4,00' },
      { key: 'Topografi', val: 'Rawa & Pasang Surut' }
    ],
    potensi: [
      'Zona I: komoditas paling sesuai di kecamatan ini adalah karet (0,936), padi sawah (0,917), pinang (0,917).',
      'Skor weighted overlay 3,37 — peringkat 3 dari 9 kecamatan; seluruh kecamatan Kubu Raya berkelas S2.',
      'Unggulan aktual (skor SAW ≥ 0,85 dan LQ produksi hortikultura/perkebunan BPS 2024 > 1): langsat, pinang, jahe, durian, pisang.',
      'Unggulan potensial (sangat sesuai, LQ ≤ 1 atau data produksi belum tersedia; 5 teratas): karet, padi sawah, lada, jeruk siam.',
      'Padi sawah memperoleh skor tertinggi di zona ini; pengembangannya memerlukan pengelolaan tata air pada lahan pasang surut.'
    ]
  },
  'rasau-jaya': {
    number: '01',
    name: 'Rasau Jaya',
    tagline: 'Kawasan Transmigrasi Pertanian Gambut',
    desc: 'Kecamatan Rasau Jaya termasuk Zona II hasil klaster agroekologi Kabupaten Kubu Raya, yaitu zona dominan lempung liat berpasir dengan curah hujan sedang. Statistik zonal pada poligon kecamatan (Google Earth Engine, 2022–2024) menunjukkan curah hujan rata-rata 3.069 mm/tahun, suhu udara 26,3 °C, dan elevasi median 4 m dpl (FABDEM). Tekstur tanah didominasi Lempung Liat Berpasir (75% luas) diikuti Lempung Berliat (20%), sehingga nilai kesesuaian tekstur dihitung tertimbang menurut proporsi luas kedua kelas tersebut. NDVI rata-rata 0,68 (Sentinel-2) dan skor weighted overlay 3,40 menempatkan kecamatan ini pada kelas S2 (Cukup Sesuai). Komoditas dengan skor SAW tertinggi adalah jeruk siam (0,955), lada (0,951), jahe (0,951).',
    stats: [
      { val: '209 km²', key: 'Luas Wilayah' }, { val: '6 Desa', key: 'Jumlah Desa' },
      { val: '33,1 rb', key: 'Penduduk 2024' }, { val: 'Rasau Jaya', key: 'Ibu Kota' }
    ],
    commodities: [
      { icon: '🥥', name: 'Kelapa' }, { icon: '🌾', name: 'Padi Gambut' },
      { icon: '🌳', name: 'Karet' }, { icon: '🍌', name: 'Pisang' },
      { icon: '🌴', name: 'Pinang' }, { icon: '🍉', name: 'Semangka' }
    ],
    relevantCrops: ['padi_sawah', 'kelapa', 'karet', 'pisang', 'pinang', 'semangka', 'nanas', 'jeruk_siam', 'langsat', 'durian', 'lada', 'jahe', 'jambu_biji', 'ubi_kayu'],
    data: [
      { key: 'Kelas Kesesuaian', val: 'S2 — Cukup Sesuai' },
      { key: 'Zona Agroekologi', val: 'Zona II (klaster Ward)' },
      { key: 'NDVI Rata-rata', val: '0,68 (Sentinel-2, 2022–2024)' },
      { key: 'Skor Weighted Overlay', val: '3,40 / 4,00 (tertinggi)' },
      { key: 'Topografi', val: 'Lahan Gambut' }
    ],
    potensi: [
      'Zona II: komoditas paling sesuai di kecamatan ini adalah jeruk siam (0,955), lada (0,951), jahe (0,951).',
      'Skor weighted overlay 3,40 — peringkat 1 dari 9 kecamatan; seluruh kecamatan Kubu Raya berkelas S2.',
      'Unggulan aktual (skor SAW ≥ 0,85 dan LQ produksi hortikultura/perkebunan BPS 2024 > 1): durian, pepaya.',
      'Unggulan potensial (sangat sesuai, LQ ≤ 1 atau data produksi belum tersedia; 5 teratas): jeruk siam, jahe, lada, karet, jambu biji.',
      'Wilayah percontohan: analisis 9 kriteria tingkat desa menunjukkan bahaya banjir sebagai pembatas dominan; perbaikan tata air berpotensi menaikkan lahan sesuai padi sawah dari 40,3% menjadi 84,8%.'
    ]
  },
  'sungai-ambawang': {
    number: '04',
    name: 'Sungai Ambawang',
    tagline: 'Sentra Perkebunan Karet & Pertanian Terpadu',
    desc: 'Kecamatan Sungai Ambawang termasuk Zona III hasil klaster agroekologi Kabupaten Kubu Raya, yaitu zona dominan lempung liat berpasir dengan curah hujan tinggi. Statistik zonal pada poligon kecamatan (Google Earth Engine, 2022–2024) menunjukkan curah hujan rata-rata 3.341 mm/tahun, suhu udara 26,1 °C, dan elevasi median 8 m dpl (FABDEM). Tekstur tanah didominasi Lempung Liat Berpasir (76% luas) diikuti Lempung Berliat (20%), sehingga nilai kesesuaian tekstur dihitung tertimbang menurut proporsi luas kedua kelas tersebut. NDVI rata-rata 0,70 (Sentinel-2) dan skor weighted overlay 3,38 menempatkan kecamatan ini pada kelas S2 (Cukup Sesuai). Komoditas dengan skor SAW tertinggi adalah jeruk siam (0,922), lada (0,890), jahe (0,890).',
    stats: [
      { val: '1.181 km²', key: 'Luas Wilayah' }, { val: '15 Desa', key: 'Jumlah Desa' },
      { val: '89,8 rb', key: 'Penduduk 2024' }, { val: 'Ambawang Kuala', key: 'Ibu Kota' }
    ],
    commodities: [
      { icon: '🌾', name: 'Padi Sawah' }, { icon: '🌳', name: 'Karet' },
      { icon: '🍌', name: 'Pisang' }, { icon: '🌴', name: 'Pinang' },
      { icon: '🍫', name: 'Kakao' }, { icon: '🥥', name: 'Kelapa' }
    ],
    relevantCrops: ['padi_sawah', 'karet', 'pisang', 'pinang', 'kakao', 'kelapa', 'durian', 'lada', 'langsat', 'jeruk_siam', 'jahe', 'jambu_biji'],
    data: [
      { key: 'Kelas Kesesuaian', val: 'S2 — Cukup Sesuai' },
      { key: 'Zona Agroekologi', val: 'Zona III (klaster Ward)' },
      { key: 'NDVI Rata-rata', val: '0,70 (Sentinel-2, 2022–2024)' },
      { key: 'Skor Weighted Overlay', val: '3,38 / 4,00' },
      { key: 'Topografi', val: 'Berbukit–Dataran' }
    ],
    potensi: [
      'Zona III: komoditas paling sesuai di kecamatan ini adalah jeruk siam (0,922), lada (0,890), jahe (0,890).',
      'Skor weighted overlay 3,38 — peringkat 2 dari 9 kecamatan; seluruh kecamatan Kubu Raya berkelas S2.',
      'Unggulan aktual (skor SAW ≥ 0,85 dan LQ produksi hortikultura/perkebunan BPS 2024 > 1): lada, karet.',
      'Unggulan potensial (sangat sesuai, LQ ≤ 1 atau data produksi belum tersedia; 5 teratas): jeruk siam, jahe.',
      'Arahan zonasi bersifat biofisik dan berlaku di luar kawasan hutan serta ekosistem gambut berfungsi lindung.'
    ]
  },
  'kubu': {
    number: '05',
    name: 'Kubu',
    tagline: 'Kelapa Hibrida & Pengelolaan Gambut',
    desc: 'Kecamatan Kubu termasuk Zona II hasil klaster agroekologi Kabupaten Kubu Raya, yaitu zona dominan lempung liat berpasir dengan curah hujan sedang. Statistik zonal pada poligon kecamatan (Google Earth Engine, 2022–2024) menunjukkan curah hujan rata-rata 2.982 mm/tahun, suhu udara 26,4 °C, dan elevasi median 3 m dpl (FABDEM). Tekstur tanah didominasi Lempung Liat Berpasir (65% luas) diikuti Lempung Berliat (32%), sehingga nilai kesesuaian tekstur dihitung tertimbang menurut proporsi luas kedua kelas tersebut. NDVI rata-rata 0,71 (Sentinel-2) dan skor weighted overlay 3,22 menempatkan kecamatan ini pada kelas S2 (Cukup Sesuai). Komoditas dengan skor SAW tertinggi adalah karet (0,931), pinang (0,882), langsat (0,882).',
    stats: [
      { val: '1.562 km²', key: 'Luas Wilayah' }, { val: '20 Desa', key: 'Jumlah Desa' },
      { val: '43,9 rb', key: 'Penduduk 2024' }, { val: 'Kubu', key: 'Ibu Kota' }
    ],
    commodities: [
      { icon: '🥥', name: 'Kelapa Hibrida' }, { icon: '🌿', name: 'Sagu' },
      { icon: '🌳', name: 'Karet' }, { icon: '🌾', name: 'Padi Gambut' },
      { icon: '🍌', name: 'Pisang' }, { icon: '🌴', name: 'Pinang' }
    ],
    relevantCrops: ['kelapa', 'sagu', 'karet', 'padi_sawah', 'pisang', 'pinang', 'langsat'],
    data: [
      { key: 'Kelas Kesesuaian', val: 'S2 — Cukup Sesuai' },
      { key: 'Zona Agroekologi', val: 'Zona II (klaster Ward)' },
      { key: 'NDVI Rata-rata', val: '0,71 (Sentinel-2, 2022–2024)' },
      { key: 'Skor Weighted Overlay', val: '3,22 / 4,00' },
      { key: 'Topografi', val: 'Lahan Gambut Dalam' }
    ],
    potensi: [
      'Zona II: komoditas paling sesuai di kecamatan ini adalah karet (0,931), pinang (0,882), langsat (0,882).',
      'Skor weighted overlay 3,22 — peringkat 7 dari 9 kecamatan; seluruh kecamatan Kubu Raya berkelas S2.',
      'Unggulan aktual (skor SAW ≥ 0,85 dan LQ produksi hortikultura/perkebunan BPS 2024 > 1): jeruk siam, jambu biji.',
      'Unggulan potensial (sangat sesuai, LQ ≤ 1 atau data produksi belum tersedia; 5 teratas): jahe, lada, durian, karet, langsat.',
      'Sebagian wilayah berupa gambut dalam dan mangrove; pengembangan diarahkan di luar kawasan hutan, gambut berfungsi lindung, dan mangrove dengan tata air yang menjaga muka air tanah.'
    ]
  },
  'batu-ampar': {
    number: '06',
    name: 'Batu Ampar',
    tagline: 'Ekosistem Mangrove & Pesisir Strategis',
    desc: 'Kecamatan Batu Ampar termasuk Zona IV hasil klaster agroekologi Kabupaten Kubu Raya, yaitu zona tekstur campuran lempung liat berpasir dan lempung berliat dengan curah hujan tinggi. Statistik zonal pada poligon kecamatan (Google Earth Engine, 2022–2024) menunjukkan curah hujan rata-rata 3.181 mm/tahun, suhu udara 26,6 °C, dan elevasi median 5 m dpl (FABDEM). Tekstur tanah didominasi Lempung Liat Berpasir (51% luas) diikuti Lempung Berliat (46%), sehingga nilai kesesuaian tekstur dihitung tertimbang menurut proporsi luas kedua kelas tersebut. NDVI rata-rata 0,75 (Sentinel-2) dan skor weighted overlay 3,21 menempatkan kecamatan ini pada kelas S2 (Cukup Sesuai). Komoditas dengan skor SAW tertinggi adalah karet (0,905), pinang (0,882), padi sawah (0,871).',
    stats: [
      { val: '2.431 km²', key: 'Luas Wilayah' }, { val: '15 Desa', key: 'Jumlah Desa' },
      { val: '36,5 rb', key: 'Penduduk 2024' }, { val: 'Padang Tikar', key: 'Ibu Kota' }
    ],
    commodities: [
      { icon: '🌿', name: 'Sagu' }, { icon: '🥥', name: 'Kelapa' },
      { icon: '🌾', name: 'Padi Pasut' }, { icon: '🌴', name: 'Pinang' },
      { icon: '🍌', name: 'Pisang' }, { icon: '🌳', name: 'Karet' }
    ],
    relevantCrops: ['sagu', 'kelapa', 'padi_sawah', 'pinang', 'pisang', 'karet', 'langsat'],
    data: [
      { key: 'Kelas Kesesuaian', val: 'S2 — Cukup Sesuai' },
      { key: 'Zona Agroekologi', val: 'Zona IV (klaster Ward)' },
      { key: 'NDVI Rata-rata', val: '0,75 (Sentinel-2, 2022–2024)' },
      { key: 'Skor Weighted Overlay', val: '3,21 / 4,00' },
      { key: 'Topografi', val: 'Rawa Mangrove & Pesisir' }
    ],
    potensi: [
      'Zona IV: komoditas paling sesuai di kecamatan ini adalah karet (0,905), pinang (0,882), padi sawah (0,871).',
      'Skor weighted overlay 3,21 — peringkat 8 dari 9 kecamatan; seluruh kecamatan Kubu Raya berkelas S2.',
      'Unggulan aktual (skor SAW ≥ 0,85 dan LQ produksi hortikultura/perkebunan BPS 2024 > 1): jeruk siam, lada.',
      'Unggulan potensial (sangat sesuai, LQ ≤ 1 atau data produksi belum tersedia; 5 teratas): karet, pinang, jahe, padi sawah, langsat.',
      'Sebagian wilayah berupa gambut dalam dan mangrove; pengembangan diarahkan di luar kawasan hutan, gambut berfungsi lindung, dan mangrove dengan tata air yang menjaga muka air tanah.'
    ]
  },
  'teluk-pakedai': {
    number: '07',
    name: 'Teluk Pakedai',
    tagline: 'Pertanian Sagu & Perikanan Kepulauan',
    desc: 'Kecamatan Teluk Pakedai termasuk Zona I hasil klaster agroekologi Kabupaten Kubu Raya, yaitu zona pesisir barat bercurah hujan terendah dengan tekstur lempung berliat yang seimbang dengan lempung liat berpasir. Statistik zonal pada poligon kecamatan (Google Earth Engine, 2022–2024) menunjukkan curah hujan rata-rata 2.814 mm/tahun, suhu udara 26,5 °C, dan elevasi median 5 m dpl (FABDEM). Tekstur tanah didominasi Lempung Berliat (49% luas) diikuti Lempung Liat Berpasir (47%), sehingga nilai kesesuaian tekstur dihitung tertimbang menurut proporsi luas kedua kelas tersebut. NDVI rata-rata 0,72 (Sentinel-2) dan skor weighted overlay 3,23 menempatkan kecamatan ini pada kelas S2 (Cukup Sesuai). Komoditas dengan skor SAW tertinggi adalah karet (0,953), pinang (0,912), langsat (0,912).',
    stats: [
      { val: '409 km²', key: 'Luas Wilayah' }, { val: '14 Desa', key: 'Jumlah Desa' },
      { val: '20,7 rb', key: 'Penduduk 2024' }, { val: 'Teluk Pakedai', key: 'Ibu Kota' }
    ],
    commodities: [
      { icon: '🌿', name: 'Sagu' }, { icon: '🥥', name: 'Kelapa' },
      { icon: '🌾', name: 'Padi Pasut' }, { icon: '🌴', name: 'Pinang' },
      { icon: '🍌', name: 'Pisang' }, { icon: '🌳', name: 'Karet' }
    ],
    relevantCrops: ['sagu', 'kelapa', 'padi_sawah', 'pinang', 'pisang', 'karet', 'langsat', 'pepaya'],
    data: [
      { key: 'Kelas Kesesuaian', val: 'S2 — Cukup Sesuai' },
      { key: 'Zona Agroekologi', val: 'Zona I (klaster Ward)' },
      { key: 'NDVI Rata-rata', val: '0,72 (Sentinel-2, 2022–2024)' },
      { key: 'Skor Weighted Overlay', val: '3,23 / 4,00' },
      { key: 'Topografi', val: 'Rawa & Kepulauan' }
    ],
    potensi: [
      'Zona I: komoditas paling sesuai di kecamatan ini adalah karet (0,953), pinang (0,912), langsat (0,912).',
      'Skor weighted overlay 3,23 — peringkat 6 dari 9 kecamatan; seluruh kecamatan Kubu Raya berkelas S2.',
      'Unggulan aktual (skor SAW ≥ 0,85 dan LQ produksi hortikultura/perkebunan BPS 2024 > 1): langsat, pinang, durian, jeruk siam, jambu biji, pepaya.',
      'Unggulan potensial (sangat sesuai, LQ ≤ 1 atau data produksi belum tersedia; 5 teratas): karet, jahe, lada, padi sawah, pisang.',
      'Padi sawah memperoleh skor tertinggi di zona ini; pengembangannya memerlukan pengelolaan tata air pada lahan pasang surut.'
    ]
  },
  'terentang': {
    number: '08',
    name: 'Terentang',
    tagline: 'Kawasan Hutan & Perkebunan Penyangga',
    desc: 'Kecamatan Terentang termasuk Zona IV hasil klaster agroekologi Kabupaten Kubu Raya, yaitu zona tekstur campuran lempung liat berpasir dan lempung berliat dengan curah hujan tinggi. Statistik zonal pada poligon kecamatan (Google Earth Engine, 2022–2024) menunjukkan curah hujan rata-rata 3.330 mm/tahun, suhu udara 26,2 °C, dan elevasi median 8 m dpl (FABDEM). Tekstur tanah didominasi Lempung Berliat (52% luas) diikuti Lempung Liat Berpasir (44%), sehingga nilai kesesuaian tekstur dihitung tertimbang menurut proporsi luas kedua kelas tersebut. NDVI rata-rata 0,68 (Sentinel-2) dan skor weighted overlay 3,20 menempatkan kecamatan ini pada kelas S2 (Cukup Sesuai). Komoditas dengan skor SAW tertinggi adalah karet (0,881), pinang (0,870), jeruk siam (0,867).',
    stats: [
      { val: '677 km²', key: 'Luas Wilayah' }, { val: '10 Desa', key: 'Jumlah Desa' },
      { val: '14,5 rb', key: 'Penduduk 2024' }, { val: 'Terentang', key: 'Ibu Kota' }
    ],
    commodities: [
      { icon: '🌳', name: 'Karet' }, { icon: '🍌', name: 'Pisang' },
      { icon: '🥥', name: 'Kelapa' }, { icon: '🌾', name: 'Padi Ladang' },
      { icon: '🌴', name: 'Pinang' }, { icon: '🍫', name: 'Kakao' }
    ],
    relevantCrops: ['karet', 'pisang', 'kelapa', 'padi_sawah', 'pinang', 'kakao', 'durian', 'lada', 'langsat', 'jeruk_siam', 'jahe', 'alpukat'],
    data: [
      { key: 'Kelas Kesesuaian', val: 'S2 — Cukup Sesuai' },
      { key: 'Zona Agroekologi', val: 'Zona IV (klaster Ward)' },
      { key: 'NDVI Rata-rata', val: '0,68 (Sentinel-2, 2022–2024)' },
      { key: 'Skor Weighted Overlay', val: '3,20 / 4,00' },
      { key: 'Topografi', val: 'Berbukit & Hutan' }
    ],
    potensi: [
      'Zona IV: komoditas paling sesuai di kecamatan ini adalah karet (0,881), pinang (0,870), jeruk siam (0,867).',
      'Skor weighted overlay 3,20 — peringkat 9 dari 9 kecamatan; seluruh kecamatan Kubu Raya berkelas S2.',
      'Unggulan aktual (skor SAW ≥ 0,85 dan LQ produksi hortikultura/perkebunan BPS 2024 > 1): jeruk siam.',
      'Unggulan potensial (sangat sesuai, LQ ≤ 1 atau data produksi belum tersedia; 5 teratas): karet, pinang, padi sawah.',
      'Arahan zonasi bersifat biofisik dan berlaku di luar kawasan hutan serta ekosistem gambut berfungsi lindung.'
    ]
  },
  'kuala-mandor': {
    number: '09',
    name: 'Kuala Mandor B',
    tagline: 'Pertanian Organik Dekat Cagar Alam',
    desc: 'Kecamatan Kuala Mandor B termasuk Zona III hasil klaster agroekologi Kabupaten Kubu Raya, yaitu zona dominan lempung liat berpasir dengan curah hujan tinggi. Statistik zonal pada poligon kecamatan (Google Earth Engine, 2022–2024) menunjukkan curah hujan rata-rata 3.244 mm/tahun, suhu udara 26,1 °C, dan elevasi median 9 m dpl (FABDEM). Tekstur tanah didominasi Lempung Liat Berpasir (77% luas) diikuti Lempung Berliat (19%), sehingga nilai kesesuaian tekstur dihitung tertimbang menurut proporsi luas kedua kelas tersebut. NDVI rata-rata 0,72 (Sentinel-2) dan skor weighted overlay 3,37 menempatkan kecamatan ini pada kelas S2 (Cukup Sesuai). Komoditas dengan skor SAW tertinggi adalah jeruk siam (0,934), lada (0,915), jahe (0,915).',
    stats: [
      { val: '320 km²', key: 'Luas Wilayah' }, { val: '6 Desa', key: 'Jumlah Desa' },
      { val: '28,5 rb', key: 'Penduduk 2024' }, { val: 'Kuala Mandor', key: 'Ibu Kota' }
    ],
    commodities: [
      { icon: '🌳', name: 'Karet' }, { icon: '🌾', name: 'Padi Sawah' },
      { icon: '🍌', name: 'Pisang' }, { icon: '🍫', name: 'Kakao' },
      { icon: '🌴', name: 'Pinang' }, { icon: '🌶️', name: 'Sayuran' }
    ],
    relevantCrops: ['karet', 'padi_sawah', 'pisang', 'kakao', 'pinang', 'cabai', 'durian', 'lada', 'langsat', 'jeruk_siam', 'jahe', 'alpukat', 'daun_bawang', 'jambu_biji'],
    data: [
      { key: 'Kelas Kesesuaian', val: 'S2 — Cukup Sesuai' },
      { key: 'Zona Agroekologi', val: 'Zona III (klaster Ward)' },
      { key: 'NDVI Rata-rata', val: '0,72 (Sentinel-2, 2022–2024)' },
      { key: 'Skor Weighted Overlay', val: '3,37 / 4,00' },
      { key: 'Topografi', val: 'Berbukit Rendah' }
    ],
    potensi: [
      'Zona III: komoditas paling sesuai di kecamatan ini adalah jeruk siam (0,934), lada (0,915), jahe (0,915).',
      'Skor weighted overlay 3,37 — peringkat 4 dari 9 kecamatan; seluruh kecamatan Kubu Raya berkelas S2.',
      'Unggulan aktual (skor SAW ≥ 0,85 dan LQ produksi hortikultura/perkebunan BPS 2024 > 1): karet.',
      'Unggulan potensial (sangat sesuai, LQ ≤ 1 atau data produksi belum tersedia; 5 teratas): jeruk siam, jahe, lada, jambu biji, durian.',
      'Arahan zonasi bersifat biofisik dan berlaku di luar kawasan hutan serta ekosistem gambut berfungsi lindung.'
    ]
  }
};

// ============================================================
// ANALISIS SYARAT TUMBUH — SAW (Simple Additive Weighting)
// Bobot: Tanah 35%, Elevasi 30%, Curah Hujan 20%, Suhu 15%
// Nilai: trapesoid kontinu (lihat nilaiVariabel); tanah Sesuai=1.00, Batas=0.50, Tidak=0.00
// Klasifikasi: ≥0.80 Sangat Cocok | ≥0.60 Cocok |
//              ≥0.40 Cukup Sesuai | <0.40 Kurang Sesuai
// ============================================================
const SAW_BOBOT = [0.20, 0.15, 0.30, 0.35]; // CH, Suhu, Elevasi, Tanah

function cekVariabel(nilai, r) {
  if (r.optMin !== undefined) {
    if (nilai >= r.optMin && nilai <= r.optMax) return 'cocok';
    if (nilai >= r.min    && nilai <= r.max)    return 'batas';
    return 'tidak';
  }
  return (nilai >= r.min && nilai <= r.max) ? 'cocok' : 'tidak';
}

function cekTanah(kode, t) {
  if (t.cocok.includes(kode)) return 'cocok';
  if (t.batas.includes(kode)) return 'batas';
  return 'tidak';
}

// Normalisasi kontinu — fungsi keanggotaan trapesoid
// Optimal (optMin–optMax) → 1.0; batas (min/max) → 0.0; transisi → interpolasi linear
function nilaiVariabel(nilai, r) {
  if (r.optMin !== undefined) {
    if (nilai >= r.optMin && nilai <= r.optMax) return 1.0;
    if (nilai < r.min || nilai > r.max)         return 0.0;
    if (nilai < r.optMin) return (nilai - r.min)   / (r.optMin - r.min);
    return 1.0 -           (nilai - r.optMax) / (r.max    - r.optMax);
  }
  return (nilai >= r.min && nilai <= r.max) ? 1.0 : 0.0;
}

// Nilai tekstur tanah tertimbang luas: r = Σ (proporsi luas kelas × nilai kelas);
// tanpa tanahProporsi dipakai kelas dominan (kodeTanah)
const TANAH_NILAI = { cocok: 1.0, batas: 0.5, tidak: 0.0 };
function nilaiTanah(iklim, t) {
  if (!iklim.tanahProporsi) return TANAH_NILAI[cekTanah(iklim.kodeTanah, t)];
  const ent = Object.entries(iklim.tanahProporsi);
  const tot = ent.reduce((s, [, p]) => s + p, 0);
  return ent.reduce((s, [k, p]) => s + p / tot * TANAH_NILAI[cekTanah(+k, t)], 0);
}
function statusDariNilai(r) { return r >= 0.95 ? 'cocok' : r <= 0.05 ? 'tidak' : 'batas'; }

function hitungSkorKrop(iklim, syarat) {
  const rTanah = nilaiTanah(iklim, syarat.tanah);
  // checks → label status untuk tampilan (Sesuai / Batas / Tidak)
  const checks = [
    cekVariabel(iklim.curahHujan, syarat.curah_hujan),
    cekVariabel(iklim.suhu,       syarat.suhu),
    cekVariabel(iklim.elevasi,    syarat.elevasi),
    statusDariNilai(rTanah)
  ];
  // nilaiArr → skor kontinu untuk perhitungan SAW
  const nilaiArr = [
    nilaiVariabel(iklim.curahHujan, syarat.curah_hujan),
    nilaiVariabel(iklim.suhu,       syarat.suhu),
    nilaiVariabel(iklim.elevasi,    syarat.elevasi),
    rTanah
  ];
  const sawScore = +nilaiArr.reduce((s, v, i) => s + SAW_BOBOT[i] * v, 0).toFixed(3);
  let level, label;
  if      (sawScore >= 0.80) { level = 'sangat-cocok'; label = 'Sangat Cocok';  }
  else if (sawScore >= 0.60) { level = 'cocok';         label = 'Cocok';          }
  else if (sawScore >= 0.40) { level = 'cukup';         label = 'Cukup Sesuai';  }
  else                        { level = 'kurang';        label = 'Kurang Sesuai'; }
  return { level, label, sawScore, checks, nilaiArr };
}

function teksTanahAktual(iklim, tanahName) {
  if (!iklim.tanahProporsi) return iklim.namaTanah.split(' (')[0];
  return Object.entries(iklim.tanahProporsi).sort((a, b) => b[1] - a[1]).slice(0, 2)
    .map(([k, p]) => `${tanahName[k] || k} ${Math.round(p * 100)}%`).join('; ');
}

function buildSAWPanel(iklim, syarat, hasil) {
  const tanahName = {
    1:'Clay', 2:'Silty Clay', 3:'Sandy Clay', 4:'Clay Loam',
    5:'Silty Clay Loam', 6:'Sandy Clay Loam', 7:'Loam', 8:'Silty Loam',
    9:'Sandy Loam', 10:'Silt', 11:'Loamy Sand', 12:'Sand'
  };
  // Urutan tampilan: bobot terbesar → terkecil; idx = posisi asli di SAW_BOBOT/nilaiArr/checks
  const kriteria = [
    {
      idx: 3, nama: 'Jenis Tanah', bobot: SAW_BOBOT[3],
      aktual: teksTanahAktual(iklim, tanahName),
      ideal: syarat.tanah.cocok.map(k => tanahName[k] || k).join(', ')
    },
    {
      idx: 2, nama: 'Elevasi', bobot: SAW_BOBOT[2],
      aktual: `${iklim.elevasi} m dpl`,
      ideal: `${syarat.elevasi.min}–${syarat.elevasi.max} m dpl`
    },
    {
      idx: 0, nama: 'Curah Hujan', bobot: SAW_BOBOT[0],
      aktual: `${iklim.curahHujan.toLocaleString('id')} mm/tahun`,
      ideal: `Optimal ${syarat.curah_hujan.optMin.toLocaleString('id')}–${syarat.curah_hujan.optMax.toLocaleString('id')} mm/tahun`
    },
    {
      idx: 1, nama: 'Suhu Udara', bobot: SAW_BOBOT[1],
      aktual: `${iklim.suhu.toFixed(1)} °C`,
      ideal: `Optimal ${syarat.suhu.optMin}–${syarat.suhu.optMax} °C`
    }
  ];
  const statusLbl = { cocok: 'Sesuai', batas: 'Batas', tidak: 'Tidak Sesuai' };
  const rows = kriteria.map((k) => {
    const st = hasil.checks[k.idx];
    const ni = hasil.nilaiArr[k.idx];
    const wb = (k.bobot * ni).toFixed(2);
    return `<tr>
      <td class="saw-td-name">${k.nama}</td>
      <td class="saw-td-c">${Math.round(k.bobot * 100)}%</td>
      <td>${k.aktual}</td>
      <td class="saw-td-ideal">${k.ideal}</td>
      <td class="saw-td-c"><span class="saw-nilai st-${st}">${ni.toFixed(2)}<br><small>${statusLbl[st]}</small></span></td>
      <td class="saw-td-c saw-wb">${wb}</td>
    </tr>`;
  }).join('');

  return `<div class="crop-detail-panel">
    <table class="saw-table">
      <thead><tr>
        <th>Kriteria</th><th class="saw-td-c">Bobot (w)</th>
        <th>Kondisi Aktual</th><th>Syarat Ideal</th>
        <th class="saw-td-c">Nilai (r)</th><th class="saw-td-c">w × r</th>
      </tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr>
        <td colspan="5" class="saw-total-lbl">Skor SAW Total &nbsp;=&nbsp; &Sigma; (Bobot &times; Nilai)</td>
        <td class="saw-td-c saw-total-val st-lvl-${hasil.level}">${hasil.sawScore.toFixed(2)}</td>
      </tr></tfoot>
    </table>
    <p class="saw-note">SAW (Simple Additive Weighting) &mdash; Normalisasi <em>r</em> kontinu: Optimal = 1,00; Zona transisi = interpolasi linear 0,00–1,00; Di luar toleransi = 0,00. Jenis tanah: rata-rata tertimbang luas kelas tekstur (Sesuai = 1,00; Batas = 0,50; Tidak = 0,00).</p>
  </div>`;
}

function renderSyaratTumbuh(kecId) {
  const el = document.getElementById('modalSyaratTumbuh');
  if (!el) return;
  if (typeof iklimKecamatan === 'undefined' || typeof syaratTumbuhDB === 'undefined') {
    el.innerHTML = '<p class="st-nodata">Data syarat tumbuh belum dimuat.</p>'; return;
  }
  const iklim = iklimKecamatan[kecId];
  if (!iklim) { el.innerHTML = '<p class="st-nodata">Data iklim tidak tersedia.</p>'; return; }

  const srcNote = iklim.dataStatus === 'estimasi'
    ? '<span class="st-src estimasi">* Sebagian data estimasi interpolasi regional</span>'
    : '<span class="st-src real">Sumber: CHIRPS v2 + ERA5-Land + FABDEM + OpenLandMap (GEE 2022–2024, statistik zonal per poligon kecamatan)</span>';

  const iklimBarHTML = `
    <div class="st-iklim-bar">
      <div class="st-iklim-item">
        <div class="st-iklim-val">${iklim.curahHujan.toLocaleString('id')}<span class="st-iklim-unit"> mm/th</span></div>
        <div class="st-iklim-label">Curah Hujan</div>
      </div>
      <div class="st-iklim-item">
        <div class="st-iklim-val">${iklim.suhu.toFixed(1)}<span class="st-iklim-unit"> °C</span></div>
        <div class="st-iklim-label">Suhu Udara</div>
      </div>
      <div class="st-iklim-item">
        <div class="st-iklim-val">${iklim.elevasi}<span class="st-iklim-unit"> m dpl</span></div>
        <div class="st-iklim-label">Elevasi</div>
      </div>
      <div class="st-iklim-item">
        <div class="st-iklim-val st-iklim-tanah">${iklim.namaTanah.split(' (')[0]}</div>
        <div class="st-iklim-label">Jenis Tanah</div>
      </div>
    </div>
    <div class="st-src-bar">${srcNote}</div>`;

  // Urutan dot sesuai bobot: Tanah(3) → Elevasi(2) → Hujan(0) → Suhu(1)
  const varOrder = [
    { label: 'Tanah', idx: 3 }, { label: 'Elevasi', idx: 2 },
    { label: 'Hujan', idx: 0 }, { label: 'Suhu', idx: 1 }
  ];
  const d = kecamatanData[kecId];
  const relevantCrops = (d && d.relevantCrops) ? d.relevantCrops : Object.keys(syaratTumbuhDB);
  const items = Object.entries(syaratTumbuhDB)
    .filter(([id]) => relevantCrops.includes(id))
    .map(([id, syarat]) => ({ id, syarat, hasil: hitungSkorKrop(iklim, syarat) }))
    .sort((a, b) => b.hasil.sawScore - a.hasil.sawScore);

  const cropsHTML = items.map(({ id, syarat, hasil }, rank) => {
    const dots = varOrder.map(v => `
      <div class="vc-col"><div class="vc-dot ${hasil.checks[v.idx]}"></div><div class="vc-lbl">${v.label}</div></div>`
    ).join('');
    const barW = Math.round(hasil.sawScore * 100);
    return `
      <div class="crop-st-card level-${hasil.level}" data-crop-key="${id}" role="button" tabindex="0" aria-expanded="false">
        <div class="crop-rank-badge">${rank + 1}</div>
        <div class="crop-st-info">
          <span class="crop-st-name">${syarat.nama}</span>
          <span class="crop-st-cat">${syarat.kategori}</span>
          <div class="crop-score-track"><div class="crop-score-fill level-fill-${hasil.level}" style="width:${barW}%"></div></div>
        </div>
        <div class="crop-vc-row">${dots}</div>
        <div class="crop-st-right">
          <div class="crop-badge-block">
            <span class="crop-badge-st bdg-${hasil.level}">${hasil.label.replace(' ', '<br>')}</span>
            <span class="crop-saw-val">${hasil.sawScore.toFixed(2)}</span>
          </div>
          <div class="crop-chevron-btn">
            <svg class="crop-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </div>
      </div>
      <div class="crop-detail-wrapper" data-detail="${id}" hidden>${buildSAWPanel(iklim, syarat, hasil)}</div>`;
  }).join('');

  const legendHTML = `
    <div class="st-legend">
      <span class="st-legend-title">Keterangan:</span>
      <div class="st-legend-item"><div class="st-legend-dot cocok"></div><span>Sesuai Optimal</span></div>
      <div class="st-legend-item"><div class="st-legend-dot batas"></div><span>Batas Toleransi</span></div>
      <div class="st-legend-item"><div class="st-legend-dot tidak"></div><span>Tidak Sesuai</span></div>
    </div>`;

  el.innerHTML = iklimBarHTML + legendHTML + `<div class="st-crops-grid">${cropsHTML}</div>`;

  el.querySelectorAll('.crop-st-card').forEach(card => {
    const open = () => {
      const key  = card.dataset.cropKey;
      const panel = el.querySelector(`[data-detail="${key}"]`);
      const wasOpen = !panel.hidden;
      el.querySelectorAll('.crop-detail-wrapper').forEach(p => { p.hidden = true; });
      el.querySelectorAll('.crop-st-card').forEach(c => { c.classList.remove('active'); c.setAttribute('aria-expanded','false'); });
      if (!wasOpen) { panel.hidden = false; card.classList.add('active'); card.setAttribute('aria-expanded','true'); }
    };
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); open(); } });
  });
}

// ============================================================
// CUSTOM LEAFLET MARKER ICON
// ============================================================
function createMarkerIcon(color = '#2B7A4E', label = '') {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">
      <filter id="shadow" x="-30%" y="-20%" width="160%" height="150%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.5)"/>
      </filter>
      <path d="M18 1C9.163 1 2 8.163 2 17c0 10.75 16 28 16 28S34 27.75 34 17C34 8.163 26.837 1 18 1z"
        fill="${color}" filter="url(#shadow)"/>
      <circle cx="18" cy="17" r="7.5" fill="rgba(3,12,6,0.92)"/>
      <text x="18" y="21" text-anchor="middle" font-size="8" font-weight="800"
        font-family="Outfit,sans-serif" fill="#4CA872">${label}</text>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -46]
  });
}

// ============================================================
// PETA IMAGE MAP
// ============================================================
const petaImages = {
  'sungai-raya':     'gambar/Peta_Sungai_Raya.png',
  'sungai-kakap':    'gambar/Peta_Sungai_Kakap.png',
  'rasau-jaya':      'gambar/Peta_Rasau_Jaya.png',
  'sungai-ambawang': 'gambar/Peta_Sungai_Ambawang.png',
  'kubu':            'gambar/Peta_Kubu.png',
  'batu-ampar':      'gambar/Peta_Batu_Ampar.png',
  'teluk-pakedai':   'gambar/Peta_Teluk_Pakedai.png',
  'terentang':       'gambar/Peta_Terentang.png',
  'kuala-mandor':    'gambar/Peta_Kuala_Mandor_B.png',
};

// ============================================================
// MODAL LEAFLET MAP INSTANCE
// ============================================================
let modalMap = null;
let modalMapMarker = null;
let modalMapCircle = null;
let modalDesaMap = null;
let modalDesaGeoLayer = null;
let desaDetailMap = null;
let desaDetailLayer = null;

function initOrUpdateModalMap(kecId) {
  try {
    const coords = kecamatanCoords[kecId];
    const d = kecamatanData[kecId];
    if (!coords || !d) return;

    // Update coordinate badge (overlay on map)
    const badge = document.getElementById('mapCoordBadge');
    if (badge) {
      const latDir = coords.lat < 0 ? 'LS' : 'LU';
      const latVal = Math.abs(coords.lat).toFixed(4);
      const lngVal = coords.lng.toFixed(4);
      badge.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
        ${latVal}\u00b0 ${latDir} \u00b7 ${lngVal}\u00b0 BT
      `;
    }

    // Populate coord info bar below map
    const bar = document.getElementById('coordInfoBar');
    if (bar) {
      const latDir  = coords.lat < 0 ? 'Lintang Selatan' : 'Lintang Utara';
      const latSym  = coords.lat < 0 ? 'LS' : 'LU';
      const latVal  = Math.abs(coords.lat).toFixed(4);
      const lngVal  = coords.lng.toFixed(4);
      bar.innerHTML = `
        <div class="coord-box">
          <div class="coord-box-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/>
              <polyline points="12,2 15,6 12,10 9,6 12,2"/>
            </svg>
          </div>
          <div class="coord-box-label">${latDir}</div>
          <div class="coord-box-value">${latVal}\u00b0</div>
          <div class="coord-box-sub">${latSym} \u00b7 Komponen Vertikal</div>
        </div>
        <div class="coord-box">
          <div class="coord-box-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="2" y1="12" x2="22" y2="12"/>
              <polyline points="22,12 18,9 14,12 18,15 22,12"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <div class="coord-box-label">Bujur Timur</div>
          <div class="coord-box-value">${lngVal}\u00b0</div>
          <div class="coord-box-sub">BT \u00b7 Komponen Horizontal</div>
        </div>
        <div class="coord-box">
          <div class="coord-box-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <div class="coord-box-label">Sistem Koordinat</div>
          <div class="coord-box-value">49S \u00b7 UTM</div>
          <div class="coord-box-sub">WGS 84 \u00b7 Kalimantan Barat</div>
        </div>
      `;
    }

    // Init Leaflet map if not yet created
    if (!modalMap) {
      modalMap = L.map('modalLeafletMap', {
        center: [coords.lat, coords.lng],
        zoom: coords.zoom,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true
      });

      addBasemap(modalMap);
    }

    // Remove old marker / batas wilayah
    if (modalMapMarker) { modalMap.removeLayer(modalMapMarker); }
    if (modalMapCircle) { modalMap.removeLayer(modalMapCircle); modalMapCircle = null; }

    // Batas wilayah kecamatan dari data GeoJSON; tanpa data, cukup pusatkan ke titik penanda
    const feature = getKecamatanFeature(kecId);
    if (feature) {
      modalMapCircle = L.geoJSON(feature, {
        style: { color: '#ffffff', weight: 2.5, fillColor: '#4CA872', fillOpacity: 0.18 }
      }).addTo(modalMap);
      modalMap.fitBounds(modalMapCircle.getBounds(), { padding: [16, 16] });
    } else {
      modalMap.setView([coords.lat, coords.lng], coords.zoom, { animate: true });
    }

    // Add custom marker
    const icon = createMarkerIcon('#2B7A4E', d.number);
    modalMapMarker = L.marker([coords.lat, coords.lng], { icon })
      .addTo(modalMap)
      .bindPopup(`<strong>${d.name}</strong><br/>Kecamatan ${d.number}`, { maxWidth: 200 })
      .openPopup();

    // Force re-render after visibility change (ukuran kontainer baru diketahui setelah modal tampil)
    setTimeout(() => {
      if (!modalMap) return;
      modalMap.invalidateSize();
      if (modalMapCircle) modalMap.fitBounds(modalMapCircle.getBounds(), { padding: [16, 16] });
    }, 150);
  } catch (e) {
    console.warn('Modal map error:', e);
  }
}

// ============================================================
// PETA DETAIL DESA — Khusus Kecamatan Rasau Jaya
// ============================================================
function initRasauJayaDesaMap() {
  try {
    if (typeof rasauJayaDesaData === 'undefined') {
      console.warn('rasauJayaDesaData tidak ditemukan — pastikan data/rasau_jaya_desa.js dimuat.');
      return;
    }

    // Init peta sekali saja
    if (!modalDesaMap) {
      modalDesaMap = L.map('modalDesaMap', {
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true
      });
      addBasemap(modalDesaMap);
    }

    // Bersihkan layer lama (kalau modal dibuka berkali-kali)
    if (modalDesaGeoLayer) {
      modalDesaMap.removeLayer(modalDesaGeoLayer);
      modalDesaGeoLayer = null;
    }

    modalDesaGeoLayer = L.geoJSON(rasauJayaDesaData, {
      style: feature => {
        const k = feature.properties.kelas || 'N';
        return {
          color: '#ffffff',
          weight: 1.5,
          fillColor: kelasColor[k] || '#888',
          fillOpacity: 0.55
        };
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        const k = p.kelas || 'N';
        layer.bindPopup(`
          <div style="font-family:'Outfit',sans-serif;min-width:170px;padding:2px 0">
            <div style="font-weight:700;font-size:13px;margin-bottom:5px;color:#0D1F16">${p.NAME_4}</div>
            <div style="font-size:11.5px;margin-bottom:2px">Kelas: <b style="color:${kelasColor[k]}">${k} — ${kelasLabel[k]}</b></div>
            <div style="font-size:11.5px;color:#444">Skor Weighted Overlay: <b>${p.skor ? p.skor.toFixed(2) : '-'}</b></div>
            <div style="font-size:11.5px;color:#444">NDVI rata-rata: <b>${p.ndvi ? p.ndvi.toFixed(2) : '-'}</b></div>
          </div>
        `, { maxWidth: 220 });
        layer.on('mouseover', () => layer.setStyle({ fillOpacity: 0.8, weight: 2.5 }));
        layer.on('mouseout',  () => layer.setStyle({ fillOpacity: 0.55, weight: 1.5 }));
      }
    }).addTo(modalDesaMap);

    modalDesaMap.fitBounds(modalDesaGeoLayer.getBounds(), { padding: [12, 12] });

    // Daftar desa di bawah peta, diurutkan dari skor tertinggi — bisa diklik untuk
    // fokus ke polygon-nya sekaligus membuka popup baru berisi komoditas desa tersebut
    const listEl = document.getElementById('modalDesaList');
    if (listEl) {
      const rows = [];
      modalDesaGeoLayer.eachLayer(layer => {
        rows.push({ layer, props: layer.feature.properties });
      });
      rows.sort((a, b) => (b.props.skor || 0) - (a.props.skor || 0));

      listEl.innerHTML = rows.map((r, i) => {
        const k = r.props.kelas || 'N';
        return `
        <div class="kelas-row kelas--${k.toLowerCase()}" data-idx="${i}" role="button" tabindex="0" aria-label="Buka detail Desa ${r.props.NAME_4}">
          <span class="kelas-rank">${i + 1}</span>
          <span class="kelas-badge">${k}</span>
          <span class="kelas-name">${r.props.NAME_4}</span>
          <span class="kelas-range">${r.props.skor ? r.props.skor.toFixed(2) : '-'}</span>
        </div>`;
      }).join('');

      listEl.querySelectorAll('.kelas-row').forEach(row => {
        const openRow = () => {
          const idx = Number(row.dataset.idx);
          const target = rows[idx];
          if (!target) return;
          modalDesaMap.fitBounds(target.layer.getBounds(), { padding: [40, 40], maxZoom: 15 });
          target.layer.openPopup();
          openDesaModal(target.layer.feature, idx + 1, rows.length);
        };
        row.addEventListener('click', openRow);
        row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openRow(); } });
      });
    }

    setTimeout(() => { if (modalDesaMap) modalDesaMap.invalidateSize(); }, 150);
  } catch (e) {
    console.warn('Rasau Jaya desa map error:', e);
  }
}

// ── SAW komoditas tingkat DESA — Rasau Jaya (9 kriteria) ────────────────────
// Memperluas hitungSkorKrop (4 kriteria iklim/tanah tingkat kecamatan) dengan
// 5 parameter kualitas lahan per desa: OpenLandMap (pH, C-organik), KLHK (gambut), SRTM (lereng), InaRISK (banjir)
// (data/parameter_lahan_desa.js): pH, C-Organik, Ketebalan Gambut, Lereng,
// Bahaya Banjir. Kelima parameter bernilai sama untuk tiap komoditas dalam satu
// desa (kualitas lahan, bukan syarat tumbuh spesifik komoditas).
//
// Bobot disusun per kelompok kualitas lahan Juknis Evaluasi Lahan BBSDLP (2011):
//   tc Temperatur        : Elevasi 0,10 · Suhu 0,05
//   wa Ketersediaan air  : Curah Hujan 0,10
//   rc Media perakaran   : Jenis Tanah 0,18 · Ketebalan Gambut 0,07
//   nr Retensi hara      : pH 0,15 · C-Organik 0,10
//   eh Bahaya erosi      : Lereng 0,10
//   fh Bahaya banjir     : Banjir 0,15
// Urutan indeks: 0-3 = hitungSkorKrop (CH, Suhu, Elevasi, Tanah), 4-8 = PARAM_LAHAN_DESA
const SAW_BOBOT_DESA = [0.10, 0.05, 0.10, 0.18, 0.15, 0.10, 0.07, 0.10, 0.15];

const PARAM_LAHAN_DESA = [
  { key: 'ph',     nama: 'pH Tanah',          kode: 'nr' },
  { key: 'corg',   nama: 'C-Organik',         kode: 'nr' },
  { key: 'gambut', nama: 'Ketebalan Gambut',  kode: 'rc' },
  { key: 'lereng', nama: 'Kemiringan Lereng', kode: 'eh' },
  { key: 'banjir', nama: 'Bahaya Banjir',     kode: 'fh' }
];
const KODE_KUALITAS_DASAR = ['wa', 'tc', 'tc', 'rc']; // CH, Suhu, Elevasi, Tanah
const URUTAN_KELAS = ['S1', 'S2', 'S3', 'N'];

function getParamLahanDesa(namaDesa) {
  return (typeof parameterLahanDesa !== 'undefined' && parameterLahanDesa[namaDesa]) || null;
}

// Kelas Juknis per kriteria iklim/tanah, diturunkan dari status & nilai r trapesoid
function kelasKriteriaDasar(status, r) {
  if (status === 'cocok') return 'S1';
  if (status === 'tidak') return 'N';
  return r >= 0.5 ? 'S2' : 'S3';
}

function hitungSkorKropDesa(iklim, syarat, desaProps) {
  const dasar = hitungSkorKrop(iklim, syarat);
  const param = getParamLahanDesa(desaProps.NAME_4);
  if (!param) return { ...dasar, juknis: null };

  // Skor kelas 1–4 → r 0–1 (N = 0, S1 = 1), sejajar dengan skala r kriteria iklim
  const nilaiParam = PARAM_LAHAN_DESA.map(p => param[p.key] ? (param[p.key].skor - 1) / 3 : 0);
  const nilaiArr = [...dasar.nilaiArr, ...nilaiParam];
  const sawScore = +nilaiArr.reduce((s, v, i) => s + SAW_BOBOT_DESA[i] * v, 0).toFixed(3);

  let level, label;
  if      (sawScore >= 0.80) { level = 'sangat-cocok'; label = 'Sangat Cocok';  }
  else if (sawScore >= 0.60) { level = 'cocok';         label = 'Cocok';          }
  else if (sawScore >= 0.40) { level = 'cukup';         label = 'Cukup Sesuai';  }
  else                        { level = 'kurang';        label = 'Kurang Sesuai'; }

  // Kelas Juknis (hukum minimum): kelas akhir = kelas kriteria terburuk,
  // subkelas = kode kualitas lahan yang menjadi faktor pembatas
  const kelasArr = [
    ...dasar.checks.map((st, i) => kelasKriteriaDasar(st, dasar.nilaiArr[i])),
    ...PARAM_LAHAN_DESA.map(p => param[p.key] ? param[p.key].kelas : 'N')
  ];
  const kodeArr = [...KODE_KUALITAS_DASAR, ...PARAM_LAHAN_DESA.map(p => p.kode)];
  const kelas = kelasArr.reduce((a, b) => URUTAN_KELAS.indexOf(b) > URUTAN_KELAS.indexOf(a) ? b : a, 'S1');
  const pembatas = kelas === 'S1' ? [] : [...new Set(kodeArr.filter((_, i) => kelasArr[i] === kelas))];
  const juknis = { kelas, pembatas, kelasArr, label: pembatas.length ? `${kelas}-${pembatas.join(',')}` : kelas };

  return { ...dasar, level, label, sawScore, nilaiArr, juknis };
}

function getDesaCropRanking(desaProps) {
  const d = kecamatanData['rasau-jaya'];
  if (!d || !d.relevantCrops) return [];
  if (typeof iklimKecamatan === 'undefined' || typeof syaratTumbuhDB === 'undefined') return [];
  const iklim = iklimKecamatan['rasau-jaya'];
  if (!iklim) return [];
  return d.relevantCrops
    .filter(id => syaratTumbuhDB[id])
    .map(id => {
      const syarat = syaratTumbuhDB[id];
      const hasil = hitungSkorKropDesa(iklim, syarat, desaProps);
      return { id, nama: syarat.nama, icon: syarat.icon, kategori: syarat.kategori, ...hasil };
    })
    .sort((a, b) => b.sawScore - a.sawScore);
}

function fmtAngka(v, d = 2) { return v.toFixed(d).replace('.', ','); }

// ── Panel detail SAW komoditas — versi desa (9 kriteria, format sama dengan
// buildSAWPanel tingkat kecamatan, ditambah 5 parameter lahan & kelas Juknis) ─
function buildSAWPanelDesa(iklim, syarat, hasil, desaProps) {
  const tanahName = {
    1:'Clay', 2:'Silty Clay', 3:'Sandy Clay', 4:'Clay Loam',
    5:'Silty Clay Loam', 6:'Sandy Clay Loam', 7:'Loam', 8:'Silty Loam',
    9:'Sandy Loam', 10:'Silt', 11:'Loamy Sand', 12:'Sand'
  };
  const statusLbl = { cocok: 'Sesuai', batas: 'Batas', tidak: 'Tidak Sesuai' };
  const param = getParamLahanDesa(desaProps.NAME_4) || {};

  // Urutan tampilan: bobot terbesar → terkecil
  const kriteria = [
    {
      idx: 3, nama: 'Jenis Tanah', kode: 'rc',
      aktual: teksTanahAktual(iklim, tanahName),
      ideal: syarat.tanah.cocok.map(k => tanahName[k] || k).join(', ')
    },
    {
      idx: 2, nama: 'Elevasi', kode: 'tc',
      aktual: `${iklim.elevasi} m dpl`,
      ideal: `${syarat.elevasi.min}–${syarat.elevasi.max} m dpl`
    },
    {
      idx: 0, nama: 'Curah Hujan', kode: 'wa',
      aktual: `${iklim.curahHujan.toLocaleString('id')} mm/tahun`,
      ideal: `Optimal ${syarat.curah_hujan.optMin.toLocaleString('id')}–${syarat.curah_hujan.optMax.toLocaleString('id')} mm/tahun`
    },
    {
      idx: 1, nama: 'Suhu Udara', kode: 'tc',
      aktual: `${iklim.suhu.toFixed(1)} °C`,
      ideal: `Optimal ${syarat.suhu.optMin}–${syarat.suhu.optMax} °C`
    },
    ...PARAM_LAHAN_DESA.map((p, j) => {
      const d = param[p.key];
      return {
        idx: 4 + j, nama: p.nama, kode: p.kode, lahan: true,
        aktual: d ? `Skor ${fmtAngka(d.skor)} / 4 · dominan ${d.kelas} (${fmtAngka(d.dist[d.kelas], 0)}% luas)` : 'Data tidak tersedia',
        ideal: 'S1 (skor 4)'
      };
    })
  ].sort((a, b) => SAW_BOBOT_DESA[b.idx] - SAW_BOBOT_DESA[a.idx]);

  const rows = kriteria.map((k) => {
    const bobot = SAW_BOBOT_DESA[k.idx];
    const ni = hasil.nilaiArr[k.idx];
    const kls = hasil.juknis ? hasil.juknis.kelasArr[k.idx] : '';
    const st = k.lahan ? (kls === 'S1' ? 'cocok' : kls === 'N' ? 'tidak' : 'batas') : hasil.checks[k.idx];
    const ket = k.lahan ? `Kelas ${kls}` : statusLbl[st];
    return `<tr>
      <td class="saw-td-name">${k.nama} <small class="saw-kode">${k.kode}</small></td>
      <td class="saw-td-c">${Math.round(bobot * 100)}%</td>
      <td>${k.aktual}</td>
      <td class="saw-td-ideal">${k.ideal}</td>
      <td class="saw-td-c"><span class="saw-nilai st-${st}">${ni.toFixed(2)}<br><small>${ket}</small></span></td>
      <td class="saw-td-c saw-wb">${(bobot * ni).toFixed(2)}</td>
    </tr>`;
  }).join('');

  const juknisRow = hasil.juknis ? `<tr>
        <td colspan="5" class="saw-total-lbl">Kelas Juknis BBSDLP &nbsp;=&nbsp; kelas kriteria terburuk (faktor pembatas)</td>
        <td class="saw-td-c saw-total-val saw-juknis">${hasil.juknis.label}</td>
      </tr>` : '';
  const cakupanMin = Math.min(...PARAM_LAHAN_DESA.map(p => param[p.key] ? param[p.key].cakupan : 0));
  const cakupanNote = cakupanMin < 95
    ? ` Data parameter kualitas lahan mencakup ±${fmtAngka(cakupanMin, 0)}% wilayah ${desaProps.NAME_4}; skor dihitung dari bagian yang tercakup.`
    : '';

  return `<div class="crop-detail-panel">
    <table class="saw-table">
      <thead><tr>
        <th>Kriteria</th><th class="saw-td-c">Bobot (w)</th>
        <th>Kondisi Aktual</th><th>Syarat Ideal</th>
        <th class="saw-td-c">Nilai (r)</th><th class="saw-td-c">w × r</th>
      </tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr>
        <td colspan="5" class="saw-total-lbl">Skor SAW Total &nbsp;=&nbsp; &Sigma; (Bobot &times; Nilai)</td>
        <td class="saw-td-c saw-total-val st-lvl-${hasil.level}">${hasil.sawScore.toFixed(2)}</td>
      </tr>${juknisRow}</tfoot>
    </table>
    <p class="saw-note">SAW tingkat desa memakai 9 kriteria yang dikelompokkan menurut kualitas lahan Juknis Evaluasi Lahan BBSDLP (2011): 4 kriteria iklim &amp; tanah tingkat Kecamatan Rasau Jaya, ditambah 5 parameter lahan spesifik ${desaProps.NAME_4} (pH dan C-organik OpenLandMap, ketebalan gambut KLHK, lereng SRTM, bahaya banjir InaRISK; dikelaskan dengan ambang padi sawah Permentan 79/2013; rata-rata skor tertimbang luas; r = (skor &minus; 1) / 3). Kode: tc temperatur, wa ketersediaan air, rc media perakaran, nr retensi hara, eh bahaya erosi, fh bahaya banjir.${cakupanNote}</p>
  </div>`;
}

// Jumlah komoditas yang ditampilkan per desa — desa berperingkat skor lahan lebih
// tinggi (relatif terhadap desa lain di kecamatan yang sama) menampilkan lebih banyak
function getDesaCropCount(rank, totalDesa, totalCrops) {
  if (totalDesa <= 1 || totalCrops <= 1) return totalCrops;
  const minCount = Math.max(4, Math.round(totalCrops * 0.55));
  const step = (totalCrops - minCount) / (totalDesa - 1);
  return Math.max(minCount, Math.round(totalCrops - step * (rank - 1)));
}

// ── Estimasi luas poligon (algoritma JPL/geojson-area, dipakai turf.js) ────
function ringAreaM2(coords) {
  const R = 6378137; // radius bumi (m), asumsi bola WGS84
  const len = coords.length;
  if (len <= 2) return 0;
  let area = 0;
  for (let i = 0; i < len; i++) {
    let p1, p2, p3;
    if (i === len - 2)      { p1 = coords[len - 2]; p2 = coords[len - 1]; p3 = coords[0]; }
    else if (i === len - 1) { p1 = coords[len - 1]; p2 = coords[0];      p3 = coords[1]; }
    else                    { p1 = coords[i];       p2 = coords[i + 1];  p3 = coords[i + 2]; }
    area += (p3[0] - p1[0]) * Math.PI / 180 * Math.sin(p2[1] * Math.PI / 180);
  }
  return Math.abs(area * R * R / 2);
}

function polygonAreaKm2(geometry) {
  if (!geometry) return 0;
  const polys = geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates];
  let total = 0;
  polys.forEach(rings => {
    rings.forEach((ring, i) => {
      const a = ringAreaM2(ring);
      total += i === 0 ? a : -a; // ring pertama = batas luar, sisanya = lubang
    });
  });
  return total / 1e6;
}

// ── Peta mini lokasi & batas desa, dipakai di dalam Modal Desa ─────────────
function initDesaDetailMap(feature) {
  try {
    if (!desaDetailMap) {
      desaDetailMap = L.map('desaDetailMap', {
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true
      });
      addBasemap(desaDetailMap);
    }

    if (desaDetailLayer) {
      desaDetailMap.removeLayer(desaDetailLayer);
      desaDetailLayer = null;
    }

    const k = feature.properties.kelas || 'N';
    desaDetailLayer = L.geoJSON(feature, {
      style: {
        color: '#ffffff',
        weight: 2,
        fillColor: kelasColor[k] || '#888',
        fillOpacity: 0.5
      }
    }).addTo(desaDetailMap);

    desaDetailMap.fitBounds(desaDetailLayer.getBounds(), { padding: [16, 16], maxZoom: 14 });
    setTimeout(() => { if (desaDetailMap) desaDetailMap.invalidateSize(); }, 150);
  } catch (e) {
    console.warn('Desa detail map error:', e);
  }
}

// ── Narasi gambaran umum & rekomendasi, digenerasi dari data skor/kelas desa ─
function generateDesaNarrative(props, rank, totalDesa, luasKm2) {
  const k = props.kelas || 'N';
  const skorTxt = props.skor ? props.skor.toFixed(2) : '-';
  const ndviTxt = props.ndvi ? props.ndvi.toFixed(2) : '-';
  const posisiTxt = rank === 1 ? 'skor tertinggi di kecamatan ini'
    : rank === totalDesa ? 'skor terendah di kecamatan ini'
    : `peringkat ke-${rank} dari ${totalDesa} desa`;
  const ndviTxt2 = (props.ndvi || 0) >= 0.7
    ? 'kerapatan vegetasi produktif yang tinggi'
    : 'aktivitas fotosintesis yang stabil';

  return `${props.NAME_4} merupakan salah satu dari ${totalDesa} desa di Kecamatan Rasau Jaya yang dianalisis secara rinci hingga tingkat desa atas permintaan Dinas Pertanian Kabupaten Kubu Raya. Berdasarkan overlay tertimbang 5 lapisan raster Sentinel-2 (NDVI, jenis tanah, ketersediaan air, kemiringan lereng, dan aksesibilitas), desa ini memperoleh skor Weighted Overlay ${skorTxt} dari skala 0–4 — ${posisiTxt} — dan masuk kelas kesesuaian lahan ${k} (${kelasLabel[k] || ''}). Nilai NDVI rata-rata ${ndviTxt} mencerminkan ${ndviTxt2} pada karakteristik lahan gambut dangkal hingga sedang yang menjadi ciri dominan seluruh wilayah kecamatan. Estimasi luas wilayah desa berdasarkan batas administrasi (poligon GeoJSON) adalah ±${luasKm2.toFixed(1)} km².`;
}

function generateDesaRekomendasi(props, rank, totalDesa) {
  const k = props.kelas || 'N';
  const rekom = [];

  if (k === 'S1') {
    rekom.push('Kelas kesesuaian sangat baik — prioritaskan sebagai kawasan percontohan intensifikasi pertanian lahan gambut.');
  } else if (k === 'S2') {
    rekom.push('Kelas cukup sesuai — ameliorasi lahan gambut (pengapuran & pemupukan berimbang) tetap diperlukan untuk menstabilkan pH masam (3,5–4,5) pada lapisan gambut atas.');
  } else if (k === 'S3') {
    rekom.push('Kesesuaian marginal — perlu perbaikan tata air dan input agronomi yang lebih intensif sebelum ekstensifikasi lahan.');
  } else {
    rekom.push('Kelas tidak sesuai untuk budidaya intensif — arahkan pada konservasi gambut atau komoditas yang sangat toleran lahan basah.');
  }

  rekom.push('Manajemen muka air tanah gambut perlu dijaga agar tidak terlalu kering (memicu subsiden & risiko kebakaran) maupun tergenang berlebih.');

  if (rank <= Math.ceil(totalDesa / 2)) {
    rekom.push(`Skor Weighted Overlay desa ini berada pada separuh teratas (peringkat ${rank} dari ${totalDesa}) — berpotensi menjadi lokasi replikasi model pertanian gambut adaptif ke desa lain di kecamatan.`);
  } else {
    rekom.push(`Skor Weighted Overlay desa ini berada pada separuh bawah (peringkat ${rank} dari ${totalDesa}) — disarankan validasi lapangan untuk memastikan faktor pembatas utama (tanah, air, atau aksesibilitas).`);
  }

  // Faktor pembatas dari parameter kualitas lahan desa (kelas dominan S3/N)
  const tindakan = {
    ph:     'pengapuran (dolomit) dan pemupukan berimbang untuk menaikkan pH tanah',
    corg:   'penambahan bahan organik (pupuk kandang/kompos) untuk memperbaiki C-organik',
    gambut: 'pengelolaan gambut sesuai ketebalannya (budidaya adaptif, tanpa pembakaran)',
    lereng: 'konservasi tanah (terasering, tanaman penutup) pada lahan berlereng',
    banjir: 'perbaikan tata air (saluran drainase, pintu air, tanggul) untuk mengendalikan genangan'
  };
  const param = getParamLahanDesa(props.NAME_4);
  if (param) {
    PARAM_LAHAN_DESA
      .filter(p => param[p.key] && (param[p.key].kelas === 'S3' || param[p.key].kelas === 'N'))
      .forEach(p => rekom.push(`Faktor pembatas ${p.nama} (${p.kode}) — dominan kelas ${param[p.key].kelas} pada ${fmtAngka(param[p.key].dist[param[p.key].kelas], 0)}% luas desa; diperlukan ${tindakan[p.key]}.`));
  }

  rekom.push('Prioritas: validasi lapangan produktivitas aktual komoditas unggulan untuk kalibrasi model analisis spasial penelitian ini.');
  return rekom;
}

// ============================================================
// MODAL DESA — popup terpisah, dibuka dari dalam modal Kecamatan Rasau Jaya
// ============================================================
function openDesaModal(feature, rank, totalDesa) {
  const desaProps = feature.properties;
  const k = desaProps.kelas || 'N';
  const color = kelasColor[k] || '#888';

  const iconEl = document.getElementById('desaModalIcon');
  if (iconEl) {
    iconEl.style.background = color;
    iconEl.innerHTML = `<span class="desa-modal-icon">${k}</span>`;
  }
  document.getElementById('desaModalTitle').textContent   = desaProps.NAME_4;
  document.getElementById('desaModalTagline').textContent = `Desa di Kecamatan Rasau Jaya — ${kelasLabel[k] || ''}`;

  document.getElementById('desaModalStatsRow').innerHTML = [
    { val: k, key: 'Kelas Kesesuaian' },
    { val: desaProps.skor ? desaProps.skor.toFixed(2) : '-', key: 'Skor Weighted Overlay' },
    { val: desaProps.ndvi ? desaProps.ndvi.toFixed(2) : '-', key: 'NDVI Rata-rata' },
    { val: `${rank} / ${totalDesa}`, key: 'Peringkat Skor Desa' }
  ].map(s => `
    <div class="modal-stat">
      <div class="modal-stat-val">${s.val}</div>
      <div class="modal-stat-key">${s.key}</div>
    </div>
  `).join('');

  // Peta lokasi & batas desa
  initDesaDetailMap(feature);

  // Gambaran umum (narasi otomatis dari skor/kelas/ndvi/luas)
  const luasKm2 = polygonAreaKm2(feature.geometry);
  document.getElementById('desaModalDesc').textContent = generateDesaNarrative(desaProps, rank, totalDesa, luasKm2);

  // Data wilayah
  document.getElementById('desaModalDataGrid').innerHTML = [
    { key: 'Luas Wilayah (estimasi)', val: `±${luasKm2.toFixed(1)} km²` },
    { key: 'Kelas Kesesuaian', val: `${k} — ${kelasLabel[k] || ''}` },
    { key: 'Skor Weighted Overlay', val: `${desaProps.skor ? desaProps.skor.toFixed(2) : '-'} / 4,00` },
    { key: 'NDVI Rata-rata', val: `${desaProps.ndvi ? desaProps.ndvi.toFixed(2) : '-'} (Sentinel-2, 2022–2024)` },
    { key: 'Peringkat di Kecamatan', val: `${rank} dari ${totalDesa} desa` },
    { key: 'Topografi', val: 'Lahan Gambut Dangkal–Sedang' },
    ...PARAM_LAHAN_DESA.map(p => {
      const d = (getParamLahanDesa(desaProps.NAME_4) || {})[p.key];
      return {
        key: `${p.nama} (${p.kode})`,
        val: d ? `Skor ${fmtAngka(d.skor)} / 4 — dominan ${d.kelas} (${fmtAngka(d.dist[d.kelas], 0)}% luas)` : 'Data tidak tersedia'
      };
    })
  ].map(row => `
    <div class="data-row">
      <span class="data-key">${row.key}</span>
      <span class="data-val">${row.val}</span>
    </div>
  `).join('');

  // Rekomendasi pengelolaan lahan
  document.getElementById('desaModalPotensi').innerHTML =
    generateDesaRekomendasi(desaProps, rank, totalDesa).map(p => `<li>${p}</li>`).join('');

  const allCrops = getDesaCropRanking(desaProps);
  const count = getDesaCropCount(rank, totalDesa, allCrops.length);
  const items = allCrops.slice(0, count);

  document.getElementById('desaModalNote').textContent =
    `Peringkat komoditas dihitung dari SAW 9 kriteria khusus tingkat desa: Curah Hujan, Suhu, Elevasi, dan Jenis Tanah (data iklim Kecamatan Rasau Jaya), ditambah 5 parameter kualitas lahan ${desaProps.NAME_4} (pH Tanah, C-Organik, Ketebalan Gambut, Kemiringan Lereng, Bahaya Banjir) dari data spasial OpenLandMap, KLHK, SRTM, dan InaRISK. Bobot dikelompokkan menurut kualitas lahan Juknis BBSDLP (2011); kelas Juknis pada tiap kartu menunjukkan kelas kriteria terburuk beserta faktor pembatasnya. Jumlah komoditas yang ditampilkan (${count} dari ${allCrops.length}) menyesuaikan peringkat skor desa ini relatif terhadap ${totalDesa - 1} desa lain di kecamatan yang sama.`;

  const iklimDesa = (typeof iklimKecamatan !== 'undefined') ? iklimKecamatan['rasau-jaya'] : null;
  const gridEl = document.getElementById('desaModalCropsGrid');

  gridEl.innerHTML = items.map((c, i) => {
    const barW = Math.round(c.sawScore * 100);
    const rankCls = i < 3 ? `rank-${i + 1}` : '';
    const syarat = (typeof syaratTumbuhDB !== 'undefined') ? syaratTumbuhDB[c.id] : null;
    const panelHTML = (iklimDesa && syarat) ? buildSAWPanelDesa(iklimDesa, syarat, c, desaProps) : '';
    return `
      <div class="desa-crop-card level-${c.level}" data-crop-key="${c.id}" role="button" tabindex="0" aria-expanded="false">
        <div class="desa-crop-rank ${rankCls}">${i + 1}</div>
        <div class="desa-crop-body">
          <div class="desa-crop-head">
            <span class="desa-crop-name">${c.nama}</span>
            <span class="desa-crop-cat">${c.kategori}</span>
          </div>
          <div class="desa-crop-bar-track">
            <div class="desa-crop-bar-fill level-fill-${c.level}" style="width:${barW}%">
              <span class="desa-crop-bar-shine"></span>
            </div>
          </div>
        </div>
        <div class="desa-crop-side">
          <span class="desa-crop-kelas-chip chip-${c.level}">${c.label}</span>
          <span class="desa-crop-score-val">${c.sawScore.toFixed(2)}</span>
          ${c.juknis ? `<span class="desa-crop-juknis" title="Kelas Juknis BBSDLP (faktor pembatas)">Juknis ${c.juknis.label}</span>` : ''}
        </div>
        <div class="crop-chevron-btn">
          <svg class="crop-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
        </div>
      </div>
      <div class="crop-detail-wrapper" data-detail="${c.id}" hidden>${panelHTML}</div>`;
  }).join('');

  gridEl.querySelectorAll('.desa-crop-card').forEach(card => {
    const open = () => {
      const key = card.dataset.cropKey;
      const panel = gridEl.querySelector(`[data-detail="${key}"]`);
      if (!panel) return;
      const wasOpen = !panel.hidden;
      gridEl.querySelectorAll('.crop-detail-wrapper').forEach(p => { p.hidden = true; });
      gridEl.querySelectorAll('.desa-crop-card').forEach(c => { c.classList.remove('active'); c.setAttribute('aria-expanded', 'false'); });
      if (!wasOpen) { panel.hidden = false; card.classList.add('active'); card.setAttribute('aria-expanded', 'true'); }
    };
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });

  document.getElementById('modalOverlay').classList.remove('open');
  const desaOverlay = document.getElementById('desaModalOverlay');
  desaOverlay.classList.add('open');
  document.getElementById('desaModalBox').scrollTop = 0;
}

function closeDesaModal() {
  document.getElementById('desaModalOverlay').classList.remove('open');
  document.getElementById('modalOverlay').classList.add('open');
}

// ============================================================
// HERO MAP — Full-screen Leaflet
// ============================================================
function initHeroMap() {
  try {
    const heroMap = L.map('heroMap', {
      center: [-0.18, 109.30],
      zoom: 10,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      keyboard: false,
      attributionControl: true
    });

    // Esri Dark Gray Canvas — peta dasar gelap + label
    esriLayer('Canvas/World_Dark_Gray_Base').addTo(heroMap);
    esriLayer('Canvas/World_Dark_Gray_Reference').addTo(heroMap);

    // Add all 9 kecamatan markers on hero map
    Object.entries(kecamatanCoords).forEach(([kecId, coord]) => {
      const d = kecamatanData[kecId];
      const smallIcon = L.divIcon({
        html: `
          <div style="
            width:28px; height:28px;
            background: #2B7A4E;
            border: 2px solid rgba(255,255,255,0.85);
            border-radius: 50%;
            display:flex; align-items:center; justify-content:center;
            font-size:9px; font-weight:700; color:#F0FDF4;
            font-family:'Space Grotesk',sans-serif;
            box-shadow: 0 0 10px rgba(43,122,78,0.60), 0 2px 8px rgba(0,0,0,0.5);
            cursor:pointer;
          ">${d.number}</div>
        `,
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -18]
      });

      L.marker([coord.lat, coord.lng], { icon: smallIcon })
        .addTo(heroMap)
        .bindPopup(`<strong>${d.name}</strong>`, { maxWidth: 160, closeButton: false });
    });

    // Label
    L.marker([-0.18, 109.30], {
      icon: L.divIcon({
        html: `<div style="font-weight:700;font-size:13px;color:#B8DFCB;font-family:'Space Grotesk',sans-serif;text-shadow:0 0 16px rgba(43,122,78,0.9),0 2px 8px rgba(0,0,0,0.95);letter-spacing:0.06em;white-space:nowrap;">Kabupaten Kubu Raya</div>`,
        className: '',
        iconAnchor: [80, 10]
      })
    }).addTo(heroMap);

    // ── Layer Kesesuaian Lahan (GeoJSON) ──────────────────────
    // kesesuaianLahanData dimuat dari data/kesesuaian_data_v2.js
    if (typeof kesesuaianLahanData !== 'undefined') {
        const geoData = kesesuaianLahanData;
        L.geoJSON(geoData, {
          style: feature => {
            const k = feature.properties.kelas || 'N';
            return {
              color: 'rgba(255,255,255,0.55)',
              weight: 1.5,
              fillColor: kelasColor[k] || '#888',
              fillOpacity: 0.42
            };
          },
          onEachFeature: (feature, layer) => {
            const p = feature.properties;
            const k = p.kelas || 'N';
            const ndviDisplay = p.ndvi ? p.ndvi.toFixed(2) : '-';
            layer.bindPopup(`
              <div style="font-family:'Outfit',sans-serif;min-width:180px;padding:2px 0">
                <div style="font-weight:700;font-size:14px;margin-bottom:6px;color:#0D1F16">${p.NAME_3}</div>
                <div style="font-size:12px;margin-bottom:3px">Kelas: <b style="color:${kelasColor[k]}">${k} — ${kelasLabel[k]}</b></div>
                <div style="font-size:12px;margin-bottom:3px;color:#444">Komoditas: ${p.komoditas}</div>
                <div style="font-size:12px;color:#444">NDVI rata-rata: <b>${ndviDisplay}</b></div>
                <div style="font-size:12px;color:#444">Skor Weighted Overlay: <b>${p.skor ? p.skor.toFixed(2) : '-'}</b></div>
                <div style="font-size:10px;color:#2B8A50;margin-top:6px;font-weight:600">Sumber: Sentinel-2 SR 2022–2024</div>
              </div>
            `, { maxWidth: 240 });

            layer.on('mouseover', () => layer.setStyle({ fillOpacity: 0.65, weight: 2.5 }));
            layer.on('mouseout',  () => layer.setStyle({ fillOpacity: 0.42, weight: 1.5 }));
            layer.on('click', () => {
              const kecId = nameToKecId[p.NAME_3];
              if (kecId) openModal(kecId);
            });
          }
        }).addTo(heroMap);

        // Legenda
        const legend = L.control({ position: 'bottomright' });
        legend.onAdd = () => {
          const div = L.DomUtil.create('div', 'map-legend');
          div.innerHTML = `
            <div class="legend-title">Kesesuaian Lahan</div>
            <div class="legend-item"><span class="legend-dot" style="background:#1a6e3c"></span>S1 — Sangat Sesuai</div>
            <div class="legend-item"><span class="legend-dot" style="background:#5aac72"></span>S2 — Cukup Sesuai</div>
            <div class="legend-item"><span class="legend-dot" style="background:#e8c53a"></span>S3 — Sesuai Marginal</div>
            <div class="legend-item"><span class="legend-dot" style="background:#d94f3a"></span>N — Tidak Sesuai</div>          `;
          return div;
        };
        legend.addTo(heroMap);
    } else {
      console.warn('kesesuaianLahanData tidak ditemukan — pastikan data/kesesuaian_data_v2.js dimuat.');
    }

  } catch (e) {
    console.warn('Hero map could not be initialized:', e);
    // Fallback: show a gradient background
    const heroMapEl = document.getElementById('heroMap');
    if (heroMapEl) {
      heroMapEl.style.background = 'linear-gradient(160deg, #c8e6c9 0%, #e8f5e9 100%)';
    }
  }
}

// ============================================================
// NAVBAR SCROLL
// ============================================================
function initNavbar() {
  const nav = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
  }, { passive: true });
}

// ============================================================
// HAMBURGER MENU
// ============================================================
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// ============================================================
// SCROLL REVEAL
// ============================================================
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

// ============================================================
// CARD STAGGER
// ============================================================
function initCardStagger() {
  const cards = document.querySelectorAll('.kec-card');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const idx = [...cards].indexOf(card);
        setTimeout(() => card.classList.add('visible'), idx * 75);
        obs.unobserve(card);
      }
    });
  }, { threshold: 0.08 });
  cards.forEach(c => obs.observe(c));
}

// ============================================================
// CARD CLICK → MODAL
// ============================================================
function initCardClicks() {
  document.querySelectorAll('.kec-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.kec));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.dataset.kec); }
    });
  });
}

// ============================================================
// MODAL OPEN / CLOSE
// ============================================================
function openModal(kecId) {
  const d = kecamatanData[kecId];
  if (!d) return;

  // --- Populate text content ---
  document.getElementById('modalNumber').textContent  = `Kecamatan · ${d.number}`;
  document.getElementById('modalTitle').textContent   = d.name;
  document.getElementById('modalTagline').textContent = d.tagline;
  document.getElementById('modalDesc').textContent    = d.desc;

  // Tampilkan gambar peta kecamatan di header modal
  const modalIconEl = document.getElementById('modalMapIcon');
  modalIconEl.innerHTML = '';
  const petaSrc = petaImages[kecId];
  if (petaSrc) {
    const img = document.createElement('img');
    img.src = petaSrc;
    img.alt = `Peta ${kecamatanData[kecId]?.name || kecId}`;
    modalIconEl.appendChild(img);
  }

  // Stats
  document.getElementById('modalStatsRow').innerHTML = d.stats.map(s => `
    <div class="modal-stat">
      <div class="modal-stat-val">${s.val}</div>
      <div class="modal-stat-key">${s.key}</div>
    </div>
  `).join('');

  // Commodities
  document.getElementById('modalCommodities').innerHTML = d.commodities.map(c => `
    <span class="comm-badge">${c.name}</span>
  `).join('');

  // Data rows
  document.getElementById('modalDataGrid').innerHTML = d.data.map(row => `
    <div class="data-row">
      <span class="data-key">${row.key}</span>
      <span class="data-val">${row.val}</span>
    </div>
  `).join('');

  // Potensi
  document.getElementById('modalPotensi').innerHTML = d.potensi.map(p => `<li>${p}</li>`).join('');

  // Open overlay
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('modalBox').scrollTop = 0;

  // Init/update Leaflet map inside modal
  initOrUpdateModalMap(kecId);
  renderSyaratTumbuh(kecId);

  // Rincian per desa — khusus Rasau Jaya (permintaan Kementan)
  const desaSection = document.getElementById('modalDesaSection');
  if (desaSection) {
    if (kecId === 'rasau-jaya') {
      desaSection.style.display = '';
      initRasauJayaDesaMap();
    } else {
      desaSection.style.display = 'none';
    }
  }
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function initModal() {
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });

  const desaOverlay = document.getElementById('desaModalOverlay');
  document.getElementById('desaModalBackBtn').addEventListener('click', closeDesaModal);
  document.getElementById('desaModalClose').addEventListener('click', closeDesaModal);
  desaOverlay.addEventListener('click', e => { if (e.target === desaOverlay) closeDesaModal(); });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (desaOverlay.classList.contains('open')) closeDesaModal();
    else closeModal();
  });
}

// ============================================================
// ANIMATED COUNTERS
// ============================================================
function initCounters() {
  const items = document.querySelectorAll('.stat-number[data-target]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  items.forEach(el => obs.observe(el));
}

function animateCounter(el) {
  if (el.classList.contains('stat-static')) return;
  const target = parseInt(el.dataset.target, 10);
  const start  = target > 1900 ? target - 12 : 0;
  const duration = 1800;
  const step = 16;
  const increment = (target - start) / (duration / step);
  let current = start;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current).toLocaleString('id-ID');
  }, step);
}

// ============================================================
// INIT
// ============================================================
function initCardCropTags() {
  document.querySelectorAll('.kec-card').forEach(card => {
    const d = kecamatanData[card.dataset.kec];
    if (!d || !d.commodities) return;
    const tagsEl = card.querySelector('.kec-tags');
    if (!tagsEl) return;
    tagsEl.innerHTML = d.commodities.slice(0, 3)
      .map(c => `<span class="tag">${c.name}</span>`)
      .join('');
  });
}

function initCardImages() {
  document.querySelectorAll('.kec-map-icon').forEach(icon => {
    const bg = document.createElement('div');
    bg.className = 'kec-img';
    icon.prepend(bg);
  });
}

// ── Peta mini citra satelit pada kartu kecamatan ───────────────────────────
// Menggantikan gambar PNG statis: batas kecamatan berpendar di atas citra satelit,
// batas kecamatan tetangga sebagai konteks, serta label kelas & skor kesesuaian.
// Warna isian mengikuti kelas kesesuaian (kelasColor). Gambar PNG lama tetap menjadi
// cadangan bila Leaflet atau data batas wilayah gagal dimuat.
function initCardMiniMaps() {
  if (typeof L === 'undefined' || typeof kesesuaianLahanData === 'undefined') return;
  const buat = (card) => {
    const kecId = card.dataset.kec;
    const feature = getKecamatanFeature(kecId);
    const imgEl = card.querySelector('.kec-img');
    if (!feature || !imgEl) return;

    imgEl.classList.add('kec-img--map');
    const mapEl = document.createElement('div');
    mapEl.className = 'kec-mini-map';
    imgEl.appendChild(mapEl);

    const map = L.map(mapEl, {
      zoomControl: false, attributionControl: true, dragging: false, scrollWheelZoom: false,
      doubleClickZoom: false, boxZoom: false, keyboard: false, touchZoom: false, zoomSnap: 0.25
    });
    map.attributionControl.setPrefix(false);
    // Atribusi lengkap terlalu panjang untuk kartu; versi ringkas (atribusi penuh ada di peta detail)
    esriLayer('World_Imagery', '&copy; Esri, Maxar').addTo(map);

    // Batas kecamatan tetangga (konteks)
    L.geoJSON(kesesuaianLahanData, {
      filter: f => f !== feature,
      style: { color: '#ffffff', weight: 0.8, opacity: 0.45, fill: false }
    }).addTo(map);

    const k = feature.properties.kelas || 'N';
    const batas = L.geoJSON(feature, {
      style: { color: '#ffffff', weight: 2.2, fillColor: kelasColor[k] || '#888', fillOpacity: 0.35, className: 'kec-mini-boundary' }
    }).addTo(map);

    const chip = document.createElement('div');
    chip.className = 'kec-map-chip';
    const skor = feature.properties.skor ? feature.properties.skor.toFixed(2).replace('.', ',') : '-';
    chip.innerHTML = `<span class="kec-map-chip-kelas" style="background:${kelasColor[k] || '#888'}">${k}</span>${kelasLabel[k] || ''} · ${skor}`;
    card.querySelector('.kec-map-icon').appendChild(chip);

    // Ruang ekstra di atas untuk label kelas dan di bawah untuk atribusi
    const fit = () => {
      map.invalidateSize();
      map.fitBounds(batas.getBounds(), { paddingTopLeft: [20, 44], paddingBottomRight: [20, 26] });
    };
    fit();
    setTimeout(fit, 700); // ulangi setelah animasi kemunculan kartu selesai
  };

  const cards = [...document.querySelectorAll('.kec-card[data-kec]')];
  if (!('IntersectionObserver' in window)) { cards.forEach(buat); return; }
  // Dibuat saat kartu mendekati layar, agar tile tidak dimuat sebelum diperlukan
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { obs.unobserve(e.target); buat(e.target); } });
  }, { rootMargin: '200px' });
  cards.forEach(c => obs.observe(c));
}

document.addEventListener('DOMContentLoaded', () => {
  initCardCropTags();
  initCardImages();
  initCardMiniMaps();
  initHeroMap();
  initNavbar();
  initHamburger();
  initReveal();
  initCardStagger();
  initCardClicks();
  initModal();
  initCounters();
  initKomparasi();
  initZonasi();
  initMetodologiWeights();
});

// ============================================================
// KOMPARASI — Chart Rendering
// ============================================================

function scoreClass(v) {
  if (v >= 0.80) return { cls: 'sangat-cocok', label: 'Sangat Cocok' };
  if (v >= 0.60) return { cls: 'cocok',         label: 'Cocok'         };
  if (v >= 0.40) return { cls: 'cukup',         label: 'Cukup Sesuai'  };
  return               { cls: 'kurang',        label: 'Kurang Sesuai'  };
}

function renderBarChart(containerId, items) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = items.map(d => {
    const sc = scoreClass(d.value);
    return `
      <div class="cmp-row">
        <div class="cmp-label">
          <span class="cmp-name">${d.label}</span>
          ${d.sub ? `<span class="cmp-sub">${d.sub}</span>` : ''}
        </div>
        <div class="cmp-track">
          <div class="cmp-bar cmp-bar--${sc.cls}" style="--bar-w:${(d.value * 100).toFixed(1)}%"></div>
        </div>
        <div class="cmp-meta">
          <span class="cmp-val">${d.value.toFixed(2)}</span>
          <span class="cmp-badge cmp-badge--${sc.cls}">${sc.label}</span>
        </div>
      </div>`;
  }).join('');
  setTimeout(() => {
    el.querySelectorAll('.cmp-bar').forEach(b => b.classList.add('animated'));
  }, 80);
}

function getKecamatanAvgScores() {
  return Object.entries(kecamatanData)
    .map(([kecId, d]) => {
      const iklim = iklimKecamatan[kecId];
      if (!iklim || !d.relevantCrops) return null;
      const scores = d.relevantCrops
        .filter(id => syaratTumbuhDB[id])
        .map(id => hitungSkorKrop(iklim, syaratTumbuhDB[id]).sawScore);
      if (!scores.length) return null;
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      return { label: d.name, value: +avg.toFixed(3), sub: `${scores.length} komoditas dianalisis` };
    })
    .filter(Boolean)
    .sort((a, b) => b.value - a.value);
}

// Skor SAW komoditas di seluruh 9 kecamatan (matriks komoditas × kecamatan);
// kecamatan yang mencantumkan komoditas ini di relevantCrops diberi penanda "komoditas wilayah"
function getCropScores(cropId) {
  const syarat = syaratTumbuhDB[cropId];
  if (!syarat) return [];
  return Object.entries(kecamatanData)
    .map(([kecId, d]) => {
      const iklim = iklimKecamatan[kecId];
      if (!iklim) return null;
      const wilayah = (d.relevantCrops || []).includes(cropId);
      return { label: d.name, value: hitungSkorKrop(iklim, syarat).sawScore, sub: wilayah ? '● Komoditas wilayah' : '' };
    })
    .filter(Boolean)
    .sort((a, b) => b.value - a.value);
}

function populateCropSelect() {
  const sel = document.getElementById('cropSelect');
  if (!sel) return;
  sel.innerHTML = Object.entries(syaratTumbuhDB)
    .sort((a, b) => a[1].nama.localeCompare(b[1].nama))
    .map(([id, s]) => `<option value="${id}">${s.icon} ${s.nama}</option>`)
    .join('');
  sel.addEventListener('change', () => updateCropChart(sel.value));
  updateCropChart(sel.value);
}

function updateCropChart(cropId) {
  const syarat = syaratTumbuhDB[cropId];
  if (!syarat) return;
  const descEl = document.getElementById('chartKomoditasDesc');
  if (descEl) descEl.textContent =
    `Skor kesesuaian SAW untuk ${syarat.nama} di seluruh 9 kecamatan, diurutkan dari tertinggi. Tanda ● = komoditas ini tercantum sebagai komoditas wilayah kecamatan tersebut.`;
  renderBarChart('chartKomoditas', getCropScores(cropId));
}

function initChartTabs() {
  document.querySelectorAll('.chart-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chart-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.chart-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panelId = 'panel' + btn.dataset.tab;
      const panel = document.getElementById(panelId);
      if (panel) panel.classList.add('active');
      if (btn.dataset.tab === 'Kecamatan') renderBarChart('chartKecamatan', getKecamatanAvgScores());
      if (btn.dataset.tab === 'Komoditas') {
        const sel = document.getElementById('cropSelect');
        if (sel) updateCropChart(sel.value);
      }
    });
  });
}

function initKomparasi() {
  if (typeof iklimKecamatan === 'undefined' || typeof syaratTumbuhDB === 'undefined') return;
  renderBarChart('chartKecamatan', getKecamatanAvgScores());
  populateCropSelect();
  initChartTabs();
}

// ============================================================
// ZONASI AGROEKOLOGI — peta 4 zona (klaster Ward) + kartu unggulan aktual/potensial
// ============================================================
function initZonasi() {
  const el = document.getElementById('zonasiMap');
  if (!el || typeof zonasiAgroekologi === 'undefined' || typeof kesesuaianLahanData === 'undefined' || typeof L === 'undefined') return;
  const Z = zonasiAgroekologi;
  const zonaDari = {};
  Z.zona.forEach(z => z.kecamatan.forEach(k => { zonaDari[k] = z; }));
  const namaKec = n => n === "Telok Pa'Kedai" ? 'Teluk Pakedai' : n;
  const fmt = v => v.toFixed(2).replace('.', ',');

  const chip = (x, kelas) => `<span class="zona-chip ${kelas}">${x.komoditas}` +
    (x.kecamatan && x.kecamatan.length < 3 ? ` <small>(${x.kecamatan.join(', ')})</small>` : '') +
    (x.tanpaData ? ' <small>†</small>' : '') + '</span>';
  document.getElementById('zonasiCards').innerHTML = Z.zona.map(z => `
    <div class="zona-card" data-zona="${z.zona}" style="--zc:${z.warna}">
      <h3>Zona ${z.zona} — ${z.judul}</h3>
      <div class="zona-kec">${z.kecamatan.join(' · ')}</div>
      <div class="zona-ciri">${z.ciri}</div>
      <div class="zona-row"><b>Kesesuaian tertinggi:</b> ${z.teratas.map(t => `${t.komoditas} (${fmt(t.skor)})`).join(', ')}</div>
      <div class="zona-row"><b>Unggulan aktual:</b><br>${z.aktual.length ? z.aktual.map(a => chip(a, '')).join('') : '–'}</div>
      <div class="zona-row"><b>Unggulan potensial:</b><br>${z.potensial.length ? z.potensial.map(p => chip(p, 'potensial')).join('') : '–'}</div>
    </div>`).join('');
  document.getElementById('zonasiLegend').innerHTML = Z.zona.map(z =>
    `<span data-zona="${z.zona}"><i style="background:${z.warna}"></i>Zona ${z.zona}</span>`).join('');
  document.getElementById('zonasiNote').innerHTML =
    `Unggulan aktual: skor SAW rata-rata zona ≥ ${fmt(Z.meta.ambang)} dan LQ produksi hortikultura/perkebunan BPS 2024 > 1 pada sedikitnya satu kecamatan. ` +
    `Unggulan potensial: sangat sesuai tetapi belum menjadi basis produksi (LQ ≤ 1); † data produksi per kecamatan tidak tersedia. ` +
    `Klaster Ward: silhouette ${fmt(Z.meta.silhouette)}, korelasi kofenetik ${fmt(Z.meta.kofenetik)}. ` +
    `Zonasi bersifat kesesuaian biofisik dan berlaku di luar kawasan hutan, ekosistem gambut berfungsi lindung, dan mangrove.`;

  let map = null, lapisan = null;
  const pilih = zn => {
    document.querySelectorAll('.zona-card').forEach(c => c.classList.toggle('aktif', c.dataset.zona === zn));
    if (!lapisan) return;
    const terpilih = [];
    lapisan.eachLayer(l => {
      const z = zonaDari[namaKec(l.feature.properties.NAME_3)];
      const cocok = !zn || (z && z.zona === zn);
      l.setStyle({ fillOpacity: cocok ? 0.72 : 0.18, weight: cocok ? 2 : 1 });
      if (cocok) terpilih.push(l);
    });
    map.fitBounds(L.featureGroup(terpilih.length ? terpilih : [lapisan]).getBounds(), { padding: [20, 20], maxZoom: 11 });
  };
  // Peta dibuat saat bagian mendekati layar (hemat kuota tile)
  const buatPeta = () => {
    map = L.map(el, { scrollWheelZoom: false, zoomControl: true });
    addBasemap(map);
    lapisan = L.geoJSON(kesesuaianLahanData, {
      style: f => {
        const z = zonaDari[namaKec(f.properties.NAME_3)];
        return { color: '#ffffff', weight: 1.5, fillColor: z ? z.warna : '#999999', fillOpacity: 0.62 };
      },
      onEachFeature: (f, layer) => {
        const n = namaKec(f.properties.NAME_3), z = zonaDari[n];
        layer.bindTooltip(`<div class="zonasi-tip"><b>${n}</b><br>Zona ${z ? z.zona : '-'} · skor WO ${fmt(f.properties.skor || 0)}</div>`, { sticky: true });
        layer.on('click', () => pilih(z ? z.zona : null));
      }
    }).addTo(map);
    map.fitBounds(lapisan.getBounds(), { padding: [12, 12] });
  };
  document.querySelectorAll('.zona-card, .zonasi-legend span').forEach(c =>
    c.addEventListener('click', () => {
      const aktif = document.querySelector(`.zona-card.aktif[data-zona="${c.dataset.zona}"]`);
      pilih(aktif ? null : c.dataset.zona);
    }));
  if (!('IntersectionObserver' in window)) { buatPeta(); return; }
  const obs = new IntersectionObserver(es => {
    if (es.some(e => e.isIntersecting)) { buatPeta(); obs.disconnect(); }
  }, { rootMargin: '200px' });
  obs.observe(el);
}

// ============================================================
// METODOLOGI — Animate weight bars on scroll
// ============================================================
function initMetodologiWeights() {
  const bars = document.querySelectorAll('.wr-bar');
  if (!bars.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animated');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => obs.observe(b));
}
