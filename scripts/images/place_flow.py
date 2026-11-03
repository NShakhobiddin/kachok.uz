"""Flow natijalarini ilovaga joylash (flow-pack2.ts to'plami qaytgach).

Ishlatish: python3 scripts/images/place_flow.py <natijalar-papkasi> [--root <repo>]
Har ish papkasida job.json va natija-A.png / natija-B.png:
- yangi mashq: public/illustrations/<id>.webp + thumb/<id>.webp, ikkinchi kadr alt/<id>.webp,
  src/data/illustrations.ts dagi <auto> blokiga yozuv (yorliqlarsiz — mushaklar rasm ostida ro'yxat bo'lib chiqadi);
- eski mashq: natija-A asosiy kadrni, natija-B ikkinchi kadrni almashtiradi; yozuvda ikkinchi kadr bo'lmasa — qo'shiladi
  (asosiy kadr almashsa, qo'lda qo'yilgan yorliq koordinatalarini qayta tekshirish kerak — ro'yxat oxirida chiqadi);
- jihoz: public/illustrations/equipment/<id>.webp va EQUIPMENT_WITH_IMG ro'yxati.
"""
import json
import os
import re
import subprocess
import sys

import numpy as np
from PIL import Image


def _thumb(im, pid):
    """Ro'yxatlar uchun 192 px kichik rasm: odam tanasi atrofida kesiladi (place.py dagi qoida)."""
    px = np.asarray(im).astype(int)
    r, g, b = px[..., 0], px[..., 1], px[..., 2]
    body = ((r > 80) & (r > g * 1.35) & (r > b * 1.3)) | ((g > 140) & (r > 110) & (b < 130) & (g > b * 1.6))
    ys, xs = np.where(body)
    W, H = im.size
    if not len(xs):
        im.resize((192, 192), Image.LANCZOS).save(f'public/illustrations/thumb/{pid}.webp', 'WEBP', quality=80, method=6)
        return
    x0, x1, y0, y1 = np.percentile(xs, 1), np.percentile(xs, 99), np.percentile(ys, 0.3), np.percentile(ys, 99.7)
    side = min(W, max(max(x1 - x0, y1 - y0) * 1.32, W * 0.45))
    left = max(0, min(W - side, (x0 + x1 - side) / 2))
    top = max(0, min(H - side, (y0 + y1 - side) / 2))
    im.crop((int(left), int(top), int(left + side), int(top + side))).resize((192, 192), Image.LANCZOS).save(f'public/illustrations/thumb/{pid}.webp', 'WEBP', quality=80, method=6)

args = sys.argv[1:]
root = args[args.index('--root') + 1] if '--root' in args else '.'
res_dir = [a for a in args if not a.startswith('--') and a != root][0]
os.chdir(root)

ill_path = 'src/data/illustrations.ts'
ill = open(ill_path, encoding='utf-8').read()
eq_path = 'src/data/equipmentImages.ts'
eq_src = open(eq_path, encoding='utf-8').read()
eq_ids = set(re.findall(r"'([a-zA-Z]+)'", re.search(r'EQUIPMENT_WITH_IMG: EquipmentId\[\] = \[(.*?)\]', eq_src, re.S).group(1)))
names = {j['id']: j['title'].split(' (')[0] for j in json.load(open('scripts/images/prompts.json', encoding='utf-8')) if j['kind'] == 'exercise'}

head, rest = ill.split('// <auto>')
auto_first, auto_body_tail = rest.split('\n', 1)
auto_body, tail = auto_body_tail.split('  // </auto>')


def save(src, dst, size):
    im = Image.open(src).convert('RGB')
    if im.size != (size, size):
        im = im.resize((size, size), Image.LANCZOS)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    im.save(dst, 'WEBP', quality=80, method=6)
    return im


def entry_block(text, eid):
    m = re.search(r"^  '?" + re.escape(eid) + r"'?: \{\n", text, re.M)
    if not m:
        return None
    end = text.index('\n  },\n', m.end())
    return m.start(), end


review, placed = [], []
for d in sorted(os.listdir(res_dir)):
    pd = os.path.join(res_dir, d)
    for sub in sorted(os.listdir(pd)) if os.path.isdir(pd) and not os.path.exists(os.path.join(pd, 'job.json')) else [None]:
        jd = os.path.join(pd, sub) if sub else pd
        jf = os.path.join(jd, 'job.json')
        if not os.path.exists(jf):
            continue
        job = json.load(open(jf, encoding='utf-8'))
        eid, a, b = job['id'], os.path.join(jd, 'natija-A.png'), os.path.join(jd, 'natija-B.png')
        has_a, has_b = os.path.exists(a), os.path.exists(b)
        if not (has_a or has_b):
            continue
        if job['group'] == 'equipment':
            save(a, f'public/illustrations/equipment/{eid}.webp', 512)
            eq_ids.add(eid)
            placed.append(eid)
            continue
        if has_a:
            _thumb(save(a, f'public/illustrations/{eid}.webp', 1024), eid)
        if has_b:
            save(b, f'public/illustrations/alt/{eid}.webp', 1024)
        placed.append(eid + (' A' if has_a else '') + (' B' if has_b else ''))
        blk = entry_block(head, eid)
        if blk:
            # qo'lda yozilgan yozuv: ikkinchi kadr qatori bo'lmasa — qo'shiladi
            s, e = blk
            body = head[s:e]
            if has_b and 'pair:' not in body:
                phase = job['pair']['phaseUz']
                body = re.sub(r"(\n    phase: '[^']*',\n)", lambda m: m.group(1) + f"    pair: {{ src: img('alt/{eid}.webp'), phase: '{phase}' }},\n", body, count=1)
                head = head[:s] + body + head[e:]
            if has_a and job['group'] == 'old':
                review.append(eid)
        elif has_a:
            # yangi: <auto> blokiga (oldingi yozuvi bo'lsa — almashtiriladi)
            # bir qatorli yoki prettier ko'p qatorga bo'lgan yozuv
            auto_body = re.sub(r"^  '?" + re.escape(eid) + r"'?: \{(?:[^\n]*\},\n|\n.*?\n  \},\n)", '', auto_body, flags=re.M | re.S)
            phase = (job.get('main') or {}).get('phaseUz') or 'Asosiy holat'
            name = names.get(eid, eid).replace("'", '’')
            alt = f"{name}, {phase.lower()}: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda"
            pair = f", pair: {{ src: img('alt/{eid}.webp'), phase: '{job['pair']['phaseUz']}' }}" if has_b else ''
            auto_body += f"  '{eid}': {{ src: img('{eid}.webp'), phase: '{phase}', alt: '{alt}'{pair} }},\n"

open(ill_path, 'w', encoding='utf-8').write(head + '// <auto>' + auto_first + '\n' + auto_body + '  // </auto>' + tail)
order = [m for m in re.findall(r"\{ id: '([a-zA-Z]+)'", open('src/data/catalog.ts', encoding='utf-8').read()) if m in eq_ids]
eq_src = re.sub(r'EQUIPMENT_WITH_IMG: EquipmentId\[\] = \[(.*?)\]', 'EQUIPMENT_WITH_IMG: EquipmentId[] = [' + ', '.join(f"'{i}'" for i in order) + ']', eq_src, flags=re.S)
open(eq_path, 'w', encoding='utf-8').write(eq_src)
subprocess.run(['npx', 'prettier', '--write', '--print-width', '200', '--single-quote', ill_path, eq_path], check=False, capture_output=True)
print('joylandi:', len(placed), ', '.join(placed))
if review:
    print('asosiy kadr almashdi — yorliq koordinatalarini qayta tekshiring:', ', '.join(review))
