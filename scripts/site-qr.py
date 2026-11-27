"""Sayt uchun bot QR kodi: site/public/qr-bot.svg (kompyuterdagi yakuniy chaqiriqda — telefon kamerasi bilan skanerlanadi).
Bot yoki havola o'zgarsa qayta yarating (repo ildizidan):

    pip install segno
    python3 scripts/site-qr.py [bot_nomi]
"""
import sys
from pathlib import Path

import segno

ROOT = Path(__file__).resolve().parent.parent
BOT = sys.argv[1] if len(sys.argv) > 1 else "gym_bosbot"
URL = f"https://t.me/{BOT}?startapp=site_qr"

qr = segno.make(URL, error="m")
out = ROOT / "site/public/qr-bot.svg"
# qora modullar oq fonda: kamera ishonchli o'qiydi; o'lchami CSS da
qr.save(out, kind="svg", scale=1, border=2, dark="#000000", light="#ffffff", xmldecl=False, svgns=True, title=None, nl=False, omitsize=True)
print(f"{out.relative_to(ROOT)}: {URL} ({qr.designator}, {qr.symbol_size(scale=1, border=2)[0]} modul)")
