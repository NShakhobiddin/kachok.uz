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

Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:
- brightest (100%): obliques, rectus abdominis;
- clearly dimmer, about half as bright: hip flexors (iliopsoas), rectus femoris;
- all other muscles: no glow, natural deep red.

Equipment: No equipment, plain floor.
Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.
Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.

Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. No extra limbs or fingers, no floating or disconnected equipment.
```

## Zal jihozlari

### 64. Shtanga — `barbell`

```
Photorealistic studio product render of one piece of commercial gym equipment: an Olympic barbell lying on the floor, loaded with one large matte black bumper plate on each end, plus two smaller plates leaning against the bar.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 65. Shtanga ramasi — `rack`

```
Photorealistic studio product render of one piece of commercial gym equipment: a power rack (four-post squat cage) with J-hooks, horizontal safety bars at hip height and an empty Olympic barbell resting on the hooks at shoulder height.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 66. Skameyka — `bench`

```
Photorealistic studio product render of one piece of commercial gym equipment: a flat weight bench: one long horizontal padded top on a sturdy steel frame.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 67. Qiya skameyka — `inclineBench`

```
Photorealistic studio product render of one piece of commercial gym equipment: an adjustable weight bench with the backrest raised to about 30 degrees and a small seat pad.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 68. Gantellar — `dumbbells`

```
Photorealistic studio product render of one piece of commercial gym equipment: a two-tier dumbbell rack holding a neat row of hexagonal rubber dumbbells, from small to large.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 69. EZ-shtanga — `ezBar`

```
Photorealistic studio product render of one piece of commercial gym equipment: an EZ curl bar (short bar with a zig-zag cambered middle grip) lying on the floor, loaded with one small matte black plate on each end.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 70. Girya — `kettlebell`

```
Photorealistic studio product render of one piece of commercial gym equipment: three cast-iron kettlebells of different sizes standing in a row, small to large.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 71. Krossover (blok) — `cable`

```
Photorealistic studio product render of one piece of commercial gym equipment: a cable crossover station: two tall weight-stack towers on the left and right, joined by an overhead frame with a pull-up bar, adjustable pulleys with D-handles on both towers.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 72. Yuqori blok — `latPulldown`

```
Photorealistic studio product render of one piece of commercial gym equipment: a lat pulldown machine: a long wide bar hanging from a high cable, a seat with thigh-pad rollers under the bar, and a weight stack behind.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 73. Pastki blok — `seatedRow`

```
Photorealistic studio product render of one piece of commercial gym equipment: a seated cable row machine: a long low bench seat, an angled foot platform, a low pulley with a V-handle, and a weight stack at the end.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 74. Smit mashinasi — `smith`

```
Photorealistic studio product render of one piece of commercial gym equipment: a Smith machine: a barbell fixed inside two vertical steel guide rails in a tall frame, with a flat bench underneath.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 75. Oyoq press — `legPress`

```
Photorealistic studio product render of one piece of commercial gym equipment: a 45-degree plate-loaded leg press: a reclined padded seat, a large angled foot platform on a sled, weight plates loaded on the side posts.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 76. Gakk-mashina — `hackSquat`

```
Photorealistic studio product render of one piece of commercial gym equipment: a plate-loaded hack squat machine: an angled sled with a back pad and two shoulder pads, a large foot platform at the bottom.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 77. Oyoq yozish — `legExtension`

```
Photorealistic studio product render of one piece of commercial gym equipment: a seated leg extension machine: a padded seat with an upright backrest, a padded shin roller in front of the seat at ankle height, and a weight stack.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 78. Oyoq bukish — `legCurl`

```
Photorealistic studio product render of one piece of commercial gym equipment: a seated leg curl machine: a padded seat with an upright backrest, a thigh hold-down pad above the knees, a padded ankle roller in front, and a weight stack.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 79. Ko‘krak press trenajyori — `chestPress`

```
Photorealistic studio product render of one piece of commercial gym equipment: a seated chest press machine: an upright seat and backrest, two horizontal handles at chest height pointing forward, and a weight stack.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 80. Batterflay — `pecDeck`

```
Photorealistic studio product render of one piece of commercial gym equipment: a pec deck (butterfly) machine: an upright seat and backrest with two padded vertical arms on either side that swing together in front of the chest, and a weight stack.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 81. Yelka press trenajyori — `shoulderPress`

```
Photorealistic studio product render of one piece of commercial gym equipment: a seated shoulder press machine: an upright seat and backrest, two handles just above shoulder height pointing up, and a weight stack.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 82. Giperekstenziya — `hyperext`

```
Photorealistic studio product render of one piece of commercial gym equipment: a 45-degree back extension (hyperextension) bench: an angled frame with a padded hip support and padded ankle rollers near the floor.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 83. Turnik — `pullupBar`

```
Photorealistic studio product render of one piece of commercial gym equipment: a free-standing pull-up bar: one straight horizontal steel bar about 2.3 m high between two upright steel posts on a wide base.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 84. Brusya — `dipBars`

```
Photorealistic studio product render of one piece of commercial gym equipment: a free-standing dip station: two parallel horizontal bars with rubber grips at waist height on a sturdy steel base.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 85. Rezina lentalar — `bands`

```
Photorealistic studio product render of one piece of commercial gym equipment: a set of four flat loop resistance bands of increasing thickness, neatly coiled and fanned out on the floor (black, dark grey, graphite and one lime-green).
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 86. Platforma — `box`

```
Photorealistic studio product render of one piece of commercial gym equipment: a sturdy plyometric box (dark wood or dense foam) with a low aerobic step platform beside it.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```

### 87. Kardio — `cardio`

```
Photorealistic studio product render of one piece of commercial gym equipment: a compact group of cardio machines: a treadmill in front, an upright exercise bike and a rowing machine slightly behind it.
Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI. Weight plates and weight stacks have no numbers.
```
