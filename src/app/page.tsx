'use client'
import Preloader from '@/components/Preloader'
import Cursor from '@/components/Cursor'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Properties from '@/components/Properties'
import Reels from '@/components/Reels'
import BuySellRent from '@/components/BuySellRent'
import AnimatedText from '@/components/AnimatedText'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'
import { useLenis } from '@/hooks/useLenis'

export default function Home() {
  useLenis()
  return (
    <>
      <Preloader />
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Properties />
        <Reels />
        <BuySellRent />
        <AnimatedText />
      </main>
      <Footer />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#1A1A1A',
            color: '#F0EDE8',
            border: '1px solid rgba(201,169,110,0.3)',
            fontFamily: '"Inter", sans-serif',
          },
        }}
      />
    </>
  )
}
