import { useState, useEffect, type FC } from 'react'
import { X, Music2, Sparkles, Play, Pause } from 'lucide-react'
import { getAudioInstance, unlockAndPlayAudio, pauseAudio } from './AudioPlayer'

interface LyricsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const LyricsModal: FC<LyricsModalProps> = ({ isOpen, onClose }) => {
  const [isPlayingTrack, setIsPlayingTrack] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const audio = getAudioInstance()
    setIsPlayingTrack(!audio.paused)

    const handlePlay = () => setIsPlayingTrack(true)
    const handlePause = () => setIsPlayingTrack(false)

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleToggleAudio = () => {
    const audio = getAudioInstance()
    if (audio.paused) {
      unlockAndPlayAudio()
    } else {
      pauseAudio()
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lyrics-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-lg max-h-[88dvh] bg-gradient-to-b from-pink-50 via-rose-50 to-amber-50 rounded-3xl p-5 sm:p-8 shadow-2xl border-2 border-pink-200 overflow-y-auto">
        {/* Botão Fechar com área de toque de 44px+ */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center text-pink-700 bg-white/90 hover:bg-white rounded-full shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer focus:outline-none"
          title="Fechar letra"
          aria-label="Fechar letra"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 rounded-full text-pink-600 mb-2 shadow-inner">
            <Music2 className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-[11px] font-extrabold rounded-full uppercase tracking-wider mb-1">
              Canção Oficial 👑
            </span>
          </div>
          <h3 id="lyrics-title" className="text-2xl sm:text-3xl font-bold text-pink-900 font-serif">
            Festa das Gêmeas
          </h3>
          <p className="text-xs sm:text-sm text-pink-700 font-medium mt-0.5">
            Música especial para Laura & Olívia
          </p>

          {/* Botão de Tocar/Pausar a canção direto na janela da Letra */}
          <div className="mt-3">
            <button
              onClick={handleToggleAudio}
              className="inline-flex items-center gap-2 py-2 px-4 bg-pink-600 hover:bg-pink-700 active:scale-95 text-white text-xs font-bold rounded-full shadow-md transition-all cursor-pointer"
            >
              {isPlayingTrack ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pausar Música</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  <span>Ouvir Música Enquanto Lê 🎵</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Corpo da Letra */}
        <div className="space-y-4 text-center text-sm sm:text-base text-stone-700 font-medium leading-relaxed">
          <div className="p-3 bg-white/80 rounded-2xl border border-pink-100 shadow-xs">
            <p className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-1">✨ Abertura</p>
            <p className="italic text-stone-600 text-xs sm:text-sm">(Batida eletrônica animada)</p>
            <p className="font-bold text-pink-800 text-base sm:text-lg mt-1">"Preparados pra dançar? Um, dois, três, pula!"</p>
          </div>

          <div className="space-y-1.5">
            <p>Levanta a mão pro céu, começa a bater palma</p>
            <p>Hoje é dia de festa, ninguém precisa ter calma!</p>
            <p className="text-pink-700 font-bold">A Laura já chegou fazendo a sua pose</p>
            <p className="text-purple-700 font-bold">E a Olívia vem rodando num vestido cor de rosa!</p>
          </div>

          <div className="p-3 bg-pink-100/70 rounded-xl text-pink-900 font-serif italic text-sm sm:text-base">
            "Se elas estão juntas, a mágica acontece!<br />
            Uma brincadeira que a gente nunca esquece!"
          </div>

          {/* Refrão com destaque */}
          <div className="p-4 bg-gradient-to-r from-pink-200/70 via-amber-100/70 to-purple-200/70 rounded-2xl border border-pink-300 shadow-sm space-y-1.5 font-bold text-pink-950">
            <p className="text-xs text-amber-900 uppercase tracking-wider font-extrabold flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Refrão <Sparkles className="w-3.5 h-3.5" />
            </p>
            <p className="text-base sm:text-lg text-pink-700">👑 Pula, pula, Laura! Dança sem parar!</p>
            <p className="text-base sm:text-lg text-purple-700">✨ Gira, gira, Olívia! Vamos celebrar!</p>
            <p>É a festa das gêmeas, todo mundo quer brincar</p>
            <p className="text-amber-800">Essa dupla fantástica nasceu pra arrasar!</p>
          </div>

          <div className="space-y-1.5">
            <p>Mãozinha na cabeça, pezinho lá no chão</p>
            <p>A Laura e a Olívia seguindo a canção</p>
            <p>Dando muita risada, correndo pra lá e pra cá</p>
            <p className="text-pink-700 font-bold">Com essas duas meninas, a tristeza não tem lugar!</p>
          </div>

          <div className="p-4 bg-gradient-to-r from-pink-200/70 via-amber-100/70 to-purple-200/70 rounded-2xl border border-pink-300 shadow-sm space-y-1.5 font-bold text-pink-950">
            <p className="text-base sm:text-lg text-pink-700">👑 Pula, pula, Laura! Dança sem parar!</p>
            <p className="text-base sm:text-lg text-purple-700">✨ Gira, gira, Olívia! Vamos celebrar!</p>
            <p>É a festa das gêmeas, todo mundo quer brincar</p>
            <p className="text-amber-800">Essa dupla fantástica nasceu pra arrasar!</p>
          </div>

          <div className="p-3 bg-white/80 rounded-2xl border border-pink-100 shadow-xs">
            <p className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-1">🎉 Final Feliz</p>
            <p className="font-bold text-pink-800">"Cansaram? Eu não!"</p>
            <p className="text-stone-700 text-xs sm:text-sm">"Tchau, Laura! Tchau, Olívia! Até a próxima festa!"</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-pink-200 text-center">
          <button
            onClick={onClose}
            className="min-h-[44px] px-7 py-2.5 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-sm rounded-full shadow-lg shadow-pink-300/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            Voltar ao Convite ✨
          </button>
        </div>
      </div>
    </div>
  )
}
