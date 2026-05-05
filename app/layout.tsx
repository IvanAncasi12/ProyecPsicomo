// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

type CarreraData = {
  nombre: string
  logoUrl: string
  descripcion: string
}

const INSTITUCION_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID || '11'
const API_PUBLICA = 'https://serviciopagina.upea.bo'

function limpiarTexto(texto?: string | null) {
  if (!texto) return ''

  return String(texto)
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function construirLogoUrl(logo?: string | null) {
  if (!logo) return ''

  const logoLimpio = String(logo).trim()

  if (!logoLimpio) return ''

  if (
    logoLimpio.startsWith('http://') ||
    logoLimpio.startsWith('https://')
  ) {
    return logoLimpio
  }

  return `${API_PUBLICA}/InstitucionUpea/${logoLimpio}`
}

async function getCarreraData(): Promise<CarreraData> {
  try {
    const res = await fetch(`${API_PUBLICA}/api/carrerasAll`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
      next: {
        revalidate: 0,
      },
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const carreras = await res.json()

    const carrera = Array.isArray(carreras)
      ? carreras.find(
          (item: any) =>
            String(item?.institucion_id) === String(INSTITUCION_ID)
        )
      : null

    if (!carrera) {
      throw new Error(`No se encontró la institución ${INSTITUCION_ID}`)
    }

    const nombre =
      limpiarTexto(carrera?.carrera) ||
      limpiarTexto(carrera?.nombre_simple) ||
      limpiarTexto(carrera?.institucion_nombre) ||
      'UPEA'

    const logoUrl = construirLogoUrl(carrera?.institucion_logo)

    const descripcion = `${nombre} - Universidad Pública de El Alto`

    return {
      nombre,
      logoUrl,
      descripcion,
    }
  } catch (error) {
    console.warn('No se pudo cargar metadata desde carrerasAll:', error)

    return {
      nombre: 'UPEA',
      logoUrl:
        'https://ui-avatars.com/api/?name=UPEA&background=064E3B&color=fff',
      descripcion: 'Universidad Pública de El Alto',
    }
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { nombre, logoUrl, descripcion } = await getCarreraData()

  return {
    title: nombre,
    description: descripcion,

    icons: {
      icon: [
        {
          url: logoUrl,
          type: 'image/png',
        },
      ],
      shortcut: [
        {
          url: logoUrl,
          type: 'image/png',
        },
      ],
      apple: [
        {
          url: logoUrl,
          type: 'image/png',
        },
      ],
    },

    openGraph: {
      title: nombre,
      description: descripcion,
      images: [
        {
          url: logoUrl,
          alt: nombre,
        },
      ],
      type: 'website',
      locale: 'es_BO',
      siteName: nombre,
    },

    twitter: {
      card: 'summary',
      title: nombre,
      description: descripcion,
      images: [logoUrl],
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { nombre, logoUrl } = await getCarreraData()

  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <title>{nombre}</title>

        <link rel="icon" href={logoUrl} type="image/png" />
        <link rel="shortcut icon" href={logoUrl} type="image/png" />
        <link rel="apple-touch-icon" href={logoUrl} />

        <meta name="application-name" content={nombre} />
        <meta name="theme-color" content="#ffffff" />
      </head>

      <body className={`${inter.className} bg-white text-slate-900 antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}