import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'pixan WA - Admin Dashboard',
  description: 'Portal de administración para pixan WA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
