/**
 * The Lottie plugin's built-in animations. Each one is drawn in code from a single colour,
 * so it can be recoloured to the project's theme (and again from the right panel) without
 * storing the whole animation: a placed preset keeps only its id and colour.
 */

export type LottieJson = Record<string, unknown>;

/**
 * A Lottie animation placed on the canvas: either a built-in preset (drawn in the object's
 * colour) or an imported file, kept as its JSON text.
 */
export type LottieSpec = {
  preset?: string;
  json?: string;
  /** A library animation's link (see lottie-library.ts); loaded when shown, not saved. */
  src?: string;
  loop?: boolean;
  /** Playback speed, 1 = normal. */
  speed?: number;
};

export type LottiePreset = {
  id: string;
  name: string;
  /** Words matched by the plugin's search box. */
  tags: string;
  /** Shown at this size on the canvas. */
  w: number;
  h: number;
  /** The colour it is drawn in by default; `undefined` uses the project's brand colour. */
  color?: string;
  build: (color: string) => LottieJson;
};

/* --------------------------------- Colours --------------------------------- */

type Rgb = [number, number, number];

function toRgb(hex: string): Rgb {
  let value = hex.trim().replace('#', '');
  if (value.length === 3) value = value.split('').map((c) => c + c).join('');
  const n = Number.parseInt(value.slice(0, 6), 16);
  if (!Number.isFinite(n)) return [0, 0.25, 0.87];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** `color` moved `amount` (0-1) of the way towards `other`. */
function mix(color: Rgb, other: Rgb, amount: number): Rgb {
  return color.map((c, i) => c + (other[i] - c) * amount) as Rgb;
}

const WHITE: Rgb = [1, 1, 1];
const BLACK: Rgb = [0, 0, 0];
const GOLD = toRgb('#F5C451');
const GREEN = toRgb('#12A37A');

/* ------------------------------ Lottie helpers ------------------------------ */

type Value = number | number[];
type Ease = 'inOut' | 'out' | 'in' | 'linear' | 'back' | 'hold';
/** A keyframe: [frame, value, easing towards the next keyframe]. */
type Key = [number, Value, Ease?];
type Prop = { a: 0; k: unknown } | { a: 1; k: unknown[] };

const EASES: Record<Exclude<Ease, 'hold'>, [number, number, number, number]> = {
  inOut: [0.65, 0, 0.35, 1],
  out: [0.22, 1, 0.36, 1],
  in: [0.55, 0, 1, 0.45],
  linear: [0, 0, 1, 1],
  back: [0.34, 1.56, 0.64, 1],
};

const fixed = (value: unknown): Prop => ({ a: 0, k: value });

function anim(keys: Key[]): Prop {
  return {
    a: 1,
    k: keys.map(([t, value, ease = 'inOut'], index) => {
      const s = Array.isArray(value) ? value : [value];
      if (index === keys.length - 1) return { t, s };
      if (ease === 'hold') return { t, s, h: 1 };
      const [x1, y1, x2, y2] = EASES[ease];
      const fill = (n: number) => s.map(() => n);
      return { t, s, o: { x: fill(x1), y: fill(y1) }, i: { x: fill(x2), y: fill(y2) } };
    }),
  };
}

const prop = (value: Value | Key[]): Prop =>
  Array.isArray(value) && Array.isArray(value[0]) ? anim(value as Key[]) : fixed(value);

const rgba = (c: Rgb) => [...c, 1];

const ellipse = (size: Value | Key[], position: number[] = [0, 0]) =>
  ({ ty: 'el', d: 1, p: fixed(position), s: prop(typeof size === 'number' ? [size, size] : size) });

const rect = (w: number, h: number, radius = 0, position: number[] = [0, 0]) =>
  ({ ty: 'rc', d: 1, p: fixed(position), s: fixed([w, h]), r: fixed(radius) });

/** A path through `points`; `curves` gives [in, out] tangents (relative) per point. */
function path(points: number[][], closed = false, curves?: [number[], number[]][]) {
  return {
    ty: 'sh',
    d: 1,
    ks: fixed({
      v: points,
      i: points.map((_, i) => curves?.[i]?.[0] ?? [0, 0]),
      o: points.map((_, i) => curves?.[i]?.[1] ?? [0, 0]),
      c: closed,
    }),
  };
}

const fill = (color: Rgb, opacity: Value | Key[] = 100) =>
  ({ ty: 'fl', c: fixed(rgba(color)), o: prop(opacity), r: 1 });

const stroke = (color: Rgb, width: number, opacity: Value | Key[] = 100) =>
  ({ ty: 'st', c: fixed(rgba(color)), o: prop(opacity), w: fixed(width), lc: 2, lj: 2, ml: 4 });

const trim = (end: Value | Key[], start: Value | Key[] = 0) =>
  ({ ty: 'tm', s: prop(start), e: prop(end), o: fixed(0), m: 1 });

type Transform = {
  p?: Value | Key[]; a?: Value | Key[]; s?: Value | Key[]; r?: Value | Key[]; o?: Value | Key[];
};

function group(items: unknown[], t: Transform = {}) {
  return {
    ty: 'gr',
    it: [
      ...items,
      {
        ty: 'tr',
        p: prop(t.p ?? [0, 0]),
        a: prop(t.a ?? [0, 0]),
        s: prop(t.s ?? [100, 100]),
        r: prop(t.r ?? 0),
        o: prop(t.o ?? 100),
        sk: fixed(0),
        sa: fixed(0),
      },
    ],
  };
}

/** A whole animation: `layers` are lists of shapes, drawn first-on-top, centred in the frame. */
function scene(
  name: string,
  w: number,
  h: number,
  frames: number,
  layers: { shapes: unknown[]; t?: Transform }[],
): LottieJson {
  return {
    v: '5.7.4',
    nm: name,
    fr: 60,
    ip: 0,
    op: frames,
    w,
    h,
    ddd: 0,
    assets: [],
    layers: layers.map((layer, index) => {
      const t = layer.t ?? {};
      const position = t.p ?? [w / 2, h / 2, 0];
      return {
        ddd: 0,
        ind: index + 1,
        ty: 4,
        nm: `${name} ${index + 1}`,
        sr: 1,
        ao: 0,
        ip: 0,
        op: frames,
        st: 0,
        bm: 0,
        ks: {
          o: prop(t.o ?? 100),
          r: prop(t.r ?? 0),
          p: prop(position),
          a: prop(t.a ?? [0, 0, 0]),
          s: prop(t.s ?? [100, 100, 100]),
        },
        shapes: layer.shapes,
      };
    }),
  };
}

/* --------------------------------- Presets --------------------------------- */

function success(hex: string) {
  const c = toRgb(hex);
  return scene('Payment confirmed', 200, 200, 130, [
    {
      shapes: [group([
        group([path([[-30, 2], [-8, 24], [34, -20]]), stroke(c, 11), trim([[22, 0, 'out'], [46, 100]])]),
        group([ellipse(150), stroke(c, 8), trim([[0, 0, 'out'], [30, 100]])]),
        group([ellipse(150), fill(c, 14)], { s: [[0, [0, 0], 'back'], [20, [100, 100]]] }),
      ], { s: [[46, [100, 100]], [54, [108, 108]], [64, [100, 100]]] })],
    },
  ]);
}

function failure(hex: string) {
  const c = toRgb(hex);
  return scene('Payment failed', 200, 200, 130, [
    {
      t: { p: [[50, [100, 100, 0], 'linear'], [55, [92, 100, 0], 'linear'], [60, [108, 100, 0], 'linear'], [65, [95, 100, 0], 'linear'], [70, [104, 100, 0], 'linear'], [75, [100, 100, 0]]] },
      shapes: [
        group([path([[-24, -24], [24, 24]]), stroke(c, 11), trim([[24, 0, 'out'], [40, 100]])]),
        group([path([[24, -24], [-24, 24]]), stroke(c, 11), trim([[32, 0, 'out'], [48, 100]])]),
        group([ellipse(150), stroke(c, 8), trim([[0, 0, 'out'], [30, 100]])]),
        group([ellipse(150), fill(c, 12)], { s: [[0, [0, 0], 'back'], [20, [100, 100]]] }),
      ],
    },
  ]);
}

function spinner(hex: string) {
  const c = toRgb(hex);
  return scene('Loading spinner', 200, 200, 70, [
    {
      t: { r: [[0, 0, 'linear'], [70, 360]] },
      shapes: [group([ellipse(120), stroke(c, 12), trim([[0, 14], [35, 62], [70, 14]])])],
    },
    { shapes: [group([ellipse(120), stroke(c, 12, 16)])] },
  ]);
}

function dots(hex: string) {
  const c = toRgb(hex);
  const dot = (x: number, delay: number) => group([ellipse(26), fill(c)], {
    p: [[0, [x, 0], 'hold'], [delay, [x, 0], 'out'], [delay + 12, [x, -22], 'inOut'], [delay + 26, [x, 0], 'hold'], [64, [x, 0]]],
    o: [[0, 45, 'hold'], [delay, 45, 'out'], [delay + 12, 100, 'inOut'], [delay + 26, 45, 'hold'], [64, 45]],
  });
  return scene('Loading dots', 200, 120, 64, [{ shapes: [dot(-40, 0), dot(0, 8), dot(40, 16)] }]);
}

function cardFlip(hex: string) {
  const c = toRgb(hex);
  const flip: Key[] = [
    [0, [100, 100, 100], 'hold'], [40, [100, 100, 100], 'in'], [54, [0, 100, 100], 'out'],
    [68, [100, 100, 100], 'hold'], [112, [100, 100, 100], 'in'], [126, [0, 100, 100], 'out'], [140, [100, 100, 100]],
  ];
  const front: Key[] = [[0, 100, 'hold'], [54, 0, 'hold'], [126, 100, 'hold'], [150, 100]];
  const back: Key[] = [[0, 0, 'hold'], [54, 100, 'hold'], [126, 0, 'hold'], [150, 0]];
  const numberDots = [-62, -26, 10, 46].map((x) => group([rect(28, 6, 3, [x, 18]), fill(WHITE, 75)]));
  return scene('Card flip', 240, 170, 150, [
    {
      t: { s: flip, o: front },
      shapes: [
        group([ellipse(24, [58, 34]), fill(WHITE, 55)]),
        group([ellipse(24, [74, 34]), fill(WHITE, 35)]),
        ...numberDots,
        group([rect(30, 22, 5, [-58, -16]), fill(GOLD)]),
        group([rect(184, 118, 14), fill(c)]),
      ],
    },
    {
      t: { s: flip, o: back },
      shapes: [
        group([rect(30, 20, 4, [50, 12]), fill(WHITE, 90)]),
        group([rect(100, 20, 4, [-30, 12]), fill(WHITE)]),
        group([rect(184, 24, 0, [0, -26]), fill(mix(c, BLACK, 0.75))]),
        group([rect(184, 118, 14), fill(mix(c, BLACK, 0.3))]),
      ],
    },
  ]);
}

function coin(hex: string) {
  const c = toRgb(hex);
  const spin: Key[] = [[0, [100, 100], 'inOut'], [30, [0, 100], 'inOut'], [60, [-100, 100], 'inOut'], [90, [0, 100], 'inOut'], [120, [100, 100]]];
  return scene('Coin spin', 200, 200, 120, [
    {
      shapes: [group([
        group([rect(10, 44, 5), fill(WHITE, 90)]),
        group([ellipse(84), stroke(WHITE, 6, 45)]),
        group([ellipse(124), fill(c)]),
        group([ellipse(124, [6, 0]), fill(mix(c, BLACK, 0.35))]),
      ], { p: [0, -8], s: spin })],
    },
    {
      shapes: [group([ellipse([120, 16], [0, 76]), fill(BLACK, 10)], {
        s: [[0, [100, 100], 'inOut'], [30, [45, 100], 'inOut'], [60, [100, 100], 'inOut'], [90, [45, 100], 'inOut'], [120, [100, 100]]],
      })],
    },
  ]);
}

function pulse(hex: string) {
  const c = toRgb(hex);
  const ring = (start: number) => group([ellipse(100), stroke(c, 4)], {
    s: [[0, [40, 40], 'hold'], [start, [40, 40], 'out'], [start + 60, [170, 170], 'hold'], [120, [170, 170]]],
    o: [[0, 0, 'hold'], [start, 80, 'out'], [start + 60, 0, 'hold'], [120, 0]],
  });
  return scene('Live pulse', 200, 200, 120, [
    { shapes: [group([ellipse(40), fill(c)], { s: [[0, [100, 100]], [15, [112, 112]], [30, [100, 100], 'hold'], [120, [100, 100]]] })] },
    { shapes: [ring(0), ring(40)] },
  ]);
}

function progress(hex: string) {
  const c = toRgb(hex);
  return scene('Progress bar', 240, 60, 130, [
    {
      shapes: [group([rect(200, 14, 7, [100, 0]), fill(c)], {
        p: [-100, 0],
        s: [[0, [0, 100], 'inOut'], [90, [100, 100], 'hold'], [116, [100, 100], 'hold'], [117, [0, 100], 'hold'], [130, [0, 100]]],
        o: [[0, 100, 'hold'], [100, 100, 'linear'], [116, 0, 'hold'], [117, 100, 'hold'], [130, 100]],
      })],
    },
    { shapes: [group([rect(200, 14, 7), fill(c, 16)])] },
  ]);
}

function clock(hex: string) {
  const c = toRgb(hex);
  return scene('Pending clock', 200, 200, 120, [
    { shapes: [group([ellipse(14), fill(c)])] },
    { shapes: [group([path([[0, 0], [0, -46]]), stroke(c, 7)], { r: [[0, 0, 'linear'], [120, 360]] })] },
    { shapes: [group([path([[0, 0], [0, -28]]), stroke(c, 9)], { r: [[0, 0, 'linear'], [120, 30]] })] },
    { shapes: [group([ellipse(140), stroke(c, 9)]), group([ellipse(140), fill(c, 10)])] },
  ]);
}

function lock(hex: string) {
  const c = toRgb(hex);
  const shackle = path([[-28, 0], [-28, -26], [28, -26], [28, 0]], false, [
    [[0, 0], [0, 0]], [[0, 0], [0, -38]], [[0, -38], [0, 0]], [[0, 0], [0, 0]],
  ]);
  return scene('Secure lock', 200, 200, 130, [
    {
      t: { s: [[0, [100, 100, 100], 'hold'], [38, [100, 100, 100]], [44, [94, 94, 100]], [56, [100, 100, 100], 'hold'], [130, [100, 100, 100]]] },
      shapes: [
        group([rect(7, 18, 3.5, [0, 34]), fill(WHITE)]),
        group([ellipse(18, [0, 24]), fill(WHITE)]),
        group([rect(100, 78, 16, [0, 30]), fill(c)]),
        group([shackle, stroke(mix(c, BLACK, 0.25), 13)], {
          p: [[0, [0, -18], 'hold'], [20, [0, -18], 'back'], [38, [0, -6], 'hold'], [104, [0, -6], 'inOut'], [120, [0, -18], 'hold'], [130, [0, -18]]],
        }),
      ],
    },
  ]);
}

function growth(hex: string) {
  const c = toRgb(hex);
  const bars = [[-75, 40], [-35, 64], [5, 88], [45, 120]].map(([x, h], i) => group([rect(26, h, 5, [0, -h / 2]), fill(c, 22)], {
    p: [x, 70],
    s: [[0, [100, 0], 'hold'], [i * 8, [100, 0], 'out'], [i * 8 + 26, [100, 100], 'hold'], [150, [100, 100]]],
  }));
  const line = group([
    path([[-90, 34], [-58, 12], [-20, 0], [18, -26], [60, -58]]),
    stroke(c, 6),
    trim([[0, 0, 'hold'], [24, 0, 'inOut'], [70, 100], [150, 100]]),
  ]);
  const head = group([path([[44, -60], [62, -60], [62, -42]]), stroke(c, 6)], {
    o: [[0, 0, 'hold'], [66, 0, 'out'], [74, 100], [150, 100]],
  });
  return scene('Growth chart', 240, 180, 150, [
    {
      t: { o: [[0, 100, 'hold'], [128, 100, 'linear'], [146, 0], [150, 0]] },
      shapes: [head, line, ...bars, group([path([[-100, 72], [100, 72]]), stroke(c, 3, 25)])],
    },
  ]);
}

function transfer(hex: string) {
  const c = toRgb(hex);
  const light = mix(c, WHITE, 0.82);
  const wallet = (x: number, arrive: number | null) => group([
    group([rect(26, 18, 4, [4, 0]), fill(c)]),
    group([ellipse(64), fill(light)]),
  ], {
    p: [x, 10],
    s: arrive === null
      ? [100, 100]
      : [[0, [100, 100], 'hold'], [arrive, [100, 100], 'out'], [arrive + 8, [114, 114], 'inOut'], [arrive + 20, [100, 100], 'hold'], [120, [100, 100]]],
  });
  const travel: Key[] = [[0, [-70, 10], 'hold'], [14, [-70, 10], 'inOut'], [36, [0, -42], 'inOut'], [58, [70, 10], 'hold'], [120, [70, 10]]];
  return scene('Money transfer', 240, 160, 120, [
    {
      shapes: [group([ellipse(22), fill(GOLD), stroke(mix(GOLD, BLACK, 0.2), 3)], {
        p: travel,
        o: [[0, 0, 'hold'], [10, 0, 'out'], [16, 100, 'hold'], [58, 100, 'out'], [62, 0, 'hold'], [120, 0]],
      })],
    },
    {
      shapes: [
        wallet(-70, null),
        wallet(70, 56),
        group([path([[-38, 4], [0, -26], [38, 4]], false, [[[0, 0], [12, -14]], [[-20, 0], [20, 0]], [[-12, -14], [0, 0]]]), stroke(c, 3, 25)]),
      ],
    },
  ]);
}

function celebrate(hex: string) {
  const c = toRgb(hex);
  const palette = [c, mix(c, WHITE, 0.45), GOLD, GREEN];
  const pieces = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2 - Math.PI / 2;
    const reach = 62 + (i % 3) * 14;
    const x = Math.round(Math.cos(angle) * reach);
    const y = Math.round(Math.sin(angle) * reach);
    const shape = i % 2 === 0 ? rect(9, 15, 2) : ellipse(10);
    return group([shape, fill(palette[i % palette.length])], {
      p: [[0, [0, 0], 'out'], [36, [x, y], 'in'], [90, [x, y + 34]], [120, [x, y + 34]]],
      r: [[0, 0, 'linear'], [90, i % 2 ? 300 : -300], [120, i % 2 ? 300 : -300]],
      o: [[0, 0, 'out'], [6, 100, 'hold'], [62, 100, 'linear'], [90, 0, 'hold'], [120, 0]],
    });
  });
  return scene('Celebration', 220, 220, 120, [
    { shapes: pieces },
    {
      shapes: [group([ellipse(60), stroke(c, 5)], {
        s: [[0, [20, 20], 'out'], [30, [200, 200], 'hold'], [120, [200, 200]]],
        o: [[0, 90, 'out'], [30, 0, 'hold'], [120, 0]],
      })],
    },
  ]);
}

export const LOTTIE_PRESETS: LottiePreset[] = [
  { id: 'success', name: 'Payment confirmed', tags: 'success tick check done complete approved payment', w: 120, h: 120, color: '#12A37A', build: success },
  { id: 'failure', name: 'Payment failed', tags: 'error failed cross declined rejected warning', w: 120, h: 120, color: '#E5484D', build: failure },
  { id: 'spinner', name: 'Loading spinner', tags: 'loading spinner wait processing busy', w: 64, h: 64, build: spinner },
  { id: 'dots', name: 'Loading dots', tags: 'loading dots typing wait processing', w: 90, h: 54, build: dots },
  { id: 'card-flip', name: 'Card flip', tags: 'card flip debit credit cvv bank', w: 200, h: 142, build: cardFlip },
  { id: 'coin', name: 'Coin spin', tags: 'coin money cash spin reward cashback', w: 110, h: 110, color: '#E8A90C', build: coin },
  { id: 'transfer', name: 'Money transfer', tags: 'transfer send payment money wallet p2p', w: 200, h: 134, build: transfer },
  { id: 'pulse', name: 'Live pulse', tags: 'pulse live radar scanning notification', w: 110, h: 110, build: pulse },
  { id: 'progress', name: 'Progress bar', tags: 'progress bar upload loading kyc steps', w: 220, h: 56, build: progress },
  { id: 'clock', name: 'Pending clock', tags: 'pending clock time waiting scheduled', w: 110, h: 110, color: '#E8890C', build: clock },
  { id: 'lock', name: 'Secure lock', tags: 'lock secure security padlock locked privacy', w: 110, h: 110, build: lock },
  { id: 'growth', name: 'Growth chart', tags: 'growth chart graph investing savings analytics', w: 200, h: 150, build: growth },
  { id: 'celebrate', name: 'Celebration', tags: 'celebration confetti party reward goal success', w: 140, h: 140, build: celebrate },
];

export const findLottiePreset = (id: string | undefined) => LOTTIE_PRESETS.find((preset) => preset.id === id);

/** The animation to play for a placed Lottie (null if its file can't be read). */
export function lottieDataFor(spec: LottieSpec, color?: string): LottieJson | null {
  const preset = findLottiePreset(spec.preset);
  if (preset) return preset.build(color ?? preset.color ?? '#0040DF');
  if (!spec.json) return null;
  try {
    const data = JSON.parse(spec.json) as unknown;
    return lottieProblem(data) ? null : (data as LottieJson);
  } catch {
    return null;
  }
}

/* ------------------------------ Imported files ------------------------------ */

/** Largest Lottie file that can be imported (it is saved with the project, in the browser). */
export const MAX_LOTTIE_BYTES = 400_000;

/** Checks that parsed JSON looks like a Lottie animation; returns why it doesn't, or null. */
export function lottieProblem(data: unknown): string | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return "This file isn't a Lottie animation.";
  const json = data as Record<string, unknown>;
  const numbers = ['w', 'h', 'fr', 'ip', 'op'].every((key) => typeof json[key] === 'number');
  if (!numbers || !Array.isArray(json.layers)) return "This file isn't a Lottie animation.";
  if ((json.w as number) <= 0 || (json.h as number) <= 0) return 'This animation has no size.';
  if (Array.isArray(json.assets) && json.assets.some((asset) => {
    const a = asset as Record<string, unknown>;
    return typeof a.p === 'string' && !a.p.startsWith('data:') && a.e !== 1 && !a.layers;
  })) {
    return 'This animation links to separate image files. Export it with images embedded.';
  }
  return null;
}
