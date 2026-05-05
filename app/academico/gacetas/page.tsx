'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import PageHero from '@/components/shared/PageHero'

export default function GacetasPage() {
  const [gacetas, setGacetas] = useState<any[]>([])
  const [institucionData, setInstitucionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'

  function buildFileUrl(file?: string | null) {
    if (!file) return ''

    const fileClean = String(file).trim()

    if (!fileClean) return ''

    if (fileClean.startsWith('http')) {
      return fileClean
    }

    const cleanBase = baseUrl.replace(/\/$/, '')

    if (
      fileClean.includes('/') ||
      fileClean.startsWith('InstitucionUpea') ||
      fileClean.startsWith('/InstitucionUpea')
    ) {
      const path = fileClean.startsWith('/') ? fileClean : `/${fileClean}`
      return `${cleanBase}${path}`
    }

    return `${cleanBase}/InstitucionUpea/Gaceta/${fileClean}`
  }

  function cleanValue(value?: string | null) {
    if (!value) return ''

    const clean = String(value).trim()

    return clean === '_' ? '' : clean
  }

  function formatDate(date?: string | null) {
    if (!date) return 'Fecha no definida'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Fecha no definida'
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
        const gacs = res.data?.upea_gaceta_universitaria || []

        const formatted = gacs.map((gaceta: any) => ({
          ...gaceta,
          doc_url: buildFileUrl(gaceta.gaceta_documento),
        }))

        setGacetas(formatted)
      } catch (error) {
        console.error('Error cargando gacetas:', error)
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
      <PageHero titulo="Gaceta Universitaria" />

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

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
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
              Documentos institucionales
            </span>

            <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed mt-5">
              Publicaciones oficiales, disposiciones, comunicados normativos y
              documentos académicos de interés institucional.
            </p>
          </div>

          {loading ? (
            <div className="space-y-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] animate-pulse"
                >
                  <div className="flex gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-slate-200 shrink-0" />
                    <div className="flex-1">
                      <div className="h-6 w-3/4 bg-slate-200 rounded mb-3" />
                      <div className="h-4 w-1/2 bg-slate-100 rounded mb-3" />
                      <div className="h-4 w-32 bg-slate-100 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : gacetas.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-dashed border-slate-300 bg-white shadow-sm">
              <div className="text-5xl mb-4">📰</div>

              <h3 className="text-2xl font-black text-slate-950 mb-2">
                No hay gacetas publicadas
              </h3>

              <p className="text-slate-600 font-medium">
                Cuando se registren gacetas universitarias en el servicio,
                aparecerán aquí automáticamente.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {gacetas.map((gaceta, index) => {
                const tipo = cleanValue(gaceta.gaceta_tipo) || 'Gaceta'
                const titulo =
                  cleanValue(gaceta.gaceta_titulo) ||
                  `Gaceta Universitaria ${index + 1}`

                return (
                  <article
                    key={gaceta.gaceta_id || index}
                    className="group relative overflow-hidden rounded-3xl border bg-white p-5 md:p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_65px_rgba(15,23,42,0.13)]"
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
                      className="absolute -top-24 -right-24 w-56 h-56 rounded-full blur-3xl opacity-0 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle, ${colorSecundario}80, transparent 70%)`,
                      }}
                    />

                    <div className="relative flex flex-col md:flex-row md:items-center gap-5">
                      <div
                        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-sm"
                        style={{
                          background: `${colorPrimario}12`,
                          color: colorPrimario,
                        }}
                      >
                        🧾
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span
                            className="inline-flex px-3 py-1 rounded-full text-xs font-black uppercase tracking-[0.14em] border bg-white"
                            style={{
                              color: colorPrimario,
                              borderColor: `${colorSecundario}55`,
                            }}
                          >
                            {tipo}
                          </span>

                          <span className="text-sm text-slate-500 font-bold">
                            📅 {formatDate(gaceta.gaceta_fecha)}
                          </span>
                        </div>

                        <h3 className="text-xl md:text-2xl font-black text-slate-950 leading-tight">
                          {titulo}
                        </h3>

                        <p className="text-slate-500 text-sm font-medium mt-2">
                          Documento oficial disponible para consulta y descarga.
                        </p>
                      </div>

                      <div className="md:ml-auto">
                        {gaceta.doc_url ? (
                          <a
                            href={gaceta.doc_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-5 py-3 rounded-2xl text-white text-sm font-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            style={{
                              background: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                              boxShadow: `0 14px 28px ${colorPrimario}22`,
                            }}
                          >
                            <span>📥</span>
                            <span>Descargar PDF</span>
                          </a>
                        ) : (
                          <span className="inline-flex items-center justify-center w-full md:w-auto px-5 py-3 rounded-2xl bg-slate-100 text-slate-500 text-sm font-black">
                            Sin documento
                          </span>
                        )}
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