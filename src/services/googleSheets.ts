import type { RSVPData } from '../types'

export const SHEETS_STORAGE_KEY = 'laura_olivia_sheets_url'

// URL padrão da implantação criada no Google Apps Script da Carina
export const DEFAULT_SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbxIsIah-wh6uuvDB1OgDeB9LJYbyExtTZ_i9bkwmaaXIIvr4TptF8w74U-R4fEmbYneEA/exec'

// URL configurada (obtida do localStorage, env ou URL padrão)
export const getGoogleSheetsUrl = (): string => {
  if (typeof window === 'undefined') return ''
  return (
    localStorage.getItem(SHEETS_STORAGE_KEY) ||
    import.meta.env.VITE_GOOGLE_SHEETS_URL ||
    DEFAULT_SHEETS_URL
  )
}

export const setGoogleSheetsUrl = (url: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(SHEETS_STORAGE_KEY, url.trim())
}

/**
 * Envia uma confirmação de presença (RSVP) para o Google Sheets via Webhook.
 * Utiliza mode: 'no-cors' para evitar bloqueios de CORS do Google Apps Script.
 */
export const sendRSVPToGoogleSheets = async (
  rsvp: RSVPData,
  customUrl?: string
): Promise<boolean> => {
  const url = customUrl || getGoogleSheetsUrl()

  if (!url) {
    console.info('Google Sheets não configurado ainda. O RSVP foi salvo apenas localmente.')
    return false
  }

  // Monta a lista formatada de crianças para lembrancinhas
  const childrenDetails =
    rsvp.children && rsvp.children.length > 0
      ? rsvp.children
          .map((c) => `${c.name}${c.age ? ` (${c.age})` : ''}`)
          .join(', ')
      : 'Nenhuma'

  const payload = {
    dataHora: new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      dateStyle: 'short',
      timeStyle: 'short',
    }),
    nome: rsvp.guestName,
    telefone: rsvp.phone,
    presenca: rsvp.attending === 'yes' ? 'Confirmado ✅' : 'Não poderá comparecer ❌',
    acompanhantesAdultos: rsvp.adultGuests || 'Nenhum',
    totalAdultos: (rsvp.attending === 'yes' ? 1 : 0) + (rsvp.adultCount || 0),
    totalCriancas: rsvp.children ? rsvp.children.length : 0,
    criancasLembrancinhas: childrenDetails,
    recado: rsvp.message || '',
  }

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    })
    console.log('✅ Confirmação enviada com sucesso para o Google Sheets!')
    return true
  } catch (err) {
    console.warn('Falha na comunicação com o Google Sheets:', err)
    return false
  }
}

/**
 * Código pronto do Google Apps Script para a Carina ou o usuário colar na planilha
 */
export const GOOGLE_APPS_SCRIPT_CODE = `// Se você criou o Apps Script direto pelo site script.google.com (por fora da planilha),
// cole o link da sua planilha dentro das aspas abaixo:
var URL_DA_PLANILHA = ""; // Ex: "https://docs.google.com/spreadsheets/d/1Bxi.../edit"

function doPost(e) {
  try {
    var sheet;
    if (URL_DA_PLANILHA && URL_DA_PLANILHA.indexOf("http") !== -1) {
      sheet = SpreadsheetApp.openByUrl(URL_DA_PLANILHA).getActiveSheet();
    } else {
      var activeSS = SpreadsheetApp.getActiveSpreadsheet();
      if (!activeSS) {
        throw new Error("Planilha não vinculada. Por favor, preencha a variável URL_DA_PLANILHA no topo do código com o link da sua planilha do Google Sheets.");
      }
      sheet = activeSS.getActiveSheet();
    }
    
    var data = JSON.parse(e.postData.contents);
    
    // Cria o cabeçalho se a planilha estiver vazia
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Data / Hora",
        "Nome do Convidado",
        "Telefone / WhatsApp",
        "Presença",
        "Acompanhantes Adultos",
        "Total de Adultos",
        "Total de Crianças",
        "Crianças e Idades (Lembrancinhas)",
        "Mensagem / Recado"
      ]);
      
      // Formata a linha de cabeçalho
      var headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setBackground("#fbcfe8"); // Rosa suave
      headerRange.setFontWeight("bold");
      headerRange.setFontColor("#831843");
    }
    
    // Insere os dados do convidado
    sheet.appendRow([
      data.dataHora || new Date().toLocaleString("pt-BR"),
      data.nome || "",
      data.telefone || "",
      data.presenca || "",
      data.acompanhantesAdultos || "Nenhum",
      data.totalAdultos || 1,
      data.totalCriancas || 0,
      data.criancasLembrancinhas || "Nenhuma",
      data.recado || ""
    ]);
    
    // Opcional: Notificar a Carina por e-mail instantaneamente a cada confirmação
    var emailProprietario = Session.getActiveUser().getEmail();
    if (emailProprietario && data.presenca && data.presenca.indexOf("Confirmado") !== -1) {
      MailApp.sendEmail({
        to: emailProprietario,
        subject: "🎉 Nova Presença Confirmada: " + data.nome + " (1° Aninho Laura & Olívia - Princesas da Disney)",
        body: "Olá, Carina!\\n\\nUma nova presença acaba de ser confirmada no site:\\n\\n" +
              "👤 Convidado: " + data.nome + "\\n" +
              "📱 WhatsApp: " + data.telefone + "\\n" +
              "👥 Acompanhantes: " + data.acompanhantesAdultos + "\\n" +
              "🎁 Crianças p/ Lembrancinhas: " + data.criancasLembrancinhas + "\\n" +
              "💌 Recado: " + (data.recado || "Sem recado") + "\\n\\n" +
              "Acesse sua planilha para ver a lista completa!"
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`
