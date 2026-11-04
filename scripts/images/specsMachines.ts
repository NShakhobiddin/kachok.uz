// Rasm generatsiyasi uchun tavsiflar: qo'shimcha trenajyor mashqlari (exercisesMachines.ts). Figura — ayol (prompts.ts).
import type { ExerciseSpec } from './specs';

const SIDE = "side view from the athlete's right at hip height, 50mm lens";
const REAR34 = "rear three-quarter view — 30° behind the athlete's right side, at hip height, 50mm lens";
const FRONT34 = "front three-quarter view — 30° in front of the athlete's right side, at hip height, 50mm lens";

export const MACHINES_SPECS: Record<string, ExerciseSpec> = {
  'hip-abduction': {
    phase: 'the open position, knees pushed fully apart',
    phaseUz: 'Ochilgan holat',
    camera: `${REAR34} — so the outer hips and the glutes on the seat are clearly visible`,
    technique: [
      'Seated upright with the back against the backrest, feet on the two foot bars, thighs roughly parallel to the floor.',
      'The two thigh pads press on the OUTSIDE of the thighs just above the knees; the knees are pushed outward against them to about 40–45° of hip abduction on each side.',
      'Hands grip the side handles beside the seat, hips stay down on the seat, torso still, no leaning back.',
    ],
    equipment:
      'Seated hip abduction machine (abductor): a padded seat with an upright backrest, two vertical padded thigh pads on swinging arms placed on the OUTSIDE of the knees, two foot bars, short side handles and a weight stack behind the seat.',
  },
  'hip-adduction': {
    phase: 'the closed position, knees squeezed together',
    phaseUz: 'Yopilgan holat',
    camera: `${FRONT34} — so the inner thighs are clearly visible`,
    technique: [
      'Seated upright with the back against the backrest, feet on the two foot bars, thighs roughly parallel to the floor.',
      'The two thigh pads press on the INSIDE of the thighs just above the knees; the knees are squeezed together until the pads almost touch.',
      'Hands grip the side handles beside the seat, hips stay down on the seat, torso upright.',
    ],
    equipment:
      'Seated hip adduction machine (adductor): a padded seat with an upright backrest, two vertical padded thigh pads on swinging arms placed on the INSIDE of the knees, two foot bars, short side handles and a weight stack behind the seat.',
  },
  'cable-kickback': {
    phase: 'the top position, working leg extended back',
    phaseUz: 'Yuqori nuqta',
    camera: SIDE,
    technique: [
      'Standing facing a cable column, about two small steps away, both hands holding the column frame at chest height, torso leaning forward about 20–30°.',
      'A padded ankle cuff on the RIGHT ankle is clipped to the LOW pulley; the cable runs forward and down from the ankle to the pulley near the floor.',
      'The right leg is pushed straight back from the hip until the thigh is in line with the torso (not higher), knee almost straight, foot flexed; the left standing leg slightly bent.',
      'Neutral spine — no lower-back arch, pelvis square to the column, glutes squeezed.',
    ],
    equipment: 'Cable column with the pulley set at the lowest position, a padded ankle strap (ankle cuff) clipped to the cable; the cable clearly attached to the ankle cuff.',
  },
  'cable-pull-through': {
    phase: 'the bottom (hinged) position',
    phaseUz: 'Pastki nuqta',
    camera: SIDE,
    technique: [
      'Standing with the back to a low pulley, feet slightly wider than shoulders, about two steps away from the column.',
      'A rope attachment runs from the low pulley forward BETWEEN the legs; both hands hold the rope ends between the thighs with straight arms.',
      'Hip hinge: hips pushed back, torso leaning forward about 45° with a flat neutral back, knees softly bent (not a squat), shins nearly vertical, hands pulled back just behind the knees.',
    ],
    equipment: 'Cable column with the pulley at the lowest position and a triceps rope attachment; the cable clearly passes between the legs to the rope.',
  },
  'seated-calf-raise': {
    phase: 'the top position, heels raised',
    phaseUz: 'Yuqori nuqta',
    camera: SIDE,
    technique: [
      'Seated with knees bent at 90°, thighs horizontal, the padded lever resting across the lower thighs just above the knees.',
      'The balls of both feet on the edge of the foot plate, heels free; ankles fully extended so the heels are lifted as high as possible.',
      'Torso upright, hands holding the lever handles on top of the knee pad.',
    ],
    equipment:
      'Plate-loaded seated calf raise machine: a low seat, a horizontal padded knee lever above the thighs with a safety catch handle and a weight-plate horn at its front end, and a small angled foot plate in front of the seat.',
  },
  'assisted-pull-up': {
    phase: 'the top position, chin above the handles',
    phaseUz: 'Yuqori nuqta',
    camera: `${REAR34.replace('hip height', 'chest height')} — so the kneeling pad, the back and the handles are all visible`,
    technique: [
      'Kneeling on the padded assist platform with both knees, shins resting on the pad, torso vertical, slight lean back.',
      'Hands on the high handles about shoulder width (neutral or overhand grip), chin just above the handles, elbows pulled down beside the ribs, shoulders down.',
      'The platform has risen with the athlete — it pushes up on the knees from below.',
    ],
    equipment:
      'Counterweight assisted pull-up/dip machine (gravitron): a tall frame with high pull-up handles, a padded kneeling platform on a lever arm in the middle, step-up foot rails on both sides and a selectorized weight stack at the back.',
  },
  'preacher-curl': {
    phase: 'midway, forearms horizontal',
    phaseUz: 'O‘rta holat',
    camera: SIDE.replace('hip height', 'chest height'),
    technique: [
      'Seated at a preacher bench, armpits on the top edge of the pad, the backs of both upper arms lying flat on the angled pad (about 45°).',
      'Underhand grip on an EZ curl bar at shoulder width, curled up until the forearms are horizontal; elbows stay on the pad.',
      'Torso upright and still, shoulders down, wrists straight.',
    ],
    equipment: 'Preacher (Scott) curl bench: an adjustable seat and a sloping arm pad at about 45° on a steel post, with a bar rack; an EZ curl bar with small matte black plates.',
  },
  't-bar-row': {
    phase: 'the top position',
    phaseUz: 'Yuqori nuqta',
    camera: SIDE,
    technique: [
      'Standing astride ONE straight Olympic bar: its back end is anchored in a landmine pivot on the floor BEHIND the athlete, the bar runs forward between the feet, and its FRONT end, loaded with plates, is under the chest.',
      'Both hands grip the bar itself just behind the plates, one hand in front of the other, palms facing each other — no handle attachment.',
      'Hip hinge with the torso at about 45° to the floor, knees bent, back flat; the bar pulled up until the hands touch the upper abdomen, elbows close to the body pointing back, shoulder blades squeezed, neck neutral.',
    ],
    equipment:
      'Landmine T-bar row setup: ONE straight rigid Olympic barbell — the back end in a floor landmine pivot, two medium matte black plates on the front end. The bar is one straight line from the pivot on the floor, between the athlete’s legs, through the hands to the plates; the plates are always ON the bar, never on the floor.',
  },
  'ab-wheel': {
    phase: 'the extended position',
    phaseUz: 'Cho‘zilgan holat',
    camera: SIDE.replace('hip height', 'floor height (low camera)'),
    technique: [
      'Kneeling on a soft mat, both hands on the handles of an ab wheel that has rolled forward ahead of the head.',
      'Body in one straight line from knees to shoulders, slightly inclined (shoulders higher than knees), hips NOT sagging, glutes squeezed, ribs down.',
      'Arms straight, extended forward and overhead, neck neutral, eyes on the floor.',
    ],
    equipment: 'An ab wheel (small single wheel with a handle on each side) and a thin exercise mat.',
  },
};
