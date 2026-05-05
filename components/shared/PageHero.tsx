'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'

type PageHeroProps = {
  titulo: string
}

export default function PageHero({ titulo }: PageHeroProps) {
  const [institucionData, setInstitucionData] = useState<any>(null)
  const [portadas, setPortadas] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'

  function buildImageUrl(image?: string | null) {
    if (!image) return ''

    const imageClean = String(image).trim()

    if (!imageClean) return ''

    if (imageClean.startsWith('http')) {
      return imageClean
    }

    const cleanBase = baseUrl.replace(/\/$/, '')

    if (
      imageClean.includes('/') ||
      imageClean.startsWith('InstitucionUpea') ||
      imageClean.startsWith('/InstitucionUpea')
    ) {
      const path = imageClean.startsWith('/') ? imageClean : `/${imageClean}`
      return `${cleanBase}${path}`
    }

    return `${cleanBase}/InstitucionUpea/Portada/${imageClean}`
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '11'

        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        setInstitucionData(principalRes.data?.Descripcion)

        const contenidoRes = await apiClient.get(`/institucion/${id}/contenido`)
        const portadasData = contenidoRes.data?.portada || []

        const portadasFormateadas = portadasData
          .filter((item: any) => item?.portada_imagen)
          .map((item: any) => ({
            ...item,
            portada_imagen: buildImageUrl(item.portada_imagen),
          }))

        setPortadas(portadasFormateadas)

        setTimeout(() => setIsLoaded(true), 120)
      } catch (error) {
        console.warn('Error cargando PageHero:', error)
        setIsLoaded(true)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (portadas.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % portadas.length)
    }, 5500)

    return () => clearInterval(interval)
  }, [portadas.length])

  const colores = institucionData?.colorinstitucion?.[0]
  const colorPrimario = colores?.color_primario || '#7A0C14'
  const colorSecundario = colores?.color_secundario || '#D4AF37'

  return (
    <section className="relative min-h-[42vh] md:min-h-[48vh] overflow-hidden bg-slate-950 flex items-center justify-center">
      {/* Fondo dinámico con portadas */}
      <div className="absolute inset-0">
        {portadas.length > 0 ? (
          portadas.map((portada, index) => (
            <div
              key={portada.portada_id || index}
              className={`absolute inset-0 transition-opacity duration-[1400ms] ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={portada.portada_imagen}
                alt={portada.portada_titulo || titulo}
                className="w-full h-full object-cover animate-[pageHeroZoom_18s_ease-in-out_infinite_alternate]"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          ))
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${colorPrimario}, #020617 70%)`,
            }}
          />
        )}

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                180deg,
                rgba(2, 6, 23, 0.88) 0%,
                rgba(15, 23, 42, 0.76) 48%,
                rgba(15, 23, 42, 0.86) 100%
              ),
              radial-gradient(circle at 50% 38%, ${colorSecundario}22, transparent 30%),
              radial-gradient(circle at 74% 72%, ${colorPrimario}35, transparent 32%)
            `,
          }}
        />

        {/* Patrón suave */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[linear-gradient(90deg,#ffffff_1px,transparent_1px),linear-gradient(180deg,#ffffff_1px,transparent_1px)] bg-[size:72px_72px]" />

        {/* Luz inferior */}
        <div
          className="absolute left-1/2 bottom-0 w-[80vw] h-32 -translate-x-1/2 blur-3xl opacity-35 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${colorSecundario}65, transparent 70%)`,
          }}
        />
      </div>

      {/* Contenido centrado */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-14">
        <div
          className={`mx-auto max-w-4xl text-center transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-7">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, #ffffff 0%, ${colorSecundario} 35%, #ffffff 60%, ${colorPrimario} 100%)`,
                backgroundSize: '180% 180%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter:
                  'drop-shadow(0 16px 30px rgba(0,0,0,0.45)) drop-shadow(0 0 18px rgba(255,255,255,0.12))',
                animation: 'pageHeroGradient 5.5s ease-in-out infinite',
              }}
            >
              {titulo}
            </span>
          </h1>

          <div className="flex items-center justify-center gap-3 text-white/70 text-base md:text-lg font-black">
            <span>Inicio</span>
            <span style={{ color: colorSecundario }}>●</span>
            <span className="text-white">{titulo}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pageHeroZoom {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.08);
          }
        }

        @keyframes pageHeroGradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </section>
  )
}