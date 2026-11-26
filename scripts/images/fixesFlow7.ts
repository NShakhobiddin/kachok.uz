// Flow-7: Flow-6 tekshiruvida rad etilgan kadrlar (2026-11-26) va yetishmayotgan ikkinchi kadrlar.
// a — asosiy kadrni yangidan chizishdagi tuzatishlar (oldingi tavsif ustidan); b — ikkinchi kadr;
// bFrom: 'current' — ikkinchi kadr ilovadagi hozirgi asosiy kadrdan; aFromB — asosiy kadr tayyor ikkinchi kadrdan (Flow-6 da yaxshi chiqqan).

export interface Flow7Job {
  id: string;
  group: 'new' | 'old';
  female?: boolean;
  /** o‘zbekcha: nima uchun qayta */
  problem: string;
  a?: string;
  b?: { phaseUz: string; change: string };
  bFrom?: 'current';
  aFromB?: boolean;
}

const START = 'Boshlang‘ich holat';
const ECORCHE_FACE = 'The head is an écorché head with the skin removed (facial muscles visible) and the neat low hair bun — exactly like the style reference; no realistic skin face.';

export const FLOW7: Flow7Job[] = [
  /* ---------- yangi mashqlar: asosiy kadr rad etilgan ---------- */
  {
    id: 'db-reverse-fly',
    group: 'new',
    problem: 'Gavda ~45° engashgan va kameraga burilgan — yonga ko‘tarishga o‘xshaydi; yorug‘lik orqa deltada emas.',
    a: 'Hips hinged back until the torso is nearly parallel to the floor (back flat, about 75° forward, head in line with the spine), knees slightly bent. No torso rotation: shoulders square to the floor. Arms raised out to the sides, perpendicular to the torso, forming a T at shoulder level, elbows slightly bent. Use a high side or rear three-quarter camera so the upper back and the backs of the shoulders face the viewer. Brightest glow on the rear deltoids, dimmer on the mid-traps and rhomboids.',
  },
  {
    id: 'single-leg-rdl',
    group: 'new',
    problem: 'Boshda tabiiy teri va soch; gantel tayanch oyoq tomonidagi qo‘lda.',
    a: 'Bald écorché head with the skin removed (facial muscles visible, no hair), matching the body. Keep the pose. The dumbbell is clearly in the LEFT hand (opposite the standing right leg) and the right arm hangs empty; or shoot from the athlete\'s left side so the loaded hand is the near one.',
  },
  {
    id: 'pallof-press',
    group: 'new',
    problem: 'Kamera to‘g‘ri oldidan — qo‘llar ko‘krakda chalishgandek; B da blok pastga siljigan, ko‘krak yoritilgan.',
    a: 'Camera 35–45° in front of the athlete\'s side (or a clean side view) so the straight arms visibly extend forward from the sternum. Hands at sternum height on a single D-handle. Shoulders and hips square to the front, no rotation toward the cable. The cable runs sideways in a straight line from the pulley set at chest height to the hands. Glow brightest on the obliques and rectus abdominis, none on the pecs.',
  },
  {
    id: 'hanging-knee-raise',
    group: 'new',
    problem: 'Ikki turnik «X» bo‘lib kesishgan; kadr tor — B da oyoqlar kesilgan.',
    a: 'ONE straight, level pull-up bar spanning a power rack and running left-right across the image, no second crossing bar. Pull the camera back so a full dead hang with straight legs would also fit, with the feet well above the floor and margin below. Pose: straight arms, overhand shoulder-width grip, knees raised with the thighs above parallel, pelvis tucked, torso vertical.',
  },
  {
    id: 'incline-push-up',
    group: 'new',
    female: true,
    problem: 'Qo‘llar deyarli to‘g‘ri — pastki nuqta emas; yuz tabiiy terida; B deyarli bir xil.',
    a: `Bottom position: hands on the bench edge slightly wider than the shoulders, elbows bent ~90° and tucked ~45° from the torso, chest a few cm from the bench edge. Body in one straight line from head to heels, on the balls of the feet. ${ECORCHE_FACE}`,
  },
  {
    id: 'nordic-curl',
    group: 'new',
    female: true,
    problem: 'Tizzalar gilamdan ~25 sm yuqorida «osilib», to‘piqlar divan ostiga qistirilmagan.',
    a: 'Knees and shins resting FLAT on the thick mat; the backs of the heels/ankles hooked under the low front edge of a heavy sofa (visible gap under it) at mat level. Mid-lowering: one straight line from knees through hips and shoulders to the head, leaning forward about 45° from vertical, hips fully extended. Hands in front of the chest, palms forward. Nothing floats.',
  },
  {
    id: 'lateral-lunge',
    group: 'new',
    female: true,
    problem: 'Yuz tabiiy terida (boshqa rasmlarga mos emas).',
    a: `${ECORCHE_FACE} Hips shifted back and down over the bent right leg with a slight forward lean and flat back; right thigh close to parallel, right knee over the toes; left leg straight with the foot flat; hands clasped in front of the chest; straight front camera.`,
  },

  /* ---------- yangi mashqlar: faqat ikkinchi kadr (asosiy kadr ilovada) ---------- */
  {
    id: 'sumo-deadlift',
    group: 'new',
    problem: 'Ikkinchi kadr yo‘q (pastda, shtanga polda).',
    bFrom: 'current',
    b: { phaseUz: 'Pastki nuqta', change: 'the start position: the bar resting on the floor over mid-foot, plates ON the floor with contact shadows, bar touching the shins; very wide stance with toes out ~45°, knees pushed out over the toes; both arms hanging vertically INSIDE the knees; hips below the shoulders, torso 45–55° forward, flat back, chest up' },
  },
  {
    id: 'cable-overhead-extension',
    group: 'new',
    problem: 'Ikkinchi kadr yo‘q.',
    bFrom: 'current',
    b: { phaseUz: 'Yuqori nuqta', change: 'the elbows fully straightened: the upper arms stay EXACTLY where they are (pointing up beside the ears) and only the elbows extend, so the hands finish above and slightly in front of the forehead with the rope ends pulled apart; the cable runs from the low pulley up behind the back and over the shoulder, never across the face' },
  },
  {
    id: 'farmers-carry',
    group: 'new',
    problem: 'Ikkinchi kadr yo‘q (keyingi qadam).',
    bFrom: 'current',
    b: { phaseUz: 'Keyingi qadam', change: 'the opposite stride: the leg that is behind swings forward and lands heel-first, the leg that is in front is now behind pushing off the ball of the foot; torso, arms and dumbbells unchanged' },
  },
  {
    id: 'reverse-pec-deck',
    group: 'new',
    problem: 'Ikkinchi kadr yo‘q (qo‘llar oldinda).',
    bFrom: 'current',
    b: { phaseUz: START, change: 'the start: both arms reaching straight forward in front of the chest at shoulder height, hands close together on the handles, the same slight elbow bend, chest still on the pad' },
  },

  /* ---------- eski mashqlar: qayta ---------- */
  {
    id: 'chin-up',
    group: 'old',
    problem: 'Ushlash yana to‘g‘ri (kaftlar oldinga) chiqdi; pastki kadr osilish emas.',
    a: 'UNDERHAND grip: palms face the athlete\'s own face. If drawn from the front, the BACKS of the hands and the knuckles are on top of the bar, the fingertips hidden behind it, the thumbs on the outer side. Prefer a SIDE or front three-quarter camera where the palm direction is unambiguous. Chin clearly above the bar, elbows down in front of the ribs.',
    b: { phaseUz: 'Pastki nuqta', change: 'true dead hang: arms fully straight overhead on the same underhand grip and the same bar, the body lowered by the arm length, shoulders engaged, legs together, feet fully drawn or cut only by the bottom edge' },
  },
  {
    id: 'leg-curl',
    group: 'old',
    problem: 'Rolik yana boldir oldida; tizza ~90°.',
    a: 'Seated leg curl: the lower roller pad BEHIND the lower calves just above the heels (never on the front of the shins). Contracted: knees flexed 120–130° with the heels pulled back under the front edge of the seat; the thigh pad clamped on the lower thighs above the knees; hands on the side handles, back on the backrest.',
    b: { phaseUz: START, change: 'the start: legs almost straight in front, the roller still BEHIND the lower calves just above the heels' },
  },
  {
    id: 'calf-raise',
    group: 'old',
    problem: 'Bir oyoq havoda, ikkinchisining tovoni deyarli ko‘tarilmagan.',
    a: 'BOTH feet side by side with only the balls of the feet on the step edge and the heels overhanging behind it; FULL rise: heels clearly high above the step surface, soles angled 40–50°; knees straight, body tall, one hand lightly on a support post; no foot off the step.',
    b: { phaseUz: 'Pastki nuqta', change: 'the bottom: heels lowered well BELOW the step surface, the body visibly lower, balls of the feet on the same spot' },
  },
  {
    id: 'curtsy-lunge',
    group: 'old',
    female: true,
    problem: 'Oyoqlar yana kesishmadi — oddiy hamla.',
    a: 'The rear (right) leg clearly crosses diagonally BEHIND the front (left) leg: rear knee just above the floor behind and outside the front heel, rear foot on its toes beyond the front foot, thighs and shins form a visible X. Use a straight FRONT or rear three-quarter camera where the crossing cannot be misread. Front knee ~90° over the toes, hips square, torso upright, hands on hips. Glow on the front-leg quads and glute medius.',
    b: { phaseUz: START, change: 'standing tall with the feet hip-width apart exactly on the front-foot spot, hands on hips' },
  },
  {
    id: 'band-row',
    group: 'old',
    female: true,
    problem: 'Qo‘llar orqada birlashgan; lenta oyoq kafti ostida ko‘rinmaydi.',
    a: 'Each hand finishes beside its own flank at the lower ribs, elbows just behind the torso (never behind the back). Two strands run from the hands straight to the feet and visibly loop UNDER both soles at the arches. Legs extended with a soft knee bend, torso upright, shoulder blades squeezed.',
    b: { phaseUz: START, change: 'arms straight forward at lower-chest height in line with the band toward the feet, exactly two taut strands looping under the soles; the same torso orientation' },
  },
  {
    id: 'hip-adduction',
    group: 'old',
    female: true,
    problem: 'Ikkala yostiq tizzalar tashqarisida (abduktor sozlanishi).',
    a: 'ADDUCTOR setup: both pads BETWEEN the knees, pressing on the inner sides of the knees and lower thighs; knees squeezed together so the pads almost touch. Black sneakers on the footrests, torso upright, hands on the side handles, glow only on the inner-thigh adductors.',
    b: { phaseUz: START, change: 'knees spread wide, the pads still on the inner sides of the knees, the pad arms swung outward with the legs' },
  },
  {
    id: 'cross-body-shoulder',
    group: 'old',
    female: true,
    problem: 'Yordamchi qo‘l yana tirsak yoki bilakdan ushlagan; B da boshqa qo‘l ko‘tarilgan.',
    a: 'The LEFT hand presses on the right UPPER ARM midway between shoulder and elbow (clearly closer to the shoulder than the elbow), the elbow joint and forearm free beyond the hand; the right arm straight across the chest at or just below shoulder height, right shoulder down, torso facing forward.',
    b: { phaseUz: START, change: 'the same RIGHT arm reaching straight forward at shoulder height with an open natural hand, the left arm relaxed at the side' },
  },
  {
    id: 'figure-four',
    group: 'old',
    female: true,
    problem: 'Uchta oyoq kafti chizilgan; qo‘llar tayanch son ortida emas.',
    a: 'EXACTLY two legs and two feet. The crossed ankle rests on the supporting thigh just below the knee, crossed foot flexed, crossed knee opening out to the side; the supporting foot lifted, both hands interlaced BEHIND the supporting thigh (crossed-side arm threaded through the gap); head, shoulders and sacrum on the mat; glow only on the crossed-leg glute; slightly elevated three-quarter camera.',
    b: { phaseUz: START, change: 'the supporting foot flat on the mat, the crossed ankle on the supporting thigh, the crossed knee opened to the side, hands resting beside the body' },
  },
  {
    id: 'hip-flexor-stretch',
    group: 'old',
    female: true,
    problem: 'Yangi kadrda shortik yo‘q; B kadr A bilan bir xil.',
    a: 'The woman wears the dark grey compression shorts and sports bra (like all other images). Half-kneeling, rear knee on a folded towel, pelvis tucked (flat lower back), hips shifted 3–5 cm forward; glow ONLY on the front of the hip and the front of the REAR (kneeling) thigh.',
    b: { phaseUz: START, change: 'only the pelvis moves back ~5 cm so the rear thigh is exactly vertical under the hip with a neutral pelvis; camera, towel, feet, knee spot and hands exactly as in image 1' },
  },
  {
    id: 'knee-push-up',
    group: 'old',
    female: true,
    aFromB: true,
    problem: 'Pastki nuqta yana chiqmadi; Flow-6 dagi yuqori kadr yaxshi — undan pastki kadr.',
    a: 'the TRUE BOTTOM: chest 2–3 cm above the mat, elbows ~90° and 30–45° from the torso, shoulders down at elbow height, one straight line from knees through hips to head — the shoulders drop by about a forearm length compared with image 1',
  },
  {
    id: 'ab-wheel',
    group: 'old',
    female: true,
    aFromB: true,
    problem: 'Cho‘zilgan holat yana qisqa; Flow-6 dagi boshlang‘ich kadr yaxshi — undan cho‘zilgan kadr.',
    a: 'FULL kneeling rollout: the wheel rolled far in front of the head, arms straight overhead (~150° shoulder flexion), hips extended so knees, hips and shoulders form one straight slightly inclined line, no hip bend or lower-back sag, pelvis tucked, head neutral; knees on the same spot as in image 1',
  },

  /* ---------- eski mashqlar: faqat ikkinchi kadr (ilovadagi asosiy kadrdan) ---------- */
  { id: 'reverse-crunch', group: 'old', female: true, bFrom: 'current', problem: 'Boshlang‘ich holat (tos polda) yo‘q.', b: { phaseUz: START, change: 'the start: sacrum and buttocks flat on the mat with no gap, thighs exactly vertical with the knees over the hips, shins horizontal pointing AWAY from the head; arms and head identical' } },
  { id: 'butterfly', group: 'old', female: true, bFrom: 'current', problem: 'Chuqurroq holat yo‘q (gavda tosdan oldinga).', b: { phaseUz: 'Chuqurroq holat', change: 'lean the whole torso forward from the hips 15–25°: the shoulders and head drop lower and come slightly closer to the camera, head in line with the spine (no neck flexion), face visible; legs, feet and hand grip identical' } },
  { id: 't-bar-row', group: 'old', female: true, bFrom: 'current', problem: 'Yuqori nuqta yo‘q.', b: { phaseUz: 'Yuqori nuqta', change: 'the top: the handle stays hooked under the bar behind the plates, so the loaded bar end rises with the hands to the upper abdomen pivoting in the landmine; elbows pulled back alongside the torso, the same torso angle' } },
  { id: 'side-plank', group: 'old', female: true, bFrom: 'current', problem: 'Boshlang‘ich holat (tos polda) yo‘q.', b: { phaseUz: START, change: 'the start: the same forearm support and stacked feet, the same top arm and neutral head; ONLY the pelvis lowered to rest on the mat' } },
  { id: 'bicycle-crunch', group: 'old', female: true, bFrom: 'current', problem: 'Ikkinchi tomon yo‘q.', b: { phaseUz: 'Ikkinchi tomon', change: 'the mirror side: the knee that is bent in image 1 now extends straight and low, the extended leg is now pulled to the chest, and the torso rotates the other way so the opposite elbow comes across toward that knee; the mat and body position on the mat stay the same' } },
  { id: 'incline-bench', group: 'old', bFrom: 'current', problem: 'Yuqori nuqta yo‘q (yangi asosiy kadr boshqa kamerada).', b: { phaseUz: 'Yuqori nuqta', change: 'the top: arms straight (elbows soft), the bar directly above the shoulders, the same grip and bench angle' } },
];
