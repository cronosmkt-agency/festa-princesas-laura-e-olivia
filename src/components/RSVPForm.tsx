import { useState, type FC, type FormEvent, type ChangeEvent } from 'react'
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
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react'
import { AGE_PRESETS, type ChildGuest, type RSVPData } from '../types'

interface RSVPFormProps {
  onRSVPSubmitted: (data: RSVPData) => void
}

interface FormErrors {
  guestName?: string
  phone?: string
  attending?: string
  adultGuests?: string
  children?: Record<string, { name?: string; age?: string }>
  general?: string
}

/**
 * Formata telefone brasileiro automaticamente enquanto o usuário digita:
 * - Até 10 dígitos: (XX) XXXX-XXXX
 * - 11 dígitos: (XX) XXXXX-XXXX
 */
const formatPhoneNumber = (value: string): string => {
  let digits = value.replace(/\D/g, '')

  // Se colar com DDI +55 e tiver mais de 11 dígitos, remove o 55 inicial
  if (digits.startsWith('55') && digits.length > 11) {
    digits = digits.slice(2)
  }
  digits = digits.slice(0, 11)

  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
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
  const [errors, setErrors] = useState<FormErrors>({})
  const [copied, setCopied] = useState(false)

  // Manipulador com máscara automática de telefone
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: undefined }))
    }
  }

  // Adicionar criança
  const handleAddChild = () => {
    setChildren((prev) => [
      ...prev,
      { id: Date.now().toString(), name: '', age: '' },
    ])
  }

  // Remover criança
  const handleRemoveChild = (id: string) => {
    if (children.length <= 1) {
      setChildren([{ id: '1', name: '', age: '' }])
      setHasChildren(false)
      if (errors.children) {
        setErrors((prev) => ({ ...prev, children: undefined }))
      }
      return
    }
    setChildren((prev) => prev.filter((c) => c.id !== id))
    if (errors.children && errors.children[id]) {
      setErrors((prev) => {
        const nextChildErrors = { ...prev.children }
        delete nextChildErrors[id]
        return {
          ...prev,
          children: Object.keys(nextChildErrors).length > 0 ? nextChildErrors : undefined,
        }
      })
    }
  }

  // Atualizar campo da criança
  const handleUpdateChild = (id: string, field: 'name' | 'age', value: string) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === id ? { ...child, [field]: value } : child
      )
    )
    if (errors.children && errors.children[id]?.[field]) {
      setErrors((prev) => {
        const currentChildErrors = prev.children?.[id]
        if (!currentChildErrors) return prev
        const updatedChild = { ...currentChildErrors, [field]: undefined }
        const nextChildren = { ...prev.children }
        if (!updatedChild.name && !updatedChild.age) {
          delete nextChildren[id]
        } else {
          nextChildren[id] = updatedChild
        }
        return {
          ...prev,
          children: Object.keys(nextChildren).length > 0 ? nextChildren : undefined,
        }
      })
    }
  }

  // Validação limpa e robusta
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    if (!guestName.trim()) {
      newErrors.guestName = 'Por favor, digite seu nome completo.'
      isValid = false
    } else if (guestName.trim().length < 2) {
      newErrors.guestName = 'O nome deve ter pelo menos 2 caracteres.'
      isValid = false
    }

    const rawDigits = phone.replace(/\D/g, '')
    if (!rawDigits) {
      newErrors.phone = 'Por favor, informe seu número de WhatsApp/telefone.'
      isValid = false
    } else if (rawDigits.length < 10) {
      newErrors.phone = 'Telefone incompleto. Digite o DDD + número (ex: (21) 99999-9999).'
      isValid = false
    } else if (rawDigits.startsWith('0')) {
      newErrors.phone = 'O DDD não pode iniciar com 0.'
      isValid = false
    }

    if (!attending) {
      newErrors.attending = 'Por favor, indique se você comparecerá à festa.'
      isValid = false
    }

    if (attending === 'yes') {
      if (hasAdults && !adultGuests.trim()) {
        newErrors.adultGuests = 'Informe o nome do(s) acompanhante(s) adulto(s) ou desmarque a opção.'
        isValid = false
      }

      if (hasChildren) {
        const childErrors: Record<string, { name?: string; age?: string }> = {}
        let hasChildError = false

        children.forEach((child) => {
          const itemErr: { name?: string; age?: string } = {}
          if (!child.name.trim()) {
            itemErr.name = 'Informe o nome da criança.'
            hasChildError = true
          }
          if (!child.age.trim()) {
            itemErr.age = 'Selecione ou digite a idade da criança.'
            hasChildError = true
          }
          if (itemErr.name || itemErr.age) {
            childErrors[child.id] = itemErr
          }
        })

        if (hasChildError) {
          newErrors.children = childErrors
          isValid = false
        }
      }
    }

    if (!isValid) {
      newErrors.general = 'Por favor, revise os campos destacados abaixo antes de enviar.'
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
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
      attending: attending!,
      hasAdults: attending === 'yes' && hasAdults,
      adultGuests: attending === 'yes' && hasAdults ? adultGuests.trim() : '',
      adultCount:
        attending === 'yes' && hasAdults
          ? adultGuests.split(',').filter((x) => x.trim().length > 0).length || 1
          : 0,
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

    // Efeito de confetes no aceite
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

  // Gera o texto refinado para o WhatsApp da Carina
  const getWhatsAppMessageText = (): string => {
    if (!submittedData) return ''

    let text = `👑 *CONFIRMAÇÃO DE PRESENÇA - FESTA DAS PRINCESAS* 👑\n`
    text += `*Laura & Olívia • 1° Aninho*\n\n`
    text += `👤 *Convidado(a):* ${submittedData.guestName}\n`
    text += `📱 *Telefone/WhatsApp:* ${submittedData.phone}\n`

    if (submittedData.attending === 'yes') {
      text += `✅ *Presença:* Confirmada! Estarei presente com muita alegria! 🎉\n\n`

      if (submittedData.hasAdults && submittedData.adultGuests) {
        text += `👥 *Acompanhante(s) Adulto(s):* ${submittedData.adultGuests}\n`
      } else {
        text += `👥 *Acompanhante Adulto:* Nenhum (apenas o titular)\n`
      }

      if (submittedData.hasChildren && submittedData.children.length > 0) {
        text += `\n👶 *Crianças para Lembrancinhas (${submittedData.children.length}):*\n`
        submittedData.children.forEach((c, idx) => {
          text += `  ${idx + 1}. ${c.name} - ${c.age || 'Idade a confirmar'}\n`
        })
      } else {
        text += `👶 *Crianças:* Nenhuma criança acompanhante\n`
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

    return text
  }

  // URL 100% confiável para WhatsApp em iOS/Android/Desktop
  const whatsAppUrl = submittedData
    ? `https://api.whatsapp.com/send?text=${encodeURIComponent(getWhatsAppMessageText())}`
    : '#'

  const handleCopyConfirmation = async () => {
    try {
      await navigator.clipboard.writeText(getWhatsAppMessageText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      console.warn('Erro ao copiar:', err)
    }
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
    setErrors({})
    setCopied(false)
  }

  return (
    <section id="rsvp" className="py-12 px-4 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-pink-200/90 relative overflow-hidden">
        {/* Decoração no topo */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-pink-300 via-amber-300 to-purple-300" />

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-pink-100 rounded-full text-pink-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
            <span>Confirmação de Presença</span>
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
                <div className="flex items-center justify-between pb-3 border-b border-pink-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-300 shadow-sm shrink-0 bg-pink-100">
                      <img
                        src="./laura-e-olivia.jpg"
                        alt="Princesas Laura & Olívia"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-pink-900 font-serif block text-sm">Passe de Acesso</span>
                      <span className="text-[10px] text-pink-600 font-medium">Laura & Olívia • 1° Aninho</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                    Confirmado
                  </span>
                </div>
                <p>
                  <strong className="text-stone-800">Convidado(a):</strong> {submittedData.guestName}
                </p>
                <p>
                  <strong className="text-stone-800">WhatsApp:</strong> {submittedData.phone}
                </p>

                {submittedData.hasAdults && submittedData.adultGuests && (
                  <p>
                    <strong className="text-stone-800">Acompanhantes:</strong> {submittedData.adultGuests}
                  </p>
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

            {/* Ações pós-confirmação (Touch targets >= 48px) */}
            <div className="space-y-3 max-w-md mx-auto pt-2">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[52px] py-3.5 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>Enviar Confirmação no WhatsApp da Carina</span>
              </a>

              <button
                type="button"
                onClick={handleCopyConfirmation}
                className="w-full min-h-[48px] py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Mensagem copiada para enviar!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar texto da confirmação</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full min-h-[48px] py-2.5 px-4 text-xs font-semibold text-stone-500 hover:text-stone-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                Fazer outra confirmação
              </button>
            </div>
          </div>
        ) : (
          /* FORMULÁRIO DE PREENCHIMENTO */
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {errors.general && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-2xl font-medium flex items-center gap-2.5 animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
                <span>{errors.general}</span>
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
                onChange={(e) => {
                  setGuestName(e.target.value)
                  if (errors.guestName) {
                    setErrors((prev) => ({ ...prev, guestName: undefined }))
                  }
                }}
                placeholder="Ex: Maria Eduarda Silva"
                className={`w-full min-h-[48px] px-4 py-3 rounded-2xl border text-base sm:text-sm bg-white focus:outline-none focus:ring-2 transition-colors ${
                  errors.guestName
                    ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20'
                    : 'border-pink-200 focus:ring-pink-400'
                }`}
                required
              />
              {errors.guestName && (
                <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{errors.guestName}</span>
                </p>
              )}
            </div>

            {/* Telefone / WhatsApp com Máscara Automática */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs sm:text-sm font-bold text-stone-800">
                  Seu WhatsApp / Telefone <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-stone-500 font-medium">
                  Com DDD
                </span>
              </div>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(21) 99999-9999"
                maxLength={15}
                className={`w-full min-h-[48px] px-4 py-3 rounded-2xl border text-base sm:text-sm bg-white focus:outline-none focus:ring-2 transition-colors ${
                  errors.phone
                    ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20'
                    : 'border-pink-200 focus:ring-pink-400'
                }`}
                required
              />
              {errors.phone && (
                <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            {/* Você vai comparecer? */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-stone-800 mb-2">
                Você vai comparecer à festa? <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAttending('yes')
                    if (errors.attending) {
                      setErrors((prev) => ({ ...prev, attending: undefined }))
                    }
                  }}
                  className={`min-h-[52px] py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm border-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    attending === 'yes'
                      ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-200 scale-[1.02]'
                      : 'bg-white text-stone-700 border-pink-200 hover:border-pink-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Sim, com certeza! 🎉</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAttending('no')
                    if (errors.attending) {
                      setErrors((prev) => ({ ...prev, attending: undefined }))
                    }
                  }}
                  className={`min-h-[52px] py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm border-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    attending === 'no'
                      ? 'bg-stone-600 text-white border-stone-600 shadow-md scale-[1.02]'
                      : 'bg-white text-stone-700 border-pink-200 hover:border-pink-300'
                  }`}
                >
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>Infelizmente não 🥺</span>
                </button>
              </div>
              {errors.attending && (
                <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{errors.attending}</span>
                </p>
              )}
            </div>

            {/* SE FOR COMPARECER */}
            {attending === 'yes' && (
              <div className="space-y-5 pt-3 border-t border-pink-100 animate-fade-in">
                {/* 1. Acompanhantes Adultos */}
                <div className="p-4 bg-pink-50/60 rounded-2xl border border-pink-100 space-y-3">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setHasAdults(!hasAdults)
                      if (errors.adultGuests) {
                        setErrors((prev) => ({ ...prev, adultGuests: undefined }))
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault()
                        setHasAdults(!hasAdults)
                      }
                    }}
                    className="flex items-center justify-between min-h-[48px] cursor-pointer select-none rounded-xl p-1 -m-1 hover:bg-pink-100/40 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-pink-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-pink-600" />
                      Vai levar acompanhante(s) adulto(s)?
                    </span>

                    <div className="min-w-[48px] min-h-[48px] flex items-center justify-center">
                      <div
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          hasAdults ? 'bg-pink-500' : 'bg-stone-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            hasAdults ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {hasAdults && (
                    <div className="pt-2 animate-fade-in">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Nome(s) do(s) acompanhante(s) adulto(s):
                      </label>
                      <input
                        type="text"
                        value={adultGuests}
                        onChange={(e) => {
                          setAdultGuests(e.target.value)
                          if (errors.adultGuests) {
                            setErrors((prev) => ({ ...prev, adultGuests: undefined }))
                          }
                        }}
                        placeholder="Ex: Carlos Silva, Juliana Gomes"
                        className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border text-base sm:text-sm bg-white focus:outline-none focus:ring-2 ${
                          errors.adultGuests
                            ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20'
                            : 'border-pink-200 focus:ring-pink-300'
                        }`}
                      />
                      {errors.adultGuests && (
                        <p className="text-xs text-rose-500 font-semibold mt-1">
                          {errors.adultGuests}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. CRIANÇAS E IDADES COM BOTÕES DE SELEÇÃO RÁPIDA */}
                <div className="p-4 bg-gradient-to-br from-amber-50/80 via-white to-pink-50/80 rounded-2xl border-2 border-amber-200/80 space-y-3">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setHasChildren(!hasChildren)
                      if (errors.children) {
                        setErrors((prev) => ({ ...prev, children: undefined }))
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault()
                        setHasChildren(!hasChildren)
                      }
                    }}
                    className="flex items-center justify-between min-h-[48px] cursor-pointer select-none rounded-xl p-1 -m-1 hover:bg-amber-100/40 transition-colors"
                  >
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-pink-950 flex items-center gap-2">
                        <Baby className="w-4 h-4 text-amber-600" />
                        Vai levar criança(s)?
                      </span>
                      <p className="text-[11px] text-amber-800 font-semibold mt-0.5">
                        Essencial para o preparo das lembrancinhas! 🎁
                      </p>
                    </div>

                    <div className="min-w-[48px] min-h-[48px] flex items-center justify-center">
                      <div
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          hasChildren ? 'bg-amber-500' : 'bg-stone-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            hasChildren ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {hasChildren && (
                    <div className="pt-3 border-t border-amber-100 space-y-4 animate-fade-in">
                      <div className="p-2.5 bg-amber-100/60 rounded-xl text-[11px] text-amber-900 flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>
                          Informe o <strong>nome</strong> e selecione ou digite a <strong>idade</strong> de cada criança para que a lembrancinha seja personalizada para ela!
                        </span>
                      </div>

                      {children.map((child, index) => {
                        const childErr = errors.children?.[child.id]
                        return (
                          <div
                            key={child.id}
                            className="p-3.5 sm:p-4 bg-white rounded-2xl border border-pink-200 shadow-sm space-y-3"
                          >
                            <div className="flex items-center justify-between pb-1.5 border-b border-pink-100">
                              <span className="text-xs font-bold text-pink-800 flex items-center gap-1.5">
                                <span className="w-5 h-5 bg-pink-100 text-pink-700 rounded-full flex items-center justify-center text-[10px] font-extrabold">
                                  {index + 1}
                                </span>
                                Criança {index + 1}
                              </span>

                              <button
                                type="button"
                                onClick={() => handleRemoveChild(child.id)}
                                className="min-w-[48px] min-h-[48px] p-2 text-stone-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors flex items-center justify-center cursor-pointer"
                                title="Remover criança"
                                aria-label={`Remover criança ${index + 1}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Nome da criança */}
                            <div>
                              <label className="block text-xs font-semibold text-stone-700 mb-1">
                                Nome da Criança <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={child.name}
                                onChange={(e) =>
                                  handleUpdateChild(child.id, 'name', e.target.value)
                                }
                                placeholder="Nome completo ou apelido da criança"
                                className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border text-base sm:text-sm bg-white focus:outline-none focus:ring-2 ${
                                  childErr?.name
                                    ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20'
                                    : 'border-pink-200 focus:ring-pink-300'
                                }`}
                              />
                              {childErr?.name && (
                                <p className="text-xs text-rose-500 font-semibold mt-1">
                                  {childErr.name}
                                </p>
                              )}
                            </div>

                            {/* Idade da criança com Botões Rápidos + Input Livre */}
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-semibold text-stone-700">
                                  Idade da Criança <span className="text-rose-500">*</span>
                                </label>
                                <span className="text-[10px] text-amber-800 font-bold">
                                  Toque rápido ou digite
                                </span>
                              </div>

                              {/* Botões de Seleção Rápida (Touch targets >= 48px) */}
                              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2">
                                {AGE_PRESETS.map((preset) => {
                                  const isSelected = child.age === preset
                                  return (
                                    <button
                                      key={preset}
                                      type="button"
                                      onClick={() =>
                                        handleUpdateChild(child.id, 'age', preset)
                                      }
                                      className={`min-h-[48px] px-2 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 flex items-center justify-center gap-1 transition-all cursor-pointer ${
                                        isSelected
                                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-500 shadow-sm shadow-pink-200 scale-[1.02]'
                                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-pink-300 hover:bg-pink-50/40'
                                      }`}
                                    >
                                      {isSelected && (
                                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                      )}
                                      <span>{preset}</span>
                                    </button>
                                  )
                                })}
                              </div>

                              {/* Campo de Entrada Livre para Outras Idades */}
                              <input
                                type="text"
                                value={child.age}
                                onChange={(e) =>
                                  handleUpdateChild(child.id, 'age', e.target.value)
                                }
                                placeholder="Ou digite outra idade (ex: 6 meses, 6 anos, 9 anos...)"
                                className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border text-base sm:text-sm bg-white focus:outline-none focus:ring-2 ${
                                  childErr?.age
                                    ? 'border-rose-400 focus:ring-rose-300 bg-rose-50/20'
                                    : 'border-pink-200 focus:ring-pink-300'
                                }`}
                              />
                              {childErr?.age && (
                                <p className="text-xs text-rose-500 font-semibold mt-1">
                                  {childErr.age}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}

                      {/* Botão de Adicionar Outra Criança (min-h >= 48px) */}
                      <button
                        type="button"
                        onClick={handleAddChild}
                        className="w-full min-h-[48px] py-3 px-4 border-2 border-dashed border-amber-300 hover:border-amber-400 rounded-xl text-xs sm:text-sm font-bold text-amber-800 hover:bg-amber-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
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
                    className="w-full min-h-[80px] px-4 py-3 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-base sm:text-sm bg-white"
                  />
                </div>
              </div>
            )}

            {/* SE NÃO FOR COMPARECER */}
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
                  className="w-full min-h-[80px] px-4 py-3 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-base sm:text-sm bg-white"
                />
              </div>
            )}

            {/* Botão de Envio Principal (Touch target >= 54px) */}
            <button
              type="submit"
              disabled={!attending}
              className={`w-full min-h-[54px] py-4 px-6 rounded-2xl font-extrabold text-base shadow-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                attending
                  ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:via-rose-600 hover:to-amber-600 text-white shadow-pink-300/50 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Send className="w-5 h-5" />
              <span>Confirmar Presença</span>
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
