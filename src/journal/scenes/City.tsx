import { cvPdf } from '@assets'
import { Backdrop } from '@backdrops'
import { DualLabel } from '@components'
import {
  FogVeil,
  Scene,
  SceneCamera,
  SceneReveal,
  sceneById,
  segment,
  useSceneProgress,
} from '@scenes'
import { useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import { useTranslation } from 'react-i18next'
import { GlyphTitle } from '../glyphs'

const cityMeta = sceneById('city')

const EntrySeam = () => {
  const progress = useSceneProgress()
  const opacity = useTransform(progress, (value) => 1 - segment(value, 0, 0.12))
  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-night to-transparent"
      style={{ opacity }}
    />
  )
}

const CityContent = () => {
  const { t } = useTranslation()

  return (
    <div className="grid-page absolute inset-x-0 bottom-0 isolate pb-[max(14svh,var(--cat-reserve))] md:pb-[max(10svh,var(--cat-reserve))]">
      <div aria-hidden="true" className="city-text-scrim" />
      <SceneReveal
        start={0}
        end={0.15}
        exitStart={0.75}
        exitEnd={0.95}
        className="relative z-10 col-span-full flex flex-col items-start gap-6 md:col-span-9"
      >
        <p className="fell-label legible-on-scene text-xs tracking-[0.14em] text-parchment sm:text-sm md:text-base md:tracking-[0.18em]">
          {t('journal.city.role')}
        </p>
        <GlyphTitle
          id="name"
          as="h1"
          size="var(--glyph-name)"
          className="name-title max-w-full text-parchment"
        />
        <p className="max-w-[34rem] text-xl text-parchment md:text-2xl">
          {t('journal.city.tagline')}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a href="#contact" className="btn-seal">
            <DualLabel
              themed={t('journal.city.ctaContact')}
              plain={t('journal.city.ctaContactPlain')}
            />
          </a>
          <a href={cvPdf} download className="btn-ghost-gothic">
            <DualLabel themed={t('journal.city.ctaCv')} plain={t('journal.city.ctaCvPlain')} />
          </a>
        </div>
        <p className="fell-label legible-on-scene flex items-center gap-2 text-parchment">
          <span aria-hidden="true" className="wax-dot" />
          {t('journal.city.availability')}
        </p>
      </SceneReveal>
    </div>
  )
}

export const City = () => {
  if (!cityMeta) return null
  return (
    <Scene meta={cityMeta} className="bg-night">
      <SceneCamera start={0.5} end={1} distance={180} minDepth={0.4}>
        <Backdrop id="city" />
      </SceneCamera>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night/90 via-night/40 to-transparent"
      />
      <CityContent />
      <FogVeil />
      <EntrySeam />
    </Scene>
  )
}
