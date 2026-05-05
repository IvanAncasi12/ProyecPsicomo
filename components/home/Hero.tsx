'use client'

import { useState, useEffect, useMemo } from 'react'
import { apiClient } from '@/lib/axios'

export default function Hero() {
  const [portadas, setPortadas] = useState<any[]>([])
  const [currentPortadaIndex, setCurrentPortadaIndex] = useState(0)
  const [institucionData, setInstitucionData] = useState<any>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
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

    return `${cleanBase}/InstitucionUpea/${imageClean}`
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '11'

        const contenidoRes = await apiClient.get(`/institucion/${id}/contenido`)
        const portadasData = contenidoRes.data?.portada || []

        if (portadasData.length > 0) {
          setPortadas(
            portadasData.map((p: any) => ({
              ...p,
              portada_imagen: buildImageUrl(p.portada_imagen),
            }))
          )
        }

        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        setInstitucionData(principalRes.data?.Descripcion)

        setTimeout(() => setIsLoaded(true), 150)
      } catch (error) {
        console.warn('Error cargando datos del Hero', error)
        setIsLoaded(true)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (portadas.length <= 1) return

    const interval = setInterval(() => {
      setIsTransitioning(true)

      setTimeout(() => {
        setCurrentPortadaIndex((prev) => (prev + 1) % portadas.length)

        setTimeout(() => {
          setIsTransitioning(false)
        }, 700)
      }, 350)
    }, 7000)

    return () => clearInterval(interval)
  }, [portadas])

  const colores = institucionData?.colorinstitucion?.[0]
  const colorPrimario = colores?.color_primario || '#7A0C14'
  const colorSecundario = colores?.color_secundario || '#D4AF37'

  const nombreCarrera = institucionData?.institucion_nombre || 'Derecho'

  const logoServicioRaw =
    institucionData?.institucion_logo ||
    institucionData?.institucion_imagen ||
    institucionData?.institucion_logo_url ||
    institucionData?.institucion_escudo ||
    ''

  const logoServicio = buildImageUrl(logoServicioRaw)

  const changePortada = (index: number) => {
    setIsTransitioning(true)

    setTimeout(() => {
      setCurrentPortadaIndex(index)
      setTimeout(() => setIsTransitioning(false), 700)
    }, 300)
  }

  const letrasTitulo = useMemo(() => nombreCarrera.split(''), [nombreCarrera])

  return (
    <section
      id="inicio"
      className="relative min-h-[95vh] overflow-hidden bg-slate-950"
      style={
        {
          ['--color-primario' as any]: colorPrimario,
          ['--color-secundario' as any]: colorSecundario,
        }
      }
    >
       
      <div className="absolute inset-0 z-0">
        {portadas.map((portada, index) => (
          <div
            key={portada.portada_id || index}
            className={`absolute inset-0 transition-all duration-[1400ms] ease-in-out ${
              index === currentPortadaIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={portada.portada_imagen}
              alt={portada.portada_titulo || 'Portada'}
              className="w-full h-full object-cover animate-[slowZoom_18s_ease-in-out_infinite_alternate]"
              style={{ filter: 'brightness(0.84) contrast(1.06)' }}
            />
          </div>
        ))}
 
        <div
          className="absolute inset-0 z-20"
          style={{
            background: `
              linear-gradient(
                90deg,
                rgba(2, 6, 23, 0.88) 0%,
                rgba(15, 23, 42, 0.72) 26%,
                rgba(15, 23, 42, 0.46) 56%,
                rgba(15, 23, 42, 0.28) 100%
              )
            `,
          }}
        />
 
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 15% 24%, ${colorSecundario}22, transparent 22%),
              radial-gradient(circle at 80% 26%, ${colorPrimario}14, transparent 24%),
              radial-gradient(circle at 84% 74%, ${colorSecundario}10, transparent 18%)
            `,
          }}
        />
 
        <div
          className={`absolute inset-0 z-30 pointer-events-none transition-opacity duration-700 ${
            isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: `linear-gradient(135deg, ${colorPrimario}28, ${colorSecundario}18, ${colorPrimario}24)`,
            backdropFilter: 'blur(7px)',
          }}
        />
      </div>

      <div className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[95vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
          
          <div
            className={`relative transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            
            <div
              className="absolute -top-10 -left-12 md:-top-14 md:-left-14 w-56 h-56 md:w-80 md:h-80 rounded-full z-20 opacity-90 pointer-events-none"
              style={{
                background: `radial-gradient(circle, rgba(255,255,255,0.95) 0%, ${colorSecundario} 22%, rgba(255,218,120,0.58) 38%, transparent 72%)`,
                filter: 'blur(22px)',
              }}
            />
 
            <div
              className="absolute top-16 left-14 md:top-24 md:left-24 w-24 h-24 md:w-36 md:h-36 rounded-full z-20 opacity-80 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,245,210,0.70) 36%, transparent 80%)',
                filter: 'blur(10px)',
              }}
            />
 
            <div
              className="absolute -top-6 -left-6 md:-top-10 md:-left-10 w-[420px] h-[420px] md:w-[520px] md:h-[520px] z-20 pointer-events-none opacity-55"
              style={{
                background: `conic-gradient(
                  from 208deg,
                  transparent 0deg,
                  rgba(255,255,255,0.08) 16deg,
                  transparent 34deg,
                  rgba(255,255,255,0.04) 48deg,
                  transparent 72deg,
                  rgba(255,225,170,0.10) 96deg,
                  transparent 126deg,
                  rgba(255,255,255,0.06) 156deg,
                  transparent 212deg
                )`,
                filter: 'blur(10px)',
              }}
            />
 
            <span className="absolute top-24 left-36 w-2 h-2 rounded-full bg-white/80 z-20 animate-[sparkle_4s_ease-in-out_infinite]" />
            <span className="absolute top-36 left-24 w-3 h-3 rounded-full bg-yellow-200/70 z-20 animate-[sparkle_5.4s_ease-in-out_infinite]" />
            <span className="absolute top-44 left-56 w-2.5 h-2.5 rounded-full bg-white/70 z-20 animate-[sparkle_4.8s_ease-in-out_infinite]" />
            <span className="absolute top-20 left-64 w-1.5 h-1.5 rounded-full bg-yellow-100/80 z-20 animate-[sparkle_6s_ease-in-out_infinite]" />
 
            <img
              src="imagen1.png"
              alt="Carrera de Derecho"
              className="relative z-10 w-full max-w-[620px] mx-auto lg:mx-0 object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)] animate-[imageFloat_6.5s_ease-in-out_infinite]"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2000&auto=format&fit=crop'
              }}
            />
 
            <div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{
                background:
                  'linear-gradient(125deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 28%, transparent 54%)',
              }}
            />
          </div>
 
          <div
            className={`relative transition-all duration-1000 delay-150 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-md text-white/90 shadow-lg mb-6">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: colorSecundario }}
              />
              <span className="text-xs md:text-sm font-extrabold tracking-[0.20em] uppercase">
                Universidad Pública de El Alto
              </span>
            </div>

            <div className="mb-8">
              <span className="block text-white/90 text-lg md:text-xl font-extrabold uppercase tracking-[0.22em] mb-4">
                Carrera de
              </span>

              <h1 className="leading-[0.95] flex flex-wrap gap-x-[0.02em] gap-y-1">
                {letrasTitulo.map((letra, index) => (
                  <span
                    key={`${letra}-${index}`}
                    className={`hero-letter ${
                      letra === ' ' ? 'w-[0.35em]' : ''
                    } text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-black uppercase`}
                    style={{
                      animationDelay: `${index * 0.07}s`,
                    }}
                  >
                    {letra === ' ' ? '\u00A0' : letra}
                  </span>
                ))}
              </h1>
            </div>

            <p className="text-white/65 text-sm md:text-base font-semibold tracking-[0.18em] uppercase mb-10">
              Excelencia académica • formación jurídica • compromiso social
            </p>
 
            <div className="relative flex justify-start lg:justify-center mt-4 min-h-[320px]">
              
              <div
                className="absolute left-0 lg:left-1/2 lg:-translate-x-1/2 top-8 w-72 h-72 md:w-[26rem] md:h-[26rem] rounded-full blur-3xl opacity-50 animate-pulse pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${colorSecundario}50 0%, ${colorPrimario}24 48%, transparent 78%)`,
                }}
              />
 
              <div className="absolute left-0 lg:left-1/2 lg:-translate-x-1/2 top-5 w-[270px] h-[270px] md:w-[360px] md:h-[360px] rounded-full border border-white/15 animate-[spin_22s_linear_infinite]" />
              <div className="absolute left-[18px] lg:left-1/2 lg:-translate-x-1/2 top-[23px] w-[234px] h-[234px] md:w-[320px] md:h-[320px] rounded-full border border-white/10 animate-[spinReverse_16s_linear_infinite]" />
              <div className="absolute left-[36px] lg:left-1/2 lg:-translate-x-1/2 top-[41px] w-[198px] h-[198px] md:w-[280px] md:h-[280px] rounded-full border border-dashed border-white/10 animate-[spin_26s_linear_infinite]" />
 
              <span className="absolute top-8 right-10 lg:right-[22%] w-2.5 h-2.5 rounded-full bg-white/70 animate-[floatParticle_5s_ease-in-out_infinite]" />
              <span className="absolute bottom-10 left-8 lg:left-[20%] w-2 h-2 rounded-full bg-yellow-100/80 animate-[floatParticle_6.2s_ease-in-out_infinite]" />
              <span className="absolute top-20 left-8 lg:left-[18%] w-1.5 h-1.5 rounded-full bg-white/80 animate-[floatParticle_5.5s_ease-in-out_infinite]" />
              <span className="absolute right-10 bottom-16 lg:right-[18%] w-2 h-2 rounded-full bg-yellow-200/70 animate-[floatParticle_4.8s_ease-in-out_infinite]" />
 
              <div className="relative z-10 mt-10 w-[220px] h-[220px] md:w-[290px] md:h-[290px] rounded-full flex items-center justify-center animate-[logoFloat_4.5s_ease-in-out_infinite]">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(255,255,255,0.18), rgba(255,255,255,0.04), transparent 72%)',
                  }}
                />

                <div className="relative z-10 w-[72%] h-[72%] rounded-full bg-white/95 shadow-[0_24px_60px_rgba(0,0,0,0.32)] flex items-center justify-center p-5">
                  {logoServicio ? (
                    <img
                      src={logoServicio}
                      alt={`Logo ${nombreCarrera}`}
                      className="w-full h-full object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.22)]"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  ) : (
                    <div
                      className="w-full h-full rounded-full flex items-center justify-center text-white font-black text-4xl"
                      style={{
                        background: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                      }}
                    >
                      D
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      {portadas.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-50 px-4 py-2 rounded-full bg-black/25 backdrop-blur-md border border-white/10">
          {portadas.map((_, index) => (
            <button
              key={index}
              onClick={() => changePortada(index)}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === currentPortadaIndex
                  ? 'w-10'
                  : 'w-2 bg-white/45 hover:bg-white/80'
              }`}
              style={{
                backgroundColor:
                  index === currentPortadaIndex ? colorSecundario : undefined,
                boxShadow:
                  index === currentPortadaIndex
                    ? `0 0 18px ${colorSecundario}`
                    : undefined,
              }}
              aria-label={`Ver portada ${index + 1}`}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .hero-letter {
          display: inline-block;
          background: linear-gradient(
            135deg,
            #ffffff 0%,
            var(--color-secundario) 25%,
            #ffffff 50%,
            var(--color-primario) 100%
          );
          background-size: 220% 220%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.38));
          animation:
            letterRise 0.9s ease forwards,
            letterColorShift 4.8s ease-in-out infinite;
          opacity: 0;
          transform: translateY(32px) scale(0.92);
        }

        @keyframes slowZoom {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.08);
          }
        }

        @keyframes imageFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes letterRise {
          0% {
            opacity: 0;
            transform: translateY(32px) scale(0.92);
          }
          100% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
        }

        @keyframes letterColorShift {
          0% {
            background-position: 0% 50%;
            filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.38));
          }
          50% {
            background-position: 100% 50%;
            filter: drop-shadow(0 10px 24px rgba(255, 255, 255, 0.12))
              drop-shadow(0 0 18px rgba(212, 175, 55, 0.16));
          }
          100% {
            background-position: 0% 50%;
            filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.38));
          }
        }

        @keyframes spinReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes logoFloat {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.02);
          }
        }

        @keyframes sparkle {
          0%,
          100% {
            opacity: 0.25;
            transform: translateY(0px) scale(0.9);
          }
          50% {
            opacity: 1;
            transform: translateY(-8px) scale(1.15);
          }
        }

        @keyframes floatParticle {
          0%,
          100% {
            opacity: 0.35;
            transform: translateY(0px) translateX(0px);
          }
          50% {
            opacity: 1;
            transform: translateY(-10px) translateX(4px);
          }
        }
      `}</style>
    </section>
  )
}