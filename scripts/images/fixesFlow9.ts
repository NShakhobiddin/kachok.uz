// Flow-9: 2026-11-27 murabbiy auditida topilgan rasm xatolari (fixesFlow8.ts bilan bir xil tuzilma).
// Ishlatish: npx vite-node scripts/images/flow-pack5.ts -- <chiqish> <flow6-yakuniy-papka> flow9
import type { Flow8Job } from './fixesFlow8';

const START = 'Boshlang‘ich holat';

export const FLOW9: Flow8Job[] = [
  {
    id: 'smith-squat',
    problem: 'Smit trenajyorining shtangasi chizilmagan — sportchi bo‘sh havoni ushlab turibdi.',
    check: 'Shtanga yelka (trapetsiya) ustida yotadi, ikki uchi trenajyorning ikkita tik relsiga ulangan; qo‘llar shtangada; ikkala kadrda shtanga bir xil.',
    a: {
      from: 'current',
      mode: 'edit',
      phaseUz: 'Pastki nuqta',
      change:
        'ADD the Smith machine bar: a straight steel barbell resting across the upper back on the trapezius (below the neck), both hands gripping it slightly wider than the shoulders; each end of the bar is fixed to its own vertical guide rail of the Smith machine frame (two tall steel rails, one on each side of the athlete, with the bar sliding along them), small plates on both sleeves outside the rails. The squat pose, depth, camera and glow stay the same',
    },
    b: { from: 'A', mode: 'pair', phaseUz: 'Yuqori nuqta', change: 'standing tall at the top: hips and knees extended, the same bar on the upper back, the bar higher on the same two guide rails, feet on the same spots' },
  },
  {
    id: 't-bar-row',
    female: true,
    problem: 'Yuqori kadrda dastak grifdan ajralib havoda turibdi, disklar polda qolgan.',
    check: 'V-dastak grif ostiga ilingan va u bilan birga ko‘tarilgan: disklar tomondagi grif uchi poldan qorin tomon ko‘tarilgan; grifning ikkinchi uchi poldagi tayanchda.',
    b: {
      from: 'current',
      mode: 'pair',
      phaseUz: 'Yuqori nuqta',
      change:
        'the top of the row: the V-handle stays HOOKED under the bar right behind the plates, so the whole loaded end of the bar (bar + plates) rises together with the hands toward the upper abdomen, pivoting on the other bar end which stays anchored on the floor; elbows pulled back alongside the torso, the same torso angle and stance',
    },
  },
  {
    id: 'seated-calf-raise',
    female: true,
    problem: 'Yuz oddiy teri bilan chizilgan; ikkinchi kadrda tovon kam tushgan.',
    check: 'Yuz terisiz (mushaklari ko‘rinadi). B: tovonlar platformadan aniq past, oyoq uchlari tovondan baland.',
    a: { from: 'current', mode: 'edit', phaseUz: 'Yuqori nuqta', change: 'ONLY the face and head: écorché like the body — skin removed, facial muscles visible; keep the neat low hair bun. Pose, machine, camera and glow stay identical' },
    b: {
      from: 'A',
      mode: 'pair',
      phaseUz: 'Pastki nuqta',
      change:
        'the bottom: the heels drop well BELOW the platform edge — the ankles dorsiflexed about 20°, the toes clearly HIGHER than the heels; the knee pad with the plates and the thighs lower by the same 6–8 cm; the balls of the feet stay on the same spot of the fixed platform',
    },
  },
  {
    id: 'cable-fly',
    problem: 'Qisqargan kadr ikki marta chiqmadi: tirsak ~90°, qo‘llar ko‘krakka yopishgan (jimga o‘xshaydi).',
    check: 'Qo‘llar deyarli to‘g‘ri — yelkadan qo‘lgacha masofa 1-rasmdagidek; kaftlar ko‘krakdan 40–50 sm oldinda uchrashadi.',
    b: {
      from: 'current',
      mode: 'pair',
      phaseUz: 'Qisqargan holat',
      change:
        'the hug: both arms swing forward like hugging a large tree; the ARMS DO NOT BEND — the distance from each shoulder to its hand is exactly the same as in image 1 (almost full arm length, elbows only softly bent ~160°); the hands meet in front of the body at lower-chest height, 40–50 cm AWAY from the chest, knuckles touching; seen from the front the arms form a wide "V" from the shoulders to the hands',
    },
  },
  {
    id: 'pec-deck',
    problem: 'Qisqargan kadr ikki marta chiqmadi: tirsak ~90°, dastaklar ko‘krakka yaqin.',
    check: 'Qo‘llar deyarli to‘g‘ri; dastaklar o‘rtada, ko‘krakdan 40–50 sm oldinda uchrashadi; trenajyor ramasi o‘zgarmagan.',
    b: {
      from: 'current',
      mode: 'pair',
      phaseUz: 'Qisqargan holat',
      change:
        'the contracted position: both machine arms swing forward symmetrically until the two handles touch at the midline; the ATHLETE\'S ARMS DO NOT BEND — the distance from each shoulder to its hand is the same as in image 1 (elbows softly bent ~160°), so the handles meet 40–50 cm IN FRONT of the chest and the arms form a wide "V" from the shoulders; machine frame unchanged',
    },
  },
  {
    id: 'hanging-knee-raise',
    problem: 'Osilib turish (boshlang‘ich) kadri yo‘q — oldingi urinishda oyoqlar kadrdan chiqib ketgan.',
    check: 'To‘liq osilish: qo‘llar to‘g‘ri, oyoqlar pastga to‘g‘ri; tizzalar kadr ichida, oyoq kafti faqat to‘piqdan pasti kesilishi mumkin; turnik o‘sha joyda.',
    b: {
      from: 'current',
      mode: 'pair',
      phaseUz: START,
      change:
        'dead hang at the start: arms straight on the SAME bar with the same grip, the legs hanging straight down and together, the pelvis neutral; the camera does not move — the knees and shins must stay INSIDE the image, only the feet below the ankles may be cut by the bottom edge',
    },
  },
  {
    id: 'farmers-carry',
    problem: 'Asosiy kadrda oyoqlar bir chiziqda kesishib ketgan («podium yurishi»).',
    check: 'Oyoqlar tos kengligida, har biri o‘z chizig‘ida — o‘rtadan kesib o‘tmaydi; qadam qisqa, gavda tik.',
    a: {
      from: 'current',
      mode: 'edit',
      phaseUz: 'Yurish',
      change:
        'ONLY the legs and feet: each foot walks on its OWN track hip-width apart — the front foot lands in line with its own hip, the thighs and shins do NOT cross the midline and do not overlap each other; a short natural step. Torso, arms, dumbbells, camera and glow stay identical',
    },
  },
];
