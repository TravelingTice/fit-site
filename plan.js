const WARMUP_HOME = { name: 'Warm-up · 3 min', items: [['Jumping jacks', '45s'], ['Arm circles', '30s'], ['Bodyweight squats', '10'], ['Inchworms', '5']] };
const WARMUP_GYM = { name: 'Warm-up · 5 min', items: [['Bike or cross-trainer', '5 min easy'], ['Band pull-aparts / arm swings', '15']] };

const T = {
  homeA: l => ({
    kind: 'home', title: 'Push & core', mins: 16 + 3 * l,
    blocks: [WARMUP_HOME, {
      name: `Main · ${2 + l} rounds, 60s rest`, items: [
        ['Push-ups', `${8 + 2 * l}`], ['Pike push-ups', `${5 + l}`], ['Chair dips', `${10 + 2 * l}`],
        ['Plank', `${30 + 10 * l}s`], ['Dead bug', `${6 + 2 * l}/side`]]
    }],
    note: 'Push-ups too easy? Feet on the couch. Too hard? Hands on the table.'
  }),
  homeB: l => ({
    kind: 'home', title: 'Legs & glutes', mins: 15 + 3 * l,
    blocks: [WARMUP_HOME, {
      name: `Main · ${2 + l} rounds, 60s rest`, items: [
        ['Bodyweight squats', `${12 + 3 * l}`], ['Reverse lunges', `${6 + 2 * l}/leg`], ['Glute bridge', `${12 + 3 * l}`],
        ['Wall sit', `${25 + 10 * l}s`], ['Calf raises', '20'], ['Side plank', `${20 + 5 * l}s/side`]]
    }],
    note: 'Slow on the way down, 3 seconds. That makes bodyweight hard.'
  }),
  homeC: l => ({
    kind: 'home', title: 'Full-body circuit', mins: 18 + 4 * l,
    blocks: [WARMUP_HOME, {
      name: `Circuit · ${3 + l} rounds, 90s rest between rounds`, items: [
        ['Push-ups', `${8 + 2 * l}`], ['Squats', '15'], ['Mountain climbers', `${16 + 4 * l}`],
        ['Alternating lunges', '10/leg'], ['Superman hold', '20s'], ['Plank shoulder taps', '16']]
    }],
    note: 'Time it. Next time try to beat it.'
  }),
  mobility: m => ({
    kind: 'mobility', title: 'Mobility', mins: m,
    blocks: [{
      name: 'Flow · move slow, breathe', items: [
        ['Cat-cow', '10'], ["World's greatest stretch", '5/side'], ['Hip flexor stretch', '45s/side'],
        ['Thoracic rotations', '8/side'], ['Deep squat hold', '60s'], ['Doorway chest stretch', '45s'], ['Hamstring fold', '60s']]
    }],
    note: 'Counts as a day. Put a podcast on.'
  }),
  floor: () => ({
    kind: 'floor', title: '10-minute floor', mins: 10,
    blocks: [{ name: '3 rounds', items: [['Push-ups', '12'], ['Squats', '15'], ['Plank', '40s'], ['Hip flexor stretch', '30s/side']] }],
    note: 'The minimum. Do it in front of the TV, done before you think about it.'
  }),
  rest: () => ({ kind: 'rest', title: 'Rest', mins: 0, blocks: [], note: 'Real rest. A walk is a bonus, not homework.' }),
  bike: () => ({
    kind: 'active', title: 'Bike ride', mins: 40,
    blocks: [{ name: 'Last weekend on Dutch roads', items: [['Ride somewhere, podcast in', '30–45 min'], ['Mobility flow when home', '5 min']] }],
    note: 'Too cold or raining? Swap for Home C.'
  }),
  active: () => ({
    kind: 'active', title: 'Pick something fun', mins: 45,
    blocks: [{ name: 'Choose one', items: [['Padel with someone', '60 min'], ['Swim', '20–30 min'], ['Mall walk + podcast', '45 min'], ['Or just the 10-min floor', '10 min']] }],
    note: 'This is the novelty slot. Try something new at least twice this block.'
  }),
};

const FINISH = s => ({ name: `Finisher · ${s} min`, items: [['Incline treadmill walk + podcast', `${s} min, 8–12% incline`]] });

const GYM1 = {
  A: { title: 'Upper A', items: [['Incline DB press', '8–10'], ['Lat pulldown', '10'], ['Cable row', '10'], ['Lateral raise', '15'], ['Curl', '12'], ['Triceps pushdown', '12']] },
  B: { title: 'Lower + core', items: [['Leg press or goblet squat', '10'], ['Romanian deadlift', '10'], ['Walking lunges', '10/leg'], ['Hanging knee raise', '12'], ['Plank', '40s']] },
  C: { title: 'Upper C', items: [['Pull-ups (assisted)', 'max'], ['Seated DB shoulder press', '10'], ['Chest-supported row', '10'], ['Dips or push-ups', 'max'], ['Hammer curl', '12'], ['Overhead triceps extension', '12']] },
};
const GYM2 = {
  A: { title: 'Upper A · block 2', items: [['Flat DB bench', '6–8'], ['Pull-ups', 'max'], ['Arnold press', '10'], ['Single-arm DB row', '10/side'], ['Cable fly', '12'], ['EZ-bar curl', '10']] },
  B: { title: 'Lower + core · block 2', items: [['Bulgarian split squat', '8/leg'], ['Hip thrust', '10'], ['Leg curl', '12'], ['Cable woodchop', '12/side'], ['Farmer carry', '40 m']] },
  C: { title: 'Upper C · block 2', items: [['Incline barbell bench', '6–8'], ['Cable row, wide grip', '8–10'], ['Face pull', '15'], ['Lateral raise drop set', '12+12'], ['Weighted dips', '8'], ['Incline DB curl', '10']] },
};

function gym(block, key, sets, finish, extra) {
  const g = (block === 2 ? GYM2 : GYM1)[key];
  return {
    kind: 'gym', title: g.title, mins: 25 + sets * 8 + finish - 10,
    blocks: [WARMUP_GYM, { name: `Lifts · ${sets} sets each`, items: g.items.map(([n, r]) => [n, `${sets}×${r}`]) }, FINISH(finish)],
    note: extra || (block === 2
      ? 'New exercises, so new numbers. Start lighter than you think and log everything.'
      : 'Add a rep each week. Top of the range on every set → more weight next time.'),
  };
}

const iso = d => d.toLocaleDateString('sv');
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

const START = new Date(2026, 10, 11, 12);
const END = new Date(2027, 0, 15, 12);
const ARRIVE = '2026-11-26';
const BLOCK2 = '2027-01-04';

const FIXED = {
  '2026-11-11': T.homeA(1), '2026-11-12': T.homeB(1), '2026-11-13': T.mobility(10), '2026-11-14': T.homeC(1),
  '2026-11-15': T.rest(), '2026-11-16': T.homeA(2), '2026-11-17': T.homeB(2), '2026-11-18': T.mobility(12),
  '2026-11-19': T.homeC(2), '2026-11-20': T.homeA(2), '2026-11-21': T.bike(), '2026-11-22': T.rest(),
  '2026-11-23': T.homeB(2), '2026-11-24': { ...T.homeC(2), note: 'Last one in the Netherlands. Pack your gym shoes.' },
  '2026-11-25': { kind: 'travel', title: 'Travel day', mins: 0, blocks: [], note: 'Skip. On the plane: stand up and walk every 2 hours, drink water.' },
  '2026-11-26': { ...T.mobility(15), kind: 'mobility', title: 'Landed: easy start', blocks: [...T.mobility(15).blocks, { name: 'Bonus', items: [['Walk to the gym and back, just look around', '20 min']] }], note: 'Shake off the flight. Find the gym, check the equipment, no workout needed.' },
  '2026-11-27': gym(1, 'A', 2, 10, 'First gym session: 2 sets, easy weights. Learn the gym, find your starting numbers.'),
  '2026-11-28': T.floor(), '2026-11-29': T.rest(),
};

const WEEK = ['rest', 'A', 'floor', 'B', 'mobility', 'C', 'active'];

function dayPlan(date) {
  const k = iso(date);
  if (FIXED[k]) return { ...FIXED[k] };
  const slot = WEEK[date.getDay()];
  const block = k >= BLOCK2 ? 2 : 1;
  const light = k >= '2026-12-28' && k < BLOCK2;
  const firstWeek = k < '2026-12-07';
  if ('ABC'.includes(slot)) {
    const p = gym(block, slot, light || firstWeek ? 2 : 3, light ? 10 : firstWeek ? 12 : 15);
    if (light) p.note = 'Lighter week before block 2: 2 sets, leave 3 reps in the tank. Holidays allowed.';
    return p;
  }
  return slot === 'mobility' ? T.mobility(12) : T[slot]();
}

const CHECKIN = {
  '2026-11-11': 'Baseline check-in: 3 photos (front, side, back), waist at the navel, weight. Send it to your person.',
  '2026-12-01': 'Monthly check-in: same photos, same spot, waist, weight, best incline DB press ×8. Send it.',
  '2027-01-01': 'Monthly check-in: photos, waist, weight, best incline DB press ×8. Compare with Nov 11.',
};

const NOTES = {
  '2027-01-01': 'Make the post-baby plan this week. Baby is due Jan 30, so plan for 2× 30 min gym + the 10-min floor.',
  '2027-01-15': 'Last day of this plan. Have the new one ready before the baby comes.',
};

const PLAN = [];
for (let d = new Date(START); d <= END; d = addDays(d, 1)) {
  const k = iso(d);
  const p = dayPlan(d);
  const place = k === '2026-11-25' ? 'In transit' : k < ARRIVE ? 'Home · Netherlands' : p.kind === 'gym' ? 'Gym · Jakarta' : 'Jakarta';
  PLAN.push({ date: k, d: new Date(d), place, checkin: CHECKIN[k], extra: NOTES[k], ...p });
}
