// Rasm generatsiyasi uchun aniq tavsiflar (ingliz tilida — generatorlar uni yaxshiroq tushunadi).
// Mashqlar: bitta eng ko'p o'rgatadigan holat; mushaklar yorqinligi ilovadagi EMG jadvalidan (prompts.ts) qo'shiladi.
import type { EquipmentId } from '../../src/types';
import type { M3 } from '../../src/data/muscles3d';

export interface ExerciseSpec {
  /** qaysi holat (generator uchun) */
  phase: string;
  /** ilovadagi yozuv */
  phaseUz: string;
  camera: string;
  technique: string[];
  equipment: string;
}

const SIDE = "side view from the athlete's right at hip height, 50mm lens";
const REAR34 = "rear three-quarter view — 30° behind the athlete's right side, at shoulder height, 50mm lens";
const FRONT34 = "front three-quarter view — 30° in front of the athlete's right side, at chest height, 50mm lens";
const BENCH = "side view from the athlete's right, camera slightly above bench height (about 15° down), 50mm lens";
const ABOVE = 'high three-quarter view from above the right side (about 40° down), 50mm lens';

export const EXERCISE_SPECS: Record<string, ExerciseSpec> = {
  'back-squat': {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: `${REAR34.replace('shoulder height', 'hip height')} — so the barbell on the upper back, both hands and the head are all clearly visible`,
    technique: [
      'The barbell lies ACROSS THE UPPER BACK on the trapezius at the base of the neck, below the head, in direct contact with the body — never at head height, never floating.',
      'Both hands grip the bar just outside shoulder width, wrists straight, elbows pointing down and slightly back. Arms are NOT crossed.',
      'Head and neck fully visible in front of the bar, neutral neck, eyes looking at the floor about 2 meters ahead.',
      'Thighs parallel to the floor, knees tracking over the toes, heels flat, neutral spine with natural lower-back arch, chest up, torso leaning about 40–45°, the bar vertically above the middle of the foot.',
    ],
    equipment: 'Olympic barbell with medium-diameter matte black plates that do not cover the head or torso.',
  },
  'front-squat': {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: FRONT34.replace('chest height', 'hip height'),
    technique: [
      'Front-rack position: the barbell rests on the front deltoids, touching the throat, in front of the neck — not on the hands.',
      'Fingertips under the bar just outside the shoulders, elbows HIGH and pointing straight forward, upper arms almost parallel to the floor.',
      'Torso nearly upright (about 15–20° forward lean), chest up, neutral spine.',
      'Thighs parallel to the floor or slightly below, knees forward over the toes, heels flat on the floor.',
    ],
    equipment: 'Olympic barbell with medium matte black plates.',
  },
  'goblet-squat': {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: FRONT34.replace('chest height', 'hip height'),
    technique: [
      'One dumbbell held vertically against the chest, both palms cupping the top end, elbows pointing down.',
      'Torso upright, chest up, neutral spine.',
      'Thighs parallel to the floor, elbows just inside the knees, knees over the toes, heels flat.',
    ],
    equipment: 'One hexagonal black dumbbell.',
  },
  'smith-squat': {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: SIDE,
    technique: [
      'The bar of the Smith machine rests across the upper trapezius at the base of the neck; hands grip it just outside shoulder width.',
      'Feet slightly in front of the bar, shoulder width; heels flat.',
      'Thighs parallel to the floor, knees over the toes, torso fairly upright with neutral spine.',
    ],
    equipment: 'Smith machine: barbell fixed in two vertical steel guide rails, the frame visible but not covering the body.',
  },
  'leg-press': {
    phase: 'the lowered position',
    phaseUz: 'Pastki nuqta',
    camera: SIDE,
    technique: [
      'Back and hips stay flat against the reclined seat pad — the tailbone does NOT lift off the seat.',
      'Feet shoulder width in the middle of the platform, knees bent to about 90°, knees in line with the toes.',
      'Hands hold the side handles; head rests on the pad.',
    ],
    equipment: '45-degree plate-loaded leg press with a large foot platform and black weight plates.',
  },
  'hack-squat': {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: SIDE,
    technique: [
      'Back flat against the angled back pad, shoulders under the shoulder pads, hands on the handles.',
      'Feet shoulder width in the middle of the platform, heels flat.',
      'Knees bent to about 90°, thighs roughly parallel to the platform, knees tracking over the toes.',
    ],
    equipment: 'Plate-loaded hack squat machine with an angled sled.',
  },
  'bw-squat': {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: FRONT34.replace('chest height', 'hip height'),
    technique: [
      'Arms extended straight forward at shoulder height for balance.',
      'Thighs parallel to the floor, chest up, neutral spine.',
      'Feet shoulder width, toes slightly out, knees over the toes, heels flat.',
    ],
    equipment: 'No equipment.',
  },
  deadlift: {
    phase: 'the start position, the barbell just leaving the floor',
    phaseUz: 'Boshlang‘ich holat',
    camera: SIDE,
    technique: [
      'The bar is over the middle of the foot, touching the shins.',
      'Hips higher than the knees and lower than the shoulders; shoulders slightly in front of the bar.',
      'Back completely flat (neutral spine from neck to pelvis), chest up, arms straight and vertical, grip just outside the legs.',
      'Head neutral, eyes looking at the floor about 1–2 meters ahead.',
    ],
    equipment: 'Olympic barbell with full-size matte black plates resting on the floor.',
  },
  rdl: {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: SIDE,
    technique: [
      'Hips pushed far back, knees softly bent about 15–20°, shins nearly vertical.',
      'Back completely flat, the barbell sliding along the legs, now just below the knees.',
      'Arms straight, shoulders over the bar, neck neutral.',
    ],
    equipment: 'Olympic barbell with medium matte black plates.',
  },
  'db-rdl': {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: SIDE,
    technique: [
      'Hips pushed far back, knees softly bent about 15–20°, shins nearly vertical.',
      'Back completely flat; two dumbbells held in front of the legs, now at mid-shin, close to the legs.',
      'Arms straight, neck neutral.',
    ],
    equipment: 'Two hexagonal black dumbbells.',
  },
  'kb-swing': {
    phase: 'the top of the swing',
    phaseUz: 'Yuqori nuqta',
    camera: SIDE,
    technique: [
      'Standing tall with hips fully extended and glutes squeezed — the body in one straight vertical line, no backward lean.',
      'Arms straight, both hands on the kettlebell handle; the kettlebell floats forward at chest height.',
      'Core braced, knees straight but not locked, feet flat slightly wider than hips.',
    ],
    equipment: 'One cast-iron kettlebell.',
  },
  'back-extension': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: SIDE,
    technique: [
      'On a 45° back-extension bench: the hip pad sits just below the hip crease, ankles locked under the rollers.',
      'Body in one straight line from heels to head — no over-arching of the lower back.',
      'Arms crossed on the chest, neck neutral.',
    ],
    equipment: '45-degree hyperextension bench.',
  },
  'split-squat': {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: SIDE,
    technique: [
      'Long staggered stance: front foot flat, front shin nearly vertical, front thigh parallel to the floor.',
      'Back knee just above the floor, back heel raised.',
      'Torso upright, dumbbells hanging at the sides with straight arms.',
    ],
    equipment: 'Two hexagonal black dumbbells.',
  },
  bulgarian: {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: SIDE,
    technique: [
      'Rear foot laces resting on a flat bench behind; front foot about 70 cm in front of the bench.',
      'Front thigh parallel to the floor, front heel flat, front knee over the toes; back knee just above the floor.',
      'Torso with a slight forward lean, neutral spine; dumbbells hanging at the sides.',
    ],
    equipment: 'Flat weight bench and two hexagonal black dumbbells.',
  },
  'step-up': {
    phase: 'the drive phase, halfway up',
    phaseUz: 'Ko‘tarilish',
    camera: SIDE,
    technique: [
      'Whole front foot on a knee-high box, front knee bent about 90° and in line with the toes.',
      'Pushing through the front heel; the trailing foot only on its toes, about to leave the floor.',
      'Torso slightly forward, neutral spine, dumbbells at the sides.',
    ],
    equipment: 'Sturdy plyometric box and two hexagonal black dumbbells.',
  },
  'bw-split-squat': {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: SIDE,
    technique: [
      'Long staggered stance: front foot flat, front thigh parallel to the floor, front shin nearly vertical.',
      'Back knee just above the floor, back heel raised.',
      'Torso upright, hands on the hips.',
    ],
    equipment: 'No equipment.',
  },
  'leg-extension': {
    phase: 'the top position, knees straight',
    phaseUz: 'Yuqori nuqta',
    camera: SIDE,
    technique: [
      'Seated with the back against the backrest, knees aligned with the machine pivot.',
      'Knees fully extended, the shin pad resting on the lower shins just above the ankles, toes pointing up.',
      'Hands gripping the side handles, hips stay down on the seat.',
    ],
    equipment: 'Seated leg extension machine with a weight stack.',
  },
  'leg-curl': {
    phase: 'the contracted position',
    phaseUz: 'Qisqargan holat',
    camera: SIDE,
    technique: [
      'Seated leg curl: back against the backrest, the thigh pad locks the thighs down just above the knees.',
      'Legs curled under the seat to about 90° knee bend, the ankle pad behind the lower calves.',
      'Hands on the side handles, hips stay in the seat.',
    ],
    equipment: 'Seated leg curl machine with a weight stack.',
  },
  'hip-thrust': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: SIDE,
    technique: [
      'Upper back (just below the shoulder blades) resting on the edge of a flat bench.',
      'Barbell with a foam pad across the hip crease, hands holding it in place.',
      'Hips fully extended: shoulders, hips and knees in one straight line parallel to the floor; shins vertical; chin slightly tucked; ribs down, no lower-back arch.',
    ],
    equipment: 'Flat bench and an Olympic barbell with medium matte black plates and a foam pad.',
  },
  'glute-bridge': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: SIDE,
    technique: [
      'Lying on the back on the floor, knees bent, feet flat hip width.',
      'Hips lifted so shoulders, hips and knees form one straight line; glutes squeezed; ribs down.',
      'Arms resting on the floor beside the body.',
    ],
    equipment: 'No equipment, plain floor.',
  },
  'calf-raise': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: SIDE,
    technique: [
      'Balls of both feet on the edge of a low step, heels hanging free.',
      'Raised as high as possible on the toes, knees straight, body tall.',
      'One hand lightly touching a wall or rail for balance.',
    ],
    equipment: 'A low step platform.',
  },
  'bench-press': {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: BENCH,
    technique: [
      'Lying on a flat bench, eyes under the bar, shoulder blades pulled back and down, slight natural arch, glutes on the bench, feet flat on the floor.',
      'The barbell touches the lower chest at nipple level.',
      'Grip slightly wider than shoulders, forearms vertical, elbows at about 45–60° from the torso (not flared to 90°), wrists straight.',
    ],
    equipment: 'Flat bench with bench-press uprights and an Olympic barbell with medium matte black plates.',
  },
  'db-bench': {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: BENCH,
    technique: [
      'Lying on a flat bench, shoulder blades pulled back, feet flat on the floor.',
      'Two dumbbells lowered beside the chest at nipple level, forearms vertical, palms facing the feet.',
      'Elbows at about 45° from the torso, wrists straight.',
    ],
    equipment: 'Flat bench and two hexagonal black dumbbells.',
  },
  'machine-chest-press': {
    phase: 'the start position, handles at chest level',
    phaseUz: 'Boshlang‘ich holat',
    camera: SIDE,
    technique: [
      'Seated upright, back and shoulder blades against the back pad, feet flat on the floor.',
      'Handles in line with the middle of the chest, forearms horizontal, elbows slightly below shoulder height.',
      'Wrists straight, shoulders down.',
    ],
    equipment: 'Seated chest press machine with a weight stack.',
  },
  'push-up': {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: SIDE.replace('hip height', 'floor height (low camera)'),
    technique: [
      'Chest about 5 cm above the floor.',
      'Body in one straight line from head to heels — hips neither sagging nor piked.',
      'Hands slightly wider than the shoulders, under the chest; elbows at about 45° from the torso.',
    ],
    equipment: 'No equipment, plain floor.',
  },
  dips: {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: SIDE,
    technique: [
      'Supported on parallel dip bars, upper arms parallel to the floor (not deeper).',
      'Torso leaning forward about 20–30°, elbows pointing back, shoulders down away from the ears.',
      'Knees bent with the ankles crossed behind.',
    ],
    equipment: 'Free-standing dip station with two parallel bars.',
  },
  'incline-db-press': {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: BENCH,
    technique: [
      'Lying on a bench inclined to 30°, shoulder blades pulled back, feet flat on the floor.',
      'Dumbbells lowered beside the upper chest, forearms vertical, palms facing forward.',
      'Elbows at about 45° from the torso.',
    ],
    equipment: 'Adjustable incline bench at 30° and two hexagonal black dumbbells.',
  },
  'incline-bench': {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: BENCH,
    technique: [
      'Lying on a bench inclined to 30°, shoulder blades pulled back, feet flat.',
      'The barbell touches the upper chest just below the collarbones.',
      'Grip slightly wider than shoulders, forearms vertical, elbows about 45–60° from the torso.',
    ],
    equipment: 'Incline bench press station and an Olympic barbell with medium matte black plates.',
  },
  'cable-fly': {
    phase: 'the squeeze position',
    phaseUz: 'Qisqargan holat',
    camera: FRONT34,
    technique: [
      'Standing in the middle of a cable crossover in a split stance, torso leaning slightly forward.',
      'Both handles brought together in front of the lower chest in a wide hugging arc.',
      'Elbows slightly bent and fixed, shoulders down, chest up.',
    ],
    equipment: 'Cable crossover station with D-handles; both cables clearly attached to the handles.',
  },
  'pec-deck': {
    phase: 'the squeeze position',
    phaseUz: 'Qisqargan holat',
    camera: FRONT34,
    technique: ['Seated upright, back against the pad.', 'The padded arms brought together in front of the chest, elbows at about shoulder height.', 'Shoulders down, chest up.'],
    equipment: 'Pec deck (butterfly) machine with a weight stack.',
  },
  'db-fly': {
    phase: 'the bottom (stretched) position',
    phaseUz: 'Pastki nuqta',
    camera: ABOVE,
    technique: [
      'Lying on a flat bench, feet flat on the floor, shoulder blades pulled back.',
      'Arms opened wide in an arc, dumbbells at chest height level with the body, elbows slightly bent (about 20°) and fixed.',
      'Palms facing up and slightly toward each other.',
    ],
    equipment: 'Flat bench and two hexagonal black dumbbells.',
  },
  ohp: {
    phase: 'the lockout overhead',
    phaseUz: 'Yuqori nuqta',
    camera: SIDE.replace('hip height', 'chest height'),
    technique: [
      'Standing, the barbell locked out directly above the middle of the foot, arms straight.',
      'Head pushed slightly forward "through the window" under the bar.',
      'Glutes and abs tight, ribs down — no backward lean; feet hip width.',
    ],
    equipment: 'Olympic barbell with medium matte black plates.',
  },
  'db-shoulder-press': {
    phase: 'the start position, dumbbells at shoulder level',
    phaseUz: 'Boshlang‘ich holat',
    camera: FRONT34,
    technique: [
      'Seated upright on a bench with the backrest vertical, feet flat.',
      'Dumbbells at ear level beside the head, forearms vertical, palms facing forward.',
      'Elbows slightly in front of the torso, shoulders down.',
    ],
    equipment: 'Adjustable bench set upright and two hexagonal black dumbbells.',
  },
  'machine-shoulder-press': {
    phase: 'the start position, handles at shoulder level',
    phaseUz: 'Boshlang‘ich holat',
    camera: SIDE.replace('hip height', 'chest height'),
    technique: ['Seated upright, back against the pad, feet flat.', 'Handles at shoulder height, forearms vertical.', 'Shoulders down, ribs down, head neutral.'],
    equipment: 'Seated shoulder press machine with a weight stack.',
  },
  'pike-push-up': {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: SIDE.replace('hip height', 'floor height (low camera)'),
    technique: [
      'Hips high, body forming an inverted V.',
      'Hands shoulder width; the head lowered toward the floor just in front of the hands, forming a triangle with the hands.',
      'Elbows bent about 90°, pointing back at about 45°; legs straight, on the toes.',
    ],
    equipment: 'No equipment, plain floor.',
  },
  'lateral-raise': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: 'front view, at chest height, 50mm lens',
    technique: [
      'Standing tall, dumbbells raised out to the sides exactly to shoulder height, arms slightly in front of the body.',
      'Elbows slightly bent, hands not higher than the elbows.',
      'Shoulders down — no shrugging, no swinging.',
    ],
    equipment: 'Two small hexagonal black dumbbells.',
  },
  'cable-lateral-raise': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: FRONT34,
    technique: [
      'Standing side-on to a low pulley, the cable crossing in front of the body to the far hand.',
      'Working arm raised out to the side to shoulder height, elbow slightly bent.',
      'Other hand holding the machine frame, torso upright, shoulders down.',
    ],
    equipment: 'Single cable column with a low pulley and a D-handle; the cable clearly attached to the handle.',
  },
  'face-pull': {
    phase: 'the contracted position',
    phaseUz: 'Qisqargan holat',
    camera: REAR34,
    technique: [
      'Rope attachment on a cable set at face height; standing tall, slight lean back.',
      'Rope pulled toward the forehead, hands pulled apart beside the ears.',
      'Elbows high and wide at shoulder height, knuckles rotated back (external rotation), shoulder blades squeezed together.',
    ],
    equipment: 'Cable column with a rope attachment; the cable clearly attached to the rope.',
  },
  'reverse-fly': {
    phase: 'the end position, band fully stretched',
    phaseUz: 'Qisqargan holat',
    camera: REAR34,
    technique: [
      'Standing tall, a resistance band stretched across the chest at shoulder height.',
      'Arms straight out to the sides, palms facing down.',
      'Shoulder blades squeezed together, shoulders down, ribs down.',
    ],
    equipment: 'One lime-green resistance band.',
  },
  'barbell-row': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: SIDE,
    technique: [
      'Hip hinge with the torso at about 30–45° to the floor, knees softly bent, back completely flat.',
      'The barbell pulled to the lower ribs / upper abdomen.',
      'Elbows driven back at about 45° from the torso, shoulder blades squeezed, neck neutral.',
    ],
    equipment: 'Olympic barbell with medium matte black plates.',
  },
  'db-row': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: 'side view from the working-arm side at bench height, 50mm lens',
    technique: [
      'Left knee and left hand on a flat bench, right foot on the floor, torso parallel to the floor, back flat.',
      'Right hand pulls the dumbbell to the hip, elbow close to the body pointing back and up.',
      'Shoulders level, neck neutral.',
    ],
    equipment: 'Flat bench and one hexagonal black dumbbell.',
  },
  'cable-row': {
    phase: 'the contracted position',
    phaseUz: 'Qisqargan holat',
    camera: SIDE,
    technique: [
      'Seated, feet on the foot platform, knees slightly bent.',
      'Torso upright and still, chest up; the V-handle pulled to the navel.',
      'Elbows back close to the body, shoulder blades squeezed together.',
    ],
    equipment: 'Seated cable row machine with a V-handle; the cable clearly attached to the handle.',
  },
  'chest-supported-row': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: SIDE,
    technique: [
      'Lying face down on a bench inclined to about 30–40°, chest on the pad, toes on the floor.',
      'Dumbbells pulled up beside the ribs, elbows driven back at about 45°.',
      'Shoulder blades squeezed, neck neutral.',
    ],
    equipment: 'Adjustable incline bench and two hexagonal black dumbbells.',
  },
  'inverted-row': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: SIDE,
    technique: [
      'Hanging under a barbell fixed at hip height, heels on the floor.',
      'Body in one straight line from head to heels, glutes tight.',
      'Chest pulled up to the bar, elbows at about 45° from the torso, shoulder blades squeezed.',
    ],
    equipment: 'Barbell fixed in a power rack at hip height.',
  },
  'pull-up': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: REAR34,
    technique: [
      'Overhand grip slightly wider than the shoulders, chin above the bar.',
      'Elbows pointing down and slightly back, shoulders pulled down away from the ears, chest up.',
      'Body straight, legs together slightly in front — no kicking.',
    ],
    equipment: 'Pull-up bar.',
  },
  'chin-up': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: REAR34,
    technique: ['Underhand (palms toward the face) shoulder-width grip, chin above the bar.', 'Elbows down in front of the body, shoulders down, chest up.', 'Body straight, legs together.'],
    equipment: 'Pull-up bar.',
  },
  'lat-pulldown': {
    phase: 'the contracted position',
    phaseUz: 'Qisqargan holat',
    camera: REAR34,
    technique: [
      'Seated with thighs locked under the knee pads.',
      'Wide overhand grip, the bar pulled down to the upper chest.',
      'Torso leaning back about 10–15°, chest up, elbows down and slightly back, shoulders down.',
    ],
    equipment: 'Lat pulldown machine with a long wide bar; the cable clearly attached to the bar.',
  },
  'db-shrug': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: REAR34,
    technique: ['Standing tall, dumbbells at the sides with straight arms.', 'Shoulders elevated straight up toward the ears — no rolling, elbows straight.', 'Neck neutral, chin level.'],
    equipment: 'Two hexagonal black dumbbells.',
  },
  'barbell-curl': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: SIDE.replace('hip height', 'chest height'),
    technique: [
      'Standing tall, underhand shoulder-width grip on a barbell.',
      'Bar curled up to shoulder height, elbows stay at the sides of the body (not swung forward).',
      'Wrists straight, no torso lean back.',
    ],
    equipment: 'Straight barbell with small matte black plates.',
  },
  'db-curl': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: SIDE.replace('hip height', 'chest height'),
    technique: ['Standing tall, both dumbbells curled up to shoulder height, palms facing the shoulders.', 'Elbows stay at the sides of the torso.', 'Wrists straight, no swinging.'],
    equipment: 'Two hexagonal black dumbbells.',
  },
  'hammer-curl': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: SIDE.replace('hip height', 'chest height'),
    technique: ['Standing tall, neutral grip (palms facing each other, thumbs up).', 'Dumbbells curled up to shoulder height, elbows at the sides.', 'Wrists straight, no swinging.'],
    equipment: 'Two hexagonal black dumbbells.',
  },
  'incline-curl': {
    phase: 'midway, forearms horizontal',
    phaseUz: 'O‘rta holat',
    camera: SIDE,
    technique: [
      'Lying back on a bench inclined to about 45–60°, head and back on the pad.',
      'Upper arms hanging straight down, slightly behind the torso, and staying still.',
      'Dumbbells curled until the forearms are horizontal, palms facing up.',
    ],
    equipment: 'Adjustable incline bench and two hexagonal black dumbbells.',
  },
  'cable-curl': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: SIDE.replace('hip height', 'chest height'),
    technique: ['Standing facing a low pulley, underhand grip on a straight cable bar.', 'Bar curled to shoulder height, elbows at the sides.', 'Torso upright, wrists straight.'],
    equipment: 'Cable column with a low pulley and a straight bar; the cable clearly attached to the bar.',
  },
  pushdown: {
    phase: 'the bottom position, elbows straight',
    phaseUz: 'Pastki nuqta',
    camera: SIDE.replace('hip height', 'chest height'),
    technique: [
      'Standing facing a high pulley, slight forward lean, overhand grip on a straight bar.',
      'Elbows fully extended, bar at the front of the thighs.',
      'Upper arms pinned to the sides of the torso, wrists straight.',
    ],
    equipment: 'Cable column with a high pulley and a straight bar; the cable clearly attached to the bar.',
  },
  'overhead-extension': {
    phase: 'the bottom (stretched) position',
    phaseUz: 'Pastki nuqta',
    camera: SIDE.replace('hip height', 'chest height'),
    technique: [
      'Seated upright on a bench, one dumbbell held vertically with both hands cupping the top end.',
      'Dumbbell lowered behind the head, elbows pointing up beside the head, upper arms vertical.',
      'Ribs down, neck neutral.',
    ],
    equipment: 'Bench set upright and one hexagonal black dumbbell.',
  },
  'skull-crusher': {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: BENCH,
    technique: [
      'Lying on a flat bench, feet flat on the floor.',
      'EZ bar lowered to just above the forehead, upper arms angled slightly back from vertical and fixed.',
      'Elbows pointing up, not flaring out; wrists straight.',
    ],
    equipment: 'Flat bench and an EZ curl bar with small matte black plates.',
  },
  'close-grip-bench': {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: BENCH,
    technique: [
      'Lying on a flat bench, shoulder blades pulled back, feet flat.',
      'Grip shoulder width (not narrower), the barbell touching the lower chest.',
      'Elbows tucked close to the torso at about 20–30°, forearms vertical.',
    ],
    equipment: 'Flat bench with uprights and an Olympic barbell with medium matte black plates.',
  },
  'bench-dip': {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: SIDE,
    technique: [
      'Hands on the edge of a flat bench behind the hips, fingers pointing forward.',
      'Legs extended forward, heels on the floor.',
      'Body lowered until the upper arms are parallel to the floor, back close to the bench, shoulders down.',
    ],
    equipment: 'Flat weight bench.',
  },
  plank: {
    phase: 'the hold',
    phaseUz: 'Ushlab turish',
    camera: SIDE.replace('hip height', 'floor height (low camera)'),
    technique: [
      'Forearm plank: elbows directly under the shoulders, forearms parallel.',
      'Body in one straight line from head to heels, glutes and abs tight, hips neither sagging nor piked.',
      'Neck neutral, eyes on the floor.',
    ],
    equipment: 'No equipment, plain floor.',
  },
  'hanging-leg-raise': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: SIDE.replace('hip height', 'chest height'),
    technique: ['Hanging from a pull-up bar with straight arms, shoulders active.', 'Straight legs raised to horizontal (90° at the hips), pelvis tucked under.', 'No swinging, torso vertical.'],
    equipment: 'Pull-up bar.',
  },
  'cable-crunch': {
    phase: 'the bottom (crunched) position',
    phaseUz: 'Qisqargan holat',
    camera: SIDE,
    technique: ['Kneeling facing a high pulley, rope held beside the head.', 'Spine flexed, curling the ribs toward the pelvis, elbows moving toward the thighs.', 'Hips stay still above the knees.'],
    equipment: 'Cable column with a high pulley and a rope; the cable clearly attached to the rope.',
  },
  crunch: {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: SIDE.replace('hip height', 'floor height (low camera)'),
    technique: ['Lying on the back, knees bent, feet flat.', 'Shoulders and upper back curled off the floor, lower back stays on the floor.', 'Hands crossed on the chest, neck neutral.'],
    equipment: 'No equipment, plain floor.',
  },
  'dead-bug': {
    phase: 'the extended position',
    phaseUz: 'Cho‘zilgan holat',
    camera: ABOVE,
    technique: [
      'Lying on the back, lower back pressed flat into the floor.',
      'Right arm extended overhead just above the floor and left leg extended straight just above the floor.',
      'Left arm pointing straight up to the ceiling; right knee bent 90° directly above the hip.',
    ],
    equipment: 'No equipment, plain floor.',
  },
};

/** EMG kalitlari uchun inglizcha nomlar */
export const M3_EN: Record<M3, string> = {
  pecUpper: 'upper (clavicular) chest',
  pecMid: 'middle chest (sternal pectoralis major)',
  pecLower: 'lower chest',
  deltAnt: 'front deltoid',
  deltLat: 'side deltoid',
  deltPost: 'rear deltoid',
  trapUpper: 'upper trapezius',
  trapMid: 'middle trapezius',
  trapLower: 'lower trapezius',
  rhomboids: 'rhomboids',
  lats: 'latissimus dorsi',
  teresMajor: 'teres major',
  infraspinatus: 'infraspinatus and teres minor',
  serratus: 'serratus anterior',
  erectors: 'erector spinae (lower back)',
  rectusAbdominis: 'rectus abdominis',
  externalOblique: 'obliques',
  biceps: 'biceps',
  brachialis: 'brachialis',
  brachioradialis: 'brachioradialis',
  tricepsLong: 'triceps long head',
  tricepsLateral: 'triceps lateral head',
  tricepsMedial: 'triceps medial head',
  forearmFlexors: 'forearm flexors',
  forearmExtensors: 'forearm extensors',
  gluteMax: 'gluteus maximus',
  gluteMed: 'gluteus medius',
  rectusFemoris: 'rectus femoris',
  vastusLateralis: 'vastus lateralis (outer front thigh)',
  vastusMedialis: 'vastus medialis (inner front thigh)',
  bicepsFemoris: 'biceps femoris (outer hamstring)',
  medialHamstrings: 'inner hamstrings',
  adductors: 'inner-thigh adductors',
  gastrocnemius: 'gastrocnemius (calf)',
  soleus: 'soleus',
  tibialisAnterior: 'tibialis anterior',
  iliopsoas: 'hip flexors (iliopsoas)',
};

export interface EquipmentSpec {
  id: EquipmentId;
  desc: string;
}

export const EQUIPMENT_SPECS: EquipmentSpec[] = [
  { id: 'barbell', desc: 'an Olympic barbell lying on the floor, loaded with one large matte black bumper plate on each end, plus two smaller plates leaning against the bar' },
  { id: 'rack', desc: 'a power rack (four-post squat cage) with J-hooks, horizontal safety bars at hip height and an empty Olympic barbell resting on the hooks at shoulder height' },
  { id: 'bench', desc: 'a flat weight bench: one long horizontal padded top on a sturdy steel frame' },
  { id: 'inclineBench', desc: 'an adjustable weight bench with the backrest raised to about 30 degrees and a small seat pad' },
  { id: 'dumbbells', desc: 'a two-tier dumbbell rack holding a neat row of hexagonal rubber dumbbells, from small to large' },
  { id: 'ezBar', desc: 'an EZ curl bar (short bar with a zig-zag cambered middle grip) lying on the floor, loaded with one small matte black plate on each end' },
  { id: 'kettlebell', desc: 'three cast-iron kettlebells of different sizes standing in a row, small to large' },
  {
    id: 'cable',
    desc: 'a cable crossover station: two tall weight-stack towers on the left and right, joined by an overhead frame with a pull-up bar, adjustable pulleys with D-handles on both towers',
  },
  { id: 'latPulldown', desc: 'a lat pulldown machine: a long wide bar hanging from a high cable, a seat with thigh-pad rollers under the bar, and a weight stack behind' },
  { id: 'seatedRow', desc: 'a seated cable row machine: a long low bench seat, an angled foot platform, a low pulley with a V-handle, and a weight stack at the end' },
  { id: 'smith', desc: 'a Smith machine: a barbell fixed inside two vertical steel guide rails in a tall frame, with a flat bench underneath' },
  { id: 'legPress', desc: 'a 45-degree plate-loaded leg press: a reclined padded seat, a large angled foot platform on a sled, weight plates loaded on the side posts' },
  { id: 'hackSquat', desc: 'a plate-loaded hack squat machine: an angled sled with a back pad and two shoulder pads, a large foot platform at the bottom' },
  { id: 'legExtension', desc: 'a seated leg extension machine: a padded seat with an upright backrest, a padded shin roller in front of the seat at ankle height, and a weight stack' },
  { id: 'legCurl', desc: 'a seated leg curl machine: a padded seat with an upright backrest, a thigh hold-down pad above the knees, a padded ankle roller in front, and a weight stack' },
  { id: 'chestPress', desc: 'a seated chest press machine: an upright seat and backrest, two horizontal handles at chest height pointing forward, and a weight stack' },
  { id: 'pecDeck', desc: 'a pec deck (butterfly) machine: an upright seat and backrest with two padded vertical arms on either side that swing together in front of the chest, and a weight stack' },
  { id: 'shoulderPress', desc: 'a seated shoulder press machine: an upright seat and backrest, two handles just above shoulder height pointing up, and a weight stack' },
  { id: 'hyperext', desc: 'a 45-degree back extension (hyperextension) bench: an angled frame with a padded hip support and padded ankle rollers near the floor' },
  { id: 'pullupBar', desc: 'a free-standing pull-up bar: one straight horizontal steel bar about 2.3 m high between two upright steel posts on a wide base' },
  { id: 'dipBars', desc: 'a free-standing dip station: two parallel horizontal bars with rubber grips at waist height on a sturdy steel base' },
  { id: 'bands', desc: 'a set of four flat loop resistance bands of increasing thickness, neatly coiled and fanned out on the floor (black, dark grey, graphite and one lime-green)' },
  { id: 'box', desc: 'a sturdy plyometric box (dark wood or dense foam) with a low aerobic step platform beside it' },
  { id: 'cardio', desc: 'a compact group of cardio machines: a treadmill in front, an upright exercise bike and a rowing machine slightly behind it' },
];
