// Rasm generatsiyasi uchun tavsiflar: uydagi mashqlar (exercisesHome.ts). Figura — ayol (prompts.ts).
import type { ExerciseSpec } from './specs';

const SIDE = "side view from the athlete's right at hip height, 50mm lens";
const LOW_SIDE = "side view from the athlete's right at floor height (low camera), 50mm lens";
const FRONT = 'straight-on front view at hip height, 50mm lens';
const FRONT34 = "front three-quarter view — 30° in front of the athlete's right side, at hip height, 50mm lens";
const REAR34 = "rear three-quarter view — 30° behind the athlete's right side, at hip height, 50mm lens";
const ABOVE = 'high three-quarter view from above the right side (about 40° down), 50mm lens';
/** yonboshlab yotgan figura: kamera old tomonda (qorin tomonidan), bir oz yuqoridan */
const LYING_FRONT = 'view from in front of the athlete (facing the chest and knees), camera slightly above floor height and about 20° down, 50mm lens';

const MAT = 'A plain dark exercise mat on the floor, no other equipment.';
const FLOOR = 'No equipment, plain floor.';

export const HOME_SPECS: Record<string, ExerciseSpec> = {
  'sumo-squat': {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: FRONT34,
    technique: [
      'Very wide stance, about twice shoulder width, toes turned out about 30–45°, heels flat.',
      'One dumbbell held vertically by its top end with both hands, arms straight, hanging between the legs below the hips; it does not touch the floor.',
      'Thighs parallel to the floor, knees pushed out directly over the toes (not caving in), torso upright with a neutral spine, chest up.',
    ],
    equipment: 'One hexagonal black dumbbell.',
  },
  'reverse-lunge': {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: SIDE,
    technique: [
      'Long split stance after stepping backward: front foot flat, front shin nearly vertical, front thigh parallel to the floor.',
      'Back knee about 3 cm above the floor directly under the hip, back heel raised, weight on the ball of the back foot.',
      'Torso upright with a slight forward lean from the hips, neutral spine, hands on the hips.',
    ],
    equipment: FLOOR,
  },
  'curtsy-lunge': {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: FRONT34,
    technique: [
      'The back leg has stepped diagonally behind and across the front leg, like a curtsy; back heel raised, back knee a few centimeters above the floor.',
      'Front foot flat, front knee bent about 90° and tracking over the middle toes, not collapsing inward.',
      'Hips and shoulders square to the camera-facing front (not rotated), torso upright, hands on the hips.',
    ],
    equipment: FLOOR,
  },
  'wall-sit': {
    phase: 'the hold',
    phaseUz: 'Ushlab turish',
    camera: SIDE,
    technique: [
      'Back, shoulders and back of the head flat against a plain wall.',
      'Thighs parallel to the floor, knees bent 90° directly above the ankles, shins vertical, feet flat hip width apart.',
      'Arms extended straight forward at shoulder height, not resting on the thighs.',
    ],
    equipment: 'A plain flat wall behind the athlete, no other equipment.',
  },
  'single-leg-bridge': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: LOW_SIDE,
    technique: [
      'Lying on the back, one foot flat on the floor with the knee bent about 90°, arms resting on the floor beside the body.',
      'Hips lifted so the shoulder, hip and knee of the working leg form one straight line; pelvis level (not dropping toward the free leg), ribs down, no lower-back arch.',
      'The other leg held straight, extended in line with the working thigh, toes pulled toward the shin.',
    ],
    equipment: MAT,
  },
  'glute-kickback': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: SIDE,
    technique: [
      'On all fours: hands flat directly under the shoulders, the support knee directly under the hip, back flat.',
      'The working leg kicked back and up with the knee bent 90°: thigh parallel to the floor in line with the torso, sole of the foot facing the ceiling.',
      'No lower-back arch, pelvis level and square to the floor, neck neutral with eyes on the floor.',
    ],
    equipment: MAT,
  },
  'fire-hydrant': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: REAR34,
    technique: [
      'On all fours: hands flat directly under the shoulders, the support knee directly under the hip, back flat.',
      'The working leg lifted out to the side with the knee bent 90°: thigh close to parallel with the floor, pointing sideways, lower leg parallel to the floor behind the knee.',
      'Torso and pelvis stay level and square to the floor — no leaning away from the lifted leg, no back arch.',
    ],
    equipment: MAT,
  },
  clamshell: {
    phase: 'the open position',
    phaseUz: 'Yuqori nuqta',
    camera: LYING_FRONT,
    technique: [
      'Lying on the side, head resting on the extended bottom arm; hips bent about 45° and knees about 90°; hips and shoulders stacked vertically.',
      'Heels together, the top knee opened upward like a clamshell about 30–40° while the feet stay touching.',
      'The pelvis does not roll backward; the top hand rests on the top hip.',
    ],
    equipment: MAT,
  },
  'side-leg-raise': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: LYING_FRONT,
    technique: [
      'Lying on the side, head resting on the bottom arm, bottom knee slightly bent for stability; hips and shoulders stacked vertically.',
      'The top leg straight, raised about 35° from the bottom leg, in line with the torso or slightly behind it (not drifting forward).',
      'Top toes pointing forward (not toward the ceiling), the top hand resting on the hip, pelvis not rolling.',
    ],
    equipment: MAT,
  },
  'banded-lateral-walk': {
    phase: 'the wide step',
    phaseUz: 'Qisqargan holat',
    camera: FRONT,
    technique: [
      'A mini loop band around both legs just above the ankles, stretched taut between them.',
      'Half-squat position: hips back, knees bent about 30°, torso leaning slightly forward with a neutral spine, hands on the hips.',
      'Mid side-step: feet about shoulder width apart, toes pointing forward, knees pushed out over the toes (not caving in).',
    ],
    equipment: 'One lime-green elastic mini loop band around the lower legs.',
  },
  'ball-leg-curl': {
    phase: 'the curled position',
    phaseUz: 'Qisqargan holat',
    camera: LOW_SIDE,
    technique: [
      'Lying on the back, shoulders and arms on the floor, arms beside the body with palms down.',
      'Hips lifted high; knees bent about 90°, soles of both feet flat on top of a large stability ball pulled in toward the buttocks.',
      'Shoulders, hips and knees in one line, no lower-back arch.',
    ],
    equipment: 'One large matte black stability ball (about 65 cm) resting on the floor; a plain dark exercise mat.',
  },
  superman: {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: SIDE.replace('hip height', 'floor height (low camera)'),
    technique: [
      'Lying face down, arms extended straight forward beyond the head, legs straight.',
      'Arms, chest and legs lifted only a few centimeters off the floor; the belly and pelvis stay on the floor.',
      'Long body shape, glutes squeezed, neck neutral — eyes looking at the floor, head not thrown back.',
    ],
    equipment: MAT,
  },
  'knee-push-up': {
    phase: 'the bottom position',
    phaseUz: 'Pastki nuqta',
    camera: SIDE.replace('hip height', 'floor height (low camera)'),
    technique: [
      'Kneeling push-up: knees on the mat, lower legs raised with ankles crossed.',
      'Body in one straight line from knees to head — hips neither piked nor sagging; chest about 5 cm above the floor.',
      'Hands slightly wider than the shoulders, under the chest; elbows at about 45° from the torso.',
    ],
    equipment: MAT,
  },
  'band-row': {
    phase: 'the contracted position',
    phaseUz: 'Qisqargan holat',
    camera: SIDE,
    technique: [
      'Sitting upright on the floor, legs extended forward with knees slightly bent, a long resistance band looped around the soles of both feet.',
      'Band ends pulled to the lower ribs: elbows driven back close to the body, behind the torso.',
      'Shoulder blades squeezed together and down, chest up, torso upright (not leaning back).',
    ],
    equipment: 'One long lime-green resistance band looped under the feet.',
  },
  'bird-dog': {
    phase: 'the extended position',
    phaseUz: 'Cho‘zilgan holat',
    camera: SIDE,
    technique: [
      'On all fours: one hand flat under the shoulder, the opposite knee under the hip.',
      'The other arm extended straight forward at shoulder height, thumb up; the opposite leg extended straight back at hip height, toes pointing down.',
      'Back flat like a table, hips and shoulders level and square to the floor, neck neutral.',
    ],
    equipment: MAT,
  },
  'side-plank': {
    phase: 'the hold',
    phaseUz: 'Ushlab turish',
    camera: FRONT.replace('hip height', 'floor height (low camera)'),
    technique: [
      'Forearm side plank: the bottom elbow directly under the shoulder, forearm on the floor pointing forward.',
      'Body in one straight line from feet to head, feet stacked, hips lifted (not sagging and not rotated backward).',
      'The top arm extended straight up toward the ceiling, the bottom shoulder pushed away from the ear.',
    ],
    equipment: MAT,
  },
  'reverse-crunch': {
    phase: 'the top position',
    phaseUz: 'Qisqargan holat',
    camera: SIDE.replace('hip height', 'floor height (low camera)'),
    technique: [
      'Lying on the back, arms on the floor beside the body, palms down; head and shoulders stay on the floor.',
      'Knees bent about 90° and pulled toward the chest; the pelvis curled up so the lower back lifts a few centimeters off the floor.',
      'Movement comes from curling the pelvis, not from swinging the legs.',
    ],
    equipment: MAT,
  },
  'bicycle-crunch': {
    phase: 'the twist to one side',
    phaseUz: 'Qisqargan holat',
    camera: ABOVE,
    technique: [
      'Lying on the back, shoulder blades lifted off the floor, fingertips lightly at the temples, elbows wide.',
      'One knee pulled toward the chest while the torso rotates so the opposite shoulder (not just the elbow) moves toward that knee.',
      'The other leg extended straight about 30–45° above the floor; lower back pressed into the floor.',
    ],
    equipment: MAT,
  },
  'mountain-climber': {
    phase: 'one knee driven forward',
    phaseUz: 'Qisqargan holat',
    camera: SIDE,
    technique: [
      'High plank: arms straight, hands flat directly under the shoulders.',
      'One knee driven forward under the chest with the foot off the floor; the other leg extended straight back on the ball of the foot.',
      'Hips level with the shoulders (not piked up, not sagging), back flat, neck neutral.',
    ],
    equipment: MAT,
  },
};
