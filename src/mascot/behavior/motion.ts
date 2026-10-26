import type { MascotFacing } from '../anchor'

export type Point = { readonly x: number; readonly y: number }

export type MotionStep = {
  readonly position: Point
  readonly arrived: boolean
  readonly facing: MascotFacing | null
}

const clampStep = (delta: number, speed: number): number =>
  Math.sign(delta) * Math.min(Math.abs(delta), speed)

export const stepTowards = (current: Point, target: Point, speed: number): MotionStep => {
  const deltaX = target.x - current.x
  const deltaY = target.y - current.y
  const position: Point = {
    x: current.x + clampStep(deltaX, speed),
    y: current.y + clampStep(deltaY, speed),
  }
  const arrived = position.x === target.x && position.y === target.y
  const facing: MascotFacing | null = deltaX > 0 ? 'right' : deltaX < 0 ? 'left' : null
  return { position, arrived, facing }
}
