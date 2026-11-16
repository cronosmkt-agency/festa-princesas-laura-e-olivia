import type { FC } from 'react'
import confetti from 'canvas-confetti'
import { Sparkles, Crown, Music } from 'lucide-react'

interface WelcomeModalProps {
  isOpen: boolean
  onOpenInvite: (withSound: boolean) => void
}

export const WelcomeModal: FC<WelcomeModalProps> = ({ isOpen, onOpenInvite }) => {
  if (!isOpen) return null

  const handleOpenWithSound = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#fb7185', '#fbbf24', '#c084fc', '#ffffff'],
      })
    } catch (e) {
      console.warn(e)
    }
    onOpenInvite(true)
  }

  const handleOpenSilent = () => {
    onOpenInvite(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-white via-pink-50/90 to-amber-50/90 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-200/90 text-center transform transition-all duration-500 scale-100">
        
        {/* Brasão / Coroa Superior */}
        <div className="relative mx-auto w-20 h-20 -mt-14 mb-4 flex items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-100 shadow-xl border-4 border-white">
          <Crown className="w-10 h-10 text-amber-800 animate-pulse-subtle" />
          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
        </div>

        {/* Tag de Chamada */}
        <span className="inline-block px-3.5 py-1 bg-pink-100 text-pink-700 text-[11px] font-bold rounded-full tracking-widest uppercase mb-2">
          Decreto Real de Aniversário 📜
        </span>

        {/* Título Principal */}
        <h2 className="text-3xl font-extrabold text-pink-900 font-serif mb-1">
          Convite Real
        </h2>
        
        <p className="font-script text-2xl text-amber-700 mb-3">
          Laura & Olívia
        </p>

        <p className="text-sm text-stone-600 mb-6 px-2 leading-relaxed font-medium">
          Você foi cordialmente convidado para comemorar o <strong className="text-pink-800">1º Aninho de Vida</strong> das nossas pequenas princesas em um dia mágico e inesquecível!
        </p>

        {/* Botões de Ação */}
        <div className="space-y-3">
          <button
            onClick={handleOpenWithSound}
            className="w-full group py-4 px-6 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:via-rose-600 hover:to-amber-600 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-pink-400/40 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Music className="w-5 h-5 group-hover:animate-bounce" />
            <span>Abrir Convite com Música 🎵</span>
            <Sparkles className="w-4 h-4 text-yellow-200" />
          </button>

          <button
            onClick={handleOpenSilent}
            className="w-full py-2.5 px-4 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          >
            Abrir sem música
          </button>
        </div>

        {/* Rodapé do Modal */}
        <div className="mt-5 pt-3 border-t border-pink-100 text-[11px] text-pink-600 font-medium">
          🏰 Salão Castelo Agriões • 12/12/2026
        </div>
      </div>
    </div>
  )
}
