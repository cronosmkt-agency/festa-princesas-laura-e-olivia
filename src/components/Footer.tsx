import type { FC } from 'react'
import { Heart, ShieldCheck } from 'lucide-react'

interface FooterProps {
  onOpenOrganizer: () => void
}

export const Footer: FC<FooterProps> = ({ onOpenOrganizer }) => {
  return (
    <footer className="mt-16 border-t border-pink-200/80 bg-white/60 backdrop-blur-md py-10 px-4 text-center">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Brasão Real com Foto */}
        <div className="relative inline-block">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-300 shadow-md bg-pink-100 mx-auto">
            <img
              src="./laura-e-olivia.jpg"
              alt="Laura e Olívia"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-white flex items-center justify-center text-[10px] shadow">
            👑
          </div>
        </div>

        <h3 className="text-xl font-bold text-pink-900 font-serif">
          Laura & Olívia • 1º Aninho Real
        </h3>

        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Festa das Princesas • Sábado, 12 de Dezembro de 2026<br />
          Salão Castelo Agriões • Teresópolis, RJ
        </p>

        <p className="text-xs text-pink-600 font-medium flex items-center justify-center gap-1">
          Feito com muito <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" /> para a família
        </p>

        {/* Botão de Acesso do Organizador */}
        <div className="pt-4 border-t border-pink-100/60">
          <button
            onClick={onOpenOrganizer}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-stone-400 hover:text-pink-700 bg-stone-50 hover:bg-pink-50 rounded-full border border-stone-200/60 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Painel da Carina (Ver Lembrancinhas & Convidados)</span>
          </button>
        </div>

      </div>
    </footer>
  )
}
