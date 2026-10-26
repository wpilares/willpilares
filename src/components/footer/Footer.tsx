import { mascotBus } from '@mascot'
import { useTranslation } from 'react-i18next'

const playfulButtonClass =
  'underline decoration-paper/40 underline-offset-4 transition-colors duration-300 hover:text-paper hover:decoration-blue'

export const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { t } = useTranslation()

  const doATrick = () => {
    mascotBus.emit({ type: 'trick' })
  }

  const sayHi = () => {
    mascotBus.emit({ type: 'gesture', name: 'wave' })
  }

  return (
    <footer className="border-t border-paper/10 bg-ink text-paper/70 grid-page py-8 text-sm">
      <div className="col-span-full flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {currentYear} Willber Pilares · {t('footer.rights')}
        </p>

        <div className="flex items-center gap-6">
          <button type="button" onClick={doATrick} className={playfulButtonClass}>
            {t('footer.doATrick')}
          </button>
          <button type="button" onClick={sayHi} className={playfulButtonClass}>
            {t('footer.sayHi')}
          </button>
        </div>
      </div>
    </footer>
  )
}
