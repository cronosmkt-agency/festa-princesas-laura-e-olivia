import { useState, useEffect, type FC } from 'react'
import {
  X,
  Crown,
  Baby,
  Users,
  Gift,
  Copy,
  Check,
  Download,
  Trash2,
  MessageCircle,
  FileSpreadsheet,
  Bell,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react'
import type { RSVPData } from '../types'
import {
  getGoogleSheetsUrl,
  setGoogleSheetsUrl,
  sendRSVPToGoogleSheets,
  GOOGLE_APPS_SCRIPT_CODE,
} from '../services/googleSheets'

interface OrganizerModalProps {
  isOpen: boolean
  onClose: () => void
}

export const OrganizerModal: FC<OrganizerModalProps> = ({ isOpen, onClose }) => {
  const [list, setList] = useState<RSVPData[]>([])
  const [copied, setCopied] = useState(false)
  const [sheetsUrlInput, setSheetsUrlInput] = useState('')
  const [sheetsSaved, setSheetsSaved] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)
  const [showTutorial, setShowTutorial] = useState(false)
  const [copiedScript, setCopiedScript] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem('laura_olivia_rsvp_list')
        setList(stored ? JSON.parse(stored) : [])
        setSheetsUrlInput(getGoogleSheetsUrl())
      } catch (err) {
        console.warn(err)
      }
    }, 0)

    return () => clearTimeout(timer)
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

  const getSummaryText = (): string => {
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

    return text
  }

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(getSummaryText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      console.warn('Erro ao copiar resumo:', err)
    }
  }

  const handleExportCSV = () => {
    let csv =
      'Nome Convidado,Telefone,Status,Acompanhantes,Total Adultos,Criancas (Nome e Idade),Recado\n'
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

  const handleDeleteItem = (id: string, name: string) => {
    if (window.confirm(`Deseja remover a resposta de "${name}"?`)) {
      const updated = list.filter((item) => item.id !== id)
      setList(updated)
      try {
        localStorage.setItem('laura_olivia_rsvp_list', JSON.stringify(updated))
      } catch (err) {
        console.warn('Erro ao salvar atualização local:', err)
      }
    }
  }

  const handleClearList = () => {
    if (window.confirm('Tem certeza que deseja limpar toda a lista salva neste navegador?')) {
      localStorage.removeItem('laura_olivia_rsvp_list')
      setList([])
    }
  }

  const handleSaveSheetsUrl = () => {
    setGoogleSheetsUrl(sheetsUrlInput)
    setSheetsSaved(true)
    setTimeout(() => setSheetsSaved(false), 3000)
  }

  const handleSyncAllToSheets = async () => {
    const url = sheetsUrlInput.trim() || getGoogleSheetsUrl()
    if (!url) {
      alert('Por favor, cole primeiro a URL do Google Sheets Webhook antes de sincronizar.')
      return
    }

    if (list.length === 0) {
      alert('A lista ainda não tem confirmações para enviar.')
      return
    }

    setIsSyncing(true)
    setSyncMessage(null)

    try {
      let sentCount = 0
      for (const item of list) {
        await sendRSVPToGoogleSheets(item, url)
        sentCount++
      }
      setSyncMessage(`Sucesso! ${sentCount} confirmações sincronizadas com a planilha.`)
    } catch {
      setSyncMessage('Ocorreu um erro ao tentar sincronizar com a planilha.')
    } finally {
      setIsSyncing(false)
      setTimeout(() => setSyncMessage(null), 4000)
    }
  }

  const handleCopyAppsScript = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE)
      setCopiedScript(true)
      setTimeout(() => setCopiedScript(false), 3000)
    } catch (err) {
      console.warn('Erro ao copiar script:', err)
    }
  }

  const whatsAppSummaryUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    getSummaryText()
  )}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-white rounded-3xl p-5 sm:p-8 shadow-2xl border-4 border-amber-200 overflow-y-auto">
        {/* Fechar com touch target >= 48px */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 min-w-[48px] min-h-[48px] p-2 text-stone-500 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors flex items-center justify-center cursor-pointer"
          aria-label="Fechar painel"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-6 pr-10">
          <div className="p-3 bg-amber-100 rounded-2xl text-amber-700 shrink-0">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-pink-900 font-serif">
              Painel da Carina & Família 👑
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Controle de presença e cálculo exato de lembrancinhas
            </p>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-6 text-center">
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
                  className="flex items-center justify-between p-2.5 sm:p-3 bg-amber-50/50 rounded-xl border border-amber-200/70 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-amber-200 text-amber-900 rounded-full font-bold flex items-center justify-center text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-stone-900">{child.name}</span>
                    <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded-md font-bold text-[10px]">
                      {child.age}
                    </span>
                  </div>
                  <span className="text-stone-500 text-[11px] truncate max-w-[140px] text-right">
                    Resp: {child.parentName}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lista Completa de Confirmações com ação de exclusão individual */}
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
                  className={`p-3 rounded-2xl border text-xs flex items-start justify-between gap-2 ${
                    item.attending === 'yes'
                      ? 'bg-pink-50/40 border-pink-200'
                      : 'bg-stone-50 border-stone-200 opacity-70'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 font-bold text-stone-900">
                      <span>{item.guestName}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
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
                      <p className="text-pink-700 italic mt-0.5">"{item.message}"</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteItem(item.id, item.guestName)}
                    className="min-w-[48px] min-h-[48px] p-2 text-stone-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                    title="Excluir resposta"
                    aria-label={`Excluir resposta de ${item.guestName}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Integração com Google Sheets (Notificações no Celular da Carina) */}
        <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-pink-50 rounded-2xl border-2 border-emerald-200/90 shadow-sm text-left space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-950 font-serif flex items-center gap-1.5">
                  <span>Conexão com Google Sheets</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    sheetsUrlInput.trim() ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {sheetsUrlInput.trim() ? 'Conectado 🟢' : 'Aguardando Link'}
                  </span>
                </h4>
                <p className="text-[11px] text-stone-600">
                  Notifica o celular da Carina a cada presença confirmada
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowTutorial(!showTutorial)}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 bg-white/80 hover:bg-white px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
            >
              <span>{showTutorial ? 'Ocultar Tutorial' : 'Como Conectar'}</span>
              {showTutorial ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Campo da URL do Webhook do Google Apps Script */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              placeholder="Cole a URL do Google Apps Script (https://script.google.com/macros/s/.../exec)"
              value={sheetsUrlInput}
              onChange={(e) => setSheetsUrlInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-white rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-stone-800 placeholder-stone-400"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveSheetsUrl}
                className="min-h-[40px] px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                {sheetsSaved ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                <span>{sheetsSaved ? 'Salvo!' : 'Salvar Link'}</span>
              </button>

              {list.length > 0 && (
                <button
                  type="button"
                  onClick={handleSyncAllToSheets}
                  disabled={isSyncing}
                  className="min-h-[40px] px-3 py-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer shrink-0"
                  title="Enviar as respostas salvas atualmente para a planilha"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isSyncing ? 'Enviando...' : 'Sincronizar'}</span>
                </button>
              )}
            </div>
          </div>

          {syncMessage && (
            <p className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 p-2 rounded-lg">
              {syncMessage}
            </p>
          )}

          {/* Tutorial Passo a Passo com 1-Click Copy */}
          {showTutorial && (
            <div className="p-3.5 bg-white/95 rounded-xl border border-emerald-200 text-xs text-stone-700 space-y-2 mt-2">
              <p className="font-bold text-emerald-950 flex items-center gap-1">
                <span>Passo a passo rápido (Leva apenas 1 minuto):</span>
              </p>
              <ol className="list-decimal list-inside space-y-1 text-stone-600 pl-1">
                <li>Abra uma planilha nova no seu <strong>Google Sheets</strong> (sheets.new).</li>
                <li>No menu superior, clique em <strong>Extensões → Apps Script</strong>.</li>
                <li>Apague o código que estiver lá e cole o script pronto abaixo:</li>
              </ol>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleCopyAppsScript}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Código Copiado!' : 'Copiar Código do Google Apps Script'}</span>
                </button>
              </div>

              <ol start={4} className="list-decimal list-inside space-y-1 text-stone-600 pl-1 pt-1">
                <li>No Apps Script, clique no botão azul <strong>Implantar → Nova Implantação</strong>.</li>
                <li>Em <i>Tipo</i> (ícone de engrenagem), selecione <strong>App da Web</strong>.</li>
                <li>Em <i>Quem pode acessar</i>, escolha <strong>Qualquer pessoa</strong>.</li>
                <li>Clique em <strong>Implantar</strong>, copie a URL gerada e cole no campo acima!</li>
              </ol>

              <p className="text-[11px] text-pink-700 font-semibold pt-1">
                ✨ A planilha criará automaticamente as colunas e notificará a Carina por e-mail/notificação push no celular a cada nova presença!
              </p>
            </div>
          )}
        </div>

        {/* Botões de Ação do Painel (Todos >= 48px) */}
        <div className="space-y-2.5 pt-3 border-t border-stone-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={handleCopySummary}
              className="min-h-[48px] py-3 px-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copiado!' : 'Copiar Resumo'}</span>
            </button>

            <a
              href={whatsAppSummaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar no WhatsApp</span>
            </a>

            <button
              onClick={handleExportCSV}
              className="min-h-[48px] py-3 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Planilha</span>
            </button>
          </div>

          {list.length > 0 && (
            <button
              onClick={handleClearList}
              className="w-full min-h-[48px] py-2.5 text-stone-400 hover:text-rose-500 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar todos os dados locais</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
