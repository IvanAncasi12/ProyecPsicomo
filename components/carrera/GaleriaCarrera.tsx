'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'

type Portada = {
  portada_id?: number | string
  portada_titulo?: string
  portada_descripcion?: string
  portada_imagen: string
}

export default function GaleriaCarrera() {
  const [portadas, setPortadas] = useState<Portada[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [loading, setLoading] = useState(true)
  const [institucionData, setInstitucionData] = useState<any>(null)

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

        const contenidoRes = await apiClient.get(`/institucion/${id}/contenido`)
        const portadasData = contenidoRes.data?.portada || []

        const portadasFormateadas = portadasData
          .filter((p: any) => p?.portada_imagen)
          .map((p: any) => ({
            ...p,
            portada_imagen: buildImageUrl(p.portada_imagen),
          }))

        setPortadas(portadasFormateadas)

        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        setInstitucionData(principalRes.data?.Descripcion)
      } catch (error) {
        console.warn('Error cargando portadas de la galería', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || portadas.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % portadas.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, portadas.length])

  const colores = institucionData?.colorinstitucion?.[0]
  const colorPrimario = colores?.color_primario || '#7A0C14'
  const colorSecundario = colores?.color_secundario || '#D4AF37'

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false)

    setTimeout(() => {
      setIsAutoPlaying(true)
    }, 10000)
  }

  const prevImage = () => {
    if (portadas.length === 0) return

    pauseAutoPlay()
    setCurrentIndex((prev) => (prev - 1 + portadas.length) % portadas.length)
  }

  const nextImage = () => {
    if (portadas.length === 0) return

    pauseAutoPlay()
    setCurrentIndex((prev) => (prev + 1) % portadas.length)
  }

  const goToImage = (index: number) => {
    pauseAutoPlay()
    setCurrentIndex(index)
  }

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="h-8 w-80 max-w-full mx-auto bg-slate-200 rounded-xl animate-pulse mb-4" />
          <div className="h-1.5 w-24 mx-auto bg-slate-200 rounded-full animate-pulse" />
        </div>

        <div className="h-96 md:h-[540px] rounded-[2rem] bg-slate-200 animate-pulse shadow-lg" />
      </section>
    )
  }

  if (portadas.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full border shadow-sm mb-5 bg-white text-xs md:text-sm font-extrabold tracking-[0.22em] uppercase"
            style={{
              borderColor: `${colorSecundario}55`,
              color: colorPrimario,
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: colorSecundario }}
            />
            Galería institucional
          </span>

          <h3 className="text-3xl md:text-5xl font-black text-slate-950 mb-4">
            Nuestra Institución en Imágenes
          </h3>

          <div
            className="w-24 h-1.5 mx-auto rounded-full"
            style={{
              background: `linear-gradient(90deg, ${colorPrimario}, ${colorSecundario})`,
            }}
          />
        </div>

        <div className="h-96 md:h-[500px] rounded-[2rem] bg-white border border-dashed border-slate-300 flex flex-col items-center justify-center text-center px-6 shadow-sm">
          <div className="text-6xl mb-4">🖼️</div>
          <h4 className="text-2xl font-black text-slate-950 mb-2">
            No hay portadas disponibles
          </h4>
          <p className="text-slate-600 font-medium max-w-md">
            Cuando se registren portadas en el servicio, aparecerán
            automáticamente en esta galería.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-10">
        <span
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full border shadow-sm mb-5 bg-white text-xs md:text-sm font-extrabold tracking-[0.22em] uppercase"
          style={{
            borderColor: `${colorSecundario}55`,
            color: colorPrimario,
          }}
        >
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: colorSecundario }}
          />
          Galería institucional
        </span>

        <h3 className="text-3xl md:text-5xl font-black text-slate-950 mb-4">
          Nuestra Institución en Imágenes
        </h3>

        <div
          className="w-24 h-1.5 mx-auto rounded-full"
          style={{
            background: `linear-gradient(90deg, ${colorPrimario}, ${colorSecundario}, ${colorPrimario})`,
            boxShadow: `0 0 22px ${colorSecundario}55`,
          }}
        />
      </div>

      <div
        className="relative overflow-hidden rounded-[2rem] bg-slate-950 shadow-[0_28px_80px_rgba(15,23,42,0.28)] border"
        style={{
          borderColor: `${colorPrimario}22`,
        }}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {portadas.map((portada, i) => (
            <div key={portada.portada_id || i} className="w-full flex-shrink-0">
              <div className="relative h-96 md:h-[560px]">
                <img
                  src={portada.portada_imagen}
                  alt={portada.portada_titulo || `Portada ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20" />
              </div>
            </div>
          ))}
        </div>

        {portadas.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 group"
              aria-label="Imagen anterior"
            >
              <svg
                className="w-6 h-6 text-slate-900 transition-colors"
                style={{ color: colorPrimario }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.4}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 group"
              aria-label="Siguiente imagen"
            >
              <svg
                className="w-6 h-6 text-slate-900 transition-colors"
                style={{ color: colorPrimario }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.4}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 rounded-full bg-black/35 backdrop-blur-md border border-white/10">
              {portadas.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToImage(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? 'w-9'
                      : 'w-2.5 bg-white/50 hover:bg-white'
                  }`}
                  style={{
                    backgroundColor:
                      i === currentIndex ? colorSecundario : undefined,
                  }}
                  aria-label={`Ir a portada ${i + 1}`}
                />
              ))}
            </div>

            <div className="absolute top-5 right-5 bg-black/45 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-black border border-white/10">
              {currentIndex + 1} / {portadas.length}
            </div>

            <div
              key={currentIndex}
              className="absolute bottom-0 left-0 h-1"
              style={{
                background: `linear-gradient(90deg, ${colorPrimario}, ${colorSecundario})`,
                animation: isAutoPlaying ? 'progress 4s linear forwards' : 'none',
              }}
            />
          </>
        )}
      </div>

      {portadas.length > 1 && (
        <div className="flex justify-center gap-3 mt-7 overflow-x-auto pb-3 px-1">
          {portadas.map((portada, i) => (
            <button
              key={portada.portada_id || i}
              onClick={() => goToImage(i)}
              className={`relative flex-shrink-0 w-24 h-16 md:w-28 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                i === currentIndex
                  ? 'scale-105 shadow-lg opacity-100'
                  : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
              }`}
              style={{
                borderColor:
                  i === currentIndex ? colorSecundario : undefined,
              }}
              aria-label={`Seleccionar portada ${i + 1}`}
            >
              <img
                src={portada.portada_imagen}
                alt={`Miniatura ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />

              <div
                className={`absolute inset-0 transition-all duration-300 ${
                  i === currentIndex ? 'bg-black/0' : 'bg-black/25'
                }`}
              />
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }

          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  )
}