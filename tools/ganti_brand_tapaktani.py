"""Ganti identitas website dari AgroRaya menjadi TapakTani (nama, logo, favicon, meta). Aman dijalankan ulang."""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def baca(f):
    s = open(os.path.join(ROOT, f), encoding='utf-8', newline='').read()
    return s, '\r\n' in s


def tulis(f, s, crlf):
    open(os.path.join(ROOT, f), 'w', encoding='utf-8', newline='').write(s.replace('\r\n', '\n').replace('\n', '\r\n') if crlf else s)


WORDMARK = '<span class="wm-tapak">tapak</span><span class="wm-tani">tani</span>'
FONT_LAMA = 'family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap'
FONT_BARU = 'family=Outfit:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;800&family=Space+Grotesk:wght@500;600;700&display=swap'

for f in ['index.html', 'sebaran.html']:
    s, crlf = baca(f)
    s = s.replace('\r\n', '\n')
    s = s.replace(FONT_LAMA, FONT_BARU)
    # logo navbar & footer
    s = s.replace('<img src="logo.png" alt="AgroRaya Logo" class="logo-img" />',
                  '<img src="gambar/tapaktani-ikon-gelap.svg" alt="" class="logo-img" width="44" height="44" />')
    s = s.replace('<img src="logo.png" alt="AgroRaya Logo" class="logo-img footer-logo-img" />',
                  '<img src="gambar/tapaktani-ikon-gelap.svg" alt="" class="logo-img footer-logo-img" width="48" height="48" />')
    s = s.replace('<span class="logo-main">AgroRaya</span>', f'<span class="logo-main" aria-label="TapakTani">{WORDMARK}</span>')
    s = s.replace('<div class="footer-title">AgroRaya</div>', f'<div class="footer-title" aria-label="TapakTani">{WORDMARK}</div>')
    s = s.replace('<span class="logo-sub">Kabupaten Kubu Raya</span>', '<span class="logo-sub">SIG Kesesuaian Lahan · Kubu Raya</span>')
    # teks & meta
    s = s.replace('<title>AgroRaya – SIG Pertanian Kabupaten Kubu Raya</title>', '<title>TapakTani – SIG Kesesuaian Lahan Kabupaten Kubu Raya</title>')
    s = s.replace('<title>Sebaran Potensi Padi Sawah – AgroRaya</title>', '<title>Sebaran Potensi Padi Sawah – TapakTani</title>')
    s = s.replace('content="AgroRaya – Sistem Informasi Geografis Pertanian Kabupaten Kubu Raya',
                  'content="TapakTani – Sistem Informasi Geografis kesesuaian lahan pertanian Kabupaten Kubu Raya')
    s = s.replace('<meta property="og:title" content="AgroRaya – SIG Pertanian Kabupaten Kubu Raya" />',
                  '<meta property="og:title" content="TapakTani – SIG Kesesuaian Lahan Kabupaten Kubu Raya" />')
    s = s.replace('gambar/og-agroraya.jpg', 'gambar/og-tapaktani.jpg')
    s = s.replace('AgroRaya · Kabupaten Kubu Raya', 'TapakTani · Kabupaten Kubu Raya')
    s = s.replace('<span class="gradient-text">AgroRaya</span>', '<span class="gradient-text">TapakTani</span>')
    s = s.replace('© 2025–2026 AgroRaya ·', '© 2025–2026 TapakTani ·')
    s = s.replace('WebGIS AgroRaya', 'WebGIS TapakTani')
    # favicon: SVG untuk peramban modern, PNG sebagai cadangan
    if 'favicon.svg' not in s:
        s = s.replace('<link rel="icon" type="image/png" sizes="32x32" href="gambar/favicon-32.png" />',
                      '<link rel="icon" type="image/svg+xml" href="gambar/favicon.svg" />\n  <link rel="icon" type="image/png" sizes="32x32" href="gambar/favicon-32.png" />')
    s = s.replace('<meta name="theme-color" content="#1E6B3C" />', '<meta name="theme-color" content="#0F2A1F" />')
    sisa = re.findall(r'(?i)agro ?raya', s)
    assert not sisa, (f, sisa)
    tulis(f, s, crlf)
    print(f, 'diperbarui')

for f in ['sebaran.js', 'sebaran.css', 'style.css', 'script.js']:
    s, crlf = baca(f)
    s = re.sub(r'AgroRaya', 'TapakTani', s)
    tulis(f, s, crlf)

# gaya logo: ikon kotak (bukan foto bulat) + wordmark Plus Jakarta Sans
s, crlf = baca('style.css')
s = s.replace('\r\n', '\n')
lama = '''.logo-img {
  width: 52px; height: 52px;
  border-radius: 50%; object-fit: cover;
  border: 2px solid rgba(255,255,255,0.30);
  box-shadow: 0 0 18px rgba(43,122,78,0.45), 0 2px 8px rgba(0,0,0,0.25);
  flex-shrink: 0;
}
.footer-logo-img {
  width: 56px; height: 56px;
  opacity: 0.95;
}'''
baru = '''.logo-img {
  width: 44px; height: 44px;
  object-fit: contain;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 10px rgba(76,194,126,0.25));
}
.footer-logo-img {
  width: 48px; height: 48px;
}'''
if lama in s:
    s = s.replace(lama, baru)
lama_main = ".logo-main { font-size: 1rem; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; }"
baru_main = (".logo-main { font-family: 'Plus Jakarta Sans', var(--font-sans); font-size: 1.35rem; line-height: 1; letter-spacing: -0.045em; }\n"
             ".wm-tapak { font-weight: 800; color: #F7F6F1; }\n"
             ".wm-tani  { font-weight: 500; color: #4CC27E; }\n"
             ".footer-title .wm-tapak, .footer-title .wm-tani { font-family: 'Plus Jakarta Sans', var(--font-sans); letter-spacing: -0.045em; }")
if lama_main in s:
    s = s.replace(lama_main, baru_main)
assert '.wm-tapak' in s
tulis('style.css', s, crlf)
print('style.css: gaya logo TapakTani')
