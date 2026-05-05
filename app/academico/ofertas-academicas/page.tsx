'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import PageHero from '@/components/shared/PageHero'
import ZoomableImage from '@/components/ui/ZoomableImage'

export default function OfertasAcademicasPage() {
  const [ofertas, setOfertas] = useState<any[]>([])
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
      imageClean.startsWith('/InstitucionUpea')
    ) {
      const path = imageClean.startsWith('/') ? imageClean : `/${imageClean}`
      return `${cleanBase}${path}`
    }

    return `${cleanBase}/InstitucionUpea/Ofertas/${imageClean}`
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
    if (!date) return 'No especificado'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return 'No especificado'
    }

    return parsedDate.toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '11'

        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        setInstitucionData(principalRes.data?.Descripcion)

        const res = await apiClient.get(`/institucion/${id}/gacetaEventos`)
        const todasOfertas = res.data?.ofertasAcademicas || []

        const formatted = todasOfertas.map((oferta: any) => ({
          ...oferta,
          img_url: buildImageUrl(oferta.ofertas_imagen),
        }))

        setOfertas(formatted)
      } catch (error) {
        console.error('Error cargando ofertas académicas:', error)
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
      <PageHero titulo="Ofertas Académicas" />

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
              Formación y admisión
            </span>

            <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed mt-5">
              Programas académicos, procesos de admisión y oportunidades de
              formación orientadas al desarrollo profesional en el área jurídica.
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] animate-pulse"
                >
                  <div className="h-64 rounded-2xl bg-slate-200 mb-6" />
                  <div className="h-7 w-3/4 bg-slate-200 rounded mb-4" />
                  <div className="h-4 w-full bg-slate-100 rounded mb-2" />
                  <div className="h-4 w-2/3 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : ofertas.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-dashed border-slate-300 bg-white shadow-sm">
              <div className="text-5xl mb-4">🎓</div>

              <h3 className="text-2xl font-black text-slate-950 mb-2">
                No hay ofertas académicas disponibles
              </h3>

              <p className="text-slate-600 font-medium">
                Cuando se registren ofertas académicas en el servicio,
                aparecerán aquí automáticamente.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {ofertas.map((oferta, index) => {
                const titulo =
                  cleanValue(oferta.ofertas_titulo) ||
                  `Oferta Académica ${index + 1}`

                const descripcion =
                  cleanHtml(oferta.ofertas_descripcion) ||
                  'Sin descripción disponible.'

                const referencia = cleanValue(oferta.ofertas_referencia)

                const disponible = Number(oferta.ofertas_estado) === 1

                return (
                  <article
                    key={oferta.ofertas_id || index}
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

                    <div className="p-5 pb-0">
                      <div className="relative h-64 overflow-hidden rounded-[1.35rem] bg-slate-100">
                        {oferta.img_url ? (
                          <ZoomableImage
                            src={oferta.img_url}
                            alt={titulo}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-white text-4xl font-black"
                            style={{
                              background: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                            }}
                          >
                            Oferta
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />

                        <div className="absolute left-4 top-4">
                          <span
                            className="inline-flex px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-xs font-black uppercase tracking-[0.14em] shadow-sm"
                            style={{ color: colorPrimario }}
                          >
                            Oferta Académica
                          </span>
                        </div>

                        <div className="absolute right-4 top-4">
                          <span
                            className={`inline-flex px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.12em] shadow-sm ${
                              disponible
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-700 text-white'
                            }`}
                          >
                            {disponible ? 'Disponible' : 'Cerrado'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="relative p-6">
                      <h3 className="font-black text-2xl md:text-3xl text-slate-950 mb-3 leading-tight">
                        {titulo}
                      </h3>

                      <div
                        className="w-16 h-1 rounded-full mb-4"
                        style={{
                          background: `linear-gradient(90deg, ${colorPrimario}, ${colorSecundario})`,
                        }}
                      />

                      <p className="text-slate-600 text-sm leading-relaxed font-medium mb-5 line-clamp-3">
                        {descripcion}
                      </p>

                      <div className="space-y-3 rounded-2xl bg-slate-50 border border-slate-100 p-4 mb-6">
                        <InfoRow
                          icon="📅"
                          label="Inscripciones"
                          value={`${formatDate(
                            oferta.ofertas_inscripciones_ini
                          )} - ${formatDate(oferta.ofertas_inscripciones_fin)}`}
                        />

                        <InfoRow
                          icon="📝"
                          label="Fecha de examen"
                          value={formatDate(oferta.ofertas_fecha_examen)}
                        />

                        {referencia && (
                          <InfoRow
                            icon="📞"
                            label="Referencia"
                            value={referencia}
                          />
                        )}
                      </div>

                      {referencia ? (
                        <a
                          href={`tel:${referencia}`}
                          className="inline-flex w-full items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-white text-sm font-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                            boxShadow: `0 14px 28px ${colorPrimario}22`,
                          }}
                        >
                          <span>Solicitar información</span>
                          <span>→</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          className="inline-flex w-full items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-white text-sm font-black"
                          style={{
                            background: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                            boxShadow: `0 14px 28px ${colorPrimario}22`,
                          }}
                        >
                          Más información
                        </button>
                      )}
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