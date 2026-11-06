// Yangi mashqlar uchun ikkinchi kadr: harakatning boshqa cheti (asosiy kadr — specs*.ts dagi holat).
// Flow'da ikkinchi kadr birinchisidan yaratiladi: o'sha kamera, o'sha odam va jihoz, faqat poza o'zgaradi.
// phaseUz 'Boshlang‘ich holat' bo'lsa — ilovadagi harakatda birinchi ko'rsatiladi.

export interface PairSpec {
  phaseUz: string;
  change: string;
}

const START = 'Boshlang‘ich holat';

export const NEW_PAIRS: Record<string, PairSpec> = {
  /* ---------- uyda ---------- */
  'sumo-squat': { phaseUz: START, change: 'standing tall at the top: hips and knees fully extended, the same very wide stance with toes turned out, the dumbbell still held by its top end in straight arms hanging between the thighs' },
  'reverse-lunge': { phaseUz: START, change: 'standing tall at the start: both feet side by side hip-width apart, knees straight, torso upright, hands in the same place' },
  'curtsy-lunge': { phaseUz: START, change: 'standing tall at the start: both feet side by side hip-width apart, knees straight, torso upright, hands in the same place' },
  'wall-sit': { phaseUz: START, change: 'standing upright with the back flat against the same wall, knees straight, feet about 50 cm in front of the wall, arms relaxed at the sides' },
  'single-leg-bridge': { phaseUz: START, change: 'the bottom: hips resting on the floor, the working foot still flat with the knee bent, the free leg held in exactly the same raised position as in image 1' },
  'glute-kickback': { phaseUz: START, change: 'the start on all fours: the working knee drawn forward under the hip toward the chest, back still flat, hands and the support knee in the same place' },
  'fire-hydrant': { phaseUz: START, change: 'the start on all fours: both knees on the mat directly under the hips, back flat, hands in the same place' },
  clamshell: { phaseUz: START, change: 'the closed position: both knees together, stacked one on top of the other, heels still touching, hips and shoulders stacked, head on the bottom arm as before' },
  'side-leg-raise': { phaseUz: START, change: 'the start: the top leg lowered to rest straight on the bottom leg, legs stacked, head on the bottom arm as before' },
  'banded-lateral-walk': { phaseUz: START, change: 'feet hip-width apart (narrower than in image 1), the same mini band above the ankles still slightly taut, the same half-squat posture and hands on the hips' },
  'ball-leg-curl': { phaseUz: START, change: 'legs extended almost straight with only the heels resting on top of the same stability ball, which has rolled away from the body; hips still lifted so shoulders, hips and heels form one straight line' },
  superman: { phaseUz: START, change: 'lying flat face down: arms extended forward resting on the floor, legs straight resting on the floor, forehead just above the floor, body relaxed' },
  'knee-push-up': { phaseUz: START, change: 'the top: arms straight, palms in the same place on the mat, knees on the mat, body one straight line from knees to head' },
  'band-row': { phaseUz: START, change: 'the start: arms extended straight forward toward the feet holding the band ends, the band still taut around the soles, torso upright, shoulder blades spread' },
  'bird-dog': { phaseUz: START, change: 'the start on all fours: both hands under the shoulders and both knees under the hips on the mat, back flat like a table' },
  'side-plank': { phaseUz: START, change: 'the start: lying on the side with the hip resting on the mat, the bottom forearm already under the shoulder, legs stacked, top arm resting along the body' },
  'reverse-crunch': { phaseUz: START, change: 'the start: lying flat with the pelvis and lower back on the floor, knees bent 90° directly above the hips (shins parallel to the floor), arms beside the body' },
  'bicycle-crunch': { phaseUz: 'Ikkinchi tomon', change: 'the twist to the OTHER side — mirror the legs and the twist: the knee that is bent toward the chest in image 1 is now extended straight just above the floor, and the leg that is straight in image 1 is now bent with its knee pulled toward the chest; the torso rotates the other way so the OTHER shoulder moves toward this knee. Hands at the temples and elbows wide as before' },
  'mountain-climber': { phaseUz: 'Ikkinchi oyoq', change: 'the legs SWAPPED: the leg that is bent forward under the chest in image 1 is now extended straight back on the ball of the foot, and the leg that is straight back in image 1 is now bent with its knee driven forward under the chest and the foot off the floor. Hands, arms, head and hip height exactly the same' },
  /* ---------- trenajyorlar ---------- */
  'hip-abduction': { phaseUz: START, change: 'the start: knees together, the two thigh pads close together on the outside of the thighs, seated upright on the same machine' },
  'hip-adduction': { phaseUz: START, change: 'the start: knees spread wide apart (about 40–45° each side), the two thigh pads opened with the thighs on the inside, seated upright on the same machine' },
  'cable-kickback': { phaseUz: START, change: 'the start: the working leg under the hip beside the support leg, knee slightly bent, foot just behind the support foot; the cable from the low pulley to the ankle cuff still taut' },
  'cable-pull-through': { phaseUz: START, change: 'standing tall at the top: hips and knees extended, glutes squeezed, the rope ends held in straight arms in front of the hips, the cable still running back between the legs to the same low pulley' },
  'seated-calf-raise': { phaseUz: START, change: 'the bottom: heels lowered well BELOW the front edge of the foot plate (ankles flexed, calves stretched), only the balls of the feet on the edge; the padded knee lever is lower on the thighs accordingly' },
  'assisted-pull-up': { phaseUz: START, change: 'the bottom: arms fully extended overhead holding the same handles, kneeling on the same assist platform, which has moved up with the body; shoulders still down away from the ears' },
  'preacher-curl': { phaseUz: START, change: 'the start: arms extended almost straight down the angled pad (elbows slightly bent), the EZ bar lowered near the bottom of the pad, upper arms still flat on the pad' },
  't-bar-row': { phaseUz: START, change: 'the bottom: arms fully straight, the plates lowered close to the floor in front of the shins, both hands still gripping the bar just behind the plates; the bar is still ONE straight line from the same floor pivot through the hands to the plates; torso angle, legs and feet unchanged' },
  'ab-wheel': { phaseUz: START, change: 'the start: kneeling with the wheel on the floor directly under the shoulders, hips back above the knees, arms straight, back neutral' },
  /* ---------- cho'zilish ---------- */
  'cat-cow': { phaseUz: '«Sigir» holati', change: 'the COW position: the spine arched the other way — belly lowered toward the mat, chest pushed forward, tailbone and head lifted, gaze slightly forward; hands and knees in the same place' },
  'childs-pose': { phaseUz: START, change: 'the start: kneeling upright and sitting back on the heels, torso vertical, hands resting on the thighs' },
  'down-dog': { phaseUz: START, change: 'the start on all fours: hands in the same place, knees on the mat under the hips, back flat' },
  cobra: { phaseUz: START, change: 'the start: lying face down with the chest and forehead on the mat, palms flat under the shoulders, elbows bent close to the ribs' },
  'thread-needle': { phaseUz: 'Ochilgan holat', change: 'the open position: the right arm reaching straight up toward the ceiling, chest rotated open to the right, gaze following the hand; left hand and both knees in the same place' },
  'supine-twist': { phaseUz: START, change: 'the start: lying on the back, arms out in the same T, knees bent and pointing straight up to the ceiling, feet flat on the mat' },
  'hip-flexor-stretch': { phaseUz: START, change: 'the start: the same half-kneeling stance but hips stacked directly above the back knee (not shifted forward), torso upright' },
  pigeon: { phaseUz: 'Chuqurroq holat', change: 'the deeper position: the torso folded forward over the front shin with a long spine, forearms resting on the mat, forehead toward the mat; legs exactly the same' },
  'figure-four': { phaseUz: START, change: 'the start: the left foot flat on the mat with the knee bent, the right ankle still crossed over the left knee, hands resting on the mat' },
  butterfly: { phaseUz: 'Chuqurroq holat', change: 'the deeper position: the torso leaning forward from the hips with a long straight back, chest toward the feet, hands still holding the feet' },
  'hamstring-stretch': { phaseUz: START, change: 'the start: the right knee bent toward the chest with the strap around the foot, the left leg straight on the mat' },
  'quad-stretch': { phaseUz: START, change: 'the start: standing tall on both feet, the left palm on the same wall, the right hand at the side' },
  'calf-stretch': { phaseUz: START, change: 'the start: standing upright close to the same wall with both feet together, palms on the wall at shoulder height' },
  'doorway-chest': { phaseUz: START, change: 'the start: standing in the same doorway with the forearm on the frame, both feet together level with the door frame, torso upright (not leaning forward)' },
  'cross-body-shoulder': { phaseUz: START, change: 'the start: standing tall, the right arm straight forward at shoulder height, the left hand at the side' },
  'neck-stretch': { phaseUz: START, change: 'the start: standing tall with the head upright and level, both arms relaxed at the sides' },
};
