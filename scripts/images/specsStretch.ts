// Rasm generatsiyasi uchun tavsiflar: cho'zilishlar (stretches.ts). Figura — ayol (prompts.ts).
import type { ExerciseSpec } from './specs';

const SIDE = "side view from the athlete's right at hip height, 50mm lens";
const SIDE_FLOOR = "side view from the athlete's right, camera low at about 40 cm above the floor, 50mm lens";
const MAT = 'Yoga mat on the floor.';
const HELD = 'Cho‘zilgan holat';

export const STRETCH_SPECS: Record<string, ExerciseSpec> = {
  'cat-cow': {
    phase: 'the cat position — spine fully rounded',
    phaseUz: '«Mushuk» holati',
    camera: SIDE_FLOOR,
    technique: [
      'On all fours on the mat: hands directly under the shoulders with fingers spread, knees directly under the hips, tops of the feet flat on the mat.',
      'Arms straight but not locked; the whole spine rounded up toward the ceiling in one smooth arc from the tailbone to the neck, pelvis tucked under.',
      'Head relaxed down between the arms, chin drawn toward the chest, gaze toward the knees.',
      'Hands pressing the floor away so the shoulder blades spread apart.',
    ],
    equipment: MAT,
  },
  'childs-pose': {
    phase: 'the resting held position',
    phaseUz: HELD,
    camera: SIDE_FLOOR,
    technique: [
      'Kneeling on the mat with the big toes touching and the knees about hip-width apart, tops of the feet flat on the mat.',
      'Hips sitting back onto (or just above) the heels; torso folded forward and resting on the thighs, back gently rounded.',
      'Both arms extended straight forward on the mat beyond the head, palms down, shoulders relaxed away from the ears.',
      'Forehead resting on the mat, neck long and relaxed.',
    ],
    equipment: MAT,
  },
  'down-dog': {
    phase: 'the held inverted-V position',
    phaseUz: HELD,
    camera: "side view from the athlete's right, camera at about 60 cm above the floor, 50mm lens",
    technique: [
      'Inverted V shape: hands on the mat shoulder-width apart, slightly in front of the shoulders, fingers spread; feet hip-width apart.',
      'Hips pushed high up and back; spine long and straight from the hands to the tailbone — the lower back is not rounded.',
      'Arms straight and in line with the torso, upper arms beside the ears, head relaxed between the arms, gaze toward the knees.',
      'Knees straight or very slightly bent, heels reaching toward the mat (a few centimeters above it is fine).',
    ],
    equipment: MAT,
  },
  cobra: {
    phase: 'the lifted held position',
    phaseUz: 'Yuqori holat',
    camera: SIDE_FLOOR,
    technique: [
      'Lying face down on the mat, legs extended straight back hip-width apart, tops of the feet flat on the mat.',
      'Pelvis and the front of the thighs stay on the mat; chest lifted so the torso is at about 30–40° to the floor.',
      'Palms on the mat under or slightly in front of the shoulders, elbows slightly bent, tucked close to the ribs and pointing back.',
      'Shoulders down away from the ears, chest open, neck long with the gaze forward and slightly down — the head is not thrown back.',
    ],
    equipment: MAT,
  },
  'thread-needle': {
    phase: 'the threaded position',
    phaseUz: 'Pastki holat',
    camera: "front three-quarter view — 40° in front of the athlete's left side, camera at about 50 cm above the floor, 50mm lens — so the threaded arm and the rotated upper back are visible",
    technique: [
      'On all fours on the mat, hips stacked directly above the knees, tops of the feet on the mat.',
      'Left hand planted on the mat under the left shoulder, left elbow slightly bent, supporting the body.',
      'Right arm threaded under the left arm along the mat toward the left side, palm facing up; the right shoulder and the right side of the head rest on the mat.',
      'Upper back rotated toward the left while the hips stay level above the knees.',
    ],
    equipment: MAT,
  },
  'supine-twist': {
    phase: 'the held twist with the knees dropped to one side',
    phaseUz: HELD,
    camera: "high three-quarter view from above the athlete's feet on the right side (about 45° down), 50mm lens — so the flat shoulders and the knees dropped to the side are both visible",
    technique: [
      'Lying on the back on the mat, both arms extended out to the sides at shoulder height in a T, palms down, both shoulder blades flat on the mat.',
      'Knees bent about 90° and stacked together, both dropped over to the right side, resting on or close to the mat.',
      'Head turned gently to the left, looking away from the knees.',
      'The twist comes from the waist and ribcage; face and body relaxed.',
    ],
    equipment: MAT,
  },
  'hip-flexor-stretch': {
    phase: 'the held position with the hips shifted forward',
    phaseUz: HELD,
    camera: "side view from the athlete's left, camera at about 60 cm above the floor, 50mm lens — the back (stretched) leg is nearest the camera",
    technique: [
      'Half-kneeling: left knee on a folded towel on the mat, directly under or slightly behind the hip, top of the left foot flat on the mat.',
      'Right foot flat on the mat in front, right knee bent about 90° directly above the ankle.',
      'Torso upright and tall, pelvis tucked under with the glutes squeezed, hips shifted a few centimeters forward so the front of the left hip and thigh are stretched; lower back neutral, not arched.',
      'Both hands resting on the front thigh, shoulders relaxed.',
    ],
    equipment: 'Yoga mat on the floor with a small folded towel under the back knee.',
  },
  pigeon: {
    phase: 'the upright held position',
    phaseUz: HELD,
    camera: "front three-quarter view — 40° in front of the athlete's right side, camera at about 50 cm above the floor, 50mm lens — so the bent front shin and the long back leg are both clearly visible",
    technique: [
      'Right leg in front: right knee bent and resting on the mat behind the right wrist, right shin lying diagonally across the mat with the right heel in front of the left hip, right foot flexed.',
      'Left leg extended straight back along the mat, the left knee and the top of the left foot on the mat, toes pointing straight back.',
      'Pelvis level and squared to the front; the right buttock resting on the mat or on a folded blanket.',
      'Torso upright and long, fingertips on the mat on either side of the hips, shoulders relaxed.',
    ],
    equipment: 'Yoga mat on the floor; a small folded blanket under the right buttock.',
  },
  'figure-four': {
    phase: 'the held position with the support thigh pulled in',
    phaseUz: HELD,
    camera: "high three-quarter view from above the athlete's right side (about 35° down), 50mm lens — so the ankle crossed on the opposite knee and the open right knee are clearly visible",
    technique: [
      'Lying on the back on the mat, head and shoulders resting on the mat.',
      'Right ankle crossed over the left thigh just below the left knee, right foot flexed, right knee opened out to the side, forming a "4" shape.',
      'Left foot lifted off the mat and the left thigh drawn toward the chest; both hands clasped behind the left thigh, the right arm reaching through the gap between the legs.',
      'Pelvis and lower back resting on the mat, buttocks not lifted.',
    ],
    equipment: MAT,
  },
  butterfly: {
    phase: 'the held upright seated position',
    phaseUz: HELD,
    camera: 'straight front view, camera slightly above the seated athlete (about 80 cm above the floor), 50mm lens',
    technique: [
      'Sitting upright on the mat, soles of the feet pressed together, heels drawn in toward the groin about a hand-width away.',
      'Knees dropped open to the sides toward the floor, relaxed, not pushed down.',
      'Both hands holding the feet, spine tall from the pelvis to the head, chest open, shoulders relaxed.',
    ],
    equipment: MAT,
  },
  'hamstring-stretch': {
    phase: 'the held position',
    phaseUz: HELD,
    camera: SIDE_FLOOR,
    technique: [
      'Lying on the back on the mat, head and shoulders relaxed on the mat.',
      'Right leg raised straight up toward the ceiling, knee straight, foot flexed (toes toward the face), the leg about 80–90° from the floor.',
      'A strap looped around the ball of the right foot, both hands holding its two ends with the elbows slightly bent, gently drawing the leg toward the body.',
      'Left knee bent with the left foot flat on the mat; lower back and pelvis flat on the mat.',
    ],
    equipment: 'Yoga mat on the floor and a fabric yoga strap looped around the raised foot.',
  },
  'quad-stretch': {
    phase: 'the held standing position',
    phaseUz: HELD,
    camera: SIDE,
    technique: [
      "Standing tall facing a plain wall about an arm's length away, the left palm resting flat on the wall at shoulder height for balance.",
      'Standing on the left leg with a soft knee; the right knee bent and the right hand holding the top of the right foot, heel drawn toward the buttock.',
      'Both knees side by side, the right knee pointing straight down at the floor, the right thigh vertical or slightly behind the body.',
      'Pelvis tucked under with the glutes squeezed, torso upright, lower back not arched.',
    ],
    equipment: 'A plain wall.',
  },
  'calf-stretch': {
    phase: 'the held lunge against the wall',
    phaseUz: HELD,
    camera: SIDE,
    technique: [
      'Facing a plain wall, both palms flat on the wall at shoulder height, elbows slightly bent.',
      'Right leg stepped back about one meter: right knee straight, right heel pressed flat on the floor, toes pointing straight forward.',
      'Left foot forward, closer to the wall, with the left knee bent.',
      'Body in one straight line from the right heel to the head, leaning toward the wall; hips not sagging.',
    ],
    equipment: 'A plain wall.',
  },
  'doorway-chest': {
    phase: 'the held position stepped through the doorway',
    phaseUz: HELD,
    camera: "rear three-quarter view — 35° behind the athlete's right side, at shoulder height, 50mm lens — so the right forearm on the door frame and the open chest are both visible",
    technique: [
      'Standing in an open doorway; the right forearm and palm flat against the door frame, right elbow bent 90° at shoulder height, upper arm horizontal and out to the side.',
      'Right foot a small step forward through the doorway, body leaning gently forward so the right arm stays slightly behind the chest.',
      'Torso upright, shoulders down away from the ears, lower back neutral.',
      'Left arm relaxed by the side.',
    ],
    equipment: 'A plain open doorway with a simple door frame.',
  },
  'cross-body-shoulder': {
    phase: 'the held position',
    phaseUz: HELD,
    camera: "front three-quarter view — 30° in front of the athlete's right side, at chest height, 50mm lens",
    technique: [
      'Standing tall, feet hip-width apart.',
      'Right arm straight and drawn horizontally across the front of the chest toward the left side, at shoulder height.',
      'Left hand holding the right arm just above the elbow, gently pulling it closer to the chest.',
      'Right shoulder relaxed down away from the ear; torso facing forward, not rotated.',
    ],
    equipment: 'No equipment, plain floor.',
  },
  'neck-stretch': {
    phase: 'the held side-bend position',
    phaseUz: HELD,
    camera: 'straight front view at chest height, 50mm lens',
    technique: [
      'Standing tall, feet hip-width apart, shoulders relaxed.',
      'Head tilted to the right, the right ear moving toward the right shoulder; face looking forward, not rotated.',
      'Right hand resting lightly on the left side of the head above the ear, not pulling.',
      'Left arm hanging down by the side with the left shoulder drawn down, lengthening the left side of the neck.',
    ],
    equipment: 'No equipment, plain floor.',
  },
};
