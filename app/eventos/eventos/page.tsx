'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import PageHero from '@/components/shared/PageHero'
import ZoomableImage from '@/components/ui/ZoomableImage'

export default function EventosListPage() {
  const [eventos, setEventos] = useState<any[]>([])
  const [institucionData, setInstitucionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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
      imageClean.startsWith('/InstitucionUpea') ||
      imageClean.startsWith('storage') ||
      imageClean.startsWith('/storage')
    ) {
      const path = imageClean.startsWith('/') ? imageClean : `/${imageClean}`
      return `${cleanBase}${path}`
    }

    return `${cleanBase}/InstitucionUpea/Eventos/${imageClean}`
  }

  function cleanHtml(text?: string | null) {
    if (!text) return ''

    return String(text)
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  function cleanValue(value?: string | null) {
    if (!value) return ''

    const clean = String(value).trim()

    return clean === '_' ? '' : clean
  }

  function formatDate(date?: string | null) {
    if (!date) return 'Por definir'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Por definir'
    }

    return parsedDate.toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  function formatTime(time?: string | null) {
    if (!time) return 'Por definir'

    const clean = String(time).trim()

    if (!clean || clean === '_') return 'Por definir'

    return clean.slice(0, 5)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '11'

        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        setInstitucionData(principalRes.data?.Descripcion)

        const res = await apiClient.get(`/institucion/${id}/gacetaEventos`)
        const todosEventos = res.data?.upea_evento || []

        const formatted = todosEventos.map((evento: any) => ({
          ...evento,
          img_url: buildImageUrl(evento.evento_imagen),
        }))

        setEventos(formatted)
      } catch (error) {
        console.error('Error cargando eventos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const colores = institucionData?.colorinstitucion?.[0]
  const colorPrimario = colores?.color_primario || '#7A0C14'
  const colorSecundario = colores?.color_secundario || '#D4AF37'

  return (
    <main className="bg-white">
      <PageHero titulo="Eventos" />

      <section className="relative overflow-hidden py-16 md:py-20 bg-white">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 12% 16%, ${colorSecundario}10, transparent 28%),
              radial-gradient(circle at 90% 82%, ${colorPrimario}08, transparent 30%),
              linear-gradient(180deg, #ffffff 0%, #f8fafc 55%, #ffffff 100%)
            `,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full border bg-white text-xs md:text-sm font-black tracking-[0.18em] uppercase shadow-sm"
              style={{
                borderColor: `${colorSecundario}55`,
                color: colorPrimario,
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: colorSecundario }}
              />
              Actividades institucionales
            </span>

            <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed mt-5">
              Eventos académicos, culturales e institucionales organizados para
              fortalecer la participación de la comunidad universitaria.
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] animate-pulse"
                >
                  <div className="h-56 rounded-2xl bg-slate-200 mb-6" />
                  <div className="h-6 w-3/4 bg-slate-200 rounded mb-4" />
                  <div className="h-4 w-full bg-slate-100 rounded mb-2" />
                  <div className="h-4 w-2/3 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : eventos.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-dashed border-slate-300 bg-white shadow-sm">
              <div className="text-5xl mb-4">📅</div>

              <h3 className="text-2xl font-black text-slate-950 mb-2">
                No hay eventos programados
              </h3>

              <p className="text-slate-600 font-medium">
                Cuando se registren eventos en el servicio, aparecerán aquí
                automáticamente.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventos.map((evento, index) => {
                const titulo =
                  cleanValue(evento.evento_titulo) || `Evento ${index + 1}`

                const descripcion =
                  cleanHtml(evento.evento_descripcion) ||
                  'Sin descripción disponible.'

                const lugar = cleanValue(evento.evento_lugar) || 'Por definir'
                const tipo = cleanValue(evento.tipo_evento) || 'Evento'

                return (
                  <article
                    key={evento.evento_id || index}
                    className="group relative overflow-hidden rounded-[1.75rem] border bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_65px_rgba(15,23,42,0.13)]"
                    style={{
                      borderColor: `${colorPrimario}20`,
                    }}
                  >
                    <div
                      className="absolute left-0 top-0 h-full w-1"
                      style={{
                        background: `linear-gradient(180deg, ${colorPrimario}, ${colorSecundario})`,
                      }}
                    />

                    <div
                      className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-0 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle, ${colorSecundario}80, transparent 70%)`,
                      }}
                    />

                    <div className="p-5 pb-0">
                      <div className="relative h-56 overflow-hidden rounded-[1.35rem] bg-slate-100">
                        {evento.img_url ? (
                          <ZoomableImage
                            src={evento.img_url}
                            alt={titulo}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-white text-5xl font-black"
                            style={{
                              background: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                            }}
                          >
                            📅
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />

                        <div className="absolute left-4 top-4">
                          <span
                            className="inline-flex px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-xs font-black uppercase tracking-[0.14em] shadow-sm"
                            style={{ color: colorPrimario }}
                          >
                            {tipo}
                          </span>
                        </div>

                        <div className="absolute right-4 bottom-4">
                          <span
                            className="inline-flex px-4 py-2 rounded-full text-white text-xs font-black uppercase tracking-[0.12em] shadow-lg"
                            style={{
                              background: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                            }}
                          >
                            Evento
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="relative p-6">
                      <h3 className="font-black text-xl md:text-2xl text-slate-950 mb-3 leading-tight">
                        {titulo}
                      </h3>

                      <div
                        className="w-14 h-1 rounded-full mb-4"
                        style={{
                          background: `linear-gradient(90deg, ${colorPrimario}, ${colorSecundario})`,
                        }}
                      />

                      <p className="text-slate-600 text-sm leading-relaxed font-medium mb-5 line-clamp-3">
                        {descripcion}
                      </p>

                      <div className="space-y-3 rounded-2xl bg-slate-50 border border-slate-100 p-4">
                        <InfoRow
                          icon="📅"
                          label="Fecha"
                          value={formatDate(evento.evento_fecha)}
                        />

                        <InfoRow
                          icon="⏰"
                          label="Hora"
                          value={formatTime(evento.evento_hora)}
                        />

                        <InfoRow
                          icon="📍"
                          label="Lugar"
                          value={lugar}
                        />
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="text-lg leading-none">{icon}</span>

      <div>
        <span className="block text-slate-950 font-black">{label}</span>
        <span className="text-slate-600 font-medium">{value}</span>
      </div>
    </div>
  )
}