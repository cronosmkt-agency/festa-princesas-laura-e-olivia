import { useEffect, useState, type FC, type MouseEvent } from 'react'
import {
  Volume2,
  VolumeX,
  Disc3,
  Sparkles,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

interface AudioPlayerProps {
  isPlaying: boolean
  onTogglePlay: () => void
  onOpenLyrics: () => void
}

// Singleton de áudio compartilhado para evitar múltiplas instâncias
// e garantir desbloqueio instantâneo no iOS Safari via clique do usuário
let sharedAudio: HTMLAudioElement | null = null

export const getAudioInstance = (): HTMLAudioElement => {
  if (!sharedAudio && typeof window !== 'undefined') {
    sharedAudio = new Audio('./festa-das-gemeas.mp3')
    sharedAudio.loop = true
    sharedAudio.preload = 'auto'
  }
  return sharedAudio!
}

/**
 * Desbloqueia e inicia a reprodução do áudio sincronamente
 * dentro do contexto de clique do usuário (ex: no clique do WelcomeModal).
 * Essencial para iOS Safari / WebKit.
 */
export const unlockAndPlayAudio = (): Promise<void> | undefined => {
  if (typeof window === 'undefined') return undefined
  try {
    const audio = getAudioInstance()
    const promise = audio.play()
    if (promise !== undefined) {
      promise.catch((err) => {
        console.warn('Reprodução adiada ou aguardando interação:', err)
      })
    }
    return promise
  } catch (err) {
    console.warn('Erro ao desbloquear áudio no gesto do usuário:', err)
  }
}

export const pauseAudio = (): void => {
  if (sharedAudio) {
    sharedAudio.pause()
  }
}

export const AudioPlayer: FC<AudioPlayerProps> = ({
  isPlaying,
  onTogglePlay,
  onOpenLyrics,
}) => {
  const [isMuted, setIsMuted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Sincronização do áudio com estado isPlaying e registro do MediaSession
  useEffect(() => {
    const audio = getAudioInstance()

    if (isPlaying) {
      if (audio.paused) {
        audio.play().catch((err) => {
          console.warn('Autoplay bloqueado pelo navegador até interação:', err)
        })
      }
    } else {
      audio.pause()
    }

    // Configuração do MediaSession para tela de bloqueio e centrais de controle móveis
    if ('mediaSession' in navigator && typeof window !== 'undefined') {
      try {
        const origin = window.location.origin
        const basePath = window.location.pathname.replace(/\/[^/]*$/, '/')
        const resolveUrl = (file: string) => new URL(file, origin + basePath).href

        navigator.mediaSession.metadata = new MediaMetadata({
          title: 'Festa das Gêmeas 👑',
          artist: 'Laura & Olívia',
          album: '1° Aninho das Princesas',
          artwork: [
            { src: resolveUrl('laura-e-olivia.jpg'), sizes: '512x512', type: 'image/jpeg' },
            { src: resolveUrl('cover.jpg'), sizes: '192x192', type: 'image/jpeg' },
            { src: resolveUrl('hero-princesas.jpg'), sizes: '512x512', type: 'image/jpeg' },
          ],
        })

        navigator.mediaSession.setActionHandler('play', () => {
          if (!isPlaying) onTogglePlay()
        })
        navigator.mediaSession.setActionHandler('pause', () => {
          if (isPlaying) onTogglePlay()
        })
        navigator.mediaSession.setActionHandler('stop', () => {
          if (isPlaying) onTogglePlay()
        })

        navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused'
      } catch (err) {
        console.warn('Erro ao configurar navigator.mediaSession:', err)
      }
    }

    const handleTimeUpdate = () => {
      if (
        'mediaSession' in navigator &&
        'setPositionState' in navigator.mediaSession &&
        audio.duration &&
        !isNaN(audio.duration) &&
        isFinite(audio.duration)
      ) {
        try {
          navigator.mediaSession.setPositionState({
            duration: audio.duration,
            playbackRate: audio.playbackRate || 1,
            position: audio.currentTime || 0,
          })
        } catch {
          // Navegador pode rejeitar se duration for temporariamente inválida
        }
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [isPlaying, onTogglePlay])

  // Alterna o mudo sem parar a reprodução
  const toggleMute = (e: MouseEvent) => {
    e.stopPropagation()
    const audio = getAudioInstance()
    const nextMuted = !isMuted
    audio.muted = nextMuted
    setIsMuted(nextMuted)
  }

  return (
    <aside
      aria-label="Controles de música do evento"
      className="fixed z-40 transition-all duration-300 ease-out"
      style={{
        bottom: 'calc(14px + env(safe-area-inset-bottom, 0px))',
        right: 'calc(14px + env(safe-area-inset-right, 0px))',
        maxWidth: 'calc(100vw - 28px)',
      }}
    >
      {isCollapsed ? (
        /* Modo Compacto Minimizado: Pequeno botão flutuante para não obstruir a tela */
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollapsed(false)}
            className="flex items-center gap-2 p-2.5 bg-white/95 hover:bg-pink-50 text-pink-700 rounded-full shadow-2xl border-2 border-pink-300/80 backdrop-blur-md cursor-pointer transition-transform hover:scale-105 active:scale-95 group"
            title="Expandir tocador de música"
            aria-label="Expandir tocador da música"
          >
            <div className="relative flex items-center justify-center">
              <Disc3
                className={`w-7 h-7 text-pink-600 ${isPlaying ? 'animate-spin' : ''}`}
                style={{ animationDuration: '3.5s' }}
              />
              {isPlaying && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white animate-ping" />
              )}
            </div>
            <span className="text-xs font-bold text-pink-800 pr-1 flex items-center gap-1">
              <span>Música</span>
              <ChevronUp className="w-3.5 h-3.5 text-pink-500 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </button>
        </div>
      ) : (
        /* Modo Padrão Flutuante: Responsivo, com atalhos de letra e áudio */
        <div className="flex items-center gap-2">
          {/* Botão de Ver Letra em Telas Maiores */}
          <button
            onClick={onOpenLyrics}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2.5 bg-white/95 hover:bg-pink-50 text-pink-700 text-xs font-bold rounded-full shadow-lg border border-pink-200/90 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            title="Ver a letra da canção de Laura & Olívia"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Letra da Canção</span>
          </button>

          {/* Card Flutuante Principal */}
          <div className="flex items-center gap-2 py-1.5 px-2.5 bg-white/95 rounded-full shadow-xl border border-pink-300/80 backdrop-blur-md hover:shadow-pink-300/40 transition-all duration-300">
            {/* Botão Play/Pause principal com ícone giratório */}
            <button
              onClick={onTogglePlay}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-pink-50 transition-colors cursor-pointer text-left focus:outline-none"
              title={isPlaying ? 'Pausar Canção' : 'Tocar Canção'}
              aria-label={isPlaying ? 'Pausar Canção' : 'Tocar Canção'}
            >
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600">
                <Disc3
                  className={`w-6 h-6 text-pink-600 transition-transform ${
                    isPlaying ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: '4s' }}
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 hover:opacity-100 transition-opacity text-white">
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                </span>
                {isPlaying && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full border border-white animate-ping" />
                )}
              </div>

              {/* Informações da Canção */}
              <div className="text-left max-w-[110px] sm:max-w-[140px] truncate">
                <p className="text-[11px] font-extrabold text-pink-900 leading-tight truncate">
                  Festa das Gêmeas
                </p>
                <p className="text-[9px] text-amber-600 font-semibold truncate">
                  Laura & Olívia 👑
                </p>
              </div>

              {/* Equalizador animado quando tocando */}
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-3.5 px-1">
                  <span className="w-1 bg-pink-500 rounded-full animate-bounce h-2" style={{ animationDuration: '0.6s' }} />
                  <span className="w-1 bg-amber-500 rounded-full animate-bounce h-3.5" style={{ animationDuration: '0.9s' }} />
                  <span className="w-1 bg-purple-500 rounded-full animate-bounce h-2.5" style={{ animationDuration: '0.7s' }} />
                </div>
              )}
            </button>

            {/* Acesso rápido à Letra em telas móveis */}
            <button
              onClick={onOpenLyrics}
              className="sm:hidden p-2 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors cursor-pointer"
              title="Ver letra da música"
              aria-label="Ver letra da música"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            </button>

            {/* Botão de Mudo */}
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 transition-colors cursor-pointer"
              title={isMuted ? 'Ativar som' : 'Silenciar'}
              aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Botão para minimizar o player e liberar espaço na tela */}
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
              title="Minimizar tocador"
              aria-label="Minimizar tocador"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
