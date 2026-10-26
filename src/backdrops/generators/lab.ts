import { labMirrorRect } from '../layout'
import { createPixelBuffer, type PixelBuffer } from '../painter'
import type { Rng } from '../prng'
import { arch, bricks, ditherFill, glow, HEIGHT, WIDTH } from './shared'
import type { BackdropLayers } from './types'

const BENCH_Y = 120
const ELECTRODES = [276, 294] as const
const SPARK_Y = 82

const paintFar = (rng: Rng): PixelBuffer => {
  const far = createPixelBuffer(WIDTH, HEIGHT)
  bricks(far, rng, 0, 0, WIDTH, 152, {
    brickWidth: 12,
    brickHeight: 6,
    mortar: 'stone',
    face: 'ash',
    accents: ['slate', 'stone', 'wood'],
  })
  for (let row = 0; row < 40; row += 1) {
    ditherFill(far, 0, row, WIDTH, 1, 'night', Math.round(13 - row * 0.3))
  }
  for (let column = 0; column < 30; column += 1) {
    ditherFill(far, column, 0, 1, 152, 'night', Math.round(8 - column * 0.27))
    ditherFill(far, WIDTH - 1 - column, 0, 1, 152, 'night', Math.round(8 - column * 0.27))
  }
  far.fillRect(0, 152, WIDTH, HEIGHT - 152, 'stone')
  far.fillRect(0, 152, WIDTH, 1, 'slate')
  for (let x = 0; x < WIDTH; x += 20) far.line(x, 153, x - 16, HEIGHT, 'night')
  ditherFill(far, 0, 160, WIDTH, 20, 'night', 7)
  return far
}

const pipes = (mid: PixelBuffer) => {
  mid.fillRect(0, 4, WIDTH, 7, 'copper')
  mid.line(0, 5, WIDTH, 5, 'gold')
  mid.line(0, 10, WIDTH, 10, 'night')
  ditherFill(mid, 0, 8, WIDTH, 2, 'wood', 8)
  for (let x = 18; x < WIDTH; x += 44) {
    mid.fillRect(x, 2, 4, 11, 'gold')
    mid.line(x + 3, 2, x + 3, 12, 'copper')
    mid.pixel(x + 1, 4, 'parchment')
  }
  mid.fillRect(0, 16, 262, 4, 'copper')
  mid.line(0, 16, 261, 16, 'gold')
  mid.line(0, 19, 261, 19, 'night')
  mid.fillRect(258, 16, 5, 4, 'gold')
  mid.fillRect(259, 20, 4, 62, 'copper')
  mid.line(259, 20, 259, 81, 'gold')
  mid.fillRect(257, 52, 8, 3, 'gold')
  mid.circle(196, 26, 5, 'gold')
  mid.circle(196, 26, 3, 'night')
  mid.line(192, 26, 200, 26, 'gold')
  mid.line(196, 22, 196, 30, 'gold')
  mid.fillRect(195, 19, 2, 3, 'gold')
}

const mirror = (mid: PixelBuffer) => {
  const { x, y, width, height } = labMirrorRect
  const centre = x + width / 2
  arch(mid, centre, y + 2, 14, 12, y + 4, 'gold')
  arch(mid, centre, y + 2, 10, 8, y + 4, 'copper')
  mid.circle(centre, y - 4, 2, 'parchment')
  mid.fillRect(x - 7, y - 7, width + 14, height + 14, 'gold')
  mid.fillRect(x - 5, y - 5, width + 10, height + 10, 'copper')
  mid.fillRect(x - 4, y - 4, width + 8, height + 8, 'gold')
  mid.fillRect(x - 1, y - 1, width + 2, height + 2, 'woodLight')
  mid.fillRect(x, y, width, height, 'night')
  mid.line(x - 7, y - 7, x + width + 6, y - 7, 'parchment')
  mid.line(x - 7, y - 7, x - 7, y + height + 6, 'parchment')
  for (let step = x; step < x + width; step += 6) {
    mid.pixel(step, y - 6, 'copper')
    mid.pixel(step + 3, y + height + 5, 'copper')
  }
  for (const [cornerX, cornerY] of [
    [x - 6, y - 6],
    [x + width + 5, y - 6],
    [x - 6, y + height + 5],
    [x + width + 5, y + height + 5],
  ] as const) {
    mid.circle(cornerX, cornerY, 5, 'gold')
    mid.circle(cornerX, cornerY, 3, 'copper')
    mid.circle(cornerX, cornerY, 1, 'gold')
  }
  mid.line(x + 4, y + 6, x + 18, y + 3, 'stone')
  mid.line(x + 4, y + 10, x + 10, y + 8, 'stone')
}

const gauge = (mid: PixelBuffer, x: number, y: number) => {
  mid.fillRect(x - 2, y + 8, 5, BENCH_Y - y - 8, 'gold')
  mid.circle(x, y, 10, 'gold')
  mid.circle(x, y, 8, 'parchment')
  for (let angle = 0; angle < 8; angle += 1) {
    const theta = Math.PI * (0.8 + angle * 0.2)
    mid.pixel(x + Math.round(Math.cos(theta) * 6), y + Math.round(Math.sin(theta) * 6), 'night')
  }
  mid.line(x, y, x + 5, y - 3, 'blood')
  mid.pixel(x, y, 'night')
  mid.pixel(x - 4, y - 5, 'moon')
}

const telegraphKey = (mid: PixelBuffer, x: number) => {
  mid.fillRect(x, BENCH_Y - 4, 20, 4, 'wood')
  mid.fillRect(x, BENCH_Y - 4, 20, 1, 'woodLight')
  mid.fillRect(x + 3, BENCH_Y - 8, 2, 4, 'gold')
  mid.line(x + 2, BENCH_Y - 8, x + 18, BENCH_Y - 10, 'gold')
  mid.circle(x + 18, BENCH_Y - 11, 2, 'night')
  mid.pixel(x + 17, BENCH_Y - 12, 'slate')
  mid.fillRect(x + 14, BENCH_Y - 6, 2, 2, 'copper')
}

const coilDevice = (mid: PixelBuffer) => {
  const [leftElectrode, rightElectrode] = ELECTRODES
  mid.fillRect(268, BENCH_Y - 6, 34, 6, 'wood')
  mid.fillRect(268, BENCH_Y - 6, 34, 1, 'woodLight')
  for (let row = 0; row < 18; row += 1) {
    mid.fillRect(276, BENCH_Y - 24 + row, 18, 1, row % 2 === 0 ? 'copper' : 'gold')
  }
  mid.line(293, BENCH_Y - 24, 293, BENCH_Y - 7, 'wood')
  mid.fillRect(274, BENCH_Y - 26, 22, 2, 'gold')
  for (const electrode of [leftElectrode, rightElectrode]) {
    mid.fillRect(electrode - 1, SPARK_Y, 2, BENCH_Y - 26 - SPARK_Y, 'gold')
    mid.circle(electrode, SPARK_Y, 3, 'gold')
    mid.pixel(electrode - 1, SPARK_Y - 1, 'parchment')
  }
  mid.fillRect(304, BENCH_Y - 16, 6, 10, 'moonGlow')
  mid.fillRect(305, BENCH_Y - 22, 4, 6, 'moonGlow')
  ditherFill(mid, 304, BENCH_Y - 12, 6, 6, 'blood', 10)
  mid.pixel(305, BENCH_Y - 15, 'moon')
}

const bench = (mid: PixelBuffer) => {
  mid.fillRect(180, BENCH_Y, 140, 3, 'woodLight')
  mid.fillRect(180, BENCH_Y + 3, 140, 6, 'wood')
  mid.fillRect(180, BENCH_Y + 9, 140, 1, 'night')
  for (const legX of [186, 312]) mid.fillRect(legX, BENCH_Y + 10, 5, HEIGHT - BENCH_Y - 10, 'wood')
  mid.fillRect(186, 160, 130, 3, 'wood')
  mid.fillRect(186, 160, 130, 1, 'woodLight')
  mid.fillRect(198, 148, 22, 12, 'wood')
  mid.fillRect(199, 149, 20, 1, 'woodLight')
  mid.fillRect(226, 152, 14, 8, 'copper')
  mid.line(226, 152, 239, 152, 'gold')
}

const paintMid = (): PixelBuffer => {
  const mid = createPixelBuffer(WIDTH, HEIGHT)
  pipes(mid)
  mirror(mid)
  bench(mid)
  gauge(mid, 204, 98)
  telegraphKey(mid, 222)
  telegraphKey(mid, 244)
  coilDevice(mid)
  mid.line(240, BENCH_Y - 2, 268, BENCH_Y - 3, 'copper')
  mid.line(262, BENCH_Y - 2, 270, BENCH_Y - 3, 'copper')
  return mid
}

const sparks = (near: PixelBuffer, rng: Rng) => {
  const [leftElectrode, rightElectrode] = ELECTRODES
  const centre = (leftElectrode + rightElectrode) / 2
  glow(near, centre, SPARK_Y, 26, 'copper', 4)
  glow(near, centre, SPARK_Y, 14, 'ember', 6)
  let y = SPARK_Y
  for (let x = leftElectrode + 3; x < rightElectrode - 3; x += 2) {
    const next = SPARK_Y + rng.int(-3, 3)
    near.line(x, y, x + 2, next, 'parchment')
    near.pixel(x + 1, next - 1, 'gold')
    y = next
  }
  for (let index = 0; index < 18; index += 1) {
    const angle = rng.next() * Math.PI * 2
    const reach = rng.int(5, 14)
    near.pixel(
      Math.round(centre + Math.cos(angle) * reach),
      Math.round(SPARK_Y + Math.sin(angle) * reach * 0.8),
      rng.next() < 0.5 ? 'ember' : 'gold'
    )
  }
}

const cable = (near: PixelBuffer, fromX: number, fromY: number, toX: number, sag: number) => {
  const at = (x: number) =>
    Math.round(fromY + sag * Math.sin(((x - fromX) / (toX - fromX)) * Math.PI))
  for (let x = fromX; x < toX; x += 1) {
    near.line(x, at(x) + 1, x + 1, at(x + 1) + 1, 'copper')
    near.line(x, at(x), x + 1, at(x + 1), 'gold')
  }
}

const paintNear = (rng: Rng): PixelBuffer => {
  const near = createPixelBuffer(WIDTH, HEIGHT)
  sparks(near, rng)
  glow(near, 204, 98, 18, 'moonGlow', 3)
  near.fillRect(0, 148, 40, 32, 'night')
  near.fillRect(0, 148, 40, 1, 'stone')
  near.line(0, 158, 39, 158, 'stone')
  near.line(20, 149, 20, 179, 'stone')
  cable(near, 34, 164, 186, 12)
  cable(near, 20, 170, 200, 9)
  return near
}

export const generateLab = (rng: Rng): BackdropLayers => ({
  far: paintFar(rng),
  mid: paintMid(),
  near: paintNear(rng),
})
