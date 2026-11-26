// Ilovaga qo'shish taklif qilinayotgan yangi mashqlar uchun rasm tavsiflari (2026-11 auditi).
// Mashq hali ilovada yo'q, shuning uchun mushak yorqinligi EMG jadvalidan emas — shu yerda qo'lda (adabiyot bo'yicha).
// A — asosiy kadr (mushak va texnika yorliqlari shu rasmga qo'yiladi), B — harakatning boshqa cheti (o'sha kamera va odam).
// Flow to'plami: npx vite-node scripts/images/flow-pack3.ts -- <chiqish>

export interface NewExerciseSpec {
  /** ilovadagi nomi (taklif) */
  uz: string;
  en: string;
  /** nega kerak — audit xulosasi */
  why: string;
  female: boolean;
  phase: string;
  phaseUz: string;
  camera: string;
  technique: string[];
  glow: { top: string[]; mid?: string[]; low?: string[] };
  equipment: string;
  pair: { phaseUz: string; change: string };
}

const SIDE = "side view from the athlete's right at hip height, 50mm lens";
const REAR34 = "rear three-quarter view — 30° behind the athlete's right side, at shoulder height, 50mm lens";
const FRONT34 = "front three-quarter view — 30° in front of the athlete's right side, at chest height, 50mm lens";
const START = 'Boshlang‘ich holat';

export const NEW_SPECS: Record<string, NewExerciseSpec> = {
  /* ---------- zal (erkak figura) ---------- */
  'straight-arm-pulldown': {
    uz: 'Blokda to‘g‘ri qo‘l bilan pastga tortish',
    en: 'Straight-Arm Cable Pulldown',
    why: 'Keng orqa uchun yagona izolyatsiya mashqi — bitseps charchamaydi; hozir orqa faqat ko‘p bo‘g‘imli tortishlar bilan.',
    female: false,
    phase: 'the end position, hands pulled down to the thighs',
    phaseUz: 'Pastki nuqta',
    camera: SIDE.replace('hip height', 'chest height'),
    technique: [
      'Standing about one step back from a high cable pulley, feet hip-width, knees slightly soft, hips hinged so the torso leans forward about 30° with a neutral flat back.',
      'Both hands hold a straight bar (or rope) attachment with an overhand grip, shoulder-width; the ARMS STAY STRAIGHT with only a slight fixed bend at the elbows.',
      'End position: the bar pulled down in an arc until it touches the front of the thighs, shoulders depressed, lats squeezed, chest up; the cable runs in a straight line from the high pulley to the bar.',
    ],
    glow: { top: ['latissimus dorsi', 'teres major'], mid: ['long head of the triceps', 'rear deltoid'], low: ['rectus abdominis', 'lower pectoral fibers'] },
    equipment: 'Cable station with a HIGH pulley above head height and a straight short bar attachment connected to the cable; weight stack visible behind.',
    pair: { phaseUz: START, change: 'the start: the straight arms raised in front at about eye level following the cable up toward the high pulley, the same hip hinge, flat back and slight fixed elbow bend, lats stretched' },
  },
  'reverse-pec-deck': {
    uz: 'Batterflayda orqa delta (teskari)',
    en: 'Reverse Pec Deck',
    why: 'Orqa delta uchun eng barqaror mashq; hozir orqa deltaga faqat arqon tortish va lenta bor.',
    female: false,
    phase: 'the end position, arms opened back',
    phaseUz: 'Ochilgan holat',
    camera: 'high rear three-quarter view — 35° behind the athlete\'s right side, about 30° above shoulder height, 50mm lens — so the rear shoulders and upper back are clearly visible',
    technique: [
      'Seated FACING the pec deck machine with the chest against the back pad, feet flat, seat height so the handles are at shoulder height.',
      'Hands grip the vertical (or horizontal) rear-delt handles with a neutral grip, arms almost straight with a slight fixed elbow bend.',
      'End position: arms swept back in a wide horizontal arc until they are in line with the torso (not behind it), shoulder blades only slightly together, neck relaxed, no shrugging.',
    ],
    glow: { top: ['rear deltoids'], mid: ['middle trapezius', 'rhomboids', 'infraspinatus'], low: ['side deltoids'] },
    equipment: 'Pec deck / rear delt fly machine: padded seat, tall chest pad, two swinging arms with handles, weight stack behind the machine.',
    pair: { phaseUz: START, change: 'the start: both arms reaching straight forward in front of the chest at shoulder height, hands close together on the handles, the same slight elbow bend, chest still on the pad' },
  },
  'db-reverse-fly': {
    uz: 'Engashib gantel yoyish (orqa delta)',
    en: 'Bent-Over Dumbbell Reverse Fly',
    why: 'Faqat gantel bilan orqa delta — uyda ham, zalda ham; yelka sog‘lig‘i va qad uchun.',
    female: false,
    phase: 'the top position, arms raised out to the sides',
    phaseUz: 'Yuqori nuqta',
    camera: 'high front three-quarter view — 35° in front of the athlete\'s right side, about 30° above shoulder height, 50mm lens',
    technique: [
      'Feet hip-width, knees slightly bent, hips hinged so the torso is almost parallel to the floor (about 70–80° forward), neutral flat back, head in line with the spine.',
      'A light dumbbell in each hand with a neutral grip (palms facing each other), elbows slightly bent and fixed.',
      'Top position: both arms raised out to the sides in a wide arc until the upper arms are level with the torso, forming a "T" — not higher; no shrugging, torso does not rise.',
    ],
    glow: { top: ['rear deltoids'], mid: ['middle trapezius', 'rhomboids', 'infraspinatus'], low: ['erector spinae'] },
    equipment: 'Two light hexagonal black dumbbells.',
    pair: { phaseUz: START, change: 'the start: both dumbbells hanging straight down under the shoulders, palms facing each other, the same hip hinge and flat back' },
  },
  'lying-leg-curl': {
    uz: 'Yotib oyoq bukish',
    en: 'Lying Leg Curl',
    why: 'Ko‘p zallarda o‘tirib emas, yotib bukish trenajyori bor; son orqasi uchun ikkinchi variant.',
    female: false,
    phase: 'the top position, knees fully bent',
    phaseUz: 'Bukilgan holat',
    camera: SIDE.replace('hip height', 'bench height'),
    technique: [
      'Lying face down on the angled bench of the machine, kneecaps just off the edge of the pad, hips pressed down into the pad, hands holding the front handles.',
      'The ankle roller pad rests on the back of the lower legs just above the heels.',
      'Top position: knees bent to about 110–120°, heels pulled toward the glutes, hips stay DOWN on the pad (not lifting), feet flexed.',
    ],
    glow: { top: ['hamstrings (biceps femoris and inner hamstrings)'], mid: ['gastrocnemius'], low: [] },
    equipment: 'Prone (lying) leg curl machine: angled padded bench with handles at the front, a lever arm with an ankle roller pad at the foot end, weight stack.',
    pair: { phaseUz: START, change: 'the start: legs almost straight with the knees only slightly bent, the roller pad lowered with the lower legs, hips still pressed into the pad' },
  },
  'db-lunge': {
    uz: 'Gantel bilan oldinga hamla',
    en: 'Dumbbell Forward Lunge',
    why: 'Klassik hamla gantel bilan yo‘q (faqat orqaga va split); yurib bajarish varianti bilan.',
    female: false,
    phase: 'the bottom position of the lunge',
    phaseUz: 'Pastki nuqta',
    camera: FRONT34.replace('chest height', 'hip height'),
    technique: [
      'Torso upright, a dumbbell in each hand hanging at the sides with straight arms, shoulders down.',
      'Bottom position after a long step FORWARD with the right leg: front thigh parallel to the floor, front knee above the middle of the foot (not caving in), front heel flat.',
      'Back knee lowered to just above the floor (a few centimeters), back heel raised, hips square and level, both knees at about 90°.',
    ],
    glow: { top: ['quadriceps of the front leg', 'gluteus maximus of the front leg'], mid: ['adductors', 'hamstrings'], low: ['calves', 'forearm flexors'] },
    equipment: 'Two hexagonal black dumbbells.',
    pair: { phaseUz: START, change: 'standing tall at the start: both feet side by side hip-width apart, knees straight, dumbbells hanging at the sides, the same camera and athlete' },
  },
  'single-leg-rdl': {
    uz: 'Bir oyoqda rumincha tortish',
    en: 'Single-Leg Romanian Deadlift',
    why: 'Son orqasi va dumba bir tomonlama + muvozanat; uyda ham bajariladi, jarohatdan himoya.',
    female: false,
    phase: 'the bottom position, torso hinged forward on one leg',
    phaseUz: 'Pastki nuqta',
    camera: SIDE,
    technique: [
      'Standing on the RIGHT leg (the leg nearest the camera) with the knee slightly bent and fixed; the left leg extends straight back in line with the torso.',
      'Torso hinged forward from the hips until almost parallel to the floor, the body forming a "T" with the back leg; the back stays flat, hips square (the raised leg\'s toes point down).',
      'A dumbbell in the LEFT hand (opposite to the standing leg) hangs straight down below the shoulder, close to the standing leg, near mid-shin.',
    ],
    glow: { top: ['hamstrings of the standing leg', 'gluteus maximus of the standing leg'], mid: ['gluteus medius', 'erector spinae'], low: ['calves', 'forearm flexors'] },
    equipment: 'One hexagonal black dumbbell.',
    pair: { phaseUz: START, change: 'standing tall at the start on the same right leg, the left foot lifted just off the floor beside it, torso upright, the dumbbell hanging at the left thigh' },
  },
  'cable-overhead-extension': {
    uz: 'Blokda bosh ortidan triseps (arqon)',
    en: 'Cable Overhead Triceps Extension',
    why: 'Trisepsning uzun boshi cho‘zilgan holatda ishlaydi — tadqiqotda o‘sish pushdown’dan ko‘proq (Maeo 2023).',
    female: false,
    phase: 'the stretched position behind the head',
    phaseUz: 'Pastki nuqta',
    camera: SIDE.replace('hip height', 'shoulder height'),
    technique: [
      'Facing AWAY from a low cable pulley in a split stance, torso leaning forward about 20–30°, core braced, neutral spine.',
      'Both hands hold the ends of a rope attachment behind the head; the upper arms point forward-up next to the ears and stay fixed.',
      'Stretched position: elbows bent to about 45° or less so the hands are behind the head near the upper back, the cable running from behind the athlete up over the shoulders to the hands.',
    ],
    glow: { top: ['triceps long head'], mid: ['triceps lateral and medial heads'], low: ['rectus abdominis'] },
    equipment: 'Cable station with the pulley set at low-to-mid height behind the athlete, a rope attachment with two black end knobs connected to the cable.',
    pair: { phaseUz: 'Yuqori nuqta', change: 'the elbows fully straightened: arms extended forward-up in line with the ears, the rope ends pulled apart in front of the head, upper arms in the same position' },
  },
  'farmers-carry': {
    uz: 'Fermer yurishi',
    en: "Farmer's Carry",
    why: 'Bilak, trapetsiya va qorin — kundalik kuch; bilak uchun alohida mashq yo‘q.',
    female: false,
    phase: 'mid-stride while walking',
    phaseUz: 'Yurish',
    camera: FRONT34.replace('chest height', 'hip height'),
    technique: [
      'Walking tall with a heavy dumbbell (or kettlebell) in each hand at the sides, arms straight, shoulders down and back, chest up, head neutral, eyes forward.',
      'Mid-stride: short controlled steps, the right foot in front just landing heel-first, the torso stays upright without leaning to either side.',
      'Grip tight around the handles, the weights do not touch the legs.',
    ],
    glow: { top: ['forearm flexors', 'upper trapezius'], mid: ['obliques', 'rectus abdominis', 'gluteus medius'], low: ['quadriceps', 'calves'] },
    equipment: 'Two heavy hexagonal black dumbbells.',
    pair: { phaseUz: 'Keyingi qadam', change: 'the next step: the LEFT foot now in front landing heel-first and the right foot behind, everything else the same' },
  },
  'pallof-press': {
    uz: 'Pallof press (burilishga qarshi)',
    en: 'Pallof Press',
    why: 'Qorin va qiyshiq mushaklar umurtqani burilishdan himoya qiladi — bel og‘rig‘ida xavfsiz kor mashqi.',
    female: false,
    phase: 'arms fully extended in front of the chest',
    phaseUz: 'Qo‘llar oldinda',
    camera: 'front three-quarter view — 35° in front of the athlete\'s LEFT side, at chest height, 50mm lens — so the cable coming from the side is clearly visible',
    technique: [
      'Standing SIDEWAYS to a cable pulley set at chest height (the pulley on the athlete\'s right), feet shoulder-width, knees soft, hips square to the front.',
      'Both hands hold a single D-handle; arms pressed straight forward from the chest, hands at sternum height in front of the body center.',
      'The torso does NOT rotate toward the cable: shoulders and hips face straight forward, core braced; the cable pulls sideways in a straight line from the pulley to the hands.',
    ],
    glow: { top: ['obliques', 'rectus abdominis'], mid: ['gluteus medius', 'serratus anterior'], low: ['front deltoids'] },
    equipment: 'Cable station with the pulley at chest height on the athlete\'s right side, a single D-handle attached.',
    pair: { phaseUz: START, change: 'the start: both hands holding the handle pulled in against the middle of the chest, elbows bent, the same square stance and torso facing forward' },
  },
  'hanging-knee-raise': {
    uz: 'Turnikda tizza ko‘tarish',
    en: 'Hanging Knee Raise',
    why: 'Turnikda oyoq ko‘tarishning yengil bosqichi — yangi boshlovchilar uchun.',
    female: false,
    phase: 'the top position, knees raised',
    phaseUz: 'Yuqori nuqta',
    camera: FRONT34.replace('chest height', 'hip height'),
    technique: [
      'Hanging from a pull-up bar with straight arms, overhand grip shoulder-width, shoulders slightly engaged (not shrugged to the ears).',
      'Top position: knees bent and raised until the thighs are above parallel to the floor, pelvis tilted backward (tailbone curled up), no swinging, torso stays vertical.',
    ],
    glow: { top: ['rectus abdominis (especially lower part)', 'hip flexors'], mid: ['obliques'], low: ['forearm flexors', 'latissimus dorsi'] },
    equipment: 'A straight horizontal pull-up bar mounted on a power rack; the bar runs left-right across the image.',
    pair: { phaseUz: START, change: 'dead hang at the start: legs straight down and together, the same grip on the same bar, the camera does not move' },
  },
  'sumo-deadlift': {
    uz: 'Sumo o‘lik tortish',
    en: 'Sumo Deadlift',
    why: 'Keng oyoq bilan tortish: belga yuk kamroq, dumba va ichki son ko‘proq; uzun gavdalilar uchun qulay.',
    female: false,
    phase: 'the start position, bar on the floor',
    phaseUz: 'Pastki nuqta',
    camera: FRONT34.replace('chest height', 'hip height'),
    technique: [
      'Very wide stance (about twice shoulder width), toes turned out about 45°, shins almost vertical and touching the bar, knees pushed out in line with the toes.',
      'Hands grip the bar inside the knees, shoulder-width, arms straight hanging vertically; hips lower than shoulders, torso fairly upright (about 45–55° forward lean), flat neutral back, chest up.',
      'The bar is on the floor over the middle of the feet; the plates rest on the floor.',
    ],
    glow: { top: ['gluteus maximus', 'quadriceps', 'adductors'], mid: ['hamstrings', 'erector spinae'], low: ['trapezius', 'forearm flexors'] },
    equipment: 'Olympic barbell with large matte black plates of standard diameter resting on the floor.',
    pair: { phaseUz: 'Yuqori nuqta', change: 'standing tall at lockout: hips and knees fully extended, the bar held at mid-thigh with straight arms, shoulders back, the same wide stance with toes out' },
  },

  /* ---------- uyda (ayol figura) ---------- */
  'incline-push-up': {
    uz: 'Qiya otjimaniya (skameyka yoki stolga)',
    en: 'Incline Push-up',
    why: 'Oddiy otjimaniya hali qiyin bo‘lganlar uchun birinchi bosqich (tizzadagidan ham tabiiyroq).',
    female: true,
    phase: 'the bottom position, chest near the bench edge',
    phaseUz: 'Pastki nuqta',
    camera: SIDE,
    technique: [
      'Hands on the edge of a sturdy flat bench (about 45 cm high), slightly wider than shoulders, wrists under the shoulders when arms are straight.',
      'Body in one straight line from head to heels (no sagging hips, no raised hips), on the balls of the feet, core and glutes tight.',
      'Bottom position: elbows bent to about 90° at about 45° from the torso, the chest a few centimeters from the bench edge.',
    ],
    glow: { top: ['pectoralis major'], mid: ['front deltoids', 'triceps'], low: ['rectus abdominis', 'serratus anterior'] },
    equipment: 'A sturdy flat weight bench.',
    pair: { phaseUz: 'Yuqori nuqta', change: 'the top: arms straight, the body still in one straight line from head to heels, hands in the same place on the bench' },
  },
  'nordic-curl': {
    uz: 'Nordik bukilish',
    en: 'Nordic Hamstring Curl',
    why: 'Son orqasi jarohatini qariyb ikki barobar kamaytiradi (van Dyk 2019 meta-tahlili); uyda divan ostiga oyoqni qistirib.',
    female: true,
    phase: 'the mid-lowering position, body leaning forward',
    phaseUz: 'Tushish',
    camera: SIDE,
    technique: [
      'Kneeling upright on a padded mat, the ankles anchored under a heavy sofa edge (or held by a partner), the body straight from knees to head.',
      'Mid-lowering: the whole body (hips extended, NOT bent) leans forward as one straight plank from the knees, about 45° from vertical, controlled by the hamstrings.',
      'Hands in front of the chest ready to catch the fall, palms forward.',
    ],
    glow: { top: ['hamstrings (biceps femoris and inner hamstrings)'], mid: ['gastrocnemius', 'gluteus maximus'], low: ['erector spinae'] },
    equipment: 'A thick padded exercise mat and the edge of a heavy dark sofa holding the ankles down.',
    pair: { phaseUz: START, change: 'the start: kneeling upright with the body vertical from knees to head, hips extended, hands in front of the chest' },
  },
  'lateral-lunge': {
    uz: 'Yonga hamla',
    en: 'Lateral Lunge',
    why: 'Yon tekislikdagi harakat — ichki son va dumba; hozirgi oyoq mashqlari faqat oldinga-orqaga.',
    female: true,
    phase: 'the bottom position, sitting into one side',
    phaseUz: 'Pastki nuqta',
    camera: 'straight FRONT view at hip height, 50mm lens',
    technique: [
      'Very wide stance, feet parallel or toes slightly out.',
      'Bottom position: hips sit back and down over the RIGHT leg (camera-left side of the image is the athlete\'s right) — right knee bent about 90° tracking over the toes, right heel flat; the LEFT leg straight with the foot flat, inner thigh stretched.',
      'Chest up, back flat, hands clasped in front of the chest.',
    ],
    glow: { top: ['gluteus maximus', 'quadriceps of the bent leg', 'adductors'], mid: ['gluteus medius', 'hamstrings'], low: [] },
    equipment: 'None (bodyweight) on a dark exercise mat.',
    pair: { phaseUz: START, change: 'standing tall at the start with the feet together, hands clasped in front of the chest' },
  },
  'jump-squat': {
    uz: 'Sakrab o‘tirib-turish',
    en: 'Jump Squat',
    why: 'Portlovchi kuch va puls — uyda qisqa intervalli mashg‘ulotlar uchun.',
    female: true,
    phase: 'airborne at the top of the jump',
    phaseUz: 'Sakrash',
    camera: FRONT34.replace('chest height', 'hip height'),
    technique: [
      'Airborne: the body fully extended — hips, knees and ankles straight, toes pointed down, a few centimeters above the floor.',
      'Arms swung down and back alongside the body (or straight down), torso upright, eyes forward.',
    ],
    glow: { top: ['quadriceps', 'gluteus maximus', 'calves'], mid: ['hamstrings'], low: ['rectus abdominis'] },
    equipment: 'None (bodyweight) above a dark exercise mat.',
    pair: { phaseUz: 'Pastki nuqta', change: 'the bottom of the squat before the jump: feet flat on the mat shoulder-width, thighs near parallel, knees over the toes, chest up, arms swung back' },
  },
};
