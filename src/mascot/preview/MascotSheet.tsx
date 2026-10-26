import { useEffect, useRef, useState } from 'react'
import { applyOutfit, createMascotGestures, OUTFIT_NAMES, type Outfit, outfits } from '../art'
import { createGestureMachine, GESTURE_NAMES, type GestureName, type GestureSet } from '../gestures'
import { createRenderer } from '../renderer'
import { decodeFrame, flipFrame, type Palette, SPRITE_HEIGHT, SPRITE_WIDTH } from '../sprite'

type Scale = 2 | 4 | 8
type Facing = 'right' | 'left'

const SCALES: readonly Scale[] = [2, 4, 8]

type GestureCanvasProps = {
  readonly gestures: GestureSet
  readonly palette: Palette
  readonly gesture: GestureName
  readonly scale: Scale
  readonly facing: Facing
}

const GestureCanvas = ({ gestures, palette, gesture, scale, facing }: GestureCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas === null) return
    const renderer = createRenderer(canvas)
    const machine = createGestureMachine(gestures, gesture)
    renderer.resize(
      { width: SPRITE_WIDTH * scale, height: SPRITE_HEIGHT * scale },
      window.devicePixelRatio
    )
    let previous = performance.now()
    let handle = 0
    const loop = (now: number) => {
      machine.tick(now - previous)
      previous = now
      const { frame } = machine.current()
      const oriented = facing === 'left' ? flipFrame(frame) : frame
      renderer.clear()
      renderer.draw(decodeFrame(oriented, palette), { x: 0, y: 0, scale, flipX: false })
      handle = window.requestAnimationFrame(loop)
    }
    handle = window.requestAnimationFrame(loop)
    return () => window.cancelAnimationFrame(handle)
  }, [gestures, palette, gesture, scale, facing])

  return (
    <figure className="flex flex-col items-center gap-1">
      <canvas ref={canvasRef} className="bg-white" style={{ imageRendering: 'pixelated' }} />
      <figcaption className="text-xs">{gesture}</figcaption>
    </figure>
  )
}

type OutfitRowProps = {
  readonly outfit: Outfit
  readonly base: GestureSet
  readonly scale: Scale
  readonly facing: Facing
}

const OutfitRow = ({ outfit, base, scale, facing }: OutfitRowProps) => {
  const gestures = applyOutfit(base, outfit)
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-semibold text-sm">{outfit.name}</h2>
      <div className="flex flex-wrap gap-4">
        {GESTURE_NAMES.map((gesture) => (
          <GestureCanvas
            key={gesture}
            gestures={gestures}
            palette={outfit.palette}
            gesture={gesture}
            scale={scale}
            facing={facing}
          />
        ))}
      </div>
    </section>
  )
}

export const MascotSheet = () => {
  const [scale, setScale] = useState<Scale>(4)
  const [facing, setFacing] = useState<Facing>('right')
  const [base] = useState(createMascotGestures)

  return (
    <main className="flex flex-col gap-6 p-6">
      <header className="flex items-center gap-4">
        <h1 className="font-semibold text-lg">Mascot sheet</h1>
        <div className="flex items-center gap-1">
          {SCALES.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={option === scale}
              className="border px-2 py-1 text-sm aria-pressed:bg-black aria-pressed:text-white"
              onClick={() => setScale(option)}
            >
              {option}x
            </button>
          ))}
        </div>
        <button
          type="button"
          className="border px-2 py-1 text-sm"
          onClick={() => setFacing(facing === 'right' ? 'left' : 'right')}
        >
          facing {facing}
        </button>
      </header>
      {OUTFIT_NAMES.map((name) => (
        <OutfitRow key={name} outfit={outfits[name]} base={base} scale={scale} facing={facing} />
      ))}
    </main>
  )
}
