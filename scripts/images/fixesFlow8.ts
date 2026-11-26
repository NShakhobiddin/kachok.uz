// Flow-8: Flow-6 yakuniy to‘plam tekshiruvida (2026-11-26) rad etilgan kadrlar.
// Har bir kadr uchun asos tanlanadi: tayyor kadrni faqat TAHRIRLASH (edit — xato joyi tuzatiladi, qolgani o‘zgarmaydi)
// yoki harakatning ikkinchi chetini CHIZISH (pair — o‘sha kamera va odam). Noldan (fresh) — faqat boshqa iloji bo‘lmasa.
//   from: 'yakA' / 'yakB' — Flow-6 yakuniy natijasi; 'current' / 'currentPair' — ilovadagi asosiy / ikkinchi kadr;
//         'A' — shu ishning yangi natija-A si; 'fresh' — uslub namunasi va to‘liq tavsif bilan noldan.
//   keepA / keepB — tayyor kadr o‘zgarishsiz natija sifatida qo‘yiladi (juftining ikkinchisi shundan chiziladi).

export type Flow8Source = 'yakA' | 'yakB' | 'current' | 'currentPair' | 'A' | 'fresh';

export interface Flow8Frame {
  from: Flow8Source;
  mode: 'edit' | 'pair' | 'fresh';
  phaseUz: string;
  /** ingliz tilida: nima o‘zgaradi (edit) yoki qaysi holat (pair) yoki qo‘shimcha tuzatishlar (fresh) */
  change: string;
}

export interface Flow8Job {
  id: string;
  female?: boolean;
  /** o‘zbekcha: nima uchun rad etildi */
  problem: string;
  /** o‘zbekcha: natijani saqlashdan oldin nimani tekshirish kerak */
  check: string;
  a?: Flow8Frame;
  b?: Flow8Frame;
  keepA?: 'yakA' | 'yakB';
  keepB?: 'yakA' | 'yakB';
  /** qo‘shimcha namuna rasm (ilovadan): faqat bitta detal uchun */
  ref?: { src: string; note: string };
}

const START = 'Boshlang‘ich holat';

export const FLOW8: Flow8Job[] = [
  /* ---------- yangi mashqlar (ilovaga hali qo‘shilmagan) ---------- */
  {
    id: 'single-leg-rdl',
    problem: 'Bosh va yuz oddiy teri va soch bilan chizilgan; gantel tayanch oyoq tomonidagi qo‘lda.',
    check: 'Bosh va yuz terisiz (mushaklari ko‘rinadi), soch yo‘q; gantel tayanch oyoqqa QARAMA-QARSHI qo‘lda.',
    a: {
      from: 'yakA',
      mode: 'edit',
      phaseUz: 'Pastki nuqta',
      change:
        '(1) the head and face become écorché like the rest of the body — skin removed, facial muscles visible, completely bald, no hair, no realistic skin; (2) the dumbbell hangs from the hand on the side OPPOSITE to the standing leg (the standing leg is the one on the floor; the arm on the standing-leg side hangs empty next to it). Pose, camera, lighting and glow stay the same',
    },
    b: { from: 'A', mode: 'pair', phaseUz: START, change: 'standing tall on the same standing leg, the other foot lifted just off the floor beside it, torso upright, the dumbbell hanging at the thigh in the SAME hand as in image 1' },
  },
  {
    id: 'lateral-lunge',
    female: true,
    problem: 'Yuz oddiy teri bilan chizilgan (boshqa rasmlarga mos emas).',
    check: 'Yuz terisiz (mushaklari ko‘rinadi), soch past tugunda; poza va kamera o‘zgarmagan.',
    a: {
      from: 'yakA',
      mode: 'edit',
      phaseUz: 'Pastki nuqta',
      change: 'ONLY the face and head: make them écorché like the body — skin removed, facial muscles visible; keep the neat low hair bun. Everything else (pose, wide stance, camera, glow, clothes) stays identical',
    },
    b: { from: 'A', mode: 'pair', phaseUz: START, change: 'standing tall at the start with the feet together, hands clasped in front of the chest' },
  },
  {
    id: 'incline-push-up',
    female: true,
    problem: 'Yuz oddiy teri bilan; «pastki nuqta»da qo‘llar deyarli to‘g‘ri — ikki kadr bir xil.',
    check: 'Tirsaklar ~90°, ko‘krak skameyka chetidan 3–5 sm; gavda tovondan boshgacha tekis; yuz terisiz.',
    a: {
      from: 'yakA',
      mode: 'edit',
      phaseUz: 'Pastki nuqta',
      change:
        '(1) the TRUE BOTTOM: elbows bent to about 90° and angled ~45° from the torso, the chest lowered to 3–5 cm above the bench edge, the body still one straight line from head to heels (no sag, no pike) — the shoulders drop clearly lower than in image 1; (2) the face and head écorché like the body (skin removed, facial muscles visible), keep the hair bun. Hands, feet, bench and camera stay in place',
    },
    b: { from: 'A', mode: 'pair', phaseUz: 'Yuqori nuqta', change: 'the top: arms fully straight, the body still one straight line from head to heels, hands and feet on the same spots' },
  },

  /* ---------- eski mashqlar ---------- */
  {
    id: 'reverse-crunch',
    female: true,
    problem: 'Boshlang‘ich holat chiqmadi — B kadr A bilan bir xil (tizzalar ko‘krakda).',
    check: 'Tos va bel polda; sonlar tik, boldirlar polga parallel; oyoq kaftlari tizzalardan uzoqroqda (boshdan uzoqda).',
    b: {
      from: 'current',
      mode: 'pair',
      phaseUz: START,
      change:
        'the START, clearly different from image 1: the pelvis and lower back lie FLAT on the mat (no gap), the thighs point straight UP (vertical over the hips), the knees bent 90° with the shins HORIZONTAL and pointing away from the head — the feet are farther from the head than the knees. The knees move away from the chest by about a thigh length; head, shoulders and arms stay on the mat exactly as in image 1',
    },
  },
  {
    id: 'curtsy-lunge',
    female: true,
    problem: 'Reverans emas — oyoqlar kesishmagan, oddiy hamla.',
    check: 'Orqa oyoq old oyoq ORTIDAN kesib o‘tgan: orqa oyoq kafti old oyoqning narigi tomonida ko‘rinadi, sonlar «X» hosil qiladi.',
    a: {
      from: 'fresh',
      mode: 'fresh',
      phaseUz: 'Pastki nuqta',
      change:
        'Camera: straight FRONT view, slightly elevated (about 15° above hip height). The FRONT foot is her LEFT foot (on the right side of the image). Her RIGHT leg steps back and diagonally ACROSS behind the left leg, so the right foot (on its toes) appears on the RIGHT side of the image, behind and beyond the left foot, and the right knee hovers just above the floor behind the left calf — from the camera the two thighs clearly form an X. Left knee bent ~90° over the toes, hips and shoulders square to the camera, torso upright, hands on hips. Glow on the left quadriceps and both glutes (gluteus medius strongest).',
    },
    b: { from: 'A', mode: 'pair', phaseUz: START, change: 'standing tall at the start: both feet side by side hip-width apart on the spot of the LEFT (front) foot in image 1, knees straight, hands on hips' },
  },
  {
    id: 'knee-push-up',
    female: true,
    problem: 'Pastki nuqta chiqmadi (ko‘krak poldan baland, tos bukilgan).',
    check: 'Ko‘krak poldan 2–3 sm; tirsaklar ~90°; tizza–tos–yelka–bosh bir to‘g‘ri chiziqda; qo‘l va tizza o‘sha joyda.',
    keepB: 'yakB',
    a: {
      from: 'yakB',
      mode: 'pair',
      phaseUz: 'Pastki nuqta',
      change:
        'the TRUE BOTTOM: the chest lowered to 2–3 cm above the mat, the upper arms horizontal (elbows bent 90°, angled 30–45° from the torso), the shoulders at elbow height; the hips lower together with the chest so knees, hips, shoulders and head stay one straight line (no pike). The shoulders drop by about a forearm length compared with image 1; hands and knees on the same spots',
    },
  },
  {
    id: 'band-row',
    female: true,
    problem: 'Qisqargan holatda qo‘llar gavda ortiga ketgan, lenta oyoq kafti ostida ko‘rinmaydi.',
    check: 'Har bir qo‘l o‘z tomonida qovurg‘a pastida; tirsaklar gavdadan sal orqada, qo‘llar orqada emas; lenta ikkala oyoq kafti ostidan o‘tgan.',
    keepB: 'yakB',
    a: {
      from: 'yakB',
      mode: 'pair',
      phaseUz: 'Qisqargan holat',
      change:
        'the pull: the elbows bend and travel straight back ALONGSIDE the ribs; each hand finishes beside its own flank at the lower ribs, the elbows only slightly behind the line of the back — the hands never go behind the back; shoulder blades squeezed, torso upright; the two band strands run from the hands straight down to the feet and stay looped UNDER both soles exactly as in image 1',
    },
  },
  {
    id: 'bicycle-crunch',
    female: true,
    problem: 'A kadrda tirsak o‘sha tomondagi tizzaga keladi (qarama-qarshisi kerak); B to‘g‘ri chiqqan — u asosiy kadr bo‘ladi.',
    check: 'Bukilgan tizzaga QARAMA-QARSHI tomondagi tirsak keladi; ikkinchi oyoq to‘g‘ri va pastda; kamera va gilam o‘zgarmagan.',
    keepA: 'yakB',
    b: {
      from: 'A',
      mode: 'pair',
      phaseUz: 'Ikkinchi tomon',
      change:
        'the mirror side: the knee that is bent in image 1 extends straight and low (10–15 cm above the mat), the straight leg is pulled toward the chest, and the torso rotates the other way so the elbow on the side of the newly STRAIGHT leg comes across toward the newly BENT knee; fingertips stay at the temples, lower back on the mat',
    },
  },
  {
    id: 'hip-adduction',
    female: true,
    problem: 'Yostiqlar tizzalarning tashqi tomonida (bu sonni ochish trenajyori).',
    check: 'Ikkala yostiq tizzalar ORASIDA, ichki tomonida; oyoqda qora krossovka.',
    a: {
      from: 'current',
      mode: 'edit',
      phaseUz: 'Yopilgan holat',
      change:
        'the machine is an ADDUCTOR: BOTH thigh pads sit BETWEEN the knees, pressing on the INNER sides of the knees and lower thighs; nothing of the machine is on the outer side of the legs; the knees squeezed together so the two pads almost touch; black sneakers on both footrests (no bare feet); glow only on the inner-thigh adductors',
    },
    b: { from: 'A', mode: 'pair', phaseUz: START, change: 'the start: the knees spread wide apart, the pads still on the INNER sides of the knees, the pad arms swung outward together with the legs' },
  },
  {
    id: 'ab-wheel',
    female: true,
    problem: 'Cho‘zilgan holat yana qisqa — rolik bosh ostida, tos bukilgan.',
    check: 'Rolik boshdan bir qo‘l uzunligi oldinda; qo‘llar boshdan yuqoriga cho‘zilgan; tizza–tos–yelka bir chiziq, polga ~20°.',
    a: {
      from: 'currentPair',
      mode: 'pair',
      phaseUz: 'Cho‘zilgan holat',
      change:
        'the FULL rollout: the wheel rolls forward until it is a full arm length IN FRONT of the head; the arms straight overhead (about 150° at the shoulders); the hips extend so knees, hips and shoulders form one straight line inclined only ~20° to the floor, the shoulders 25–30 cm above the mat; pelvis tucked, no lower-back sag, head neutral; the knees stay on the same spot',
    },
  },
  {
    id: 'cross-body-shoulder',
    female: true,
    problem: 'Yordamchi qo‘l tirsakdan ushlagan — yelka (son suyagi) qismidan ushlash kerak.',
    check: 'Chap qo‘l o‘ng qo‘lning YELKA qismida (yelka va tirsak o‘rtasida); tirsak va bilak qo‘ldan tashqarida erkin.',
    a: {
      from: 'currentPair',
      mode: 'pair',
      phaseUz: 'Cho‘zilgan holat',
      change:
        'the stretch: the right arm now lies straight across the chest at shoulder height; the LEFT hand holds the right UPPER ARM halfway between the shoulder and the elbow — at least a hand width away from the elbow joint — so the right elbow and forearm extend free beyond the left hand; right shoulder down, torso facing forward; glow on the right rear deltoid',
    },
  },
  {
    id: 'chin-up',
    problem: 'Ushlash yana to‘g‘ri (kaftlar oldinga); B osilish emas.',
    check: 'Kaftlar SPORTCHINING O‘ZIGA qaragan: kameradan qo‘lning orqasi va bo‘g‘imlar ko‘rinadi, barmoq uchlari turnik ortida, bosh barmoqlar tashqariga. B: qo‘llar to‘liq to‘g‘ri.',
    a: {
      from: 'yakA',
      mode: 'edit',
      phaseUz: 'Yuqori nuqta',
      change:
        '(1) ONLY the hands and forearms: an UNDERHAND (supinated) grip — the palms face the athlete. From this front camera we see the BACK of each hand and the knuckles on top of the bar, the fingertips are hidden behind the bar, and the thumbs are on the OUTER side (away from the head); the inner (flexor) side of the forearms faces the athlete; (2) the chin clearly ABOVE the bar (raise the body about 5 cm). Bar, camera, legs and glow stay the same',
    },
    b: { from: 'A', mode: 'pair', phaseUz: 'Pastki nuqta', change: 'a true dead hang: arms fully straight overhead on the same underhand grip and the same bar, the body lowered by the arm length so the head is well below the bar; feet may be cut off by the bottom edge' },
  },
  {
    id: 'leg-curl',
    problem: 'Pastki rolik boldir OLDIDA (oyoq yozish trenajyori), tizza ~90°.',
    check: 'Rolik oyoqlarning ORQASIDA (tovon ustida, boldir orqasida); tizza 120–130° bukilgan, tovonlar o‘rindiq ostiga tortilgan.',
    ref: { src: 'lying-leg-curl.webp', note: 'the roller position only: the ankle roller presses on the BACK of the lower legs just above the heels' },
    a: {
      from: 'yakA',
      mode: 'edit',
      phaseUz: 'Qisqargan holat',
      change:
        '(1) the lower roller pad sits BEHIND the lower legs — on the back of the calves just above the heels, between the legs and the seat — never in front of the shins; (2) the knees bend further to about 120–130° so the heels are pulled back under the front edge of the seat with the roller still behind them. The thigh pad, seat, hands, camera and glow stay the same',
    },
    b: { from: 'A', mode: 'pair', phaseUz: START, change: 'the start: the legs almost straight in front, the roller pad still BEHIND the lower calves just above the heels (pushing from behind), the thigh pad on the lower thighs' },
  },
  {
    id: 'figure-four',
    female: true,
    problem: 'Uchta oyoq kafti chizilgan; qo‘llar tayanch son ortida emas.',
    check: 'Aniq IKKITA oyoq va ikkita oyoq kafti; tayanch oyoq ko‘tarilgan; ikkala qo‘l tayanch son ortida birlashgan.',
    keepB: 'yakB',
    a: {
      from: 'yakB',
      mode: 'pair',
      phaseUz: 'Cho‘zilgan holat',
      change:
        'the stretch: the supporting foot lifts off the mat; both hands interlace BEHIND the supporting thigh and pull it toward the chest, the crossed-side arm passing through the gap between the legs; the crossed ankle stays on the supporting thigh just below the knee, the crossed knee opening outward. EXACTLY two legs and two feet; head, shoulders and sacrum on the mat',
    },
  },
  {
    id: 'back-extension',
    problem: '«Pastki» kadr aslida yuqori holat (gavda gorizontal).',
    check: 'Gavda polga qarab osilgan: bosh tosdan ancha past, gavda oyoqlarga ~90°; bel tekis, qo‘llar ko‘krakda.',
    b: {
      from: 'current',
      mode: 'pair',
      phaseUz: 'Pastki nuqta',
      change:
        'the bottom: hinging at the hips over the pad, the torso hangs DOWN toward the floor — about 80–90° to the legs, the head 30–40 cm above the floor and far LOWER than the hips; the back stays flat and neutral (no rounding), arms crossed on the chest, head in line with the spine; legs, ankle pads and bench unchanged',
    },
  },
  {
    id: 'mountain-climber',
    female: true,
    problem: 'Oyoqlar almashmagan — ikkinchi kadr birinchisi bilan bir xil.',
    check: 'Oyoqlar almashgan: 1-rasmda orqada cho‘zilgan oyoq endi ko‘krak ostida, bukilgani esa orqaga cho‘zilgan.',
    b: {
      from: 'current',
      mode: 'pair',
      phaseUz: 'Ikkinchi oyoq',
      change:
        'the legs EXCHANGE positions: the leg that is extended back in image 1 is now driven forward with the knee under the chest and the foot off the floor, and the leg that is bent under the chest in image 1 is now extended straight back on its toes. Hands on the same spots, shoulders over the hands, hips at the same height',
    },
  },
  {
    id: 'seated-calf-raise',
    female: true,
    problem: 'Tovon deyarli tushmagan — ikki kadr bir xil.',
    check: 'Tovonlar platformadan ancha past (oyoq uchlari tovondan baland); tizza yostig‘i ham pastga tushgan.',
    b: {
      from: 'current',
      mode: 'pair',
      phaseUz: 'Pastki nuqta',
      change:
        'the bottom: the heels drop well BELOW the platform edge — the ankles dorsiflexed about 20° so the toes are clearly higher than the heels, the heels 6–8 cm lower than in image 1; the knee pad with the plates and the thighs lower by the same amount; the balls of the feet stay on the same spot of the fixed platform',
    },
  },
  {
    id: 'crunch',
    problem: 'Bel poldan uzilgan — sit-up ga o‘xshaydi.',
    check: 'Faqat bosh va kuraklar poldan 15–20 sm ko‘tarilgan; bel va tos polda; iyak sal ichkariga.',
    a: {
      from: 'currentPair',
      mode: 'pair',
      phaseUz: 'Yuqori nuqta',
      change:
        'the crunch: ONLY the head, neck and shoulder blades curl up 15–20 cm off the floor with the upper back visibly rounded and the chin slightly tucked; the lower back and pelvis stay pressed FLAT on the floor; arms crossed on the chest; knees and feet unchanged',
    },
  },
  {
    id: 'bench-press',
    problem: 'Pastki nuqtada shtanga o‘mrov/bo‘yin sohasiga tushgan — ko‘krakning pastki qismiga tegishi kerak.',
    check: 'Shtanga ko‘krak pastiga (ko‘krak uchi chizig‘i) tegadi; bilaklar shtanga ostida tik; yuqori kadr bilan kamera bir xil.',
    keepB: 'yakB',
    a: {
      from: 'yakB',
      mode: 'pair',
      phaseUz: 'Pastki nuqta',
      change:
        'the bottom: the bar lowered to TOUCH the lower chest at the nipple line — clearly lower on the torso than the shoulders and collarbones — forearms vertical under the bar, elbows about 45–70° from the torso, shoulder blades retracted, feet flat; the same grip',
    },
  },
  {
    id: 'cable-fly',
    problem: 'Qisqargan holatda tirsak ~90°, qo‘llar ko‘krakka yaqin — jimga o‘xshaydi.',
    check: 'Qo‘llar ko‘krakdan 40–50 sm oldinda uchrashadi; tirsaklar deyarli to‘g‘ri (1-rasmdagidek).',
    b: {
      from: 'current',
      mode: 'pair',
      phaseUz: 'Qisqargan holat',
      change:
        'the contracted position: both arms sweep forward in a wide hugging arc until the hands meet 40–50 cm IN FRONT of the lower chest, at almost full arm length; the elbows keep the SAME slight bend as in image 1 (about 160°), never bent to 90°; the cables run from the pulleys to the D-handles',
    },
  },
  {
    id: 'pec-deck',
    problem: 'Qisqargan holatda tirsak ~90°, dastaklar ko‘krakka yaqin.',
    check: 'Dastaklar o‘rtada, ko‘krakdan 40–50 sm oldinda uchrashadi; qo‘llar deyarli to‘g‘ri; trenajyor ramasi o‘zgarmagan.',
    b: {
      from: 'current',
      mode: 'pair',
      phaseUz: 'Qisqargan holat',
      change:
        'the contracted position: both machine arms pivot SYMMETRICALLY until the handles meet at the midline 40–50 cm in front of the chest; the arms stay almost straight with the same slight elbow bend as in image 1 — the hands are NOT close to the chest; the machine frame unchanged',
    },
  },
  {
    id: 'db-bench',
    problem: 'Pastki nuqtada gantellar ko‘krak markazida — ko‘krak yonlarida bo‘lishi kerak.',
    check: 'Gantellar ko‘krak yonlarida, keng (gavdadan tashqarida); bilaklar tik; ushlash 1-rasmdagidek.',
    b: {
      from: 'current',
      mode: 'pair',
      phaseUz: 'Pastki nuqta',
      change:
        'the bottom: the dumbbells lowered to the SIDES of the chest at nipple level, wide apart — each dumbbell just outside the torso — forearms vertical under the dumbbells, upper arms about 45–60° from the torso, a deep chest stretch; EXACTLY the same grip as in image 1',
    },
  },
  {
    id: 'farmers-carry',
    problem: 'Ikkinchi kadrda oyoqlar almashmagan — qadam ko‘rinmaydi.',
    check: 'Oyoqlar teskari: 1-rasmda orqadagi oyoq endi oldinda (tovon bilan tushayapti), oldingisi orqada oyoq uchida.',
    b: {
      from: 'current',
      mode: 'pair',
      phaseUz: 'Keyingi qadam',
      change:
        'the next step: the leg that is behind in image 1 swings forward and lands heel-first in front, and the leg that is in front in image 1 is now behind on its toes — the feet are clearly in opposite positions; torso upright, dumbbells at the sides exactly as in image 1',
    },
  },
  {
    id: 'banded-lateral-walk',
    female: true,
    problem: 'Ikki kadr orasidagi farq juda kichik — yonga qadam ko‘rinmaydi.',
    check: 'Oyoqlar bir-biriga yaqin (15–20 sm); 1-rasmdagi keng turishdan aniq farq qiladi; lenta to‘pig‘da.',
    b: {
      from: 'current',
      mode: 'pair',
      phaseUz: START,
      change:
        'the start: the feet close together, only 15–20 cm apart, the band around the ankles nearly slack, the same half-squat depth and hands on hips — the stance must be visibly much narrower than in image 1',
    },
  },
];
