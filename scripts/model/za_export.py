# Z-Anatomy (CC BY-SA 4.0) -> Kachok GLB: mushaklar kalit bo'yicha birlashtiriladi, soddalashtiriladi, suyaklar bitta mesh.
import bpy, bmesh, re, sys, json

src, out = sys.argv[-2], sys.argv[-1]
bpy.ops.wm.open_mainfile(filepath=src)

MAP = {
    'pecUpper': ['Clavicular head of pectoralis major muscle'],
    'pecMid': ['Sternocostal head of pectoralis major muscle'],
    'pecLower': ['(Abdominal part of pectoralis major muscle)'],
    'deltAnt': ['Clavicular part of deltoid muscle'],
    'deltLat': ['Acromial part of deltoid muscle'],
    'deltPost': ['Scapular spinal part of deltoid muscle'],
    'trapUpper': ['Descending part of trapezius muscle'],
    'trapMid': ['Transverse part of trapezius muscle'],
    'trapLower': ['Ascending part of trapezius muscle'],
    'rhomboids': ['Rhomboid major muscle', 'Rhomboid minor muscle'],
    'lats': ['Latissimus dorsi muscle'],
    'teresMajor': ['Teres major muscle'],
    'infraspinatus': ['Infraspinatus muscle', 'Teres minor muscle'],
    'serratus': ['Serratus anterior muscle'],
    'erectors': ['Iliocostalis lumborum muscle', 'Iliocostalis thoracis muscle', 'Iliocostalis colli muscle',
                 'Longissimus thoracis muscle', 'Longissimus colli muscle', 'Longissimus capitis muscle',
                 'Spinalis thoracis muscle', 'Spinalis colli muscle', 'Spinalis capitis muscle',
                 'Multifidus lumborum muscle', 'Multifidus thoracis muscle'],
    'rectusAbdominis': ['Rectus abdominis muscle', 'Pyramidalis muscle'],
    'externalOblique': ['External abdominal oblique muscle', 'Internal abdominal oblique muscle'],
    'biceps': ['Long head of biceps brachii', 'Short head of biceps brachii'],
    'brachialis': ['Brachialis muscle'],
    'brachioradialis': ['Brachioradialis muscle'],
    'tricepsLong': ['Long head of triceps brachii'],
    'tricepsLateral': ['Lateral head of triceps brachii'],
    'tricepsMedial': ['Medial head of triceps brachii', 'Anconeus muscle'],
    'forearmFlexors': ['Flexor carpi radialis', 'Palmaris longus muscle', 'Humeral head of flexor carpi ulnaris', 'Ulnar head of flexor carpi ulnaris',
                       'Humero-ulnar head of flexor digitorum superficialis', 'Radial head of flexor digitorum superficialis', 'Flexor digitorum profundus',
                       'Flexor pollicis longus', 'Superficial head of pronator teres', 'Deep head of pronator teres', 'Pronator quadratus'],
    'forearmExtensors': ['Extensor carpi radialis longus', 'Extensor carpi radialis brevis', 'Extensor digitorum', 'Extensor digiti minimi',
                         'Humeral head of extensor carpi ulnaris', 'Ulnar head of extensor carpi ulnaris', 'Extensor indicis', 'Abductor pollicis longus',
                         'Extensor pollicis brevis', 'Extensor pollicis longus', 'Supinator'],
    'gluteMax': ['Gluteus maximus muscle'],
    'gluteMed': ['Gluteus medius muscle', 'Gluteus minimus muscle'],
    'rectusFemoris': ['Rectus femoris muscle'],
    'vastusLateralis': ['Vastus lateralis muscle'],
    'vastusMedialis': ['Vastus medialis muscle'],
    'bicepsFemoris': ['Long head of biceps femoris', 'Short head of biceps femoris'],
    'medialHamstrings': ['Semitendinosus muscle', 'Semimembranosus muscle'],
    'adductors': ['Adductor magnus', 'Adductor longus', 'Adductor brevis', '(Adductor minimus)', 'Gracilis muscle', 'Pectineus muscle'],
    'gastrocnemius': ['Medial head of gastrocnemius', 'Lateral head of gastrocnemius'],
    'soleus': ['Soleus muscle'],
    'tibialisAnterior': ['Tibialis anterior muscle'],
    'iliopsoas': ['Psoas major', 'Iliacus muscle'],
}
TENDON = ['Iliotibial tract', 'Calcaneal tendon']
# ko'rinmaydigan yoki mashg'ulotga aloqasi yo'q mayda/chuqur tuzilmalar
SKIP = re.compile(r'bursa|fascia|retinacul|sheath|septum|aponeuros|ligament|tarsus|trochlea|tendinous ring|arch|tendon|intercostal|transversus|multifidus colli|rotatores|interspin|intertransvers|levatores|'
                  r'rectus muscle|oblique muscle$|levator palpebrae|arytenoid|cricothyroid|constrictor|pharyngeus|glossus|digastric|hyoid|thyroid|'
                  r'coccygeus|pubo|anal sphincter|gemellus|obturator|quadratus femoris|piriformis|pterygoid|vastus intermedius|tibialis posterior|'
                  r'flexor digitorum longus|flexor hallucis longus|popliteus|subscapularis|supraspinatus|subclavius|pectoralis minor|serratus posterior|'
                  r'quadratus lumborum|semispinalis|splenius colli|longus c|rectus .*capitis|obliquus .*capitis|scalenus|iliocostalis colli$', re.I)

name_to_key = {n: k for k, ns in MAP.items() for n in ns}
for n in TENDON:
    name_to_key[n] = 'tendon'

mus_col = bpy.data.collections['4: Muscular system']
groups = {}
missing = set(name_to_key)
for o in mus_col.all_objects:
    if o.type != 'MESH' or not len(o.data.polygons):
        continue
    m = re.match(r'^(.*)\.(l|r)$', o.name)
    base = m.group(1) if m else o.name
    if base in name_to_key:
        key = name_to_key[base]
        missing.discard(base)
    elif m and not SKIP.search(base):
        key = 'other'
    else:
        continue
    groups.setdefault(key, []).append(o)

bone_col = bpy.data.collections['1: Skeletal system']
groups['bones'] = [o for o in bone_col.all_objects if o.type == 'MESH' and len(o.data.polygons) and not o.name.endswith('.g')]

def tris_of(objs):
    return sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in objs)

BUDGET = {'other': 55000, 'bones': 55000, 'tendon': 5000}
mapped_total = sum(tris_of(v) for k, v in groups.items() if k not in BUDGET)
MAPPED_BUDGET = 260000
report = {'missing': sorted(missing), 'groups': {}}

import numpy as np, os
os.makedirs(out, exist_ok=True)
# barcha obyektlarga bir marta decimate qo'yib, sahnani bir marta hisoblaymiz
ratios = {}
for key, objs in groups.items():
    total = tris_of(objs)
    # kalit bo'yicha maqsad: yengil mushaklar to'liq qoladi, og'irlari 6–14 ming uchburchakgacha
    target = BUDGET[key] if key in BUDGET else min(total, max(6000, min(14000, total * 0.3)))
    ratio = min(1.0, target / total)
    ratios[key] = ratio
    for o in objs:
        mod = o.modifiers.new('dec', 'DECIMATE')
        mod.decimate_type = 'COLLAPSE'
        mod.ratio = ratio
        mod.use_collapse_triangulate = True
dg = bpy.context.evaluated_depsgraph_get()
dg.update()
manifest = {}
for key, objs in groups.items():
    P, I, off = [], [], 0
    for o in objs:
        ev = o.evaluated_get(dg)
        me = ev.to_mesh()
        me.calc_loop_triangles()
        n = len(me.vertices)
        co = np.empty(n * 3, dtype=np.float32)
        me.vertices.foreach_get('co', co)
        co = co.reshape(-1, 3)
        M = np.array(o.matrix_world, dtype=np.float64)
        co = (np.c_[co, np.ones(n)] @ M.T)[:, :3]
        tri = np.empty(len(me.loop_triangles) * 3, dtype=np.int64)
        me.loop_triangles.foreach_get('vertices', tri)
        ev.to_mesh_clear()
        P.append(co.astype(np.float32)); I.append(tri + off); off += n
    P = np.concatenate(P); I = np.concatenate(I).astype(np.uint32)
    P.tofile(os.path.join(out, key + '.pos')); I.tofile(os.path.join(out, key + '.idx'))
    manifest[key] = {'verts': int(len(P)), 'tris': int(len(I) // 3), 'parts': len(objs), 'srcTris': tris_of(objs), 'ratio': ratios[key],
                     'names': sorted(set(re.sub(r'\.(l|r)$', '', o.name) for o in objs))}
    print(key, len(objs), tris_of(objs), '->', len(I) // 3, flush=True)
json.dump({'missing': sorted(missing), 'groups': manifest}, open(os.path.join(out, 'manifest.json'), 'w'), indent=1)
print('MISSING', sorted(missing))
