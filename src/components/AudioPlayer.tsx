import { useEffect, useRef, useState, type FC, type MouseEvent } from 'react'
import { Volume2, VolumeX, Disc3, Sparkles } from 'lucide-react'

interface AudioPlayerProps {
  isPlaying: boolean
  onTogglePlay: () => void
  onOpenLyrics: () => void
}

export const AudioPlayer: FC<AudioPlayerProps> = ({
  isPlaying,
  onTogglePlay,
  onOpenLyrics,
}) => {
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio('/festa-das-gemeas.mp3')
      audio.loop = true
      audio.preload = 'auto'
      audioRef.current = audio
    }

    const audio = audioRef.current

    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn('Autoplay blocked or waiting for user gesture:', err)
      })
    } else {
      audio.pause()
    }
  }, [isPlaying])

  const toggleMute = (e: MouseEvent) => {
    e.stopPropagation()
    if (!audioRef.current) return
    const nextMuted = !isMuted
    audioRef.current.muted = nextMuted
    setIsMuted(nextMuted)
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
      {/* Botão de Ver Letra */}
      <button
        onClick={onOpenLyrics}
        className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-white/90 hover:bg-pink-50 text-pink-700 text-xs font-semibold rounded-full shadow-lg border border-pink-200 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        title="Ver a letra da canção de Laura & Olívia"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
        <span>Letra da Canção Real</span>
      </button>

      {/* Widget Flutuante Principal */}
      <div
        className="flex items-center gap-2 p-1.5 pl-3 bg-white/95 rounded-full shadow-xl border border-pink-200/80 backdrop-blur-md cursor-pointer hover:shadow-pink-300/40 transition-all duration-300 group"
        onClick={onTogglePlay}
        title={isPlaying ? 'Pausar Canção Real' : 'Tocar Canção Real'}
      >
        <div className="flex items-center gap-2">
          {/* Ícone de Disco Girando */}
          <div className="relative">
            <Disc3
              className={`w-7 h-7 text-pink-500 transition-transform ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '4s' }}
            />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white animate-ping" />
            )}
          </div>

          <div className="hidden xs:block text-left pr-1">
            <p className="text-[11px] font-bold text-pink-700 leading-tight">Festa das Gêmeas</p>
            <p className="text-[9px] text-amber-600 font-medium">Laura & Olívia 👑</p>
          </div>

          {/* Equalizador animado quando tocando */}
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-3.5 px-1">
              <span className="w-1 bg-pink-400 rounded-full animate-bounce h-2" style={{ animationDuration: '0.6s' }} />
              <span className="w-1 bg-amber-400 rounded-full animate-bounce h-3.5" style={{ animationDuration: '0.9s' }} />
              <span className="w-1 bg-purple-400 rounded-full animate-bounce h-2.5" style={{ animationDuration: '0.7s' }} />
            </div>
          )}
        </div>

        {/* Botão de Mudo */}
        <button
          onClick={toggleMute}
          className="p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 transition-colors"
          title={isMuted ? 'Ativar som' : 'Silenciar'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}
