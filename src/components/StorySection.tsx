import type { FC } from 'react'
import { Sparkles, Crown, Music } from 'lucide-react'

interface StorySectionProps {
  onOpenLyrics: () => void
}

export const StorySection: FC<StorySectionProps> = ({ onOpenLyrics }) => {
  return (
    <section className="py-12 px-4 max-w-4xl mx-auto text-center">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 rounded-full text-pink-700 text-xs font-bold uppercase tracking-wider mb-3">
        <Crown className="w-3.5 h-3.5 text-amber-500" />
        <span>O Primeiro Reinado</span>
      </div>

      <h2 className="text-3xl sm:text-4xl font-bold text-pink-900 font-serif mb-3">
        Duas Princesas, Uma Só Magia ✨
      </h2>

      <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
        Há um ano, duas bênçãos chegaram para transformar o mundo em um verdadeiro conto de fadas. Laura e Olívia vieram juntinhas para multiplicar os sorrisos, a fofura e todo o amor da família!
      </p>

      {/* Cards das Princesas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        
        {/* Princesa Laura */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-pink-50 via-white to-pink-50/50 border border-pink-200 shadow-lg text-left relative overflow-hidden group hover:shadow-pink-200/50 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-200/30 rounded-bl-full pointer-events-none" />
          <div className="flex items-center gap-3.5 mb-3.5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border-2 border-pink-300 shadow-md bg-pink-100 shrink-0">
                <img
                  src="./laura-e-olivia.jpg"
                  alt="Princesa Laura"
                  className="w-full h-full object-cover object-[38%_38%] scale-[1.7] transform group-hover:scale-[1.85] transition-transform duration-300"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs shadow">
                👑
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-pink-900 font-serif">Princesa Laura</h3>
              <p className="text-xs text-pink-600 font-semibold">"A Laura já chegou fazendo a sua pose!"</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Olhos brilhantes, riso fácil e uma pose encantadora que conquista o coração de todos à sua volta desde o primeiro dia de vida.
          </p>
        </div>

        {/* Princesa Olívia */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-purple-50 via-white to-purple-50/50 border border-purple-200 shadow-lg text-left relative overflow-hidden group hover:shadow-purple-200/50 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200/30 rounded-bl-full pointer-events-none" />
          <div className="flex items-center gap-3.5 mb-3.5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border-2 border-purple-300 shadow-md bg-purple-100 shrink-0">
                <img
                  src="./laura-e-olivia.jpg"
                  alt="Princesa Olívia"
                  className="w-full h-full object-cover object-[58%_40%] scale-[1.7] transform group-hover:scale-[1.85] transition-transform duration-300"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs shadow">
                👑
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-purple-900 font-serif">Princesa Olívia</h3>
              <p className="text-xs text-purple-600 font-semibold">"E a Olívia vem rodando num vestido cor de rosa!"</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Pura doçura, delicadeza e animação sem fim! Onde a Olívia está, a alegria transborda e o vestido rodado encanta toda a corte real.
          </p>
        </div>

      </div>

      {/* Ensaio Fotográfico das Princesas */}
      <div className="mb-8 p-4 sm:p-6 bg-gradient-to-r from-pink-50 via-amber-50 to-pink-50 rounded-3xl border border-pink-200 shadow-md text-left">
        <div className="flex flex-col md:flex-row items-center gap-5">
          <div className="w-full md:w-5/12 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-200 relative group">
            <img
              src="./laura-e-olivia.jpg"
              alt="Ensaio das Princesas Laura e Olívia"
              className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-2 left-2 px-2.5 py-0.5 bg-pink-600/90 backdrop-blur-sm text-white rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>Ensaio Oficial 1 Ano</span>
            </div>
          </div>
          <div className="w-full md:w-7/12 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-pink-600">
              Momento Encantado
            </span>
            <h4 className="text-xl sm:text-2xl font-bold font-serif text-pink-950">
              Nossas Princesas Reais 🌸
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Com seus vestidinhos cor-de-rosa, lacinhos na cabeça e sorrisos que iluminam qualquer dia, Laura e Olívia estão prontas para viver este dia mágico com você no Castelo Agriões!
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-bold text-pink-800">
              <span className="px-3 py-1 bg-white rounded-full border border-pink-200 shadow-xs">🎀 12 de Dezembro</span>
              <span className="px-3 py-1 bg-white rounded-full border border-pink-200 shadow-xs">👑 Salão Castelo Agriões</span>
              <span className="px-3 py-1 bg-white rounded-full border border-pink-200 shadow-xs">💖 1 Aninho de Amor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Banner da Canção das Princesas */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-white/20 rounded-full text-xs font-semibold mb-1">
            <Music className="w-3.5 h-3.5 text-yellow-200" />
            <span>Trilha Sonora Exclusiva</span>
          </div>
          <h4 className="text-lg sm:text-xl font-bold font-serif">
            Ouça "Festa das Gêmeas" enquanto navega!
          </h4>
          <p className="text-xs text-pink-100 mt-0.5">
            Música personalizada com as vozes e nomes de Laura e Olívia!
          </p>
        </div>

        <button
          onClick={onOpenLyrics}
          className="px-5 py-2.5 bg-white text-pink-700 hover:bg-pink-50 font-bold text-xs sm:text-sm rounded-full shadow-md transition-all hover:scale-105 shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Ver Letra Completa</span>
        </button>
      </div>
    </section>
  )
}
