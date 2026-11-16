import { useState, useEffect, type FC } from 'react'
import { X, Crown, Baby, Users, Gift, Copy, Check, Download, Trash2 } from 'lucide-react'
import type { RSVPData } from '../types'

interface OrganizerModalProps {
  isOpen: boolean
  onClose: () => void
}

export const OrganizerModal: FC<OrganizerModalProps> = ({ isOpen, onClose }) => {
  const [list, setList] = useState<RSVPData[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem('laura_olivia_rsvp_list')
        if (stored) {
          setList(JSON.parse(stored))
        } else {
          setList([])
        }
      } catch (err) {
        console.warn(err)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  // Estatísticas
  const attendingList = list.filter((item) => item.attending === 'yes')
  const declinedList = list.filter((item) => item.attending === 'no')

  // Total de adultos
  const totalAdults = attendingList.reduce(
    (acc, curr) => acc + 1 + (curr.hasAdults ? curr.adultCount : 0),
    0
  )

  // Todas as crianças confirmadas
  const allChildren = attendingList.flatMap((item) =>
    (item.children || []).map((c) => ({
      ...c,
      parentName: item.guestName,
      phone: item.phone,
    }))
  )

  const handleCopySummary = () => {
    let text = `👑 LISTA DE CONFIRMADOS - FESTA DE 1 ANO LAURA & OLÍVIA 👑\n\n`
    text += `📊 RESUMO GERAL:\n`
    text += `• Total de Famílias/Convites: ${attendingList.length}\n`
    text += `• Total de Adultos: ${totalAdults}\n`
    text += `• Total de Crianças (Lembrancinhas): ${allChildren.length}\n\n`

    text += `🎁 LISTA DE CRIANÇAS PARA LEMBRANCINHAS (${allChildren.length}):\n`
    if (allChildren.length === 0) {
      text += `(Nenhuma criança cadastrada ainda)\n`
    } else {
      allChildren.forEach((child, idx) => {
        text += `${idx + 1}. ${child.name} - ${child.age} (Resp: ${child.parentName})\n`
      })
    }

    text += `\n👥 DETALHAMENTO DE CONVIDADOS:\n`
    attendingList.forEach((g, idx) => {
      text += `${idx + 1}. ${g.guestName} (${g.phone})\n`
      if (g.hasAdults && g.adultGuests) text += `   Acompanhantes: ${g.adultGuests}\n`
      if (g.hasChildren && g.children.length > 0) {
        text += `   Crianças: ${g.children.map((c) => `${c.name} (${c.age})`).join(', ')}\n`
      }
      if (g.message) text += `   Recado: "${g.message}"\n`
      text += `\n`
    })

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleExportCSV = () => {
    let csv = 'Nome Convidado,Telefone,Status,Acompanhantes,Total Adultos,Criancas (Nome e Idade),Recado\n'
    list.forEach((item) => {
      const kids = (item.children || [])
        .map((c) => `${c.name} [${c.age}]`)
        .join('; ')
      csv += `"${item.guestName}","${item.phone}","${item.attending}","${
        item.adultGuests || ''
      }","${item.hasAdults ? item.adultCount + 1 : 1}","${kids}","${
        item.message || ''
      }"\n`
    })

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', 'lista-confirmados-laura-olivia.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleClearList = () => {
    if (window.confirm('Tem certeza que deseja limpar toda a lista salva neste navegador?')) {
      localStorage.removeItem('laura_olivia_rsvp_list')
      setList([])
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-200 overflow-y-auto">
        {/* Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-100 rounded-2xl text-amber-700">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-pink-900 font-serif">
              Painel da Carina & Família 👑
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Controle de presença e cálculo exato de lembrancinhas
            </p>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          <div className="p-3 bg-pink-50 rounded-2xl border border-pink-100">
            <p className="text-xs text-pink-700 font-semibold flex items-center justify-center gap-1">
              <Users className="w-3.5 h-3.5" /> Total Adultos
            </p>
            <p className="text-2xl font-extrabold text-pink-900 font-serif mt-1">
              {totalAdults}
            </p>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
            <p className="text-xs text-amber-800 font-semibold flex items-center justify-center gap-1">
              <Gift className="w-3.5 h-3.5" /> Lembrancinhas
            </p>
            <p className="text-2xl font-extrabold text-amber-700 font-serif mt-1">
              {allChildren.length}
            </p>
            <p className="text-[10px] text-amber-800 font-bold">Crianças</p>
          </div>

          <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
            <p className="text-xs text-purple-700 font-semibold">Respostas</p>
            <p className="text-2xl font-extrabold text-purple-900 font-serif mt-1">
              {list.length}
            </p>
            <p className="text-[10px] text-purple-600">({declinedList.length} não irão)</p>
          </div>
        </div>

        {/* Tabela de Crianças e Lembrancinhas */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-amber-900 flex items-center gap-1.5 font-serif">
              <Baby className="w-4 h-4 text-amber-600" />
              Crianças Confirmadas ({allChildren.length} Lembrancinhas)
            </h4>
          </div>

          {allChildren.length === 0 ? (
            <div className="p-4 bg-stone-50 rounded-2xl text-stone-500 text-xs text-center">
              Nenhuma criança confirmada ainda. As novas confirmações aparecerão aqui automaticamente!
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {allChildren.map((child, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-amber-50/50 rounded-xl border border-amber-200/70 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-amber-200 text-amber-900 rounded-full font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-stone-900">{child.name}</span>
                    <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded-md font-semibold text-[10px]">
                      {child.age}
                    </span>
                  </div>
                  <span className="text-stone-400 text-[11px]">
                    Resp: {child.parentName}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lista Completa de Confirmações */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-pink-900 mb-2 font-serif">
            Histórico de Confirmações ({list.length})
          </h4>

          {list.length === 0 ? (
            <div className="p-4 bg-stone-50 rounded-2xl text-stone-500 text-xs text-center">
              Nenhuma resposta recebida neste dispositivo ainda.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {list.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border text-xs ${
                    item.attending === 'yes'
                      ? 'bg-pink-50/40 border-pink-200'
                      : 'bg-stone-50 border-stone-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-stone-900 mb-1">
                    <span>{item.guestName}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] ${
                        item.attending === 'yes'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {item.attending === 'yes' ? 'Confirmado' : 'Não irá'}
                    </span>
                  </div>
                  <p className="text-stone-600">📱 {item.phone}</p>
                  {item.hasAdults && item.adultGuests && (
                    <p className="text-stone-600">👥 Acompanhantes: {item.adultGuests}</p>
                  )}
                  {item.hasChildren && item.children.length > 0 && (
                    <p className="text-amber-800 font-medium">
                      👶 Crianças: {item.children.map((c) => `${c.name} (${c.age})`).join(', ')}
                    </p>
                  )}
                  {item.message && (
                    <p className="text-pink-700 italic mt-1">"{item.message}"</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botões de Ação do Painel */}
        <div className="space-y-2 pt-3 border-t border-stone-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={handleCopySummary}
              className="py-2.5 px-4 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copiado para o WhatsApp!' : 'Copiar Resumo p/ WhatsApp'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Planilha (Excel / CSV)</span>
            </button>
          </div>

          {list.length > 0 && (
            <button
              onClick={handleClearList}
              className="w-full py-1.5 text-stone-400 hover:text-rose-500 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar dados locais</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
