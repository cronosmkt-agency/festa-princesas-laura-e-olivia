import type { FC } from 'react'
import { Sparkles, Calendar, Clock, MapPin, Heart, ChevronDown, Music } from 'lucide-react'

interface HeroProps {
  onScrollToRSVP: () => void
  onScrollToLocation: () => void
  onOpenLyrics: () => void
}

export const Hero: FC<HeroProps> = ({
  onScrollToRSVP,
  onScrollToLocation,
  onOpenLyrics,
}) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 text-center">
      {/* Decorações de fundo e partículas */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-pink-200/50 via-pink-100/30 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Badge Superior */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-pink-100 via-amber-50 to-pink-100 rounded-full border border-pink-200 shadow-sm mb-4 animate-float">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs sm:text-sm font-bold text-pink-800 tracking-wider uppercase">
            Festa das Princesas • 1º Aninho Real
          </span>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>

        {/* Nomes das Princesas */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-pink-900 font-serif tracking-tight mb-2">
          Laura & Olívia
        </h1>

        <p className="font-script text-3xl sm:text-4xl md:text-5xl text-amber-600 mb-6 drop-shadow-sm">
          Um ano de pura doçura e alegria!
        </p>

        {/* Imagem das Princesas em Moldura Real */}
        <div className="relative max-w-2xl mx-auto mb-8 rounded-3xl p-2 sm:p-3 bg-gradient-to-tr from-amber-300 via-pink-200 to-amber-200 shadow-2xl royal-shadow transform transition-all duration-500 hover:scale-[1.01]">
          <div className="overflow-hidden rounded-2xl relative group">
            <img
              src="./hero-princesas.jpg"
              alt="Princesas Laura e Olívia - 1º Aninho"
              className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay sutil */}
            <div className="absolute inset-0 bg-gradient-to-t from-pink-950/40 via-transparent to-transparent pointer-events-none" />
            
            {/* Selo no canto da imagem */}
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-pink-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
              <span className="text-xs font-bold text-pink-900">12/12/2026 • Castelo Agriões</span>
            </div>
          </div>
        </div>

        {/* Informações Rápidas em Destaque */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8">
          <div className="p-3.5 rounded-2xl bg-white/80 border border-pink-100 shadow-sm backdrop-blur-sm flex items-center justify-center gap-3">
            <div className="p-2 rounded-xl bg-pink-100 text-pink-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-stone-400">Data Real</p>
              <p className="text-sm font-bold text-stone-800">12 de Dezembro, 2026</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 border border-pink-100 shadow-sm backdrop-blur-sm flex items-center justify-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-stone-400">Horário</p>
              <p className="text-sm font-bold text-stone-800">Às 15:30h</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 border border-pink-100 shadow-sm backdrop-blur-sm flex items-center justify-center gap-3">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-stone-400">Local</p>
              <p className="text-sm font-bold text-stone-800">Salão Castelo Agriões</p>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
          <button
            onClick={onScrollToRSVP}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-base rounded-full shadow-lg shadow-pink-300/60 transform transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Heart className="w-5 h-5 fill-white text-white" />
            <span>Confirmar Presença (RSVP)</span>
          </button>

          <button
            onClick={onScrollToLocation}
            className="w-full sm:w-auto px-6 py-3.5 bg-white/90 hover:bg-pink-50 text-pink-700 font-bold text-base rounded-full shadow-md border border-pink-200 transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            Ver Localização
          </button>

          <button
            onClick={onOpenLyrics}
            className="w-full sm:w-auto px-5 py-3.5 bg-pink-100/80 hover:bg-pink-200 text-pink-800 font-bold text-sm rounded-full border border-pink-200 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Music className="w-4 h-4 text-pink-600" />
            <span>Canção Real</span>
          </button>
        </div>

        {/* Indicador de rolagem */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={onScrollToRSVP}
            className="text-pink-400 hover:text-pink-600 transition-colors animate-bounce cursor-pointer"
            aria-label="Rolar para o formulário de confirmação"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>

      </div>
    </section>
  )
}
