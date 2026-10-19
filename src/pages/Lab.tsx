import * as A from '../data/anims';
import { Figure, poseTimes } from '../components/figure/Figure';
import type { AnimSpec, MuscleId } from '../types';

const LIST: [string, AnimSpec, MuscleId[]][] = [
  ['backSquat', A.backSquat(), ['quads', 'glutes']],
  ['frontSquat', A.frontSquat(), ['quads']],
  ['goblet', A.gobletSquat(), ['quads']],
  ['bwSquat', A.bodyweightSquat(), ['quads']],
  ['hack', A.hackSquat(), ['quads']],
  ['legPress', A.legPress(), ['quads', 'glutes']],
  ['deadlift', A.deadlift(), ['glutes', 'hamstrings', 'lowerBack']],
  ['rdl', A.rdl(), ['hamstrings', 'glutes']],
  ['kbSwing', A.kettlebellSwing(), ['glutes', 'hamstrings']],
  ['backExt', A.backExtension(), ['lowerBack', 'glutes']],
  ['split', A.splitSquat(), ['quads', 'glutes']],
  ['bulgarian', A.bulgarianSplitSquat(), ['quads', 'glutes']],
  ['stepUp', A.stepUp(), ['quads', 'glutes']],
  ['legExt', A.legExtension(), ['quads']],
  ['legCurl', A.legCurl(), ['hamstrings']],
  ['hipThrust', A.hipThrust(), ['glutes']],
  ['bridge', A.gluteBridge(), ['glutes']],
  ['calf', A.calfRaise(), ['calves']],
  ['bench', A.benchPress(), ['chest', 'triceps', 'frontDelts']],
  ['dbBench', A.benchPress('dumbbell'), ['chest']],
  ['incline', A.inclinePress(), ['chest', 'frontDelts']],
  ['machineChest', A.machineChestPress(), ['chest']],
  ['pushUp', A.pushUp(), ['chest', 'triceps']],
  ['dips', A.dips(), ['chest', 'triceps']],
  ['cableFly', A.cableFly(), ['chest']],
  ['pecDeck', A.pecDeck(), ['chest']],
  ['dbFly', A.dumbbellFly(), ['chest']],
  ['ohp', A.overheadPress(), ['frontDelts', 'triceps']],
  ['dbShoulder', A.dumbbellShoulderPress(), ['frontDelts', 'sideDelts']],
  ['machineShoulder', A.machineShoulderPress(), ['frontDelts']],
  ['pike', A.pikePushUp(), ['frontDelts']],
  ['lateral', A.lateralRaise(), ['sideDelts']],
  ['cableLateral', A.lateralRaise('cable'), ['sideDelts']],
  ['facePull', A.facePull(), ['rearDelts', 'upperBack']],
  ['reverseFly', A.reverseFly(), ['rearDelts', 'upperBack']],
  ['bbRow', A.barbellRow(), ['lats', 'upperBack']],
  ['dbRow', A.dumbbellRow(), ['lats', 'upperBack']],
  ['cableRow', A.seatedCableRow(), ['lats', 'upperBack']],
  ['csRow', A.chestSupportedRow(), ['upperBack', 'lats']],
  ['invRow', A.invertedRow(), ['upperBack', 'lats']],
  ['pullUp', A.pullUp(), ['lats', 'biceps']],
  ['chinUp', A.pullUp('chin'), ['lats', 'biceps']],
  ['pulldown', A.latPulldown(), ['lats']],
  ['shrug', A.shrug(), ['traps']],
  ['curl', A.curl('barbell'), ['biceps']],
  ['dbCurl', A.curl('dumbbell'), ['biceps']],
  ['cableCurl', A.curl('cable'), ['biceps']],
  ['inclineCurl', A.inclineCurl(), ['biceps']],
  ['pushdown', A.pushdown(), ['triceps']],
  ['ohExt', A.overheadExtension(), ['triceps']],
  ['skull', A.skullCrusher(), ['triceps']],
  ['benchDip', A.benchDip(), ['triceps']],
  ['plank', A.plank(), ['abs', 'obliques']],
  ['hangLeg', A.hangingLegRaise(), ['abs']],
  ['cableCrunch', A.cableCrunch(), ['abs']],
  ['crunch', A.crunch(), ['abs']],
  ['deadBug', A.deadBug(), ['abs']],
];

export default function Lab() {
  const only = new URLSearchParams(location.search).get('only');
  const items = only ? LIST.filter((l) => only.split(',').includes(l[0])) : LIST;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: 8, background: 'var(--bg)' }}>
      {items.map(([name, spec, prim]) => {
        const [t0, t1] = poseTimes(spec);
        return (
          <div key={name} style={{ background: 'var(--stage)', borderRadius: 10, padding: 4 }}>
            <div style={{ color: '#fff', font: '12px monospace' }}>{name}</div>
            <div style={{ display: 'flex' }}>
              <Figure spec={spec} primary={prim} at={t0} className="lab-fig" />
              <Figure spec={spec} primary={prim} at={t1} className="lab-fig" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
