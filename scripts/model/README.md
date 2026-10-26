# 3D mushak modelini qayta yaratish

Manba: Z-Anatomy (CC BY-SA 4.0) — `https://github.com/Z-Anatomy/Models-of-human-anatomy` dagi `Z-Anatomy.zip` (ichida `Startup.blend`).

1. Blender Python moduli: `uv venv bvenv && uv pip install --python bvenv/bin/python bpy==5.2.2`
2. Mushaklarni kalitlar bo'yicha guruhlash va soddalashtirish (xom massivlar):
   `bvenv/bin/python scripts/model/za_export.py <Startup.blend> <chiqish-papka>`
3. GLB yig'ish — siyrak mushaklarni Loop usulida silliqlash, tola yo'nalishi va atrof soyasini (ambient occlusion, nurlar bilan ~3 daqiqa) yozish
   (alohida papkada `npm i @gltf-transform/core@4 @gltf-transform/extensions@4 @gltf-transform/functions@4 meshoptimizer@0.22 three@0.180 three-mesh-bvh@0.9`):
   `node scripts/model/build-glb.mjs <chiqish-papka> public/models/muscles-v2.glb`

Kalitlar `src/data/muscles3d.ts` dagi `M3` turiga mos bo'lishi kerak (testlar tekshiradi).
