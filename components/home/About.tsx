'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'

export default function About() {
  const [mision, setMision] = useState('')
  const [vision, setVision] = useState('')
  const [video, setVideo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [institucionData, setInstitucionData] = useState<any>(null)

  function cleanHtml(text?: string | null) {
    if (!text) return ''

    return String(text)
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  function getVideoUrl(url?: string | null) {
    if (!url) return ''

    const cleanUrl = String(url).trim()

    if (cleanUrl.includes('watch?v=')) {
      const videoId = cleanUrl.split('watch?v=')[1]?.split('&')[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : cleanUrl
    }

    if (cleanUrl.includes('youtu.be/')) {
      const videoId = cleanUrl.split('youtu.be/')[1]?.split('?')[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : cleanUrl
    }

    return cleanUrl
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '11'

        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        const data = principalRes.data?.Descripcion

        setInstitucionData(data)

        if (data) {
          setMision(data.institucion_mision || '')
          setVision(data.institucion_vision || '')
        }

        const contenidoRes = await apiClient.get(`/institucion/${id}/contenido`)
        const videos = contenidoRes.data?.upea_videos || []

        if (videos.length > 0) {
          setVideo(videos[0])
        }
      } catch (error) {
        console.warn('Error cargando datos del About', error)
        setMision(
          '<p>Formación integral de profesionales con excelencia académica, ética y compromiso social.</p>'
        )
        setVision(
          '<p>Ser una carrera referente en educación superior, investigación y servicio a la sociedad.</p>'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const colores = institucionData?.colorinstitucion?.[0]
  const colorPrimario = colores?.color_primario || '#7A0C14'
  const colorSecundario = colores?.color_secundario || '#D4AF37'

  const nombreCarrera = institucionData?.institucion_nombre || 'Derecho'

  const videoUrl = getVideoUrl(video?.video_enlace || video?.video_url)

  const cards = [
    {
      title: 'Misión',
      label: 'Propósito institucional',
      icon: '⚖️',
      text: cleanHtml(mision) || 'Cargando misión institucional...',
      color: colorPrimario,
    },
    {
      title: 'Visión',
      label: 'Proyección académica',
      icon: '🏛️',
      text: cleanHtml(vision) || 'Cargando visión institucional...',
      color: colorSecundario,
    },
  ]

  const stats = [
    {
      number: '25+',
      title: 'Años de trayectoria',
      subtitle: 'Formando profesionales con vocación de servicio',
    },
    {
      number: '3,500+',
      title: 'Egresados exitosos',
      subtitle: 'Líderes en el ámbito jurídico y social',
    },
    {
      number: '1,200+',
      title: 'Estudiantes activos',
      subtitle: 'Construyendo su futuro profesional',
    },
  ]

  return (
    <section
      id="acerca"
      className="relative overflow-hidden py-24 bg-white"
    >
      
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 12% 18%, ${colorSecundario}18, transparent 26%),
            radial-gradient(circle at 88% 80%, ${colorPrimario}12, transparent 28%),
            linear-gradient(180deg, #ffffff 0%, #f8fafc 52%, #ffffff 100%)
          `,
        }}
      />

      <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[linear-gradient(90deg,#020617_1px,transparent_1px),linear-gradient(180deg,#020617_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full border shadow-sm mb-5 bg-white"
            style={{
              borderColor: `${colorSecundario}55`,
              color: colorPrimario,
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: colorSecundario }}
            />

            <span className="text-xs md:text-sm font-extrabold tracking-[0.22em] uppercase">
              Nuestra identidad
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-slate-950 mb-5 tracking-tight">
            Nuestra Carrera
          </h2>

          <div
            className="w-28 h-1.5 mx-auto rounded-full mb-5"
            style={{
              background: `linear-gradient(90deg, ${colorPrimario}, ${colorSecundario}, ${colorPrimario})`,
              boxShadow: `0 0 22px ${colorSecundario}55`,
            }}
          />

          <p className="text-base md:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
            {nombreCarrera} forma profesionales con excelencia académica,
            compromiso social y sólidos principios institucionales.
          </p>
        </div>
 
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {cards.map((card) => (
            <article
              key={card.title}
              className="group relative overflow-hidden rounded-[2rem] border bg-white p-8 md:p-9 shadow-[0_18px_50px_rgba(15,23,42,0.10)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(15,23,42,0.16)]"
              style={{
                borderColor: `${card.color}24`,
              }}
            >
              <div
                className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${card.color}65, transparent 70%)`,
                }}
              />

              <div
                className="absolute left-0 top-0 h-full w-1.5"
                style={{
                  background: `linear-gradient(180deg, ${card.color}, ${colorSecundario})`,
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${card.color}, ${colorSecundario})`,
                    }}
                  >
                    {card.icon}
                  </div>

                  <div>
                    <span
                      className="text-xs font-extrabold uppercase tracking-[0.18em]"
                      style={{ color: card.color }}
                    >
                      {card.label}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-950 leading-tight">
                      {card.title}
                    </h3>
                  </div>
                </div>

                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 w-full bg-slate-200 rounded" />
                    <div className="h-4 w-11/12 bg-slate-200 rounded" />
                    <div className="h-4 w-4/5 bg-slate-200 rounded" />
                  </div>
                ) : (
                  <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                    {card.text}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
 
        <div className="mb-20">
          <div className="text-center mb-9">
            <span
              className="text-xs md:text-sm font-extrabold uppercase tracking-[0.22em]"
              style={{ color: colorPrimario }}
            >
              Video institucional
            </span>

            <h3 className="text-3xl md:text-5xl font-black text-slate-950 mt-3 mb-4">
              Conoce la Carrera
            </h3>

            <div
              className="w-20 h-1.5 mx-auto rounded-full"
              style={{
                background: `linear-gradient(90deg, ${colorPrimario}, ${colorSecundario})`,
              }}
            />
          </div>

          <div
            className="relative rounded-[2rem] p-2 shadow-[0_24px_70px_rgba(15,23,42,0.16)]"
            style={{
              background: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
            }}
          >
            <div className="relative overflow-hidden rounded-[1.55rem] bg-slate-950 aspect-video">
              {videoUrl ? (
                <iframe
                  src={videoUrl}
                  title={video?.video_titulo || 'Video Institucional'}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center px-6">
                    <div className="text-6xl mb-4">🎥</div>
                    <p className="text-xl md:text-2xl font-black">
                      Video institucional próximamente
                    </p>
                    <p className="text-white/60 mt-2">
                      Muy pronto podrás conocer más sobre nuestra carrera.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
 
        <div
          className="grid md:grid-cols-3 gap-8 pt-16 border-t"
          style={{ borderColor: `${colorPrimario}24` }}
        >
          {stats.map((stat) => (
            <article
              key={stat.title}
              className="group relative overflow-hidden text-center p-7 rounded-[1.75rem] bg-white border shadow-[0_16px_45px_rgba(15,23,42,0.08)] hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)] transition-all duration-500"
              style={{
                borderColor: `${colorSecundario}33`,
              }}
            >
              <div
                className="absolute -top-20 left-1/2 -translate-x-1/2 w-52 h-52 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle, ${colorSecundario}75, transparent 70%)`,
                }}
              />

              <div
                className="relative text-5xl md:text-6xl font-black mb-4 transition-transform group-hover:scale-110"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.number}
              </div>

              <p className="relative text-slate-950 font-black text-lg mb-1">
                {stat.title}
              </p>

              <p className="relative text-sm text-slate-500 font-medium">
                {stat.subtitle}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}