import { useState, type FC, type FormEvent } from 'react'
import confetti from 'canvas-confetti'
import {
  Heart,
  Users,
  Baby,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Sparkles,
  Send,
  Gift,
} from 'lucide-react'
import type { ChildGuest, RSVPData } from '../types'

interface RSVPFormProps {
  onRSVPSubmitted: (data: RSVPData) => void
}

export const RSVPForm: FC<RSVPFormProps> = ({ onRSVPSubmitted }) => {
  const [guestName, setGuestName] = useState('')
  const [phone, setPhone] = useState('')
  const [attending, setAttending] = useState<'yes' | 'no' | null>(null)
  const [hasAdults, setHasAdults] = useState<boolean>(false)
  const [adultGuests, setAdultGuests] = useState('')
  const [hasChildren, setHasChildren] = useState<boolean>(false)
  const [children, setChildren] = useState<ChildGuest[]>([
    { id: '1', name: '', age: '' },
  ])
  const [message, setMessage] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<RSVPData | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  // Adicionar criança
  const handleAddChild = () => {
    setChildren([
      ...children,
      { id: Date.now().toString(), name: '', age: '' },
    ])
  }

  // Remover criança
  const handleRemoveChild = (id: string) => {
    if (children.length === 1) {
      setChildren([{ id: '1', name: '', age: '' }])
      setHasChildren(false)
      return
    }
    setChildren(children.filter((c) => c.id !== id))
  }

  // Atualizar campo da criança
  const handleUpdateChild = (id: string, field: 'name' | 'age', value: string) => {
    setChildren(
      children.map((child) =>
        child.id === id ? { ...child, [field]: value } : child
      )
    )
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!guestName.trim()) {
      setErrorMessage('Por favor, digite seu nome completo.')
      return
    }

    if (!phone.trim()) {
      setErrorMessage('Por favor, informe um número de telefone/WhatsApp.')
      return
    }

    if (!attending) {
      setErrorMessage('Por favor, informe se você comparecerá ao evento.')
      return
    }

    // Filtrar crianças preenchidas
    const validChildren = hasChildren
      ? children.filter((c) => c.name.trim() !== '')
      : []

    const rsvp: RSVPData = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      guestName: guestName.trim(),
      phone: phone.trim(),
      attending,
      hasAdults: attending === 'yes' && hasAdults,
      adultGuests: attending === 'yes' && hasAdults ? adultGuests.trim() : '',
      adultCount: attending === 'yes' && hasAdults ? (adultGuests.split(',').filter(x => x.trim().length > 0).length || 1) : 0,
      hasChildren: attending === 'yes' && hasChildren && validChildren.length > 0,
      children: attending === 'yes' ? validChildren : [],
      message: message.trim(),
    }

    // Salvar localmente
    try {
      const stored = localStorage.getItem('laura_olivia_rsvp_list')
      const currentList: RSVPData[] = stored ? JSON.parse(stored) : []
      localStorage.setItem(
        'laura_olivia_rsvp_list',
        JSON.stringify([...currentList, rsvp])
      )
    } catch (err) {
      console.warn('Erro ao salvar localmente:', err)
    }

    // Efeito de confetes
    if (attending === 'yes') {
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#ec4899', '#f43f5e', '#eab308', '#a855f7'],
        })
      } catch (err) {
        console.warn(err)
      }
    }

    setSubmittedData(rsvp)
    setIsSubmitted(true)
    onRSVPSubmitted(rsvp)
  }

  // Gera a mensagem para o WhatsApp da Carina
  const getWhatsAppMessage = () => {
    if (!submittedData) return ''

    let text = `👑 *CONFIRMAÇÃO DE PRESENÇA - FESTA REAL DAS GÊMEAS* 👑\n`
    text += `*Laura & Olívia • 1º Aninho Real*\n\n`
    text += `👤 *Convidado:* ${submittedData.guestName}\n`
    text += `📱 *Telefone:* ${submittedData.phone}\n`

    if (submittedData.attending === 'yes') {
      text += `✅ *Presença:* Sim, estarei presente com muita alegria!\n\n`

      if (submittedData.hasAdults && submittedData.adultGuests) {
        text += `👥 *Acompanhante(s) Adulto(s):* ${submittedData.adultGuests}\n`
      } else {
        text += `👥 *Acompanhante Adulto:* Nenhum\n`
      }

      if (submittedData.hasChildren && submittedData.children.length > 0) {
        text += `\n👶 *Crianças para Lembrancinhas (${submittedData.children.length}):*\n`
        submittedData.children.forEach((c, idx) => {
          text += `  ${idx + 1}. ${c.name} - ${c.age || 'Idade não informada'}\n`
        })
      } else {
        text += `👶 *Crianças:* Não levarei crianças\n`
      }

      if (submittedData.message) {
        text += `\n💌 *Recado para as Princesas:* "${submittedData.message}"\n`
      }
    } else {
      text += `❌ *Presença:* Infelizmente não poderei comparecer.\n`
      if (submittedData.message) {
        text += `💌 *Recado carinhoso:* "${submittedData.message}"\n`
      }
    }

    return encodeURIComponent(text)
  }

  const handleOpenWhatsApp = () => {
    const text = getWhatsAppMessage()
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  const handleReset = () => {
    setIsSubmitted(false)
    setSubmittedData(null)
    setGuestName('')
    setPhone('')
    setAttending(null)
    setHasAdults(false)
    setAdultGuests('')
    setHasChildren(false)
    setChildren([{ id: '1', name: '', age: '' }])
    setMessage('')
  }

  return (
    <section id="rsvp" className="py-12 px-4 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-pink-200/90 relative overflow-hidden">
        
        {/* Decoração sutil no topo */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-pink-300 via-amber-300 to-purple-300" />

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-pink-100 rounded-full text-pink-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
            <span>Confirmação de Presença Real</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-pink-900 font-serif">
            Confirme Sua Presença 💌
          </h2>

          <p className="text-sm text-stone-600 mt-2 max-w-lg mx-auto font-medium">
            Para que o reino das princesas possa preparar cada detalhe com amor e carinho, por favor confirme sua presença!
          </p>

          <p className="text-xs text-amber-700 font-semibold mt-1">
            * Não se preocupe com presentes, o mais importante é você celebrar conosco!
          </p>
        </div>

        {/* TELA DE SUCESSO / PASSE REAL */}
        {isSubmitted && submittedData ? (
          <div className="space-y-6 text-center animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-pink-900 font-serif">
                {submittedData.attending === 'yes'
                  ? 'Presença Confirmada com Sucesso!'
                  : 'Agradecemos o seu carinho!'}
              </h3>
              <p className="text-sm text-stone-600 font-medium">
                {submittedData.attending === 'yes'
                  ? `Obrigado, ${submittedData.guestName}! As princesas Laura & Olívia estão ansiosas para te ver!`
                  : `Sentiremos sua falta, ${submittedData.guestName}! O seu recado carinhoso foi registrado.`}
              </p>
            </div>

            {/* Resumo do Passe Real */}
            {submittedData.attending === 'yes' && (
              <div className="p-5 bg-gradient-to-br from-pink-50 to-amber-50 rounded-2xl border border-pink-200 text-left text-sm space-y-2.5 max-w-md mx-auto shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-pink-200">
                  <span className="font-bold text-pink-900 font-serif">Passe Real de Acesso</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full uppercase">
                    Confirmado
                  </span>
                </div>
                <p><strong className="text-stone-800">Convidado(a):</strong> {submittedData.guestName}</p>
                <p><strong className="text-stone-800">WhatsApp:</strong> {submittedData.phone}</p>
                
                {submittedData.hasAdults && submittedData.adultGuests && (
                  <p><strong className="text-stone-800">Acompanhantes:</strong> {submittedData.adultGuests}</p>
                )}

                {submittedData.hasChildren && submittedData.children.length > 0 && (
                  <div className="pt-2 border-t border-pink-200">
                    <p className="font-bold text-pink-800 flex items-center gap-1 mb-1">
                      <Gift className="w-4 h-4 text-amber-500" />
                      Lembrancinhas Reservadas ({submittedData.children.length}):
                    </p>
                    <ul className="list-disc list-inside space-y-0.5 text-xs text-stone-700 pl-1">
                      {submittedData.children.map((c, i) => (
                        <li key={i}>
                          <span className="font-semibold">{c.name}</span> ({c.age || 'sem idade informada'})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Botão para enviar WhatsApp para a organizadora */}
            <div className="space-y-3 max-w-md mx-auto pt-2">
              <button
                onClick={handleOpenWhatsApp}
                className="w-full py-3.5 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Enviar Confirmação no WhatsApp da Carina</span>
              </button>

              <button
                onClick={handleReset}
                className="w-full py-2.5 px-4 text-xs font-semibold text-stone-500 hover:text-stone-700 cursor-pointer"
              >
                Fazer outra confirmação
              </button>
            </div>
          </div>
        ) : (
          /* FORMULÁRIO DE PREENCHIMENTO */
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-xl font-medium flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Nome Completo */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-stone-800 mb-1.5">
                Seu Nome Completo <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Ex: Maria Eduarda Silva"
                className="w-full px-4 py-3 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-white"
                required
              />
            </div>

            {/* Telefone / WhatsApp */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-stone-800 mb-1.5">
                Seu WhatsApp / Telefone <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: (21) 99999-9999"
                className="w-full px-4 py-3 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-white"
                required
              />
            </div>

            {/* Você vai comparecer? */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-stone-800 mb-2">
                Você vai comparecer à Festa Real? <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttending('yes')}
                  className={`py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm border-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    attending === 'yes'
                      ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-200 scale-[1.02]'
                      : 'bg-white text-stone-700 border-pink-200 hover:border-pink-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sim, com certeza! 🎉</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttending('no')}
                  className={`py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm border-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    attending === 'no'
                      ? 'bg-stone-600 text-white border-stone-600 shadow-md scale-[1.02]'
                      : 'bg-white text-stone-700 border-pink-200 hover:border-pink-300'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  <span>Infelizmente não 🥺</span>
                </button>
              </div>
            </div>

            {/* SE FOR COMPARECER (Campos adicionais solicitados no WhatsApp) */}
            {attending === 'yes' && (
              <div className="space-y-5 pt-3 border-t border-pink-100 animate-fade-in">
                
                {/* 1. Acompanhantes Adultos */}
                <div className="p-4 bg-pink-50/60 rounded-2xl border border-pink-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-pink-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-pink-600" />
                      Vai levar acompanhante(s) adulto(s)?
                    </span>
                    <button
                      type="button"
                      onClick={() => setHasAdults(!hasAdults)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                        hasAdults ? 'bg-pink-500' : 'bg-stone-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          hasAdults ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {hasAdults && (
                    <div className="pt-2 animate-fade-in">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Nome(s) do(s) acompanhante(s) adulto(s):
                      </label>
                      <input
                        type="text"
                        value={adultGuests}
                        onChange={(e) => setAdultGuests(e.target.value)}
                        placeholder="Ex: Carlos Silva, Juliana Gomes"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-xs sm:text-sm bg-white"
                      />
                    </div>
                  )}
                </div>

                {/* 2. CRIANÇAS E IDADES (A solicitação chave da Carina para as lembrancinhas!) */}
                <div className="p-4 bg-gradient-to-br from-amber-50/80 via-white to-pink-50/80 rounded-2xl border-2 border-amber-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-pink-950 flex items-center gap-2">
                        <Baby className="w-4 h-4 text-amber-600" />
                        Vai levar criança(s)?
                      </span>
                      <p className="text-[11px] text-amber-800 font-semibold mt-0.5">
                        Essencial para o preparo das lembrancinhas! 🎁
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setHasChildren(!hasChildren)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                        hasChildren ? 'bg-amber-500' : 'bg-stone-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          hasChildren ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {hasChildren && (
                    <div className="pt-3 border-t border-amber-100 space-y-3 animate-fade-in">
                      <div className="p-2.5 bg-amber-100/60 rounded-xl text-[11px] text-amber-900 flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>
                          Informe o <strong>nome</strong> e a <strong>idade</strong> de cada criança para que a lembrancinha seja ideal para ela!
                        </span>
                      </div>

                      {children.map((child, index) => (
                        <div
                          key={child.id}
                          className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-pink-200 shadow-sm"
                        >
                          <span className="text-xs font-bold text-pink-700 w-5 text-center">
                            {index + 1}º
                          </span>

                          <input
                            type="text"
                            value={child.name}
                            onChange={(e) => handleUpdateChild(child.id, 'name', e.target.value)}
                            placeholder="Nome da criança"
                            className="flex-1 px-3 py-1.5 rounded-lg border border-pink-200 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-pink-400"
                            required
                          />

                          <input
                            type="text"
                            value={child.age}
                            onChange={(e) => handleUpdateChild(child.id, 'age', e.target.value)}
                            placeholder="Idade (ex: 3 anos)"
                            className="w-28 sm:w-36 px-3 py-1.5 rounded-lg border border-pink-200 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-pink-400"
                            required
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveChild(child.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remover criança"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={handleAddChild}
                        className="w-full py-2 px-3 border border-dashed border-amber-300 hover:border-amber-400 rounded-xl text-xs font-bold text-amber-700 hover:bg-amber-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar outra criança</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Recado Carinhoso */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-stone-800 mb-1.5">
                    Deixe um recado com carinho para Laura & Olívia (Opcional):
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escreva sua mensagem de bênçãos e carinho para o 1º aninho das princesas..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-white"
                  />
                </div>
              </div>
            )}

            {/* SE NÃO FOR COMPARECER (Apenas mensagem opcional) */}
            {attending === 'no' && (
              <div className="pt-2 animate-fade-in">
                <label className="block text-xs sm:text-sm font-bold text-stone-800 mb-1.5">
                  Gostaria de deixar uma mensagem carinhosa para as princesas? (Opcional):
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Deixe seus votos para as gêmeas..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-white"
                />
              </div>
            )}

            {/* Botão de Envio Principal */}
            <button
              type="submit"
              disabled={!attending}
              className={`w-full py-4 px-6 rounded-2xl font-extrabold text-base shadow-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                attending
                  ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:via-rose-600 hover:to-amber-600 text-white shadow-pink-300/50 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Send className="w-5 h-5" />
              <span>Confirmar Presença Real</span>
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
