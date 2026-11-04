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
    problem: 'Ushlash pull-up bilan bir xil: kaft oldinga, yelkadan keng. Chin-up — kaft o‘ziga, yelka kengligida. (Asosiy kadr tuzatildi; ikkinchi kadr kerak.)',
    main: {
      mode: 'new',
      change:
        'Camera: FRONT three-quarter view, 30° to the athlete\'s right, at chest height, so the palms are clearly visible. UNDERHAND (supinated) grip: palms facing the athlete\'s own face, hands exactly shoulder-width apart, thumbs wrapped around the bar. The chin clearly ABOVE the bar at the top, elbows pulled down beside the ribs.',
    },
    pair: {
      phaseUz: 'Pastki nuqta',
      change:
        'dead hang: arms fully straight overhead with the SAME underhand (palms toward the face) shoulder-width grip on the SAME bar. The bar stays EXACTLY where it is in image 1 (same position, same angle, same length) and the camera does NOT move or zoom out, so the athlete keeps exactly the same size; the body simply hangs lower by the length of the arms — it is fine if the lower legs and feet are cut off by the bottom edge of the image',
    },
  },
  {
    id: 'pull-up',
    priority: 1,
    problem: 'Yuqori nuqtada iyak turnik sathida; orqadan iyak ko‘rinmaydi va tahrir ikki marta ishlamadi — kamera yon-orqaga olinib, yangidan.',
    main: {
      mode: 'new',
      change:
        'Camera: from BEHIND the athlete and about 40° to the athlete\'s right, at bar height, so the bar, both hands, the side of the head and the CHIN are clearly visible. Framing: the bar in the upper fifth of the image and about a quarter of empty space below the feet, because the second frame shows the body hanging lower. TOP of the pull-up: overhand grip slightly wider than the shoulders; the CHIN is clearly ABOVE the bar — the bar is level with the collarbones; elbows pulled down and back beside the ribs; legs straight and together.',
    },
    pair: {
      phaseUz: 'Pastki nuqta',
      change: 'dead hang: arms fully straight overhead with the SAME overhand grip on the SAME bar (the bar does not move), shoulders slightly engaged, the body straight and lower by the length of the arms; the camera does NOT move or zoom out, the athlete stays the same size',
    },
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
    problem: 'Gantel dastasi bilak bo‘ylab — ushlab bo‘lmaydigan holat; tahrir ikki marta ishlamadi — yangidan.',
    main: {
      mode: 'new',
      change:
        'Each dumbbell is held correctly: the handle lies ACROSS the palm, gripped by the fist, and points straight FORWARD toward the camera, perpendicular to the arm. Seen from the front, each dumbbell is END-ON: one weight head in front of the fist, the other hidden behind it. The two heads of a dumbbell must NEVER sit on the left and right of the hand along the line of the arm. Arms raised out to the sides exactly to shoulder height, elbows slightly bent, knuckles up.',
    },
    pair: { phaseUz: 'Boshlang‘ich holat', change: 'the start: arms hanging down at the sides, the dumbbells beside the thighs with the handles pointing forward, palms facing the thighs, shoulders relaxed' },
  },
  {
    id: 'incline-bench',
    priority: 1,
    problem: 'Pastki nuqtada shtanga ko‘krakka tushmagan; yondan disk ko‘krakni to‘sadi va tahrir ishlamadi — kamera old-yonga olinib, yangidan.',
    main: {
      mode: 'new',
      change:
        'Camera: three-quarter view from the athlete\'s front-right (about 45° from the side), slightly above bench height (about 20° down), so the bar touching the chest is clearly visible and NOT hidden behind the weight plates. BOTTOM of the rep: the barbell RESTS ON the upper chest just below the collarbones (bar and chest in contact, no gap); grip slightly wider than the shoulders, forearms vertical under the bar, elbows about 60° from the torso; shoulder blades back; feet flat on the floor.',
    },
    pair: { phaseUz: 'Yuqori nuqta', change: 'the top: arms fully extended, the barbell straight above the upper chest and shoulders, the same grip; the bench and the feet stay exactly in place' },
  },
  {
    id: 'close-grip-bench',
    priority: 1,
    problem: 'Pastki nuqtada shtanga ko‘krakdan ~15 sm yuqorida; tahrir ishlamadi — kamera old-yonga olinib, yangidan.',
    main: {
      mode: 'new',
      change:
        'Camera: three-quarter view from the athlete\'s front-right (about 45° from the side), slightly above bench height (about 20° down), so the bar touching the chest is clearly visible and NOT hidden behind the weight plates. BOTTOM of the rep: the barbell RESTS ON the lower chest (bar and chest in contact, no gap); hands exactly shoulder-width apart — clearly narrower than a normal bench press; elbows tucked 20–30° from the torso; forearms vertical under the bar; feet flat on the floor.',
    },
    pair: { phaseUz: 'Yuqori nuqta', change: 'the top: arms fully extended, the barbell straight above the lower chest, the same close grip; the bench and the feet stay exactly in place' },
  },
  {
    id: 'barbell-row',
    priority: 1,
    problem: 'Yuqori nuqtada shtanga qoringa tegmaydi; yondan disk qo‘lni to‘sadi va tahrir ishlamadi — kamera old-yonga olinib, yangidan.',
    main: {
      mode: 'new',
      change:
        'Camera: three-quarter view from the athlete\'s front-right (about 40° from the side) at hip height, so the bar, both hands and the abdomen are clearly visible and NOT hidden behind the weight plates. TOP of the row: torso hinged forward about 45° with a flat back, knees slightly bent; overhand grip slightly wider than the shoulders; the barbell pulled up until it TOUCHES the lower abdomen just below the navel (no gap); elbows driven back behind the torso; shoulder blades squeezed.',
    },
    pair: { phaseUz: 'Pastki nuqta', change: 'the bottom: arms hanging fully straight, the barbell just below the knees in front of the shins, the same grip; torso angle, back and feet unchanged' },
  },
  {
    id: 'reverse-fly',
    priority: 1,
    problem: 'Asosiy kadr tuzatildi (ingichka lenta); ikkinchi kadr kerak.',
    main: {
      mode: 'edit',
      change:
        'the band: remove the rigid lime-green rod. The athlete holds a thin DARK-GREY elastic resistance band; it runs IN FRONT of the chest between the two hands and stretches as the arms open to the sides at shoulder height',
    },
    pair: {
      phaseUz: 'Boshlang‘ich holat',
      change: 'the start: both arms reaching straight FORWARD in front of the chest at shoulder height (seen from behind, mostly hidden by the torso, the hands just visible at the sides), the same thin dark-grey band slack between the hands; the camera does NOT move',
    },
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
    pair: { phaseUz: 'Pastki nuqta', change: 'the bottom: dead hang with straight arms and straight legs hanging down, the same grip on the same bar seen end-on' },
  },
  {
    id: 'dead-bug',
    priority: 1,
    problem: 'Cho‘zilgan holat yo‘q: Flow qo‘lni bosh orqasiga cho‘zmadi. Hozir ilovada faqat boshlang‘ich holat — cho‘zilgan holat undan, o‘sha kamerada.',
    main: { mode: 'new', change: 'The extended arm and the extended leg are on OPPOSITE sides of the body (right arm + left leg) — never arm and leg of the same side.' },
    pair: {
      phaseUz: 'Cho‘zilgan holat',
      change:
        'the extended position, arm and leg of OPPOSITE sides: the arm NEARER the camera (the right arm) reaches straight back OVERHEAD beyond the top of the head, parallel to the floor and just above it, clearly visible past the head; the leg FARTHER from the camera (the left leg) extends straight out just above the floor; the other arm keeps pointing straight up at the ceiling and the other leg stays bent 90° with the knee above the hip; lower back pressed flat to the floor',
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
  {
    id: 'leg-curl',
    priority: 2,
    problem: 'Qisqargan holatda tizza yetarli bukilmagan; tahrir ishlamadi — yangidan.',
    main: {
      mode: 'new',
      change:
        'Seated leg curl machine: the athlete sits upright with the back on the backrest, the thigh pad locked down on the lower thighs just above the knees, hands on the side handles. CONTRACTED position: the knees bent to about 110° — the heels pulled back UNDER the front edge of the seat; the shin roller behind the lower calves has rotated down and back together with the lower legs. Camera: three-quarter view from the athlete\'s front-right at seat height.',
    },
    pair: { phaseUz: 'Boshlang‘ich holat', change: 'the start: legs extended forward almost straight (knees slightly bent), the shin roller behind the lower calves just above the ankles raised up together with the legs; the thigh pad, seat and backrest unchanged' },
  },
  {
    id: 'leg-press',
    priority: 2,
    problem: 'Plastinalar ramada turibdi, chana bo‘sh — yuk platforma bilan harakatlanmaydi; ikkala kadr yangidan.',
    main: {
      mode: 'new',
      change:
        'The weight plates are loaded ONLY on the two weight horns fixed to the MOVING SLED (the carriage that carries the footplate and slides up the 45° rails). There are NO plates on the frame base or anywhere else. BOTTOM position: knees bent to about 90°, thighs toward the chest, lower back and hips flat on the seat pad, feet flat on the footplate shoulder-width apart, hands on the side handles. Framing: the sled at the lower end of the rails with free rail length visible above it, because the second frame shows the sled pushed up.',
    },
    pair: { phaseUz: 'Yozilgan holat', change: 'legs pushed out almost straight (knees slightly bent, not locked); the footplate, the sled AND the plates on its horns have moved together up the rails as one piece; the seat, frame and rails stay exactly in place' },
  },
  { id: 'deadlift', priority: 2, problem: 'Ikkinchi kadr masshtabi va kamerasi boshqa.', pair: { phaseUz: 'Yuqori nuqta', change: 'standing tall at lockout, the barbell hanging in straight arms against the thighs. Keep the SAME camera, framing and SCALE as image 1' } },
  { id: 'db-rdl', priority: 2, problem: 'Kadrlar orasida gantel ushlashi o‘zgaradi.', pair: { phaseUz: 'Yuqori nuqta', change: 'standing tall at the top, the dumbbells hanging in straight arms IN FRONT OF THE THIGHS with the SAME overhand grip as image 1' } },
  { id: 'bulgarian', priority: 2, problem: 'Ikki kadr orasida pol chizig‘i miltillaydi.', pair: { phaseUz: 'Yuqori nuqta', change: 'the top: front leg extended, the rear foot still on the bench, dumbbells at the sides; the floor and bench in EXACTLY the same place as image 1' } },

  /* ---------- 3: kosmetik ---------- */
  { id: 'db-row', priority: 3, problem: 'Tayanch qo‘lning yelkasida ortiqcha lime yorug‘lik.', main: { mode: 'edit', change: 'the glow: remove the lime glow from the SUPPORTING arm on the bench (natural deep red); keep the glow on the back and the working arm exactly as it is' } },
  { id: 'step-up', priority: 3, problem: 'Orqa oyoq platformadan uzoq va yoritilgan.', main: { mode: 'edit', change: 'the rear leg: the trailing foot closer to the box (about 30 cm behind it), and remove the lime glow from the rear leg (natural deep red)' } },
];
