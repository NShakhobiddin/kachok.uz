// Eski mashq rasmlaridagi xatolar va tuzatish topshiriqlari (2026-10-29/30 auditlari, docs/image-regen.md).
// priority: 1 — noto'g'ri texnika o'rgatadi; 2 — harakat (ikkinchi kadr) yo'q yoki noto'g'ri; 3 — kosmetik.
// main.mode: 'edit' — mavjud rasmni tahrirlash (faqat ko'rsatilgani o'zgaradi), 'new' — uslub namunasi bilan yangidan.

export interface OldFix {
  id: string;
  priority: 1 | 2 | 3;
  /** o'zbekcha: nima xato */
  problem: string;
  main?: { mode: 'edit' | 'new'; change: string };
  pair?: { phaseUz: string; change: string };
}

export const OLD_FIXES: OldFix[] = [
  /* ---------- 1: noto'g'ri texnika ---------- */
  {
    id: 'chin-up',
    priority: 1,
    problem: 'Ushlash pull-up bilan bir xil: kaft oldinga, yelkadan keng. Chin-up — kaft o‘ziga, yelka kengligida.',
    main: {
      mode: 'new',
      change:
        'Camera: FRONT three-quarter view, 30° to the athlete\'s right, at chest height, so the palms are clearly visible. UNDERHAND (supinated) grip: palms facing the athlete\'s own face, hands exactly shoulder-width apart, thumbs wrapped around the bar. The chin clearly ABOVE the bar at the top, elbows pulled down beside the ribs.',
    },
    pair: { phaseUz: 'Pastki nuqta', change: 'dead hang with straight arms, the SAME underhand shoulder-width grip, legs still together' },
  },
  {
    id: 'pull-up',
    priority: 1,
    problem: 'Yuqori nuqtada iyak turnik sathida, undan yuqori emas.',
    main: { mode: 'edit', change: 'the height of the body: pull the athlete about 8 cm higher so the CHIN is clearly ABOVE the bar, elbows pulled down beside the ribs; the grip and hands stay exactly where they are' },
  },
  {
    id: 'front-squat',
    priority: 1,
    problem: 'Ikki kadrda ham tirsaklar past — shtanga old yelkada ushlanmaydi.',
    main: {
      mode: 'new',
      change:
        'Camera: FRONT THREE-QUARTER view — 35° in front of the athlete\'s right side, at hip height, so the face, the bar on the front of the shoulders and the HIGH elbows are clearly visible. Front-rack: the barbell rests on the front deltoids against the throat, fingertips under the bar just outside the shoulders, ELBOWS HIGH pointing forward so the upper arms are parallel to the floor. Bottom position: thighs parallel, torso upright.',
    },
    pair: { phaseUz: 'Yuqori nuqta', change: 'standing tall at the top: knees and hips extended, the barbell still in the front-rack position with the elbows high' },
  },
  {
    id: 'ohp',
    priority: 1,
    problem: 'Yuqori nuqtada qo‘llar to‘liq yozilmagan (lockout yo‘q); ikkinchi kadr yo‘q.',
    main: {
      mode: 'edit',
      change:
        'the arms: press the barbell to FULL LOCKOUT — arms completely straight overhead, elbows locked, the bar directly above the middle of the feet and slightly behind the forehead, head pushed slightly forward through the arms',
    },
    pair: {
      phaseUz: 'Boshlang‘ich holat',
      change: 'the start of the press: the barbell RESTING ON THE FRONT SHOULDERS at collarbone height (NOT at the chin), forearms vertical, elbows slightly in front of the bar, hands just outside shoulder width',
    },
  },
  {
    id: 'lateral-raise',
    priority: 1,
    problem: 'Yuqori kadrda gantel dastasi bilak bo‘ylab — ushlab bo‘lmaydigan holat.',
    main: { mode: 'edit', change: 'the dumbbells: each dumbbell handle runs ACROSS the palm, perpendicular to the forearm (seen end-on from the front), knuckles up, pinky side slightly higher; arms and everything else unchanged' },
  },
  {
    id: 'incline-bench',
    priority: 1,
    problem: 'Pastki nuqtada shtanga ko‘krakka tushmagan.',
    main: { mode: 'edit', change: 'the bar position: lower the barbell so it TOUCHES the upper chest just below the collarbones, forearms vertical under the bar, elbows about 60° from the torso' },
  },
  {
    id: 'close-grip-bench',
    priority: 1,
    problem: 'Pastki nuqtada shtanga ko‘krakdan ~15 sm yuqorida (to‘liq bo‘lmagan harakat).',
    main: { mode: 'edit', change: 'the bar position: lower the barbell so it TOUCHES the lower chest, elbows tucked about 20–30° from the torso, forearms vertical under the bar' },
  },
  {
    id: 'barbell-row',
    priority: 1,
    problem: 'Yuqori nuqtada shtanga son yuqorisida — qorin pastiga tegmaydi, bilak tik.',
    main: { mode: 'edit', change: 'the bar position: pull the barbell up so it TOUCHES the lower abdomen just below the navel, elbows driven back past the torso, forearms angled; torso angle unchanged' },
  },
  {
    id: 'reverse-fly',
    priority: 1,
    problem: 'Rezina lenta beldagi qattiq lime tayoq bo‘lib chizilgan; ikkinchi kadr yo‘q.',
    main: {
      mode: 'edit',
      change:
        'the band: remove the rigid lime-green rod. The athlete holds a thin DARK-GREY elastic resistance band; it runs IN FRONT of the chest between the two hands and stretches as the arms open to the sides at shoulder height',
    },
    pair: { phaseUz: 'Boshlang‘ich holat', change: 'the start: both arms reaching straight FORWARD in front of the chest at shoulder height, the dark-grey band slack between the hands' },
  },
  {
    id: 'calf-raise',
    priority: 1,
    problem: 'Oyoq kafti zina chetida noaniq, tovon yetarli ko‘tarilmagan; ikkinchi kadr yo‘q.',
    main: { mode: 'edit', change: 'the feet and ankles: rise HIGH onto the balls of the feet on the step edge — heels about 8 cm above the step, ankles fully extended, knees straight' },
    pair: { phaseUz: 'Pastki nuqta', change: 'only the balls of the feet on the step edge, heels LOWERED BELOW the step edge (about 5 cm under its top surface), calves stretched, knees straight' },
  },
  {
    id: 'hanging-leg-raise',
    priority: 1,
    problem: 'Profilda turnik noto‘g‘ri yo‘nalishda (ko‘ndalang) chizilgan.',
    main: {
      mode: 'edit',
      change:
        'the pull-up bar: it runs from the athlete\'s left hand to the right hand, perpendicular to the direction the athlete faces — in this side view it is seen nearly end-on, pointing toward the camera, with both hands gripping it one behind the other',
    },
  },
  {
    id: 'dead-bug',
    priority: 1,
    problem: 'Cho‘zilgan qo‘l va oyoq bir tomonda — to‘g‘risi qarama-qarshi tomonlar (hozir rasm yashirilgan).',
    main: { mode: 'new', change: 'The extended arm and the extended leg are on OPPOSITE sides of the body (right arm + left leg) — never arm and leg of the same side.' },
    pair: {
      phaseUz: 'Boshlang‘ich holat',
      change: 'the start: BOTH arms pointing straight up to the ceiling, BOTH knees bent 90° directly above the hips (thighs vertical, shins horizontal), lower back flat on the floor',
    },
  },

  /* ---------- 2: harakat yo'q yoki noto'g'ri ikkinchi kadr ---------- */
  { id: 'push-up', priority: 2, problem: 'Faqat yuqori holat bor; pastki holat yo‘q.', pair: { phaseUz: 'Pastki nuqta', change: 'the bottom: chest about 3 cm above the floor, forearms VERTICAL with palms in the same place, elbows about 45° from the torso, body one straight line' } },
  { id: 'machine-shoulder-press', priority: 2, problem: '"Yuqori nuqta" kadrida tirsaklar hali 90° edi — olib tashlangan.', pair: { phaseUz: 'Yuqori nuqta', change: 'the top: arms extended overhead (elbows not locked), the handles and press arms moved up with the hands, back still on the pad' } },
  {
    id: 'db-shrug',
    priority: 2,
    problem: 'Ikki kadr deyarli bir xil — harakat ko‘rinmaydi.',
    main: { mode: 'edit', change: 'the shoulders: shrug them HIGH toward the ears (about 5 cm higher than now), the dumbbells rising by the same amount, arms straight' },
    pair: { phaseUz: 'Pastki nuqta', change: 'the bottom: shoulders relaxed DOWN, the dumbbells about 5 cm lower, arms straight' },
  },
  { id: 'dips', priority: 2, problem: 'Haqiqiy ikkinchi chet yo‘q (olib tashlangan).', pair: { phaseUz: 'Yuqori nuqta', change: 'the TOP of the dip: arms fully straight, body lifted about 25 cm, shoulders well above the hands, torso leaning forward 20°, same grip' } },
  { id: 'db-fly', priority: 2, problem: 'Yuqori kadrda tirsak burchagi o‘zgargan (olib tashlangan).', pair: { phaseUz: 'Yuqori nuqta', change: 'the top: the dumbbells brought together above the chest in a hugging arc with the SAME slight elbow bend as in image 1' } },
  { id: 'goblet-squat', priority: 2, problem: 'Ikkinchi kadrning kamerasi va masshtabi boshqa edi (olib tashlangan).', pair: { phaseUz: 'Yuqori nuqta', change: 'standing tall at the top: hips and knees extended, the dumbbell still held vertically against the chest with both hands' } },
  { id: 'hack-squat', priority: 2, problem: 'Ikkinchi kadr yo‘q.', pair: { phaseUz: 'Yuqori nuqta', change: 'standing up at the top: knees almost straight, the back still flat on the pad — the whole sled (back pad + shoulder pads together) has slid UP along the rails' } },
  { id: 'hip-thrust', priority: 2, problem: 'Ikkinchi kadr yo‘q.', pair: { phaseUz: 'Pastki nuqta', change: 'the bottom: the hips lowered about 30 cm toward the floor (hips flexed about 90°), the barbell moves DOWN with the hips, upper back still on the bench' } },
  { id: 'glute-bridge', priority: 2, problem: 'Ikkinchi kadr yo‘q; oyoqda ortiqcha naqsh va yoy chizig‘i.', main: { mode: 'edit', change: 'remove the stray decal/pattern on the leg and the thin stray arc line near the body; nothing else changes' }, pair: { phaseUz: 'Pastki nuqta', change: 'the bottom: hips resting ON THE FLOOR, lying flat on the back, knees bent, feet flat' } },
  { id: 'db-bench', priority: 2, problem: 'Ikkinchi kadrda harakat chiqmagan.', pair: { phaseUz: 'Pastki nuqta', change: 'the bottom: the dumbbells lowered beside the MID-CHEST, forearms vertical under the dumbbells, elbows about 45–60° from the torso' } },
  { id: 'machine-chest-press', priority: 2, problem: 'Ikkinchi kadr yo‘q.', pair: { phaseUz: 'Itarilgan holat', change: 'the pressed position: both arms pushed forward almost straight, the handles and their lever arms moved forward with the hands, back on the pad' } },
  { id: 'cable-fly', priority: 2, problem: 'Ikkinchi kadrda harakat chiqmagan.', pair: { phaseUz: 'Qisqargan holat', change: 'the contracted position: the hands brought together in front of the lower chest at arm\'s length, elbows with the SAME slight bend as in image 1, cables still running to the same pulleys' } },
  { id: 'inverted-row', priority: 2, problem: 'Ikkinchi kadr yo‘q.', pair: { phaseUz: 'Pastki nuqta', change: 'the bottom: arms fully straight, hanging under the bar, body still one straight line, heels on the floor, same grip' } },
  { id: 'back-extension', priority: 2, problem: 'Pastki kadrda gavda yetarli tushmagan.', pair: { phaseUz: 'Pastki nuqta', change: 'the bottom: torso bent forward over the hip pad until it points DOWN toward the floor (about 70–90° to the legs), back flat, arms crossed on the chest' } },
  { id: 'leg-extension', priority: 2, problem: 'Boshlang‘ich holatda tizza yetarli bukilmagan.', pair: { phaseUz: 'Boshlang‘ich holat', change: 'the start: knees bent about 90° with the shins vertical under the seat; the lever arm rotated DOWN and the roller still on the front of the lower shins' } },
  { id: 'leg-curl', priority: 2, problem: 'Qisqargan holatda tizza yetarli bukilmagan.', main: { mode: 'edit', change: 'the knees: bend them further to about 100–110° so the heels come under the seat; the roller and lever arm move with the lower legs' } },
  { id: 'leg-press', priority: 2, problem: 'Platforma harakatlanadi, yuk joyida qoladi; yozilgan holat kerak.', pair: { phaseUz: 'Yozilgan holat', change: 'legs pushed out almost straight (knees slightly bent, not locked); the footplate AND the weight horns with the plates move together as one sled along the rails' } },
  { id: 'deadlift', priority: 2, problem: 'Ikkinchi kadr masshtabi va kamerasi boshqa.', pair: { phaseUz: 'Yuqori nuqta', change: 'standing tall at lockout, the barbell hanging in straight arms against the thighs. Keep the SAME camera, framing and SCALE as image 1' } },
  { id: 'db-rdl', priority: 2, problem: 'Kadrlar orasida gantel ushlashi o‘zgaradi.', pair: { phaseUz: 'Yuqori nuqta', change: 'standing tall at the top, the dumbbells hanging in straight arms IN FRONT OF THE THIGHS with the SAME overhand grip as image 1' } },
  { id: 'bulgarian', priority: 2, problem: 'Ikki kadr orasida pol chizig‘i miltillaydi.', pair: { phaseUz: 'Yuqori nuqta', change: 'the top: front leg extended, the rear foot still on the bench, dumbbells at the sides; the floor and bench in EXACTLY the same place as image 1' } },

  /* ---------- 3: kosmetik ---------- */
  { id: 'db-row', priority: 3, problem: 'Tayanch qo‘lning yelkasida ortiqcha lime yorug‘lik.', main: { mode: 'edit', change: 'the glow: remove the lime glow from the SUPPORTING arm on the bench (natural deep red); keep the glow on the back and the working arm exactly as it is' } },
  { id: 'step-up', priority: 3, problem: 'Orqa oyoq platformadan uzoq va yoritilgan.', main: { mode: 'edit', change: 'the rear leg: the trailing foot closer to the box (about 30 cm behind it), and remove the lime glow from the rear leg (natural deep red)' } },
];
