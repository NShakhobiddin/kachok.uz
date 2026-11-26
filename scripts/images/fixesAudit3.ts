// 2026-11 auditi: rasmlardagi xatolar va Flow-6 uchun tuzatish topshiriqlari (flow-pack3.ts).
// priority: 1 — noto'g'ri texnika yoki buzuq rasm; 2 — harakat (ikkinchi kadr) yo'q yoki noto'g'ri.
// main — asosiy kadrni yangidan chizishdagi tuzatishlar (ingliz tilida); pair — ikkinchi kadr.

export interface AuditFix {
  id: string;
  priority: 1 | 2;
  /** o'zbekcha: nima xato */
  problem: string;
  /** uy/trenajyor bo'limi — ayol figura */
  female?: boolean;
  main?: string;
  pair?: { phaseUz: string; change: string };
}

const START = 'Boshlang‘ich holat';

export const AUDIT_FIXES: AuditFix[] = [
  /* ---------- uyda va trenajyorlar (ayol figura) ---------- */
  {
    id: 'reverse-crunch',
    priority: 1,
    female: true,
    problem: 'B kadrda tizza teskari bukilgan: son tik, boldir boshga qarab ketgan — anatomik imkonsiz.',
    pair: { phaseUz: START, change: 'the start: back and pelvis flat on the mat, arms by the sides palms down, thighs vertical over the hips, knees bent 90° with the shins PARALLEL to the floor pointing AWAY from the head (toward the same side as the feet in image 1) — a normal knee bend' },
  },
  {
    id: 'curtsy-lunge',
    priority: 1,
    female: true,
    problem: 'Reverans hamla emas: orqa oyoq old oyoq ortidan kesib o‘tmaydi — oddiy orqaga hamla bilan bir xil.',
    main: 'The rear (right) leg steps back AND diagonally across BEHIND the front (left) leg: the right knee hovers just above the floor behind the left heel, the right foot on its toes behind and outside the left foot, so the thighs and shins visibly form an X from this camera. Front knee bent ~90° over the toes, hips and shoulders square to the front, torso upright, hands on hips.',
    pair: { phaseUz: START, change: 'standing tall at the start: both feet side by side hip-width apart at the spot of the FRONT foot in image 1, knees straight, hands on hips' },
  },
  {
    id: 'knee-push-up',
    priority: 1,
    female: true,
    problem: '«Pastki nuqta» aslida pastki nuqta emas (ko‘krak poldan ~20 sm, tos bukilgan); ikki kadr deyarli bir xil — harakat ko‘rinmaydi.',
    main: 'Bottom position: knees on the mat, shins raised and crossed, hands slightly wider than the shoulders under the chest; the body in ONE straight line from knees through hips and shoulders to head (no hip bend, no sag); chest 2–3 cm above the mat; elbows bent ~90° and angled 30–45° from the torso; neck neutral.',
    pair: { phaseUz: START, change: 'the top: arms fully straight, the body still in one straight line from knees to head; knees and hands stay on exactly the same spots' },
  },
  {
    id: 'side-plank',
    priority: 1,
    female: true,
    problem: 'Matnda — bilakka tayanib (tirsak yelka ostida), rasmda — to‘g‘ri qo‘l va mushtda; bosh orqaga tashlangan. B kadrda qo‘l va bosh ham o‘zgaradi.',
    main: 'FOREARM side plank: the bottom forearm flat on the mat, elbow directly under the shoulder, forearm pointing forward, hand flat; feet stacked; pelvis lifted so ankles, hips, shoulders and head form one straight line (no sag, no rotation); the top hand on the hip; head neutral in line with the spine, looking forward.',
    pair: { phaseUz: START, change: 'the start: the same forearm support and stacked feet, the same top hand on the hip and neutral head; ONLY the pelvis is lowered to rest on the mat' },
  },
  {
    id: 'band-row',
    priority: 1,
    female: true,
    problem: 'Qo‘llar harakatning turli nuqtasida (biri orqada, biri oldinda); ikki kadrda ham lenta oyoq kafti ostidan emas, oyoq ustidan o‘tgan.',
    main: 'Seated upright, legs extended with soft knees; the band loops UNDER the soles of both shoes at the arches (clearly visible passing under the soles), the two strands running straight to the hands; BOTH hands at the lower ribs, BOTH elbows pulled back symmetrically close to the ribs, shoulder blades squeezed and down.',
    pair: { phaseUz: START, change: 'the start: both arms straight forward holding the band ends, band still looped under the soles and just taut, torso upright, shoulder blades relaxed forward' },
  },
  {
    id: 'bicycle-crunch',
    priority: 1,
    female: true,
    problem: 'Burilish noto‘g‘ri tomonga: bukilgan tizzaga o‘sha tomondagi tirsak qaragan (qarama-qarshi yelka kelishi kerak); ikkinchi kadr yo‘q.',
    main: 'Lower back pressed into the mat, fingertips lightly at the temples; LEFT knee pulled toward the chest, RIGHT leg extended straight and low off the floor; upper back off the mat with the torso rotated to the left so the RIGHT shoulder and RIGHT elbow come across toward the left knee, the left elbow back toward the mat.',
    pair: { phaseUz: 'Ikkinchi tomon', change: 'the mirror side: RIGHT knee pulled to the chest, LEFT leg extended low, torso rotated to the right so the LEFT shoulder and elbow come toward the right knee; the mat and body position on the mat stay exactly the same' },
  },
  {
    id: 'hip-adduction',
    priority: 1,
    female: true,
    problem: 'Chap yostiq tizzaning tashqarisida (tizza ikki yostiq orasida), «yopilgan» holat yarim yopiq; A da yalangoyoq, B da krossovkada.',
    main: 'Both thigh pads on the INNER side of the knees/lower thighs, the legs squeezed together so the two pads almost touch each other between the knees, no leg between the pads; black sneakers on the footrests; torso upright against the back pad, hands on the side handles; lime glow only on the inner-thigh adductors.',
    pair: { phaseUz: START, change: 'the start: knees wide apart with the pads still on the inner side of the knees and the pad arms swung outward; the same black sneakers on the same footrests; the machine frame unchanged' },
  },
  {
    id: 'cable-pull-through',
    priority: 1,
    female: true,
    problem: 'Pastki nuqtada qo‘llar tizza oldida osilib turibdi — matnda qo‘llar oyoqlar orasidan orqaga ketadi.',
    main: 'Hips pushed back, torso ~45°, soft knees, flat back, head neutral; both hands hold the rope BETWEEN the thighs at or slightly behind knee level, arms straight and angled back toward the low pulley behind her (passive hooks); the cable runs in a straight line from the low pulley between the feet to the rope.',
    pair: { phaseUz: START, change: 'standing tall at lockout: hips fully extended, glutes squeezed, arms straight hanging down between the thighs holding the rope, the cable still running back between the feet' },
  },
  {
    id: 't-bar-row',
    priority: 1,
    female: true,
    problem: 'Qo‘llar mos emas: biri to‘g‘ri grifda, biri bukilgan va V-tutqich grifga ilinmagan; ikkinchi kadr yo‘q.',
    main: 'Straddling the bar, torso ~45°, knees bent, flat back; BOTH hands on ONE grip — a V-handle hooked under the bar right behind the plates (neutral grip), both arms straight and symmetrical (bottom position); plates with a collar on the free bar end; the other bar end anchored in a landmine base on the floor behind her.',
    pair: { phaseUz: 'Yuqori nuqta', change: 'the top of the row: the same torso angle, both elbows pulled back alongside the torso, the V-handle and the bar end with the plates raised toward the upper abdomen, shoulder blades squeezed' },
  },
  {
    id: 'preacher-curl',
    priority: 1,
    female: true,
    problem: 'Tirsak yostiqning yuqori chetiga «qo‘nib» turibdi — qo‘lning yuqori qismi yostiqda yotishi kerak.',
    main: 'The armpit against the TOP edge of the pad and the whole back of the upper arm lying flat along the sloped pad face from armpit to elbow (elbow near the lower front of the pad); forearm bent to ~90° relative to the upper arm, holding an EZ bar with both hands, palms up.',
    pair: { phaseUz: START, change: 'the bottom: elbows almost straight (slight bend) with the EZ bar low in front of the pad, upper arms still flat on the pad, armpits on the top edge' },
  },
  {
    id: 'ab-wheel',
    priority: 1,
    female: true,
    problem: '«Cho‘zilgan holat» — qisqa, tos bukilgan holda dumalatish: matndagi «faqat qo‘l bilan dumalatish» xatosining o‘zi.',
    main: 'Kneeling rollout at full extension: the wheel rolled far forward so the straight arms reach out in front of the head (shoulders ~140–160° flexed); the body in one straight line from knees through hips to shoulders (no hip bend, no lower-back sag), pelvis tucked, head neutral.',
    pair: { phaseUz: START, change: 'the start: kneeling with the hips over the knees, arms straight down holding the wheel on the mat under the shoulders, back flat' },
  },
  {
    id: 'reverse-lunge',
    priority: 2,
    female: true,
    problem: 'Kadrlar orasida old oyoq ~30% ga «sakraydi» — harakat buzilgan ko‘rinadi.',
    pair: { phaseUz: START, change: 'standing tall at the start with both feet together exactly where the FRONT foot is in image 1 (same floor line), knees straight, hands in the same place — only the rear leg travels between the frames' },
  },
  {
    id: 'wall-sit',
    priority: 2,
    female: true,
    problem: 'Kadrlar orasida oyoqlar devordan uzoqlashadi (oyoq sirpanadi).',
    pair: { phaseUz: START, change: 'standing with the back and head flat against the same wall, legs almost straight, body slightly reclined, feet hip-width in EXACTLY the same floor spot as in image 1 (one step out from the wall), arms the same as in image 1' },
  },
  {
    id: 'single-leg-bridge',
    priority: 2,
    female: true,
    problem: 'Ikki kadr bir xil (tos ikkalasida ham yuqorida) — harakat ko‘rinmaydi.',
    pair: { phaseUz: START, change: 'the bottom: the pelvis resting on the mat, the supporting foot flat on the same spot with the knee bent ~90°, the free leg straight and in line with the supporting thigh (it lowers together with the pelvis); head, shoulders and arms unchanged' },
  },
  {
    id: 'banded-lateral-walk',
    priority: 2,
    female: true,
    problem: 'Ikki kadr orasidagi farq juda kichik — yonga qadam ko‘rinmaydi.',
    pair: { phaseUz: START, change: 'the start: feet only hip-width apart, toes forward, the band around the ankles just taut, the same half-squat depth and hands on hips' },
  },
  {
    id: 'mountain-climber',
    priority: 2,
    female: true,
    problem: 'Ikkinchi kadr yo‘q — oyoq almashishi ko‘rinmaydi.',
    pair: { phaseUz: 'Ikkinchi oyoq', change: 'the legs switched: the previously extended leg now driven to the chest (knee under the chest, foot off the floor), the previously bent leg extended back on its toes; hands on the same spots, shoulders over the hands, hips at the same height' },
  },
  {
    id: 'hip-abduction',
    priority: 2,
    female: true,
    problem: 'Ikkinchi kadr yo‘q (tizzalar yaqin boshlang‘ich holat).',
    pair: { phaseUz: START, change: 'the start: knees almost together, the pads still touching the OUTSIDE of the knees with the pad arms swung inward; the same machine, seat, footrests and black sneakers; torso upright, hands on the side handles' },
  },
  {
    id: 'seated-calf-raise',
    priority: 2,
    female: true,
    problem: 'Ikkinchi kadr yo‘q (tovon pastga tushgan cho‘zilgan holat).',
    pair: { phaseUz: 'Pastki nuqta', change: 'the bottom: the balls of the feet on EXACTLY the same spot of the FIXED foot platform (the platform does not move or tilt), heels dropped well below the platform edge; the knee pad with the plates lowers by the same few centimetres together with the knees; nothing else moves' },
  },

  /* ---------- cho‘zilishlar (ayol figura) ---------- */
  {
    id: 'calf-stretch',
    priority: 1,
    female: true,
    problem: 'Orqa oyoq tovoni ko‘tarilgan — boldir cho‘zilmaydi; old boldir ham yoritilgan.',
    main: 'The BACK leg straight with the whole sole flat and the heel pressed into the floor, toes pointing at the wall; the front knee bent over the front ankle; hands on the wall at shoulder height; one straight line from head to back heel. Lime glow ONLY on the back leg calf (gastrocnemius and soleus); no glow on the front calf.',
    pair: { phaseUz: START, change: 'the start: standing upright facing the wall with both feet together, hands on the wall at shoulder height' },
  },
  {
    id: 'cross-body-shoulder',
    priority: 1,
    female: true,
    problem: 'Yordamchi qo‘l tirsak bo‘g‘imidan ushlagan — maslahatda aynan bu taqiqlangan (yelkadan ushlash kerak).',
    main: 'The right arm straight across the chest at or slightly below shoulder height, drawn close to the chest; the LEFT hand presses on the right UPPER ARM midway between shoulder and elbow, the elbow joint itself is free; the right shoulder down away from the ear, torso facing forward; lime glow on the right rear deltoid.',
    pair: { phaseUz: START, change: 'the start: the right arm reaching straight forward at shoulder height, the left arm relaxed at the side, standing in the same spot' },
  },
  {
    id: 'doorway-chest',
    priority: 1,
    female: true,
    problem: 'Ikki kadrda ham qo‘l deyarli to‘g‘ri, eshik romida faqat kaft — matnda bilak romda, tirsak 90° yelka balandligida.',
    main: 'The FOREARM lies flat and vertical against the door jamb from elbow to palm, elbow bent 90° at or just below shoulder height, upper arm horizontal; one foot stepped forward through the doorway, torso shifted forward, shoulder down, ribs down, no lower-back arch; lime glow only on the pectoral and front deltoid of the arm on the frame.',
    pair: { phaseUz: START, change: 'the start: standing tall at the doorway with the feet together, the same forearm flat on the jamb with the elbow at 90°, torso not yet shifted forward' },
  },
  {
    id: 'cobra',
    priority: 1,
    female: true,
    problem: 'Tirsaklar qulflangan, gavda deyarli tik — beldagi keskin bukilish; matnda tirsak biroz bukik, qulay balandlik.',
    main: 'Low-to-medium cobra: pelvis and thighs on the mat, tops of the feet down; hands under or just in front of the shoulders, elbows clearly bent (30–45°) and tucked to the ribs; chest lifted until the lower ribs just leave the mat (torso about 30–40° from the floor); shoulders down and back, chin slightly tucked, gaze forward and down; lime glow along the abdominal wall.',
    pair: { phaseUz: START, change: 'the start: lying face down, forehead near the mat, hands under the shoulders, elbows bent and tucked, legs and feet on the same spots' },
  },
  {
    id: 'hip-flexor-stretch',
    priority: 1,
    female: true,
    problem: 'A kadrda yorug‘lik old oyoqda (u bo‘shashgan) — cho‘ziladigan tiz cho‘kkan oyoq; A va B deyarli bir xil, belda egilish.',
    main: 'Half-kneeling: the rear knee on a folded towel, the front knee over the front ankle; the pelvis visibly tucked under (posterior tilt, flat lower back, rear-leg glute squeezed) and the hips shifted 3–5 cm forward so the rear thigh angles slightly back from vertical; torso upright; lime glow on the front of the hip and the front of the REAR (kneeling) thigh only; no glow on the front leg.',
    pair: { phaseUz: START, change: 'the start: upright half-kneeling with the rear thigh vertical under the hip, pelvis neutral, the same knee and foot positions' },
  },
  {
    id: 'pigeon',
    priority: 1,
    female: true,
    problem: 'Tos kameraga ochilgan — orqa oyoq yonga ketgan; yorug‘lik orqa oyoq tomonidagi dumbada; B da umurtqa kuchli bukilgan, oyoq kiyimi «rolik»ka o‘xshaydi.',
    main: 'The front shin across the mat at a diagonal, heel in front of the opposite hip, foot flexed; the back leg straight directly behind along the mat, top of the foot down; the pelvis square to the front of the mat (both hip points facing the same way as the chest); torso upright on fingertips beside the front shin; lime glow on the gluteus maximus of the FRONT (bent) leg only.',
    pair: { phaseUz: 'Chuqurroq holat', change: 'deeper: hinging forward from the hips with a LONG STRAIGHT spine onto the forearms, chest leading, gaze down; legs exactly as in image 1, the front foot a normal shoe' },
  },
  {
    id: 'figure-four',
    priority: 1,
    female: true,
    problem: 'Qo‘llar cho‘ziladigan oyoq tizzasini ushlagan, tayanch oyoq polda — matndagi chuqurlashtirish ko‘rsatilmagan.',
    main: 'The crossed ankle on the supporting thigh just below the knee, crossed foot flexed, crossed knee opening outward; the supporting foot LIFTED off the mat, both hands interlaced BEHIND the supporting thigh (the crossed-side arm threaded through the gap between the legs) pulling it toward the chest; head, shoulders and sacrum on the mat; lime glow only on the crossed leg glute.',
    pair: { phaseUz: START, change: 'the start: the supporting foot flat on the mat, the crossed ankle on the supporting thigh, hands resting beside the body' },
  },
  {
    id: 'butterfly',
    priority: 1,
    female: true,
    problem: 'B (chuqurroq) kadrda umurtqa to‘liq dumaloq, bosh oyoqlarga tushgan — maslahatda aynan shu xato.',
    pair: { phaseUz: 'Chuqurroq holat', change: 'deeper: hinging forward from the hips only 15–25° with a long STRAIGHT spine, chest leading forward, face visible, gaze forward-down, elbows relaxed; legs and hand grip exactly as in image 1' },
  },
  {
    id: 'down-dog',
    priority: 2,
    female: true,
    problem: 'Cho‘zilgan holatda tovonlar baland ko‘tarilgan — boldir cho‘zilmaydi.',
    main: 'Inverted V: hands and feet on the same spots, heels lowered to 0–3 cm above the mat (feet nearly flat), knees straight or very slightly soft, long flat back, head relaxed between the upper arms; lime glow on the hamstrings and calves.',
  },
  {
    id: 'childs-pose',
    priority: 2,
    female: true,
    problem: 'Kadrlar orasida tizza va oyoqlar joyi o‘zgaradi — oyoqlar «sakraydi».',
    pair: { phaseUz: START, change: 'the start: kneeling upright sitting on the heels, hands resting on the thighs; the knees and feet on EXACTLY the same spots of the mat as in image 1, tops of the feet down' },
  },
  {
    id: 'thread-needle',
    priority: 2,
    female: true,
    problem: 'Tayanch qo‘l kadrlar orasida o‘zgaradi (bir kadrda bilakda, birida kaft iyak ostida).',
    pair: { phaseUz: 'Ochilgan holat', change: 'open position: the support palm planted flat directly under its shoulder on the same spot as in image 1, support arm straight, hips over the knees; the other arm reaching vertically to the ceiling, chest open, gaze at the raised hand with the neck in line with the spine' },
  },
];
