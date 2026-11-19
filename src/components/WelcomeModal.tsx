import type { FC } from 'react'
import confetti from 'canvas-confetti'
import { Sparkles, Crown, Music } from 'lucide-react'
import { unlockAndPlayAudio } from './AudioPlayer'

interface WelcomeModalProps {
  isOpen: boolean
  onOpenInvite: () => void
}

export const WelcomeModal: FC<WelcomeModalProps> = ({ isOpen, onOpenInvite }) => {
  if (!isOpen) return null

  const handleOpenWithSound = () => {
    // 1. Inicia o áudio imediatamente no contexto do clique do usuário (essencial para iOS Safari)
    unlockAndPlayAudio()

    // 2. Dispara chuva de confetes
    try {
      confetti({
        particleCount: 90,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#fb7185', '#fbbf24', '#c084fc', '#ffffff'],
      })
    } catch (e) {
      console.warn('Efeito de confete não suportado:', e)
    }

    // 3. Notifica o estado principal da aplicação
    onOpenInvite()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-md my-auto max-h-[92dvh] overflow-y-auto bg-gradient-to-b from-white via-pink-50/95 to-amber-50/95 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-200/90 text-center transform transition-all duration-500 scale-100">
        
        {/* Brasão com Foto das Princesas */}
        <div className="relative mx-auto w-24 h-24 -mt-16 mb-3 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-pink-300 to-amber-200 shadow-xl border-4 border-white">
          <div className="w-full h-full rounded-full overflow-hidden bg-pink-100">
            <img
              src="./laura-e-olivia.jpg"
              alt="Laura e Olívia"
              className="w-full h-full object-cover object-[center_35%]"
            />
          </div>
          <div className="absolute -top-2 -right-1 w-8 h-8 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center shadow-md animate-bounce" style={{ animationDuration: '3s' }}>
            <Crown className="w-4 h-4 text-amber-900" />
          </div>
          <Sparkles className="absolute -bottom-1 -left-1 w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        {/* Tag de Chamada */}
        <span className="inline-block px-3.5 py-1 bg-pink-100 text-pink-700 text-[11px] font-bold rounded-full tracking-widest uppercase mb-2">
          Reino Encantado da Disney 🏰✨
        </span>

        {/* Título Principal */}
        <h2 id="modal-title" className="text-3xl font-extrabold text-pink-900 font-serif mb-1">
          Laura & Olívia
        </h2>
        
        <p className="font-script text-2xl sm:text-3xl text-amber-700 mb-3">
          1° Aninho • Princesas da Disney
        </p>

        <p className="text-sm text-stone-600 mb-6 px-2 leading-relaxed font-medium">
          Você foi cordialmente convidado para comemorar o <strong className="text-pink-800 font-bold">1° aninho de vida</strong> de Laura & Olívia em uma tarde mágica no mundo das Princesas da Disney!
        </p>

        {/* Botão Único: Entrar na Festa com Música */}
        <div>
          <button
            onClick={handleOpenWithSound}
            className="w-full group min-h-[54px] py-3.5 px-6 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:via-rose-600 hover:to-amber-600 active:scale-98 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-pink-400/40 transform transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer focus:outline-none focus:ring-4 focus:ring-pink-300"
          >
            <Music className="w-5 h-5 group-hover:animate-bounce" />
            <span>Entrar no Reino da Disney 🎵</span>
            <Sparkles className="w-4 h-4 text-yellow-200" />
          </button>
        </div>

        {/* Rodapé do Modal */}
        <div className="mt-5 pt-3 border-t border-pink-100 text-[11px] sm:text-xs text-pink-700 font-semibold">
          🏰 Salão Castelo Agriões • Sábado, 12/12/2026
        </div>
      </div>
    </div>
  )
}
