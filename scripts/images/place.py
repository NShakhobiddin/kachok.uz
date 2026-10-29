"""Tanlangan (tekshirilgan) rasmlarni ilovaga joylash.

Ishlatish: python3 scripts/images/place.py picks.json
picks.json: {"bench-press": "yo'l/variant.png", "barbell": "...", ...}
- mashq: public/illustrations/<id>.webp (1024 px), ro'yxatlar uchun thumb/<id>.webp (192 px) va src/data/illustrations.ts dagi <auto> blokiga yozuv;
- jihoz: public/illustrations/equipment/<id>.webp (512 px) va src/data/equipmentImages.ts ro'yxatiga id.
Qo'lda yorliq qo'yilgan mashqlar (blokdan tashqarida) o'zgartirilmaydi.
"""
import json
import re
import subprocess
import sys

import numpy as np
from PIL import Image


def thumb(im, pid):
    """Ro'yxatlar uchun 192 px kichik rasm: odam tanasi (qizil mushak + lime nur) atrofida kesiladi,
    shunda jihozning uzun ramasi yoki fon figurani maydalashtirib yubormaydi."""
    a = np.asarray(im).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    body = ((r > 80) & (r > g * 1.35) & (r > b * 1.3)) | ((g > 140) & (r > 110) & (b < 130) & (g > b * 1.6))
    ys, xs = np.where(body)
    x0, x1, y0, y1 = np.percentile(xs, 1), np.percentile(xs, 99), np.percentile(ys, 0.3), np.percentile(ys, 99.7)
    W, H = im.size
    side = min(W, max(max(x1 - x0, y1 - y0) * 1.32, W * 0.45))
    l = max(0, min(W - side, (x0 + x1 - side) / 2))
    t = max(0, min(H - side, (y0 + y1 - side) / 2))
    im.crop((int(l), int(t), int(l + side), int(t + side))).resize((192, 192), Image.LANCZOS).save(f'public/illustrations/thumb/{pid}.webp', 'WEBP', quality=80, method=6)


picks = json.load(open(sys.argv[1]))
jobs = {j['id']: j for j in json.load(open('scripts/images/prompts.json'))}

ill_path = 'src/data/illustrations.ts'
ill = open(ill_path, encoding='utf-8').read()
manual = set(re.findall(r"^  '?([a-z-]+)'?: \{\n    src:", ill.split('// <auto>')[0], re.M))
# blokdagi yozuvlar (bir qatorli yoki prettier bo'lib yozgan ko'p qatorli): id → (holat, alt)
auto = {m[0]: (m[1], m[2]) for m in re.findall(r"'?([a-z-]+)'?: \{\s*src: img\('[^']+'\),\s*phase: '([^']*)',\s*alt: '([^']*)',?\s*\}", ill.split('// <auto>')[1])}

eq_path = 'src/data/equipmentImages.ts'
eq_src = open(eq_path, encoding='utf-8').read()
eq_ids = set(re.findall(r"'([a-zA-Z]+)'", re.search(r'EQUIPMENT_WITH_IMG: EquipmentId\[\] = \[(.*?)\]', eq_src, re.S).group(1)))

for pid, val in picks.items():
    src, _, phase_override = val.partition('|')
    j = jobs[pid]
    im = Image.open(src).convert('RGB')
    if j['kind'] == 'exercise':
        im = im.resize((1024, 1024), Image.LANCZOS) if im.size != (1024, 1024) else im
        im.save(f"public/illustrations/{pid}.webp", 'WEBP', quality=80, method=6)
        thumb(im, pid)
        if pid in manual:
            continue
        name = j['title'].split(' (')[0].replace("'", '’')
        phase = phase_override or j['phase']
        alt = f"{name}, {phase.lower()}: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda"
        auto[pid] = (phase, alt)
    else:
        im.resize((512, 512), Image.LANCZOS).save(f"public/illustrations/equipment/{pid}.webp", 'WEBP', quality=80, method=6)
        eq_ids.add(pid)

head, rest = ill.split('// <auto>')
tail = rest.split('// </auto>')[1]
first_line = rest.split('\n')[0]
block = '// <auto>' + first_line + '\n' + ''.join(f"  '{k}': {{ src: img('{k}.webp'), phase: '{ph}', alt: '{alt}' }},\n" for k, (ph, alt) in sorted(auto.items())) + '  // </auto>'
open(ill_path, 'w', encoding='utf-8').write(head + block + tail)

order = [m for m in re.findall(r"\{ id: '([a-zA-Z]+)'", open('src/data/catalog.ts', encoding='utf-8').read()) if m in eq_ids]
eq_src = re.sub(r'EQUIPMENT_WITH_IMG: EquipmentId\[\] = \[(.*?)\]', 'EQUIPMENT_WITH_IMG: EquipmentId[] = [' + ', '.join(f"'{i}'" for i in order) + ']', eq_src, flags=re.S)
open(eq_path, 'w', encoding='utf-8').write(eq_src)
subprocess.run(['npx', 'prettier', '--write', '--print-width', '200', '--single-quote', ill_path, eq_path], check=True, capture_output=True)
print(f"mashq: {len(auto)} (+qo'lda {len(manual)}), jihoz: {len(order)}")
