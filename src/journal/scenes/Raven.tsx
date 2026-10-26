import { BACKDROP_WIDTH, Backdrop, backdropDepths } from '@backdrops'
import { backdropRectToStage, belfryMoon, layerBleed } from '@backdrops/layout'
import { mascotBus } from '@mascot'
import { FogVeil, Scene, SceneReveal, SceneWindow, sceneById, useSceneStage } from '@scenes'
import { animate } from 'motion/mini'
import { type RefObject, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ContactLink } from '@/types'

const ravenMeta = sceneById('raven')

const email = 'wgpilaresc@gmail.com'
const COPIED_FEEDBACK_MS = 2000
const FLIGHT_SECONDS = 1.2

type SealLink = ContactLink & { readonly initial: string }

const RAVEN_ROWS: readonly string[] = [
  'n..............n',
  'nn............nn',
  '.nnn...ne...nnn.',
  '..nnnn.nn.nnnn..',
  '...nnnnnnnnnn...',
  '....nnnnnnnn....',
  '.....nnnnnn.....',
  '......nnnn......',
  '.....nnppnn.....',
  '......pppp......',
  '......pbbp......',
  '......pppp......',
]

const ravenInks: Readonly<Record<string, string>> = {
  n: '#0b0a0f',
  e: '#c2452d',
  p: '#e9dfc8',
  b: '#8b1e1e',
}

const ravenPixels: readonly (readonly [number, number, string])[] = RAVEN_ROWS.flatMap((row, y) =>
  [...row].flatMap((cell, x) => {
    const fill = ravenInks[cell]
    return fill ? [[x, y, fill] as const] : []
  })
)

const flightTransform = (x: number, y: number, scale: number): string =>
  `translate(${x}px, ${y}px) scale(${scale})`

const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const canFly = (raven: SVGSVGElement): boolean =>
  typeof raven.animate === 'function' && !prefersReducedMotion()

const fogAtStartOnly = (progress: number): number => Math.min(progress, 0.5)

const navigateToMailto = () => {
  window.location.assign(`mailto:${email}`)
}

const useSealLinks = (): readonly SealLink[] => {
  const { t } = useTranslation()
  return [
    {
      title: t('journal.raven.links.github'),
      value: 'github.com/wpilares',
      href: 'https://github.com/wpilares',
      initial: 'G',
    },
    {
      title: t('journal.raven.links.linkedin'),
      value: 'linkedin.com/in/wpilaresc',
      href: 'https://linkedin.com/in/wpilaresc',
      initial: 'in',
    },
  ]
}

const useCopyEmail = (onCopied: () => void) => {
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(resetTimer.current), [])

  const copy = async () => {
    const clipboard = navigator.clipboard
    if (!clipboard || typeof clipboard.writeText !== 'function') {
      navigateToMailto()
      return
    }

    try {
      await clipboard.writeText(email)
    } catch {
      navigateToMailto()
      return
    }

    mascotBus.emit({ type: 'quip', key: 'copied' })
    setCopied(true)
    window.clearTimeout(resetTimer.current)
    resetTimer.current = window.setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS)
    onCopied()
  }

  return { copied, copy }
}

const RavenSilhouette = ({ ravenRef }: { ravenRef: RefObject<SVGSVGElement> }) => (
  <svg
    ref={ravenRef}
    aria-hidden="true"
    data-raven
    viewBox="0 0 16 12"
    className="pointer-events-none absolute top-0 left-0 -mt-6 -ml-8 h-12 w-16 opacity-0 [filter:drop-shadow(0_0_3px_rgba(201,214,227,0.85))]"
    shapeRendering="crispEdges"
  >
    {ravenPixels.map(([x, y, fill]) => (
      <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />
    ))}
  </svg>
)

const RavenHeading = () => {
  const { t } = useTranslation()
  return (
    <header className="flex flex-col items-center gap-3 text-center">
      <span aria-hidden="true" className="chapter-numeral">
        V
      </span>
      <h2 className="journal-title-sm text-parchment">{t('journal.chapters.raven.title')}</h2>
      <p className="mt-2 font-fell text-3xl text-parchment italic md:text-4xl">
        {t('journal.raven.headline')}
      </p>
      <p className="text-lg text-parchment-dim">{t('journal.raven.availability')}</p>
    </header>
  )
}

type LetterProps = {
  readonly copied: boolean
  readonly onCopy: () => void
  readonly buttonRef: RefObject<HTMLButtonElement>
}

const Letter = ({ copied, onCopy, buttonRef }: LetterProps) => {
  const { t } = useTranslation()
  const copiedLabel = t('journal.raven.copied')
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="fell-label">{t('journal.raven.links.email')}</p>
      <button
        ref={buttonRef}
        type="button"
        onClick={onCopy}
        className="break-all text-center font-fell text-2xl text-parchment underline decoration-gold/70 decoration-2 underline-offset-8 transition-colors duration-300 hover:text-ember hover:decoration-ember md:text-4xl"
      >
        {copied ? copiedLabel : email}
      </button>
      <p role="status" aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ''}
      </p>
    </div>
  )
}

const WaxSeals = () => {
  const links = useSealLinks()
  return (
    <ul className="flex items-center justify-center gap-5">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            title={link.value}
            className="flex h-16 w-16 items-center justify-center rounded-[48%_52%_50%_50%] bg-blood font-fell text-2xl text-parchment shadow-[inset_0_-3px_0_rgba(0,0,0,0.4),0_0_0_3px_rgba(139,30,30,0.45),0_6px_14px_rgba(0,0,0,0.55)] transition-colors duration-300 hover:bg-ember"
          >
            <span aria-hidden="true">{link.initial}</span>
            <span className="sr-only">{link.title}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

const RavenStage = () => {
  const { isStatic } = useSceneStage()
  const stageRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const ravenRef = useRef<SVGSVGElement>(null)

  const fly = () => {
    const stage = stageRef.current
    const button = buttonRef.current
    const raven = ravenRef.current
    if (!stage || !button || !raven || !canFly(raven)) return
    const stageBox = stage.getBoundingClientRect()
    const buttonBox = button.getBoundingClientRect()
    const startX = buttonBox.left + buttonBox.width / 2 - stageBox.left
    const startY = buttonBox.top - stageBox.top
    const bleed = isStatic ? 0 : layerBleed(backdropDepths.far)
    const moon = backdropRectToStage(
      { x: belfryMoon.x, y: belfryMoon.y, width: 0, height: 0 },
      { width: stageBox.width, height: stageBox.height },
      BACKDROP_WIDTH,
      bleed
    )
    const dx = moon.x - startX
    const dy = moon.y - startY
    raven.style.left = `${startX}px`
    raven.style.top = `${startY}px`
    animate(
      raven,
      {
        transform: [
          flightTransform(0, 0, 1),
          flightTransform(dx * 0.35, dy * 0.55, 0.8),
          flightTransform(dx, dy, 0.3),
        ],
        opacity: [0, 1, 1, 0],
      },
      { duration: FLIGHT_SECONDS, ease: 'easeInOut' }
    )
  }

  const { copied, copy } = useCopyEmail(fly)

  const letter = <Letter copied={copied} onCopy={copy} buttonRef={buttonRef} />

  if (isStatic) {
    return (
      <div ref={stageRef} className="relative min-h-svh">
        <Backdrop id="belfry" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-night/70" />
        <div className="relative mx-auto flex max-w-[40rem] flex-col items-center gap-10 px-[var(--margin)] pt-[40svh] pb-[30svh]">
          <RavenHeading />
          {letter}
          <WaxSeals />
        </div>
        <RavenSilhouette ravenRef={ravenRef} />
      </div>
    )
  }

  return (
    <div ref={stageRef} className="absolute inset-0">
      <Backdrop id="belfry" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_42%_at_50%_68%,rgba(11,10,15,0.9),rgba(11,10,15,0.6)_65%,transparent)]"
      />
      <div className="absolute inset-x-0 top-[37svh] flex flex-col items-center gap-6 px-[var(--margin)]">
        <SceneReveal start={0.05} end={0.2}>
          <RavenHeading />
        </SceneReveal>
        <SceneReveal start={0.2} end={0.35}>
          {letter}
        </SceneReveal>
        <SceneReveal start={0.3} end={0.45}>
          <WaxSeals />
        </SceneReveal>
      </div>
      <RavenSilhouette ravenRef={ravenRef} />
      <SceneWindow map={fogAtStartOnly}>
        <FogVeil />
      </SceneWindow>
    </div>
  )
}

export const Raven = () => {
  if (!ravenMeta) return null
  return (
    <Scene meta={ravenMeta} className="bg-night">
      <RavenStage />
    </Scene>
  )
}
