"""
Berkas logo TapakTani (konsep C, gambaran/logo_baru/C-Varian.dc.html) untuk website:
  gambar/tapaktani-ikon-gelap.svg   ikon untuk latar gelap (navbar, footer)
  gambar/tapaktani-ikon.svg         ikon untuk latar terang
  gambar/tapaktani-app.svg          ikon aplikasi (kotak gelap membulat) — sumber apple-touch-icon
  gambar/favicon.svg                favicon (varian terang)
Jalankan: python tools/buat_logo_tapaktani.py
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, 'gambar')


def ikon(utama, daun, garis, kiri_tengah, kanan_tengah, kiri_bawah, kanan_bawah, tebal=2.6, garis_daun=True):
    """Kotak 3×3 berpola huruf T (kotak 'utama'), daun di pojok kanan atas, kotak aksen lainnya."""
    return (f'<rect x="6" y="6" width="32" height="32" rx="8" fill="{utama}"/>'
            f'<rect x="44" y="6" width="32" height="32" rx="8" fill="{utama}"/>'
            f'<path d="M102 6 H114 V18 A20 20 0 0 1 94 38 H82 V26 A20 20 0 0 1 102 6 Z" fill="{daun}"/>'
            + (f'<path d="M88 32 L108 12" stroke="{garis}" stroke-width="{tebal}" stroke-linecap="round" fill="none"/>' if garis_daun else '')
            + f'<rect x="6" y="44" width="32" height="32" rx="8" fill="{kiri_tengah}"/>'
            f'<rect x="44" y="44" width="32" height="32" rx="8" fill="{utama}"/>'
            f'<rect x="82" y="44" width="32" height="32" rx="8" fill="{kanan_tengah}"/>'
            f'<rect x="6" y="82" width="32" height="32" rx="8" fill="{kiri_bawah}"/>'
            f'<rect x="44" y="82" width="32" height="32" rx="8" fill="{utama}"/>'
            f'<rect x="82" y="82" width="32" height="32" rx="8" fill="{kanan_bawah}"/>')


svg = lambda isi, label, vb='0 0 120 120': (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="{label}">'
                                           f'<title>{label}</title>{isi}</svg>\n')

GELAP = ikon('#F7F6F1', '#4CC27E', '#0F2A1F', '#3D6B52', '#D49A52', '#24443A', '#3D6B52')
TERANG = ikon('#14513A', '#23804C', '#F7F6F1', '#9CC3A4', '#D49A52', '#DCD5C3', '#9CC3A4')
FAVICON = ikon('#14513A', '#23804C', '#F7F6F1', '#9CC3A4', '#D49A52', '#DCD5C3', '#9CC3A4', garis_daun=False)
APP = ('<rect width="120" height="120" rx="28" fill="#0F2A1F"/>'
       '<g transform="translate(22 22) scale(0.6333)">' + ikon('#F7F6F1', '#4CC27E', '#0F2A1F', '#3D6B52', '#D49A52', '#24443A', '#3D6B52', tebal=3) + '</g>')

for nama, isi, label in [('tapaktani-ikon-gelap.svg', GELAP, 'Ikon TapakTani'), ('tapaktani-ikon.svg', TERANG, 'Ikon TapakTani'),
                         ('favicon.svg', FAVICON, 'TapakTani'), ('tapaktani-app.svg', APP, 'Ikon aplikasi TapakTani')]:
    open(os.path.join(G, nama), 'w', encoding='utf-8').write(svg(isi, label))
    print('ditulis:', nama)
