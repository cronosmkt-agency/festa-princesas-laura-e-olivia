import type { FC } from 'react'
import { MapPin, Navigation, CalendarPlus, Sparkles, Castle, HeartHandshake, Shirt } from 'lucide-react'

export const EventDetails: FC = () => {
  const address = 'Rua Carmela Dutra, 272 - Agriões, Teresópolis - RJ'
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Rua Carmela Dutra, 272, Agriões, Teresópolis, RJ'
  )}`
  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(
    'Rua Carmela Dutra, 272, Agriões, Teresópolis, RJ'
  )}`

  // Gerador de Google Calendar link
  const createGoogleCalendarUrl = () => {
    const title = encodeURIComponent('👑 1º Aninho Real das Princesas Laura & Olívia')
    const details = encodeURIComponent(
      'Festa de aniversário de 1 ano das princesas Laura & Olívia no Salão Castelo Agriões. Esperamos você!'
    )
    const loc = encodeURIComponent('Rua Carmela Dutra, 272 - Agriões, Teresópolis - RJ')
    // 12/12/2026 das 15:30 às 20:30 (UTC-3 -> 18:30 às 23:30 UTC)
    const dates = '20261212T183000Z/20261212T233000Z'
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${loc}`
  }

  // Download do arquivo .ics para Apple Calendar / Outlook
  const handleDownloadIcs = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Festa Laura e Olivia//PT',
      'BEGIN:VEVENT',
      'SUMMARY:👑 1º Aninho Real das Princesas Laura & Olívia',
      'DESCRIPTION:Festa de 1 ano das princesas Laura e Olívia no Salão Castelo Agriões!',
      'LOCATION:Rua Carmela Dutra, 272 - Agriões, Teresópolis - RJ',
      'DTSTART:20261212T183000Z',
      'DTEND:20261212T233000Z',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute('download', 'Aniversario-Laura-e-Olivia.ics')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section id="local" className="py-12 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
          Coordenadas do Reino 🏰
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-pink-900 font-serif">
          Local da Celebração Real
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-md mx-auto">
          Um castelo encantado preparado para receber cada um dos nossos convidados de honra!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card do Castelo & Endereço */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-pink-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-md">
                <Castle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-pink-950 font-serif">Salão Castelo Agriões</h3>
                <p className="text-xs text-amber-700 font-semibold">Espaço de Festas</p>
              </div>
            </div>

            <div className="space-y-3 text-stone-700 text-sm mb-6">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">Endereço:</p>
                  <p>{address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Rotas */}
          <div className="space-y-2 pt-4 border-t border-pink-100">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <Navigation className="w-4 h-4" />
              <span>Abrir no Google Maps</span>
            </a>

            <a
              href={wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              <span>Abrir no Waze</span>
            </a>
          </div>
        </div>

        {/* Card de Dicas & Agenda */}
        <div className="bg-gradient-to-br from-pink-50 via-white to-amber-50/50 rounded-3xl p-6 sm:p-8 shadow-xl border border-pink-200 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-pink-950 font-serif flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Dicas Importantes
            </h3>

            {/* Aviso sobre presentes */}
            <div className="p-3.5 rounded-2xl bg-pink-100/70 border border-pink-200 flex items-start gap-3">
              <HeartHandshake className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-pink-950">
                <strong className="block font-bold">O Maior Presente é Você!</strong>
                Não se preocupe com presentes de aniversário. A família deseja apenas o carinho e a presença de vocês nesse momento tão especial!
              </div>
            </div>

            {/* Traje */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
              <Shirt className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-950">
                <strong className="block font-bold">Traje Sugerido:</strong>
                Esporte fino / Confortável para dançar e brincar. Crianças podem vir com roupinhas de príncipe ou princesa se quiserem!
              </div>
            </div>
          </div>

          {/* Adicionar à Agenda */}
          <div className="mt-6 pt-4 border-t border-pink-100 space-y-2">
            <a
              href={createGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-white hover:bg-pink-50 text-pink-800 font-bold text-xs sm:text-sm rounded-2xl border border-pink-200 shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <CalendarPlus className="w-4 h-4 text-pink-500" />
              <span>Adicionar ao Google Agenda</span>
            </a>

            <button
              onClick={handleDownloadIcs}
              className="w-full py-2 px-4 text-stone-500 hover:text-stone-800 font-medium text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              Baixar lembrete para Apple Calendar / Outlook (.ics)
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
