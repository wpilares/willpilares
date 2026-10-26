import { Backdrop } from '@backdrops'
import { FogVeil, Scene, SceneReveal, sceneById, useSceneStage } from '@scenes'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'

const archiveMeta = sceneById('archive')

const BOOKS_START = 0.1
const BOOKS_END = 0.5

type VolumeKey = 'designSystem' | 'mcp' | 'identity'

type Volume = {
  readonly key: VolumeKey
  readonly leather: string
  readonly height: string
}

const volumes: readonly Volume[] = [
  { key: 'designSystem', leather: '#8b1e1e', height: '22rem' },
  { key: 'mcp', leather: '#5c4024', height: '24rem' },
  { key: 'identity', leather: '#2c2833', height: '21rem' },
]

const bookSpan = (BOOKS_END - BOOKS_START) / volumes.length

const leatherStyle = (leather: string) => ({
  backgroundColor: leather,
  backgroundImage:
    'linear-gradient(90deg, rgba(0, 0, 0, 0.45) 0%, rgba(255, 255, 255, 0.08) 18%, transparent 40%, transparent 78%, rgba(0, 0, 0, 0.5) 100%)',
})

const ArchiveHeading = () => {
  const { t } = useTranslation()
  return (
    <header className="flex flex-col items-center gap-2 text-center">
      <p className="fell-label">{t('journal.archive.label')}</p>
      <h2 className="journal-title-sm text-parchment">{t('journal.archive.title')}</h2>
    </header>
  )
}

const Padlock = () => (
  <svg viewBox="0 0 20 24" aria-hidden="true" className="h-6 w-5">
    <path d="M5 10 V7 a5 5 0 0 1 10 0 V10" fill="none" stroke="#b08d57" strokeWidth={2.5} />
    <rect x={2} y={10} width={16} height={13} rx={2} fill="#b08d57" stroke="#5c4024" />
    <circle cx={10} cy={15} r={2} fill="#0b0a0f" />
    <rect x={9} y={16} width={2} height={4} fill="#0b0a0f" />
  </svg>
)

const WaxSeal = ({ className }: { className?: string }) => {
  const { t } = useTranslation()
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[46%_54%_50%_50%] bg-blood px-2.5 py-1.5 text-center font-fell text-xs leading-tight text-parchment shadow-[inset_0_-2px_0_rgba(0,0,0,0.4),0_0_0_2px_rgba(139,30,30,0.4),0_3px_6px_rgba(0,0,0,0.5)] ${className ?? ''}`.trim()}
    >
      {t('journal.archive.comingSoon')}
    </span>
  )
}

const GoldBands = () => (
  <>
    <span aria-hidden="true" className="absolute inset-x-0 top-5 h-1 bg-gold/80" />
    <span aria-hidden="true" className="absolute inset-x-0 top-7 h-px bg-gold/60" />
    <span aria-hidden="true" className="absolute inset-x-0 bottom-7 h-px bg-gold/60" />
    <span aria-hidden="true" className="absolute inset-x-0 bottom-5 h-1 bg-gold/80" />
  </>
)

const ShelvedBook = ({ volume, order }: { volume: Volume; order: number }) => {
  const { t } = useTranslation()
  const noteId = useId()
  return (
    <li className="group relative">
      <SceneReveal
        start={BOOKS_START + order * bookSpan}
        end={BOOKS_START + (order + 1) * bookSpan}
        className="flex flex-col items-center"
      >
        <button
          type="button"
          aria-describedby={noteId}
          data-volume={volume.key}
          className="relative flex w-24 origin-bottom-left flex-col items-center justify-between rounded-[3px] px-2 py-10 transition-transform duration-500 group-hover:-rotate-[7deg] focus-visible:-rotate-[7deg] focus-visible:ring-offset-4 md:w-28"
          style={{ ...leatherStyle(volume.leather), height: volume.height }}
        >
          <GoldBands />
          <Padlock />
          <span
            className="font-fell text-xl leading-tight text-gold [text-shadow:0_1px_0_rgba(0,0,0,0.6)]"
            style={{ writingMode: 'vertical-rl' }}
          >
            {t(`journal.archive.volumes.${volume.key}.title`)}
          </span>
          <WaxSeal className="w-20" />
        </button>
        <p
          id={noteId}
          className="pointer-events-none absolute top-full left-1/2 mt-6 w-52 -translate-x-1/2 text-center font-fell text-lg leading-snug text-parchment italic opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-has-[:focus-visible]:opacity-100"
        >
          {t(`journal.archive.volumes.${volume.key}.note`)}
        </p>
      </SceneReveal>
    </li>
  )
}

const VolumeCard = ({ volume }: { volume: Volume }) => {
  const { t } = useTranslation()
  return (
    <li
      data-volume={volume.key}
      className="iron-frame flex items-stretch gap-5 bg-night/85 p-4 text-parchment"
    >
      <span
        aria-hidden="true"
        className="relative flex w-14 shrink-0 flex-col items-center justify-start rounded-[3px] py-8"
        style={leatherStyle(volume.leather)}
      >
        <GoldBands />
        <Padlock />
      </span>
      <div className="flex flex-col items-start gap-2">
        <h3 className="font-fell text-2xl leading-tight text-gold">
          {t(`journal.archive.volumes.${volume.key}.title`)}
        </h3>
        <p className="text-lg leading-snug">{t(`journal.archive.volumes.${volume.key}.note`)}</p>
        <WaxSeal />
      </div>
    </li>
  )
}

const PinnedArchive = () => (
  <>
    <Backdrop id="archive" />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_48%_70%_at_50%_55%,rgba(11,10,15,0.82),rgba(11,10,15,0.45)_70%,transparent)]"
    />
    <div className="absolute inset-x-0 top-[9svh] bottom-[5svh] flex flex-col items-center gap-8 px-[var(--margin)]">
      <SceneReveal start={0} end={0.1}>
        <ArchiveHeading />
      </SceneReveal>
      <div className="flex flex-col items-center">
        <ul className="flex items-end gap-10 px-10" data-archive-shelf>
          {volumes.map((volume, order) => (
            <ShelvedBook key={volume.key} volume={volume} order={order} />
          ))}
        </ul>
        <div
          aria-hidden="true"
          className="h-3 w-full bg-[#5c4024] shadow-[inset_0_2px_0_rgba(233,223,200,0.18),0_10px_18px_rgba(0,0,0,0.7)]"
        />
      </div>
    </div>
    <FogVeil />
  </>
)

const StaticArchive = () => (
  <>
    <Backdrop id="archive" />
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-night/80" />
    <div className="relative mx-auto flex max-w-[40rem] flex-col gap-8 px-[var(--margin)] pt-[12svh] pb-[20svh]">
      <ArchiveHeading />
      <ul className="flex flex-col gap-6">
        {volumes.map((volume) => (
          <VolumeCard key={volume.key} volume={volume} />
        ))}
      </ul>
    </div>
  </>
)

const ArchiveStage = () => {
  const { isStatic } = useSceneStage()
  return isStatic ? <StaticArchive /> : <PinnedArchive />
}

export const Archive = () => {
  if (!archiveMeta) return null
  return (
    <Scene meta={archiveMeta} className="bg-night">
      <ArchiveStage />
    </Scene>
  )
}
