"""Sayt uchun rasm lentasi: site/src/media.ts dagi GALLERY_IDS mashqlarining asosiy rasmi 400 px qilib
site/public/gallery/<id>.webp ga yoziladi (asl rasmlar 1024 px — lentada bunchalik katta kerak emas).

Ishga tushirish (repo ildizidan):  python3 scripts/site-gallery.py
"""
import re
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SIZE = 400

media = (ROOT / "site/src/media.ts").read_text(encoding="utf-8")
block = re.search(r"GALLERY_IDS = \[(.*?)\]", media, re.S)
ids = re.findall(r"'([a-z0-9-]+)'", block.group(1)) if block else []
if not ids:
    sys.exit("media.ts: GALLERY_IDS topilmadi")

illu = (ROOT / "src/data/illustrations.ts").read_text(encoding="utf-8")
out = ROOT / "site/public/gallery"
out.mkdir(parents=True, exist_ok=True)
keep = set()
for id_ in ids:
    # kalit qo'shtirnoqda ('back-squat') yoki oddiy (deadlift) bo'lishi mumkin
    key = r"(?:'" + re.escape(id_) + r"'|(?<![\w'-])" + re.escape(id_) + r")"
    m = re.search(r"^\s*" + key + r":\s*\{\s*src:\s*img\('([^']+)'\)", illu, re.M)
    if not m:
        sys.exit(f"illustrations.ts: {id_} uchun rasm yo'q")
    src = ROOT / "public/illustrations" / m.group(1)
    im = Image.open(src).convert("RGB")
    im.thumbnail((SIZE, SIZE), Image.LANCZOS)
    dst = out / f"{id_}.webp"
    im.save(dst, "WEBP", quality=80, method=6)
    keep.add(dst.name)
    print(f"{dst.relative_to(ROOT)}  {im.size[0]}x{im.size[1]}  {dst.stat().st_size // 1024} KB")
for f in out.glob("*.webp"):
    if f.name not in keep:
        f.unlink()
        print(f"o'chirildi: {f.relative_to(ROOT)}")
