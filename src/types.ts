// Umumiy turlar (types) — butun ilova shu modellar atrofida quriladi.

export type MuscleId =
  | 'chest'
  | 'frontDelts'
  | 'sideDelts'
  | 'rearDelts'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'traps'
  | 'lats'
  | 'upperBack'
  | 'lowerBack'
  | 'abs'
  | 'obliques'
  | 'glutes'
  | 'quads'
  | 'hamstrings'
  | 'adductors'
  | 'calves';

/** Haftalik hajm hisoblanadigan yirik guruhlar */
export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'core';

export type EquipmentId =
  | 'barbell'
  | 'rack'
  | 'bench'
  | 'inclineBench'
  | 'dumbbells'
  | 'ezBar'
  | 'kettlebell'
  | 'cable'
  | 'latPulldown'
  | 'seatedRow'
  | 'smith'
  | 'legPress'
  | 'hackSquat'
  | 'legExtension'
  | 'legCurl'
  | 'chestPress'
  | 'pecDeck'
  | 'shoulderPress'
  | 'hyperext'
  | 'pullupBar'
  | 'dipBars'
  | 'bands'
  | 'box'
  | 'cardio';

export type Injury = 'knee' | 'lowerBack' | 'shoulder' | 'wrist' | 'elbow' | 'neck' | 'hip';

export type Pattern =
  | 'squat'
  | 'hinge'
  | 'lunge'
  | 'quadIso'
  | 'hamIso'
  | 'glute'
  | 'calf'
  | 'hPush'
  | 'iPush'
  | 'vPush'
  | 'hPull'
  | 'vPull'
  | 'fly'
  | 'lateral'
  | 'rearDelt'
  | 'biceps'
  | 'triceps'
  | 'core'
  | 'traps';

export type Goal = 'fatLoss' | 'muscle' | 'strength' | 'recomp' | 'health';
export type Sex = 'male' | 'female';
export type Level = 'beginner' | 'intermediate' | 'advanced';

export type BenefitId =
  | 'bone'
  | 'heart'
  | 'metabolic'
  | 'posture'
  | 'backHealth'
  | 'joints'
  | 'mood'
  | 'longevity'
  | 'grip'
  | 'balance'
  | 'core'
  | 'fatLoss';

/* ---------- Animatsiya (figura) ---------- */

export interface Pt {
  x: number;
  y: number;
}

/** Yon ko‘rinishdagi figura pozasi. Burchaklar "soat" bo‘yicha: 0 = tepaga, 90 = oldinga, 180 = pastga. */
export interface SidePose {
  torso: number;
  head?: number;
  /** umurtqa egilishi (xato "dumaloq bel" ko‘rsatish uchun), 0 = to‘g‘ri */
  curve?: number;
  ua: number;
  fa: number;
  th: number;
  sh: number;
  ft?: number;
  ua2?: number;
  fa2?: number;
  th2?: number;
  sh2?: number;
  ft2?: number;
  /** IK: qo‘l (bilak) shu nuqtaga yetadi */
  hand?: Pt;
  hand2?: Pt;
  /** IK: oyoq (to‘piq) shu nuqtaga yetadi */
  foot?: Pt;
  foot2?: Pt;
  /** tovon ko‘tarilishi (0..1) — boldir mashqlari uchun */
  heel?: number;
  /** ushbu kadr uchun langar nuqtasi (harakatlanuvchi langar) */
  at?: Pt;
}

export type Anchor =
  | { joint: 'ankle' | 'hip' | 'shoulder' | 'wrist' | 'toe' | 'knee'; x: number; y: number };

/** Old ko‘rinishdagi figura: qo‘l va oyoqlar o‘ng tomoni uchun, chap tomoni ko‘zgu */
export interface FrontPose {
  ua: number;
  fa: number;
  /** gorizontal yaqinlashtirish (0 = yon tomonda, 90 = oldinga) */
  fwd?: number;
  th?: number;
  sh?: number;
  /** tos balandligi (y) */
  hipY?: number;
  /** yelka ko‘tarilishi (shrug) */
  shrug?: number;
  /** sonlarni kamera tomonga burish (o‘tirgan holat) */
  legFwd?: number;
  /** IK: o‘ng qo‘l shu nuqtaga yetadi (chap tomoni ko‘zgu) */
  hand?: Pt;
}

export type PropKind =
  | 'bench'
  | 'inclineBench'
  | 'rack'
  | 'pullupBar'
  | 'dipBars'
  | 'cableTower'
  | 'box'
  | 'seat'
  | 'pad'
  | 'mat'
  | 'legPressFrame'
  | 'machine'
  | 'benchTop'
  | 'seatFront';

export interface Prop {
  kind: PropKind;
  x: number;
  y: number;
  w?: number;
  h?: number;
  angle?: number;
}

export type HeldKind = 'barbell' | 'dumbbell' | 'kettlebell' | 'cable' | 'ezbar' | 'plate' | 'band' | 'handle';

export interface Held {
  kind: HeldKind;
  /** kabel/lenta uchun bog‘lanish nuqtasi */
  from?: Pt;
  /** ikki qo‘l bilan bitta snaryad (old ko‘rinishda shtanga) */
  both?: boolean;
  /** faqat yaqin qo‘lda */
  single?: boolean;
}

/** Oyoqqa bog‘langan dinamik snaryad (oyoq press platformasi, trenajyor yostig‘i) */
export interface FootGear {
  kind: 'platform' | 'anklePad' | 'shinPad' | 'kneePad';
  /** platformaning burchagi */
  angle?: number;
}

export type Phase = 'hold' | 'down' | 'up' | 'squeeze';

export interface KeyFrame<P> {
  pose: P;
  /** keyingi kadrga o‘tish davomiyligi (ms) */
  dur: number;
  phase: Phase;
}

export interface AnimSpec {
  view: 'side' | 'front' | 'back';
  anchor?: Anchor;
  frames: KeyFrame<SidePose | FrontPose>[];
  props?: Prop[];
  held?: Held;
  footGear?: FootGear;
  /** figura qaysi tomonga qaragan */
  facing?: 'right' | 'left';
  /** kamera ramkasi: viewBox */
  frame?: { x: number; y: number; w: number; h: number };
  /** pol balandligi */
  floorY?: number;
}

export interface MistakeDemo {
  /** harakat amplitudasini kamaytirish (0..1) */
  rom?: number;
  /** ma’lum kadrlarga o‘zgartirish */
  set?: { kf: number; pose: Partial<SidePose & FrontPose> }[];
}

export interface Mistake {
  title: string;
  why: string;
  fix: string;
  demo?: MistakeDemo;
}

export type LoadType = 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'kettlebell' | 'band';

export interface Exercise {
  id: string;
  name: string;
  en: string;
  pattern: Pattern;
  mechanics: 'compound' | 'isolation';
  primary: MuscleId[];
  secondary: MuscleId[];
  /** barchasi kerak bo‘lgan jihozlar ([] = tana vazni) */
  equipment: EquipmentId[];
  /** shulardan bittasi kifoya (masalan, skameyka yoki qiya skameyka) */
  equipmentAny?: EquipmentId[];
  level: 1 | 2 | 3;
  /** mushak o‘stirish/kuch uchun samaradorlik bahosi (1–10) */
  score: number;
  loadType: LoadType;
  unilateral?: boolean;
  /** og‘irlik qadami (kg) */
  increment: number;
  /** ushbu jarohatlarda tavsiya etilmaydi */
  avoid?: Injury[];
  /** ehtiyotkorlik bilan */
  caution?: Injury[];
  setup: string[];
  steps: string[];
  cues: string[];
  breathing: string;
  mistakes: Mistake[];
  benefits: { id: BenefitId; text: string }[];
  anim: AnimSpec;
  /** tavsiya etilgan sur’at, masalan "3-1-1" (pastga-pauza-yuqoriga) */
  tempo?: string;
  /** vaqtga asoslangan (planka) */
  timed?: boolean;
}

/* ---------- Foydalanuvchi va dastur ---------- */

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';

export interface Profile {
  name: string;
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  bodyFat?: number;
  goal: Goal;
  level: Level;
  daysPerWeek: number;
  sessionMin: number;
  /** haftaning qaysi kunlari (0 = Dushanba) */
  trainingDays: number[];
  equipment: EquipmentId[];
  injuries: Injury[];
  focus: MuscleGroup[];
  activity: ActivityLevel;
  /** PAR-Q xavf belgilari */
  healthFlags: string[];
  dietPrefs: { noPork: boolean; lactoseFree: boolean; vegetarian: boolean };
  createdAt: string;
}

export interface PlannedExercise {
  exerciseId: string;
  sets: number;
  repMin: number;
  repMax: number;
  rir: number;
  restSec: number;
  note?: string;
}

export interface WorkoutDay {
  id: string;
  title: string;
  focus: string;
  /** hafta kuni (0 = Dushanba) */
  weekday: number;
  exercises: PlannedExercise[];
  estMin: number;
}

export interface Program {
  id: string;
  name: string;
  split: string;
  splitWhy: string;
  createdAt: string;
  days: WorkoutDay[];
  /** mezotsikl uzunligi (hafta), oxirgisi — yengillashtirish (deload) */
  mesoWeeks: number;
  startDate: string;
}

export interface SetLog {
  kg: number;
  reps: number;
  rir?: number;
  done: boolean;
  warmup?: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  sets: SetLog[];
  note?: string;
}

export interface WorkoutLog {
  id: string;
  dayId?: string;
  title: string;
  startedAt: string;
  finishedAt?: string;
  durationMin: number;
  exercises: ExerciseLog[];
  readiness?: number;
  feedback?: { pump: number; soreness: number; joints: number };
}

export interface BodyEntry {
  date: string;
  weightKg?: number;
  waistCm?: number;
}
