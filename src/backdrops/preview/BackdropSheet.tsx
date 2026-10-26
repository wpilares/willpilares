import { type CSSProperties, useEffect, useState } from 'react'
import { type BackdropId, backdropIds, generateBackdrop } from '../generators'
import {
  BACKDROP_HEIGHT,
  type BackdropLayerName,
  backdropLayerNames,
  layerWidth,
  PANORAMA_WIDTH,
} from '../layout'
import { renderBackdrop } from '../render'
import type { BackdropUrls } from '../useBackdrop'

type Scale = 2 | 4

const SCALES: readonly Scale[] = [2, 4]

const transparencyGrid: CSSProperties = {
  backgroundImage: 'repeating-conic-gradient(#2a2a2a 0% 25%, #3a3a3a 0% 50%) 50% / 16px 16px',
}

const renderAll = async (): Promise<Map<BackdropId, BackdropUrls>> => {
  const entries = await Promise.all(
    backdropIds.map(async (id): Promise<[BackdropId, BackdropUrls]> => {
      const layers = generateBackdrop(id)
      const [far, mid, near] = await Promise.all([
        renderBackdrop(layers.far),
        renderBackdrop(layers.mid),
        renderBackdrop(layers.near),
      ])
      return [id, { far, mid, near }]
    })
  )
  return new Map(entries)
}

type LayerImageProps = {
  readonly src: string
  readonly width: number
  readonly scale: Scale
  readonly stacked: boolean
}

const LayerImage = ({ src, width, scale, stacked }: LayerImageProps) => (
  <img
    src={src}
    alt=""
    draggable={false}
    className={stacked ? 'absolute top-0 left-0' : 'block'}
    style={{
      imageRendering: 'pixelated',
      width: width * scale,
      height: BACKDROP_HEIGHT * scale,
      maxWidth: 'none',
    }}
  />
)

type SceneRowProps = {
  readonly id: BackdropId
  readonly urls: BackdropUrls
  readonly scale: Scale
}

const SceneRow = ({ id, urls, scale }: SceneRowProps) => {
  const stackWidth = Math.max(...backdropLayerNames.map((layer) => layerWidth(id, layer)))
  const layerSize = (layer: BackdropLayerName) =>
    layer === 'far' && stackWidth === PANORAMA_WIDTH ? PANORAMA_WIDTH : layerWidth(id, layer)

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-serif text-lg text-parchment">{id}</h2>
      <div className="overflow-x-auto">
        <div
          className="relative"
          style={{ width: stackWidth * scale, height: BACKDROP_HEIGHT * scale }}
        >
          {backdropLayerNames.map((layer) => (
            <LayerImage
              key={layer}
              src={urls[layer]}
              width={layerSize(layer)}
              scale={scale}
              stacked
            />
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {backdropLayerNames.map((layer) => (
          <figure key={layer} className="flex flex-col gap-1 overflow-x-auto">
            <div style={transparencyGrid}>
              <LayerImage
                src={urls[layer]}
                width={layerWidth(id, layer)}
                scale={2}
                stacked={false}
              />
            </div>
            <figcaption className="text-xs text-parchment">{layer}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export const BackdropSheet = () => {
  const [scale, setScale] = useState<Scale>(2)
  const [rendered, setRendered] = useState<Map<BackdropId, BackdropUrls> | null>(null)

  useEffect(() => {
    let active = true
    renderAll().then((next) => {
      if (active) setRendered(next)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <main className="min-h-screen bg-night p-6 text-parchment">
      <header className="mb-6 flex items-center gap-4">
        <h1 className="text-2xl">Backdrops</h1>
        {SCALES.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setScale(option)}
            aria-pressed={scale === option}
            className={`rounded border px-3 py-1 ${scale === option ? 'border-gold text-gold' : 'border-ash'}`}
          >
            {option}×
          </button>
        ))}
      </header>
      {rendered === null ? (
        <p>Rendering…</p>
      ) : (
        <div className="flex flex-col gap-10">
          {backdropIds.map((id) => {
            const urls = rendered.get(id)
            return urls ? <SceneRow key={id} id={id} urls={urls} scale={scale} /> : null
          })}
        </div>
      )}
    </main>
  )
}
