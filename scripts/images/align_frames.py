# Kamerasi siljigan ikkinchi kadrni (B) asosiy kadrga (A) moslash: o'xshashlik o'zgarishi (+ ixtiyoriy gorizontal cho'zish k),
# faqat ikki kadrda ham qimirlamaydigan qismlar (ROI, rasm ulushida) bo'yicha. Qo'pol qidiruv FFT bilan, so'ng nozik sozlash.
# Ishlatish: python3 -I scripts/images/align_frames.py <A> <B> <chiqish.png> "x0,y0,x1,y1;..." [--s=0.85,1.2] [--a=3] [--k=0.1] [--tm=0.2] [--mirror]
import sys
import numpy as np
from PIL import Image

ref_p, mov_p, out_p, roi = sys.argv[1:5]
opt = {a.split('=')[0][2:]: a.split('=')[1] for a in sys.argv[5:] if '=' in a}
smin, smax = map(float, opt.get('s', '0.85,1.2').split(','))
amax = float(opt.get('a', '3'))
kmax = float(opt.get('k', '0'))
TM = float(opt.get('tm', '0.2'))
ROIS = [tuple(map(float, r.split(','))) for r in roi.split(';')]
R = Image.open(ref_p).convert('RGB')
M = Image.open(mov_p).convert('RGB')
if '--mirror' in sys.argv:
    M = M.transpose(Image.FLIP_LEFT_RIGHT)
N = R.size[0]


def gray(im, n):
    return np.asarray(im.resize((n, n), Image.LANCZOS).convert('L')).astype(np.float64) / 255


def sample(img, xs, ys):
    h, w = img.shape
    ok = (xs >= 0) & (ys >= 0) & (xs <= w - 1.001) & (ys <= h - 1.001)
    xs = np.clip(xs, 0, w - 1.001); ys = np.clip(ys, 0, h - 1.001)
    xi = xs.astype(int); yi = ys.astype(int); fx = xs - xi; fy = ys - yi
    v = (img[yi, xi] * (1 - fx) * (1 - fy) + img[yi, xi + 1] * fx * (1 - fy) + img[yi + 1, xi] * (1 - fx) * fy + img[yi + 1, xi + 1] * fx * fy)
    return v, ok


def inv_map(xs, ys, p, n):
    s, a, k, tx, ty = p
    c = n / 2
    th = np.deg2rad(a)
    dx, dy = xs - c - tx * n, ys - c - ty * n
    rx = np.cos(th) * dx + np.sin(th) * dy
    ry = -np.sin(th) * dx + np.cos(th) * dy
    return rx / (s * (1 + k)) + c, ry / s + c


def mask(n):
    m = np.zeros((n, n))
    for x0, y0, x1, y1 in ROIS:
        m[int(y0 * n):int(y1 * n), int(x0 * n):int(x1 * n)] = 1
    return m


def cost(rg, mg, m, p, n):
    ys, xs = np.nonzero(m)
    mx, my = inv_map(xs.astype(float), ys.astype(float), p, n)
    v, _ = sample(mg, mx, my)
    return float(np.mean((v - rg[ys, xs]) ** 2))


# 1) qo'pol: har (s, a, k) uchun siljish FFT bilan
n = 128
rg, mg, m = gray(R, n), gray(M, n), mask(n)
F = np.fft.rfft2
I = np.fft.irfft2
P = 2 * n
yy, xx = np.mgrid[0:n, 0:n].astype(float)
Fm = F(m, (P, P)); Frm = F(m * rg, (P, P))
const = np.sum(m * rg ** 2)
tmax = int(TM * n)
best = (1e9, None)
for s in np.arange(smin, smax + 1e-6, 0.02):
    for a in (np.arange(-amax, amax + 1e-6, 1.0) if amax else [0.0]):
        for k in (np.arange(-kmax, kmax + 1e-6, 0.05) if kmax else [0.0]):
            mx, my = inv_map(xx, yy, (s, a, k, 0, 0), n)
            W, ok = sample(mg, mx, my)
            W = W * ok
            # SSD(t) = sum m(x) W(x-t)^2 - 2 sum m R W(x-t) + const ;  sum_x g(x) W(x-t) = corr
            c1 = I(Fm * np.conj(F(W ** 2, (P, P))), (P, P))
            c2 = I(Frm * np.conj(F(W, (P, P))), (P, P))
            ssd = c1 - 2 * c2 + const  # index t (mod P)
            for ty in range(-tmax, tmax + 1):
                row = ssd[ty % P]
                idx = np.array([tx % P for tx in range(-tmax, tmax + 1)])
                j = int(np.argmin(row[idx]))
                if row[idx][j] < best[0]:
                    best = (row[idx][j], (s, a, k, (j - tmax) / n, ty / n))
p = list(best[1])
# 2) nozik: koordinatali tushish
for n, steps in ((256, (0.01, 0.4, 0.02, 1 / 256, 1 / 256)), (512, (0.004, 0.15, 0.008, 1 / 512, 1 / 512)), (1024, (0.002, 0.06, 0.004, 0.5 / 1024, 0.5 / 1024))):
    rg, mg, m = gray(R, n), gray(M, n), mask(n)
    cur = cost(rg, mg, m, p, n)
    for _ in range(40):
        improved = False
        for i, st in enumerate(steps):
            if (i == 1 and not amax) or (i == 2 and not kmax):
                continue
            for d in (-1, 1):
                q = p.copy(); q[i] += d * st
                c = cost(rg, mg, m, q, n)
                if c < cur:
                    cur, p, improved = c, q, True
        if not improved:
            break
s, a, k, tx, ty = p
c0 = cost(gray(R, 1024), gray(M, 1024), mask(1024), (1, 0, 0, 0, 0), 1024)
print(f'{mov_p.split("/")[-2]}: s={s:.3f} k={k:+.3f} a={a:+.2f} tx={tx*N:+.0f}px ty={ty*N:+.0f}px  xato {c0:.5f} -> {cur:.5f}')
# to'liq o'lchamda (chetlar takrorlanadi)
PAD = 300
Mp = Image.fromarray(np.pad(np.asarray(M), ((PAD, PAD), (PAD, PAD), (0, 0)), mode='edge'))
c = N / 2
th = np.deg2rad(a)
sx, sy = s * (1 + k), s
A_, B_ = np.cos(th) / sx, np.sin(th) / sx
D_, E_ = -np.sin(th) / sy, np.cos(th) / sy
cx, cy = c + tx * N, c + ty * N
data = (A_, B_, -A_ * cx - B_ * cy + c + PAD, D_, E_, -D_ * cx - E_ * cy + c + PAD)
Mp.transform((N, N), Image.AFFINE, data, resample=Image.BICUBIC).save(out_p)
