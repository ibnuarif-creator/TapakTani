// Zonasi agroekologi Kabupaten Kubu Raya — klaster Ward atas skor SAW 20 komoditas × 9 kecamatan,
// unggulan aktual = skor rata-rata zona ≥ 0,85 dan LQ produksi BPS 2024 > 1; potensial = belum LQ > 1 / tanpa data produksi.
// Dibuat otomatis oleh tools/buat_data_zonasi.py — jangan diedit manual.
const zonasiAgroekologi = {
 "meta": {
  "silhouette": 0.5,
  "kofenetik": 0.76,
  "ambang": 0.85
 },
 "zona": [
  {
   "zona": "I",
   "judul": "Pesisir barat, curah hujan terendah",
   "warna": "#4A90C8",
   "kecamatan": [
    "Sungai Kakap",
    "Teluk Pakedai"
   ],
   "ciri": "Lempung liat berpasir 46–47%; curah hujan 2.814–2.961 mm/tahun; elevasi median 4–5 m dpl",
   "teratas": [
    {
     "komoditas": "Karet",
     "skor": 0.945
    },
    {
     "komoditas": "Langsat",
     "skor": 0.915
    },
    {
     "komoditas": "Pinang",
     "skor": 0.915
    },
    {
     "komoditas": "Padi Sawah",
     "skor": 0.913
    }
   ],
   "aktual": [
    {
     "komoditas": "Durian",
     "skor": 0.907,
     "kecamatan": [
      "Sungai Kakap",
      "Teluk Pakedai"
     ]
    },
    {
     "komoditas": "Jahe",
     "skor": 0.909,
     "kecamatan": [
      "Sungai Kakap"
     ]
    },
    {
     "komoditas": "Jambu Biji",
     "skor": 0.858,
     "kecamatan": [
      "Sungai Kakap",
      "Teluk Pakedai"
     ]
    },
    {
     "komoditas": "Jeruk Siam",
     "skor": 0.907,
     "kecamatan": [
      "Teluk Pakedai"
     ]
    },
    {
     "komoditas": "Langsat",
     "skor": 0.915,
     "kecamatan": [
      "Sungai Kakap",
      "Teluk Pakedai"
     ]
    },
    {
     "komoditas": "Pinang",
     "skor": 0.915,
     "kecamatan": [
      "Sungai Kakap",
      "Teluk Pakedai"
     ]
    },
    {
     "komoditas": "Pisang",
     "skor": 0.863,
     "kecamatan": [
      "Sungai Kakap"
     ]
    }
   ],
   "potensial": [
    {
     "komoditas": "Karet",
     "skor": 0.945,
     "tanpaData": false
    },
    {
     "komoditas": "Padi Sawah",
     "skor": 0.913,
     "tanpaData": true
    },
    {
     "komoditas": "Lada",
     "skor": 0.909,
     "tanpaData": false
    }
   ]
  },
  {
   "zona": "II",
   "judul": "Lempung liat berpasir, curah hujan sedang",
   "warna": "#2B8A50",
   "kecamatan": [
    "Rasau Jaya",
    "Kubu"
   ],
   "ciri": "Lempung liat berpasir 65–75%; curah hujan 2.982–3.069 mm/tahun; elevasi median 3–4 m dpl",
   "teratas": [
    {
     "komoditas": "Jeruk Siam",
     "skor": 0.948
    },
    {
     "komoditas": "Jahe",
     "skor": 0.946
    },
    {
     "komoditas": "Lada",
     "skor": 0.946
    },
    {
     "komoditas": "Durian",
     "skor": 0.937
    }
   ],
   "aktual": [
    {
     "komoditas": "Durian",
     "skor": 0.937,
     "kecamatan": [
      "Rasau Jaya"
     ]
    },
    {
     "komoditas": "Jambu Biji",
     "skor": 0.883,
     "kecamatan": [
      "Kubu"
     ]
    },
    {
     "komoditas": "Jeruk Siam",
     "skor": 0.948,
     "kecamatan": [
      "Kubu"
     ]
    }
   ],
   "potensial": [
    {
     "komoditas": "Jahe",
     "skor": 0.946,
     "tanpaData": false
    },
    {
     "komoditas": "Lada",
     "skor": 0.946,
     "tanpaData": false
    },
    {
     "komoditas": "Karet",
     "skor": 0.926,
     "tanpaData": false
    },
    {
     "komoditas": "Pinang",
     "skor": 0.869,
     "tanpaData": false
    },
    {
     "komoditas": "Langsat",
     "skor": 0.867,
     "tanpaData": false
    },
    {
     "komoditas": "Padi Sawah",
     "skor": 0.865,
     "tanpaData": true
    },
    {
     "komoditas": "Ubi Kayu",
     "skor": 0.851,
     "tanpaData": true
    }
   ]
  },
  {
   "zona": "III",
   "judul": "Lempung liat berpasir, curah hujan tinggi",
   "warna": "#D9A21B",
   "kecamatan": [
    "Sungai Ambawang",
    "Kuala Mandor B"
   ],
   "ciri": "Lempung liat berpasir 76–77%; curah hujan 3.244–3.341 mm/tahun; elevasi median 8–9 m dpl",
   "teratas": [
    {
     "komoditas": "Jeruk Siam",
     "skor": 0.928
    },
    {
     "komoditas": "Jahe",
     "skor": 0.903
    },
    {
     "komoditas": "Lada",
     "skor": 0.903
    },
    {
     "komoditas": "Karet",
     "skor": 0.885
    }
   ],
   "aktual": [
    {
     "komoditas": "Jambu Biji",
     "skor": 0.855,
     "kecamatan": [
      "Sungai Ambawang"
     ]
    },
    {
     "komoditas": "Karet",
     "skor": 0.885,
     "kecamatan": [
      "Sungai Ambawang",
      "Kuala Mandor B"
     ]
    },
    {
     "komoditas": "Lada",
     "skor": 0.903,
     "kecamatan": [
      "Sungai Ambawang"
     ]
    }
   ],
   "potensial": [
    {
     "komoditas": "Jeruk Siam",
     "skor": 0.928,
     "tanpaData": false
    },
    {
     "komoditas": "Jahe",
     "skor": 0.903,
     "tanpaData": false
    }
   ]
  },
  {
   "zona": "IV",
   "judul": "Tekstur campuran, curah hujan tinggi",
   "warna": "#B5649A",
   "kecamatan": [
    "Sungai Raya",
    "Batu Ampar",
    "Terentang"
   ],
   "ciri": "Lempung liat berpasir 44–53%; curah hujan 3.181–3.330 mm/tahun; elevasi median 5–8 m dpl",
   "teratas": [
    {
     "komoditas": "Karet",
     "skor": 0.89
    },
    {
     "komoditas": "Jeruk Siam",
     "skor": 0.883
    },
    {
     "komoditas": "Pinang",
     "skor": 0.87
    },
    {
     "komoditas": "Jahe",
     "skor": 0.859
    }
   ],
   "aktual": [
    {
     "komoditas": "Jahe",
     "skor": 0.859,
     "kecamatan": [
      "Sungai Raya",
      "Terentang"
     ]
    },
    {
     "komoditas": "Jeruk Siam",
     "skor": 0.883,
     "kecamatan": [
      "Batu Ampar",
      "Terentang"
     ]
    },
    {
     "komoditas": "Lada",
     "skor": 0.859,
     "kecamatan": [
      "Sungai Raya",
      "Batu Ampar"
     ]
    }
   ],
   "potensial": [
    {
     "komoditas": "Karet",
     "skor": 0.89,
     "tanpaData": false
    },
    {
     "komoditas": "Pinang",
     "skor": 0.87,
     "tanpaData": false
    },
    {
     "komoditas": "Padi Sawah",
     "skor": 0.855,
     "tanpaData": true
    },
    {
     "komoditas": "Langsat",
     "skor": 0.852,
     "tanpaData": false
    }
   ]
  }
 ]
};
