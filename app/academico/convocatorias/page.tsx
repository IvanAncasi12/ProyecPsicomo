'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import PageHero from '@/components/shared/PageHero'
import ZoomableImage from '@/components/ui/ZoomableImage'

export default function ConvocatoriasPage() {
  const [convocatorias, setConvocatorias] = useState<any[]>([])
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

    return `${cleanBase}/InstitucionUpea/Convocatorias/${imageClean}`
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

  function getEstado(fechaFin?: string | null) {
    if (!fechaFin) return 'Disponible'

    const hoy = new Date()
    const fin = new Date(fechaFin)

    if (Number.isNaN(fin.getTime())) return 'Disponible'

    return fin >= hoy ? 'Vigente' : 'Cerrada'
  }

  function esConvocatoria(item: any) {
    const tipoId = Number(item?.tipo_conv_comun?.idtipo_conv_comun)
    const tipoNombre = String(item?.tipo_conv_comun?.tipo_conv_comun_titulo || '')
      .trim()
      .toUpperCase()

    return tipoId === 5 || tipoNombre === 'CONVOCATORIAS'
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '11'

        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        setInstitucionData(principalRes.data?.Descripcion)

        const res = await apiClient.get(`/institucion/${id}/gacetaEventos`)
        const convs = res.data?.convocatorias || []

        const soloConvocatorias = convs.filter((convocatoria: any) =>
          esConvocatoria(convocatoria)
        )

        const formatted = soloConvocatorias.map((convocatoria: any) => ({
          ...convocatoria,
          img_url: buildImageUrl(convocatoria.con_foto_portada),
        }))

        setConvocatorias(formatted)
      } catch (error) {
        console.error('Error cargando convocatorias:', error)
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
      <PageHero titulo="Convocatorias" />

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

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Llamados oficiales
            </span>

            <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed mt-5">
              Convocatorias institucionales y oportunidades oficiales de interés
              para la comunidad universitaria.
            </p>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] animate-pulse"
                >
                  <div className="flex flex-col md:flex-row gap-5">
                    <div className="w-full md:w-56 h-48 rounded-2xl bg-slate-200 shrink-0" />

                    <div className="flex-1">
                      <div className="h-5 w-36 bg-slate-100 rounded-full mb-4" />
                      <div className="h-7 w-3/4 bg-slate-200 rounded mb-4" />
                      <div className="h-4 w-full bg-slate-100 rounded mb-2" />
                      <div className="h-4 w-2/3 bg-slate-100 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : convocatorias.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-dashed border-slate-300 bg-white shadow-sm">
              <div className="text-5xl mb-4">📢</div>

              <h3 className="text-2xl font-black text-slate-950 mb-2">
                No hay convocatorias activas
              </h3>

              <p className="text-slate-600 font-medium">
                Cuando se registren convocatorias en el servicio, aparecerán
                aquí automáticamente.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {convocatorias.map((convocatoria, index) => {
                const titulo =
                  cleanValue(convocatoria.con_titulo) ||
                  `Convocatoria ${index + 1}`

                const descripcion =
                  cleanHtml(convocatoria.con_descripcion) ||
                  'Sin descripción disponible.'

                const tipo =
                  cleanValue(
                    convocatoria.tipo_conv_comun?.tipo_conv_comun_titulo
                  ) || 'CONVOCATORIAS'

                const estado = getEstado(convocatoria.con_fecha_fin)
                const vigente = estado !== 'Cerrada'

                return (
                  <article
                    key={convocatoria.idconvocatorias || index}
                    className="group relative overflow-hidden rounded-[1.75rem] border bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_65px_rgba(15,23,42,0.13)]"
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

                    <div className="relative flex flex-col md:flex-row gap-5">
                      <div className="w-full md:w-60 h-56 md:h-48 shrink-0 overflow-hidden rounded-[1.35rem] bg-slate-100">
                        {convocatoria.img_url ? (
                          <ZoomableImage
                            src={convocatoria.img_url}
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
                            📢
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span
                            className="inline-flex px-4 py-1.5 rounded-full bg-white border text-xs font-black uppercase tracking-[0.14em] shadow-sm"
                            style={{
                              color: colorPrimario,
                              borderColor: `${colorSecundario}55`,
                            }}
                          >
                            {tipo}
                          </span>

                          <span
                            className={`inline-flex px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.12em] ${
                              vigente
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-700 text-white'
                            }`}
                          >
                            {estado}
                          </span>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-black text-slate-950 leading-tight mb-3">
                          {titulo}
                        </h3>

                        <div
                          className="w-16 h-1 rounded-full mb-4"
                          style={{
                            background: `linear-gradient(90deg, ${colorPrimario}, ${colorSecundario})`,
                          }}
                        />

                        <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium mb-5 line-clamp-3">
                          {descripcion}
                        </p>

                        <div className="grid sm:grid-cols-2 gap-3">
                          <InfoBox
                            icon="📅"
                            label="Inicio"
                            value={formatDate(convocatoria.con_fecha_inicio)}
                          />

                          <InfoBox
                            icon="🏁"
                            label="Finalización"
                            value={formatDate(convocatoria.con_fecha_fin)}
                          />
                        </div>
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

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: string
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
      <div className="flex items-start gap-3 text-sm">
        <span className="text-lg leading-none">{icon}</span>

        <div>
          <span className="block text-slate-950 font-black">{label}</span>
          <span className="text-slate-600 font-medium">{value}</span>
        </div>
      </div>
    </div>
  )
}