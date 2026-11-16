import { useEffect, useState, type FC } from 'react'
import { Sparkles, Hourglass } from 'lucide-react'

export const Countdown: FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  })

  useEffect(() => {
    // 12 de Dezembro de 2026 às 15:30h (Horário de Brasília)
    const targetDate = new Date(2026, 11, 12, 15, 30, 0).getTime()

    const calculateTime = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true })
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds, isPassed: false })
    }

    calculateTime()
    const interval = setInterval(calculateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-8 px-4 max-w-4xl mx-auto text-center">
      <div className="bg-gradient-to-r from-pink-100/80 via-white to-pink-100/80 rounded-3xl p-6 sm:p-8 shadow-xl border border-pink-200/80 backdrop-blur-md">
        
        <div className="inline-flex items-center gap-2 text-pink-700 text-xs font-bold tracking-widest uppercase mb-3">
          <Hourglass className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '10s' }} />
          <span>Contagem Regressiva para a Festa Real</span>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-pink-900 font-serif mb-6">
          O Grande Dia Está Chegando! ⏳
        </h2>

        {timeLeft.isPassed ? (
          <div className="p-4 bg-pink-50 rounded-2xl text-pink-800 font-bold text-lg">
            🎉 O grande dia chegou! Vamos celebrar as princesas! 🎉
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
            {/* Dias */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white shadow-md border border-pink-100 transform transition-transform hover:-translate-y-1">
              <span className="block text-2xl sm:text-4xl font-extrabold text-pink-600 font-serif">
                {timeLeft.days}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Dias
              </span>
            </div>

            {/* Horas */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white shadow-md border border-pink-100 transform transition-transform hover:-translate-y-1">
              <span className="block text-2xl sm:text-4xl font-extrabold text-amber-600 font-serif">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Horas
              </span>
            </div>

            {/* Minutos */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white shadow-md border border-pink-100 transform transition-transform hover:-translate-y-1">
              <span className="block text-2xl sm:text-4xl font-extrabold text-purple-600 font-serif">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Min
              </span>
            </div>

            {/* Segundos */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white shadow-md border border-pink-100 transform transition-transform hover:-translate-y-1">
              <span className="block text-2xl sm:text-4xl font-extrabold text-rose-500 font-serif">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Seg
              </span>
            </div>
          </div>
        )}

        <p className="mt-4 text-xs sm:text-sm text-stone-600 font-medium">
          Sábado, 12 de Dezembro de 2026 às 15:30h pontual!
        </p>
      </div>
    </section>
  )
}
