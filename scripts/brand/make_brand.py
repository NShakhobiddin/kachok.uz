"""GYMbos brand assets generator.

Builds logo SVGs with text converted to outlines (no font dependency),
PNG exports, PWA/favicon icons, and a TS data module for the in-app logo.
Ishlatish: docs/BRAND.md → "Qayta yasash"
"""
import io
import json
import os
import sys

import cairosvg
import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = sys.argv[1]
PUB = os.path.join(REPO, 'public')
BRAND = os.path.join(PUB, 'brand')
os.makedirs(BRAND, exist_ok=True)

FS = next(p for p in (os.path.join(REPO, 'node_modules', '@fontsource'), os.path.join(HERE, 'node_modules', '@fontsource')) if os.path.isdir(p))
BS900 = os.path.join(FS, 'big-shoulders-display', 'files', 'big-shoulders-display-latin-900-normal.woff2')
BS700 = os.path.join(FS, 'big-shoulders-display', 'files', 'big-shoulders-display-latin-700-normal.woff2')
MR600 = os.path.join(FS, 'manrope', 'files', 'manrope-latin-600-normal.woff2')

LIME = '#D4FA50'
LIME_DEPTH = '#9DB93B'
LIME_HI = '#E7FC9F'
INK = '#0B0B0C'
CHALK = '#F2F2EE'
GREY = '#8A8F87'


def num(v):
    s = f'{v:.1f}'
    if s.endswith('.0'):
        s = s[:-2]
    return '0' if s == '-0' else s


class Face:
    def __init__(self, path):
        t = TTFont(path)
        t.flavor = None
        buf = io.BytesIO()
        t.save(buf)
        data = buf.getvalue()
        self.tt = TTFont(io.BytesIO(data))
        self.gs = self.tt.getGlyphSet()
        self.order = self.tt.getGlyphOrder()
        self.upm = self.tt['head'].unitsPerEm
        os2 = self.tt['OS/2']
        self.cap = os2.sCapHeight
        self.xh = os2.sxHeight
        self.hb = hb.Font(hb.Face(hb.Blob(data)))

    def shape(self, text):
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        hb.shape(self.hb, buf, {'kern': True, 'liga': False})
        return [(self.order[i.codepoint], p.x_advance, p.x_offset, p.y_offset)
                for i, p in zip(buf.glyph_infos, buf.glyph_positions)]

    def glyphs(self, text, size, x, baseline, tracking=0.0):
        """Per-glyph outlines: list of dicts with d, bbox, origin; plus end x."""
        s = size / self.upm
        cur = 0.0
        out = []
        for name, adv, xo, yo in self.shape(text):
            tr = (s, 0, 0, -s, x + (cur + xo) * s, baseline - yo * s)
            pen = SVGPathPen(self.gs, ntos=num)
            bp = BoundsPen(self.gs)
            self.gs[name].draw(TransformPen(pen, tr))
            self.gs[name].draw(TransformPen(bp, tr))
            out.append({'name': name, 'd': pen.getCommands(), 'bbox': bp.bounds, 'x': x + cur * s})
            cur += adv + tracking * self.upm
        return out, x + (cur - tracking * self.upm) * s

    def text(self, text, size, x, baseline, tracking=0.0):
        gl, end = self.glyphs(text, size, x, baseline, tracking)
        d = ''.join(g['d'] for g in gl)
        bbs = [g['bbox'] for g in gl if g['bbox']]
        bbox = (min(b[0] for b in bbs), min(b[1] for b in bbs), max(b[2] for b in bbs), max(b[3] for b in bbs))
        return d, bbox, end


F900 = Face(BS900)
F700 = Face(BS700)
FMR = Face(MR600)

VARIANTS = {
    # name: pill, depth, highlight, ink (bars + GYM), bos
    'dark': (LIME, LIME_DEPTH, LIME_HI, INK, CHALK),
    'light': (LIME, LIME_DEPTH, LIME_HI, INK, INK),
    'on-lime': (INK, '#3A4A12', '#232324', LIME, INK),
    'mono': (CHALK, '#A9AAA4', '#FAFAF8', INK, CHALK),
}


def place_text(face, text, size, ink_left, baseline, tracking=0.0):
    """Draw text so that its ink starts exactly at ink_left."""
    _, bb, _ = face.text(text, size, 0, baseline, tracking)
    d, bb2, end = face.text(text, size, ink_left - bb[0], baseline, tracking)
    return d, bb2


def lockup_geometry(S=168):
    k = S / 168
    g = {
        'S': S,
        'H': 196 * k,
        'P': 40 * k,
        'barW': 10 * k,
        'outerH': 64 * k,
        'innerH': 108 * k,
        'barGap': 8 * k,
        'textGap': 18 * k,
        'depth': 8 * k,
        'hi': 3 * k,
        'lockGap': 18 * k,
    }
    H = g['H']
    baseline = H / 2 + (F900.cap * S / F900.upm) / 2
    x = g['P']
    bars = []
    bars.append((x, g['outerH']))
    x += g['barW'] + g['barGap']
    bars.append((x, g['innerH']))
    x += g['barW'] + g['textGap']
    gym_d, gym_bb = place_text(F900, 'GYM', S, x, baseline, 0.01)
    x = gym_bb[2] + g['textGap']
    bars.append((x, g['innerH']))
    x += g['barW'] + g['barGap']
    bars.append((x, g['outerH']))
    x += g['barW'] + g['P']
    pill_w = x
    bos_d, bos_bb = place_text(F700, 'bos', S, pill_w + g['lockGap'], baseline, 0.01)
    g.update({
        'baseline': baseline,
        'bars': [(bx, H / 2 - bh / 2, g['barW'], bh) for bx, bh in bars],
        'gym': gym_d,
        'bos': bos_d,
        'pillW': pill_w,
        'W': bos_bb[2],
        'Htot': H + g['depth'],
    })
    return g


def lockup_elements(g, variant='dark', clip_id='gbPill', ox=0.0, oy=0.0):
    pill, depth, hi, ink, bos = VARIANTS[variant]
    H, pw = g['H'], g['pillW']
    r = H / 2
    e = []
    e.append(f'<g transform="translate({num(ox)} {num(oy)})">')
    e.append(f'<defs><clipPath id="{clip_id}"><rect width="{num(pw)}" height="{num(H)}" rx="{num(r)}"/></clipPath></defs>')
    e.append(f'<rect y="{num(g["depth"])}" width="{num(pw)}" height="{num(H)}" rx="{num(r)}" fill="{depth}"/>')
    e.append(f'<g clip-path="url(#{clip_id})"><rect width="{num(pw)}" height="{num(H)}" fill="{hi}"/>'
             f'<rect y="{num(g["hi"])}" width="{num(pw)}" height="{num(H)}" rx="{num(r)}" fill="{pill}"/></g>')
    for bx, by, bw, bh in g['bars']:
        e.append(f'<rect x="{num(bx)}" y="{num(by)}" width="{num(bw)}" height="{num(bh)}" rx="{num(bw / 2)}" fill="{ink}"/>')
    e.append(f'<path d="{g["gym"]}" fill="{ink}"/>')
    e.append(f'<path d="{g["bos"]}" fill="{bos}"/>')
    e.append('</g>')
    return '\n'.join(e)


def svg_doc(w, h, body, title='GYMbos', bg=None):
    bgrect = f'<rect width="{num(w)}" height="{num(h)}" fill="{bg}"/>\n' if bg else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {num(w)} {num(h)}" width="{num(w)}" height="{num(h)}" role="img" aria-label="{title}">\n'
            f'<title>{title}</title>\n{bgrect}{body}\n</svg>\n')


def write(path, text):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)


def png(svg_text, path, width=None, height=None):
    cairosvg.svg2png(bytestring=svg_text.encode('utf-8'), write_to=path, output_width=width, output_height=height)


# ---------- 1. Asosiy logo va variantlar ----------
G = lockup_geometry(168)
for variant, fname in [('dark', 'gymbos-logo'), ('light', 'gymbos-logo-light'), ('on-lime', 'gymbos-logo-on-lime'), ('mono', 'gymbos-logo-mono')]:
    s = svg_doc(G['W'], G['Htot'], lockup_elements(G, variant))
    write(os.path.join(BRAND, fname + '.svg'), s)
    png(s, os.path.join(BRAND, fname + '.png'), width=1600)

# ---------- 2. Wordmark ----------
S = 260
wb = S * F900.cap / F900.upm  # baseline = cap height (top of caps at y=0)
gym_d, gym_bb, gym_end = F900.text('GYM', S, 0, wb, 0.01)
shift = -gym_bb[0]
gym_d, gym_bb, gym_end = F900.text('GYM', S, shift, wb, 0.01)
gl, _ = F700.glyphs('bos', S, gym_end + 0.04 * S, wb, 0.01)
parts = [f'<path d="{gym_d}" fill="{LIME}"/>']
right = gym_bb[2]
for gdat in gl:
    if gdat['name'] == 'o':
        x0, y0, x1, y1 = gdat['bbox']
        w, h = x1 - x0, y1 - y0
        inset = 0.13 * w
        ring = 0.016 * S
        parts.append(f'<rect x="{num(x0)}" y="{num(y0)}" width="{num(w)}" height="{num(h)}" rx="{num(w / 2)}" fill="{LIME}"/>')
        parts.append(f'<rect x="{num(x0 + inset)}" y="{num(y0 + inset)}" width="{num(w - 2 * inset)}" height="{num(h - 2 * inset)}" '
                     f'rx="{num((w - 2 * inset) / 2)}" fill="none" stroke="{INK}" stroke-opacity="0.38" stroke-width="{num(ring)}"/>')
    else:
        parts.append(f'<path d="{gdat["d"]}" fill="{CHALK}"/>')
    if gdat['bbox']:
        right = max(right, gdat['bbox'][2])
top = min([gym_bb[1]] + [g_['bbox'][1] for g_ in gl if g_['bbox']])
bottom = max([gym_bb[3]] + [g_['bbox'][3] for g_ in gl if g_['bbox']])
wm = svg_doc(right, bottom - top, f'<g transform="translate(0 {num(-top)})">\n' + '\n'.join(parts) + '\n</g>')
write(os.path.join(BRAND, 'gymbos-wordmark.svg'), wm)
png(wm, os.path.join(BRAND, 'gymbos-wordmark.png'), width=1600)

# ---------- 3. Logo + shior ----------
GT = lockup_geometry(128)
slogan = 'GAPIRMA — BOS.'
ss = 20
cap_mr = ss * FMR.cap / FMR.upm
gap = 48
sl_base = GT['Htot'] + gap + cap_mr
sl_d, sl_bb, _ = FMR.text(slogan, ss, 0, sl_base, 0.32)
tag_w = max(GT['W'], sl_bb[2] - sl_bb[0])
lock_x = (tag_w - GT['W']) / 2
sl_d, sl_bb, _ = FMR.text(slogan, ss, (tag_w - (sl_bb[2] - sl_bb[0])) / 2 - sl_bb[0], sl_base, 0.32)
tag_h = sl_bb[3]


def tagline_body(ox=0.0, oy=0.0, slogan_color=GREY, variant='dark'):
    return (f'<g transform="translate({num(ox)} {num(oy)})">\n'
            + lockup_elements(GT, variant, clip_id='gbPillT', ox=lock_x)
            + f'\n<path d="{sl_d}" fill="{slogan_color}"/>\n</g>')


tg = svg_doc(tag_w, tag_h, tagline_body(), title='GYMbos — Gapirma, bos.')
write(os.path.join(BRAND, 'gymbos-logo-shior.svg'), tg)
png(tg, os.path.join(BRAND, 'gymbos-logo-shior.png'), width=1600)

# Ijtimoiy tarmoq muqovasi 1200x630
cw, ch = 1200, 630
cover = svg_doc(cw, ch, tagline_body((cw - tag_w) / 2, (ch - tag_h) / 2), title='GYMbos', bg=INK)
png(cover, os.path.join(BRAND, 'gymbos-cover-1200x630.png'), width=cw, height=ch)

# ---------- 4. Ikonkalar ----------
def mark_simple(pill=LIME, depth=LIME_DEPTH, ink=INK):
    return (
        f'<rect x="96" y="208" width="320" height="120" rx="60" fill="{depth}"/>'
        f'<rect x="96" y="196" width="320" height="120" rx="60" fill="{pill}"/>'
        f'<g fill="{ink}"><rect x="132" y="246" width="248" height="20" rx="10"/>'
        f'<rect x="160" y="212" width="36" height="88" rx="9"/><rect x="316" y="212" width="36" height="88" rx="9"/></g>'
    )


MARK_SIMPLE = mark_simple()
MARK_DETAILED = (
    f'<rect x="96" y="206" width="320" height="120" rx="60" fill="{LIME_DEPTH}"/>'
    f'<rect x="96" y="196" width="320" height="120" rx="60" fill="{LIME}"/>'
    f'<g fill="{INK}"><rect x="138" y="251" width="236" height="10" rx="5"/>'
    f'<rect x="152" y="232" width="14" height="48" rx="4"/><rect x="170" y="218" width="22" height="76" rx="5"/>'
    f'<rect x="320" y="218" width="22" height="76" rx="5"/><rect x="346" y="232" width="14" height="48" rx="4"/></g>'
)
GLOW = (f'<defs><filter id="gbGlow" x="-40%" y="-80%" width="180%" height="260%"><feGaussianBlur stdDeviation="20"/></filter></defs>'
        f'<rect x="116" y="244" width="280" height="100" rx="50" fill="{LIME}" opacity="0.5" filter="url(#gbGlow)"/>')


def icon(mark, bg='rounded', scale=1.0, glow=False, bg_color=INK):
    if bg == 'rounded':
        b = f'<rect width="512" height="512" rx="114" fill="{bg_color}"/>'
    elif bg == 'full':
        b = f'<rect width="512" height="512" fill="{bg_color}"/>'
    elif bg == 'circle':
        b = f'<circle cx="256" cy="256" r="256" fill="{bg_color}"/>'
    else:
        b = ''
    inner = (GLOW if glow else '') + mark
    if scale != 1.0:
        t = 256 * (1 - scale)
        inner = f'<g transform="translate({num(t)} {num(t)}) scale({scale})">{inner}</g>'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img" aria-label="GYMbos">'
            f'<title>GYMbos</title>{b}{inner}</svg>\n')


app_icon = icon(MARK_SIMPLE, 'rounded')
# brauzer yorlig'idagi 16–32 px favicon: belgi kattaroq, aks holda ko'rinmay qoladi
write(os.path.join(PUB, 'icon.svg'), icon(MARK_SIMPLE, 'rounded', scale=1.3))
png(app_icon, os.path.join(PUB, 'icon-192.png'), 192, 192)
png(app_icon, os.path.join(PUB, 'icon-512.png'), 512, 512)
png(icon(MARK_SIMPLE, 'full', scale=0.86), os.path.join(PUB, 'icon-maskable-512.png'), 512, 512)
png(icon(MARK_SIMPLE, 'full'), os.path.join(PUB, 'apple-touch-icon.png'), 180, 180)
png(icon(MARK_SIMPLE, 'full'), os.path.join(BRAND, 'gymbos-telegram-avatar.png'), 640, 640)
write(os.path.join(BRAND, 'gymbos-icon.svg'), icon(MARK_DETAILED, 'rounded', glow=True))
png(icon(MARK_DETAILED, 'rounded'), os.path.join(BRAND, 'gymbos-icon-1024.png'), 1024, 1024)

# ---------- 6. Telegram bot ----------
TGD = os.path.join(BRAND, 'telegram')
os.makedirs(TGD, exist_ok=True)

# Profil rasmi 640x640 (Telegram o'zi aylana qiladi). Laym varianti qora mavzuli chatlar ro'yxatida yaxshi ajralib turadi.
png(icon(MARK_SIMPLE, 'full'), os.path.join(TGD, 'bot-avatar-qora-640.png'), 640, 640)
png(icon(mark_simple(INK, '#3A4A12', LIME), 'full', bg_color=LIME), os.path.join(TGD, 'bot-avatar-laym-640.png'), 640, 640)


def centered_text(face, text, size, cx, baseline, tracking=0.0):
    _, bb, _ = face.text(text, size, 0, baseline, tracking)
    w = bb[2] - bb[0]
    d, bb2, _ = face.text(text, size, cx - w / 2 - bb[0], baseline, tracking)
    return d, bb2


# Tavsif rasmi 640x360 — botni hali boshlamagan odam bo'sh chatda ko'radi (BotFather: /setdescriptionpic)
gd = lockup_geometry(100)
sl_size = 14
sl_cap = sl_size * FMR.cap / FMR.upm
gap = 30
oy = (360 - (gd['Htot'] + gap + sl_cap)) / 2
sl_d, _ = centered_text(FMR, slogan, sl_size, 320, oy + gd['Htot'] + gap + sl_cap, 0.32)
desc = svg_doc(640, 360, lockup_elements(gd, 'dark', 'gbPillD', (640 - gd['W']) / 2, oy) + f'\n<path d="{sl_d}" fill="{GREY}"/>', bg=INK)
png(desc, os.path.join(TGD, 'tavsif-640x360.png'), 640, 360)

# /start xabari rasmi 1280x720 — bot birinchi xabarda "Ilovani ochish" tugmasi bilan yuboradi
gs_ = lockup_geometry(150)
sub = 'Zalda yoningizdagi aqlli murabbiy'
sub_size = 34
sub_cap = sub_size * FMR.cap / FMR.upm
chips = ['Dastur', 'Texnika', 'Ovqatlanish', 'Natijalar']
ch_size, ch_h, ch_pad, ch_gap = 24, 56, 28, 14
ch_cap = ch_size * FMR.cap / FMR.upm
widths = []
for c in chips:
    _, bb, _ = FMR.text(c, ch_size, 0, 0)
    widths.append(bb[2] - bb[0] + 2 * ch_pad)
row_w = sum(widths) + ch_gap * (len(chips) - 1)
g1, g2 = 52, 44
total = gs_['Htot'] + g1 + sub_cap + g2 + ch_h
oy = (720 - total) / 2
body = [lockup_elements(gs_, 'dark', 'gbPillS', (1280 - gs_['W']) / 2, oy)]
sub_base = oy + gs_['Htot'] + g1 + sub_cap
sd, _ = centered_text(FMR, sub, sub_size, 640, sub_base)
body.append(f'<path d="{sd}" fill="{CHALK}"/>')
cy0 = sub_base + g2
x = (1280 - row_w) / 2
for c, w in zip(chips, widths):
    body.append(f'<rect x="{num(x)}" y="{num(cy0)}" width="{num(w)}" height="{ch_h}" rx="{ch_h / 2}" fill="#18181A" stroke="#2C2C31" stroke-width="2"/>')
    cd, _ = centered_text(FMR, c, ch_size, x + w / 2, cy0 + ch_h / 2 + ch_cap / 2)
    body.append(f'<path d="{cd}" fill="#ABAEA6"/>')
    x += w + ch_gap
start = svg_doc(1280, 720, '\n'.join(body), bg=INK)
png(start, os.path.join(TGD, 'start-1280x720.png'), 1280, 720)

# ---------- 5. Ilova ichidagi logo uchun ma'lumot ----------
ts = f"""// Avtomatik yasalgan: GYMbos logosi (asosiy variant) — harflar konturga aylantirilgan, shrift kerak emas.
// Manba: Big Shoulders Display 900 (GYM) va 700 (bos). Qayta yasash: docs/BRAND.md
export const BRAND_LOGO = {{
  width: {num(G['W'])},
  height: {num(G['Htot'])},
  pillWidth: {num(G['pillW'])},
  pillHeight: {num(G['H'])},
  depth: {num(G['depth'])},
  highlight: {num(G['hi'])},
  bars: {json.dumps([[float(num(v)) for v in b] for b in G['bars']])} as [number, number, number, number][],
  gym: '{G['gym']}',
  bos: '{G['bos']}',
}} as const;
"""
write(os.path.join(REPO, 'src', 'components', 'brandLogo.data.ts'), ts)

print('lockup', num(G['W']), 'x', num(G['Htot']), 'pill', num(G['pillW']))
print('wordmark', num(right), 'x', num(bottom - top))
print('tagline', num(tag_w), 'x', num(tag_h))
