// Zonasi agroekologi Kabupaten Kubu Raya — klaster Ward atas skor SAW 20 komoditas × 9 kecamatan,
// unggulan aktual = skor rata-rata zona ≥ 0,85 dan LQ produksi BPS 2024 > 1; potensial = belum LQ > 1 / tanpa data produksi.
// Dibuat otomatis oleh tools/buat_data_zonasi.py — jangan diedit manual.
const zonasiAgroekologi = {
 "meta": {
  "silhouette2": 0.48,
  "silhouette": 0.44,
  "kofenetik": 0.85,
  "ambang": 0.85
 },
 "zona": [
  {
   "zona": "A1",
   "judul": "Zona A tekstur campuran — pesisir barat, curah hujan terendah",
   "warna": "#4A90C8",
   "kecamatan": [
    "Sungai Kakap",
    "Batu Ampar",
    "Teluk Pakedai"
   ],
   "ciri": "Lempung berliat 46–52%, lempung liat berpasir 46–51%; curah hujan normal 2.798–2.945 mm/tahun; elevasi median 4–5 m dpl",
   "teratas": [
    {
     "komoditas": "Karet",
     "skor": 0.944
    },
    {
     "komoditas": "Padi Sawah",
     "skor": 0.912
    },
    {
     "komoditas": "Langsat",
     "skor": 0.912
    },
    {
     "komoditas": "Pinang",
     "skor": 0.912
    }
   ],
   "aktual": [
    {
     "komoditas": "Durian",
     "skor": 0.91,
     "kecamatan": [
      "Sungai Kakap",
      "Batu Ampar",
      "Teluk Pakedai"
     ],
     "peringatan": false
    },
    {
     "komoditas": "Jahe",
     "skor": 0.911,
     "kecamatan": [
      "Sungai Kakap"
     ],
     "peringatan": false
    },
    {
     "komoditas": "Jambu Biji",
     "skor": 0.86,
     "kecamatan": [
      "Sungai Kakap",
      "Batu Ampar",
      "Teluk Pakedai"
     ],
     "peringatan": false
    },
    {
     "komoditas": "Jeruk Siam",
     "skor": 0.91,
     "kecamatan": [
      "Batu Ampar",
      "Teluk Pakedai"
     ],
     "peringatan": false
    },
    {
     "komoditas": "Lada",
     "skor": 0.911,
     "kecamatan": [
      "Batu Ampar"
     ],
     "peringatan": false
    },
    {
     "komoditas": "Langsat",
     "skor": 0.912,
     "kecamatan": [
      "Sungai Kakap",
      "Teluk Pakedai"
     ],
     "peringatan": false
    },
    {
     "komoditas": "Pinang",
     "skor": 0.912,
     "kecamatan": [
      "Sungai Kakap",
      "Teluk Pakedai"
     ],
     "peringatan": false
    },
    {
     "komoditas": "Pisang",
     "skor": 0.86,
     "kecamatan": [
      "Sungai Kakap",
      "Batu Ampar"
     ],
     "peringatan": false
    }
   ],
   "potensial": [
    {
     "komoditas": "Karet",
     "skor": 0.944,
     "tanpaData": false,
     "peringatan": true
    },
    {
     "komoditas": "Padi Sawah",
     "skor": 0.912,
     "tanpaData": true,
     "peringatan": false
    }
   ]
  },
  {
   "zona": "A2",
   "judul": "Zona A tekstur campuran — curah hujan tinggi",
   "warna": "#B5649A",
   "kecamatan": [
    "Sungai Raya",
    "Terentang"
   ],
   "ciri": "Lempung liat berpasir 44–53%, lempung berliat 42–52%; curah hujan normal 3.102–3.124 mm/tahun; elevasi median 7–8 m dpl",
   "teratas": [
    {
     "komoditas": "Karet",
     "skor": 0.908
    },
    {
     "komoditas": "Jeruk Siam",
     "skor": 0.896
    },
    {
     "komoditas": "Pinang",
     "skor": 0.889
    },
    {
     "komoditas": "Jahe",
     "skor": 0.887
    }
   ],
   "aktual": [
    {
     "komoditas": "Durian",
     "skor": 0.862,
     "kecamatan": [
      "Terentang"
     ],
     "peringatan": false
    },
    {
     "komoditas": "Jahe",
     "skor": 0.887,
     "kecamatan": [
      "Sungai Raya",
      "Terentang"
     ],
     "peringatan": false
    },
    {
     "komoditas": "Jeruk Siam",
     "skor": 0.896,
     "kecamatan": [
      "Terentang"
     ],
     "peringatan": false
    },
    {
     "komoditas": "Lada",
     "skor": 0.887,
     "kecamatan": [
      "Sungai Raya"
     ],
     "peringatan": false
    }
   ],
   "potensial": [
    {
     "komoditas": "Karet",
     "skor": 0.908,
     "tanpaData": false,
     "peringatan": true
    },
    {
     "komoditas": "Pinang",
     "skor": 0.889,
     "tanpaData": false,
     "peringatan": false
    },
    {
     "komoditas": "Padi Sawah",
     "skor": 0.887,
     "tanpaData": true,
     "peringatan": false
    },
    {
     "komoditas": "Langsat",
     "skor": 0.881,
     "tanpaData": false,
     "peringatan": false
    }
   ]
  },
  {
   "zona": "B1",
   "judul": "Zona B lempung liat berpasir — curah hujan sedang",
   "warna": "#2B8A50",
   "kecamatan": [
    "Rasau Jaya",
    "Kubu"
   ],
   "ciri": "Lempung liat berpasir 65–75%; curah hujan normal 2.847–3.036 mm/tahun; elevasi median 3–4 m dpl",
   "teratas": [
    {
     "komoditas": "Jahe",
     "skor": 0.95
    },
    {
     "komoditas": "Lada",
     "skor": 0.95
    },
    {
     "komoditas": "Jeruk Siam",
     "skor": 0.949
    },
    {
     "komoditas": "Durian",
     "skor": 0.944
    }
   ],
   "aktual": [
    {
     "komoditas": "Durian",
     "skor": 0.944,
     "kecamatan": [
      "Rasau Jaya"
     ],
     "peringatan": false
    },
    {
     "komoditas": "Jambu Biji",
     "skor": 0.895,
     "kecamatan": [
      "Kubu"
     ],
     "peringatan": false
    },
    {
     "komoditas": "Jeruk Siam",
     "skor": 0.949,
     "kecamatan": [
      "Kubu"
     ],
     "peringatan": false
    },
    {
     "komoditas": "Pepaya",
     "skor": 0.865,
     "kecamatan": [
      "Rasau Jaya",
      "Kubu"
     ],
     "peringatan": false
    }
   ],
   "potensial": [
    {
     "komoditas": "Jahe",
     "skor": 0.95,
     "tanpaData": false,
     "peringatan": false
    },
    {
     "komoditas": "Lada",
     "skor": 0.95,
     "tanpaData": false,
     "peringatan": false
    },
    {
     "komoditas": "Karet",
     "skor": 0.937,
     "tanpaData": false,
     "peringatan": true
    },
    {
     "komoditas": "Pinang",
     "skor": 0.871,
     "tanpaData": false,
     "peringatan": false
    },
    {
     "komoditas": "Langsat",
     "skor": 0.87,
     "tanpaData": false,
     "peringatan": false
    },
    {
     "komoditas": "Padi Sawah",
     "skor": 0.868,
     "tanpaData": true,
     "peringatan": false
    },
    {
     "komoditas": "Nanas",
     "skor": 0.865,
     "tanpaData": false,
     "peringatan": false
    },
    {
     "komoditas": "Ubi Kayu",
     "skor": 0.859,
     "tanpaData": true,
     "peringatan": false
    }
   ]
  },
  {
   "zona": "B2",
   "judul": "Zona B lempung liat berpasir — curah hujan tinggi",
   "warna": "#D9A21B",
   "kecamatan": [
    "Sungai Ambawang",
    "Kuala Mandor B"
   ],
   "ciri": "Lempung liat berpasir 76–77%; curah hujan normal 3.109–3.170 mm/tahun; elevasi median 8–9 m dpl",
   "teratas": [
    {
     "komoditas": "Jeruk Siam",
     "skor": 0.944
    },
    {
     "komoditas": "Jahe",
     "skor": 0.933
    },
    {
     "komoditas": "Lada",
     "skor": 0.933
    },
    {
     "komoditas": "Karet",
     "skor": 0.906
    }
   ],
   "aktual": [
    {
     "komoditas": "Durian",
     "skor": 0.901,
     "kecamatan": [
      "Sungai Ambawang"
     ],
     "peringatan": false
    },
    {
     "komoditas": "Jambu Biji",
     "skor": 0.876,
     "kecamatan": [
      "Sungai Ambawang"
     ],
     "peringatan": false
    },
    {
     "komoditas": "Karet",
     "skor": 0.906,
     "kecamatan": [
      "Sungai Ambawang",
      "Kuala Mandor B"
     ],
     "peringatan": false
    },
    {
     "komoditas": "Lada",
     "skor": 0.933,
     "kecamatan": [
      "Sungai Ambawang"
     ],
     "peringatan": false
    }
   ],
   "potensial": [
    {
     "komoditas": "Jeruk Siam",
     "skor": 0.944,
     "tanpaData": false,
     "peringatan": false
    },
    {
     "komoditas": "Jahe",
     "skor": 0.933,
     "tanpaData": false,
     "peringatan": false
    }
   ]
  }
 ]
};
