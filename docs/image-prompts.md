# Rasm generatsiyasi uchun promptlar

Avtomatik yaratilgan: `npx vite-node scripts/images/prompts.ts` (tavsiflar — `scripts/images/specs.ts`, mushak yorqinligi — ilovadagi EMG jadvali).
Rasmlarda matn bo‘lmaydi: nomlar, foizlar va belgilar ilovaning o‘zida ustiga qo‘yiladi.

Gemini API kaliti bo‘lsa, hammasi bitta buyruq bilan yaratiladi: `node scripts/images/generate.mjs` (README).

## Mashqlar

### 1. Shtanga bilan o‘tirib-turish (Back Squat) — pastki nuqta — `back-squat`

```
Photorealistic anatomical render of a muscular male athlete performing the back squat, captured at the bottom position. Camera: rear three-quarter view — 30° behind the athlete's right side, at hip height, 50mm lens — so the barbell on the upper back, both hands and the head are all clearly visible.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- The barbell lies ACROSS THE UPPER BACK on the trapezius at the base of the neck, below the head, in direct contact with the body — never at head height, never floating.
- Both hands grip the bar just outside shoulder width, wrists straight, elbows pointing down and slightly back. Arms are NOT crossed.
- Head and neck fully visible in front of the bar, neutral neck, eyes looking at the floor about 2 meters ahead.
- Thighs parallel to the floor, knees tracking over the toes, heels flat, neutral spine with natural lower-back arch, chest up, torso leaning about 40–45°, the bar vertically above the middle of the foot.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): vastus lateralis (outer front thigh), vastus medialis (inner front thigh);
- clearly dimmer, about half as bright: gluteus maximus;
- very faint: rectus femoris, erector spinae (lower back), inner-thigh adductors;
- all other muscles: no glow, natural deep red.

Equipment: Olympic barbell with medium-diameter matte black plates that do not cover the head or torso.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 2. Old o‘tirish (Front Squat) — pastki nuqta — `front-squat`

```
Photorealistic anatomical render of a muscular male athlete performing the front squat, captured at the bottom position. Camera: front three-quarter view — 30° in front of the athlete's right side, at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Front-rack position: the barbell rests on the front deltoids, touching the throat, in front of the neck — not on the hands.
- Fingertips under the bar just outside the shoulders, elbows HIGH and pointing straight forward, upper arms almost parallel to the floor.
- Torso nearly upright (about 15–20° forward lean), chest up, neutral spine.
- Thighs parallel to the floor or slightly below, knees forward over the toes, heels flat on the floor.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): vastus lateralis (outer front thigh), vastus medialis (inner front thigh);
- clearly dimmer, about half as bright: rectus femoris;
- very faint: erector spinae (lower back), gluteus maximus, inner-thigh adductors;
- all other muscles: no glow, natural deep red.

Equipment: Olympic barbell with medium matte black plates.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 3. Gantel bilan «kubok» o‘tirish (Goblet Squat) — pastki nuqta — `goblet-squat`

```
Photorealistic anatomical render of a muscular male athlete performing the goblet squat, captured at the bottom position. Camera: front three-quarter view — 30° in front of the athlete's right side, at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- One dumbbell held vertically against the chest, both palms cupping the top end, elbows pointing down.
- Torso upright, chest up, neutral spine.
- Thighs parallel to the floor, elbows just inside the knees, knees over the toes, heels flat.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): vastus lateralis (outer front thigh), vastus medialis (inner front thigh);
- clearly dimmer, about half as bright: rectus femoris;
- very faint: gluteus maximus, erector spinae (lower back), inner-thigh adductors, front deltoid, biceps;
- all other muscles: no glow, natural deep red.

Equipment: One hexagonal black dumbbell.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 4. Smit mashinasida o‘tirish (Smith Machine Squat) — pastki nuqta — `smith-squat`

```
Photorealistic anatomical render of a muscular male athlete performing the smith machine squat, captured at the bottom position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- The bar of the Smith machine rests across the upper trapezius at the base of the neck; hands grip it just outside shoulder width.
- Feet slightly in front of the bar, shoulder width; heels flat.
- Thighs parallel to the floor, knees over the toes, torso fairly upright with neutral spine.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): vastus lateralis (outer front thigh);
- clearly dimmer, about half as bright: vastus medialis (inner front thigh), gluteus maximus;
- very faint: rectus femoris, erector spinae (lower back), inner-thigh adductors;
- all other muscles: no glow, natural deep red.

Equipment: Smith machine: barbell fixed in two vertical steel guide rails, the frame visible but not covering the body.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 5. Oyoq press (Leg Press) — pastki nuqta — `leg-press`

```
Photorealistic anatomical render of a muscular male athlete performing the leg press, captured at the lowered position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Back and hips stay flat against the reclined seat pad — the tailbone does NOT lift off the seat.
- Feet shoulder width in the middle of the platform, knees bent to about 90°, knees in line with the toes.
- Hands hold the side handles; head rests on the pad.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): vastus lateralis (outer front thigh), vastus medialis (inner front thigh), rectus femoris;
- clearly dimmer, about half as bright: gluteus maximus, inner-thigh adductors;
- very faint: gastrocnemius (calf), biceps femoris (outer hamstring), inner hamstrings;
- all other muscles: no glow, natural deep red.

Equipment: 45-degree plate-loaded leg press with a large foot platform and black weight plates.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 6. Gakk-mashinada o‘tirish (Hack Squat) — pastki nuqta — `hack-squat`

```
Photorealistic anatomical render of a muscular male athlete performing the hack squat, captured at the bottom position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Back flat against the angled back pad, shoulders under the shoulder pads, hands on the handles.
- Feet shoulder width in the middle of the platform, heels flat.
- Knees bent to about 90°, thighs roughly parallel to the platform, knees tracking over the toes.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): vastus lateralis (outer front thigh), vastus medialis (inner front thigh);
- very faint: gluteus maximus, rectus femoris, inner-thigh adductors;
- all other muscles: no glow, natural deep red.

Equipment: Plate-loaded hack squat machine with an angled sled.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 7. O‘z vazni bilan o‘tirish (Bodyweight Squat) — pastki nuqta — `bw-squat`

```
Photorealistic anatomical render of a muscular male athlete performing the bodyweight squat, captured at the bottom position. Camera: front three-quarter view — 30° in front of the athlete's right side, at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Arms extended straight forward at shoulder height for balance.
- Thighs parallel to the floor, chest up, neutral spine.
- Feet shoulder width, toes slightly out, knees over the toes, heels flat.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): vastus lateralis (outer front thigh), vastus medialis (inner front thigh);
- clearly dimmer, about half as bright: rectus femoris;
- very faint: gluteus maximus, erector spinae (lower back), inner-thigh adductors, tibialis anterior;
- all other muscles: no glow, natural deep red.

Equipment: No equipment.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 8. O‘lik tortish (Deadlift) — boshlang‘ich holat — `deadlift`

```
Photorealistic anatomical render of a muscular male athlete performing the deadlift, captured at the start position, the barbell just leaving the floor. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- The bar is over the middle of the foot, touching the shins.
- Hips higher than the knees and lower than the shoulders; shoulders slightly in front of the bar.
- Back completely flat (neutral spine from neck to pelvis), chest up, arms straight and vertical, grip just outside the legs.
- Head neutral, eyes looking at the floor about 1–2 meters ahead.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): erector spinae (lower back), gluteus maximus, forearm flexors;
- clearly dimmer, about half as bright: inner hamstrings, biceps femoris (outer hamstring), vastus lateralis (outer front thigh), vastus medialis (inner front thigh), upper trapezius;
- very faint: gastrocnemius (calf);
- all other muscles: no glow, natural deep red.

Equipment: Olympic barbell with full-size matte black plates resting on the floor.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 9. Rumincha o‘lik tortish (Romanian Deadlift) — pastki nuqta — `rdl`

```
Photorealistic anatomical render of a muscular male athlete performing the romanian deadlift, captured at the bottom position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Hips pushed far back, knees softly bent about 15–20°, shins nearly vertical.
- Back completely flat, the barbell sliding along the legs, now just below the knees.
- Arms straight, shoulders over the bar, neck neutral.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): inner hamstrings;
- clearly dimmer, about half as bright: biceps femoris (outer hamstring), erector spinae (lower back), gluteus maximus, forearm flexors;
- very faint: inner-thigh adductors, upper trapezius;
- all other muscles: no glow, natural deep red.

Equipment: Olympic barbell with medium matte black plates.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 10. Gantel bilan rumincha tortish (Dumbbell Romanian Deadlift) — pastki nuqta — `db-rdl`

```
Photorealistic anatomical render of a muscular male athlete performing the dumbbell romanian deadlift, captured at the bottom position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Hips pushed far back, knees softly bent about 15–20°, shins nearly vertical.
- Back completely flat; two dumbbells held in front of the legs, now at mid-shin, close to the legs.
- Arms straight, neck neutral.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): inner hamstrings, biceps femoris (outer hamstring);
- clearly dimmer, about half as bright: forearm flexors, erector spinae (lower back), gluteus maximus;
- very faint: inner-thigh adductors, upper trapezius;
- all other muscles: no glow, natural deep red.

Equipment: Two hexagonal black dumbbells.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 11. Girya silkitish (Kettlebell Swing) — yuqori nuqta — `kb-swing`

```
Photorealistic anatomical render of a muscular male athlete performing the kettlebell swing, captured at the top of the swing. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Standing tall with hips fully extended and glutes squeezed — the body in one straight vertical line, no backward lean.
- Arms straight, both hands on the kettlebell handle; the kettlebell floats forward at chest height.
- Core braced, knees straight but not locked, feet flat slightly wider than hips.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): inner hamstrings, biceps femoris (outer hamstring);
- clearly dimmer, about half as bright: gluteus maximus, gluteus medius, erector spinae (lower back);
- very faint: forearm flexors, vastus lateralis (outer front thigh), front deltoid;
- all other muscles: no glow, natural deep red.

Equipment: One cast-iron kettlebell.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 12. Giperekstenziya (45° Back Extension) — yuqori nuqta — `back-extension`

```
Photorealistic anatomical render of a muscular male athlete performing the 45° back extension, captured at the top position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- On a 45° back-extension bench: the hip pad sits just below the hip crease, ankles locked under the rollers.
- Body in one straight line from heels to head — no over-arching of the lower back.
- Arms crossed on the chest, neck neutral.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): biceps femoris (outer hamstring), inner hamstrings;
- clearly dimmer, about half as bright: erector spinae (lower back), gluteus maximus;
- very faint: inner-thigh adductors;
- all other muscles: no glow, natural deep red.

Equipment: 45-degree hyperextension bench.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 13. Gantel bilan split-o‘tirish (Dumbbell Split Squat) — pastki nuqta — `split-squat`

```
Photorealistic anatomical render of a muscular male athlete performing the dumbbell split squat, captured at the bottom position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Long staggered stance: front foot flat, front shin nearly vertical, front thigh parallel to the floor.
- Back knee just above the floor, back heel raised.
- Torso upright, dumbbells hanging at the sides with straight arms.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): vastus lateralis (outer front thigh), vastus medialis (inner front thigh);
- clearly dimmer, about half as bright: gluteus maximus, biceps femoris (outer hamstring), inner hamstrings, gluteus medius;
- very faint: rectus femoris, inner-thigh adductors, forearm flexors;
- all other muscles: no glow, natural deep red.

Equipment: Two hexagonal black dumbbells.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 14. Bolgarcha split-o‘tirish (Bulgarian Split Squat) — pastki nuqta — `bulgarian`

```
Photorealistic anatomical render of a muscular male athlete performing the bulgarian split squat, captured at the bottom position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Rear foot laces resting on a flat bench behind; front foot about 70 cm in front of the bench.
- Front thigh parallel to the floor, front heel flat, front knee over the toes; back knee just above the floor.
- Torso with a slight forward lean, neutral spine; dumbbells hanging at the sides.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): vastus lateralis (outer front thigh), vastus medialis (inner front thigh), biceps femoris (outer hamstring);
- clearly dimmer, about half as bright: gluteus maximus, inner hamstrings, gluteus medius;
- very faint: inner-thigh adductors, rectus femoris, forearm flexors;
- all other muscles: no glow, natural deep red.

Equipment: Flat weight bench and two hexagonal black dumbbells.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 15. Platformaga chiqish (Step-up) — ko‘tarilish — `step-up`

```
Photorealistic anatomical render of a muscular male athlete performing the step-up, captured at the drive phase, halfway up. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Whole front foot on a knee-high box, front knee bent about 90° and in line with the toes.
- Pushing through the front heel; the trailing foot only on its toes, about to leave the floor.
- Torso slightly forward, neutral spine, dumbbells at the sides.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): gluteus maximus;
- clearly dimmer, about half as bright: vastus lateralis (outer front thigh), vastus medialis (inner front thigh);
- very faint: gluteus medius, rectus femoris, biceps femoris (outer hamstring), inner hamstrings, gastrocnemius (calf);
- all other muscles: no glow, natural deep red.

Equipment: Sturdy plyometric box and two hexagonal black dumbbells.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 16. O‘z vazni bilan split-o‘tirish (Bodyweight Split Squat) — pastki nuqta — `bw-split-squat`

```
Photorealistic anatomical render of a muscular male athlete performing the bodyweight split squat, captured at the bottom position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Long staggered stance: front foot flat, front thigh parallel to the floor, front shin nearly vertical.
- Back knee just above the floor, back heel raised.
- Torso upright, hands on the hips.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): vastus lateralis (outer front thigh), vastus medialis (inner front thigh);
- clearly dimmer, about half as bright: gluteus medius, gluteus maximus, rectus femoris;
- very faint: biceps femoris (outer hamstring), inner-thigh adductors, inner hamstrings;
- all other muscles: no glow, natural deep red.

Equipment: No equipment.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 17. Oyoq yozish trenajyori (Leg Extension) — yuqori nuqta — `leg-extension`

```
Photorealistic anatomical render of a muscular male athlete performing the leg extension, captured at the top position, knees straight. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Seated with the back against the backrest, knees aligned with the machine pivot.
- Knees fully extended, the shin pad resting on the lower shins just above the ankles, toes pointing up.
- Hands gripping the side handles, hips stay down on the seat.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): vastus lateralis (outer front thigh), vastus medialis (inner front thigh), rectus femoris;
- all other muscles: no glow, natural deep red.

Equipment: Seated leg extension machine with a weight stack.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 18. Oyoq bukish trenajyori (Seated Leg Curl) — qisqargan holat — `leg-curl`

```
Photorealistic anatomical render of a muscular male athlete performing the seated leg curl, captured at the contracted position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Seated leg curl: back against the backrest, the thigh pad locks the thighs down just above the knees.
- Legs curled under the seat to about 90° knee bend, the ankle pad behind the lower calves.
- Hands on the side handles, hips stay in the seat.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): inner hamstrings, biceps femoris (outer hamstring);
- very faint: gastrocnemius (calf);
- all other muscles: no glow, natural deep red.

Equipment: Seated leg curl machine with a weight stack.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 19. Shtanga bilan tos ko‘tarish (Barbell Hip Thrust) — yuqori nuqta — `hip-thrust`

```
Photorealistic anatomical render of a muscular male athlete performing the barbell hip thrust, captured at the top position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Upper back (just below the shoulder blades) resting on the edge of a flat bench.
- Barbell with a foam pad across the hip crease, hands holding it in place.
- Hips fully extended: shoulders, hips and knees in one straight line parallel to the floor; shins vertical; chin slightly tucked; ribs down, no lower-back arch.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): gluteus maximus, vastus lateralis (outer front thigh), vastus medialis (inner front thigh);
- clearly dimmer, about half as bright: erector spinae (lower back), biceps femoris (outer hamstring);
- very faint: inner hamstrings, inner-thigh adductors, gluteus medius;
- all other muscles: no glow, natural deep red.

Equipment: Flat bench and an Olympic barbell with medium matte black plates and a foam pad.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 20. Ko‘prikcha (Glute Bridge) — yuqori nuqta — `glute-bridge`

```
Photorealistic anatomical render of a muscular male athlete performing the glute bridge, captured at the top position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Lying on the back on the floor, knees bent, feet flat hip width.
- Hips lifted so shoulders, hips and knees form one straight line; glutes squeezed; ribs down.
- Arms resting on the floor beside the body.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): gluteus maximus;
- clearly dimmer, about half as bright: vastus lateralis (outer front thigh), erector spinae (lower back), biceps femoris (outer hamstring);
- very faint: inner hamstrings, gluteus medius, inner-thigh adductors;
- all other muscles: no glow, natural deep red.

Equipment: No equipment, plain floor.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 21. Boldir ko‘tarish (Standing Calf Raise) — yuqori nuqta — `calf-raise`

```
Photorealistic anatomical render of a muscular male athlete performing the standing calf raise, captured at the top position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Balls of both feet on the edge of a low step, heels hanging free.
- Raised as high as possible on the toes, knees straight, body tall.
- One hand lightly touching a wall or rail for balance.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): gastrocnemius (calf), soleus;
- all other muscles: no glow, natural deep red.

Equipment: A low step platform.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 22. Shtanga bilan yotib jim (Bench Press) — pastki nuqta — `bench-press`

```
Photorealistic anatomical render of a muscular male athlete performing the bench press, captured at the bottom position. Camera: side view from the athlete's right, camera slightly above bench height (about 15° down), 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Lying fully on his back on a flat bench (head, upper back and glutes on the bench), eyes under the bar, shoulder blades pulled back and down, slight natural arch, feet flat on the floor.
- The bar is lowered ALL the way down: the barbell is pressing on the sternum at nipple level, touching the chest — no gap at all. The upper arms point down toward the floor, elbows lower than the bench top, about 45–60° away from the torso.
- Grip slightly wider than shoulders, forearms vertical, elbows at about 45–60° from the torso (not flared to 90°), wrists straight.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): middle chest (sternal pectoralis major), upper (clavicular) chest, triceps lateral head, lower chest;
- clearly dimmer, about half as bright: front deltoid, triceps long head, triceps medial head;
- all other muscles: no glow, natural deep red.

Equipment: Flat bench with bench-press uprights and an Olympic barbell with medium matte black plates.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 23. Gantel bilan yotib jim (Dumbbell Bench Press) — pastki nuqta — `db-bench`

```
Photorealistic anatomical render of a muscular male athlete performing the dumbbell bench press, captured at the bottom position. Camera: side view from the athlete's right, camera slightly above bench height (about 15° down), 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Lying on a flat bench, shoulder blades pulled back, feet flat on the floor.
- Two dumbbells lowered beside the chest at nipple level, forearms vertical, palms facing the feet.
- Elbows at about 45° from the torso, wrists straight.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): middle chest (sternal pectoralis major), upper (clavicular) chest, lower chest;
- clearly dimmer, about half as bright: front deltoid, triceps lateral head, triceps long head, triceps medial head;
- very faint: biceps;
- all other muscles: no glow, natural deep red.

Equipment: Flat bench and two hexagonal black dumbbells.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 24. Ko‘krak press trenajyori (Machine Chest Press) — boshlang‘ich holat — `machine-chest-press`

```
Photorealistic anatomical render of a muscular male athlete performing the machine chest press, captured at the start position, handles at chest level. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Seated upright, back and shoulder blades against the back pad, feet flat on the floor.
- Handles in line with the middle of the chest, forearms horizontal, elbows slightly below shoulder height.
- Wrists straight, shoulders down.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): middle chest (sternal pectoralis major), upper (clavicular) chest, lower chest, front deltoid, triceps lateral head;
- clearly dimmer, about half as bright: triceps long head;
- all other muscles: no glow, natural deep red.

Equipment: Seated chest press machine with a weight stack.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 25. Otjimaniya (polda qo‘l bukish) (Push-up) — pastki nuqta — `push-up`

```
Photorealistic anatomical render of a muscular male athlete performing the push-up, captured at the bottom position. Camera: side view from the athlete's right at floor height (low camera), 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Chest about 5 cm above the floor.
- Body in one straight line from head to heels — hips neither sagging nor piked.
- Hands slightly wider than the shoulders, under the chest; elbows at about 45° from the torso.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): middle chest (sternal pectoralis major), serratus anterior, triceps lateral head, triceps long head;
- clearly dimmer, about half as bright: front deltoid, upper (clavicular) chest;
- very faint: rectus abdominis, rear deltoid;
- all other muscles: no glow, natural deep red.

Equipment: No equipment, plain floor.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 26. Brusyada qo‘l bukish (Dips) — pastki nuqta — `dips`

```
Photorealistic anatomical render of a muscular male athlete performing the dips, captured at the bottom position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Supported on parallel dip bars, upper arms parallel to the floor (not deeper).
- Torso leaning forward about 20–30°, elbows pointing back, shoulders down away from the ears.
- Knees bent with the ankles crossed behind.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): triceps lateral head, triceps long head, triceps medial head, lower chest;
- clearly dimmer, about half as bright: middle chest (sternal pectoralis major), front deltoid;
- very faint: upper (clavicular) chest, latissimus dorsi;
- all other muscles: no glow, natural deep red.

Equipment: Free-standing dip station with two parallel bars.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 27. Qiya skameykada gantel jimi (Incline Dumbbell Press) — pastki nuqta — `incline-db-press`

```
Photorealistic anatomical render of a muscular male athlete performing the incline dumbbell press, captured at the bottom position. Camera: side view from the athlete's right, camera slightly above bench height (about 15° down), 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Lying on a bench inclined to 30°, shoulder blades pulled back, feet flat on the floor.
- Dumbbells lowered beside the upper chest, forearms vertical, palms facing forward.
- Elbows at about 45° from the torso.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): upper (clavicular) chest, front deltoid;
- clearly dimmer, about half as bright: middle chest (sternal pectoralis major), triceps lateral head, lower chest, triceps long head;
- very faint: upper trapezius, biceps;
- all other muscles: no glow, natural deep red.

Equipment: Adjustable incline bench at 30° and two hexagonal black dumbbells.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 28. Qiya skameykada shtanga jimi (Incline Bench Press) — pastki nuqta — `incline-bench`

```
Photorealistic anatomical render of a muscular male athlete performing the incline bench press, captured at the bottom position. Camera: side view from the athlete's right, camera slightly above bench height (about 15° down), 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Lying on a bench inclined to 30°, shoulder blades pulled back, feet flat.
- The barbell touches the upper chest just below the collarbones.
- Grip slightly wider than shoulders, forearms vertical, elbows about 45–60° from the torso.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): upper (clavicular) chest, front deltoid;
- clearly dimmer, about half as bright: middle chest (sternal pectoralis major), triceps lateral head, triceps medial head, triceps long head;
- very faint: lower chest;
- all other muscles: no glow, natural deep red.

Equipment: Incline bench press station and an Olympic barbell with medium matte black plates.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 29. Krossoverda qo‘l birlashtirish (Cable Fly) — qisqargan holat — `cable-fly`

```
Photorealistic anatomical render of a muscular male athlete performing the cable fly, captured at the squeeze position. Camera: front three-quarter view — 30° in front of the athlete's right side, at chest height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Standing in the middle of a cable crossover in a split stance, torso leaning slightly forward.
- Both handles brought together in front of the lower chest in a wide hugging arc.
- Elbows slightly bent and fixed, shoulders down, chest up.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): middle chest (sternal pectoralis major), lower chest;
- clearly dimmer, about half as bright: upper (clavicular) chest, front deltoid;
- all other muscles: no glow, natural deep red.

Equipment: Cable crossover station with D-handles; both cables clearly attached to the handles.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 30. Batterflay trenajyori (Pec Deck) — qisqargan holat — `pec-deck`

```
Photorealistic anatomical render of a muscular male athlete performing the pec deck, captured at the squeeze position. Camera: front three-quarter view — 30° in front of the athlete's right side, at chest height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Seated upright, back against the pad.
- The padded arms brought together in front of the chest, elbows at about shoulder height.
- Shoulders down, chest up.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): middle chest (sternal pectoralis major), upper (clavicular) chest;
- clearly dimmer, about half as bright: lower chest, front deltoid;
- all other muscles: no glow, natural deep red.

Equipment: Pec deck (butterfly) machine with a weight stack.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 31. Gantel bilan qo‘l yoyish (razvodka) (Dumbbell Fly) — pastki nuqta — `db-fly`

```
Photorealistic anatomical render of a muscular male athlete performing the dumbbell fly, captured at the bottom (stretched) position. Camera: high three-quarter view from above the right side (about 40° down), 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Lying on a flat bench, feet flat on the floor, shoulder blades pulled back.
- Arms opened wide in an arc, dumbbells at chest height level with the body, elbows slightly bent (about 20°) and fixed.
- Palms facing up and slightly toward each other.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): middle chest (sternal pectoralis major), upper (clavicular) chest, lower chest;
- clearly dimmer, about half as bright: front deltoid;
- all other muscles: no glow, natural deep red.

Equipment: Flat bench and two hexagonal black dumbbells.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 32. Turib shtanga jimi (Overhead Press) — yuqori nuqta — `ohp`

```
Photorealistic anatomical render of a muscular male athlete performing the overhead press, captured at the lockout overhead. Camera: side view from the athlete's right at chest height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Standing, the barbell locked out directly above the middle of the foot, arms straight.
- Head pushed slightly forward "through the window" under the bar.
- Glutes and abs tight, ribs down — no backward lean; feet hip width.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): front deltoid, triceps lateral head;
- clearly dimmer, about half as bright: side deltoid, triceps long head, upper trapezius, serratus anterior;
- very faint: upper (clavicular) chest, rear deltoid;
- all other muscles: no glow, natural deep red.

Equipment: Olympic barbell with medium matte black plates.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 33. O‘tirib gantel jimi (Seated Dumbbell Press) — boshlang‘ich holat — `db-shoulder-press`

```
Photorealistic anatomical render of a muscular male athlete performing the seated dumbbell press, captured at the start position, dumbbells at shoulder level. Camera: front three-quarter view — 30° in front of the athlete's right side, at chest height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Seated upright on a bench with the backrest vertical, feet flat.
- Dumbbells at ear level beside the head, forearms vertical, palms facing forward.
- Elbows slightly in front of the torso, shoulders down.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): front deltoid;
- clearly dimmer, about half as bright: side deltoid, triceps lateral head, upper trapezius, triceps long head, serratus anterior;
- very faint: upper (clavicular) chest, rear deltoid;
- all other muscles: no glow, natural deep red.

Equipment: Adjustable bench set upright and two hexagonal black dumbbells.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 34. Yelka press trenajyori (Machine Shoulder Press) — boshlang‘ich holat — `machine-shoulder-press`

```
Photorealistic anatomical render of a muscular male athlete performing the machine shoulder press, captured at the start position, handles at shoulder level. Camera: side view from the athlete's right at chest height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Seated upright, back against the pad, feet flat.
- Handles at shoulder height, forearms vertical.
- Shoulders down, ribs down, head neutral.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): front deltoid;
- clearly dimmer, about half as bright: triceps lateral head, side deltoid, triceps long head, upper trapezius;
- very faint: serratus anterior, upper (clavicular) chest;
- all other muscles: no glow, natural deep red.

Equipment: Seated shoulder press machine with a weight stack.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 35. Pike otjimaniya (Pike Push-up) — pastki nuqta — `pike-push-up`

```
Photorealistic anatomical render of a muscular male athlete performing the pike push-up, captured at the bottom position. Camera: side view from the athlete's right at floor height (low camera), 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Hips high, body forming an inverted V.
- Hands shoulder width; the head lowered toward the floor just in front of the hands, forming a triangle with the hands.
- Elbows bent about 90°, pointing back at about 45°; legs straight, on the toes.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): front deltoid, triceps lateral head;
- clearly dimmer, about half as bright: triceps long head, serratus anterior, side deltoid, upper trapezius, upper (clavicular) chest;
- very faint: rectus abdominis;
- all other muscles: no glow, natural deep red.

Equipment: No equipment, plain floor.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 36. Gantelni yonga ko‘tarish (Lateral Raise) — yuqori nuqta — `lateral-raise`

```
Photorealistic anatomical render of a muscular male athlete performing the lateral raise, captured at the top position. Camera: front view, at chest height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Standing tall, dumbbells raised out to the sides exactly to shoulder height, arms slightly in front of the body.
- Elbows slightly bent, hands not higher than the elbows.
- Shoulders down — no shrugging, no swinging.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): side deltoid;
- clearly dimmer, about half as bright: upper trapezius, front deltoid, rear deltoid, serratus anterior;
- all other muscles: no glow, natural deep red.

Equipment: Two small hexagonal black dumbbells.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 37. Blokda yonga ko‘tarish (Cable Lateral Raise) — yuqori nuqta — `cable-lateral-raise`

```
Photorealistic anatomical render of a muscular male athlete performing the cable lateral raise, captured at the top position. Camera: front three-quarter view — 30° in front of the athlete's right side, at chest height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Standing side-on to a low pulley, the cable crossing in front of the body to the far hand.
- Working arm raised out to the side to shoulder height, elbow slightly bent.
- Other hand holding the machine frame, torso upright, shoulders down.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): side deltoid;
- clearly dimmer, about half as bright: upper trapezius, front deltoid, rear deltoid, serratus anterior;
- all other muscles: no glow, natural deep red.

Equipment: Single cable column with a low pulley and a D-handle; the cable clearly attached to the handle.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 38. Arqonni yuzga tortish (Face Pull) — qisqargan holat — `face-pull`

```
Photorealistic anatomical render of a muscular male athlete performing the face pull, captured at the contracted position. Camera: side view from the athlete's right at shoulder height, 50mm lens — so it is clear the rope is in front of the face.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Rope attachment on a cable set at face height; standing tall, slight lean back.
- Rope pulled toward the forehead, hands pulled apart beside the ears.
- Elbows high and wide at shoulder height, knuckles rotated back (external rotation), shoulder blades squeezed together.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): rear deltoid;
- clearly dimmer, about half as bright: middle trapezius, infraspinatus and teres minor, rhomboids, lower trapezius, side deltoid;
- very faint: upper trapezius, biceps;
- all other muscles: no glow, natural deep red.

Equipment: Cable column with a rope attachment; the cable clearly attached to the rope.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 39. Lentani yoyish (orqa delta) (Band Pull-Apart) — qisqargan holat — `reverse-fly`

```
Photorealistic anatomical render of a muscular male athlete performing the band pull-apart, captured at the end position, band fully stretched. Camera: rear three-quarter view — 30° behind the athlete's right side, at shoulder height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Standing tall, a resistance band stretched across the chest at shoulder height.
- Arms straight out to the sides, palms facing down.
- Shoulder blades squeezed together, shoulders down, ribs down.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): rear deltoid;
- clearly dimmer, about half as bright: middle trapezius, rhomboids, side deltoid, infraspinatus and teres minor, lower trapezius, upper trapezius;
- all other muscles: no glow, natural deep red.

Equipment: One lime-green resistance band.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 40. Engashib shtanga tortish (Barbell Row) — yuqori nuqta — `barbell-row`

```
Photorealistic anatomical render of a muscular male athlete performing the barbell row, captured at the top position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Hip hinge with the torso at about 30–45° to the floor, knees softly bent, back completely flat.
- The barbell pulled to the lower ribs / upper abdomen.
- Elbows driven back at about 45° from the torso, shoulder blades squeezed, neck neutral.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): middle trapezius, rear deltoid, erector spinae (lower back), rhomboids, latissimus dorsi;
- clearly dimmer, about half as bright: biceps, lower trapezius;
- very faint: gluteus maximus;
- all other muscles: no glow, natural deep red.

Equipment: Olympic barbell with medium matte black plates.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 41. Bir qo‘llab gantel tortish (One-arm Dumbbell Row) — yuqori nuqta — `db-row`

```
Photorealistic anatomical render of a muscular male athlete performing the one-arm dumbbell row, captured at the top position. Camera: side view from the working-arm side at bench height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Left knee and left hand on a flat bench, right foot on the floor, torso parallel to the floor, back flat.
- Right hand pulls the dumbbell to the hip, elbow close to the body pointing back and up.
- Shoulders level, neck neutral.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): latissimus dorsi, middle trapezius, rear deltoid, lower trapezius, rhomboids;
- clearly dimmer, about half as bright: teres major, biceps, upper trapezius;
- all other muscles: no glow, natural deep red.

Equipment: Flat bench and one hexagonal black dumbbell.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 42. O‘tirib blok tortish (Seated Cable Row) — qisqargan holat — `cable-row`

```
Photorealistic anatomical render of a muscular male athlete performing the seated cable row, captured at the contracted position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Seated, feet on the foot platform, knees slightly bent.
- Torso upright and still, chest up; the V-handle pulled to the navel.
- Elbows back close to the body, shoulder blades squeezed together.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): latissimus dorsi, middle trapezius, rear deltoid, rhomboids;
- clearly dimmer, about half as bright: lower trapezius, biceps, upper trapezius;
- very faint: erector spinae (lower back);
- all other muscles: no glow, natural deep red.

Equipment: Seated cable row machine with a V-handle; the cable clearly attached to the handle.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 43. Ko‘krak tayanchli gantel tortish (Chest-Supported Row) — yuqori nuqta — `chest-supported-row`

```
Photorealistic anatomical render of a muscular male athlete performing the chest-supported row, captured at the top position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Lying face down on a bench inclined to about 30–40°, chest on the pad, toes on the floor.
- Dumbbells pulled up beside the ribs, elbows driven back at about 45°.
- Shoulder blades squeezed, neck neutral.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): middle trapezius, rear deltoid, rhomboids, latissimus dorsi;
- clearly dimmer, about half as bright: biceps, lower trapezius;
- very faint: upper trapezius;
- all other muscles: no glow, natural deep red.

Equipment: Adjustable incline bench and two hexagonal black dumbbells.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 44. Avstraliyacha tortilish (Inverted Row) — yuqori nuqta — `inverted-row`

```
Photorealistic anatomical render of a muscular male athlete performing the inverted row, captured at the top position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Hanging under a barbell fixed at hip height, heels on the floor.
- Body in one straight line from head to heels, glutes tight.
- Chest pulled up to the bar, elbows at about 45° from the torso, shoulder blades squeezed.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): rear deltoid, latissimus dorsi, lower trapezius, biceps, middle trapezius;
- clearly dimmer, about half as bright: upper trapezius, erector spinae (lower back);
- very faint: rectus abdominis, gluteus maximus;
- all other muscles: no glow, natural deep red.

Equipment: Barbell fixed in a power rack at hip height.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 45. Turnikda tortilish (Pull-up) — yuqori nuqta — `pull-up`

```
Photorealistic anatomical render of a muscular male athlete performing the pull-up, captured at the top position. Camera: rear three-quarter view — 30° behind the athlete's right side, at shoulder height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Overhand grip slightly wider than the shoulders, chin above the bar.
- Elbows pointing down and slightly back, shoulders pulled down away from the ears, chest up.
- Body straight, legs together slightly in front — no kicking.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): latissimus dorsi;
- clearly dimmer, about half as bright: biceps, infraspinatus and teres minor, teres major, lower trapezius;
- very faint: forearm flexors, lower chest, erector spinae (lower back), obliques;
- all other muscles: no glow, natural deep red.

Equipment: Pull-up bar.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 46. Teskari ushlab tortilish (Chin-up) — yuqori nuqta — `chin-up`

```
Photorealistic anatomical render of a muscular male athlete performing the chin-up, captured at the top position. Camera: rear three-quarter view — 30° behind the athlete's right side, at shoulder height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Underhand (palms toward the face) shoulder-width grip, chin above the bar.
- Elbows down in front of the body, shoulders down, chest up.
- Body straight, legs together.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): latissimus dorsi, biceps;
- clearly dimmer, about half as bright: infraspinatus and teres minor, teres major, lower chest;
- very faint: lower trapezius, forearm flexors, erector spinae (lower back), obliques;
- all other muscles: no glow, natural deep red.

Equipment: Pull-up bar.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 47. Yuqori blokni ko‘krakka tortish (Lat Pulldown) — qisqargan holat — `lat-pulldown`

```
Photorealistic anatomical render of a muscular male athlete performing the lat pulldown, captured at the contracted position. Camera: front three-quarter view — 30° in front of the athlete's right side, at chest height, 50mm lens — facing the athlete, so the bar in front of the face at the top of the chest is clearly visible.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Seated with thighs locked under the knee pads.
- Wide overhand grip; the bar pulled down IN FRONT of the face to the top of the chest (collarbone level) — the head stays behind the bar, never a behind-the-neck pulldown.
- Torso leaning back about 10–15°, chest up, elbows down and slightly back, shoulders down.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): latissimus dorsi;
- clearly dimmer, about half as bright: teres major, biceps, middle trapezius, lower trapezius, rear deltoid, infraspinatus and teres minor;
- very faint: lower chest;
- all other muscles: no glow, natural deep red.

Equipment: Lat pulldown machine with a long wide bar; the cable clearly attached to the bar.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 48. Gantel bilan yelka qisish (Dumbbell Shrug) — yuqori nuqta — `db-shrug`

```
Photorealistic anatomical render of a muscular male athlete performing the dumbbell shrug, captured at the top position. Camera: rear three-quarter view — 30° behind the athlete's right side, at shoulder height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Standing tall, dumbbells at the sides with straight arms.
- Shoulders elevated straight up toward the ears — no rolling, elbows straight.
- Neck neutral, chin level.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): upper trapezius;
- very faint: middle trapezius, forearm flexors, rhomboids;
- all other muscles: no glow, natural deep red.

Equipment: Two hexagonal black dumbbells.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 49. Shtanga bilan bitseps (Barbell Curl) — yuqori nuqta — `barbell-curl`

```
Photorealistic anatomical render of a muscular male athlete performing the barbell curl, captured at the top position. Camera: side view from the athlete's right at chest height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Standing tall, underhand shoulder-width grip on a barbell.
- Bar curled up to shoulder height, elbows stay at the sides of the body (not swung forward).
- Wrists straight, no torso lean back.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): biceps;
- clearly dimmer, about half as bright: brachialis, brachioradialis;
- very faint: forearm flexors, front deltoid;
- all other muscles: no glow, natural deep red.

Equipment: Straight barbell with small matte black plates.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 50. Gantel bilan bitseps (Dumbbell Curl) — yuqori nuqta — `db-curl`

```
Photorealistic anatomical render of a muscular male athlete performing the dumbbell curl, captured at the top position. Camera: side view from the athlete's right at chest height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Standing tall, both dumbbells curled up to shoulder height, palms facing the shoulders.
- Elbows stay at the sides of the torso.
- Wrists straight, no swinging.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): biceps;
- clearly dimmer, about half as bright: brachialis;
- very faint: brachioradialis, forearm flexors;
- all other muscles: no glow, natural deep red.

Equipment: Two hexagonal black dumbbells.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 51. «Bolg‘a» bukish (Hammer Curl) — yuqori nuqta — `hammer-curl`

```
Photorealistic anatomical render of a muscular male athlete performing the hammer curl, captured at the top position. Camera: side view from the athlete's right at chest height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Standing tall, neutral grip (palms facing each other, thumbs up).
- Dumbbells curled up to shoulder height, elbows at the sides.
- Wrists straight, no swinging.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): biceps, brachialis;
- clearly dimmer, about half as bright: brachioradialis;
- very faint: forearm extensors, front deltoid, forearm flexors;
- all other muscles: no glow, natural deep red.

Equipment: Two hexagonal black dumbbells.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 52. Qiya skameykada bitseps (Incline Dumbbell Curl) — o‘rta holat — `incline-curl`

```
Photorealistic anatomical render of a muscular male athlete performing the incline dumbbell curl, captured at midway, forearms horizontal. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Lying back on a bench inclined to about 45–60°, head and back on the pad.
- Upper arms hanging straight down toward the floor, slightly BEHIND the torso line — the elbows never move forward of the chest.
- Dumbbells curled until the forearms are horizontal, palms facing up.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): biceps;
- clearly dimmer, about half as bright: brachialis, brachioradialis;
- very faint: forearm flexors;
- all other muscles: no glow, natural deep red.

Equipment: Adjustable incline bench and two hexagonal black dumbbells.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 53. Blokda bitseps (Cable Curl) — yuqori nuqta — `cable-curl`

```
Photorealistic anatomical render of a muscular male athlete performing the cable curl, captured at the top position. Camera: side view from the athlete's right at chest height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Standing facing a low pulley, underhand grip on a straight cable bar.
- Bar curled to shoulder height, elbows at the sides.
- Torso upright, wrists straight.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): biceps;
- clearly dimmer, about half as bright: brachialis, brachioradialis;
- very faint: forearm flexors;
- all other muscles: no glow, natural deep red.

Equipment: Cable column with a low pulley and a straight bar; the cable clearly attached to the bar.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 54. Blokda triseps (Triceps Pushdown) — pastki nuqta — `pushdown`

```
Photorealistic anatomical render of a muscular male athlete performing the triceps pushdown, captured at the bottom position, elbows straight. Camera: side view from the athlete's right at chest height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Standing facing a high pulley, slight forward lean, overhand grip on a straight bar.
- Elbows fully extended, bar at the front of the thighs.
- Upper arms pinned to the sides of the torso, wrists straight.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): triceps lateral head, triceps long head, triceps medial head;
- very faint: forearm flexors, forearm extensors;
- all other muscles: no glow, natural deep red.

Equipment: Cable column with a high pulley and a straight bar; the cable clearly attached to the bar.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 55. Bosh ortidan triseps (Overhead Triceps Extension) — pastki nuqta — `overhead-extension`

```
Photorealistic anatomical render of a muscular male athlete performing the overhead triceps extension, captured at the bottom (stretched) position. Camera: side view from the athlete's right at chest height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Seated upright on a bench, one dumbbell held vertically with both hands cupping the top end.
- Dumbbell lowered behind the head, elbows pointing up beside the head, upper arms vertical.
- Ribs down, neck neutral.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): triceps long head, triceps medial head, triceps lateral head;
- all other muscles: no glow, natural deep red.

Equipment: Bench set upright and one hexagonal black dumbbell.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 56. Fransuzcha jim (yotib) (Skull Crusher) — pastki nuqta — `skull-crusher`

```
Photorealistic anatomical render of a muscular male athlete performing the skull crusher, captured at the bottom position. Camera: side view from the athlete's right, camera slightly above bench height (about 15° down), 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Lying on a flat bench, feet flat on the floor.
- EZ bar lowered to just above the forehead, upper arms angled slightly back from vertical and fixed.
- Elbows pointing up, not flaring out; wrists straight.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): triceps lateral head, triceps medial head, triceps long head;
- all other muscles: no glow, natural deep red.

Equipment: Flat bench and an EZ curl bar with small matte black plates.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 57. Tor ushlab yotib jim (Close-Grip Bench Press) — pastki nuqta — `close-grip-bench`

```
Photorealistic anatomical render of a muscular male athlete performing the close-grip bench press, captured at the bottom position. Camera: side view from the athlete's right, camera slightly above bench height (about 15° down), 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Lying on a flat bench, shoulder blades pulled back, feet flat.
- Grip shoulder width (not narrower), the barbell touching the lower chest.
- Elbows tucked close to the torso at about 20–30°, forearms vertical.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): triceps lateral head, triceps long head, upper (clavicular) chest, triceps medial head, middle chest (sternal pectoralis major);
- clearly dimmer, about half as bright: front deltoid, lower chest;
- all other muscles: no glow, natural deep red.

Equipment: Flat bench with uprights and an Olympic barbell with medium matte black plates.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 58. Skameykada orqa tayanch (Bench Dip) — pastki nuqta — `bench-dip`

```
Photorealistic anatomical render of a muscular male athlete performing the bench dip, captured at the bottom position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Hands on the edge of a flat bench behind the hips, fingers pointing forward.
- Legs extended forward, heels on the floor.
- Body lowered until the upper arms are parallel to the floor, back close to the bench, shoulders down.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): triceps lateral head, triceps medial head, triceps long head;
- clearly dimmer, about half as bright: front deltoid, middle chest (sternal pectoralis major);
- all other muscles: no glow, natural deep red.

Equipment: Flat weight bench.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 59. Planka (Plank) — ushlab turish — `plank`

```
Photorealistic anatomical render of a muscular male athlete performing the plank, captured at the hold. Camera: side view from the athlete's right at floor height (low camera), 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Forearm plank: elbows directly under the shoulders, forearms parallel.
- Body in one straight line from head to heels, glutes and abs tight, hips neither sagging nor piked.
- Neck neutral, eyes on the floor.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): obliques, rectus abdominis;
- clearly dimmer, about half as bright: front deltoid, serratus anterior;
- very faint: rectus femoris;
- all other muscles: no glow, natural deep red.

Equipment: No equipment, plain floor.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 60. Turnikda oyoq ko‘tarish (Hanging Leg Raise) — yuqori nuqta — `hanging-leg-raise`

```
Photorealistic anatomical render of a muscular male athlete performing the hanging leg raise, captured at the top position. Camera: side view from the athlete's right at chest height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Hanging from a pull-up bar with straight arms, shoulders active.
- Straight legs raised to horizontal (90° at the hips), pelvis tucked under.
- No swinging, torso vertical.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): rectus abdominis;
- clearly dimmer, about half as bright: obliques, hip flexors (iliopsoas), forearm flexors, rectus femoris;
- very faint: latissimus dorsi;
- all other muscles: no glow, natural deep red.

Equipment: Pull-up bar.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 61. Blokda press (tiz cho‘kib) (Cable Crunch) — qisqargan holat — `cable-crunch`

```
Photorealistic anatomical render of a muscular male athlete performing the cable crunch, captured at the bottom (crunched) position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Kneeling facing a high pulley, rope held beside the head.
- Spine flexed, curling the ribs toward the pelvis, elbows moving toward the thighs.
- Hips stay still above the knees.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): rectus abdominis;
- clearly dimmer, about half as bright: obliques;
- all other muscles: no glow, natural deep red.

Equipment: Cable column with a high pulley and a rope; the cable clearly attached to the rope.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 62. Pressga qisqarish (Crunch) — yuqori nuqta — `crunch`

```
Photorealistic anatomical render of a muscular male athlete performing the crunch, captured at the top position. Camera: side view from the athlete's right at floor height (low camera), 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Lying on the back, knees bent, feet flat.
- Shoulders and upper back curled off the floor, lower back stays on the floor.
- Hands crossed on the chest, neck neutral.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): rectus abdominis;
- clearly dimmer, about half as bright: obliques;
- all other muscles: no glow, natural deep red.

Equipment: No equipment, plain floor.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 63. «O‘lik qo‘ng‘iz» (Dead Bug) — cho‘zilgan holat — `dead-bug`

```
Photorealistic anatomical render of a muscular male athlete performing the dead bug, captured at the extended position. Camera: high three-quarter view from above the right side (about 40° down), 50mm lens.

Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.

Correct technique (must be exact):
- Lying on the back, lower back pressed flat into the floor.
- Right arm extended overhead just above the floor and left leg extended straight just above the floor.
- Left arm pointing straight up to the ceiling; right knee bent 90° directly above the hip.
- CRITICAL: the extended arm and the extended leg are on OPPOSITE sides of the body (right arm + left leg) — never arm and leg of the same side.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): obliques, rectus abdominis;
- clearly dimmer, about half as bright: hip flexors (iliopsoas), rectus femoris;
- all other muscles: no glow, natural deep red.

Equipment: No equipment, plain floor.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 64. Sumo o‘tirish (Sumo Squat) — pastki nuqta — `sumo-squat`

```
Photorealistic anatomical render of an athletic woman performing the sumo squat, captured at the bottom position. Camera: front three-quarter view — 30° in front of the athlete's right side, at hip height, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- Very wide stance, about twice shoulder width, toes turned out about 30–45°, heels flat.
- One dumbbell held vertically by its top end with both hands, arms straight, hanging between the legs below the hips; it does not touch the floor.
- Thighs parallel to the floor, knees pushed out directly over the toes (not caving in), torso upright with a neutral spine, chest up.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): vastus lateralis (outer front thigh), vastus medialis (inner front thigh);
- clearly dimmer, about half as bright: gluteus maximus, inner-thigh adductors;
- very faint: erector spinae (lower back), rectus femoris;
- all other muscles: no glow, natural deep red.

Equipment: One hexagonal black dumbbell.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 65. Orqaga hamla (Reverse Lunge) — pastki nuqta — `reverse-lunge`

```
Photorealistic anatomical render of an athletic woman performing the reverse lunge, captured at the bottom position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- Long split stance after stepping backward: front foot flat, front shin nearly vertical, front thigh parallel to the floor.
- Back knee about 3 cm above the floor directly under the hip, back heel raised, weight on the ball of the back foot.
- Torso upright with a slight forward lean from the hips, neutral spine, hands on the hips.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): vastus lateralis (outer front thigh), vastus medialis (inner front thigh);
- clearly dimmer, about half as bright: gluteus maximus, gluteus medius;
- very faint: biceps femoris (outer hamstring), inner-thigh adductors;
- all other muscles: no glow, natural deep red.

Equipment: No equipment, plain floor.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 66. Reverans hamla (Curtsy Lunge) — pastki nuqta — `curtsy-lunge`

```
Photorealistic anatomical render of an athletic woman performing the curtsy lunge, captured at the bottom position. Camera: front three-quarter view — 30° in front of the athlete's right side, at hip height, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- The back leg has stepped diagonally behind and across the front leg, like a curtsy; back heel raised, back knee a few centimeters above the floor.
- Front foot flat, front knee bent about 90° and tracking over the middle toes, not collapsing inward.
- Hips and shoulders square to the camera-facing front (not rotated), torso upright, hands on the hips.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): vastus lateralis (outer front thigh), vastus medialis (inner front thigh), gluteus medius;
- clearly dimmer, about half as bright: gluteus maximus, inner-thigh adductors;
- very faint: biceps femoris (outer hamstring);
- all other muscles: no glow, natural deep red.

Equipment: No equipment, plain floor.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 67. Devorga suyanib o‘tirish (Wall Sit) — ushlab turish — `wall-sit`

```
Photorealistic anatomical render of an athletic woman performing the wall sit, captured at the hold. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- Back, shoulders and back of the head flat against a plain wall.
- Thighs parallel to the floor, knees bent 90° directly above the ankles, shins vertical, feet flat hip width apart.
- Arms extended straight forward at shoulder height, not resting on the thighs.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): vastus lateralis (outer front thigh), vastus medialis (inner front thigh);
- very faint: rectus femoris, gluteus maximus;
- all other muscles: no glow, natural deep red.

Equipment: A plain flat wall behind the athlete, no other equipment.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 68. Bir oyoqda ko‘prikcha (Single-Leg Glute Bridge) — yuqori nuqta — `single-leg-bridge`

```
Photorealistic anatomical render of an athletic woman performing the single-leg glute bridge, captured at the top position. Camera: side view from the athlete's right at floor height (low camera), 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- Lying on the back, one foot flat on the floor with the knee bent about 90°, arms resting on the floor beside the body.
- Hips lifted so the shoulder, hip and knee of the working leg form one straight line; pelvis level (not dropping toward the free leg), ribs down, no lower-back arch.
- The other leg held straight, extended in line with the working thigh, toes pulled toward the shin.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): gluteus medius, gluteus maximus;
- clearly dimmer, about half as bright: erector spinae (lower back), biceps femoris (outer hamstring), inner hamstrings;
- all other muscles: no glow, natural deep red.

Equipment: A plain dark exercise mat on the floor, no other equipment.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 69. To‘rt oyoqlab orqaga tepish (Quadruped Glute Kickback) — yuqori nuqta — `glute-kickback`

```
Photorealistic anatomical render of an athletic woman performing the quadruped glute kickback, captured at the top position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- On all fours: hands flat directly under the shoulders, the support knee directly under the hip, back flat.
- The working leg kicked back and up with the knee bent 90°: thigh parallel to the floor in line with the torso, sole of the foot facing the ceiling.
- No lower-back arch, pelvis level and square to the floor, neck neutral with eyes on the floor.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): gluteus maximus;
- clearly dimmer, about half as bright: gluteus medius, biceps femoris (outer hamstring), erector spinae (lower back), inner hamstrings;
- all other muscles: no glow, natural deep red.

Equipment: A plain dark exercise mat on the floor, no other equipment.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 70. Tizzani yonga ko‘tarish («gidrant») (Fire Hydrant) — yuqori nuqta — `fire-hydrant`

```
Photorealistic anatomical render of an athletic woman performing the fire hydrant, captured at the top position. Camera: rear three-quarter view — 30° behind the athlete's right side, at hip height, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- On all fours: hands flat directly under the shoulders, the support knee directly under the hip, back flat.
- The working leg lifted out to the side with the knee bent 90°: thigh close to parallel with the floor, pointing sideways, lower leg parallel to the floor behind the knee.
- Torso and pelvis stay level and square to the floor — no leaning away from the lifted leg, no back arch.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): gluteus medius;
- clearly dimmer, about half as bright: gluteus maximus;
- very faint: obliques, erector spinae (lower back);
- all other muscles: no glow, natural deep red.

Equipment: A plain dark exercise mat on the floor, no other equipment.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 71. «Chig‘anoq» (yonboshlab tizzani ochish) (Clamshell) — yuqori nuqta — `clamshell`

```
Photorealistic anatomical render of an athletic woman performing the clamshell, captured at the open position. Camera: view from in front of the athlete (facing the chest and knees), camera slightly above floor height and about 20° down, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- Lying on the side, head resting on the extended bottom arm; hips bent about 45° and knees about 90°; hips and shoulders stacked vertically.
- Heels together, the top knee opened upward like a clamshell about 30–40° while the feet stay touching.
- The pelvis does not roll backward; the top hand rests on the top hip.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): gluteus medius, gluteus maximus;
- all other muscles: no glow, natural deep red.

Equipment: A plain dark exercise mat on the floor, no other equipment.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 72. Yonboshlab oyoq ko‘tarish (Side-Lying Leg Raise) — yuqori nuqta — `side-leg-raise`

```
Photorealistic anatomical render of an athletic woman performing the side-lying leg raise, captured at the top position. Camera: view from in front of the athlete (facing the chest and knees), camera slightly above floor height and about 20° down, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- Lying on the side, head resting on the bottom arm, bottom knee slightly bent for stability; hips and shoulders stacked vertically.
- The top leg straight, raised about 35° from the bottom leg, in line with the torso or slightly behind it (not drifting forward).
- Top toes pointing forward (not toward the ceiling), the top hand resting on the hip, pelvis not rolling.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): gluteus medius;
- clearly dimmer, about half as bright: gluteus maximus;
- all other muscles: no glow, natural deep red.

Equipment: A plain dark exercise mat on the floor, no other equipment.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 73. Mini-lenta bilan yonga yurish (Banded Lateral Walk) — qisqargan holat — `banded-lateral-walk`

```
Photorealistic anatomical render of an athletic woman performing the banded lateral walk, captured at the wide step. Camera: straight-on front view at hip height, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- A mini loop band around both legs just above the ankles, stretched taut between them.
- Half-squat position: hips back, knees bent about 30°, torso leaning slightly forward with a neutral spine, hands on the hips.
- Mid side-step: feet about shoulder width apart, toes pointing forward, knees pushed out over the toes (not caving in).

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): gluteus medius;
- very faint: gluteus maximus, vastus lateralis (outer front thigh);
- all other muscles: no glow, natural deep red.

Equipment: One lime-green elastic mini loop band around the lower legs.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 74. Fitbolda oyoq bukish (Stability Ball Leg Curl) — qisqargan holat — `ball-leg-curl`

```
Photorealistic anatomical render of an athletic woman performing the stability ball leg curl, captured at the curled position. Camera: side view from the athlete's right at floor height (low camera), 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- Lying on the back, shoulders and arms on the floor, arms beside the body with palms down.
- Hips lifted high; knees bent about 90°, soles of both feet flat on top of a large stability ball pulled in toward the buttocks.
- Shoulders, hips and knees in one line, no lower-back arch.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): inner hamstrings, biceps femoris (outer hamstring);
- clearly dimmer, about half as bright: gluteus maximus;
- very faint: gastrocnemius (calf), erector spinae (lower back);
- all other muscles: no glow, natural deep red.

Equipment: One large matte black stability ball (about 65 cm) resting on the floor; a plain dark exercise mat.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 75. «Supermen» (qorinda yotib ko‘tarilish) (Superman) — yuqori nuqta — `superman`

```
Photorealistic anatomical render of an athletic woman performing the superman, captured at the top position. Camera: side view from the athlete's right at floor height (low camera), 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- Lying face down, arms extended straight forward beyond the head, legs straight.
- Arms, chest and legs lifted only a few centimeters off the floor; the belly and pelvis stay on the floor.
- Long body shape, glutes squeezed, neck neutral — eyes looking at the floor, head not thrown back.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): erector spinae (lower back);
- clearly dimmer, about half as bright: gluteus maximus, middle trapezius;
- very faint: biceps femoris (outer hamstring);
- all other muscles: no glow, natural deep red.

Equipment: A plain dark exercise mat on the floor, no other equipment.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 76. Tizzada otjimaniya (Knee Push-up) — pastki nuqta — `knee-push-up`

```
Photorealistic anatomical render of an athletic woman performing the knee push-up, captured at the bottom position. Camera: side view from the athlete's right at floor height (low camera), 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- Kneeling push-up: knees on the mat, lower legs raised with ankles crossed.
- Body in one straight line from knees to head — hips neither piked nor sagging; chest about 5 cm above the floor.
- Hands slightly wider than the shoulders, under the chest; elbows at about 45° from the torso.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): middle chest (sternal pectoralis major), serratus anterior, triceps lateral head;
- clearly dimmer, about half as bright: front deltoid;
- very faint: rectus abdominis;
- all other muscles: no glow, natural deep red.

Equipment: A plain dark exercise mat on the floor, no other equipment.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 77. O‘tirib rezina lentani tortish (Seated Band Row) — qisqargan holat — `band-row`

```
Photorealistic anatomical render of an athletic woman performing the seated band row, captured at the contracted position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- Sitting upright on the floor, legs extended forward with knees slightly bent, a long resistance band looped around the soles of both feet.
- Band ends pulled to the lower ribs: elbows driven back close to the body, behind the torso.
- Shoulder blades squeezed together and down, chest up, torso upright (not leaning back).

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): latissimus dorsi, middle trapezius, rhomboids, rear deltoid;
- clearly dimmer, about half as bright: biceps;
- very faint: erector spinae (lower back);
- all other muscles: no glow, natural deep red.

Equipment: One long lime-green resistance band looped under the feet.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 78. «Qush-it» (qarama-qarshi qo‘l va oyoq) (Bird Dog) — cho‘zilgan holat — `bird-dog`

```
Photorealistic anatomical render of an athletic woman performing the bird dog, captured at the extended position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- On all fours: one hand flat under the shoulder, the opposite knee under the hip.
- The other arm extended straight forward at shoulder height, thumb up; the opposite leg extended straight back at hip height, toes pointing down.
- Back flat like a table, hips and shoulders level and square to the floor, neck neutral.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): gluteus maximus;
- clearly dimmer, about half as bright: gluteus medius, erector spinae (lower back);
- very faint: front deltoid, obliques;
- all other muscles: no glow, natural deep red.

Equipment: A plain dark exercise mat on the floor, no other equipment.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 79. Yon planka (Side Plank) — ushlab turish — `side-plank`

```
Photorealistic anatomical render of an athletic woman performing the side plank, captured at the hold. Camera: straight-on front view at floor height (low camera), 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- Forearm side plank: the bottom elbow directly under the shoulder, forearm on the floor pointing forward.
- Body in one straight line from feet to head, feet stacked, hips lifted (not sagging and not rotated backward).
- The top arm extended straight up toward the ceiling, the bottom shoulder pushed away from the ear.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): gluteus medius, obliques;
- clearly dimmer, about half as bright: rectus abdominis, erector spinae (lower back);
- very faint: gluteus maximus;
- all other muscles: no glow, natural deep red.

Equipment: A plain dark exercise mat on the floor, no other equipment.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 80. Teskari qisqarish (Reverse Crunch) — qisqargan holat — `reverse-crunch`

```
Photorealistic anatomical render of an athletic woman performing the reverse crunch, captured at the top position. Camera: side view from the athlete's right at floor height (low camera), 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- Lying on the back, arms on the floor beside the body, palms down; head and shoulders stay on the floor.
- Knees bent about 90° and pulled toward the chest; the pelvis curled up so the lower back lifts a few centimeters off the floor.
- Movement comes from curling the pelvis, not from swinging the legs.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): rectus abdominis;
- clearly dimmer, about half as bright: obliques;
- very faint: rectus femoris, hip flexors (iliopsoas);
- all other muscles: no glow, natural deep red.

Equipment: A plain dark exercise mat on the floor, no other equipment.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 81. «Velosiped» (Bicycle Crunch) — qisqargan holat — `bicycle-crunch`

```
Photorealistic anatomical render of an athletic woman performing the bicycle crunch, captured at the twist to one side. Camera: high three-quarter view from above the right side (about 40° down), 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- Lying on the back, shoulder blades lifted off the floor, fingertips lightly at the temples, elbows wide.
- One knee pulled toward the chest while the torso rotates so the opposite shoulder (not just the elbow) moves toward that knee.
- The other leg extended straight about 30–45° above the floor; lower back pressed into the floor.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): rectus abdominis, obliques;
- clearly dimmer, about half as bright: hip flexors (iliopsoas);
- very faint: rectus femoris;
- all other muscles: no glow, natural deep red.

Equipment: A plain dark exercise mat on the floor, no other equipment.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 82. «Alpinist» (Mountain Climber) — qisqargan holat — `mountain-climber`

```
Photorealistic anatomical render of an athletic woman performing the mountain climber, captured at one knee driven forward. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- High plank: arms straight, hands flat directly under the shoulders.
- One knee driven forward under the chest with the foot off the floor; the other leg extended straight back on the ball of the foot.
- Hips level with the shoulders (not piked up, not sagging), back flat, neck neutral.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): rectus abdominis, obliques;
- clearly dimmer, about half as bright: hip flexors (iliopsoas), rectus femoris, front deltoid;
- all other muscles: no glow, natural deep red.

Equipment: A plain dark exercise mat on the floor, no other equipment.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 83. Trenajyorda sonni ochish (Machine Hip Abduction) — ochilgan holat — `hip-abduction`

```
Photorealistic anatomical render of an athletic woman performing the machine hip abduction, captured at the open position, knees pushed fully apart. Camera: rear three-quarter view — 30° behind the athlete's right side, at hip height, 50mm lens — so the outer hips and the glutes on the seat are clearly visible.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- Seated upright with the back against the backrest, feet on the two foot bars, thighs roughly parallel to the floor.
- The two thigh pads press on the OUTSIDE of the thighs just above the knees; the knees are pushed outward against them to about 40–45° of hip abduction on each side.
- Hands grip the side handles beside the seat, hips stay down on the seat, torso still, no leaning back.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): gluteus medius, gluteus maximus;
- all other muscles: no glow, natural deep red.

Equipment: Seated hip abduction machine (abductor): a padded seat with an upright backrest, two vertical padded thigh pads on swinging arms placed on the OUTSIDE of the knees, two foot bars, short side handles and a weight stack behind the seat.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 84. Trenajyorda sonni yopish (Machine Hip Adduction) — yopilgan holat — `hip-adduction`

```
Photorealistic anatomical render of an athletic woman performing the machine hip adduction, captured at the closed position, knees squeezed together. Camera: front three-quarter view — 30° in front of the athlete's right side, at hip height, 50mm lens — so the inner thighs are clearly visible.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- Seated upright with the back against the backrest, feet on the two foot bars, thighs roughly parallel to the floor.
- The two thigh pads press on the INSIDE of the thighs just above the knees; the knees are squeezed together until the pads almost touch.
- Hands grip the side handles beside the seat, hips stay down on the seat, torso upright.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): inner-thigh adductors;
- very faint: inner hamstrings;
- all other muscles: no glow, natural deep red.

Equipment: Seated hip adduction machine (adductor): a padded seat with an upright backrest, two vertical padded thigh pads on swinging arms placed on the INSIDE of the knees, two foot bars, short side handles and a weight stack behind the seat.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 85. Blokda oyoqni orqaga uzatish (Cable Glute Kickback) — yuqori nuqta — `cable-kickback`

```
Photorealistic anatomical render of an athletic woman performing the cable glute kickback, captured at the top position, working leg extended back. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- Standing facing a cable column, about two small steps away, both hands holding the column frame at chest height, torso leaning forward about 20–30°.
- A padded ankle cuff on the RIGHT ankle is clipped to the LOW pulley; the cable runs forward and down from the ankle to the pulley near the floor.
- The right leg is pushed straight back from the hip until the thigh is in line with the torso (not higher), knee almost straight, foot flexed; the left standing leg slightly bent.
- Neutral spine — no lower-back arch, pelvis square to the column, glutes squeezed.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): gluteus maximus;
- clearly dimmer, about half as bright: biceps femoris (outer hamstring), inner hamstrings, gluteus medius, erector spinae (lower back);
- all other muscles: no glow, natural deep red.

Equipment: Cable column with the pulley set at the lowest position, a padded ankle strap (ankle cuff) clipped to the cable; the cable clearly attached to the ankle cuff.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 86. Blokda oyoq orasidan tortish (Cable Pull-Through) — pastki nuqta — `cable-pull-through`

```
Photorealistic anatomical render of an athletic woman performing the cable pull-through, captured at the bottom (hinged) position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- Standing with the back to a low pulley, feet slightly wider than shoulders, about two steps away from the column.
- A rope attachment runs from the low pulley forward BETWEEN the legs; both hands hold the rope ends between the thighs with straight arms.
- Hip hinge: hips pushed back, torso leaning forward about 45° with a flat neutral back, knees softly bent (not a squat), shins nearly vertical, hands pulled back just behind the knees.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): gluteus maximus, inner hamstrings, biceps femoris (outer hamstring);
- clearly dimmer, about half as bright: erector spinae (lower back);
- very faint: forearm flexors;
- all other muscles: no glow, natural deep red.

Equipment: Cable column with the pulley at the lowest position and a triceps rope attachment; the cable clearly passes between the legs to the rope.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 87. O‘tirib boldir ko‘tarish (Seated Calf Raise) — yuqori nuqta — `seated-calf-raise`

```
Photorealistic anatomical render of an athletic woman performing the seated calf raise, captured at the top position, heels raised. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- Seated with knees bent at 90°, thighs horizontal, the padded lever resting across the lower thighs just above the knees.
- The balls of both feet on the edge of the foot plate, heels free; ankles fully extended so the heels are lifted as high as possible.
- Torso upright, hands holding the lever handles on top of the knee pad.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): soleus;
- clearly dimmer, about half as bright: gastrocnemius (calf);
- all other muscles: no glow, natural deep red.

Equipment: Plate-loaded seated calf raise machine: a low seat, a horizontal padded knee lever above the thighs with a safety catch handle and a weight-plate horn at its front end, and a small angled foot plate in front of the seat.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 88. Gravitronda tortilish (Assisted Pull-up (Gravitron)) — yuqori nuqta — `assisted-pull-up`

```
Photorealistic anatomical render of an athletic woman performing the assisted pull-up (gravitron), captured at the top position, chin above the handles. Camera: rear three-quarter view — 30° behind the athlete's right side, at chest height, 50mm lens — so the kneeling pad, the back and the handles are all visible.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- Kneeling on the padded assist platform with both knees, shins resting on the pad, torso vertical, slight lean back.
- Hands on the high handles about shoulder width (neutral or overhand grip), chin just above the handles, elbows pulled down beside the ribs, shoulders down.
- The platform has risen with the athlete — it pushes up on the knees from below.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): latissimus dorsi;
- clearly dimmer, about half as bright: teres major, biceps, lower trapezius, infraspinatus and teres minor, forearm flexors, rear deltoid;
- all other muscles: no glow, natural deep red.

Equipment: Counterweight assisted pull-up/dip machine (gravitron): a tall frame with high pull-up handles, a padded kneeling platform on a lever arm in the middle, step-up foot rails on both sides and a selectorized weight stack at the back.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 89. T-shtanga tortish (T-Bar Row) — yuqori nuqta — `t-bar-row`

```
Photorealistic anatomical render of an athletic woman performing the t-bar row, captured at the top position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- Standing astride ONE straight Olympic bar: its back end is anchored in a landmine pivot on the floor BEHIND the athlete, the bar runs forward between the feet, and its FRONT end, loaded with plates, is under the chest.
- Both hands grip the bar itself just behind the plates, one hand in front of the other, palms facing each other — no handle attachment.
- Hip hinge with the torso at about 45° to the floor, knees bent, back flat; the bar pulled up until the hands touch the upper abdomen, elbows close to the body pointing back, shoulder blades squeezed, neck neutral.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): latissimus dorsi, middle trapezius, rhomboids, rear deltoid;
- clearly dimmer, about half as bright: erector spinae (lower back), biceps, forearm flexors, lower trapezius;
- all other muscles: no glow, natural deep red.

Equipment: Landmine T-bar row setup: ONE straight rigid Olympic barbell — the back end in a floor landmine pivot, two medium matte black plates on the front end. The bar is one straight line from the pivot on the floor, between the athlete’s legs, through the hands to the plates; the plates are always ON the bar, never on the floor.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 90. Skott skameykasida bitseps (Preacher Curl) — o‘rta holat — `preacher-curl`

```
Photorealistic anatomical render of an athletic woman performing the preacher curl, captured at midway, forearms horizontal. Camera: side view from the athlete's right at chest height, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- Seated at a preacher bench, armpits on the top edge of the pad, the backs of both upper arms lying flat on the angled pad (about 45°).
- Underhand grip on an EZ curl bar at shoulder width, curled up until the forearms are horizontal; elbows stay on the pad.
- Torso upright and still, shoulders down, wrists straight.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): biceps, brachialis;
- clearly dimmer, about half as bright: brachioradialis;
- very faint: forearm flexors;
- all other muscles: no glow, natural deep red.

Equipment: Preacher (Scott) curl bench: an adjustable seat and a sloping arm pad at about 45° on a steel post, with a bar rack; an EZ curl bar with small matte black plates.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 91. Rolikda press (tiz cho‘kib) (Ab Wheel Rollout (Kneeling)) — cho‘zilgan holat — `ab-wheel`

```
Photorealistic anatomical render of an athletic woman performing the ab wheel rollout (kneeling), captured at the extended position. Camera: side view from the athlete's right at floor height (low camera), 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct technique (must be exact):
- Kneeling on a soft mat, both hands on the handles of an ab wheel that has rolled forward ahead of the head.
- Body in one straight line from knees to shoulders, slightly inclined (shoulders higher than knees), hips NOT sagging, glutes squeezed, ribs down.
- Arms straight, extended forward and overhead, neck neutral, eyes on the floor.

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): rectus abdominis;
- clearly dimmer, about half as bright: obliques;
- very faint: latissimus dorsi, rectus femoris;
- all other muscles: no glow, natural deep red.

Equipment: An ab wheel (small single wheel with a handle on each side) and a thin exercise mat.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

### 92. Mushuk–sigir (Cat-Cow) — «mushuk» holati — `cat-cow`

```
Photorealistic anatomical render of a woman holding the cat-cow stretch, captured at the cat position — spine fully rounded. Camera: side view from the athlete's right, camera low at about 40 cm above the floor, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct position (must be exact):
- On all fours on the mat: hands directly under the shoulders with fingers spread, knees directly under the hips, tops of the feet flat on the mat.
- Arms straight but not locked; the whole spine rounded up toward the ceiling in one smooth arc from the tailbone to the neck, pelvis tucked under.
- Head relaxed down between the arms, chin drawn toward the chest, gaze toward the knees.
- Hands pressing the floor away so the shoulder blades spread apart.
Relaxed face and shoulders, calm breathing, no strain.

The STRETCHED muscles are shown with a soft neon lime-green glow (#D4FA50) running along their length:
- brightest: lower-back erector spinae;
- faint: abdominal wall, rhomboids and mid back;
- all other muscles: no glow, natural deep red.

Equipment: Yoga mat on the floor.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure fully visible with generous empty margins, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers.
```

### 93. Bola pozasi (Child's Pose) — cho‘zilgan holat — `childs-pose`

```
Photorealistic anatomical render of a woman holding the child's pose stretch, captured at the resting held position. Camera: side view from the athlete's right, camera low at about 40 cm above the floor, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct position (must be exact):
- Kneeling on the mat with the big toes touching and the knees about hip-width apart, tops of the feet flat on the mat.
- Hips sitting back onto (or just above) the heels; torso folded forward and resting on the thighs, back gently rounded.
- Both arms extended straight forward on the mat beyond the head, palms down, shoulders relaxed away from the ears.
- Forehead resting on the mat, neck long and relaxed.
Relaxed face and shoulders, calm breathing, no strain.

The STRETCHED muscles are shown with a soft neon lime-green glow (#D4FA50) running along their length:
- brightest: lower-back erector spinae, latissimus dorsi;
- faint: gluteal muscles, rhomboids and mid back;
- all other muscles: no glow, natural deep red.

Equipment: Yoga mat on the floor.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure fully visible with generous empty margins, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers.
```

### 94. Pastga qaragan it (Downward Dog) — cho‘zilgan holat — `down-dog`

```
Photorealistic anatomical render of a woman holding the downward dog stretch, captured at the held inverted-V position. Camera: side view from the athlete's right, camera at about 60 cm above the floor, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct position (must be exact):
- Inverted V shape: hands on the mat shoulder-width apart, slightly in front of the shoulders, fingers spread; feet hip-width apart.
- Hips pushed high up and back; spine long and straight from the hands to the tailbone — the lower back is not rounded.
- Arms straight and in line with the torso, upper arms beside the ears, head relaxed between the arms, gaze toward the knees.
- Knees straight or very slightly bent, heels reaching toward the mat (a few centimeters above it is fine).
Relaxed face and shoulders, calm breathing, no strain.

The STRETCHED muscles are shown with a soft neon lime-green glow (#D4FA50) running along their length:
- brightest: hamstrings, calves;
- faint: latissimus dorsi;
- all other muscles: no glow, natural deep red.

Equipment: Yoga mat on the floor.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure fully visible with generous empty margins, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers.
```

### 95. Kobra (Cobra) — yuqori holat — `cobra`

```
Photorealistic anatomical render of a woman holding the cobra stretch, captured at the lifted held position. Camera: side view from the athlete's right, camera low at about 40 cm above the floor, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct position (must be exact):
- Lying face down on the mat, legs extended straight back hip-width apart, tops of the feet flat on the mat.
- Pelvis and the front of the thighs stay on the mat; chest lifted so the torso is at about 30–40° to the floor.
- Palms on the mat under or slightly in front of the shoulders, elbows slightly bent, tucked close to the ribs and pointing back.
- Shoulders down away from the ears, chest open, neck long with the gaze forward and slightly down — the head is not thrown back.
Relaxed face and shoulders, calm breathing, no strain.

The STRETCHED muscles are shown with a soft neon lime-green glow (#D4FA50) running along their length:
- brightest: abdominal wall;
- faint: pectoral muscles;
- all other muscles: no glow, natural deep red.

Equipment: Yoga mat on the floor.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure fully visible with generous empty margins, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers.
```

### 96. Ignaga ip o‘tkazish (Thread the Needle) — pastki holat — `thread-needle`

```
Photorealistic anatomical render of a woman holding the thread the needle stretch, captured at the threaded position. Camera: front three-quarter view — 40° in front of the athlete's left side, camera at about 50 cm above the floor, 50mm lens — so the threaded arm and the rotated upper back are visible.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct position (must be exact):
- On all fours on the mat, hips stacked directly above the knees, tops of the feet on the mat.
- Left hand planted on the mat under the left shoulder, left elbow slightly bent, supporting the body.
- Right arm threaded under the left arm along the mat toward the left side, palm facing up; the right shoulder and the right side of the head rest on the mat.
- Upper back rotated toward the left while the hips stay level above the knees.
Relaxed face and shoulders, calm breathing, no strain.

The STRETCHED muscles are shown with a soft neon lime-green glow (#D4FA50) running along their length:
- brightest: rhomboids and mid back;
- faint: rear deltoids, obliques;
- all other muscles: no glow, natural deep red.

Equipment: Yoga mat on the floor.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure fully visible with generous empty margins, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers.
```

### 97. Yotib burilish (Supine Spinal Twist) — cho‘zilgan holat — `supine-twist`

```
Photorealistic anatomical render of a woman holding the supine spinal twist stretch, captured at the held twist with the knees dropped to one side. Camera: high three-quarter view from above the athlete's feet on the right side (about 45° down), 50mm lens — so the flat shoulders and the knees dropped to the side are both visible.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct position (must be exact):
- Lying on the back on the mat, both arms extended out to the sides at shoulder height in a T, palms down, both shoulder blades flat on the mat.
- Knees bent about 90° and stacked together, both dropped over to the right side, resting on or close to the mat.
- Head turned gently to the left, looking away from the knees.
- The twist comes from the waist and ribcage; face and body relaxed.
Relaxed face and shoulders, calm breathing, no strain.

The STRETCHED muscles are shown with a soft neon lime-green glow (#D4FA50) running along their length:
- brightest: lower-back erector spinae, obliques;
- faint: gluteal muscles, pectoral muscles;
- all other muscles: no glow, natural deep red.

Equipment: Yoga mat on the floor.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure fully visible with generous empty margins, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers.
```

### 98. Tiz cho‘kib son bukuvchisini cho‘zish (Half-Kneeling Hip Flexor Stretch) — cho‘zilgan holat — `hip-flexor-stretch`

```
Photorealistic anatomical render of a woman holding the half-kneeling hip flexor stretch, captured at the held position with the hips shifted forward. Camera: side view from the athlete's left, camera at about 60 cm above the floor, 50mm lens — the back (stretched) leg is nearest the camera.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct position (must be exact):
- Half-kneeling: left knee on a folded towel on the mat, directly under or slightly behind the hip, top of the left foot flat on the mat.
- Right foot flat on the mat in front, right knee bent about 90° directly above the ankle.
- Torso upright and tall, pelvis tucked under with the glutes squeezed, hips shifted a few centimeters forward so the front of the left hip and thigh are stretched; lower back neutral, not arched.
- Both hands resting on the front thigh, shoulders relaxed.
Relaxed face and shoulders, calm breathing, no strain.

The STRETCHED muscles are shown with a soft neon lime-green glow (#D4FA50) running along their length:
- brightest: front thigh and hip flexors (rectus femoris, iliopsoas);
- all other muscles: no glow, natural deep red.

Equipment: Yoga mat on the floor with a small folded towel under the back knee.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure fully visible with generous empty margins, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers.
```

### 99. Kaptar pozasi (Pigeon Pose) — cho‘zilgan holat — `pigeon`

```
Photorealistic anatomical render of a woman holding the pigeon pose stretch, captured at the upright held position. Camera: front three-quarter view — 40° in front of the athlete's right side, camera at about 50 cm above the floor, 50mm lens — so the bent front shin and the long back leg are both clearly visible.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct position (must be exact):
- Right leg in front: right knee bent and resting on the mat behind the right wrist, right shin lying diagonally across the mat with the right heel in front of the left hip, right foot flexed.
- Left leg extended straight back along the mat, the left knee and the top of the left foot on the mat, toes pointing straight back.
- Pelvis level and squared to the front; the right buttock resting on the mat or on a folded blanket.
- Torso upright and long, fingertips on the mat on either side of the hips, shoulders relaxed.
Relaxed face and shoulders, calm breathing, no strain.

The STRETCHED muscles are shown with a soft neon lime-green glow (#D4FA50) running along their length:
- brightest: gluteal muscles;
- faint: front thigh and hip flexors (rectus femoris, iliopsoas);
- all other muscles: no glow, natural deep red.

Equipment: Yoga mat on the floor; a small folded blanket under the right buttock.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure fully visible with generous empty margins, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers.
```

### 100. «4» raqami (chalqancha) (Supine Figure-Four Stretch) — cho‘zilgan holat — `figure-four`

```
Photorealistic anatomical render of a woman holding the supine figure-four stretch, captured at the held position with the support thigh pulled in. Camera: high three-quarter view from above the athlete's right side (about 35° down), 50mm lens — so the ankle crossed on the opposite knee and the open right knee are clearly visible.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct position (must be exact):
- Lying on the back on the mat, head and shoulders resting on the mat.
- Right ankle crossed over the left thigh just below the left knee, right foot flexed, right knee opened out to the side, forming a "4" shape.
- Left foot lifted off the mat and the left thigh drawn toward the chest; both hands clasped behind the left thigh, the right arm reaching through the gap between the legs.
- Pelvis and lower back resting on the mat, buttocks not lifted.
Relaxed face and shoulders, calm breathing, no strain.

The STRETCHED muscles are shown with a soft neon lime-green glow (#D4FA50) running along their length:
- brightest: gluteal muscles;
- all other muscles: no glow, natural deep red.

Equipment: Yoga mat on the floor.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure fully visible with generous empty margins, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers.
```

### 101. Kapalak (Butterfly Stretch) — cho‘zilgan holat — `butterfly`

```
Photorealistic anatomical render of a woman holding the butterfly stretch, captured at the held upright seated position. Camera: straight front view, camera slightly above the seated athlete (about 80 cm above the floor), 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct position (must be exact):
- Sitting upright on the mat, soles of the feet pressed together, heels drawn in toward the groin about a hand-width away.
- Knees dropped open to the sides toward the floor, relaxed, not pushed down.
- Both hands holding the feet, spine tall from the pelvis to the head, chest open, shoulders relaxed.
Relaxed face and shoulders, calm breathing, no strain.

The STRETCHED muscles are shown with a soft neon lime-green glow (#D4FA50) running along their length:
- brightest: inner-thigh adductors;
- all other muscles: no glow, natural deep red.

Equipment: Yoga mat on the floor.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure fully visible with generous empty margins, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers.
```

### 102. Son orqasini cho‘zish (chalqancha) (Supine Hamstring Stretch) — cho‘zilgan holat — `hamstring-stretch`

```
Photorealistic anatomical render of a woman holding the supine hamstring stretch, captured at the held position. Camera: side view from the athlete's right, camera low at about 40 cm above the floor, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct position (must be exact):
- Lying on the back on the mat, head and shoulders relaxed on the mat.
- Right leg raised straight up toward the ceiling, knee straight, foot flexed (toes toward the face), the leg about 80–90° from the floor.
- A strap looped around the ball of the right foot, both hands holding its two ends with the elbows slightly bent, gently drawing the leg toward the body.
- Left knee bent with the left foot flat on the mat; lower back and pelvis flat on the mat.
Relaxed face and shoulders, calm breathing, no strain.

The STRETCHED muscles are shown with a soft neon lime-green glow (#D4FA50) running along their length:
- brightest: hamstrings;
- faint: calves;
- all other muscles: no glow, natural deep red.

Equipment: Yoga mat on the floor and a fabric yoga strap looped around the raised foot.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure fully visible with generous empty margins, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers.
```

### 103. Tik turib son oldini cho‘zish (Standing Quad Stretch) — cho‘zilgan holat — `quad-stretch`

```
Photorealistic anatomical render of a woman holding the standing quad stretch, captured at the held standing position. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct position (must be exact):
- Standing tall facing a plain wall about an arm's length away, the left palm resting flat on the wall at shoulder height for balance.
- Standing on the left leg with a soft knee; the right knee bent and the right hand holding the top of the right foot, heel drawn toward the buttock.
- Both knees side by side, the right knee pointing straight down at the floor, the right thigh vertical or slightly behind the body.
- Pelvis tucked under with the glutes squeezed, torso upright, lower back not arched.
Relaxed face and shoulders, calm breathing, no strain.

The STRETCHED muscles are shown with a soft neon lime-green glow (#D4FA50) running along their length:
- brightest: front thigh and hip flexors (rectus femoris, iliopsoas);
- all other muscles: no glow, natural deep red.

Equipment: A plain wall.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure fully visible with generous empty margins, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers.
```

### 104. Boldirni devorda cho‘zish (Wall Calf Stretch) — cho‘zilgan holat — `calf-stretch`

```
Photorealistic anatomical render of a woman holding the wall calf stretch, captured at the held lunge against the wall. Camera: side view from the athlete's right at hip height, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct position (must be exact):
- Facing a plain wall, both palms flat on the wall at shoulder height, elbows slightly bent.
- Right leg stepped back about one meter: right knee straight, right heel pressed flat on the floor, toes pointing straight forward.
- Left foot forward, closer to the wall, with the left knee bent.
- Body in one straight line from the right heel to the head, leaning toward the wall; hips not sagging.
Relaxed face and shoulders, calm breathing, no strain.

The STRETCHED muscles are shown with a soft neon lime-green glow (#D4FA50) running along their length:
- brightest: calves;
- all other muscles: no glow, natural deep red.

Equipment: A plain wall.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure fully visible with generous empty margins, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers.
```

### 105. Eshik romida ko‘krakni cho‘zish (Doorway Chest Stretch) — cho‘zilgan holat — `doorway-chest`

```
Photorealistic anatomical render of a woman holding the doorway chest stretch, captured at the held position stepped through the doorway. Camera: rear three-quarter view — 35° behind the athlete's right side, at shoulder height, 50mm lens — so the right forearm on the door frame and the open chest are both visible.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct position (must be exact):
- Standing in an open doorway; the right forearm and palm flat against the door frame, right elbow bent 90° at shoulder height, upper arm horizontal and out to the side.
- Right foot a small step forward through the doorway, body leaning gently forward so the right arm stays slightly behind the chest.
- Torso upright, shoulders down away from the ears, lower back neutral.
- Left arm relaxed by the side.
Relaxed face and shoulders, calm breathing, no strain.

The STRETCHED muscles are shown with a soft neon lime-green glow (#D4FA50) running along their length:
- brightest: pectoral muscles;
- faint: front deltoids, biceps;
- all other muscles: no glow, natural deep red.

Equipment: A plain open doorway with a simple door frame.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure fully visible with generous empty margins, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers.
```

### 106. Qo‘lni ko‘krak oldidan tortish (Cross-Body Shoulder Stretch) — cho‘zilgan holat — `cross-body-shoulder`

```
Photorealistic anatomical render of a woman holding the cross-body shoulder stretch, captured at the held position. Camera: front three-quarter view — 30° in front of the athlete's right side, at chest height, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct position (must be exact):
- Standing tall, feet hip-width apart.
- Right arm straight and drawn horizontally across the front of the chest toward the left side, at shoulder height.
- Left hand holding the right arm just above the elbow, gently pulling it closer to the chest.
- Right shoulder relaxed down away from the ear; torso facing forward, not rotated.
Relaxed face and shoulders, calm breathing, no strain.

The STRETCHED muscles are shown with a soft neon lime-green glow (#D4FA50) running along their length:
- brightest: rear deltoids;
- faint: rhomboids and mid back;
- all other muscles: no glow, natural deep red.

Equipment: No equipment, plain floor.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure fully visible with generous empty margins, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers.
```

### 107. Bo‘yinni yonga cho‘zish (Neck Side Stretch) — cho‘zilgan holat — `neck-stretch`

```
Photorealistic anatomical render of a woman holding the neck side stretch, captured at the held side-bend position. Camera: straight front view at chest height, 50mm lens.

Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes (barefoot on a mat for floor stretches).

Correct position (must be exact):
- Standing tall, feet hip-width apart, shoulders relaxed.
- Head tilted to the right, the right ear moving toward the right shoulder; face looking forward, not rotated.
- Right hand resting lightly on the left side of the head above the ear, not pulling.
- Left arm hanging down by the side with the left shoulder drawn down, lengthening the left side of the neck.
Relaxed face and shoulders, calm breathing, no strain.

The STRETCHED muscles are shown with a soft neon lime-green glow (#D4FA50) running along their length:
- brightest: upper trapezius and side neck muscles;
- all other muscles: no glow, natural deep red.

Equipment: No equipment, plain floor.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure fully visible with generous empty margins, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers.
```

## Zal jihozlari

### 108. Shtanga — `barbell`

```
Photorealistic studio product render of one piece of commercial gym equipment: an Olympic barbell lying on the floor, loaded with one large matte black bumper plate on each end, plus two smaller plates leaning against the bar.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 109. Shtanga ramasi — `rack`

```
Photorealistic studio product render of one piece of commercial gym equipment: a power rack (four-post squat cage) with J-hooks, horizontal safety bars at hip height and an empty Olympic barbell resting on the hooks at shoulder height.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 110. Skameyka — `bench`

```
Photorealistic studio product render of one piece of commercial gym equipment: a flat weight bench: one long horizontal padded top on a sturdy steel frame.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 111. Qiya skameyka — `inclineBench`

```
Photorealistic studio product render of one piece of commercial gym equipment: an adjustable weight bench with the backrest raised to about 30 degrees and a small seat pad.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 112. Gantellar — `dumbbells`

```
Photorealistic studio product render of one piece of commercial gym equipment: a two-tier dumbbell rack holding a neat row of hexagonal rubber dumbbells, from small to large.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 113. EZ-shtanga — `ezBar`

```
Photorealistic studio product render of one piece of commercial gym equipment: an EZ curl bar (short bar with a zig-zag cambered middle grip) lying on the floor, loaded with one small matte black plate on each end.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 114. Girya — `kettlebell`

```
Photorealistic studio product render of one piece of commercial gym equipment: three cast-iron kettlebells of different sizes standing in a row, small to large.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 115. Krossover (blok) — `cable`

```
Photorealistic studio product render of one piece of commercial gym equipment: a cable crossover station: two tall weight-stack towers on the left and right, joined by an overhead frame with a pull-up bar, adjustable pulleys with D-handles on both towers.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 116. Yuqori blok — `latPulldown`

```
Photorealistic studio product render of one piece of commercial gym equipment: a lat pulldown machine: a long wide bar hanging from a high cable, a seat with thigh-pad rollers under the bar, and a weight stack behind.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 117. Pastki blok — `seatedRow`

```
Photorealistic studio product render of one piece of commercial gym equipment: a seated cable row machine: a long low bench seat, an angled foot platform, a low pulley with a V-handle, and a weight stack at the end.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 118. Smit mashinasi — `smith`

```
Photorealistic studio product render of one piece of commercial gym equipment: a Smith machine: a barbell fixed inside two vertical steel guide rails in a tall frame, with a flat bench underneath.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 119. Oyoq press — `legPress`

```
Photorealistic studio product render of one piece of commercial gym equipment: a 45-degree plate-loaded leg press: a reclined padded seat, a large angled foot platform on a sled, weight plates loaded on the side posts.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 120. Gakk-mashina — `hackSquat`

```
Photorealistic studio product render of one piece of commercial gym equipment: a plate-loaded hack squat machine: an angled sled with a back pad and two shoulder pads, a large foot platform at the bottom.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 121. Oyoq yozish — `legExtension`

```
Photorealistic studio product render of one piece of commercial gym equipment: a seated leg extension machine: a padded seat with an upright backrest, a padded shin roller in front of the seat at ankle height, and a weight stack.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 122. Oyoq bukish — `legCurl`

```
Photorealistic studio product render of one piece of commercial gym equipment: a seated leg curl machine: a padded seat with an upright backrest, a thigh hold-down pad above the knees, a padded ankle roller in front, and a weight stack.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 123. Ko‘krak press trenajyori — `chestPress`

```
Photorealistic studio product render of one piece of commercial gym equipment: a seated chest press machine: an upright seat and backrest, two horizontal handles at chest height pointing forward, and a weight stack.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 124. Batterflay — `pecDeck`

```
Photorealistic studio product render of one piece of commercial gym equipment: a pec deck (butterfly) machine: an upright seat and backrest with two padded vertical arms on either side that swing together in front of the chest, and a weight stack.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 125. Yelka press trenajyori — `shoulderPress`

```
Photorealistic studio product render of one piece of commercial gym equipment: a seated shoulder press machine: an upright seat and backrest, two handles just above shoulder height pointing up, and a weight stack.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 126. Giperekstenziya — `hyperext`

```
Photorealistic studio product render of one piece of commercial gym equipment: a 45-degree back extension (hyperextension) bench: an angled frame with a padded hip support and padded ankle rollers near the floor.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 127. Turnik — `pullupBar`

```
Photorealistic studio product render of one piece of commercial gym equipment: a free-standing pull-up bar: one straight horizontal steel bar about 2.3 m high between two upright steel posts on a wide base.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 128. Brusya — `dipBars`

```
Photorealistic studio product render of one piece of commercial gym equipment: a free-standing dip station: two parallel horizontal bars with rubber grips at waist height on a sturdy steel base.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 129. Rezina lentalar — `bands`

```
Photorealistic studio product render of one piece of commercial gym equipment: a set of four flat loop resistance bands of increasing thickness, neatly coiled and fanned out on the floor (black, dark grey, graphite and one lime-green).
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 130. Platforma — `box`

```
Photorealistic studio product render of one piece of commercial gym equipment: a sturdy plyometric box (dark wood or dense foam) with a low aerobic step platform beside it.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 131. Kardio — `cardio`

```
Photorealistic studio product render of one piece of commercial gym equipment: a compact group of cardio machines: a treadmill in front, an upright exercise bike and a rowing machine slightly behind it.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 132. Abduktor / adduktor — `hipAbAd`

```
Photorealistic studio product render of one piece of commercial gym equipment: a seated hip abductor / adductor machine: a reclined padded seat and backrest, two padded leg arms that hold the knees and open outward or close inward, foot pegs, and a weight stack behind the seat.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 133. O‘tirib boldir trenajyori — `seatedCalf`

```
Photorealistic studio product render of one piece of commercial gym equipment: a seated calf raise machine: a low padded seat, a horizontal padded lever that rests on top of the thighs just above the knees, an angled foot platform for the balls of the feet, and a plate-loading peg.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 134. Gravitron — `assistedPullup`

```
Photorealistic studio product render of one piece of commercial gym equipment: an assisted pull-up and dip machine (gravitron): a tall frame with high pull-up handles and parallel dip handles, a padded knee platform that moves up and down, and a weight stack.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 135. Skott skameykasi — `preacher`

```
Photorealistic studio product render of one piece of commercial gym equipment: a preacher curl bench: a small seat and an angled padded arm rest at chest height, with a short EZ curl bar resting on the J-hooks in front.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 136. T-shtanga — `tbar`

```
Photorealistic studio product render of one piece of commercial gym equipment: a chest-supported T-bar row machine: an angled chest pad, a foot platform, a lever arm with two pairs of handles (wide and neutral) and plate-loading pegs.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 137. Press roligi — `abWheel`

```
Photorealistic studio product render of one piece of commercial gym equipment: an ab roller wheel: one wide rubber wheel with a steel axle and two foam handles on either side, lying on the floor next to a small kneeling pad.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 138. Fitbol — `fitball`

```
Photorealistic studio product render of one piece of commercial gym equipment: a large stability (Swiss) exercise ball about 65 cm in diameter in matte graphite grey, resting on the floor.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 139. Mini-lenta — `miniBand`

```
Photorealistic studio product render of one piece of commercial gym equipment: a set of three short fabric mini loop bands (hip circles) of increasing resistance, stacked and fanned out on the floor (black, graphite and one lime-green).
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```
