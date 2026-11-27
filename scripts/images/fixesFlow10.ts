// Flow-10: foydalanuvchi ekran rasmlari bo‘yicha tahlil (2026-11-27) va Flow-9 dagi hali bajarilmagan ishlar — bitta to‘plam.
// Tuzilma — fixesFlow8.ts dagidek. Ishlatish: npx vite-node scripts/images/flow-pack5.ts -- <chiqish> <flow6-yakuniy-papka> flow10
import type { Flow8Job } from './fixesFlow8';
import { FLOW9 } from './fixesFlow9';

const START = 'Boshlang‘ich holat';
const ECORCHE_HEAD_MALE = 'the head and face écorché like the body — skin removed, facial muscles visible, completely bald, no hair';

const NEW: Flow8Job[] = [
  /* ---------- ko‘krak ---------- */
  {
    id: 'db-bench',
    problem: 'Pastki kadrda gantel bo‘yin/o‘mrov sathida, tirsak skameyka sathidan ancha pastga osilib tushgan.',
    check: 'Gantel ko‘krak uchi chizig‘ida, ko‘krakning yonida (bo‘yin oldida emas); tirsak skameyka sathida yoki 2–3 sm pastda; bilak tik.',
    b: {
      from: 'current',
      mode: 'pair',
      phaseUz: 'Pastki nuqta',
      change:
        'the bottom: each dumbbell lowered straight down to the side of the chest at NIPPLE level (a hand-width below the collarbones, never at the neck or the shoulders), the dumbbell just outside the torso; the forearms vertical directly under the dumbbells; the upper arms about 45–60° away from the torso; the ELBOWS stop at the level of the bench top — the elbow is not lower than the bench pad; the same grip as in image 1; head, back, hips and feet unchanged',
    },
  },
  {
    id: 'incline-db-press',
    problem: 'Pastki kadrda ikkala gantel yuz va iyak oldida, bir-birining ustida.',
    check: 'Gantellar ko‘krak yuqori qismining ikki yonida, o‘mrovdan sal pastda; yuz oldida emas, bir-birini to‘smaydi; bilaklar tik.',
    a: {
      from: 'currentPair',
      mode: 'pair',
      phaseUz: 'Pastki nuqta',
      change:
        'the bottom: the two dumbbells come apart and down to the SIDES of the upper chest just below the collarbones — one dumbbell on each side of the chest, at chest height, NOT in front of the face or chin and not overlapping each other; the forearms vertical under the dumbbells, the elbows below the dumbbells and about 45–60° from the torso; the same grip, head and bench angle',
    },
  },
  {
    id: 'machine-chest-press',
    problem: 'Itarilgan holatda faqat bitta qo‘l to‘g‘rilangan, ikkinchi dastak ko‘krakda qolgan.',
    check: 'Ikkala qo‘l bir xil oldinga to‘g‘rilangan (tirsak yumshoq), ikkala dastak ko‘krakdan bir xil uzoqlikda; trenajyor ramasi o‘zgarmagan.',
    b: {
      from: 'current',
      mode: 'pair',
      phaseUz: 'Itarilgan holat',
      change:
        'the press: BOTH arms push forward SYMMETRICALLY until both elbows are almost straight; both handles travel forward together and end at the same distance in front of the chest, about shoulder-width apart; the two machine levers move as a mirror pair; back stays on the pad',
    },
  },
  {
    id: 'dips',
    problem: 'Ikkala kadrda ham qo‘llar deyarli to‘g‘ri — pastki nuqta (tirsak ~90°) chizilmagan.',
    check: 'Tirsak ~90° bukilgan, yelka qo‘l bilan bir sathda (yelka tirsakdan pastga tushmaydi); gavda ~25–30° oldinga; qo‘llar brusda o‘sha joyda.',
    a: {
      from: 'currentPair',
      mode: 'pair',
      phaseUz: 'Pastki nuqta',
      change:
        'the bottom: the elbows bend to about 90° pointing back, the upper arms parallel to the floor, the shoulders lowered to elbow height; the whole body is lower by about a forearm length; the torso leans forward 25–30°; the hands stay on exactly the same spots of the bars, the knees bent with the feet crossed behind as in image 1',
    },
  },
  /* ---------- yelka va qo‘llar ---------- */
  {
    id: 'cable-overhead-extension',
    problem: 'Yuqori kadrda yelka ham oldinga tushgan (tirsak peshona oldiga siljigan) — mashq pulloverga aylangan.',
    check: 'Qo‘lning yuqori qismi 1-rasmdagidek tik, tirsaklar bosh tepasida qoladi; faqat tirsak to‘g‘rilanib, arqon bosh ustiga chiqadi.',
    b: {
      from: 'current',
      mode: 'pair',
      phaseUz: 'Yuqori nuqta',
      change:
        'the elbows straighten while the UPPER ARMS DO NOT MOVE: the upper arms stay exactly as in image 1 — pointing straight up beside the ears with the elbows above the head; only the forearms swing up until the arms are straight overhead, the rope ends pulled apart above the head; torso, stance and cable line unchanged',
    },
  },
  {
    id: 'face-pull',
    problem: 'Ikkala kadrda boshida soch va oddiy teri — boshqa rasmlardagi terisiz uslubga mos emas.',
    check: 'Bosh va yuz terisiz (mushaklari ko‘rinadi), sochsiz; poza, arqon va yorug‘lik o‘zgarmagan.',
    a: { from: 'current', mode: 'edit', phaseUz: 'Qisqargan holat', change: `ONLY the head: ${ECORCHE_HEAD_MALE}. Pose, rope, cable, camera and glow stay identical` },
    b: { from: 'currentPair', mode: 'edit', phaseUz: START, change: `ONLY the head: ${ECORCHE_HEAD_MALE}. Pose, rope, cable, camera and glow stay identical` },
  },
  {
    id: 'preacher-curl',
    female: true,
    problem: 'Qo‘lda EZ-shtanga o‘rniga ikki qo‘llab ushlangan bitta gantel; asosiy kadr o‘rta holat — qisqargan yuqori nuqta yo‘q.',
    check: 'Ikki qo‘lda EZ-shtanga (egri grif, ikki uchida disk), kaftlar yuqoriga; qo‘lning yuqori qismi yostiqda; A da bilak deyarli tik, shtanga yelkaga yaqin.',
    a: {
      from: 'current',
      mode: 'edit',
      phaseUz: 'Yuqori nuqta',
      change:
        '(1) replace the single dumbbell with an EZ curl bar: a shoulder-width zig-zag (cambered) bar held with BOTH hands underhand, a small plate on each end outside the hands; (2) the top of the curl: the forearms raised until almost vertical, the bar close to the shoulders, the backs of the upper arms still lying flat on the sloped pad with the armpits on its top edge. Seat, pad, camera and glow stay the same',
    },
    b: { from: 'A', mode: 'pair', phaseUz: START, change: 'the bottom: the elbows almost straight (slight bend), the EZ bar low in front of the pad, the upper arms still flat on the pad' },
  },
  {
    id: 'sumo-deadlift',
    problem: 'Ikki kadr turli kameradan: pastki — yon-oldindan, yuqori — to‘g‘ri oldidan; «Harakat»da rasm sakraydi.',
    check: 'Kamera va shtanga 1-rasmdagidek (yon-oldindan); oyoqlar o‘sha joyda keng, tos va tizza to‘liq yozilgan, shtanga son o‘rtasida.',
    b: {
      from: 'current',
      mode: 'pair',
      phaseUz: 'Yuqori nuqta',
      change: 'standing tall at lockout: hips and knees fully extended, the bar at mid-thigh with straight arms, shoulders back; the same very wide stance with toes out, feet on the same spots',
    },
  },
  /* ---------- oyoqlar ---------- */
  {
    id: 'curtsy-lunge',
    female: true,
    problem: 'Pastki nuqtada chuqurlik yo‘q: old oyoq deyarli to‘g‘ri, orqa tizza poldan ancha baland.',
    check: 'Oyoqlar kesishgan holicha; old son polga parallelga yaqin (tizza ~90°), orqa tizza poldan bir necha sm yuqorida, tos pastga tushgan.',
    a: {
      from: 'current',
      mode: 'edit',
      phaseUz: 'Pastki nuqta',
      change:
        'lower into the true bottom of the curtsy lunge: the front knee bends to about 90° so the front thigh is nearly parallel to the floor, the hips drop 15–20 cm, the rear knee hovers just a few centimetres above the floor behind the front heel; KEEP the legs crossed exactly as in image 1, hands on hips, torso upright, the same front-view camera',
    },
  },
  {
    id: 'nordic-curl',
    female: true,
    problem: 'To‘piqlar divan ostiga qistirilmagan — faqat divanning oldiga tiralib turibdi.',
    check: 'Tovon va to‘piq orqasi divanning pastki chetida ostida, divan to‘piqni yuqoridan bosib turadi; boldirda yorug‘lik juda xira.',
    a: {
      from: 'current',
      mode: 'edit',
      phaseUz: 'Tushish',
      change:
        'ONLY the feet and ankles: the heels and the backs of the ankles are tucked UNDER the lower front edge of the sofa so the sofa holds the ankles down from above (the shoes are hidden under the sofa up to the ankle); the calves glow only faintly, the hamstrings brightest. Everything else stays identical',
    },
    b: {
      from: 'currentPair',
      mode: 'edit',
      phaseUz: START,
      change: 'ONLY the feet and ankles: the heels and the backs of the ankles are tucked UNDER the lower front edge of the sofa, held down by it, exactly as in a Nordic curl; the calves glow only faintly. Everything else stays identical',
    },
  },
  {
    id: 'hanging-knee-raise',
    problem: 'Ikkita turnik «X» bo‘lib kesishgan; osilib turish (boshlang‘ich) kadri yo‘q.',
    check: 'Faqat bitta tekis turnik ikki tik ustun orasida; B: qo‘llar to‘g‘ri, oyoqlar pastga to‘g‘ri, tizzalar kadr ichida.',
    a: {
      from: 'current',
      mode: 'edit',
      phaseUz: 'Yuqori nuqta',
      change: 'ONLY the equipment: ONE straight horizontal pull-up bar spanning between the two vertical posts, held by both hands; remove the second crossing bar completely. The athlete, pose, camera and glow stay identical',
    },
    b: {
      from: 'A',
      mode: 'pair',
      phaseUz: START,
      change: 'dead hang at the start: arms straight on the same bar, legs hanging straight down and together; the camera does not move — the knees and shins stay inside the image, only the feet below the ankles may be cut by the bottom edge',
    },
  },
  {
    id: 'hip-thrust',
    problem: 'Boshi orqaga tashlangan — tos ko‘tarishda iyak ichkarida, nigoh oldinga bo‘ladi.',
    check: 'Iyak sal ichkariga, nigoh tizzalar tomon; qolgan hammasi (shtanga, skameyka, tos) o‘zgarmagan.',
    a: { from: 'current', mode: 'edit', phaseUz: 'Yuqori nuqta', change: 'ONLY the head and neck: chin tucked slightly, gaze forward toward the knees (not tilted back toward the ceiling). Everything else identical' },
    b: { from: 'currentPair', mode: 'edit', phaseUz: 'Pastki nuqta', change: 'ONLY the head and neck: chin tucked slightly, gaze forward toward the knees (not tilted back toward the ceiling). Everything else identical' },
  },
  /* ---------- orqa va press ---------- */
  {
    id: 'inverted-row',
    problem: 'Yuqori nuqtada ko‘krak turnikka yetmagan (10–15 sm qolgan).',
    check: 'Ko‘krak (ko‘krak uchi chizig‘i) turnikka tegadi, tirsaklar gavda orqasida; tana tovondan boshgacha tekis.',
    a: {
      from: 'current',
      mode: 'edit',
      phaseUz: 'Yuqori nuqta',
      change: 'pull higher: the chest at nipple line touches the bar, the elbows travel behind the torso, the shoulder blades squeezed; the body stays one straight line from heels to head; hands, heels, bar and rack stay in place',
    },
  },
  {
    id: 'mountain-climber',
    female: true,
    problem: 'Shortik shaffof — son va lime yorug‘lik shortik orqali ko‘rinadi.',
    check: 'Shortik to‘q kulrang va to‘liq yopiq (orqasidan hech narsa ko‘rinmaydi); poza o‘zgarmagan.',
    a: { from: 'current', mode: 'edit', phaseUz: 'Qisqargan holat', change: 'ONLY the shorts: solid opaque dark grey compression shorts — nothing is visible through them. Pose, legs, camera and glow stay identical' },
    b: { from: 'currentPair', mode: 'edit', phaseUz: 'Ikkinchi oyoq', change: 'ONLY the shorts: solid opaque dark grey compression shorts — nothing is visible through them. Pose, legs, camera and glow stay identical' },
  },
  {
    id: 'pallof-press',
    problem: 'Boshlang‘ich kadrda ko‘krak va old delta ham yonib turibdi.',
    check: 'Yorug‘lik faqat qorin va qiyshiq mushaklarda; ko‘krak va yelka tabiiy qizil.',
    b: { from: 'currentPair', mode: 'edit', phaseUz: START, change: 'ONLY the glow: lime glow only on the obliques and the abdominal wall; the chest and shoulders have NO glow (natural red muscle). Everything else identical' },
  },
];

/** Flow-9 ham shu to‘plamda (turnikda tizza ko‘tarish — yuqorida yangilangan holda) */
export const FLOW10: Flow8Job[] = [...NEW, ...FLOW9.filter((j) => !NEW.some((n) => n.id === j.id))];
