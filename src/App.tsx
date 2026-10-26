import { Header } from '@components'
import {
  Archive,
  Arms,
  ChapterRail,
  City,
  Epilogue,
  Hunter,
  Hunts,
  Lab,
  MoonProgress,
  Prologue,
  Raven,
  SkipToChapters,
} from '@journal'
import { Mascot } from '@mascot/react'
import { SceneProvider } from '@scenes'

export const App = () => {
  return (
    <SceneProvider>
      <div className="min-h-screen bg-night max-md:pb-[var(--dock-height)]">
        <div aria-hidden className="paper-grain" />
        <div aria-hidden className="vignette" />
        <SkipToChapters />
        <div className="relative z-10">
          <Header />
          <ChapterRail />
          <main>
            <Prologue />
            <City />
            <Hunter />
            <Arms />
            <Hunts />
            <Lab />
            <Archive />
            <Raven />
          </main>
          <Epilogue />
        </div>
        <MoonProgress />
        <Mascot />
      </div>
    </SceneProvider>
  )
}
