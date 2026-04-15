// app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

const inter = Inter({ subsets: ["latin"] })

async function getCarreraData() {
  const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '22'
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
  const token = process.env.NEXT_PUBLIC_API_TOKEN

  try {
    const res = await fetch(`${baseUrl}/api/v2/institucionesPrincipal/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
      next: { revalidate: 0 }
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const json = await res.json()
    const data = json?.Descripcion
    const nombre = data?.institucion_nombre || 'UPEA'
    const logo = data?.institucion_logo
    const logoUrl = logo?.startsWith('http') ? logo : `${baseUrl}${logo}`

    return { nombre, logoUrl }
  } catch {
    // Fallback seguro según el ID configurado
    const fallbacks: Record<string, { nombre: string; logoUrl: string }> = {
      '11': { nombre: 'Derecho', logoUrl: 'https://ui-avatars.com/api/?name=Derecho&background=DC0E10&color=fff' },
      '22': { nombre: 'Economía', logoUrl: 'https://ui-avatars.com/api/?name=Economia&background=064E3B&color=fff' },
      '40': { nombre: 'Auditoría', logoUrl: 'https://ui-avatars.com/api/?name=Auditoria&background=1E40AF&color=fff' },
    }
    return fallbacks[id] || { nombre: 'UPEA', logoUrl: 'https://ui-avatars.com/api/?name=UPEA&background=DC0E10&color=fff' }
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { nombre, logoUrl } = await getCarreraData()
  return {
    title: nombre,
    description: "Formación integral de profesionales con excelencia académica",
    icons: { 
      icon: logoUrl, 
      apple: logoUrl, 
      shortcut: logoUrl 
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { logoUrl } = await getCarreraData()

  return (
    <html lang="es">
      <head>
        <link rel="icon" href={logoUrl} />
        <link rel="apple-touch-icon" href={logoUrl} />
      </head>
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}