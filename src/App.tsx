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
} from '@journal'
import { Mascot } from '@mascot/react'
import { SceneProvider } from '@scenes'

export const App = () => {
  return (
    <SceneProvider>
      <div className="min-h-screen bg-night">
        <div aria-hidden className="paper-grain" />
        <div aria-hidden className="vignette" />
        <div className="relative z-10">
          <Header />
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
        <ChapterRail />
        <MoonProgress />
        <Mascot />
      </div>
    </SceneProvider>
  )
}
