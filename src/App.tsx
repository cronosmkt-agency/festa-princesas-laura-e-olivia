import { useState, useEffect } from 'react'
import { WelcomeModal } from './components/WelcomeModal'
import { AudioPlayer, unlockAndPlayAudio } from './components/AudioPlayer'
import { LyricsModal } from './components/LyricsModal'
import { OrganizerModal } from './components/OrganizerModal'
import { Hero } from './components/Hero'
import { Countdown } from './components/Countdown'
import { EventDetails } from './components/EventDetails'
import { RSVPForm } from './components/RSVPForm'
import { Footer } from './components/Footer'
import type { RSVPData } from './types'

export function App() {
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLyricsOpen, setIsLyricsOpen] = useState(false)
  const [isOrganizerOpen, setIsOrganizerOpen] = useState(false)

  // Iniciar a música cantando imediatamente assim que abrir o site
  useEffect(() => {
    // 1. Tentar iniciar o áudio direto no carregamento se o navegador permitir
    const audioPromise = unlockAndPlayAudio()
    if (audioPromise) {
      audioPromise
        .then(() => {
          setIsPlaying(true)
          setIsWelcomeOpen(false)
        })
        .catch(() => {
          // Autoplay com som bloqueado por política de segurança do browser até o primeiro toque
        })
    }

    // 2. No primeiríssimo clique ou toque na tela em qualquer lugar, desbloquear áudio e tocar
    const handleFirstGesture = () => {
      unlockAndPlayAudio()
      setIsPlaying(true)
      setIsWelcomeOpen(false)
    }

    window.addEventListener('click', handleFirstGesture, { once: true })
    window.addEventListener('touchstart', handleFirstGesture, { once: true })

    return () => {
      window.removeEventListener('click', handleFirstGesture)
      window.removeEventListener('touchstart', handleFirstGesture)
    }
  }, [])

  const handleOpenInvite = () => {
    unlockAndPlayAudio()
    setIsWelcomeOpen(false)
    setIsPlaying(true)
  }

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev)
  }

  const handleScrollToRSVP = () => {
    const el = document.getElementById('rsvp')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleScrollToLocation = () => {
    const el = document.getElementById('local')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleRSVPSubmitted = (rsvp: RSVPData) => {
    console.log('Novo RSVP registrado:', rsvp)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/60 via-pink-50/30 to-amber-50/40 text-stone-800 relative selection:bg-pink-300 selection:text-white">
      {/* Modal de Abertura do Convite (Sem opção de silêncio, entra cantando) */}
      <WelcomeModal
        isOpen={isWelcomeOpen}
        onOpenInvite={handleOpenInvite}
      />

      {/* Player Flutuante da Música Oficial */}
      <AudioPlayer
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onOpenLyrics={() => setIsLyricsOpen(true)}
      />

      {/* Modal da Letra de "Festa das Gêmeas" */}
      <LyricsModal
        isOpen={isLyricsOpen}
        onClose={() => setIsLyricsOpen(false)}
      />

      {/* Painel do Organizador para Carina */}
      <OrganizerModal
        isOpen={isOrganizerOpen}
        onClose={() => setIsOrganizerOpen(false)}
      />

      {/* Conteúdo Principal do Site */}
      <main className="relative z-10">
        <Hero
          onScrollToRSVP={handleScrollToRSVP}
          onScrollToLocation={handleScrollToLocation}
          onOpenLyrics={() => setIsLyricsOpen(true)}
        />

        <Countdown />

        <EventDetails />

        <RSVPForm
          onRSVPSubmitted={handleRSVPSubmitted}
        />
      </main>

      {/* Rodapé com acesso ao Painel da Família */}
      <Footer
        onOpenOrganizer={() => setIsOrganizerOpen(true)}
      />
    </div>
  )
}

export default App
