import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { type MascotFacing, type MascotSide, resolveAnchor, type Viewport } from '../anchor'
import { applyOutfit, createMascotGestures, type OutfitName, outfits } from '../art'
import { mascotBus, type QuipKey } from '../behavior/bus'
import { createHoldDetector } from '../behavior/hold'
import { type Point, stepTowards } from '../behavior/motion'
import { pickScrollQuip, randomTrickGesture, type ScrollDirection } from '../behavior/quips'
import { pickActiveSection, readSectionTarget, type SectionEntry } from '../behavior/sections'
import {
  createGestureMachine,
  type GestureMachine,
  type GestureName,
  type GestureSet,
} from '../gestures'
import { createRenderer, type Renderer, RendererUnavailableError } from '../renderer'
import {
  decodeFrame,
  flipFrame,
  type PixelMatrix,
  SPRITE_HEIGHT,
  SPRITE_WIDTH,
  type SpriteFrame,
} from '../sprite'

export type UseMascotOptions = {
  readonly canvasRef: RefObject<HTMLCanvasElement>
  readonly reducedMotion: boolean
  readonly scale: number
  readonly margin: number
}

export type UseMascotResult = {
  readonly position: Point
  readonly facing: MascotFacing
  readonly held: boolean
  readonly quipKey: QuipKey | null
  readonly dismissQuip: () => void
}

type GestureOverride = { readonly name: GestureName; readonly until: number }

type World = {
  position: Point
  target: Point
  anchorFacing: MascotFacing
  facing: MascotFacing
  sectionGesture: GestureName
  outfit: OutfitName
  held: boolean
  dragOffset: Point
  pointer: Point
  sleeping: boolean
  override: GestureOverride | null
  tapped: boolean
}

type Outputs = {
  readonly setPosition: (position: Point) => void
  readonly setFacing: (facing: MascotFacing) => void
  readonly setHeld: (held: boolean) => void
  readonly showQuip: (key: QuipKey) => void
}

type Stage = {
  readonly canvas: HTMLCanvasElement
  readonly renderer: Renderer | null
  readonly scale: number
  readonly margin: number
  readonly reducedMotion: boolean
  readonly world: World
  readonly outputs: Outputs
  machine: GestureMachine
}

const MIN_WALK_SPEED = 4
const MAX_WALK_SPEED = 14
const WALK_SPEED_DIVISOR = 24
const HOLD_MS = 250
const IDLE_TIMEOUT_MS = 20_000
const QUIP_DURATION_MS = 3200
const OVERRIDE_DURATION_MS = 1600
const SECTION_THRESHOLDS = [0, 0.25, 0.5, 0.75, 1]
const ACTIVITY_EVENTS = ['scroll', 'pointermove', 'pointerdown', 'keydown'] as const

const ORIGIN: Point = { x: 0, y: 0 }

const samePoint = (left: Point, right: Point) => left.x === right.x && left.y === right.y

const readViewport = (): Viewport => ({ width: window.innerWidth, height: window.innerHeight })

const isCoarsePointer = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches

export const walkSpeed = (distance: number): number =>
  Math.min(MAX_WALK_SPEED, Math.max(MIN_WALK_SPEED, distance / WALK_SPEED_DIVISOR))

const remainingDistance = (from: Point, to: Point): number =>
  Math.max(Math.abs(to.x - from.x), Math.abs(to.y - from.y))

const resolveSideAnchor = (side: MascotSide, scale: number, margin: number) =>
  resolveAnchor({
    side,
    viewport: readViewport(),
    spriteWidth: SPRITE_WIDTH * scale,
    spriteHeight: SPRITE_HEIGHT * scale,
    margin,
  })

const resolveHeroPosition = (scale: number, margin: number): Point => {
  const anchor = resolveSideAnchor('hero', scale, margin)
  return { x: anchor.x, y: anchor.y }
}

const createWorld = (initialPosition: Point): World => ({
  position: initialPosition,
  target: initialPosition,
  anchorFacing: 'right',
  facing: 'right',
  sectionGesture: 'idle',
  outfit: 'default',
  held: false,
  dragOffset: ORIGIN,
  pointer: ORIGIN,
  sleeping: false,
  override: null,
  tapped: false,
})

const createGestureSets = () => {
  const base = createMascotGestures()
  const cache = new Map<OutfitName, GestureSet>()
  return (outfit: OutfitName): GestureSet => {
    const cached = cache.get(outfit)
    if (cached !== undefined) return cached
    const set = applyOutfit(base, outfits[outfit])
    cache.set(outfit, set)
    return set
  }
}

const createFrameDecoder = () => {
  const cache = new Map<SpriteFrame, { right?: PixelMatrix; left?: PixelMatrix }>()
  return (frame: SpriteFrame, outfit: OutfitName, facing: MascotFacing): PixelMatrix => {
    const entry = cache.get(frame) ?? {}
    const cached = entry[facing]
    if (cached !== undefined) return cached
    const palette = outfits[outfit].palette
    const matrix = decodeFrame(facing === 'left' ? flipFrame(frame) : frame, palette)
    cache.set(frame, { ...entry, [facing]: matrix })
    return matrix
  }
}

const tryCreateRenderer = (canvas: HTMLCanvasElement, scale: number): Renderer | null => {
  try {
    const renderer = createRenderer(canvas)
    renderer.resize(
      { width: SPRITE_WIDTH * scale, height: SPRITE_HEIGHT * scale },
      window.devicePixelRatio || 1
    )
    return renderer
  } catch (error) {
    if (error instanceof RendererUnavailableError) return null
    throw error
  }
}

const clampToViewport = (point: Point, scale: number): Point => {
  const { width, height } = readViewport()
  return {
    x: Math.min(Math.max(0, point.x), Math.max(0, width - SPRITE_WIDTH * scale)),
    y: Math.min(Math.max(0, point.y), Math.max(0, height - SPRITE_HEIGHT * scale)),
  }
}

const desiredGesture = (world: World, now: number): GestureName => {
  if (world.held) return 'cheer'
  if (!samePoint(world.position, world.target)) return 'walk'
  if (world.override !== null && world.override.until > now) return world.override.name
  if (world.sleeping) return 'sleep'
  return world.sectionGesture
}

const createStage = (
  canvas: HTMLCanvasElement,
  scale: number,
  margin: number,
  reducedMotion: boolean,
  outputs: Outputs
) => {
  const gestureSets = createGestureSets()
  const decode = createFrameDecoder()
  const world = createWorld(resolveHeroPosition(scale, margin))
  const stage: Stage = {
    canvas,
    renderer: tryCreateRenderer(canvas, scale),
    scale,
    margin,
    reducedMotion,
    world,
    outputs,
    machine: createGestureMachine(gestureSets('default')),
  }

  const draw = (frame: SpriteFrame) => {
    if (stage.renderer === null) return
    stage.renderer.clear()
    stage.renderer.draw(decode(frame, world.outfit, world.facing), {
      x: 0,
      y: 0,
      scale,
      flipX: false,
    })
  }

  const drawStill = () => {
    draw(gestureSets(world.outfit).idle.frames[0] ?? [])
  }

  const setOutfit = (outfit: OutfitName) => {
    if (outfit === world.outfit) return
    world.outfit = outfit
    stage.machine = createGestureMachine(gestureSets(outfit), stage.machine.current().name)
    if (reducedMotion) drawStill()
  }

  const moveTo = (position: Point) => {
    if (samePoint(world.position, position)) return
    world.position = position
    outputs.setPosition(position)
  }

  const face = (facing: MascotFacing) => {
    if (facing === world.facing) return
    world.facing = facing
    outputs.setFacing(facing)
  }

  const retarget = (side: MascotSide) => {
    const anchor = resolveSideAnchor(side, scale, margin)
    world.target = { x: anchor.x, y: anchor.y }
    world.anchorFacing = anchor.facing
    if (reducedMotion) {
      moveTo(world.target)
      face(anchor.facing)
      drawStill()
    }
  }

  const setHeld = (held: boolean) => {
    if (held === world.held) return
    world.held = held
    outputs.setHeld(held)
    outputs.showQuip(held ? 'held' : 'released')
  }

  const playOverride = (name: GestureName, now: number) => {
    world.override = { name, until: now + OVERRIDE_DURATION_MS }
  }

  const tick = (now: number, deltaMs: number) => {
    if (world.held) {
      moveTo(
        clampToViewport(
          { x: world.pointer.x + world.dragOffset.x, y: world.pointer.y + world.dragOffset.y },
          scale
        )
      )
    } else {
      const step = stepTowards(
        world.position,
        world.target,
        walkSpeed(remainingDistance(world.position, world.target))
      )
      moveTo(step.position)
      face(step.arrived ? world.anchorFacing : (step.facing ?? world.facing))
    }
    stage.machine.play(desiredGesture(world, now))
    stage.machine.tick(deltaMs)
    draw(stage.machine.current().frame)
  }

  return { stage, drawStill, setOutfit, retarget, setHeld, playOverride, tick, face, moveTo }
}

type Live = ReturnType<typeof createStage>

const attachLoop = ({ stage, tick }: Live): (() => void) => {
  if (stage.reducedMotion || typeof window.requestAnimationFrame !== 'function') return () => {}
  let previous = performance.now()
  let handle = 0
  const frame = (now: number) => {
    tick(now, now - previous)
    previous = now
    handle = window.requestAnimationFrame(frame)
  }
  handle = window.requestAnimationFrame(frame)
  return () => window.cancelAnimationFrame(handle)
}

const attachSections = ({ stage, setOutfit, retarget }: Live): (() => void) => {
  if (typeof IntersectionObserver === 'undefined') return () => {}
  const entries = new Map<Element, SectionEntry>()
  let active: Element | null = null

  const applyActive = () => {
    const next = pickActiveSection([...entries.values()], active)
    if (next === null || next === active) return
    active = next
    const target = readSectionTarget(next)
    stage.world.sectionGesture = target.gesture
    setOutfit(target.outfit)
    retarget(target.side)
  }

  const observer = new IntersectionObserver(
    (observed) => {
      for (const entry of observed) {
        entries.set(entry.target, {
          target: entry.target,
          intersectionRatio: entry.intersectionRatio,
          isIntersecting: entry.isIntersecting,
        })
      }
      applyActive()
    },
    { threshold: SECTION_THRESHOLDS }
  )
  for (const section of document.querySelectorAll('[data-mascot]')) observer.observe(section)

  const handleResize = () => {
    if (active !== null) retarget(readSectionTarget(active).side)
  }
  window.addEventListener('resize', handleResize)

  return () => {
    observer.disconnect()
    window.removeEventListener('resize', handleResize)
  }
}

const attachPointer = ({ stage, setHeld }: Live): (() => void) => {
  if (stage.reducedMotion) return () => {}
  const { canvas, world, outputs } = stage
  const hold = createHoldDetector({ holdMs: HOLD_MS })

  const beginHold = () => {
    world.dragOffset = {
      x: world.position.x - world.pointer.x,
      y: world.position.y - world.pointer.y,
    }
    setHeld(true)
  }

  const handleDown = (event: PointerEvent) => {
    world.pointer = { x: event.clientX, y: event.clientY }
    canvas.setPointerCapture?.(event.pointerId)
    hold.down(event.clientX, event.clientY, event.timeStamp)
  }

  const handleMove = (event: PointerEvent) => {
    world.pointer = { x: event.clientX, y: event.clientY }
    const result = hold.move(event.clientX, event.clientY, event.timeStamp)
    if (result.kind === 'held' && !world.held) beginHold()
  }

  const handleUp = (event: PointerEvent) => {
    const result = hold.up(event.timeStamp)
    canvas.releasePointerCapture?.(event.pointerId)
    if (world.held) {
      setHeld(false)
      return
    }
    if (result.kind !== 'tap') return
    if (!world.tapped) {
      world.tapped = true
      outputs.showQuip('grabHint')
      return
    }
    mascotBus.emit({ type: 'trick' })
  }

  const handleCancel = (event: PointerEvent) => {
    hold.up(event.timeStamp)
    canvas.releasePointerCapture?.(event.pointerId)
    if (world.held) setHeld(false)
  }

  const checkHold = () => {
    if (hold.current().kind !== 'pending') return
    if (hold.check(performance.now()).kind === 'held' && !world.held) beginHold()
  }
  const holdTimer = window.setInterval(checkHold, HOLD_MS / 5)

  canvas.addEventListener('pointerdown', handleDown)
  canvas.addEventListener('pointermove', handleMove)
  canvas.addEventListener('pointerup', handleUp)
  canvas.addEventListener('pointercancel', handleCancel)

  return () => {
    window.clearInterval(holdTimer)
    canvas.removeEventListener('pointerdown', handleDown)
    canvas.removeEventListener('pointermove', handleMove)
    canvas.removeEventListener('pointerup', handleUp)
    canvas.removeEventListener('pointercancel', handleCancel)
  }
}

const attachBus = ({ stage, playOverride }: Live): (() => void) =>
  mascotBus.subscribe((event) => {
    switch (event.type) {
      case 'quip':
        stage.outputs.showQuip(event.key)
        return
      case 'gesture':
        playOverride(event.name, performance.now())
        return
      case 'trick':
        playOverride(randomTrickGesture(Math.random), performance.now())
        stage.outputs.showQuip('trick')
        return
    }
  })

const attachIdle = ({ stage }: Live): (() => void) => {
  const { world, outputs } = stage
  let timer = 0

  const fallAsleep = () => {
    world.sleeping = true
    outputs.showQuip('sleepy')
  }

  const restart = () => {
    world.sleeping = false
    window.clearTimeout(timer)
    timer = window.setTimeout(fallAsleep, IDLE_TIMEOUT_MS)
  }

  restart()
  for (const name of ACTIVITY_EVENTS) window.addEventListener(name, restart, { passive: true })

  return () => {
    window.clearTimeout(timer)
    for (const name of ACTIVITY_EVENTS) window.removeEventListener(name, restart)
  }
}

const attachScrollQuips = ({ stage }: Live): (() => void) => {
  const shownKeys = new Set<QuipKey>()
  let lastY = window.scrollY

  const handleScroll = () => {
    const currentY = window.scrollY
    if (currentY === lastY) return
    const direction: ScrollDirection = currentY < lastY ? 'up' : 'down'
    lastY = currentY
    const key = pickScrollQuip({ direction, isMobile: isCoarsePointer(), shownKeys })
    if (key === null) return
    shownKeys.add(key)
    stage.outputs.showQuip(key)
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => window.removeEventListener('scroll', handleScroll)
}

export const useMascot = ({
  canvasRef,
  reducedMotion,
  scale,
  margin,
}: UseMascotOptions): UseMascotResult => {
  const [position, setPosition] = useState<Point>(() => resolveHeroPosition(scale, margin))
  const [facing, setFacing] = useState<MascotFacing>('right')
  const [held, setHeld] = useState(false)
  const [quipKey, setQuipKey] = useState<QuipKey | null>(null)
  const quipTimer = useRef(0)

  const dismissQuip = useCallback(() => {
    window.clearTimeout(quipTimer.current)
    setQuipKey(null)
  }, [])

  const showQuip = useCallback(
    (key: QuipKey) => {
      dismissQuip()
      setQuipKey(key)
      quipTimer.current = window.setTimeout(() => setQuipKey(null), QUIP_DURATION_MS)
    },
    [dismissQuip]
  )

  useEffect(() => () => window.clearTimeout(quipTimer.current), [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas === null) return
    const live = createStage(canvas, scale, margin, reducedMotion, {
      setPosition,
      setFacing,
      setHeld,
      showQuip,
    })
    setPosition(live.stage.world.position)
    live.drawStill()
    const detach = [
      attachSections(live),
      attachPointer(live),
      attachBus(live),
      attachIdle(live),
      attachScrollQuips(live),
      attachLoop(live),
    ]
    showQuip('hello')
    return () => {
      for (const cleanup of detach) cleanup()
    }
  }, [canvasRef, reducedMotion, scale, margin, showQuip])

  return { position, facing, held, quipKey, dismissQuip }
}
