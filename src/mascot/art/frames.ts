import type { GestureName } from '../gestures'
import type { SpriteFrame } from '../sprite'
import { type Layer, type Part, paint } from './canvas'

export type HeadVariant = 'open' | 'closed' | 'twitch' | 'lick' | 'back'

export type HeadPlacement = {
  readonly variant: HeadVariant
  readonly x: number
  readonly y: number
}

export type Pose = {
  readonly behind: readonly Layer[]
  readonly front: readonly Layer[]
  readonly head: HeadPlacement
  readonly after?: readonly Layer[]
  readonly shiftX?: number
}

const heads: Readonly<Record<HeadVariant, Part>> = {
  open: [
    'f.........f',
    'ff.......ff',
    'fnf.....fnf',
    'fnfffgfffnf',
    'ffffgfgffff',
    'ffepfffepff',
    'ffepfffepff',
    'hffwwnwwffh',
    'ffwwowowwff',
    '.fwwwwwwwf.',
  ],
  closed: [
    'f.........f',
    'ff.......ff',
    'fnf.....fnf',
    'fnfffgfffnf',
    'ffffgfgffff',
    'fffffffffff',
    'ffoofffooff',
    'hffwwnwwffh',
    'ffwwowowwff',
    '.fwwwwwwwf.',
  ],
  twitch: [
    '..........f',
    'f........ff',
    'ff......fnf',
    'fnfffgfffnf',
    'ffffgfgffff',
    'ffepfffepff',
    'ffepfffepff',
    'hffwwnwwffh',
    'ffwwowowwff',
    '.fwwwwwwwf.',
  ],
  lick: [
    'f.........f',
    'ff.......ff',
    'fnf.....fnf',
    'fnfffgfffnf',
    'ffffgfgffff',
    'fffffffffff',
    'ffoofffooff',
    'hffwwnwwffh',
    'ffwwwowwwff',
    '.fwwwnnwwf.',
  ],
  back: [
    'f.........f',
    'ff.......ff',
    'fgf.....fgf',
    'fgfffffffgf',
    'ffgfgfgfgff',
    'fffffffffff',
    'ffffgfgffff',
    'fffffffffff',
    'hffffffffff',
    '.fffffffff.',
  ],
}

export const headPart = (variant: HeadVariant): Part => heads[variant]

const nearLeg = (length: number): Part => [
  ...Array.from({ length: length - 2 }, () => 'ff'),
  'ww',
  'ww',
]

const farLeg = (length: number): Part => [
  ...Array.from({ length: length - 2 }, () => 'gg'),
  'xx',
  'xx',
]

const standTorso: Part = [
  '...fgffgfffffff....',
  '.fffgffgffffffffff.',
  'ffffffffffffffffwww',
  'hfffffffffffffffwww',
  'fffffffffffffffwwww',
  'gffffffffffffffwwww',
  '.gffwwwwwwwwwwwwww.',
  '..ggwwwwwwwwwwwww..',
]

const standCape: Part = [
  '......cccccccc',
  '...cccccdccccc',
  '.ccccdcccdcccc',
  'cccdcccdcccccc',
  'rrrrrrrrrrrr..',
]

const standTail: Part = [
  '.ff..',
  'fg...',
  'ff...',
  'ff...',
  'gf...',
  'ff...',
  'ff...',
  'fg...',
  'ff...',
  'fff..',
  '.fff.',
  '..fff',
]

const flickTail: Part = [
  '..ff.',
  '.fg..',
  'ff...',
  'ff...',
  'gf...',
  'ff...',
  'ff...',
  'fg...',
  'ff...',
  'fff..',
  '.fff.',
  '..fff',
]

const raisedTail: Part = [
  'ff...',
  'fgf..',
  '.ff..',
  '.gf..',
  '.ff..',
  '.ff..',
  '.fg..',
  '.fff.',
  '..fff',
]

const hangingLantern: Part = [
  '..l..',
  '..l..',
  '.ooo.',
  'olllo',
  'olylo',
  'olylo',
  'olllo',
  '.ooo.',
]

const groundLantern: Part = ['.ooo.', '.o.o.', 'olllo', 'olylo', 'olylo', 'olllo', 'ooooo']

const layer = (part: Part, x: number, y: number): Layer => ({ part, x, y })

type StandOptions = {
  readonly lift?: number
  readonly legs?: readonly [number, number, number, number]
  readonly legLength?: number
  readonly raised?: 'back' | 'front' | null
  readonly tail?: Part
  readonly lanternX?: number
  readonly head?: HeadVariant
}

const stand = ({
  lift = 0,
  legs = [5, 8, 16, 19],
  legLength = 5,
  raised = null,
  tail = standTail,
  lanternX = 20,
  head = 'open',
}: StandOptions = {}): Pose => {
  const bodyY = 18 - lift
  const legY = bodyY + 8
  const [backFar, backNear, frontFar, frontNear] = legs
  const raisedBy = (which: 'back' | 'front') => (raised === which ? 1 : 0)
  return {
    behind: [
      layer(tail, 1, bodyY - 11),
      layer(farLeg(legLength), backFar, legY),
      layer(farLeg(legLength), frontFar, legY),
      layer(standTorso, 4, bodyY),
      layer(nearLeg(legLength - raisedBy('back')), backNear, legY),
      layer(nearLeg(legLength - raisedBy('front')), frontNear, legY),
      layer(standCape, 9, bodyY),
    ],
    front: [layer(hangingLantern, lanternX, bodyY)],
    head: { variant: head, x: 17, y: bodyY - 9 },
  }
}

const sitTorso: Part = [
  '...ffffffff..',
  '..ffffffwwww.',
  '..fffffwwwww.',
  '.ffgffffwwww.',
  '.fffgfffwwww.',
  'fffffgffwwww.',
  'ffffffffwwww.',
  'fffffffffwww.',
  'hffffffffwww.',
  'fffffffffwww.',
  'ffffffffwwww.',
  'gffffffffww..',
  'gfffffffff...',
  '.gfffffff....',
  '..ggggggg....',
]

const sulkTorso: Part = sitTorso.map((row) => row.replaceAll('w', 'f'))

const sitCape: Part = [
  '...cccccccc',
  '..cccdcccccc',
  '.ccdccdcccc.',
  'ccdcccdccc..',
  'cdccdcccc...',
  'rrrrrrrrr...',
]

const haunch: Part = ['.ffff.', 'ffffff', 'fffgff', 'ffffgf', 'ffffff', 'wwwff.', '.www..']

const sitTail: Part = ['ff..........', 'fff.........', '.ffgffgffff.', '..fffffffff.']

const wavingArm = (tip: string, wrist: string): Part => [
  tip,
  wrist,
  '..ff.',
  '..ff.',
  '..ff.',
  '..ff.',
  '..ff.',
  '..ff.',
  '.fff.',
  'fff..',
  'ff...',
]

const raisedPaw: Part = ['ww', 'ww', 'ff', 'ff', 'ff', 'ff', 'ff', 'ff']

type SitOptions = {
  readonly head?: HeadVariant
  readonly headX?: number
  readonly headY?: number
  readonly paw?: Layer | null
  readonly torso?: Part
  readonly lantern?: boolean
  readonly shiftX?: number
}

const sit = ({
  head = 'open',
  headX = 13,
  headY = 7,
  paw = null,
  torso = sitTorso,
  lantern = true,
  shiftX = 0,
}: SitOptions = {}): Pose => ({
  behind: [
    layer(sitTail, 6, 27),
    layer(farLeg(9), 18, 22),
    layer(torso, 11, 16),
    layer(haunch, 9, 24),
    ...(paw === null ? [layer(nearLeg(9), 20, 22)] : [paw]),
    layer(sitCape, 10, 16),
  ],
  front: lantern ? [layer(groundLantern, 25, 24)] : [],
  head: { variant: head, x: headX, y: headY },
  shiftX,
})

const stretchTorso: Part = [
  'fgff...............',
  'ffgfff.............',
  'hffffffff..........',
  'fffffffffffff......',
  'ffffffffffffffff...',
  'gffffffffffffffffw.',
  '.gfffffffffffffwwww',
  '..ggwwwwwwwwwwwwwww',
  '.....wwwwwwwwwwwww.',
]

const stretchCape: Part = [
  'ccc.........',
  'cdccccc.....',
  'ccccdcccccc.',
  'rrrcccccdccc',
  '...rrrrrrrrr',
]

const forePaws = (reach: number): Part => [
  `${'f'.repeat(9 + reach)}ww`,
  `${'g'.repeat(9 + reach)}xx`,
]

type StretchOptions = {
  readonly rear: number
  readonly reach: number
  readonly tail: Part
}

const stretch = ({ rear, reach, tail }: StretchOptions): Pose => ({
  behind: [
    layer(tail, 1, 6 - rear),
    layer(farLeg(10 + rear), 4, 21 - rear),
    layer(stretchTorso, 3, 14 - rear),
    layer(nearLeg(10 + rear), 7, 21 - rear),
    layer(forePaws(reach), 14, 29),
    layer(stretchCape, 5, 14 - rear),
  ],
  front: [layer(groundLantern, 27, 24)],
  head: { variant: 'closed', x: 13 + reach, y: 18 },
})

const loaf: Part = [
  '....ffgffgffff........',
  '..ffffgffgffffffff....',
  '.fffffffffffffffffff..',
  'hffffffffffffffffffff.',
  'ffffffffffffffffffffff',
  'gfffffffffffffffffffff',
  'gffffffffffffffffwwwww',
  '.gggggggggffffwwwwwww.',
  '..ggggggggggggggggg...',
]

const loafCape: Part = [
  '....cccccccc....',
  '.ccccdcccccdcc..',
  'ccdcccccdccccccc',
  'rrrrrrrrrrrrrrrr',
]

const curledTail: Part = ['..ffgffgffff', '.fff.......f', 'ff..........']

const sleepZ: Part = ['oooo', '..o.', '.o..', 'oooo']

const sleep = (breath: number): Pose => ({
  behind: [
    layer(loaf, 3, 22 - breath),
    ...(breath > 0 ? [layer(['....ffgffgffff'], 3, 22)] : []),
    layer(curledTail, 1, 28),
    layer(loafCape, 6, 22 - breath),
  ],
  front: [layer(groundLantern, 26, 24)],
  head: { variant: 'closed', x: 15, y: 15 - breath },
  after: breath > 0 ? [layer(sleepZ, 27, 8)] : [],
})

const posesByGesture: Readonly<Record<GestureName, readonly Pose[]>> = {
  idle: [stand(), stand({ tail: flickTail })],
  walk: [
    stand({ legs: [5, 9, 16, 20], lanternX: 20 }),
    stand({ legs: [6, 8, 17, 19], raised: 'front', lift: 1, lanternX: 21 }),
    stand({ legs: [8, 5, 19, 16], lanternX: 21 }),
    stand({ legs: [7, 6, 18, 17], raised: 'back', lift: 1, lanternX: 20 }),
  ],
  sit: [sit(), sit({ head: 'twitch' })],
  lick: [
    sit({ paw: layer(raisedPaw, 19, 16), lantern: true }),
    sit({ head: 'lick', paw: layer(raisedPaw, 18, 15) }),
    sit({ head: 'lick', headX: 12, headY: 8, paw: layer(raisedPaw, 17, 16) }),
  ],
  stretch: [
    stretch({ rear: 0, reach: 0, tail: raisedTail }),
    stretch({ rear: 1, reach: 1, tail: raisedTail }),
    stretch({ rear: 1, reach: 2, tail: flickTail }),
  ],
  cheer: [
    stand({ lift: -1, legLength: 4, head: 'closed' }),
    stand({ lift: 2, legLength: 5, tail: raisedTail }),
  ],
  sulk: [sit({ head: 'back', torso: sulkTorso, headX: 12 })],
  sleep: [sleep(0), sleep(1)],
  wave: [
    sit({ paw: layer(wavingArm('..ww.', '..www'), 23, 8) }),
    sit({ paw: layer(wavingArm('...ww', '..www'), 23, 8) }),
  ],
  purr: [sit({ head: 'closed' }), sit({ head: 'closed', shiftX: 1 })],
}

export const poses: Readonly<Record<GestureName, readonly Pose[]>> = posesByGesture

export const renderPose = (pose: Pose): SpriteFrame =>
  paint(
    [...pose.behind, layer(headPart(pose.head.variant), pose.head.x, pose.head.y), ...pose.front],
    { after: pose.after ?? [], shiftX: pose.shiftX ?? 0 }
  )

export const framesFor = (name: GestureName): readonly SpriteFrame[] => poses[name].map(renderPose)
