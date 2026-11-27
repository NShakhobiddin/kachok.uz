// Saytdagi rasm va 3D bo‘limlari uchun mashqlar ro‘yxati (yagona manba):
//  • SHOWCASE — «3D anatomiya» bo‘limi: ikki kadrli harakat rasmi + 3D model, EMG bo‘yicha mushaklar yonadi
//  • GALLERY — aylanuvchi rasm lentasi. Rasmlar site/public/gallery/ da (400 px):
//    o‘zgartirsangiz — python3 scripts/site-gallery.py ni qayta ishga tushiring
export const SHOWCASE: { id: string; tag: string }[] = [
  { id: 'back-squat', tag: 'Oyoq va dumba' },
  { id: 'bench-press', tag: 'Ko‘krak' },
  { id: 'pull-up', tag: 'Orqa' },
  { id: 'hip-thrust', tag: 'Dumba' },
  { id: 'lateral-raise', tag: 'Yelka' },
  { id: 'barbell-curl', tag: 'Bitseps' },
  { id: 'barbell-row', tag: 'Orqa' },
  { id: 'push-up', tag: 'Uyda' },
];

export const GALLERY_IDS = [
  'deadlift',
  'bench-press',
  'back-squat',
  'pull-up',
  'hip-thrust',
  'db-shoulder-press',
  'barbell-row',
  'kb-swing',
  'lateral-raise',
  'split-squat',
  'barbell-curl',
  'face-pull',
  'lat-pulldown',
  'hanging-leg-raise',
  'front-squat',
  'incline-db-press',
  'chin-up',
  'push-up',
];
