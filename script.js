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

const kecamatanCoords = {
  'sungai-raya':      { lat: -0.0522,  lng: 109.3620, zoom: 12 },
  'sungai-kakap':     { lat: -0.1700,  lng: 109.2200, zoom: 12 },
  'rasau-jaya':       { lat: -0.2100,  lng: 109.2750, zoom: 12 },
  'sungai-ambawang':  { lat:  0.0400,  lng: 109.4500, zoom: 12 },
  'kubu':             { lat: -0.3800,  lng: 109.4300, zoom: 11 },
  'batu-ampar':       { lat: -0.1000,  lng: 109.0800, zoom: 11 },
  'teluk-pakedai':    { lat: -0.2600,  lng: 109.1100, zoom: 12 },
  'terentang':        { lat: -0.5300,  lng: 109.3400, zoom: 11 },
  'kuala-mandor':     { lat:  0.1000,  lng: 109.2700, zoom: 12 },
};

// ============================================================
// DATA LENGKAP 9 KECAMATAN
// ============================================================
const kecamatanData = {
  'sungai-raya': {
    number: '02',
    name: 'Sungai Raya',
    tagline: 'Ibu Kota Kabupaten Kubu Raya',
    desc: 'Kecamatan Sungai Raya terletak di dataran rendah aluvial dengan elevasi rata-rata 6 m dpl. Jenis tanah didominasi Lempung Liat Berdebu (Silty Clay Loam) dengan kapasitas tukar kation (KTK) sedang hingga tinggi, drainase sedang, dan kemampuan menahan air yang baik — karakteristik ideal untuk budidaya padi sawah beririgasi dan tanaman hortikultura semusim. Curah hujan tahunan 3.262 mm dengan distribusi merata mencukupi kebutuhan air tanaman pada fase vegetatif maupun generatif, sedangkan suhu rata-rata 26,2°C mendukung proses metabolisme tanaman tropika basah secara optimal. Analisis citra Sentinel-2 (2022–2024) menunjukkan NDVI rata-rata 0,66, mencerminkan dominasi tutupan lahan pertanian aktif dan vegetasi campuran yang produktif. Kecamatan ini merupakan sentra produksi nanas dan hortikultura yang didukung aksesibilitas jalan memadai untuk distribusi hasil panen.',
    stats: [
      { val: '±742 km²', key: 'Luas Wilayah' },
      { val: '17 Desa', key: 'Jumlah Desa' },
      { val: '~300 rb', key: 'Penduduk' },
      { val: 'Sungai Raya', key: 'Ibu Kota' }
    ],
    commodities: [
      { icon: '🍍', name: 'Nanas' }, { icon: '🌾', name: 'Padi Sawah' },
      { icon: '🥥', name: 'Kelapa' }, { icon: '🍌', name: 'Pisang' },
      { icon: '🌴', name: 'Pinang' }, { icon: '🌶️', name: 'Sayuran' }
    ],
    relevantCrops: ['padi_sawah', 'nanas', 'kelapa', 'pisang', 'pinang', 'cabai', 'pepaya', 'jeruk_siam', 'langsat', 'jambu_biji', 'jahe'],
    data: [
      { key: 'Kelas Kesesuaian', val: 'S2 — Cukup Sesuai' },
      { key: 'NDVI Rata-rata', val: '0,66 (Sentinel-2, 2022–2024)' },
      { key: 'Skor Weighted Overlay', val: '3,21 / 4,00' },
      { key: 'Topografi', val: 'Dataran Rendah' }
    ],
    potensi: [
      'Kelas S2 (Cukup Sesuai) mengindikasikan potensi pertanian yang baik dengan catatan pengelolaan lahan gambut yang tepat.',
      'Nilai NDVI 0,66 menunjukkan kerapatan vegetasi tinggi — lahan aktif dan produktif mendominasi wilayah ini.',
      'Sentra produksi nanas dan hortikultura dengan akses distribusi terbaik menuju Kota Pontianak.',
      'Skor weighted overlay 3,21 mencerminkan aksesibilitas jalan dan ketersediaan air yang mendukung pertanian intensif.',
      'Prioritas pengembangan: optimasi lahan sawah eksisting dan perluasan kebun hortikultura berbasis data spasial.'
    ]
  },
  'sungai-kakap': {
    number: '03',
    name: 'Sungai Kakap',
    tagline: 'Sentra Kelapa & Padi Pasang Surut',
    desc: 'Kecamatan Sungai Kakap merupakan kawasan pertanian lahan pasang surut di pesisir barat dengan elevasi 3 m dpl. Jenis tanah berupa Lempung Berliat (Clay Loam) pada sistem rawa pasang surut memiliki kapasitas tukar kation (KTK) sedang dan kemampuan menahan air tinggi, mendukung budidaya tanaman yang toleran terhadap fluktuasi muka air tanah. Sistem tata air pada tipologi lahan pasang surut tipe B memungkinkan penerapan pola tanam padi–palawija dengan pengelolaan saluran drainase yang terencana. Curah hujan 2.743 mm/tahun mencukupi kebutuhan air kelapa dan sagu tanpa menyebabkan kelebihan air pada lahan yang telah memiliki infrastruktur drainase. Analisis citra Sentinel-2 (2022–2024) mencatat NDVI rata-rata 0,69, menunjukkan kerapatan tutupan vegetasi perkebunan kelapa dan sawah pasang surut yang stabil sepanjang tahun.',
    stats: [
      { val: '±508 km²', key: 'Luas Wilayah' }, { val: '14 Desa', key: 'Jumlah Desa' },
      { val: '~68 rb', key: 'Penduduk' }, { val: 'Sungai Kakap', key: 'Ibu Kota' }
    ],
    commodities: [
      { icon: '🥥', name: 'Kelapa' }, { icon: '🌾', name: 'Padi Pasut' },
      { icon: '🌿', name: 'Sagu' }, { icon: '🌴', name: 'Pinang' },
      { icon: '🍌', name: 'Pisang' }, { icon: '🌳', name: 'Karet' }
    ],
    relevantCrops: ['padi_sawah', 'kelapa', 'sagu', 'pinang', 'pisang', 'karet', 'langsat', 'jeruk_siam'],
    data: [
      { key: 'Kelas Kesesuaian', val: 'S2 — Cukup Sesuai' },
      { key: 'NDVI Rata-rata', val: '0,69 (Sentinel-2, 2022–2024)' },
      { key: 'Skor Weighted Overlay', val: '3,28 / 4,00' },
      { key: 'Topografi', val: 'Rawa & Pasang Surut' }
    ],
    potensi: [
      'Skor tertinggi kedua (3,28) di antara 9 kecamatan — potensi pertanian pasang surut sangat menjanjikan.',
      'Perkebunan kelapa dan pinang pada lahan pasang surut merupakan model adaptasi pertanian gambut pesisir.',
      'Nilai NDVI 0,69 mengindikasikan tutupan vegetasi produktif yang stabil sepanjang 2022–2024.',
      'Peluang pengembangan sistem silvofishery — integrasi kebun kelapa dengan budidaya ikan air payau.',
      'Prioritas: pemetaan lahan sawah pasang surut untuk optimasi jadwal tanam berbasis data NDWI.'
    ]
  },
  'rasau-jaya': {
    number: '01',
    name: 'Rasau Jaya',
    tagline: 'Kawasan Transmigrasi Pertanian Gambut',
    desc: 'Kecamatan Rasau Jaya adalah kawasan transmigrasi yang berkembang di atas lahan gambut dangkal hingga sedang (kedalaman 0,5–2 m) dengan elevasi 7 m dpl. Jenis tanah berupa Lempung Liat Berpasir (Sandy Clay Loam) pada lapisan mineral di bawah gambut memberikan aerasi perakaran yang cukup baik untuk sistem perakaran tanaman perkebunan. Lapisan gambut bagian atas bersifat masam dengan pH 3,5–4,5 dan kandungan bahan organik tinggi, sehingga diperlukan ameliorasi lahan berupa pengapuran (liming) dan pemupukan berimbang untuk mendukung budidaya tanaman pangan. Curah hujan 2.984 mm/tahun mendukung pola tanam ganda dan menjaga kelembaban gambut agar tidak mengalami kekeringan irreversibel. Nilai NDVI 0,69 dari analisis Sentinel-2 (2022–2024) mencerminkan aktivitas fotosintesis yang stabil pada lahan gambut terkelola, dengan semangka sebagai komoditas unggulan hasil adaptasi teknik budidaya musiman setempat.',
    stats: [
      { val: '±243 km²', key: 'Luas Wilayah' }, { val: '5 Desa', key: 'Jumlah Desa' },
      { val: '~42 rb', key: 'Penduduk' }, { val: 'Rasau Jaya', key: 'Ibu Kota' }
    ],
    commodities: [
      { icon: '🥥', name: 'Kelapa' }, { icon: '🌾', name: 'Padi Gambut' },
      { icon: '🌳', name: 'Karet' }, { icon: '🍌', name: 'Pisang' },
      { icon: '🌴', name: 'Pinang' }, { icon: '🍉', name: 'Semangka' }
    ],
    relevantCrops: ['padi_sawah', 'kelapa', 'karet', 'pisang', 'pinang', 'semangka', 'nanas', 'jeruk_siam', 'langsat', 'durian', 'lada', 'jahe', 'jambu_biji', 'ubi_kayu'],
    data: [
      { key: 'Kelas Kesesuaian', val: 'S2 — Cukup Sesuai' },
      { key: 'NDVI Rata-rata', val: '0,69 (Sentinel-2, 2022–2024)' },
      { key: 'Skor Weighted Overlay', val: '3,16 / 4,00' },
      { key: 'Topografi', val: 'Lahan Gambut' }
    ],
    potensi: [
      'Kawasan transmigrasi dengan sistem irigasi teknis yang mendukung pertanian intensif di lahan gambut.',
      'Produksi semangka dan sayuran sebagai komoditas unggulan dengan nilai NDVI vegetasi aktif 0,69.',
      'Skor kesesuaian 3,16 menunjukkan keseimbangan antara ketersediaan air gambut dan aksesibilitas yang memadai.',
      'Model pertanian adaptif lahan gambut yang dapat direplikasi untuk kecamatan bergambut lainnya di Kubu Raya.',
      'Prioritas: validasi lapangan produktivitas aktual padi untuk kalibrasi model analisis spasial penelitian.'
    ]
  },
  'sungai-ambawang': {
    number: '04',
    name: 'Sungai Ambawang',
    tagline: 'Sentra Perkebunan Karet & Pertanian Terpadu',
    desc: 'Kecamatan Sungai Ambawang memiliki topografi bergelombang dengan elevasi rata-rata 8 m dpl yang memberikan kondisi drainase alami lebih baik dibanding wilayah pesisir. Jenis tanah Lempung Liat Berpasir (Sandy Clay Loam) dengan drainase sedang hingga baik dan pH berkisar 5,0–6,0 sangat sesuai untuk pertumbuhan tanaman tahunan seperti karet (Hevea brasiliensis) yang memerlukan aerasi perakaran optimal dan tidak toleran terhadap genangan. Curah hujan 3.249 mm/tahun dengan distribusi merata mendukung kebutuhan air karet pada fase pertumbuhan aktif serta padi sawah pada fase pengisian biji. Suhu rata-rata 26,1°C mendekati kisaran optimal untuk proses biosintesis lateks. Analisis citra Sentinel-2 (2022–2024) mencatat NDVI 0,72, mencerminkan kerapatan kanopi perkebunan karet dan pertanian campuran yang rapat dan produktif di wilayah ini.',
    stats: [
      { val: '±727 km²', key: 'Luas Wilayah' }, { val: '16 Desa', key: 'Jumlah Desa' },
      { val: '~57 rb', key: 'Penduduk' }, { val: 'Sei Ambawang', key: 'Ibu Kota' }
    ],
    commodities: [
      { icon: '🌾', name: 'Padi Sawah' }, { icon: '🌳', name: 'Karet' },
      { icon: '🍌', name: 'Pisang' }, { icon: '🌴', name: 'Pinang' },
      { icon: '🍫', name: 'Kakao' }, { icon: '🥥', name: 'Kelapa' }
    ],
    relevantCrops: ['padi_sawah', 'karet', 'pisang', 'pinang', 'kakao', 'kelapa', 'durian', 'lada', 'langsat', 'jeruk_siam', 'jahe', 'jambu_biji'],
    data: [
      { key: 'Kelas Kesesuaian', val: 'S2 — Cukup Sesuai' },
      { key: 'NDVI Rata-rata', val: '0,72 (Sentinel-2, 2022–2024)' },
      { key: 'Skor Weighted Overlay', val: '3,32 / 4,00 (tertinggi)' },
      { key: 'Topografi', val: 'Berbukit–Dataran' }
    ],
    potensi: [
      'Skor weighted overlay tertinggi (3,32) — zona prioritas utama pengembangan komoditas pertanian unggulan Kubu Raya.',
      'NDVI 0,72 mencerminkan kerapatan vegetasi produktif tertinggi kedua, mendukung diversifikasi pertanian.',
      'Potensi kopi robusta dan kakao sebagai komoditas bernilai tinggi pada topografi berbukit yang sesuai.',
      'Aksesibilitas jalan dan kemiringan lereng rendah menjadi keunggulan kompetitif dibanding kecamatan lain.',
      'Prioritas: pengembangan kawasan pertanian terpadu berbasis hasil analisis spasial kesesuaian lahan.'
    ]
  },
  'kubu': {
    number: '05',
    name: 'Kubu',
    tagline: 'Kelapa Hibrida & Pengelolaan Gambut',
    desc: 'Kecamatan Kubu didominasi lahan gambut dalam (kedalaman >3 m) yang mencakup lebih dari 60% wilayahnya dengan elevasi 2 m dpl. Jenis tanah berupa Lempung Berliat (Clay Loam) pada kubah gambut memiliki kandungan bahan organik sangat tinggi (>18%), kapasitas tukar kation (KTK) tinggi, namun pH sangat masam (3,0–4,0) dan kejenuhan basa rendah akibat proses dekomposisi tidak sempurna. Sifat gambut yang bersifat hidrofobik saat mengering menjadikan manajemen muka air tanah — idealnya dijaga pada kedalaman 40–60 cm dari permukaan — sebagai kunci keberhasilan usaha pertanian. Curah hujan 2.750 mm/tahun membantu mempertahankan kelembaban gambut dan mencegah subsiden berlebih akibat oksidasi gambut. Sagu (Metroxylon sagu) merupakan komoditas paling adaptif karena tumbuh pada kondisi lahan basah permanen, sedangkan kelapa hibrida dikembangkan pada zona gambut dangkal di tepian wilayah yang lebih terdrainase. Analisis citra Sentinel-2 (2022–2024) mencatat NDVI 0,72, mencerminkan kerapatan vegetasi gambut alami yang masih terjaga.',
    stats: [
      { val: '±1.212 km²', key: 'Luas Wilayah' }, { val: '20 Desa', key: 'Jumlah Desa' },
      { val: '~47 rb', key: 'Penduduk' }, { val: 'Kubu', key: 'Ibu Kota' }
    ],
    commodities: [
      { icon: '🥥', name: 'Kelapa Hibrida' }, { icon: '🌿', name: 'Sagu' },
      { icon: '🌳', name: 'Karet' }, { icon: '🌾', name: 'Padi Gambut' },
      { icon: '🍌', name: 'Pisang' }, { icon: '🌴', name: 'Pinang' }
    ],
    relevantCrops: ['kelapa', 'sagu', 'karet', 'padi_sawah', 'pisang', 'pinang', 'langsat'],
    data: [
      { key: 'Kelas Kesesuaian', val: 'S2 — Cukup Sesuai' },
      { key: 'NDVI Rata-rata', val: '0,72 (Sentinel-2, 2022–2024)' },
      { key: 'Skor Weighted Overlay', val: '2,99 / 4,00' },
      { key: 'Topografi', val: 'Lahan Gambut Dalam' }
    ],
    potensi: [
      'NDVI tertinggi di Kubu Raya (0,72) mencerminkan ekosistem gambut yang kaya — perlu pengelolaan berbasis konservasi.',
      'Kelapa hibrida sebagai komoditas adaptif gambut dengan produk turunan gula merah dan gula semut bernilai ekspor.',
      'Skor 2,99 mengindikasikan keterbatasan aksesibilitas — diperlukan pengembangan infrastruktur jalan pertanian.',
      'Luas wilayah terbesar kedua memberikan potensi skala besar untuk pertanian perkebunan ekstensif.',
      'Prioritas: pemetaan zona gambut dalam vs gambut dangkal untuk rekomendasi komoditas yang tepat per zona.'
    ]
  },
  'batu-ampar': {
    number: '06',
    name: 'Batu Ampar',
    tagline: 'Ekosistem Mangrove & Pesisir Strategis',
    desc: 'Kecamatan Batu Ampar merupakan kawasan pesisir yang didominasi ekosistem mangrove dan rawa pasang surut dengan elevasi 2 m dpl. Jenis tanah berupa Lempung Liat Berdebu (Silty Clay Loam) pada endapan aluvial marin berpotensi mengandung lapisan pirit (FeS₂) pada kedalaman 50–80 cm — apabila teroksidasi akibat drainase berlebih akan membentuk tanah sulfat masam dengan pH < 3,5 yang bersifat toksik bagi sebagian besar tanaman budidaya. Curah hujan 2.620 mm/tahun dan ketersediaan air dari dinamika pasang surut menjamin kelembaban lahan sepanjang tahun. Suhu 26,6°C mendukung pertumbuhan tanaman pesisir yang toleran terhadap salinitas rendah. Sagu dan kelapa yang memiliki toleransi terhadap lahan basah dan salinitas ringan merupakan komoditas yang paling sesuai pada zona transisi mangrove–lahan pertanian. Analisis citra Sentinel-2 (2022–2024) mencatat NDVI 0,75, mencerminkan kerapatan kanopi mangrove sebagai vegetasi dominan di wilayah ini.',
    stats: [
      { val: '±1.680 km²', key: 'Luas Wilayah' }, { val: '17 Desa', key: 'Jumlah Desa' },
      { val: '~30 rb', key: 'Penduduk' }, { val: 'Batu Ampar', key: 'Ibu Kota' }
    ],
    commodities: [
      { icon: '🌿', name: 'Sagu' }, { icon: '🥥', name: 'Kelapa' },
      { icon: '🌾', name: 'Padi Pasut' }, { icon: '🌴', name: 'Pinang' },
      { icon: '🍌', name: 'Pisang' }, { icon: '🌳', name: 'Karet' }
    ],
    relevantCrops: ['sagu', 'kelapa', 'padi_sawah', 'pinang', 'pisang', 'karet', 'langsat'],
    data: [
      { key: 'Kelas Kesesuaian', val: 'S2 — Cukup Sesuai' },
      { key: 'NDVI Rata-rata', val: '0,75 (Sentinel-2, 2022–2024)' },
      { key: 'Skor Weighted Overlay', val: '2,99 / 4,00' },
      { key: 'Topografi', val: 'Rawa Mangrove & Pesisir' }
    ],
    potensi: [
      'NDVI 0,75 (tertinggi absolut) mencerminkan ekosistem mangrove yang sangat lebat — aset blue carbon bernilai tinggi.',
      'Silvofishery (mangrove + budidaya udang/kepiting) sebagai model pertanian-pesisir adaptif yang telah terbukti.',
      'Sagu sebagai komoditas pangan strategis yang sangat sesuai dengan kondisi lahan basah pesisir.',
      'Potensi karbon biru (blue carbon) dari ekosistem mangrove untuk program kredit karbon internasional.',
      'Prioritas: pemetaan zona mangrove vs lahan pertanian potensial untuk rekomendasi tata guna lahan berbasis bukti.'
    ]
  },
  'teluk-pakedai': {
    number: '07',
    name: 'Teluk Pakedai',
    tagline: 'Pertanian Sagu & Perikanan Kepulauan',
    desc: 'Kecamatan Teluk Pakedai mencakup wilayah daratan dan gugusan pulau kecil di pesisir barat dengan elevasi rata-rata 3 m dpl. Jenis tanah Lempung Berliat (Clay Loam) pada lahan pasang surut memiliki kemampuan menahan air yang baik dan KTK sedang, cocok untuk budidaya padi sawah pasang surut pada tipologi luapan tipe A dan B. Potensi keberadaan lapisan sulfat masam (jarosite) pada kedalaman tertentu perlu diantisipasi dalam perancangan sistem tata air agar pH tanah tidak turun drastis ketika dilakukan drainase intensif. Curah hujan 2.980 mm/tahun memberikan ketersediaan air yang konsisten bagi sagu (Metroxylon sagu) yang membutuhkan kelembaban tinggi sepanjang siklus hidupnya. Analisis citra Sentinel-2 (2022–2024) mencatat NDVI 0,73, mencerminkan dominasi tutupan vegetasi sagu dan nipah pada lahan basah. Konektivitas antar-pulau menjadi faktor kritis dalam mendukung sistem distribusi hasil pertanian kepada pasar di daratan.',
    stats: [
      { val: '±506 km²', key: 'Luas Wilayah' }, { val: '10 Desa', key: 'Jumlah Desa' },
      { val: '~27 rb', key: 'Penduduk' }, { val: 'Teluk Pakedai', key: 'Ibu Kota' }
    ],
    commodities: [
      { icon: '🌿', name: 'Sagu' }, { icon: '🥥', name: 'Kelapa' },
      { icon: '🌾', name: 'Padi Pasut' }, { icon: '🌴', name: 'Pinang' },
      { icon: '🍌', name: 'Pisang' }, { icon: '🌳', name: 'Karet' }
    ],
    relevantCrops: ['sagu', 'kelapa', 'padi_sawah', 'pinang', 'pisang', 'karet', 'langsat', 'pepaya'],
    data: [
      { key: 'Kelas Kesesuaian', val: 'S2 — Cukup Sesuai' },
      { key: 'NDVI Rata-rata', val: '0,73 (Sentinel-2, 2022–2024)' },
      { key: 'Skor Weighted Overlay', val: '2,99 / 4,00' },
      { key: 'Topografi', val: 'Rawa & Kepulauan' }
    ],
    potensi: [
      'Nilai NDVI 0,73 menunjukkan vegetasi sagu dan mangrove yang dominan — komoditas paling sesuai dengan ekosistem setempat.',
      'Pertanian sagu di lahan pasang surut sebagai sumber pangan alternatif dan bahan baku industri tepung.',
      'Perikanan dan budidaya udang/kerang di perairan Selat Karimata sebagai sumber pendapatan utama masyarakat.',
      'Skor 2,99 mengindikasikan aksesibilitas antarwilayah sebagai tantangan utama yang perlu diatasi.',
      'Prioritas: pembangunan konektivitas antar-pulau untuk mendukung distribusi hasil pertanian dan perikanan.'
    ]
  },
  'terentang': {
    number: '08',
    name: 'Terentang',
    tagline: 'Kawasan Hutan & Perkebunan Penyangga',
    desc: 'Kecamatan Terentang terletak di bagian selatan Kabupaten Kubu Raya berbatasan dengan Kabupaten Ketapang, dengan topografi berbukit lemah dan elevasi rata-rata 14 m dpl. Jenis tanah Lempung Liat Berpasir (Sandy Clay Loam) dengan drainase sedang hingga baik dan pH berkisar 5,5–6,5 memberikan kondisi aerasi perakaran yang ideal bagi tanaman tahunan seperti karet (Hevea brasiliensis) dan kakao (Theobroma cacao) yang tidak toleran terhadap genangan. Tekstur tanah yang lebih ringan dibanding lempung berat memudahkan penetrasi akar lateral dan mendukung pertumbuhan tajuk yang optimal. Curah hujan 2.849 mm/tahun terdistribusi merata, mencukupi kebutuhan air tanaman perkebunan tanpa periode kering yang memicu stres air berkepanjangan. Suhu 26,5°C berada dalam kisaran optimal untuk proses biosintesis lateks pada tanaman karet. Analisis citra Sentinel-2 (2022–2024) mencatat NDVI 0,67, mencerminkan dominasi tutupan hutan sekunder dan perkebunan karet rakyat sebagai penggunaan lahan utama.',
    stats: [
      { val: '±1.270 km²', key: 'Luas Wilayah' }, { val: '14 Desa', key: 'Jumlah Desa' },
      { val: '~18 rb', key: 'Penduduk' }, { val: 'Terentang', key: 'Ibu Kota' }
    ],
    commodities: [
      { icon: '🌳', name: 'Karet' }, { icon: '🍌', name: 'Pisang' },
      { icon: '🥥', name: 'Kelapa' }, { icon: '🌾', name: 'Padi Ladang' },
      { icon: '🌴', name: 'Pinang' }, { icon: '🍫', name: 'Kakao' }
    ],
    relevantCrops: ['karet', 'pisang', 'kelapa', 'padi_sawah', 'pinang', 'kakao', 'durian', 'lada', 'langsat', 'jeruk_siam', 'jahe', 'alpukat'],
    data: [
      { key: 'Kelas Kesesuaian', val: 'S2 — Cukup Sesuai' },
      { key: 'NDVI Rata-rata', val: '0,67 (Sentinel-2, 2022–2024)' },
      { key: 'Skor Weighted Overlay', val: '2,96 / 4,00' },
      { key: 'Topografi', val: 'Berbukit & Hutan' }
    ],
    potensi: [
      'Skor kesesuaian terendah (2,96) menunjukkan aksesibilitas sebagai faktor pembatas utama — infrastruktur jalan menjadi investasi kunci.',
      'Perkebunan karet rakyat memanfaatkan topografi berbukit yang kurang sesuai untuk padi namun ideal untuk tanaman tahunan.',
      'Hasil hutan bukan kayu (HHBK) — rotan dan madu hutan — sebagai produk premium bernilai tinggi dari ekosistem hutan.',
      'NDVI 0,67 mencerminkan hutan sekunder produktif yang berpotensi untuk agroforestri berbasis karet dan tanaman hutan.',
      'Prioritas: pengembangan jalur distribusi dan akses jalan untuk membuka potensi pertanian yang selama ini terisolasi.'
    ]
  },
  'kuala-mandor': {
    number: '09',
    name: 'Kuala Mandor B',
    tagline: 'Pertanian Organik Dekat Cagar Alam',
    desc: 'Kecamatan Kuala Mandor B terletak di bagian utara Kabupaten Kubu Raya berbatasan dengan Cagar Alam Mandor, dengan topografi berbukit rendah dan elevasi 19 m dpl. Jenis tanah Lempung Liat Berpasir (Sandy Clay Loam) yang bersifat mineral — tidak mengandung gambut signifikan — memiliki pH 5,0–6,5, KTK sedang, dan aerasi perakaran yang baik, menjadikannya lebih mudah dikelola dan lebih responsif terhadap pemupukan dibanding tanah gambut. Curah hujan 3.040 mm/tahun memberikan neraca air yang positif sepanjang tahun, mencukupi kebutuhan evapotranspirasi tanaman perkebunan maupun tanaman pangan semusim. Suhu 26,4°C mendukung proses pembungaan dan pembuahan tanaman tropis secara optimal. Kombinasi tanah mineral bertekstur sedang, curah hujan cukup, dan suhu sesuai menjadikan karet (Hevea brasiliensis) sebagai komoditas dengan kesesuaian tumbuh terbaik di wilayah ini. Analisis citra Sentinel-2 (2022–2024) mencatat NDVI 0,73, mencerminkan kerapatan tutupan vegetasi perkebunan dan hutan sekunder yang masih produktif.',
    stats: [
      { val: '±396 km²', key: 'Luas Wilayah' }, { val: '10 Desa', key: 'Jumlah Desa' },
      { val: '~25 rb', key: 'Penduduk' }, { val: 'Kuala Mandor', key: 'Ibu Kota' }
    ],
    commodities: [
      { icon: '🌳', name: 'Karet' }, { icon: '🌾', name: 'Padi Sawah' },
      { icon: '🍌', name: 'Pisang' }, { icon: '🍫', name: 'Kakao' },
      { icon: '🌴', name: 'Pinang' }, { icon: '🌶️', name: 'Sayuran' }
    ],
    relevantCrops: ['karet', 'padi_sawah', 'pisang', 'kakao', 'pinang', 'cabai', 'durian', 'lada', 'langsat', 'jeruk_siam', 'jahe', 'alpukat', 'daun_bawang', 'jambu_biji'],
    data: [
      { key: 'Kelas Kesesuaian', val: 'S2 — Cukup Sesuai' },
      { key: 'NDVI Rata-rata', val: '0,73 (Sentinel-2, 2022–2024)' },
      { key: 'Skor Weighted Overlay', val: '3,17 / 4,00' },
      { key: 'Topografi', val: 'Berbukit Rendah' }
    ],
    potensi: [
      'Skor 3,17 dan NDVI 0,73 menunjukkan potensi pertanian yang baik dengan jenis tanah lebih mineral dibanding kecamatan pesisir.',
      'Kedekatan dengan Cagar Alam Mandor membuka peluang ekowisata agro dan penelitian keanekaragaman hayati.',
      'Pertanian organik bersertifikat (padi, sayuran, kedelai) dengan keunggulan kompetitif berbasis jenis tanah mineral.',
      'Perkebunan karet rakyat yang dapat ditingkatkan produktivitasnya melalui klon unggul RRIC dan IRCA.',
      'Prioritas: pengembangan sertifikasi organik dan akses pasar premium Pontianak untuk produk pertanian nilai tambah tinggi.'
    ]
  }
};

// ============================================================
// ANALISIS SYARAT TUMBUH — SAW (Simple Additive Weighting)
// Bobot: Curah Hujan 30%, Suhu 25%, Elevasi 25%, Tanah 20%
// Nilai: Sesuai=1.00, Batas Toleransi=0.50, Tidak Sesuai=0.00
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

function hitungSkorKrop(iklim, syarat) {
  // checks → label status untuk tampilan (Sesuai / Batas / Tidak)
  const checks = [
    cekVariabel(iklim.curahHujan, syarat.curah_hujan),
    cekVariabel(iklim.suhu,       syarat.suhu),
    cekVariabel(iklim.elevasi,    syarat.elevasi),
    cekTanah(iklim.kodeTanah,     syarat.tanah)
  ];
  // nilaiArr → skor kontinu untuk perhitungan SAW
  const tanahNilai = { cocok: 1.0, batas: 0.5, tidak: 0.0 };
  const nilaiArr = [
    nilaiVariabel(iklim.curahHujan, syarat.curah_hujan),
    nilaiVariabel(iklim.suhu,       syarat.suhu),
    nilaiVariabel(iklim.elevasi,    syarat.elevasi),
    tanahNilai[checks[3]]
  ];
  const sawScore = +nilaiArr.reduce((s, v, i) => s + SAW_BOBOT[i] * v, 0).toFixed(3);
  let level, label;
  if      (sawScore >= 0.80) { level = 'sangat-cocok'; label = 'Sangat Cocok';  }
  else if (sawScore >= 0.60) { level = 'cocok';         label = 'Cocok';          }
  else if (sawScore >= 0.40) { level = 'cukup';         label = 'Cukup Sesuai';  }
  else                        { level = 'kurang';        label = 'Kurang Sesuai'; }
  return { level, label, sawScore, checks, nilaiArr };
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
      aktual: iklim.namaTanah.split(' (')[0],
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
    <p class="saw-note">SAW (Simple Additive Weighting) &mdash; Normalisasi <em>r</em> kontinu: Optimal = 1,00; Zona transisi = interpolasi linear 0,00–1,00; Di luar toleransi = 0,00. Jenis tanah (kategorikal): Sesuai = 1,00; Batas = 0,50; Tidak = 0,00.</p>
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
    : '<span class="st-src real">Sumber: CHIRPS v2 + ERA5-Land + SRTM + OpenLandMap (GEE 2022–2024)</span>';

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

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '\u00a9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> \u00a9 <a href="https://carto.com/">CARTO</a>',
        maxZoom: 18,
      }).addTo(modalMap);
    } else {
      modalMap.setView([coords.lat, coords.lng], coords.zoom, { animate: true });
    }

    // Remove old marker / circle
    if (modalMapMarker) { modalMap.removeLayer(modalMapMarker); }
    if (modalMapCircle) { modalMap.removeLayer(modalMapCircle); }

    // Add pulsing circle
    modalMapCircle = L.circle([coords.lat, coords.lng], {
      radius: 3500,
      color: '#2B7A4E',
      fillColor: '#4CA872',
      fillOpacity: 0.14,
      weight: 2
    }).addTo(modalMap);

    // Add custom marker
    const icon = createMarkerIcon('#2B7A4E', d.number);
    modalMapMarker = L.marker([coords.lat, coords.lng], { icon })
      .addTo(modalMap)
      .bindPopup(`<strong>${d.name}</strong><br/>Kecamatan ${d.number}`, { maxWidth: 200 })
      .openPopup();

    // Force re-render after visibility change
    setTimeout(() => { if (modalMap) modalMap.invalidateSize(); }, 150);
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
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
        maxZoom: 18,
      }).addTo(modalDesaMap);
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

// ── SAW komoditas tingkat DESA — Rasau Jaya ────────────────────────────────
// Memperluas hitungSkorKrop (4 kriteria iklim/tanah tingkat kecamatan) dengan
// kriteria ke-5 "Kesesuaian Lahan Desa" (skor Weighted Overlay GIS desa
// bersangkutan, dari data/rasau_jaya_desa.js). Kriteria ke-5 bernilai sama untuk
// tiap komoditas dalam satu desa (karena bersumber dari kualitas lahan wilayah,
// bukan iklim), sehingga urutan antar-komoditas tetap konsisten dengan iklim
// kecamatan, namun skor SAW akhir & kelas kesesuaian bisa berbeda antar desa
// sesuai kualitas lahan riil masing-masing (NDVI, tanah, air, lereng, akses).
const SAW_BOBOT_DESA = [0.15, 0.10, 0.20, 0.25, 0.30]; // Hujan, Suhu, Elevasi, Tanah, Lahan Desa

function hitungSkorKropDesa(iklim, syarat, desaProps) {
  const dasar = hitungSkorKrop(iklim, syarat);
  const nilaiLahanDesa = Math.max(0, Math.min(1, (desaProps.skor || 0) / 4));
  const nilaiArr = [...dasar.nilaiArr, nilaiLahanDesa];
  const sawScore = +nilaiArr.reduce((s, v, i) => s + SAW_BOBOT_DESA[i] * v, 0).toFixed(3);

  let level, label;
  if      (sawScore >= 0.80) { level = 'sangat-cocok'; label = 'Sangat Cocok';  }
  else if (sawScore >= 0.60) { level = 'cocok';         label = 'Cocok';          }
  else if (sawScore >= 0.40) { level = 'cukup';         label = 'Cukup Sesuai';  }
  else                        { level = 'kurang';        label = 'Kurang Sesuai'; }

  return { ...dasar, level, label, sawScore, nilaiArr, nilaiLahanDesa };
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

// ── Panel detail SAW komoditas — versi desa (5 kriteria, sama formatnya
// dengan buildSAWPanel tingkat kecamatan, ditambah baris Kesesuaian Lahan Desa) ─
function buildSAWPanelDesa(iklim, syarat, hasil, desaProps) {
  const tanahName = {
    1:'Clay', 2:'Silty Clay', 3:'Sandy Clay', 4:'Clay Loam',
    5:'Silty Clay Loam', 6:'Sandy Clay Loam', 7:'Loam', 8:'Silty Loam',
    9:'Sandy Loam', 10:'Silt', 11:'Loamy Sand', 12:'Sand'
  };
  // Urutan tampilan: bobot terbesar → terkecil
  const kriteria = [
    {
      idx: 4, nama: 'Kesesuaian Lahan Desa', bobot: SAW_BOBOT_DESA[4],
      aktual: `Skor Weighted Overlay ${desaProps.skor ? desaProps.skor.toFixed(2) : '-'} / 4,00`,
      ideal: 'Skor 4,00 (maksimum) = kesesuaian lahan desa sempurna'
    },
    {
      idx: 3, nama: 'Jenis Tanah', bobot: SAW_BOBOT_DESA[3],
      aktual: iklim.namaTanah.split(' (')[0],
      ideal: syarat.tanah.cocok.map(k => tanahName[k] || k).join(', ')
    },
    {
      idx: 2, nama: 'Elevasi', bobot: SAW_BOBOT_DESA[2],
      aktual: `${iklim.elevasi} m dpl`,
      ideal: `${syarat.elevasi.min}–${syarat.elevasi.max} m dpl`
    },
    {
      idx: 0, nama: 'Curah Hujan', bobot: SAW_BOBOT_DESA[0],
      aktual: `${iklim.curahHujan.toLocaleString('id')} mm/tahun`,
      ideal: `Optimal ${syarat.curah_hujan.optMin.toLocaleString('id')}–${syarat.curah_hujan.optMax.toLocaleString('id')} mm/tahun`
    },
    {
      idx: 1, nama: 'Suhu Udara', bobot: SAW_BOBOT_DESA[1],
      aktual: `${iklim.suhu.toFixed(1)} °C`,
      ideal: `Optimal ${syarat.suhu.optMin}–${syarat.suhu.optMax} °C`
    }
  ];
  const statusLbl = { cocok: 'Sesuai', batas: 'Batas', tidak: 'Tidak Sesuai' };
  const rows = kriteria.map((k) => {
    const ni = hasil.nilaiArr[k.idx];
    const wb = (k.bobot * ni).toFixed(2);
    const nilaiCell = k.idx === 4
      ? `<span class="saw-nilai st-lahan">${ni.toFixed(2)}<br><small>Lahan Desa</small></span>`
      : `<span class="saw-nilai st-${hasil.checks[k.idx]}">${ni.toFixed(2)}<br><small>${statusLbl[hasil.checks[k.idx]]}</small></span>`;
    return `<tr>
      <td class="saw-td-name">${k.nama}</td>
      <td class="saw-td-c">${Math.round(k.bobot * 100)}%</td>
      <td>${k.aktual}</td>
      <td class="saw-td-ideal">${k.ideal}</td>
      <td class="saw-td-c">${nilaiCell}</td>
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
    <p class="saw-note">SAW tingkat desa memakai 5 kriteria: 4 kriteria iklim &amp; tanah tingkat Kecamatan Rasau Jaya (sama untuk seluruh desa di kecamatan ini), ditambah kriteria <em>Kesesuaian Lahan Desa</em> — skor Weighted Overlay GIS spesifik ${desaProps.NAME_4} yang merangkum NDVI, jenis tanah, ketersediaan air, kemiringan lereng, dan aksesibilitas.</p>
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
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
        maxZoom: 18,
      }).addTo(desaDetailMap);
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
    { key: 'Topografi', val: 'Lahan Gambut Dangkal–Sedang' }
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
    `Peringkat komoditas dihitung dari SAW 5 kriteria khusus tingkat desa: Curah Hujan, Suhu, Elevasi, dan Jenis Tanah (data iklim Kecamatan Rasau Jaya), ditambah Kesesuaian Lahan Desa (skor Weighted Overlay GIS desa ini, ±${(desaProps.skor || 0).toFixed(2)}/4,00) — sehingga skor akhir setiap komoditas mencerminkan kualitas lahan spesifik ${desaProps.NAME_4}. Jumlah komoditas yang ditampilkan (${count} dari ${allCrops.length}) menyesuaikan peringkat skor desa ini relatif terhadap ${totalDesa - 1} desa lain di kecamatan yang sama.`;

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

    // CartoDB Dark Matter — modern dark map
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '\u00a9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> \u00a9 <a href="https://carto.com/">CARTO</a>',
      maxZoom: 18
    }).addTo(heroMap);

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

    // Approximate Kubu Raya boundary outline
    const kubuRayaBounds = [
      [-0.65, 108.90], [-0.65, 109.65],
      [0.22, 109.65],  [0.22, 108.90]
    ];
    L.polygon(kubuRayaBounds, {
      color: '#4CA872',
      weight: 1.5,
      fillColor: '#2B7A4E',
      fillOpacity: 0.07,
      dashArray: '8, 6'
    }).addTo(heroMap);

    // Label
    L.marker([-0.18, 109.30], {
      icon: L.divIcon({
        html: `<div style="font-weight:700;font-size:13px;color:#B8DFCB;font-family:'Space Grotesk',sans-serif;text-shadow:0 0 16px rgba(43,122,78,0.9),0 2px 8px rgba(0,0,0,0.95);letter-spacing:0.06em;white-space:nowrap;">Kabupaten Kubu Raya</div>`,
        className: '',
        iconAnchor: [80, 10]
      })
    }).addTo(heroMap);

    // ── Layer Kesesuaian Lahan (GeoJSON) ──────────────────────
    const nameToKecId = {
      'Sungai Raya': 'sungai-raya', 'Sungai Kakap': 'sungai-kakap',
      'Rasau Jaya': 'rasau-jaya', 'Sungai Ambawang': 'sungai-ambawang',
      'Kubu': 'kubu', 'Batu Ampar': 'batu-ampar',
      "Telok Pa'Kedai": 'teluk-pakedai', 'Terentang': 'terentang',
      'Kuala Mandor B': 'kuala-mandor'
    };

    // kesesuaianLahanData dimuat dari data/kesesuaian_lahan.js
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
            <div class="legend-item"><span class="legend-dot" style="background:#d94f3a"></span>N — Tidak Sesuai</div>
            <div class="legend-note">*Data sementara (placeholder)</div>
          `;
          return div;
        };
        legend.addTo(heroMap);
    } else {
      console.warn('kesesuaianLahanData tidak ditemukan — pastikan data/kesesuaian_lahan.js dimuat.');
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

document.addEventListener('DOMContentLoaded', () => {
  initCardCropTags();
  initCardImages();
  initHeroMap();
  initNavbar();
  initHamburger();
  initReveal();
  initCardStagger();
  initCardClicks();
  initModal();
  initCounters();
  initKomparasi();
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

function getCropScores(cropId) {
  const syarat = syaratTumbuhDB[cropId];
  if (!syarat) return [];
  return Object.entries(kecamatanData)
    .filter(([, d]) => d.relevantCrops && d.relevantCrops.includes(cropId))
    .map(([kecId, d]) => {
      const iklim = iklimKecamatan[kecId];
      if (!iklim) return null;
      return { label: d.name, value: hitungSkorKrop(iklim, syarat).sawScore };
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
    `Skor kesesuaian SAW untuk ${syarat.nama} di setiap kecamatan yang relevan, diurutkan dari tertinggi.`;
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
