// Parameter kualitas lahan per desa — Kecamatan Rasau Jaya
// Sumber: data spasial konsultan (Skor_Lereng, Skor_Bahaya_Banjir, Skor_pH_Tanah,
// Skor_C_Organik, Skor_Ketebalan_Gambut); skala skor 1–4 (N/S3/S2/S1).
// Digenerasi oleh tools/zonal_parameter_desa.py — jangan diedit manual.
const parameterLahanDesa = {
  "Bintang Mas": {
    "lereng": {
      "skor": 3.268,
      "kelas": "S2",
      "dist": {
        "S1": 33.4,
        "S2": 60.0,
        "S3": 6.6
      },
      "cakupan": 100.0
    },
    "banjir": {
      "skor": 2.756,
      "kelas": "S3",
      "dist": {
        "S1": 21.3,
        "S2": 33.0,
        "S3": 45.7
      },
      "cakupan": 99.0
    },
    "ph": {
      "skor": 3.231,
      "kelas": "S2",
      "dist": {
        "S1": 25.0,
        "S2": 74.1,
        "N": 0.9
      },
      "cakupan": 100.0
    },
    "corg": {
      "skor": 3.972,
      "kelas": "S1",
      "dist": {
        "S1": 99.1,
        "N": 0.9
      },
      "cakupan": 100.0
    },
    "gambut": {
      "skor": 4.0,
      "kelas": "S1",
      "dist": {
        "S1": 100.0
      },
      "cakupan": 100.0
    }
  },
  "Pematang Tujuh": {
    "lereng": {
      "skor": 3.233,
      "kelas": "S2",
      "dist": {
        "S1": 31.9,
        "S2": 59.9,
        "S3": 7.8,
        "N": 0.4
      },
      "cakupan": 57.3
    },
    "banjir": {
      "skor": 2.618,
      "kelas": "S3",
      "dist": {
        "S1": 18.3,
        "S2": 25.2,
        "S3": 56.5
      },
      "cakupan": 57.0
    },
    "ph": {
      "skor": 3.276,
      "kelas": "S2",
      "dist": {
        "S1": 31.5,
        "S2": 66.5,
        "S3": 0.2,
        "N": 1.8
      },
      "cakupan": 57.3
    },
    "corg": {
      "skor": 3.945,
      "kelas": "S1",
      "dist": {
        "S1": 98.2,
        "N": 1.8
      },
      "cakupan": 57.3
    },
    "gambut": {
      "skor": 4.0,
      "kelas": "S1",
      "dist": {
        "S1": 100.0
      },
      "cakupan": 57.3
    }
  },
  "Rasau Jaya I": {
    "lereng": {
      "skor": 3.363,
      "kelas": "S2",
      "dist": {
        "S1": 39.7,
        "S2": 56.9,
        "S3": 3.4
      },
      "cakupan": 100.0
    },
    "banjir": {
      "skor": 2.195,
      "kelas": "S3",
      "dist": {
        "S1": 0.8,
        "S2": 17.9,
        "S3": 81.3
      },
      "cakupan": 100.0
    },
    "ph": {
      "skor": 2.976,
      "kelas": "S2",
      "dist": {
        "S1": 1.4,
        "S2": 95.6,
        "S3": 2.3,
        "N": 0.8
      },
      "cakupan": 100.0
    },
    "corg": {
      "skor": 3.977,
      "kelas": "S1",
      "dist": {
        "S1": 99.2,
        "N": 0.8
      },
      "cakupan": 100.0
    },
    "gambut": {
      "skor": 4.0,
      "kelas": "S1",
      "dist": {
        "S1": 100.0
      },
      "cakupan": 100.0
    }
  },
  "Rasau Jaya Ii": {
    "lereng": {
      "skor": 3.209,
      "kelas": "S2",
      "dist": {
        "S1": 30.7,
        "S2": 59.6,
        "S3": 9.6,
        "N": 0.1
      },
      "cakupan": 93.2
    },
    "banjir": {
      "skor": 3.042,
      "kelas": "S2",
      "dist": {
        "S1": 31.3,
        "S2": 41.5,
        "S3": 27.2
      },
      "cakupan": 92.7
    },
    "ph": {
      "skor": 2.864,
      "kelas": "S2",
      "dist": {
        "S1": 1.5,
        "S2": 83.8,
        "S3": 14.4,
        "N": 0.3
      },
      "cakupan": 93.2
    },
    "corg": {
      "skor": 3.99,
      "kelas": "S1",
      "dist": {
        "S1": 99.7,
        "N": 0.3
      },
      "cakupan": 93.2
    },
    "gambut": {
      "skor": 4.0,
      "kelas": "S1",
      "dist": {
        "S1": 100.0
      },
      "cakupan": 93.2
    }
  },
  "Rasau Jaya Iii": {
    "lereng": {
      "skor": 3.262,
      "kelas": "S2",
      "dist": {
        "S1": 34.3,
        "S2": 57.7,
        "S3": 8.0,
        "N": 0.0
      },
      "cakupan": 100.0
    },
    "banjir": {
      "skor": 2.502,
      "kelas": "S3",
      "dist": {
        "S1": 0.6,
        "S2": 49.0,
        "S3": 50.4
      },
      "cakupan": 100.0
    },
    "ph": {
      "skor": 2.966,
      "kelas": "S2",
      "dist": {
        "S1": 0.5,
        "S2": 97.1,
        "S3": 0.8,
        "N": 1.6
      },
      "cakupan": 100.0
    },
    "corg": {
      "skor": 3.952,
      "kelas": "S1",
      "dist": {
        "S1": 98.4,
        "N": 1.6
      },
      "cakupan": 100.0
    },
    "gambut": {
      "skor": 4.0,
      "kelas": "S1",
      "dist": {
        "S1": 100.0
      },
      "cakupan": 100.0
    }
  },
  "Rasau Jaya Umum": {
    "lereng": {
      "skor": 3.255,
      "kelas": "S2",
      "dist": {
        "S1": 33.1,
        "S2": 59.4,
        "S3": 7.4,
        "N": 0.1
      },
      "cakupan": 98.0
    },
    "banjir": {
      "skor": 2.588,
      "kelas": "S3",
      "dist": {
        "S1": 18.7,
        "S2": 21.5,
        "S3": 59.8
      },
      "cakupan": 96.1
    },
    "ph": {
      "skor": 3.081,
      "kelas": "S2",
      "dist": {
        "S1": 8.4,
        "S2": 91.3,
        "S3": 0.3
      },
      "cakupan": 98.0
    },
    "corg": {
      "skor": 4.0,
      "kelas": "S1",
      "dist": {
        "S1": 100.0
      },
      "cakupan": 98.0
    },
    "gambut": {
      "skor": 4.0,
      "kelas": "S1",
      "dist": {
        "S1": 100.0
      },
      "cakupan": 98.0
    }
  }
};
