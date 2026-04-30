// ============================================================
// MAHAKAL PROPERTY — Central Configuration
// Change these values for each new real estate client
// ============================================================

export const config = {
  // ── Brand ──────────────────────────────────────────────────
  brandName: 'Mahakal Property',
  brandShort: 'MAHAKAL',
  tagline: 'Find Your Space. Own Your Future.',

  // ── Contact ────────────────────────────────────────────────
  whatsappNumber: '916265581678', // India: 91 + 10 digit number, no spaces
  phone: '+91 6265581678',
  email: 'hello@mahakalproperty.com',

  // ── Address ────────────────────────────────────────────────
  address: {
    line1: '12, Vijay Nagar Square',
    line2: 'Indore, Madhya Pradesh 452010',
  },

  // ── Social Links ───────────────────────────────────────────
  social: {
    instagram: 'https://instagram.com/mahakalproperty',
    facebook: 'https://facebook.com/mahakalproperty',
    youtube: 'https://youtube.com/@mahakalproperty',
  },

  // ── Footer Navigation ─────────────────────────────────────
  footerLinks: ['Search', 'Properties', 'About', 'Contact', 'Admin'],

  // ── Hero Section ───────────────────────────────────────────
  heroTitle: 'MAHAKAL',
  heroSubtitle: 'PROPERTY',
  heroCTA: 'Explore Properties',

  // ── Marquee Content ────────────────────────────────────────
  marqueeText:
    'BUY · SELL · RENT · INVEST · INDORE REAL ESTATE · PREMIUM PROPERTIES · ',

  // ── WhatsApp Pre-built Messages ────────────────────────────
  whatsappEnquiry: (propertyTitle: string, propertyLink: string) =>
    `Hello! I'm interested in *${propertyTitle}*.\n\nProperty Link: ${propertyLink}\n\nPlease share more details.`,

  whatsappBuy:
    'Hello! I am looking to *BUY* a property. Please help me.',
  whatsappSell:
    'Hello! I want to *SELL* my property. Please connect me with your team.',
  whatsappRent:
    'Hello! I am looking for a property on *RENT*. Please help me.',

  // ── BuySellRent Panel Descriptions ─────────────────────────
  panels: {
    buy: {
      number: '01',
      title: 'Buy',
      description:
        'Buy smarter with our expert team backed by mortgage, legal, and appraisal professionals — dialed in to get you the best deal. We have helped hundreds of families find their dream home in Indore.',
    },
    sell: {
      number: '02',
      title: 'Sell',
      description:
        'Sell fast, sell high. Your listing gets professional staging, strategic pricing, constant showings, and agents who never stop working until the right buyer signs.',
    },
    rent: {
      number: '03',
      title: 'Rent',
      description:
        'Access properties before they hit the market through agents who know every landlord in town. With years of Indore experience, we unlock the best deals you won\'t find online.',
    },
  },

  // ── Animated Text Section ──────────────────────────────────
  animatedText: {
    line1: 'Find You.',
    line2: "We'll Help You",
    line3: 'Get There.',
    subtext:
      'Our certified agents guide you through every stage of real estate with expert knowledge and reliable support.',
    cta: 'Get Started',
  },

  // ── Footer CTA Section ────────────────────────────────────
  footerCTA: {
    headline: "Find You. We'll Help You Get There.",
    button: "Let's Get Started",
  },

  // ── Admin Panel ────────────────────────────────────────────
  admin: {
    sidebarLinks: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: 'grid' },
      { label: 'Properties', href: '/admin/dashboard/properties', icon: 'home' },
      { label: 'Reels', href: '/admin/dashboard/reels', icon: 'film' },
      { label: 'Agreements', href: '/admin/dashboard/agreements', icon: 'file' },
    ],
  },
} as const

// ── Type Exports ────────────────────────────────────────────
export type Config = typeof config
