import { useState, type FC } from 'react'
import {
  MapPin,
  Navigation,
  CalendarPlus,
  Sparkles,
  Castle,
  HeartHandshake,
  Shirt,
  Copy,
  Check,
  Clock,
  Compass,
  Calendar,
  ExternalLink,
} from 'lucide-react'

export const EventDetails: FC = () => {
  const [copied, setCopied] = useState(false)
  const fullAddress = 'Rua Carmela Dutra, 272 - Agriões, Teresópolis - RJ'
  const venueName = 'Salão Castelo Agriões'

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${venueName}, ${fullAddress}`
  )}`

  const appleMapsUrl = `https://maps.apple.com/?q=${encodeURIComponent(
    venueName
  )}&address=${encodeURIComponent(fullAddress)}`

  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(
    `${venueName}, ${fullAddress}`
  )}&navigate=yes`

  const handleCopyAddress = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(`${venueName} - ${fullAddress}`)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = `${venueName} - ${fullAddress}`
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      console.warn('Falha ao copiar endereço:', err)
    }
  }

  // Link direto para Google Agenda
  const createGoogleCalendarUrl = () => {
    const title = encodeURIComponent('👑 1º Aninho Real das Princesas Laura & Olívia')
    const details = encodeURIComponent(
      'Festa de aniversário de 1 ano das princesas Laura & Olívia no Salão Castelo Agriões!\nEsperamos você com muita alegria, brincadeiras e doces do reino real.'
    )
    const loc = encodeURIComponent(`${venueName} - ${fullAddress}`)
    // 12/12/2026 das 15:30 às 20:30 (Horário de Brasília: UTC-3 -> 18:30 às 23:30 UTC)
    const dates = '20261212T183000Z/20261212T233000Z'
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${loc}`
  }

  // Link direto para Outlook Web
  const createOutlookCalendarUrl = () => {
    const title = encodeURIComponent('👑 1º Aninho Real das Princesas Laura & Olívia')
    const details = encodeURIComponent(
      'Festa de 1 ano das princesas Laura & Olívia no Salão Castelo Agriões!'
    )
    const loc = encodeURIComponent(`${venueName} - ${fullAddress}`)
    return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&body=${details}&location=${loc}&startdt=2026-12-12T18:30:00Z&enddt=2026-12-12T23:30:00Z&path=/calendar/action/compose&rru=addevent`
  }

  // Download do arquivo .ics com RFC 5545 compatível com Apple Calendar, iOS e Outlook
  const handleDownloadIcs = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Castelo Agrioes//Festa Laura e Olivia//PT',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:festa-laura-olivia-20261212T183000Z@casteloagrioes.teresopolis.rj',
      'DTSTAMP:20261116T120000Z',
      'DTSTART:20261212T183000Z',
      'DTEND:20261212T233000Z',
      'SUMMARY:👑 1º Aninho Real das Princesas Laura & Olívia',
      'DESCRIPTION:Festa de 1 aninho das princesas Laura & Olívia no Salão Castelo Agriões!',
      `LOCATION:${venueName} - ${fullAddress}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT2H',
      'DESCRIPTION:Lembrete: Festa das Princesas Laura & Olívia hoje às 15:30h!',
      'ACTION:DISPLAY',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'Aniversario-Laura-e-Olivia.ics')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => window.URL.revokeObjectURL(url), 2000)
  }

  return (
    <section id="local" className="py-12 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <span className="inline-block px-3.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
          Coordenadas do Reino 🏰
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-pink-900 font-serif">
          Local da Celebração Real
        </h2>
        <p className="text-sm text-stone-600 mt-1.5 max-w-md mx-auto">
          Um castelo encantado preparado para receber cada um dos nossos convidados de honra!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card do Castelo, Endereço & Rotas GPS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-pink-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-400 to-amber-400 text-white flex items-center justify-center shadow-md">
                <Castle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-pink-950 font-serif">{venueName}</h3>
                <p className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                  <span>Espaço de Festas Encantado</span>
                  <Sparkles className="w-3 h-3" />
                </p>
              </div>
            </div>

            {/* Informações de Data e Hora */}
            <div className="mb-4 p-3 bg-pink-50/80 rounded-2xl border border-pink-100 space-y-1.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-pink-900">
                <Calendar className="w-4 h-4 text-pink-600 shrink-0" />
                <span>Sábado, 12 de Dezembro de 2026</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-pink-700 font-semibold">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Horário: 15h30 às 20h30 (Chegue no horário!)</span>
              </div>
            </div>

            {/* Endereço completo */}
            <div className="space-y-3 text-stone-700 text-sm mb-5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-stone-900">Endereço:</p>
                  <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">{fullAddress}</p>
                </div>
              </div>
            </div>

            {/* Botão de Copiar Endereço */}
            <button
              onClick={handleCopyAddress}
              className={`w-full min-h-[46px] py-2.5 px-4 mb-4 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                copied
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Endereço copiado para o Uber / 99! ✨</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-stone-500" />
                  <span>Copiar endereço completo</span>
                </>
              )}
            </button>
          </div>

          {/* Botões de Rotas GPS com touch targets >= 48px */}
          <div className="space-y-2.5 pt-4 border-t border-pink-100">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
              Abrir rota de navegação:
            </p>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[48px] py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <Navigation className="w-4 h-4" />
              <span>Abrir no Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={appleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[46px] py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 transition-colors text-center"
              >
                <Compass className="w-4 h-4 text-stone-600 shrink-0" />
                <span>Apple Maps</span>
              </a>

              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[46px] py-2.5 px-3 bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 transition-colors text-center"
              >
                <span>Waze (GPS)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* Card de Dicas & Agenda */}
        <div className="bg-gradient-to-br from-pink-50 via-white to-amber-50/50 rounded-3xl p-6 sm:p-8 shadow-xl border border-pink-200 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-pink-950 font-serif flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Dicas Importantes da Festa
            </h3>

            {/* Aviso sobre presentes */}
            <div className="p-4 rounded-2xl bg-pink-100/70 border border-pink-200 flex items-start gap-3">
              <HeartHandshake className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-pink-950 leading-relaxed">
                <strong className="block font-bold text-pink-900 mb-0.5">O Maior Presente é Você! 💖</strong>
                Não se preocupe com presentes de aniversário. A família deseja apenas o carinho e a presença de vocês nesse momento tão especial!
              </div>
            </div>

            {/* Traje */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
              <Shirt className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                <strong className="block font-bold text-amber-900 mb-0.5">Traje Sugerido:</strong>
                Esporte fino / Confortável para dançar e brincar. Crianças podem vir com roupinhas de príncipe ou princesa se quiserem!
              </div>
            </div>
          </div>

          {/* Adicionar à Agenda */}
          <div className="mt-6 pt-5 border-t border-pink-100 space-y-2.5">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
              Salvar na sua agenda:
            </p>

            <a
              href={createGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[48px] py-3 px-4 bg-white hover:bg-pink-50 text-pink-800 font-bold text-xs sm:text-sm rounded-2xl border border-pink-200 shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <CalendarPlus className="w-4 h-4 text-pink-500" />
              <span>Adicionar ao Google Agenda</span>
              <ExternalLink className="w-3.5 h-3.5 text-pink-400" />
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownloadIcs}
                className="min-h-[44px] py-2 px-3 bg-pink-100/60 hover:bg-pink-100 text-pink-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                title="Compatível com iPhone, iPad, Apple Calendar e Outlook"
              >
                <span>Apple Calendar (.ics)</span>
              </button>

              <a
                href={createOutlookCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors text-center"
              >
                <span>Outlook Web</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
