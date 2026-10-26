import { Backdrop, CandleFlame } from '@backdrops'
import { mascotBus } from '@mascot'
import { Scene, sceneById } from '@scenes'
import { useTranslation } from 'react-i18next'
import { OWNER_NAME } from '../identity'

const epilogueMeta = sceneById('epilogue')

const textButtonClass =
  'font-fell text-lg text-parchment underline decoration-gold/50 underline-offset-4 transition-colors duration-300 hover:text-ember hover:decoration-ember'

const doATrick = () => {
  mascotBus.emit({ type: 'trick' })
}

const petTheCat = () => {
  mascotBus.emit({ type: 'gesture', name: 'purr' })
  mascotBus.emit({ type: 'quip', key: 'purr' })
}

const EpilogueText = () => {
  const { t } = useTranslation()
  const year = new Date().getFullYear()
  return (
    <footer className="flex flex-col items-center gap-5 text-center">
      <div aria-hidden="true" className="filigree-rule w-[min(80vw,28rem)]" />
      <p className="journal-title-sm text-parchment">{t('journal.epilogue.end')}</p>
      <p className="fell-label">
        © {year} {OWNER_NAME}
      </p>
      <div className="flex items-center gap-8">
        <button type="button" onClick={doATrick} className={textButtonClass}>
          {t('journal.epilogue.trick')}
        </button>
        <button type="button" onClick={petTheCat} className={textButtonClass}>
          {t('journal.epilogue.pet')}
        </button>
      </div>
    </footer>
  )
}

const EpilogueStage = () => (
  <div className="absolute inset-0">
    <Backdrop id="prologue" />
    <CandleFlame />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-night via-night/70 to-transparent"
    />
    <div className="absolute inset-x-0 top-[11svh] px-[var(--margin)]">
      <EpilogueText />
    </div>
  </div>
)

export const Epilogue = () => {
  if (!epilogueMeta) return null
  return (
    <Scene meta={epilogueMeta} className="bg-night">
      <EpilogueStage />
    </Scene>
  )
}
