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
    <section className="py-6 sm:py-8 px-3 min-[380px]:px-4 max-w-4xl mx-auto text-center">
      <div className="bg-gradient-to-r from-pink-100/80 via-white to-pink-100/80 rounded-2xl min-[380px]:rounded-3xl p-4 min-[380px]:p-6 sm:p-8 shadow-xl border border-pink-200/80 backdrop-blur-md">
        
        <div className="inline-flex items-center gap-1.5 sm:gap-2 text-pink-700 text-[11px] min-[380px]:text-xs font-bold tracking-wider sm:tracking-widest uppercase mb-2.5 sm:mb-3 max-w-full flex-wrap justify-center">
          <Hourglass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 animate-spin shrink-0" style={{ animationDuration: '10s' }} />
          <span>Contagem Regressiva • Baile das Princesas da Disney</span>
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
        </div>

        <h2 className="text-xl min-[380px]:text-2xl sm:text-3xl font-bold text-pink-900 font-serif mb-5 sm:mb-6 leading-snug">
          O Grande Dia Está Chegando! ⏳
        </h2>

        {timeLeft.isPassed ? (
          <div className="p-4 bg-pink-50 rounded-2xl text-pink-800 font-bold text-base sm:text-lg">
            🎉 O grande dia chegou! Vamos celebrar as princesas da Disney Laura & Olívia! 🎉
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-1.5 min-[380px]:gap-2.5 sm:gap-4 max-w-lg mx-auto">
            {/* Dias */}
            <div className="p-2 min-[380px]:p-3 sm:p-4 rounded-xl min-[380px]:rounded-2xl bg-white shadow-md border border-pink-100 transform transition-transform hover:-translate-y-1 flex flex-col justify-center min-h-[68px] sm:min-h-[88px]">
              <span className="block text-xl min-[380px]:text-2xl sm:text-4xl font-extrabold text-pink-600 font-serif leading-tight">
                {timeLeft.days}
              </span>
              <span className="text-[10px] min-[380px]:text-[11px] sm:text-xs font-semibold text-stone-500 uppercase tracking-wider mt-0.5">
                Dias
              </span>
            </div>

            {/* Horas */}
            <div className="p-2 min-[380px]:p-3 sm:p-4 rounded-xl min-[380px]:rounded-2xl bg-white shadow-md border border-pink-100 transform transition-transform hover:-translate-y-1 flex flex-col justify-center min-h-[68px] sm:min-h-[88px]">
              <span className="block text-xl min-[380px]:text-2xl sm:text-4xl font-extrabold text-amber-600 font-serif leading-tight">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] min-[380px]:text-[11px] sm:text-xs font-semibold text-stone-500 uppercase tracking-wider mt-0.5">
                Horas
              </span>
            </div>

            {/* Minutos */}
            <div className="p-2 min-[380px]:p-3 sm:p-4 rounded-xl min-[380px]:rounded-2xl bg-white shadow-md border border-pink-100 transform transition-transform hover:-translate-y-1 flex flex-col justify-center min-h-[68px] sm:min-h-[88px]">
              <span className="block text-xl min-[380px]:text-2xl sm:text-4xl font-extrabold text-purple-600 font-serif leading-tight">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] min-[380px]:text-[11px] sm:text-xs font-semibold text-stone-500 uppercase tracking-wider mt-0.5">
                Min
              </span>
            </div>

            {/* Segundos */}
            <div className="p-2 min-[380px]:p-3 sm:p-4 rounded-xl min-[380px]:rounded-2xl bg-white shadow-md border border-pink-100 transform transition-transform hover:-translate-y-1 flex flex-col justify-center min-h-[68px] sm:min-h-[88px]">
              <span className="block text-xl min-[380px]:text-2xl sm:text-4xl font-extrabold text-rose-500 font-serif leading-tight">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] min-[380px]:text-[11px] sm:text-xs font-semibold text-stone-500 uppercase tracking-wider mt-0.5">
                Seg
              </span>
            </div>
          </div>
        )}

        <p className="mt-4 sm:mt-5 text-xs sm:text-sm text-stone-600 font-medium leading-relaxed px-2">
          Sábado, 12 de Dezembro de 2026 às 15:30h pontual!
        </p>
      </div>
    </section>
  )
}
