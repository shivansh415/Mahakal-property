'use client'
import { Toaster } from 'react-hot-toast'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
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
