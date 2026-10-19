// Haftalik dasturni PDF ga eksport qilish (zalga chop etib olib borish uchun).
import { EXERCISE_MAP } from '../data/exercises';
import { GROUPS, GROUP_ORDER, WEEKLY_TARGET } from '../data/catalog';
import { DAYS, fmtDate } from '../lib/date';
import type { Profile, Program } from '../types';
import { mealPlan, nutritionPlan } from './nutrition';
import { programWeek, weeklyVolume } from './program';

/** Standart PDF shriftlari Latin-1 bilan ishlaydi — maxsus belgilarni almashtiramiz */
export function pdfText(s: string): string {
  return s
    .replace(/[‘’ʻʼ`]/g, "'")
    .replace(/[«»“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/×/g, 'x')
    .replace(/≈/g, '~')
    .replace(/…/g, '...')
    .replace(/•/g, '-')
    .replace(/[^\x20-\x7E\xA0-\xFF\n]/g, '');
}

const GOALS: Record<Profile['goal'], string> = {
  fatLoss: 'Ozish (yog‘ yoqish)',
  muscle: 'Mushak massasi',
  strength: 'Kuch',
  recomp: 'Rekompozitsiya',
  health: 'Sog‘liq va tonus',
};

type RGB = [number, number, number];
const INK: RGB = [11, 14, 18];
const BLUE: RGB = [58, 116, 255];
const RED: RGB = [229, 57, 46];
const YELLOW: RGB = [245, 192, 51];
const GREEN: RGB = [37, 165, 101];
const MUTED: RGB = [110, 120, 135];

export async function exportProgramPdf(program: Program, profile: Profile, kcalAdjust = 0): Promise<void> {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 14;
  const T = (s: string) => pdfText(s);
  const week = programWeek(program) + 1;
  const meso = ((week - 1) % program.mesoWeeks) + 1;

  // Sarlavha
  doc.setFillColor(...INK);
  doc.rect(0, 0, W, 46, 'F');
  [RED, BLUE, YELLOW, GREEN].forEach((c, i) => {
    doc.setFillColor(...c);
    doc.rect(M + i * 9, 10, 7, 7, 'F');
  });
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('KACHOK', M + 40, 17);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(T('Haftalik mashq dasturi'), M, 28);
  doc.setFontSize(9);
  doc.setTextColor(190, 198, 208);
  doc.text(
    T(`${profile.name || 'Sportchi'} · ${GOALS[profile.goal]} · ${program.split} · ${week}-hafta (blok: ${meso}/${program.mesoWeeks})`),
    M,
    35,
  );
  doc.text(T(`Tuzilgan: ${fmtDate(new Date(), true)} · kachok.uz`), M, 40.5);

  let y = 54;
  doc.setTextColor(...INK);
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  const intro = doc.splitTextToSize(
    T(
      "Har bir setdan keyin vazn va takrorni katakka yozing (masalan 60x10). RIR — setdan keyin yana necha marta qila olishingiz. Barcha setlarda yuqori takrorga yetsangiz, keyingi safar vaznni oshiring.",
    ),
    W - 2 * M,
  );
  doc.text(intro, M, y);
  y += intro.length * 4 + 3;

  const days = [...program.days].sort((a, b) => a.weekday - b.weekday);
  for (const d of days) {
    const maxSets = Math.max(3, ...d.exercises.map((e) => e.sets));
    const setCols = Array.from({ length: Math.min(5, maxSets) }, (_, i) => String(i + 1));
    if (y > H - 60) {
      doc.addPage();
      y = M;
    }
    doc.setFillColor(...BLUE);
    doc.rect(M, y, 2.2, 9, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...INK);
    doc.text(T(`${DAYS[d.weekday]} — ${d.title}`), M + 5, y + 4.2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);
    doc.text(T(`${d.focus} · ~${d.estMin} daqiqa · razminka 5–8 daqiqa`), M + 5, y + 8.6);
    y += 11;
    autoTable(doc, {
      startY: y,
      margin: { left: M, right: M },
      head: [['#', 'Mashq', 'Set x takror', 'RIR', 'Dam', ...setCols]],
      body: d.exercises.map((pe, i) => {
        const ex = EXERCISE_MAP[pe.exerciseId];
        return [
          String(i + 1),
          T(`${ex?.name ?? pe.exerciseId}\n${ex?.en ?? ''}`),
          T(`${pe.sets} x ${pe.repMin}-${pe.repMax}${ex?.timed ? ' s' : ''}`),
          String(pe.rir),
          `${Math.round(pe.restSec / 60 * 10) / 10}'`,
          ...setCols.map((_, k) => (k < pe.sets ? '' : '—')),
        ];
      }),
      theme: 'grid',
      styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 1.8, lineColor: [220, 224, 230], lineWidth: 0.2, textColor: INK, valign: 'middle' },
      headStyles: { fillColor: INK, textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 7, halign: 'center' },
        1: { cellWidth: 62 },
        2: { cellWidth: 22, halign: 'center' },
        3: { cellWidth: 10, halign: 'center' },
        4: { cellWidth: 11, halign: 'center' },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 1) data.cell.styles.fontStyle = 'bold';
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // Haftalik hajm
  doc.addPage();
  y = M;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...INK);
  doc.text(T('Haftalik hajm (mushak guruhlari bo‘yicha)'), M, y + 4);
  y += 8;
  const vol = weeklyVolume(program);
  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M },
    head: [['Mushak guruhi', 'Setlar / hafta', 'Tavsiya', 'Holat']],
    body: GROUP_ORDER.map((g) => {
      const v = Math.round(vol[g] * 10) / 10;
      const [lo, hi] = WEEKLY_TARGET[g];
      const st = v < lo * 0.7 ? 'Kam' : v > hi ? 'Ko‘p' : 'Me’yorda';
      return [T(GROUPS[g].name), String(v), `${lo}-${hi}`, T(st)];
    }),
    theme: 'striped',
    styles: { fontSize: 9, textColor: INK },
    headStyles: { fillColor: BLUE },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 10;

  // Ovqatlanish
  const np = nutritionPlan(profile, kcalAdjust);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(T('Kunlik ovqatlanish'), M, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(T(`${np.kcal} kkal · oqsil ${np.protein} g · yog' ${np.fat} g · uglevod ${np.carbs} g · tola ${np.fiber}+ g · suv ${np.waterL} L (+${np.waterTrainingL} L mashq kuni)`), M, y);
  y += 4;
  const meals = mealPlan(np, profile.dietPrefs);
  autoTable(doc, {
    startY: y + 2,
    margin: { left: M, right: M },
    head: [['Mahal', 'Mahsulotlar', 'kkal', 'O / Y / U']],
    body: meals.map((m) => [T(`${m.name}\n${m.time}`), T(m.items.map((i) => `${i.food.name} — ${i.label}`).join('\n')), String(m.kcal), `${m.p} / ${m.f} / ${m.c}`]),
    theme: 'grid',
    styles: { fontSize: 8.5, textColor: INK, lineColor: [220, 224, 230], lineWidth: 0.2 },
    headStyles: { fillColor: GREEN },
    columnStyles: { 0: { cellWidth: 32, fontStyle: 'bold' }, 2: { cellWidth: 14, halign: 'center' }, 3: { cellWidth: 24, halign: 'center' } },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 10;

  // Qoidalar
  if (y > H - 70) {
    doc.addPage();
    y = M;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(T('Asosiy qoidalar'), M, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  const rules = [
    'Razminka: 5 daqiqa yengil kardio + birinchi mashqda 2–3 ta yengil isinish seti (40%, 60%, 80%).',
    'Progressiya: barcha setlarda yuqori takrorga yetsangiz — keyingi safar vaznni 2.5–5% oshiring.',
    'RIR 2 — setni yana 2 marta qila oladigan holatda tugatish. Har setni "muvaffaqiyatsizlik"gacha olib borish shart emas.',
    `Har ${program.mesoWeeks}-haftada yengillashtirish (deload): setlar ~40% kam, vazn ~10% yengil.`,
    'O‘tkir og‘riq — darhol to‘xtang. Mushak charchog‘i normal, bo‘g‘imdagi og‘riq normal emas.',
    'Uyqu 7–9 soat, oqsil har mahalda ~0.4 g/kg — mushak dam olishda o‘sadi.',
  ];
  for (const r of rules) {
    const lines = doc.splitTextToSize(T('• ' + r), W - 2 * M);
    doc.text(lines, M, y);
    y += lines.length * 4.6 + 1;
  }

  // Altbilgi
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(T(`kachok.uz · ${i}/${pages} · Tavsiyalar ACSM 2026, ISSN, WHO 2020 manbalariga asoslangan. Tibbiy maslahat o‘rnini bosmaydi.`), M, H - 7);
  }

  const name = `kachok-dastur-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(name);
}
