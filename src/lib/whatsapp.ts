import { config } from './config'

interface EnquiryParams {
  name: string
  phone: string
  propertyTitle: string
  propertyUrl: string
  message: string
}

export function buildWhatsAppURL(params: EnquiryParams): string {
  const text =
    `*New Property Enquiry* 🏠\n\n` +
    `*Name:* ${params.name}\n` +
    `*Phone:* ${params.phone}\n` +
    `*Property:* ${params.propertyTitle}\n` +
    `*Link:* ${params.propertyUrl}\n` +
    `*Message:* ${params.message}`
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`
}

export function buildBuySellRentURL(type: 'buy' | 'sell' | 'rent'): string {
  const messages = {
    buy: config.whatsappBuy,
    sell: config.whatsappSell,
    rent: config.whatsappRent,
  }
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(messages[type])}`
}

export function buildGeneralEnquiryURL(): string {
  const text = 'Hello! I am interested in Mahakal Property services. Please share more details.'
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`
}

export function openWhatsApp(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer')
}
