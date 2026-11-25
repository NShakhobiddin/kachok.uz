// Ulashish kartochkasi (rasm, 1080×1350): mashg'ulot yoki hafta natijasi — Telegram, Instagram va boshqa joylarga yuborish uchun.
// Brauzerning canvas'ida chiziladi: server kerak emas.

export interface CardRow {
  name: string;
  value: string;
  /** lime belgi (rekord, o'sish) */
  hot?: boolean;
}

export type CardData =
  | {
      kind: 'workout';
      title: string;
      date: string;
      muscles: string;
      stats: [string, string][];
      rows: CardRow[];
      rowsTitle: string;
    }
  | {
      kind: 'week';
      label: string;
      done: number;
      planned: number;
      streak: number;
      stats: [string, string][];
      rows: CardRow[];
      rowsTitle: string;
    };

const W = 1080;
const H = 1350;
const PAD = 72;
const C = { bg: '#0b0b0c', surface: '#161618', line: '#2a2a2e', text: '#f4f4ef', text2: '#aeada5', text3: '#7d7c75', accent: '#d4fa50', ink: '#11150a' };
const DISPLAY = '"Uz Tutuq", "Archivo Variable", Arial, sans-serif';
const BODY = '"Uz Tutuq", "Manrope Variable", system-ui, sans-serif';

async function fontsReady() {
  try {
    await Promise.all([
      document.fonts.load(`800 80px ${DISPLAY}`, 'GYM‘'),
      document.fonts.load(`700 34px ${BODY}`, 'abc‘'),
      document.fonts.load(`500 30px ${BODY}`, 'abc‘'),
    ]);
  } catch {
    /* shrift yuklanmasa — tizim shrifti */
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** matnni kenglikka sig'dirish: so'zlar bo'yicha qatorlarga, oxirida "…" */
function lines(ctx: CanvasRenderingContext2D, text: string, maxW: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const out: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(next).width <= maxW) cur = next;
    else {
      if (cur) out.push(cur);
      cur = w;
    }
  }
  if (cur) out.push(cur);
  if (out.length > maxLines) {
    const keep = out.slice(0, maxLines);
    let last = keep[maxLines - 1];
    while (last.length > 1 && ctx.measureText(last + '…').width > maxW) last = last.slice(0, -1);
    keep[maxLines - 1] = last + '…';
    return keep;
  }
  return out;
}

function fit(ctx: CanvasRenderingContext2D, text: string, maxW: number): string {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + '…').width > maxW) t = t.slice(0, -1);
  return t + '…';
}

function logo(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.font = `900 44px ${DISPLAY}`;
  const gw = ctx.measureText('GYM').width;
  const h = 64;
  const w = gw + 56;
  ctx.fillStyle = C.accent;
  roundRect(ctx, x, y, w, h, h / 2);
  ctx.fill();
  // disklar
  ctx.fillStyle = C.ink;
  for (const [dx, hh] of [
    [12, 22],
    [19, 34],
  ] as const) {
    ctx.fillRect(x + dx, y + (h - hh) / 2, 4, hh);
    ctx.fillRect(x + w - dx - 4, y + (h - hh) / 2, 4, hh);
  }
  ctx.textBaseline = 'middle';
  ctx.fillText('GYM', x + 28, y + h / 2 + 2);
  ctx.fillStyle = C.text;
  ctx.font = `800 44px ${DISPLAY}`;
  ctx.fillText('bos', x + w + 10, y + h / 2 + 2);
  ctx.textBaseline = 'alphabetic';
}

function stats(ctx: CanvasRenderingContext2D, list: [string, string][], y: number, ch = 168): number {
  const gap = 18;
  const cols = 2;
  const cw = (W - PAD * 2 - gap) / cols;
  const big = ch >= 160 ? 68 : 58;
  list.slice(0, 4).forEach(([label, value], i) => {
    const x = PAD + (i % cols) * (cw + gap);
    const yy = y + Math.floor(i / cols) * (ch + gap);
    ctx.fillStyle = C.surface;
    roundRect(ctx, x, yy, cw, ch, 32);
    ctx.fill();
    ctx.fillStyle = C.text3;
    ctx.font = `700 26px ${BODY}`;
    ctx.fillText(label.toUpperCase(), x + 30, yy + 50);
    ctx.fillStyle = i === 3 && value !== '0' ? C.accent : C.text;
    let size = big;
    ctx.font = `800 ${size}px ${DISPLAY}`;
    while (size > 36 && ctx.measureText(value).width > cw - 60) ctx.font = `800 ${(size -= 4)}px ${DISPLAY}`;
    ctx.fillText(fit(ctx, value, cw - 60), x + 30, yy + ch - 34);
  });
  return y + Math.ceil(Math.min(4, list.length) / cols) * (ch + gap);
}

function rows(ctx: CanvasRenderingContext2D, title: string, list: CardRow[], y: number, maxY: number) {
  if (!list.length) return;
  ctx.fillStyle = C.text2;
  ctx.font = `800 30px ${BODY}`;
  ctx.fillText(title, PAD, y);
  let yy = y + 26;
  for (const r of list) {
    if (yy + 66 > maxY) break;
    ctx.strokeStyle = C.line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(PAD, yy);
    ctx.lineTo(W - PAD, yy);
    ctx.stroke();
    ctx.font = `800 36px ${DISPLAY}`;
    const vw = ctx.measureText(r.value).width;
    ctx.fillStyle = r.hot ? C.accent : C.text;
    ctx.fillText(r.value, W - PAD - vw, yy + 47);
    if (r.hot) {
      ctx.beginPath();
      ctx.arc(PAD + 9, yy + 35, 9, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = C.text;
    ctx.font = `600 34px ${BODY}`;
    ctx.fillText(fit(ctx, r.name, W - PAD * 2 - vw - 40 - (r.hot ? 30 : 0)), PAD + (r.hot ? 30 : 0), yy + 47);
    yy += 66;
  }
}

function footer(ctx: CanvasRenderingContext2D, url: string) {
  const y = H - PAD + 6;
  ctx.fillStyle = C.accent;
  ctx.fillRect(PAD, y - 50, 56, 6);
  ctx.fillStyle = C.text2;
  ctx.font = `600 27px ${BODY}`;
  const label = 'O‘zbekcha mashg‘ulot ilovasi';
  ctx.fillText(label, PAD, y);
  ctx.fillStyle = C.text3;
  ctx.font = `500 25px ${BODY}`;
  const u = fit(ctx, url.replace(/^https?:\/\//, '').replace(/\/$/, ''), W - PAD * 2 - ctx.measureText(label).width - 40);
  ctx.fillText(u, W - PAD - ctx.measureText(u).width, y);
}

export async function renderCard(d: CardData, url: string): Promise<Blob> {
  await fontsReady();
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d')!;
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);
  // yuqori o'ng burchakda lime nur
  const g = ctx.createRadialGradient(W - 120, 140, 10, W - 120, 140, 620);
  g.addColorStop(0, 'rgba(212, 250, 80, 0.22)');
  g.addColorStop(1, 'rgba(212, 250, 80, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  logo(ctx, PAD, PAD);
  let y = PAD + 150;

  if (d.kind === 'workout') {
    ctx.fillStyle = C.accent;
    ctx.font = `800 28px ${BODY}`;
    ctx.fillText(d.date.toUpperCase(), PAD, y);
    ctx.fillStyle = C.text;
    ctx.font = `900 92px ${DISPLAY}`;
    const tl = lines(ctx, d.title, W - PAD * 2, 2);
    tl.forEach((t, i) => ctx.fillText(t, PAD, y + 98 + i * 96));
    y += 98 + (tl.length - 1) * 96;
    if (d.muscles) {
      ctx.fillStyle = C.text2;
      ctx.font = `600 32px ${BODY}`;
      ctx.fillText(fit(ctx, d.muscles, W - PAD * 2), PAD, y + 56);
      y += 56;
    }
    y = stats(ctx, d.stats, y + 44);
  } else {
    ctx.fillStyle = C.accent;
    ctx.font = `800 28px ${BODY}`;
    ctx.fillText('HAFTALIK HISOBOT', PAD, y);
    ctx.fillStyle = C.text;
    ctx.font = `900 84px ${DISPLAY}`;
    ctx.fillText(fit(ctx, d.label, W - PAD * 2), PAD, y + 92);
    // halqa: reja bajarilishi
    const cx = PAD + 120;
    const cy = y + 236;
    const r = 88;
    ctx.lineWidth = 22;
    ctx.strokeStyle = C.surface;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    const part = d.planned ? Math.min(1, d.done / d.planned) : d.done ? 1 : 0;
    if (part > 0) {
      ctx.strokeStyle = C.accent;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * part);
      ctx.stroke();
      ctx.lineCap = 'butt';
    }
    ctx.fillStyle = C.text;
    ctx.font = `900 62px ${DISPLAY}`;
    ctx.textAlign = 'center';
    ctx.fillText(`${d.done}/${d.planned}`, cx, cy + 21);
    ctx.textAlign = 'left';
    ctx.fillStyle = C.text;
    ctx.font = `800 44px ${DISPLAY}`;
    ctx.fillText(d.done >= d.planned && d.planned > 0 ? 'Reja bajarildi!' : 'mashg‘ulot', cx + r + 50, cy - 10);
    ctx.fillStyle = C.text2;
    ctx.font = `600 32px ${BODY}`;
    ctx.fillText(d.streak > 1 ? `${d.streak} hafta ketma-ket` : 'Har hafta — bir qadam', cx + r + 50, cy + 40);
    y = stats(ctx, d.stats, cy + r + 44, 140);
  }
  rows(ctx, d.rowsTitle, d.rows, y + 36, H - PAD - 70);
  footer(ctx, url);
  return new Promise((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error('rasm yaratilmadi'))), 'image/png'));
}
