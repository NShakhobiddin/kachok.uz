"""Flow’dan qaytgan taom rasmlarini ilovaga joylash (food-pack.ts to‘plami).

Ishlatish: python3 -I scripts/images/place_food.py <natijalar-papkasi> [--root <repo>]
Har ish papkasida job.json ({"id": ...}) va natija.png bo‘ladi:
- public/food/<id>.webp — 512 px kvadrat (markazdan kesiladi);
- src/data/foodImages.ts dagi WITH_IMG ro‘yxatiga id qo‘shiladi.
"""
import json
import os
import re
import sys

from PIL import Image


def main():
    args = sys.argv[1:]
    root = '.'
    if '--root' in args:
        i = args.index('--root')
        root = args[i + 1]
        del args[i:i + 2]
    if not args:
        sys.exit('natijalar papkasi kerak')
    src_dir = args[0]
    out_dir = os.path.join(root, 'public', 'food')
    os.makedirs(out_dir, exist_ok=True)
    placed = []
    for dirpath, _dirs, files in os.walk(src_dir):
        if 'job.json' not in files or 'natija.png' not in files:
            continue
        with open(os.path.join(dirpath, 'job.json'), encoding='utf-8') as fh:
            fid = json.load(fh)['id']
        if not re.fullmatch(r'[a-z0-9-]+', fid):
            print('noto‘g‘ri id:', fid)
            continue
        im = Image.open(os.path.join(dirpath, 'natija.png')).convert('RGB')
        w, h = im.size
        side = min(w, h)
        im = im.crop(((w - side) // 2, (h - side) // 2, (w + side) // 2, (h + side) // 2)).resize((512, 512), Image.LANCZOS)
        im.save(os.path.join(out_dir, f'{fid}.webp'), 'WEBP', quality=82, method=6)
        placed.append(fid)
    ts = os.path.join(root, 'src', 'data', 'foodImages.ts')
    with open(ts, encoding='utf-8') as fh:
        src = fh.read()
    m = re.search(r'new Set<string>\(\[(.*?)\]\)', src, re.S)
    have = set(re.findall(r"'([a-z0-9-]+)'", m.group(1)))
    have.update(placed)
    body = ', '.join(f"'{x}'" for x in sorted(have))
    src = src[: m.start(1)] + body + src[m.end(1):]
    with open(ts, 'w', encoding='utf-8') as fh:
        fh.write(src)
    print(f'joylandi: {len(placed)} ta; jami rasmli: {len(have)}')


if __name__ == '__main__':
    main()
