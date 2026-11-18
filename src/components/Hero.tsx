import { useState, type FC } from 'react'
import { Sparkles, Calendar, Clock, MapPin, Heart, ChevronDown, Music, Image as ImageIcon, Castle } from 'lucide-react'

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
  const [photoView, setPhotoView] = useState<'real' | 'castle'>('real')

  return (
    <section className="relative overflow-hidden pt-5 pb-10 sm:pt-10 sm:pb-16 text-center">
      {/* Decorações de fundo e partículas */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-pink-200/50 via-pink-100/30 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Borboletas decorativas sutis inspiradas na foto oficial */}
      <div className="absolute top-8 left-4 sm:left-12 text-2xl opacity-75 animate-float pointer-events-none">
        🦋
      </div>
      <div className="absolute top-20 right-4 sm:right-16 text-xl opacity-75 animate-float pointer-events-none" style={{ animationDelay: '2s' }}>
        🌸
      </div>

      <div className="max-w-4xl mx-auto px-3 min-[380px]:px-4 sm:px-6">
        
        {/* Badge Superior */}
        <div className="inline-flex items-center gap-1.5 min-[380px]:gap-2 px-3 min-[380px]:px-4 py-1.5 bg-gradient-to-r from-pink-100 via-amber-50 to-pink-100 rounded-full border border-pink-200 shadow-sm mb-3 sm:mb-4 animate-float max-w-full">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
          <span className="text-[11px] min-[380px]:text-xs sm:text-sm font-bold text-pink-800 tracking-wider uppercase truncate">
            Festa das Princesas • 1° Aninho
          </span>
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
        </div>

        {/* Nomes das Princesas */}
        <h1 className="text-3xl min-[380px]:text-4xl sm:text-6xl md:text-7xl font-extrabold text-pink-900 font-serif tracking-tight mb-2 leading-tight">
          Laura & Olívia
        </h1>

        <p className="font-script text-2xl min-[380px]:text-3xl sm:text-4xl md:text-5xl text-amber-600 mb-5 sm:mb-6 drop-shadow-sm leading-snug">
          Um ano de pura doçura e alegria!
        </p>

        {/* Imagem das Princesas em Moldura Especial */}
        <div className="relative max-w-2xl mx-auto mb-6 sm:mb-8 rounded-2xl min-[380px]:rounded-3xl p-1.5 min-[380px]:p-2.5 sm:p-3 bg-gradient-to-tr from-amber-300 via-pink-200 to-amber-200 shadow-2xl royal-shadow transform transition-all duration-500 hover:scale-[1.01]">
          <div className="overflow-hidden rounded-xl min-[380px]:rounded-2xl relative group bg-pink-100">
            <img
              src={photoView === 'real' ? './laura-e-olivia.jpg' : './hero-princesas.jpg'}
              alt="Princesas Laura e Olívia - 1° Aninho"
              className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay sutil */}
            <div className="absolute inset-0 bg-gradient-to-t from-pink-950/40 via-transparent to-transparent pointer-events-none" />
            
            {/* Selo no canto inferior esquerdo */}
            <div className="absolute bottom-2.5 left-2.5 min-[380px]:bottom-3.5 min-[380px]:left-3.5 sm:bottom-4 sm:left-4 bg-white/95 backdrop-blur-md px-2.5 min-[380px]:px-3.5 py-1 min-[380px]:py-1.5 rounded-full shadow-md border border-pink-200 flex items-center gap-1.5 max-w-[calc(100%-120px)]">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping shrink-0" />
              <span className="text-[10px] min-[380px]:text-xs font-bold text-pink-900 truncate">
                {photoView === 'real' ? '👑 Laura & Olívia • 12/12/2026' : '🏰 Castelo • 12/12/2026'}
              </span>
            </div>

            {/* Botão de Alternância de Foto */}
            <button
              onClick={() => setPhotoView(photoView === 'real' ? 'castle' : 'real')}
              className="absolute bottom-2.5 right-2.5 min-[380px]:bottom-3.5 min-[380px]:right-3.5 sm:bottom-4 sm:right-4 bg-white/95 hover:bg-pink-50 active:bg-pink-100 text-pink-800 text-[10px] min-[380px]:text-xs font-bold py-1 min-[380px]:py-1.5 px-2.5 min-[380px]:px-3 rounded-full shadow-md border border-pink-200 flex items-center gap-1.5 transition-all duration-200 cursor-pointer backdrop-blur-md"
              title="Alternar entre a foto e a arte do castelo"
            >
              {photoView === 'real' ? (
                <>
                  <Castle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="hidden min-[360px]:inline">Ver Castelo</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                  <span className="hidden min-[360px]:inline">Ver Foto</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Informações Rápidas em Destaque */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 min-[380px]:gap-3 max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="p-3 min-[380px]:p-3.5 rounded-2xl bg-white/85 border border-pink-100 shadow-sm backdrop-blur-sm flex items-center justify-start min-[380px]:justify-center gap-3">
            <div className="p-2 rounded-xl bg-pink-100 text-pink-600 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Data</p>
              <p className="text-sm font-bold text-stone-800">12 de Dezembro, 2026</p>
            </div>
          </div>

          <div className="p-3 min-[380px]:p-3.5 rounded-2xl bg-white/85 border border-pink-100 shadow-sm backdrop-blur-sm flex items-center justify-start min-[380px]:justify-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-600 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Horário</p>
              <p className="text-sm font-bold text-stone-800">Às 15:30h</p>
            </div>
          </div>

          <div className="p-3 min-[380px]:p-3.5 rounded-2xl bg-white/85 border border-pink-100 shadow-sm backdrop-blur-sm flex items-center justify-start min-[380px]:justify-center gap-3">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-600 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Local</p>
              <p className="text-sm font-bold text-stone-800">Salão Castelo Agriões</p>
            </div>
          </div>
        </div>

        {/* Botões de Ação em Linha Única (Mobile & Desktop) */}
        <div className="flex flex-row items-center justify-between gap-1.5 min-[380px]:gap-2 sm:gap-3 max-w-xl mx-auto w-full px-1">
          {/* Botão 1: Confirmar Presença */}
          <button
            onClick={onScrollToRSVP}
            className="flex-1 min-w-0 min-h-[46px] sm:min-h-[50px] px-2 min-[380px]:px-3 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 active:scale-95 text-white font-extrabold text-xs min-[380px]:text-sm sm:text-base rounded-full shadow-lg shadow-pink-300/50 flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer touch-manipulation"
          >
            <Heart className="w-3.5 h-3.5 min-[380px]:w-4 min-[380px]:h-4 fill-white shrink-0" />
            <span className="truncate">Confirmar<span className="hidden min-[430px]:inline"> Presença</span></span>
          </button>

          {/* Botão 2: Localização */}
          <button
            onClick={onScrollToLocation}
            className="flex-1 min-w-0 min-h-[46px] sm:min-h-[50px] px-2 min-[380px]:px-3 sm:px-4 py-2.5 sm:py-3 bg-white/95 hover:bg-pink-50 active:scale-95 text-pink-700 font-bold text-xs min-[380px]:text-sm sm:text-base rounded-full shadow-md border border-pink-200 flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer touch-manipulation"
          >
            <MapPin className="w-3.5 h-3.5 min-[380px]:w-4 min-[380px]:h-4 text-pink-500 shrink-0" />
            <span className="truncate">Local<span className="hidden min-[430px]:inline">ização</span></span>
          </button>

          {/* Botão 3: Canção (Sem 'Real'!) */}
          <button
            onClick={onOpenLyrics}
            className="flex-1 min-w-0 min-h-[46px] sm:min-h-[50px] px-2 min-[380px]:px-3 sm:px-4 py-2.5 sm:py-3 bg-pink-100/90 hover:bg-pink-200 active:scale-95 text-pink-800 font-bold text-xs min-[380px]:text-sm sm:text-base rounded-full border border-pink-200/90 flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer touch-manipulation"
          >
            <Music className="w-3.5 h-3.5 min-[380px]:w-4 min-[380px]:h-4 text-pink-600 shrink-0" />
            <span className="truncate">Canção</span>
          </button>
        </div>

        {/* Indicador de rolagem */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <button
            onClick={onScrollToRSVP}
            className="text-pink-400 hover:text-pink-600 active:text-pink-700 transition-colors animate-bounce cursor-pointer min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full p-2 touch-manipulation"
            aria-label="Rolar para o formulário de confirmação"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>

      </div>
    </section>
  )
}
